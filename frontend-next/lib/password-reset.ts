import 'server-only';

import { createHash, pbkdf2Sync, randomBytes } from 'node:crypto';

import nodemailer from 'nodemailer';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.AUTH_DB_HOST || 'localhost',
  port: Number(process.env.AUTH_DB_PORT || 5432),
  database: process.env.AUTH_DB_NAME || 'multisoft_informes',
  user: process.env.AUTH_DB_USER || 'postgres',
  password: process.env.AUTH_DB_PASSWORD || 'postgres',
});

const DEFAULT_PUBLIC_APP_URL = 'http://10.0.0.22:3001';

type PasswordResetUser = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
};

type EmailConfigRow = {
  enabled: boolean;
  host: string;
  port: number;
  from_name: string;
  from_email: string;
  reply_to_name: string;
  reply_to_email: string;
  envelope_from: string;
  use_ssl: boolean;
  use_tls: boolean;
  use_auth: boolean;
  username: string;
  password: string;
};

type ResetTokenRow = {
  user_id: number;
  username: string;
  email: string;
};

function fullName(user: PasswordResetUser) {
  return [user.first_name, user.last_name].map((item) => String(item || '').trim()).filter(Boolean).join(' ') || user.username;
}

function hashToken(rawToken: string) {
  return createHash('sha256').update(rawToken).digest('hex');
}

function encodePbkdf2Sha256(rawPassword: string) {
  const iterations = 720000;
  const salt = randomBytes(12).toString('base64url');
  const digest = pbkdf2Sync(rawPassword, salt, iterations, 32, 'sha256').toString('base64');
  return `pbkdf2_sha256$${iterations}$${salt}$${digest}`;
}

function resolvePublicBaseUrl(origin: string) {
  const configured =
    process.env.RESET_PASSWORD_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_BASE_URL ||
    '';

  const candidate = String(configured || origin || DEFAULT_PUBLIC_APP_URL).trim();
  const safeUrl = candidate.startsWith('http://') || candidate.startsWith('https://')
    ? candidate
    : DEFAULT_PUBLIC_APP_URL;

  return safeUrl.replace(/\/$/, '');
}

async function ensurePasswordResetTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS custom_permissions_password_reset_token (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
      token_hash VARCHAR(128) NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_password_reset_token_user
    ON custom_permissions_password_reset_token (user_id, created_at DESC)
  `);
}

async function loadEmailConfig() {
  const result = await pool.query<EmailConfigRow>(`
    SELECT enabled, host, port, from_name, from_email, reply_to_name, reply_to_email,
           envelope_from, use_ssl, use_tls, use_auth, username, password
    FROM custom_permissions_emailconfig
    ORDER BY id
    LIMIT 1
  `);

  return result.rows[0] || null;
}

async function findUserByIdentity(identity: string) {
  const normalized = String(identity || '').trim().toLowerCase();
  if (!normalized) return null;

  const result = await pool.query<PasswordResetUser>(
    `
      SELECT id, username, first_name, last_name, email, is_active
      FROM auth_user
      WHERE is_active = TRUE
        AND (
          LOWER(username) = $1
          OR LOWER(email) = $1
        )
      LIMIT 1
    `,
    [normalized],
  );

  return result.rows[0] || null;
}

export async function requestPasswordReset(identity: string, origin: string) {
  await ensurePasswordResetTable();

  const user = await findUserByIdentity(identity);
  if (!user || !String(user.email || '').trim()) {
    return { ok: true };
  }

  const emailConfig = await loadEmailConfig();
  if (!emailConfig?.enabled || !emailConfig.host || (!emailConfig.from_email && !emailConfig.username)) {
    throw new Error('La configuración de email no está lista para enviar recuperaciones de contraseña.');
  }

  const rawToken = randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(
      `
        UPDATE custom_permissions_password_reset_token
        SET used_at = NOW()
        WHERE user_id = $1
          AND used_at IS NULL
      `,
      [user.id],
    );
    await client.query(
      `
        INSERT INTO custom_permissions_password_reset_token (user_id, token_hash, expires_at)
        VALUES ($1, $2, NOW() + INTERVAL '60 minutes')
      `,
      [user.id, tokenHash],
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  const baseUrl = resolvePublicBaseUrl(origin);
  const resetUrl = `${baseUrl}/password-reset/confirm?token=${encodeURIComponent(rawToken)}`;
  const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: Number(emailConfig.port || 25),
    secure: Boolean(emailConfig.use_ssl),
    requireTLS: Boolean(emailConfig.use_tls),
    auth: emailConfig.use_auth
      ? {
          user: emailConfig.username,
          pass: emailConfig.password,
        }
      : undefined,
  });

  const displayName = fullName(user);
  const subject = 'Recuperación de contraseña - MultiSoft';
  const fromEmail = emailConfig.from_email || emailConfig.username;
  const fromName = String(emailConfig.from_name || 'MultiSoft').trim() || 'MultiSoft';

  const text =
    `Hola ${displayName},\n\n` +
    'Recibimos una solicitud para restablecer tu contraseña en MultiSoft.\n\n' +
    `Usuario: ${user.username}\n` +
    `Enlace de recuperación: ${resetUrl}\n\n` +
    'Este enlace vence en 60 minutos.\n' +
    'Si no solicitaste este cambio, puedes ignorar este mensaje.\n';

  const html =
    '<!DOCTYPE html>' +
    '<html lang="es">' +
    '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
    '<body style="margin:0;padding:0;background:#eef2f7;font-family:Segoe UI,Arial,sans-serif;color:#0f172a;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f7;padding:32px 16px;">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 45px rgba(15,23,42,0.12);">' +
    '<tr><td style="padding:28px 32px;background:linear-gradient(135deg,#071122 0%,#0c1730 48%,#0b1430 100%);">' +
    '<div style="display:inline-block;padding:8px 16px;border-radius:999px;border:1px solid rgba(34,211,238,0.28);background:rgba(34,211,238,0.08);font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:#67e8f9;">MULTISOFT</div>' +
    '<h1 style="margin:18px 0 8px 0;font-size:34px;line-height:1.1;color:#ffffff;">Recuperación de contraseña</h1>' +
    '<p style="margin:0;font-size:15px;line-height:1.8;color:#cbd5e1;">Tu acceso al panel gerencial puede restablecerse de forma segura desde este enlace.</p>' +
    '</td></tr>' +
    '<tr><td style="padding:32px;">' +
    `<p style="margin:0 0 16px 0;font-size:16px;line-height:1.8;">Hola <strong>${displayName}</strong>,</p>` +
    '<p style="margin:0 0 14px 0;font-size:15px;line-height:1.8;color:#334155;">Recibimos una solicitud para restablecer tu contraseña en <strong>MultiSoft</strong>.</p>' +
    `<div style="margin:0 0 18px 0;padding:16px 18px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;"><div style="font-size:12px;text-transform:uppercase;letter-spacing:0.18em;color:#0891b2;font-weight:700;margin-bottom:6px;">Usuario</div><div style="font-size:16px;font-weight:700;color:#0f172a;">${user.username}</div></div>` +
    `<div style="margin:24px 0 24px 0;"><a href="${resetUrl}" style="display:inline-block;padding:14px 22px;background:#050b23;color:#ffffff;text-decoration:none;border-radius:14px;font-size:15px;font-weight:700;">Restablecer contraseña</a></div>` +
    '<p style="margin:0 0 12px 0;font-size:14px;line-height:1.7;color:#475569;"><strong>Importante:</strong> este enlace vence en 60 minutos.</p>' +
    '<p style="margin:0 0 10px 0;font-size:14px;line-height:1.7;color:#475569;">Si el botón no se muestra correctamente en tu correo, copia y pega este enlace en tu navegador:</p>' +
    `<div style="margin:0 0 20px 0;padding:14px 16px;border-radius:14px;background:#f8fafc;border:1px dashed #cbd5e1;word-break:break-all;font-size:13px;line-height:1.7;color:#0f172a;"><a href="${resetUrl}" style="color:#0f766e;text-decoration:none;">${resetUrl}</a></div>` +
    '<p style="margin:0;font-size:14px;line-height:1.8;color:#64748b;">Si no solicitaste este cambio, puedes ignorar este mensaje. Tu contraseña actual seguirá funcionando hasta que completes el proceso.</p>' +
    '</td></tr>' +
    '<tr><td style="padding:20px 32px;border-top:1px solid #e2e8f0;background:#f8fafc;">' +
    `<p style="margin:0;font-size:12px;line-height:1.8;color:#64748b;">Enviado por ${fromName}. Este correo fue generado automáticamente desde la plataforma MultiSoft.</p>` +
    '</td></tr>' +
    '</table>' +
    '</td></tr>' +
    '</table>' +
    '</body></html>';

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: user.email,
    subject,
    text,
    html,
    replyTo: emailConfig.reply_to_email || undefined,
    envelope: emailConfig.envelope_from
      ? {
          from: emailConfig.envelope_from,
          to: user.email,
        }
      : undefined,
  });

  return { ok: true };
}

export async function inspectPasswordResetToken(token: string) {
  await ensurePasswordResetTable();

  const normalized = String(token || '').trim();
  if (!normalized) {
    return { valid: false as const, username: '' };
  }

  const result = await pool.query<ResetTokenRow>(
    `
      SELECT t.user_id, u.username, u.email
      FROM custom_permissions_password_reset_token t
      INNER JOIN auth_user u ON u.id = t.user_id
      WHERE t.token_hash = $1
        AND t.used_at IS NULL
        AND t.expires_at > NOW()
        AND u.is_active = TRUE
      LIMIT 1
    `,
    [hashToken(normalized)],
  );

  const row = result.rows[0];
  if (!row) {
    return { valid: false as const, username: '' };
  }

  return {
    valid: true as const,
    username: String(row.username || ''),
    email: String(row.email || ''),
  };
}

export async function consumePasswordResetToken(token: string, nextPassword: string) {
  await ensurePasswordResetTable();

  const normalizedToken = String(token || '').trim();
  const normalizedPassword = String(nextPassword || '');

  if (!normalizedToken) {
    throw new Error('El enlace de recuperación no es válido.');
  }

  if (normalizedPassword.length < 8) {
    throw new Error('La nueva contraseña debe tener al menos 8 caracteres.');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const tokenResult = await client.query<ResetTokenRow>(
      `
        SELECT t.user_id, u.username, u.email
        FROM custom_permissions_password_reset_token t
        INNER JOIN auth_user u ON u.id = t.user_id
        WHERE t.token_hash = $1
          AND t.used_at IS NULL
          AND t.expires_at > NOW()
          AND u.is_active = TRUE
        LIMIT 1
        FOR UPDATE
      `,
      [hashToken(normalizedToken)],
    );

    const tokenRow = tokenResult.rows[0];
    if (!tokenRow) {
      throw new Error('El enlace de recuperación ya no está disponible o venció.');
    }

    await client.query(
      `
        UPDATE auth_user
        SET password = $2
        WHERE id = $1
      `,
      [tokenRow.user_id, encodePbkdf2Sha256(normalizedPassword)],
    );

    await client.query(
      `
        UPDATE custom_permissions_password_reset_token
        SET used_at = NOW()
        WHERE user_id = $1
          AND used_at IS NULL
      `,
      [tokenRow.user_id],
    );

    await client.query('COMMIT');

    return {
      ok: true as const,
      username: String(tokenRow.username || ''),
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

import { Pool } from 'pg';
import nodemailer from 'nodemailer';
import { inflateSync } from 'node:zlib';
import { pbkdf2Sync, randomBytes } from 'node:crypto';

const pool = new Pool({
  host: process.env.AUTH_DB_HOST || 'localhost',
  port: Number(process.env.AUTH_DB_PORT || 5432),
  database: process.env.AUTH_DB_NAME || 'multisoft_informes',
  user: process.env.AUTH_DB_USER || 'postgres',
  password: process.env.AUTH_DB_PASSWORD || 'postgres',
});

const NODE_API_BASE = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:3000/api/v1';
const DEFAULT_GROUPS = ['Admin', 'Finanzas', 'Ventas', 'Compras', 'Stock', 'Migraciones', 'Configuracion'];

export type DbType = 'postgres' | 'integrado' | 'sueldo';
export type DbEngine = 'postgres' | 'sqlanywhere';

export type EngineProfile = {
  host: string;
  port: number;
  server: string;
  database: string;
  username: string;
  password: string;
};

export type DbConfigRecord = {
  dbType: DbType;
  dbEngine: DbEngine;
  disabled: boolean;
  updatedAt: string | null;
  activeProfile: EngineProfile;
  engineSettings: Record<DbEngine, EngineProfile>;
  status?: {
    enabled?: boolean;
    reason?: string;
    engine?: string;
    configured_engine?: string;
  } | null;
};

export type EmailConfigRecord = {
  enabled: boolean;
  host: string;
  port: number;
  fromName: string;
  fromEmail: string;
  replyToName: string;
  replyToEmail: string;
  envelopeFrom: string;
  useSsl: boolean;
  useTls: boolean;
  useAuth: boolean;
  username: string;
  password: string;
  updatedAt: string | null;
};

export type BrandingConfigRecord = {
  empresa: string;
  scope: 'global' | 'empresa';
  clientName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  updatedAt: string | null;
};

export type AdminUserRecord = {
  id: number;
  username: string;
  displayName: string;
  isActive: boolean;
};

export type CompanyAccessOption = {
  key: string;
  empresa: string;
  label: string;
  db: 'Integrado' | 'Sueldo';
};

export type UserCompanyAssignment = {
  empresa: string;
  db: 'Integrado' | 'Sueldo';
};

export type ActiveSessionRecord = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  sessions: number;
  expires: string | null;
  lastActivity: string;
  ipAddress: string;
  userAgent: string;
};

export type AdminGroupRecord = {
  id: number;
  name: string;
};

export type AdminGroupDetail = {
  id: number;
  name: string;
  userCount: number;
  permissionsCount: number;
};

export type AdminUserDetail = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isSuperuser: boolean;
  isStaff: boolean;
  dateJoined: string | null;
  groups: number[];
};

export type NextSessionInput = {
  sessionKey: string;
  userId: number;
  ipAddress?: string;
  userAgent?: string;
  expiresAt?: Date;
};

function defaultPort(engine: DbEngine) {
  return engine === 'postgres' ? 5432 : 2638;
}

function emptyProfile(engine: DbEngine): EngineProfile {
  return {
    host: '',
    port: defaultPort(engine),
    server: '',
    database: '',
    username: '',
    password: '',
  };
}

function normalizeEngine(raw: unknown, dbType: DbType): DbEngine {
  if (dbType === 'postgres') return 'postgres';
  return raw === 'postgres' ? 'postgres' : 'sqlanywhere';
}

function normalizeProfile(value: unknown, engine: DbEngine): EngineProfile {
  const row = (value || {}) as Record<string, unknown>;
  return {
    host: String(row.host || ''),
    port: Number(row.port || defaultPort(engine)),
    server: String(row.server || ''),
    database: String(row.database || ''),
    username: String(row.username || ''),
    password: String(row.password || ''),
  };
}

async function fetchNodeJson(path: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  const response = await fetch(`${NODE_API_BASE}${path}`, {
    ...init,
    signal: init?.signal || controller.signal,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  }).finally(() => clearTimeout(timeout));

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: response.ok, status: response.status, data };
}

async function ensureNextSessionTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS custom_permissions_nextsession (
      session_key VARCHAR(128) PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
      ip_address VARCHAR(64) NOT NULL DEFAULT '',
      user_agent TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL
    )
  `);
}

async function ensureBrandingConfigTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS custom_permissions_brandconfig (
      empresa VARCHAR(32) PRIMARY KEY,
      client_name VARCHAR(200) NOT NULL DEFAULT '',
      tagline VARCHAR(200) NOT NULL DEFAULT '',
      logo_url TEXT NOT NULL DEFAULT '',
      favicon_url TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    )
  `);
}

export function createNextSessionKey() {
  return randomBytes(32).toString('hex');
}

export async function registerNextSession(input: NextSessionInput) {
  await ensureNextSessionTable();

  await pool.query(
    `
      INSERT INTO custom_permissions_nextsession (session_key, user_id, ip_address, user_agent, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (session_key) DO UPDATE
      SET user_id = EXCLUDED.user_id,
          ip_address = EXCLUDED.ip_address,
          user_agent = EXCLUDED.user_agent,
          last_activity = NOW(),
          expires_at = EXCLUDED.expires_at
    `,
    [
      input.sessionKey,
      input.userId,
      String(input.ipAddress || '').slice(0, 64),
      String(input.userAgent || '').slice(0, 500),
      input.expiresAt || new Date(Date.now() + 12 * 60 * 60 * 1000),
    ],
  );
}

export async function touchNextSession(sessionKey?: string) {
  const key = String(sessionKey || '').trim();
  if (!key) return;

  await ensureNextSessionTable();
  await pool.query('UPDATE custom_permissions_nextsession SET last_activity = NOW() WHERE session_key = $1', [key]);
}

export async function closeNextSession(sessionKey?: string) {
  const key = String(sessionKey || '').trim();
  if (!key) return;

  await ensureNextSessionTable();
  await pool.query('DELETE FROM custom_permissions_nextsession WHERE session_key = $1', [key]);
}

function normalizeDbRow(row: Record<string, unknown>): DbConfigRecord {
  const dbType = String(row.db_type) as DbType;
  const dbEngine = normalizeEngine(row.db_engine, dbType);
  const rawSettings = ((row.engine_settings || {}) as Record<string, unknown>) || {};

  const engineSettings: Record<DbEngine, EngineProfile> = {
    postgres: normalizeProfile(rawSettings.postgres, 'postgres'),
    sqlanywhere: normalizeProfile(rawSettings.sqlanywhere, 'sqlanywhere'),
  };

  if (!rawSettings[dbEngine]) {
    engineSettings[dbEngine] = {
      host: String(row.host || ''),
      port: Number(row.port || defaultPort(dbEngine)),
      server: String(row.server || ''),
      database: String(row.database || ''),
      username: String(row.username || ''),
      password: String(row.password || ''),
    };
  }

  return {
    dbType,
    dbEngine,
    disabled: Boolean(row.disabled),
    updatedAt: row.updated_at ? String(row.updated_at) : null,
    activeProfile: engineSettings[dbEngine],
    engineSettings,
  };
}

export async function loadDbConfigs(): Promise<DbConfigRecord[]> {
  await ensureDefaultDbConfigs();

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT db_type, db_engine, host, port, server, database, username, password, disabled, updated_at, engine_settings
      FROM custom_permissions_dbconfig
      ORDER BY CASE db_type
        WHEN 'postgres' THEN 1
        WHEN 'integrado' THEN 2
        WHEN 'sueldo' THEN 3
        ELSE 99
      END
    `,
  );

  const configs = result.rows.map(normalizeDbRow);

  await Promise.all(
    configs.map(async (config) => {
      if (config.dbType === 'integrado' || config.dbType === 'sueldo') {
        const status = await fetchNodeJson(`/${config.dbType}/status`).catch(() => null);
        config.status = status?.data as DbConfigRecord['status'];
      } else {
        config.status = null;
      }
    }),
  );

  return configs;
}

export async function saveDbConfig(input: {
  dbType: DbType;
  dbEngine: DbEngine;
  disabled: boolean;
  profile: EngineProfile;
  action: 'save' | 'test' | 'reconnect';
}) {
  const existingResult = await pool.query<Record<string, unknown>>(
    `
      SELECT id, engine_settings
      FROM custom_permissions_dbconfig
      WHERE db_type = $1
      LIMIT 1
    `,
    [input.dbType],
  );

  const existing = existingResult.rows[0] || {};
  const rawSettings = ((existing.engine_settings || {}) as Record<string, unknown>) || {};
  const engineSettings: Record<DbEngine, EngineProfile> = {
    postgres: normalizeProfile(rawSettings.postgres, 'postgres'),
    sqlanywhere: normalizeProfile(rawSettings.sqlanywhere, 'sqlanywhere'),
  };
  engineSettings[input.dbEngine] = normalizeProfile(input.profile, input.dbEngine);

  if (existing.id) {
    await pool.query(
      `
        UPDATE custom_permissions_dbconfig
        SET db_engine = $2,
            host = $3,
            port = $4,
            server = $5,
            database = $6,
            username = $7,
            password = $8,
            disabled = $9,
            engine_settings = $10,
            updated_at = NOW()
        WHERE db_type = $1
      `,
      [
        input.dbType,
        input.dbEngine,
        input.profile.host,
        input.profile.port,
        input.profile.server,
        input.profile.database,
        input.profile.username,
        input.profile.password,
        input.disabled,
        JSON.stringify(engineSettings),
      ],
    );
  } else {
    await pool.query(
      `
        INSERT INTO custom_permissions_dbconfig
          (db_type, db_engine, host, port, server, database, username, password, disabled, engine_settings, updated_at)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      `,
      [
        input.dbType,
        input.dbEngine,
        input.profile.host,
        input.profile.port,
        input.profile.server,
        input.profile.database,
        input.profile.username,
        input.profile.password,
        input.disabled,
        JSON.stringify(engineSettings),
      ],
    );
  }

  if ((input.action === 'save' || input.action === 'reconnect') && (input.dbType === 'integrado' || input.dbType === 'sueldo')) {
    const apply = await fetchNodeJson('/db_config/update', {
      method: 'POST',
      body: JSON.stringify({
        db_type: input.dbType,
        db_engine: input.dbEngine,
        disabled: input.disabled,
        host: input.profile.host,
        port: input.profile.port,
        server: input.profile.server,
        database: input.profile.database,
        username: input.profile.username,
        password: input.profile.password,
      }),
    });

    if (!apply.ok || apply.data.ok === false) {
      throw new Error(String(apply.data.error || 'No se pudo aplicar la configuracion en Node API.'));
    }
  }

  if (input.action === 'test') {
    if (input.dbType === 'postgres' || input.dbEngine === 'postgres') {
      const testPool = new Pool({
        host: input.profile.host,
        port: Number(input.profile.port || 5432),
        database: input.profile.database,
        user: input.profile.username,
        password: input.profile.password,
        max: 1,
      });

      try {
        const client = await testPool.connect();
        client.release();
      } finally {
        await testPool.end().catch(() => undefined);
      }
    } else {
      const test = await fetchNodeJson('/db_test/sqlanywhere', {
        method: 'POST',
        body: JSON.stringify({
          host: input.profile.port && input.profile.host && !String(input.profile.host).includes(':')
            ? `${input.profile.host}:${input.profile.port}`
            : input.profile.host,
          server: input.profile.server,
          database: input.profile.database,
          username: input.profile.username,
          password: input.profile.password,
        }),
      });

      if (!test.ok || test.data.ok === false) {
        throw new Error(String(test.data.error || 'Error de conexion.'));
      }
    }
  }

  if (input.action === 'reconnect') {
    if (input.dbType !== 'integrado' && input.dbType !== 'sueldo') {
      throw new Error('Reconectar solo aplica para Integrado o Sueldo.');
    }

    const reconnect = await fetchNodeJson(`/${input.dbType}/reconnect`, { method: 'POST' });
    if (!reconnect.ok || reconnect.data.ok === false) {
      throw new Error(String(reconnect.data.error || 'No se pudo reconectar.'));
    }
  }

  const refreshed = await loadDbConfigs();
  return refreshed.find((item) => item.dbType === input.dbType) || null;
}

export async function loadEmailConfig(): Promise<EmailConfigRecord> {
  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT enabled, host, port, from_name, from_email, reply_to_name, reply_to_email,
             envelope_from, use_ssl, use_tls, use_auth, username, password, updated_at
      FROM custom_permissions_emailconfig
      ORDER BY id
      LIMIT 1
    `,
  );

  const row = result.rows[0] || {};
  return {
    enabled: Boolean(row.enabled),
    host: String(row.host || ''),
    port: Number(row.port || 25),
    fromName: String(row.from_name || ''),
    fromEmail: String(row.from_email || ''),
    replyToName: String(row.reply_to_name || ''),
    replyToEmail: String(row.reply_to_email || ''),
    envelopeFrom: String(row.envelope_from || ''),
    useSsl: Boolean(row.use_ssl),
    useTls: Boolean(row.use_tls),
    useAuth: Boolean(row.use_auth),
    username: String(row.username || ''),
    password: String(row.password || ''),
    updatedAt: row.updated_at ? String(row.updated_at) : null,
  };
}

function normalizeBrandingRow(row: Record<string, unknown>): BrandingConfigRecord {
  const empresa = String(row.empresa || 'GLOBAL').trim().toUpperCase() || 'GLOBAL';
  return {
    empresa,
    scope: empresa === 'GLOBAL' ? 'global' : 'empresa',
    clientName: String(row.client_name || ''),
    tagline: String(row.tagline || ''),
    logoUrl: String(row.logo_url || ''),
    faviconUrl: String(row.favicon_url || ''),
    updatedAt: row.updated_at ? String(row.updated_at) : null,
  };
}

export async function loadBrandingConfigs(): Promise<BrandingConfigRecord[]> {
  await ensureBrandingConfigTable();

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT empresa, client_name, tagline, logo_url, favicon_url, updated_at
      FROM custom_permissions_brandconfig
      ORDER BY CASE WHEN empresa = 'GLOBAL' THEN 0 ELSE 1 END, empresa
    `,
  );

  return result.rows.map(normalizeBrandingRow);
}

export async function loadBrandingConfig(empresa?: string | null): Promise<BrandingConfigRecord | null> {
  await ensureBrandingConfigTable();

  const normalizedEmpresa = String(empresa || '').trim().toUpperCase();
  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT empresa, client_name, tagline, logo_url, favicon_url, updated_at
      FROM custom_permissions_brandconfig
      WHERE empresa = ANY($1::varchar[])
      ORDER BY CASE WHEN empresa = $2::varchar THEN 0 WHEN empresa = 'GLOBAL' THEN 1 ELSE 2 END
      LIMIT 1
    `,
    [[...(normalizedEmpresa ? [normalizedEmpresa] : []), 'GLOBAL'], normalizedEmpresa || 'GLOBAL'],
  );

  const row = result.rows[0];
  return row ? normalizeBrandingRow(row) : null;
}

export async function saveBrandingConfig(input: {
  empresa: string;
  clientName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
}) {
  await ensureBrandingConfigTable();

  const empresa = String(input.empresa || 'GLOBAL').trim().toUpperCase() || 'GLOBAL';
  await pool.query(
    `
      INSERT INTO custom_permissions_brandconfig
        (empresa, client_name, tagline, logo_url, favicon_url, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (empresa) DO UPDATE
      SET client_name = EXCLUDED.client_name,
          tagline = EXCLUDED.tagline,
          logo_url = EXCLUDED.logo_url,
          favicon_url = EXCLUDED.favicon_url,
          updated_at = NOW()
    `,
    [
      empresa,
      String(input.clientName || '').trim(),
      String(input.tagline || '').trim(),
      String(input.logoUrl || '').trim(),
      String(input.faviconUrl || '').trim(),
    ],
  );

  return loadBrandingConfig(empresa);
}

export async function saveEmailConfig(
  input: EmailConfigRecord & { action: 'save' | 'test'; testEmail?: string },
) {
  const existsResult = await pool.query<{ id: number }>(
    `
      SELECT id
      FROM custom_permissions_emailconfig
      ORDER BY id
      LIMIT 1
    `,
  );

  const params = [
    input.enabled,
    input.host,
    input.port,
    input.fromName,
    input.fromEmail,
    input.replyToName,
    input.replyToEmail,
    input.envelopeFrom,
    input.useSsl,
    input.useTls,
    input.useAuth,
    input.username,
    input.password,
  ];

  if (existsResult.rows[0]) {
    await pool.query(
      `
        UPDATE custom_permissions_emailconfig
        SET enabled = $1,
            host = $2,
            port = $3,
            from_name = $4,
            from_email = $5,
            reply_to_name = $6,
            reply_to_email = $7,
            envelope_from = $8,
            use_ssl = $9,
            use_tls = $10,
            use_auth = $11,
            username = $12,
            password = $13,
            updated_at = NOW()
        WHERE id = $14
      `,
      [...params, existsResult.rows[0].id],
    );
  } else {
    await pool.query(
      `
        INSERT INTO custom_permissions_emailconfig
          (enabled, host, port, from_name, from_email, reply_to_name, reply_to_email,
           envelope_from, use_ssl, use_tls, use_auth, username, password, updated_at)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      `,
      params,
    );
  }

  if (input.action === 'test') {
    const testEmail = String(input.testEmail || '').trim();
    if (!testEmail) {
      throw new Error('Ingrese un email de prueba.');
    }

    const transporter = nodemailer.createTransport({
      host: input.host,
      port: Number(input.port || 25),
      secure: input.useSsl,
      requireTLS: input.useTls,
      auth: input.useAuth
        ? {
            user: input.username,
            pass: input.password,
          }
        : undefined,
    });

    await transporter.sendMail({
      from: input.fromEmail || input.username,
      to: testEmail,
      subject: 'Prueba de correo - MultiSoft',
      text: 'Este es un mensaje de prueba.',
      replyTo: input.replyToEmail || undefined,
      envelope: input.envelopeFrom
        ? {
            from: input.envelopeFrom,
            to: testEmail,
          }
        : undefined,
    });
  }

  return loadEmailConfig();
}

export async function loadUsersForAdmin(): Promise<AdminUserRecord[]> {
  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT id, username, first_name, last_name, is_active
      FROM auth_user
      ORDER BY username
    `,
  );

  return result.rows.map((row) => {
    const fullName = [row.first_name, row.last_name]
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .join(' ');

    return {
      id: Number(row.id),
      username: String(row.username || ''),
      displayName: fullName || String(row.username || ''),
      isActive: Boolean(row.is_active),
    };
  });
}

export async function loadUserCompanyAssignments(userId: number): Promise<UserCompanyAssignment[]> {
  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT empresa, db
      FROM custom_permissions_usuarioempresa
      WHERE user_id = $1
      ORDER BY db, empresa
    `,
    [userId],
  );

  return result.rows.map((row) => ({
    empresa: String(row.empresa || ''),
    db: (String(row.db || 'Integrado') === 'Sueldo' ? 'Sueldo' : 'Integrado') as 'Integrado' | 'Sueldo',
  }));
}

export async function loadCompanyAccessOptions(): Promise<CompanyAccessOption[]> {
  const [integrado, sueldo] = await Promise.all([
    fetchNodeJson('/empresa/select').catch(() => null),
    fetchNodeJson('/empresa_sueldo/select').catch(() => null),
  ]);

  const integratedRows = Array.isArray(integrado?.data?.data) ? (integrado?.data?.data as Array<Record<string, unknown>>) : [];
  const sueldoRows = Array.isArray(sueldo?.data?.data) ? (sueldo?.data?.data as Array<Record<string, unknown>>) : [];

  const normalize = (row: Record<string, unknown>, db: 'Integrado' | 'Sueldo'): CompanyAccessOption => {
    const empresa = String(row.Cod_Empresa || row.cod_empresa || row.codigo || row.Codigo || '').trim();
    const descripcion = String(row.Des_Empresa || row.des_empresa || row.descripcion || row.Descripcion || empresa).trim();
    return {
      key: `${empresa}-${db}`,
      empresa,
      label: empresa && descripcion && empresa !== descripcion ? `${empresa} · ${descripcion}` : descripcion || empresa,
      db,
    };
  };

  return [...integratedRows.map((row) => normalize(row, 'Integrado')), ...sueldoRows.map((row) => normalize(row, 'Sueldo'))]
    .filter((item) => item.empresa && item.label);
}

export async function saveUserCompanyAssignments(userId: number, values: string[]) {
  const normalizedValues = Array.from(new Set((values || []).map((item) => String(item || '').trim()).filter(Boolean)));

  const pairs = normalizedValues
    .map((item) => {
      const [empresa, dbRaw] = item.split('-');
      const db = dbRaw === 'Sueldo' ? 'Sueldo' : 'Integrado';
      return {
        empresa: String(empresa || '').trim(),
        db,
      };
    })
    .filter((item) => item.empresa);

  await pool.query('DELETE FROM custom_permissions_usuarioempresa WHERE user_id = $1', [userId]);

  for (const item of pairs) {
    await pool.query(
      `
        INSERT INTO custom_permissions_usuarioempresa (user_id, empresa, db)
        VALUES ($1, $2, $3)
      `,
      [userId, item.empresa, item.db],
    );
  }

  return loadUserCompanyAssignments(userId);
}

function decodeDjangoSession(value: string): Record<string, unknown> {
  const encoded = String(value || '');
  if (!encoded) return {};

  const payload = encoded.split(':')[0];
  const compressed = payload.startsWith('.');
  const base = compressed ? payload.slice(1) : payload;
  const raw = Buffer.from(base, 'base64');
  const decoded = compressed ? inflateSync(raw) : raw;

  return JSON.parse(decoded.toString('utf8')) as Record<string, unknown>;
}

export async function loadActiveSessions(): Promise<{ rows: ActiveSessionRecord[]; totalUsers: number; totalSessions: number }> {
  await ensureNextSessionTable();

  const aggregated = new Map<number, ActiveSessionRecord>();
  let totalSessions = 0;

  const addSession = (input: {
    userId: number;
    expires?: unknown;
    lastActivity?: unknown;
    ipAddress?: unknown;
    userAgent?: unknown;
  }) => {
    const userId = Number(input.userId || 0);
    if (!userId) return;

    totalSessions += 1;
    const current = aggregated.get(userId) || {
      id: userId,
      username: '',
      fullName: '',
      email: '',
      sessions: 0,
      expires: null,
      lastActivity: '',
      ipAddress: '',
      userAgent: '',
    };

    current.sessions += 1;
    current.expires = input.expires ? String(input.expires) : current.expires;
    current.lastActivity = input.lastActivity ? String(input.lastActivity) : current.lastActivity;
    current.ipAddress = input.ipAddress ? String(input.ipAddress) : current.ipAddress;
    current.userAgent = input.userAgent ? String(input.userAgent) : current.userAgent;
    aggregated.set(userId, current);
  };

  const djangoResult = await pool.query<Record<string, unknown>>(
    `
      SELECT session_key, session_data, expire_date
      FROM django_session
      WHERE expire_date > NOW()
      ORDER BY expire_date DESC
    `,
  ).catch(() => ({ rows: [] as Record<string, unknown>[] }));

  for (const row of djangoResult.rows) {
    try {
      const decoded = decodeDjangoSession(String(row.session_data || ''));
      const userId = Number(decoded._auth_user_id || 0);
      addSession({
        userId,
        expires: row.expire_date,
        lastActivity: decoded.last_activity,
        ipAddress: decoded.ip_address,
        userAgent: decoded.user_agent,
      });
    } catch {
      continue;
    }
  }

  await pool.query('DELETE FROM custom_permissions_nextsession WHERE expires_at <= NOW()');

  const nextResult = await pool.query<Record<string, unknown>>(
    `
      SELECT session_key, user_id, ip_address, user_agent, last_activity, expires_at
      FROM custom_permissions_nextsession
      WHERE expires_at > NOW()
      ORDER BY last_activity DESC
    `,
  );

  for (const row of nextResult.rows) {
    addSession({
      userId: Number(row.user_id || 0),
      expires: row.expires_at,
      lastActivity: row.last_activity,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
    });
  }

  const userIds = Array.from(aggregated.keys());
  if (userIds.length === 0) {
    return { rows: [], totalUsers: 0, totalSessions };
  }

  const usersResult = await pool.query<Record<string, unknown>>(
    `
      SELECT id, username, first_name, last_name, email
      FROM auth_user
      WHERE id = ANY($1::int[])
    `,
    [userIds],
  );

  for (const user of usersResult.rows) {
    const id = Number(user.id);
    const current = aggregated.get(id);
    if (!current) continue;

    current.username = String(user.username || '');
    current.fullName = [user.first_name, user.last_name].map((item) => String(item || '').trim()).filter(Boolean).join(' ');
    current.email = String(user.email || '');
  }

  const rows = Array.from(aggregated.values()).sort((a, b) => a.username.localeCompare(b.username, 'es'));
  return {
    rows,
    totalUsers: rows.length,
    totalSessions,
  };
}

export async function closeUserSessions(userId: number) {
  await ensureNextSessionTable();

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT session_key, session_data
      FROM django_session
      WHERE expire_date > NOW()
    `,
  );

  const keysToDelete: string[] = [];

  for (const row of result.rows) {
    try {
      const decoded = decodeDjangoSession(String(row.session_data || ''));
      if (String(decoded._auth_user_id || '') === String(userId)) {
        keysToDelete.push(String(row.session_key));
      }
    } catch {
      continue;
    }
  }

  if (keysToDelete.length > 0) {
    await pool.query('DELETE FROM django_session WHERE session_key = ANY($1::text[])', [keysToDelete]);
  }

  await pool.query('DELETE FROM custom_permissions_nextsession WHERE user_id = $1', [userId]);

  return loadActiveSessions();
}

function encodePbkdf2Sha256(rawPassword: string) {
  const iterations = 720000;
  const salt = randomBytes(12).toString('base64url');
  const digest = pbkdf2Sync(rawPassword, salt, iterations, 32, 'sha256').toString('base64');
  return `pbkdf2_sha256$${iterations}$${salt}$${digest}`;
}

export async function loadGroupsForAdmin(): Promise<AdminGroupRecord[]> {
  await ensureDefaultGroups();

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT id, name
      FROM auth_group
      ORDER BY name
    `,
  );

  return result.rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name || ''),
  }));
}

export async function loadGroupsDetailed(): Promise<AdminGroupDetail[]> {
  await ensureDefaultGroups();

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT
        g.id,
        g.name,
        COUNT(DISTINCT ug.user_id) AS user_count,
        COUNT(DISTINCT gp.permission_id) AS permissions_count
      FROM auth_group g
      LEFT JOIN auth_user_groups ug ON ug.group_id = g.id
      LEFT JOIN auth_group_permissions gp ON gp.group_id = g.id
      GROUP BY g.id
      ORDER BY g.name
    `,
  );

  return result.rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name || ''),
    userCount: Number(row.user_count || 0),
    permissionsCount: Number(row.permissions_count || 0),
  }));
}

export async function loadUsersDetailed(): Promise<AdminUserDetail[]> {
  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT
        u.id,
        u.username,
        u.first_name,
        u.last_name,
        u.email,
        u.is_active,
        u.is_superuser,
        u.is_staff,
        u.date_joined,
        array_remove(array_agg(ug.group_id), null) AS groups
      FROM auth_user u
      LEFT JOIN auth_user_groups ug ON ug.user_id = u.id
      GROUP BY u.id
      ORDER BY u.username
    `,
  );

  return result.rows.map((row) => ({
    id: Number(row.id),
    username: String(row.username || ''),
    firstName: String(row.first_name || ''),
    lastName: String(row.last_name || ''),
    email: String(row.email || ''),
    isActive: Boolean(row.is_active),
    isSuperuser: Boolean(row.is_superuser),
    isStaff: Boolean(row.is_staff),
    dateJoined: row.date_joined ? String(row.date_joined) : null,
    groups: Array.isArray(row.groups) ? row.groups.map((item) => Number(item)).filter(Boolean) : [],
  }));
}

export async function loadUserDetailedById(userId: number): Promise<AdminUserDetail | null> {
  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT
        u.id,
        u.username,
        u.first_name,
        u.last_name,
        u.email,
        u.is_active,
        u.is_superuser,
        u.is_staff,
        u.date_joined,
        array_remove(array_agg(ug.group_id), null) AS groups
      FROM auth_user u
      LEFT JOIN auth_user_groups ug ON ug.user_id = u.id
      WHERE u.id = $1
      GROUP BY u.id
      LIMIT 1
    `,
    [userId],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    username: String(row.username || ''),
    firstName: String(row.first_name || ''),
    lastName: String(row.last_name || ''),
    email: String(row.email || ''),
    isActive: Boolean(row.is_active),
    isSuperuser: Boolean(row.is_superuser),
    isStaff: Boolean(row.is_staff),
    dateJoined: row.date_joined ? String(row.date_joined) : null,
    groups: Array.isArray(row.groups) ? row.groups.map((item) => Number(item)).filter(Boolean) : [],
  };
}

export async function saveAdminUser(input: {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isSuperuser: boolean;
  groups: number[];
  password?: string;
}) {
  const username = String(input.username || '').trim();
  if (!username) {
    throw new Error('El usuario es obligatorio.');
  }

  const existing = await pool.query<{ id: number }>(
    `
      SELECT id
      FROM auth_user
      WHERE username = $1
        AND ($2::int IS NULL OR id <> $2::int)
      LIMIT 1
    `,
    [username, input.id || null],
  );

  if (existing.rows[0]) {
    throw new Error('Ya existe un usuario con ese nombre.');
  }

  const passwordToStore = input.password ? encodePbkdf2Sha256(input.password) : null;
  const isStaff = input.isSuperuser || input.groups.length > 0;
  let userId = Number(input.id || 0);

  if (userId) {
    if (passwordToStore) {
      await pool.query(
        `
          UPDATE auth_user
          SET username = $2,
              first_name = $3,
              last_name = $4,
              email = $5,
              is_active = $6,
              is_superuser = $7,
              is_staff = $8,
              password = $9
          WHERE id = $1
        `,
        [userId, username, input.firstName, input.lastName, input.email, input.isActive, input.isSuperuser, isStaff, passwordToStore],
      );
    } else {
      await pool.query(
        `
          UPDATE auth_user
          SET username = $2,
              first_name = $3,
              last_name = $4,
              email = $5,
              is_active = $6,
              is_superuser = $7,
              is_staff = $8
          WHERE id = $1
        `,
        [userId, username, input.firstName, input.lastName, input.email, input.isActive, input.isSuperuser, isStaff],
      );
    }
  } else {
    const password = passwordToStore || encodePbkdf2Sha256('admin');
    const created = await pool.query<{ id: number }>(
      `
        INSERT INTO auth_user
          (password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
        VALUES
          ($1, NULL, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING id
      `,
      [password, input.isSuperuser, username, input.firstName, input.lastName, input.email, isStaff, input.isActive],
    );
    userId = created.rows[0].id;
  }

  await pool.query('DELETE FROM auth_user_groups WHERE user_id = $1', [userId]);

  for (const groupId of Array.from(new Set((input.groups || []).map((item) => Number(item)).filter(Boolean)))) {
    await pool.query(
      `
        INSERT INTO auth_user_groups (user_id, group_id)
        VALUES ($1, $2)
      `,
      [userId, groupId],
    );
  }

  const users = await loadUsersDetailed();
  return users.find((user) => user.id === userId) || null;
}

export async function saveOwnAdminProfile(
  actorUserId: number,
  input: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
  },
) {
  const current = await loadUserDetailedById(actorUserId);
  if (!current) {
    throw new Error('No se encontro el usuario actual.');
  }

  const username = String(input.username || '').trim();
  if (!username) {
    throw new Error('El usuario es obligatorio.');
  }

  const existing = await pool.query<{ id: number }>(
    `
      SELECT id
      FROM auth_user
      WHERE username = $1
        AND id <> $2
      LIMIT 1
    `,
    [username, actorUserId],
  );

  if (existing.rows[0]) {
    throw new Error('Ya existe un usuario con ese nombre.');
  }

  const passwordToStore = input.password ? encodePbkdf2Sha256(input.password) : null;

  if (passwordToStore) {
    await pool.query(
      `
        UPDATE auth_user
        SET username = $2,
            first_name = $3,
            last_name = $4,
            email = $5,
            password = $6
        WHERE id = $1
      `,
      [actorUserId, username, input.firstName, input.lastName, input.email, passwordToStore],
    );
  } else {
    await pool.query(
      `
        UPDATE auth_user
        SET username = $2,
            first_name = $3,
            last_name = $4,
            email = $5
        WHERE id = $1
      `,
      [actorUserId, username, input.firstName, input.lastName, input.email],
    );
  }

  return loadUserDetailedById(actorUserId);
}

async function ensureDefaultGroups() {
  for (const name of DEFAULT_GROUPS) {
    await pool.query(
      `
        INSERT INTO auth_group (name)
        SELECT $1::varchar(150)
        WHERE NOT EXISTS (
          SELECT 1 FROM auth_group WHERE LOWER(name) = LOWER($1::varchar(150))
        )
      `,
      [name],
    );
  }
}

async function ensureDefaultDbConfigs() {
  const defaults: Array<{ dbType: DbType; dbEngine: DbEngine; profile: EngineProfile }> = [
    {
      dbType: 'postgres',
      dbEngine: 'postgres',
      profile: {
        host: process.env.AUTH_DB_HOST || 'localhost',
        port: Number(process.env.AUTH_DB_PORT || 5432),
        server: '',
        database: process.env.AUTH_DB_NAME || 'multisoft_informes',
        username: process.env.AUTH_DB_USER || 'multisoft_user',
        password: process.env.AUTH_DB_PASSWORD || '',
      },
    },
    {
      dbType: 'integrado',
      dbEngine: 'sqlanywhere',
      profile: {
        host: '',
        port: 2638,
        server: '',
        database: '',
        username: 'dba',
        password: '',
      },
    },
    {
      dbType: 'sueldo',
      dbEngine: 'sqlanywhere',
      profile: {
        host: '',
        port: 2638,
        server: '',
        database: '',
        username: 'dba',
        password: '',
      },
    },
  ];

  for (const item of defaults) {
    const engineSettings = {
      postgres: item.dbEngine === 'postgres' ? item.profile : emptyProfile('postgres'),
      sqlanywhere: item.dbEngine === 'sqlanywhere' ? item.profile : emptyProfile('sqlanywhere'),
    };

    await pool.query(
      `
        INSERT INTO custom_permissions_dbconfig
          (db_type, db_engine, host, port, server, database, username, password, disabled, engine_settings, updated_at)
        SELECT
          $1::varchar(20),
          $2::varchar(20),
          $3::varchar(120),
          $4::integer,
          $5::varchar(120),
          $6::varchar(120),
          $7::varchar(120),
          $8::varchar(200),
          FALSE,
          $9::jsonb,
          NOW()
        WHERE NOT EXISTS (
          SELECT 1 FROM custom_permissions_dbconfig WHERE db_type = $1::varchar(20)
        )
      `,
      [
        item.dbType,
        item.dbEngine,
        item.profile.host,
        item.profile.port,
        item.profile.server,
        item.profile.database,
        item.profile.username,
        item.profile.password,
        JSON.stringify(engineSettings),
      ],
    );
  }
}

export async function saveAdminGroup(input: { id?: number; name: string }) {
  const name = String(input.name || '').trim();
  if (!name) {
    throw new Error('El nombre del grupo es obligatorio.');
  }

  const existing = await pool.query<{ id: number }>(
    `
      SELECT id
      FROM auth_group
      WHERE LOWER(name) = LOWER($1::varchar(150))
        AND ($2::int IS NULL OR id <> $2::int)
      LIMIT 1
    `,
    [name, input.id || null],
  );

  if (existing.rows[0]) {
    throw new Error('Ya existe un grupo con ese nombre.');
  }

  let groupId = Number(input.id || 0);

  if (groupId) {
    await pool.query(
      `
        UPDATE auth_group
        SET name = $2
        WHERE id = $1
      `,
      [groupId, name],
    );
  } else {
    const created = await pool.query<{ id: number }>(
      `
        INSERT INTO auth_group (name)
        VALUES ($1::varchar(150))
        RETURNING id
      `,
      [name],
    );
    groupId = Number(created.rows[0].id);
  }

  const groups = await loadGroupsDetailed();
  return groups.find((group) => group.id === groupId) || null;
}

export async function deleteAdminGroup(groupId: number) {
  const normalizedGroupId = Number(groupId || 0);
  if (!normalizedGroupId) {
    throw new Error('Grupo invalido.');
  }

  const groupResult = await pool.query<{ id: number; name: string; user_count: string }>(
    `
      SELECT
        g.id,
        g.name,
        COUNT(ug.user_id) AS user_count
      FROM auth_group g
      LEFT JOIN auth_user_groups ug ON ug.group_id = g.id
      WHERE g.id = $1
      GROUP BY g.id
      LIMIT 1
    `,
    [normalizedGroupId],
  );

  const group = groupResult.rows[0];
  if (!group) {
    throw new Error('No se encontro el grupo a eliminar.');
  }

  if (Number(group.user_count || 0) > 0) {
    throw new Error('No puedes eliminar un grupo con usuarios asignados. Quita primero los usuarios del grupo.');
  }

  await pool.query('DELETE FROM auth_group_permissions WHERE group_id = $1', [normalizedGroupId]);
  await pool.query('DELETE FROM auth_user_groups WHERE group_id = $1', [normalizedGroupId]);
  await pool.query('DELETE FROM auth_group WHERE id = $1', [normalizedGroupId]);

  return loadGroupsDetailed();
}

export async function deleteAdminUser(input: { actorUserId: number; userId: number }) {
  const actorUserId = Number(input.actorUserId || 0);
  const userId = Number(input.userId || 0);

  if (!actorUserId || !userId) {
    throw new Error('Usuario invalido.');
  }

  if (actorUserId === userId) {
    throw new Error('No puedes eliminar tu propio usuario conectado.');
  }

  const targetResult = await pool.query<{ id: number; username: string; is_superuser: boolean }>(
    `
      SELECT id, username, is_superuser
      FROM auth_user
      WHERE id = $1
      LIMIT 1
    `,
    [userId],
  );

  const target = targetResult.rows[0];
  if (!target) {
    throw new Error('No se encontro el usuario a eliminar.');
  }

  if (target.is_superuser) {
    const superusers = await pool.query<{ count: string }>(
      `
        SELECT COUNT(*) AS count
        FROM auth_user
        WHERE is_superuser = TRUE
          AND is_active = TRUE
          AND id <> $1
      `,
      [userId],
    );

    if (Number(superusers.rows[0]?.count || 0) === 0) {
      throw new Error('No puedes eliminar el ultimo administrador activo.');
    }
  }

  await pool.query('DELETE FROM custom_permissions_usuarioempresa WHERE user_id = $1', [userId]);
  await pool.query('DELETE FROM auth_user_groups WHERE user_id = $1', [userId]);
  await pool.query('DELETE FROM auth_user_user_permissions WHERE user_id = $1', [userId]);
  await pool.query('DELETE FROM auth_user WHERE id = $1', [userId]);

  return loadUsersDetailed();
}

import { Pool } from 'pg';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import { inflateSync } from 'node:zlib';
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import {
  getBalanceGeneral,
  getBalanceGeneralPuc,
  getComprasList,
  getCuentasCobrar,
  getCuentasPagar,
  getOrdenCompraList,
  getStockCostoArticuloFull,
  getStockExistenciaDeposito,
  getStockValorizado,
  getVentasResumido,
} from '@/lib/api';
import { buildDefaultTemplateBlocks, getReportTemplateBlock } from '@/lib/report-template-presets';
import type { BalanceRow } from '@/types/finanzas';

const pool = new Pool({
  host: process.env.AUTH_DB_HOST || 'localhost',
  port: Number(process.env.AUTH_DB_PORT || 5432),
  database: process.env.AUTH_DB_NAME || 'multisoft_informes',
  user: process.env.AUTH_DB_USER || 'postgres',
  password: process.env.AUTH_DB_PASSWORD || 'postgres',
});

const NODE_API_BASE = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:3000/api/v1';
const MAX_ACTIVE_SESSIONS_PER_USER = Math.max(1, Number(process.env.MAX_ACTIVE_SESSIONS_PER_USER || 3));
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
  logoBackground: 'auto' | 'light' | 'dark';
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
  key: string;
  source: 'django' | 'next';
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

export type TaskStatus = 'pendiente' | 'en_proceso' | 'resuelta';
export type TaskPriority = 'baja' | 'media' | 'alta';
export type ReportScheduleFrequency = 'diaria' | 'semanal' | 'mensual';

export type UserTaskRecord = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  module: string;
  targetUrl: string;
  dueDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  completedAt: string | null;
  assignedToId: number;
  assignedToName: string;
  assignedToUsername: string;
  createdById: number;
  createdByName: string;
  createdByUsername: string;
  isAssignedToMe: boolean;
  isCreatedByMe: boolean;
};

export type UserNotificationRecord = {
  id: number;
  type: string;
  title: string;
  message: string;
  href: string;
  isRead: boolean;
  createdAt: string | null;
  readAt: string | null;
  actorName: string;
  actorUsername: string;
};

export type TaskCommentRecord = {
  id: number;
  taskId: number;
  message: string;
  createdAt: string | null;
  authorId: number;
  authorName: string;
  authorUsername: string;
};

export type ReportScheduleRecord = {
  id: number;
  reportKey: string;
  reportTitle: string;
  module: string;
  targetUrl: string;
  reportParams: Record<string, string>;
  frequency: ReportScheduleFrequency;
  timeOfDay: string;
  dayOfWeek: number | null;
  dayOfMonth: number | null;
  recipientUserIds: number[];
  recipientUsers: Array<{ id: number; label: string; username: string; email: string }>;
  extraEmails: string[];
  emailSubject: string;
  emailMessage: string;
  isActive: boolean;
  lastRunAt: string | null;
  nextRunAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdById: number;
  createdByName: string;
  createdByUsername: string;
};

export type ReportScheduleLogRecord = {
  id: number;
  scheduleId: number;
  reportTitle: string;
  module: string;
  status: 'success' | 'error';
  sentCount: number;
  message: string;
  executedAt: string | null;
};

export type ReportTemplateRecord = {
  id: number;
  name: string;
  description: string;
  module: string;
  templateKey: string;
  config: Record<string, unknown>;
  createdAt: string | null;
  updatedAt: string | null;
  createdById: number;
  createdByName: string;
  createdByUsername: string;
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
      logo_background VARCHAR(20) NOT NULL DEFAULT 'auto',
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    ALTER TABLE custom_permissions_brandconfig
    ADD COLUMN IF NOT EXISTS logo_background VARCHAR(20) NOT NULL DEFAULT 'auto'
  `);
}

async function ensureTaskTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS custom_permissions_task (
      id SERIAL PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status VARCHAR(20) NOT NULL DEFAULT 'pendiente',
      priority VARCHAR(20) NOT NULL DEFAULT 'media',
      module VARCHAR(80) NOT NULL DEFAULT '',
      target_url TEXT NOT NULL DEFAULT '',
      due_date DATE NULL,
      created_by INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
      assigned_to INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      completed_at TIMESTAMP WITH TIME ZONE NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS custom_permissions_taskcomment (
      id SERIAL PRIMARY KEY,
      task_id INTEGER NOT NULL REFERENCES custom_permissions_task(id) ON DELETE CASCADE,
      author_user_id INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
      message TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS custom_permissions_usernotification (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
      actor_user_id INTEGER NULL REFERENCES auth_user(id) ON DELETE SET NULL,
      type VARCHAR(40) NOT NULL DEFAULT 'info',
      title VARCHAR(180) NOT NULL,
      message TEXT NOT NULL DEFAULT '',
      href TEXT NOT NULL DEFAULT '',
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      read_at TIMESTAMP WITH TIME ZONE NULL
    )
  `);
}

async function ensureReportScheduleTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS custom_permissions_reportschedule (
      id SERIAL PRIMARY KEY,
      report_key VARCHAR(120) NOT NULL,
      report_title VARCHAR(180) NOT NULL,
      module VARCHAR(80) NOT NULL DEFAULT '',
      target_url TEXT NOT NULL DEFAULT '',
      report_params JSONB NOT NULL DEFAULT '{}'::jsonb,
      frequency VARCHAR(20) NOT NULL DEFAULT 'mensual',
      time_of_day VARCHAR(5) NOT NULL DEFAULT '08:00',
      day_of_week SMALLINT NULL,
      day_of_month SMALLINT NULL,
      recipient_user_ids INTEGER[] NOT NULL DEFAULT '{}'::integer[],
      extra_emails TEXT[] NOT NULL DEFAULT '{}'::text[],
      email_subject VARCHAR(220) NOT NULL DEFAULT '',
      email_message TEXT NOT NULL DEFAULT '',
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      last_run_at TIMESTAMPTZ NULL,
      next_run_at TIMESTAMPTZ NOT NULL,
      created_by INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS custom_permissions_reportschedulelog (
      id SERIAL PRIMARY KEY,
      schedule_id INTEGER NOT NULL REFERENCES custom_permissions_reportschedule(id) ON DELETE CASCADE,
      status VARCHAR(20) NOT NULL DEFAULT 'success',
      sent_count INTEGER NOT NULL DEFAULT 0,
      message TEXT NOT NULL DEFAULT '',
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_reportschedule_next_run
    ON custom_permissions_reportschedule (is_active, next_run_at)
  `);
}

async function ensureReportTemplateTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS custom_permissions_reporttemplate (
      id SERIAL PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      module VARCHAR(80) NOT NULL,
      template_key VARCHAR(80) NOT NULL,
      config JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_by_id INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS custom_permissions_reporttemplate_owner_idx
    ON custom_permissions_reporttemplate (created_by_id, module)
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

  await enforceNextSessionLimit(input.userId, input.sessionKey);
}

async function enforceNextSessionLimit(userId: number, keepSessionKey?: string) {
  const normalizedUserId = Number(userId || 0);
  if (!normalizedUserId) return;

  await ensureNextSessionTable();

  await pool.query('DELETE FROM custom_permissions_nextsession WHERE expires_at <= NOW()');
  await pool.query(
    `
      DELETE FROM custom_permissions_nextsession
      WHERE session_key IN (
        SELECT session_key
        FROM (
          SELECT
            session_key,
            ROW_NUMBER() OVER (
              ORDER BY
                CASE WHEN session_key = $2 THEN 0 ELSE 1 END,
                last_activity DESC,
                created_at DESC,
                session_key DESC
            ) AS rn
          FROM custom_permissions_nextsession
          WHERE user_id = $1
            AND expires_at > NOW()
        ) ranked
        WHERE rn > $3
      )
    `,
    [
      normalizedUserId,
      String(keepSessionKey || ''),
      MAX_ACTIVE_SESSIONS_PER_USER,
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
  const logoBackground = String(row.logo_background || 'auto').trim().toLowerCase();
  return {
    empresa,
    scope: empresa === 'GLOBAL' ? 'global' : 'empresa',
    clientName: String(row.client_name || ''),
    tagline: String(row.tagline || ''),
    logoUrl: String(row.logo_url || ''),
    faviconUrl: String(row.favicon_url || ''),
    logoBackground: logoBackground === 'light' || logoBackground === 'dark' ? logoBackground : 'auto',
    updatedAt: row.updated_at ? String(row.updated_at) : null,
  };
}

function mergeBrandingRecords(
  globalConfig: BrandingConfigRecord | null,
  scopedConfig: BrandingConfigRecord | null,
  empresa?: string | null,
): BrandingConfigRecord | null {
  if (!globalConfig && !scopedConfig) return null;
  if (!scopedConfig) return globalConfig;
  if (!globalConfig || scopedConfig.empresa === 'GLOBAL') return scopedConfig;

  const normalizedEmpresa = String(empresa || scopedConfig.empresa || '').trim().toUpperCase() || scopedConfig.empresa;
  return {
    ...globalConfig,
    ...scopedConfig,
    empresa: normalizedEmpresa,
    scope: normalizedEmpresa === 'GLOBAL' ? 'global' : 'empresa',
    clientName: scopedConfig.clientName || globalConfig.clientName,
    tagline: scopedConfig.tagline || globalConfig.tagline,
    logoUrl: scopedConfig.logoUrl || globalConfig.logoUrl,
    faviconUrl: scopedConfig.faviconUrl || globalConfig.faviconUrl,
    logoBackground: scopedConfig.logoBackground !== 'auto' ? scopedConfig.logoBackground : globalConfig.logoBackground,
    updatedAt: scopedConfig.updatedAt || globalConfig.updatedAt,
  };
}

export async function loadBrandingConfigs(): Promise<BrandingConfigRecord[]> {
  await ensureBrandingConfigTable();

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT empresa, client_name, tagline, logo_url, favicon_url, logo_background, updated_at
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
      SELECT empresa, client_name, tagline, logo_url, favicon_url, logo_background, updated_at
      FROM custom_permissions_brandconfig
      WHERE empresa = ANY($1::varchar[])
      ORDER BY CASE WHEN empresa = $2::varchar THEN 0 WHEN empresa = 'GLOBAL' THEN 1 ELSE 2 END
    `,
    [[...(normalizedEmpresa ? [normalizedEmpresa] : []), 'GLOBAL'], normalizedEmpresa || 'GLOBAL'],
  );

  const records = result.rows.map(normalizeBrandingRow);
  const globalConfig = records.find((item) => item.empresa === 'GLOBAL') || null;
  const scopedConfig = normalizedEmpresa
    ? records.find((item) => item.empresa === normalizedEmpresa) || null
    : globalConfig;
  return mergeBrandingRecords(globalConfig, scopedConfig, normalizedEmpresa || 'GLOBAL');
}

export async function saveBrandingConfig(input: {
  empresa: string;
  clientName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  logoBackground: string;
}) {
  await ensureBrandingConfigTable();

  const empresa = String(input.empresa || 'GLOBAL').trim().toUpperCase() || 'GLOBAL';
  const logoBackground = ['light', 'dark'].includes(String(input.logoBackground || '').trim().toLowerCase())
    ? String(input.logoBackground || '').trim().toLowerCase()
    : 'auto';
  await pool.query(
    `
      INSERT INTO custom_permissions_brandconfig
        (empresa, client_name, tagline, logo_url, favicon_url, logo_background, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (empresa) DO UPDATE
      SET client_name = EXCLUDED.client_name,
          tagline = EXCLUDED.tagline,
          logo_url = EXCLUDED.logo_url,
          favicon_url = EXCLUDED.favicon_url,
          logo_background = EXCLUDED.logo_background,
          updated_at = NOW()
    `,
    [
      empresa,
      String(input.clientName || '').trim(),
      String(input.tagline || '').trim(),
      String(input.logoUrl || '').trim(),
      String(input.faviconUrl || '').trim(),
      logoBackground,
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
      ORDER BY id
    `,
    [userId],
  );

  return result.rows.map((row) => ({
    empresa: String(row.empresa || ''),
    db: (String(row.db || 'Integrado') === 'Sueldo' ? 'Sueldo' : 'Integrado') as 'Integrado' | 'Sueldo',
  }));
}

export async function loadPrimaryUserEmpresa(
  userId: number,
  preferredDb: 'Integrado' | 'Sueldo' = 'Integrado',
): Promise<string | null> {
  const assignments = await loadUserCompanyAssignments(userId);
  const preferred = assignments.find((item) => item.db === preferredDb);
  const fallback = preferred || assignments[0];
  const empresa = String(fallback?.empresa || '').trim().toUpperCase();
  return empresa || null;
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

export async function loadActiveSessions(): Promise<{ rows: ActiveSessionRecord[]; totalUsers: number; totalSessions: number; maxSessionsPerUser: number }> {
  await ensureNextSessionTable();

  const sessionRows: ActiveSessionRecord[] = [];
  const userIds = new Set<number>();

  const addSession = (input: {
    key: string;
    source: 'django' | 'next';
    userId: number;
    expires?: unknown;
    lastActivity?: unknown;
    ipAddress?: unknown;
    userAgent?: unknown;
  }) => {
    const userId = Number(input.userId || 0);
    if (!userId) return;

    userIds.add(userId);
    sessionRows.push({
      key: input.key,
      source: input.source,
      id: userId,
      username: '',
      fullName: '',
      email: '',
      sessions: 1,
      expires: null,
      lastActivity: '',
      ipAddress: '',
      userAgent: '',
    });

    const current = sessionRows[sessionRows.length - 1];
    current.expires = input.expires ? String(input.expires) : current.expires;
    current.lastActivity = input.lastActivity ? String(input.lastActivity) : current.lastActivity;
    current.ipAddress = input.ipAddress ? String(input.ipAddress) : current.ipAddress;
    current.userAgent = input.userAgent ? String(input.userAgent) : current.userAgent;
  };

  const djangoResult = await pool.query<Record<string, unknown>>(
    `
      SELECT session_key, session_data, expire_date
      FROM django_session
      WHERE expire_date > NOW()
      ORDER BY expire_date DESC
    `,
  ).catch(() => ({ rows: [] as Record<string, unknown>[] }));

  const djangoCandidates: Array<{
    key: string;
    userId: number;
    expires: unknown;
    lastActivity: unknown;
    ipAddress: unknown;
    userAgent: unknown;
  }> = [];

  for (const row of djangoResult.rows) {
    try {
      const decoded = decodeDjangoSession(String(row.session_data || ''));
      const userId = Number(decoded._auth_user_id || 0);
      if (!userId) continue;
      djangoCandidates.push({
        key: String(row.session_key || ''),
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

  const djangoKeysToDelete: string[] = [];
  const djangoByUser = new Map<number, typeof djangoCandidates>();
  for (const candidate of djangoCandidates) {
    const current = djangoByUser.get(candidate.userId) || [];
    current.push(candidate);
    djangoByUser.set(candidate.userId, current);
  }
  for (const candidates of djangoByUser.values()) {
    candidates
      .sort((left, right) => sessionSortValue(right.lastActivity, right.expires) - sessionSortValue(left.lastActivity, left.expires))
      .forEach((candidate, index) => {
        if (index >= MAX_ACTIVE_SESSIONS_PER_USER && candidate.key) {
          djangoKeysToDelete.push(candidate.key);
        }
      });
  }
  if (djangoKeysToDelete.length > 0) {
    await pool.query('DELETE FROM django_session WHERE session_key = ANY($1::text[])', [djangoKeysToDelete]);
  }
  const deletedDjangoKeys = new Set(djangoKeysToDelete);
  for (const candidate of djangoCandidates) {
    if (deletedDjangoKeys.has(candidate.key)) continue;
    addSession({ ...candidate, source: 'django' });
  }

  await pool.query('DELETE FROM custom_permissions_nextsession WHERE expires_at <= NOW()');
  await pool.query(`
    WITH ranked AS (
      SELECT
        session_key,
        ROW_NUMBER() OVER (
          PARTITION BY user_id
          ORDER BY last_activity DESC, created_at DESC, session_key DESC
        ) AS rn
      FROM custom_permissions_nextsession
      WHERE expires_at > NOW()
    )
    DELETE FROM custom_permissions_nextsession
    WHERE session_key IN (
      SELECT session_key FROM ranked WHERE rn > ${MAX_ACTIVE_SESSIONS_PER_USER}
    )
  `);

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
      key: String(row.session_key || ''),
      source: 'next',
      userId: Number(row.user_id || 0),
      expires: row.expires_at,
      lastActivity: row.last_activity,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
    });
  }

  const userIdList = Array.from(userIds);
  if (userIdList.length === 0) {
    return { rows: [], totalUsers: 0, totalSessions: 0, maxSessionsPerUser: MAX_ACTIVE_SESSIONS_PER_USER };
  }

  const usersResult = await pool.query<Record<string, unknown>>(
    `
      SELECT id, username, first_name, last_name, email
      FROM auth_user
      WHERE id = ANY($1::int[])
    `,
    [userIdList],
  );

  const users = new Map<number, Record<string, unknown>>();
  for (const user of usersResult.rows) {
    users.set(Number(user.id), user);
  }

  for (const session of sessionRows) {
    const user = users.get(session.id);
    if (!user) continue;

    session.username = String(user.username || '');
    session.fullName = [user.first_name, user.last_name].map((item) => String(item || '').trim()).filter(Boolean).join(' ');
    session.email = String(user.email || '');
  }

  const rows = sessionRows.sort((a, b) => {
    const usernameComparison = a.username.localeCompare(b.username, 'es');
    if (usernameComparison !== 0) return usernameComparison;
    return sessionSortValue(b.lastActivity, b.expires) - sessionSortValue(a.lastActivity, a.expires);
  });
  return {
    rows,
    totalUsers: new Set(rows.map((row) => row.id)).size,
    totalSessions: rows.length,
    maxSessionsPerUser: MAX_ACTIVE_SESSIONS_PER_USER,
  };
}

function sessionSortValue(lastActivity?: unknown, expires?: unknown) {
  const preferred = Date.parse(String(lastActivity || ''));
  if (Number.isFinite(preferred)) return preferred;
  const fallback = Date.parse(String(expires || ''));
  return Number.isFinite(fallback) ? fallback : 0;
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

export async function closeActiveSession(source: unknown, sessionKey: unknown) {
  await ensureNextSessionTable();

  const normalizedSource = String(source || '').trim().toLowerCase();
  const normalizedKey = String(sessionKey || '').trim();
  if (!normalizedKey) {
    return loadActiveSessions();
  }

  if (normalizedSource === 'django') {
    await pool.query('DELETE FROM django_session WHERE session_key = $1', [normalizedKey]);
  } else {
    await pool.query('DELETE FROM custom_permissions_nextsession WHERE session_key = $1', [normalizedKey]);
  }

  return loadActiveSessions();
}

function normalizeTaskStatus(value: unknown): TaskStatus {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'resuelta') return 'resuelta';
  if (normalized === 'en_proceso') return 'en_proceso';
  return 'pendiente';
}

function normalizeTaskPriority(value: unknown): TaskPriority {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'alta') return 'alta';
  if (normalized === 'baja') return 'baja';
  return 'media';
}

function displayFullName(row: Record<string, unknown>, firstKey: string, lastKey: string, usernameKey: string) {
  const fullName = [row[firstKey], row[lastKey]]
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .join(' ');

  return fullName || String(row[usernameKey] || '').trim() || 'Usuario';
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeTaskRow(row: Record<string, unknown>, userId: number): UserTaskRecord {
  const assignedToId = Number(row.assigned_to || 0);
  const createdById = Number(row.created_by || 0);

  return {
    id: Number(row.id || 0),
    title: String(row.title || ''),
    description: String(row.description || ''),
    status: normalizeTaskStatus(row.status),
    priority: normalizeTaskPriority(row.priority),
    module: String(row.module || ''),
    targetUrl: String(row.target_url || ''),
    dueDate: row.due_date ? String(row.due_date) : null,
    createdAt: row.created_at ? String(row.created_at) : null,
    updatedAt: row.updated_at ? String(row.updated_at) : null,
    completedAt: row.completed_at ? String(row.completed_at) : null,
    assignedToId,
    assignedToName: displayFullName(row, 'assigned_first_name', 'assigned_last_name', 'assigned_username'),
    assignedToUsername: String(row.assigned_username || ''),
    createdById,
    createdByName: displayFullName(row, 'creator_first_name', 'creator_last_name', 'creator_username'),
    createdByUsername: String(row.creator_username || ''),
    isAssignedToMe: assignedToId === userId,
    isCreatedByMe: createdById === userId,
  };
}

function normalizeNotificationRow(row: Record<string, unknown>): UserNotificationRecord {
  return {
    id: Number(row.id || 0),
    type: String(row.type || 'info'),
    title: String(row.title || ''),
    message: String(row.message || ''),
    href: String(row.href || ''),
    isRead: Boolean(row.is_read),
    createdAt: row.created_at ? String(row.created_at) : null,
    readAt: row.read_at ? String(row.read_at) : null,
    actorName: displayFullName(row, 'actor_first_name', 'actor_last_name', 'actor_username'),
    actorUsername: String(row.actor_username || ''),
  };
}

const NOTIFICATION_RETENTION = {
  successDays: 15,
  errorDays: 90,
  readDays: 30,
} as const;

function normalizeTaskCommentRow(row: Record<string, unknown>): TaskCommentRecord {
  return {
    id: Number(row.id || 0),
    taskId: Number(row.task_id || 0),
    message: String(row.message || ''),
    createdAt: row.created_at ? String(row.created_at) : null,
    authorId: Number(row.author_user_id || 0),
    authorName: displayFullName(row, 'author_first_name', 'author_last_name', 'author_username'),
    authorUsername: String(row.author_username || ''),
  };
}

function isRestrictedCollaborationUser(row: Record<string, unknown> | undefined) {
  if (!row) return true;
  const username = String(row.username || '').trim().toLowerCase();
  return Boolean(row.is_superuser) || username === 'admin';
}

async function createUserNotification(input: {
  userId: number;
  actorUserId?: number | null;
  type: string;
  title: string;
  message: string;
  href?: string;
}) {
  await ensureTaskTables();
  await pool.query(
    `
      INSERT INTO custom_permissions_usernotification
        (user_id, actor_user_id, type, title, message, href)
      VALUES
        ($1, $2, $3::varchar(40), $4::varchar(180), $5::text, $6::text)
    `,
    [
      input.userId,
      input.actorUserId || null,
      String(input.type || 'info'),
      String(input.title || '').trim(),
      String(input.message || '').trim(),
      String(input.href || '').trim(),
    ],
  );
}

async function pruneNotificationsForUser(userId: number) {
  await ensureTaskTables();

  await pool.query(
    `
      DELETE FROM custom_permissions_usernotification
      WHERE user_id = $1::int
        AND (
          (type = 'report_schedule_success' AND created_at < NOW() - ($2::int * INTERVAL '1 day'))
          OR (type = 'report_schedule_error' AND created_at < NOW() - ($3::int * INTERVAL '1 day'))
          OR (is_read = TRUE AND created_at < NOW() - ($4::int * INTERVAL '1 day'))
        )
    `,
    [userId, NOTIFICATION_RETENTION.successDays, NOTIFICATION_RETENTION.errorDays, NOTIFICATION_RETENTION.readDays],
  );
}

function isEmailReady(config: EmailConfigRecord) {
  return Boolean(config.enabled && config.host && (config.fromEmail || config.username));
}

async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}) {
  const emailConfig = await loadEmailConfig();
  if (!isEmailReady(emailConfig)) {
    throw new Error('La configuracion de email no esta lista para enviar avisos.');
  }

  const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: Number(emailConfig.port || 25),
    secure: Boolean(emailConfig.useSsl),
    requireTLS: Boolean(emailConfig.useTls),
    auth: emailConfig.useAuth
      ? {
          user: emailConfig.username,
          pass: emailConfig.password,
        }
      : undefined,
  });

  const fromEmail = emailConfig.fromEmail || emailConfig.username;
  const fromName = String(emailConfig.fromName || 'MultiSoft').trim() || 'MultiSoft';
  const replyToEmail = String(emailConfig.replyToEmail || '').trim();
  const replyToName = String(emailConfig.replyToName || '').trim();

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    attachments: input.attachments,
    replyTo: replyToEmail ? (replyToName ? `"${replyToName}" <${replyToEmail}>` : replyToEmail) : undefined,
    envelope: emailConfig.envelopeFrom
      ? {
          from: emailConfig.envelopeFrom,
          to: input.to,
        }
      : undefined,
    });
}

function resolvePublicBaseUrl(origin?: string) {
  const configured =
    process.env.REPORT_SCHEDULE_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_BASE_URL ||
    '';

  const candidate = String(configured || origin || 'http://10.0.0.22:3001').trim();
  const safeUrl = candidate.startsWith('http://') || candidate.startsWith('https://')
    ? candidate
    : 'http://10.0.0.22:3001';

  return safeUrl.replace(/\/$/, '');
}

function normalizeScheduleFrequency(value: unknown): ReportScheduleFrequency {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'diaria') return 'diaria';
  if (normalized === 'semanal') return 'semanal';
  return 'mensual';
}

function normalizeTimeOfDay(value: unknown) {
  const raw = String(value || '').trim();
  return /^\d{2}:\d{2}$/.test(raw) ? raw : '08:00';
}

function normalizeScheduleEmails(value: unknown) {
  const items = Array.isArray(value) ? value : String(value || '').split(',');
  return Array.from(
    new Set(
      items
        .map((item) => String(item || '').trim().toLowerCase())
        .filter((item) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item)),
    ),
  );
}

function normalizeScheduleParams(value: unknown) {
  const source = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(source)
      .map(([key, raw]) => [String(key || '').trim(), String(raw || '').trim()])
      .filter(([key, raw]) => key && raw),
  );
}

function normalizeDayOfWeek(value: unknown) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric >= 0 && numeric <= 6 ? numeric : null;
}

function normalizeDayOfMonth(value: unknown) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric >= 1 && numeric <= 31 ? numeric : null;
}

function normalizeRecipientUserIds(value: unknown) {
  const items = Array.isArray(value) ? value : [value];
  return Array.from(
    new Set(
      items
        .map((item) => Number(item))
        .filter((item) => Number.isInteger(item) && item > 0),
    ),
  );
}

function buildNextScheduledRun(input: {
  frequency: ReportScheduleFrequency;
  timeOfDay: string;
  dayOfWeek?: number | null;
  dayOfMonth?: number | null;
  from?: Date;
}) {
  const base = new Date(input.from || new Date());
  const [hour, minute] = normalizeTimeOfDay(input.timeOfDay).split(':').map((item) => Number(item));

  const atTime = (date: Date) => {
    const next = new Date(date);
    next.setHours(hour, minute, 0, 0);
    return next;
  };

  if (input.frequency === 'diaria') {
    const candidate = atTime(base);
    if (candidate > base) return candidate;
    candidate.setDate(candidate.getDate() + 1);
    return candidate;
  }

  if (input.frequency === 'semanal') {
    const targetDay = normalizeDayOfWeek(input.dayOfWeek) ?? 1;
    const candidate = atTime(base);
    const currentDay = candidate.getDay();
    const diff = (targetDay - currentDay + 7) % 7;
    candidate.setDate(candidate.getDate() + diff);
    if (candidate <= base) {
      candidate.setDate(candidate.getDate() + 7);
    }
    return candidate;
  }

  const targetDay = normalizeDayOfMonth(input.dayOfMonth) ?? 1;
  const year = base.getFullYear();
  const month = base.getMonth();
  const lastDayCurrentMonth = new Date(year, month + 1, 0).getDate();
  const candidate = new Date(year, month, Math.min(targetDay, lastDayCurrentMonth), hour, minute, 0, 0);
  if (candidate > base) return candidate;

  const nextMonthDate = new Date(year, month + 1, 1);
  const lastDayNextMonth = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1, 0).getDate();
  return new Date(
    nextMonthDate.getFullYear(),
    nextMonthDate.getMonth(),
    Math.min(targetDay, lastDayNextMonth),
    hour,
    minute,
    0,
    0,
  );
}

function normalizeReportScheduleRow(row: Record<string, unknown>): ReportScheduleRecord {
  const recipientUserIds = (Array.isArray(row.recipient_user_ids) ? row.recipient_user_ids : [])
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item > 0);
  const recipientUsersRaw = (Array.isArray(row.recipient_users) ? row.recipient_users : []) as Array<Record<string, unknown>>;

  return {
    id: Number(row.id || 0),
    reportKey: String(row.report_key || ''),
    reportTitle: String(row.report_title || ''),
    module: String(row.module || ''),
    targetUrl: String(row.target_url || ''),
    reportParams: normalizeScheduleParams(row.report_params),
    frequency: normalizeScheduleFrequency(row.frequency),
    timeOfDay: normalizeTimeOfDay(row.time_of_day),
    dayOfWeek: normalizeDayOfWeek(row.day_of_week),
    dayOfMonth: normalizeDayOfMonth(row.day_of_month),
    recipientUserIds,
    recipientUsers: recipientUsersRaw.map((item) => ({
      id: Number(item.id || 0),
      label: String(item.label || ''),
      username: String(item.username || ''),
      email: String(item.email || ''),
    })).filter((item) => item.id > 0),
    extraEmails: normalizeScheduleEmails(row.extra_emails),
    emailSubject: String(row.email_subject || ''),
    emailMessage: String(row.email_message || ''),
    isActive: Boolean(row.is_active),
    lastRunAt: row.last_run_at ? String(row.last_run_at) : null,
    nextRunAt: row.next_run_at ? String(row.next_run_at) : null,
    createdAt: row.created_at ? String(row.created_at) : null,
    updatedAt: row.updated_at ? String(row.updated_at) : null,
    createdById: Number(row.created_by || 0),
    createdByName: displayFullName(row, 'creator_first_name', 'creator_last_name', 'creator_username'),
    createdByUsername: String(row.creator_username || ''),
  };
}

function normalizeTemplateConfig(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function normalizeReportTemplateRow(row: Record<string, unknown>): ReportTemplateRecord {
  return {
    id: Number(row.id || 0),
    name: String(row.name || '').trim(),
    description: String(row.description || '').trim(),
    module: String(row.module || '').trim(),
    templateKey: String(row.template_key || '').trim(),
    config: normalizeTemplateConfig(row.config),
    createdAt: row.created_at ? String(row.created_at) : null,
    updatedAt: row.updated_at ? String(row.updated_at) : null,
    createdById: Number(row.created_by_id || 0),
    createdByName: displayFullName(row, 'creator_first_name', 'creator_last_name', 'creator_username'),
    createdByUsername: String(row.creator_username || ''),
  };
}

function normalizeReportScheduleLogRow(row: Record<string, unknown>): ReportScheduleLogRecord {
  return {
    id: Number(row.id || 0),
    scheduleId: Number(row.schedule_id || 0),
    reportTitle: String(row.report_title || ''),
    module: String(row.module || ''),
    status: String(row.status || 'success') === 'error' ? 'error' : 'success',
    sentCount: Number(row.sent_count || 0),
    message: String(row.message || ''),
    executedAt: row.executed_at ? String(row.executed_at) : null,
  };
}

function humanFrequencyLabel(schedule: ReportScheduleRecord) {
  if (schedule.frequency === 'diaria') return `Todos los dias a las ${schedule.timeOfDay}`;
  if (schedule.frequency === 'semanal') {
    const labels = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    return `Cada ${labels[schedule.dayOfWeek ?? 1]} a las ${schedule.timeOfDay}`;
  }
  return `Cada mes, dia ${schedule.dayOfMonth ?? 1}, a las ${schedule.timeOfDay}`;
}

function balanceNum(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function balanceCode(row: BalanceRow) {
  return String(row.CodPlanCta || row.codplancta || '');
}

function balanceName(row: BalanceRow) {
  return String(row.Nombre || row.nombre || 'Sin descripcion');
}

function balanceLevel(row: BalanceRow) {
  return Number(row.Nivel || row.nivel || 0);
}

function balanceSaldo(row: BalanceRow) {
  return balanceNum(row.SALDO || row.saldo);
}

function balanceSaldoME(row: BalanceRow) {
  return balanceNum(row.SALDO_ME || row.saldo_me);
}

function calculateBalanceResultFallback(rows: BalanceRow[], currency: 'local' | 'extranjera') {
  return rows
    .filter((row) => {
      const code = balanceCode(row);
      const name = balanceName(row).toLowerCase();
      return code.startsWith('4') || code.startsWith('5') || name.includes('resultado');
    })
    .reduce((acc, row) => acc + (currency === 'extranjera' ? balanceSaldoME(row) : balanceSaldo(row)), 0);
}

function formatBalanceCurrency(value: number, decimals = 0) {
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function padPdfCell(value: string, width: number) {
  const raw = String(value || '');
  return raw.length > width ? `${raw.slice(0, Math.max(0, width - 1))}…` : raw;
}

async function loadPdfImageBuffer(url?: string | null) {
  const target = String(url || '').trim();
  if (!target) return null;
  if (!/^https?:\/\//i.test(target) && !target.startsWith('/')) return null;

  try {
    const baseUrl = resolvePublicBaseUrl();
    const finalUrl = target.startsWith('http://') || target.startsWith('https://')
      ? target
      : `${baseUrl}${target.startsWith('/') ? '' : '/'}${target}`;
    const response = await fetch(finalUrl, { cache: 'no-store' });
    if (!response.ok) return null;

    const contentType = String(response.headers.get('content-type') || '').toLowerCase();
    if (!contentType.includes('png') && !contentType.includes('jpeg') && !contentType.includes('jpg')) {
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

function scheduleNum(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function formatScheduledCurrency(value: unknown, decimals = 0) {
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(scheduleNum(value));
}

function formatScheduledDate(value: unknown) {
  return String(value || '').slice(0, 10) || '-';
}

function salesGroupLabel(groupBy: string) {
  if (groupBy === 'cod_tp_comp') return 'Comprobante';
  if (groupBy === 'cod_vendedor') return 'Vendedor';
  return 'Cliente';
}

function salesGroupValue(row: Record<string, unknown>, groupBy: string) {
  if (groupBy === 'cod_tp_comp') return String(row.des_tp_comp || row.cod_tp_comp || 'Sin comprobante');
  if (groupBy === 'cod_vendedor') return String(row.des_vendedor || 'Sin vendedor');
  return String(row.razon_social || row.cliente || 'Sin cliente');
}

function toNodeQuery(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const normalized = String(value || '').trim();
    if (normalized) {
      search.set(key, normalized);
    }
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

async function fetchNodeEnvelope(path: string, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${NODE_API_BASE}${path}`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        Connection: 'close',
      },
    });
    const json = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, data: json as Record<string, unknown> };
  } finally {
    clearTimeout(timeout);
  }
}

async function startScheduledCostoArticuloFullAsyncJob(params: {
  empresa: string;
  articulo: string;
  tipo: string;
  estado: string;
  fechad: string;
  fechah: string;
  calcular_empresa: string;
  ecuacion_mat: string;
  periodo: string;
  anho: string;
  fecha_inicio_desde: string;
  fecha_inicio_hasta: string;
  fecha_fin_desde: string;
  fecha_fin_hasta: string;
  recalcular: string;
}) {
  const query = toNodeQuery({
    articulo: params.articulo,
    tipo: params.tipo,
    estado: params.estado,
    fechad: params.fechad,
    fechah: params.fechah,
    calcular_empresa: params.calcular_empresa,
    ecuacion_mat: params.ecuacion_mat,
    periodo: params.periodo,
    anho: params.anho,
    fecha_inicio_desde: params.fecha_inicio_desde,
    fecha_inicio_hasta: params.fecha_inicio_hasta,
    fecha_fin_desde: params.fecha_fin_desde,
    fecha_fin_hasta: params.fecha_fin_hasta,
    recalcular: params.recalcular,
  });
  return fetchNodeEnvelope(`/stock/informes/${params.empresa}/costo_articulo_full_async/start${query}`, 20000);
}

async function getScheduledCostoArticuloFullAsyncStatus(empresa: string, jobId: string) {
  const query = toNodeQuery({ job_id: jobId });
  return fetchNodeEnvelope(`/stock/informes/${empresa}/costo_articulo_full_async/status${query}`, 10000);
}

async function getScheduledCostoArticuloFullAsyncResult(empresa: string, jobId: string) {
  const query = toNodeQuery({ job_id: jobId });
  return fetchNodeEnvelope(`/stock/informes/${empresa}/costo_articulo_full_async/result${query}`, 30000);
}

type ScheduledAttachmentTable = {
  headers: string[];
  dataRows: string[][];
  warning?: string;
};

type ScheduledCarteraReportData = {
  summary: ScheduledAttachmentTable;
  receivables: ScheduledAttachmentTable;
  payables: ScheduledAttachmentTable;
  effectiveParams: Record<string, string>;
  totalCobrarSaldo: number;
  totalCobrarImporte: number;
  totalPagarSaldo: number;
  totalPagarDebitos: number;
  netoCartera: number;
  coverage: number;
};

type ScheduledVentasComprasReportData = {
  summary: ScheduledAttachmentTable;
  sales: ScheduledAttachmentTable;
  purchases: ScheduledAttachmentTable;
  effectiveParams: Record<string, string>;
  totalFacturado: number;
  totalComprado: number;
  netoComercial: number;
  ventasVsComprasRatio: number;
};

type SelectedTemplateBlock = {
  key: string;
  label: string;
  subtitle: string;
  warning: string | undefined;
  headers: string[];
  dataRows: string[][];
};

async function loadScheduledCostoArticuloFullRows(params: {
  empresa: string;
  articulo: string;
  tipo: string;
  estado: string;
  fechad: string;
  fechah: string;
  calcular_empresa: string;
  ecuacion_mat: string;
  periodo: string;
  anho: string;
  fecha_inicio_desde: string;
  fecha_inicio_hasta: string;
  fecha_fin_desde: string;
  fecha_fin_hasta: string;
  recalcular: string;
}) {
  const ecuacionMat = String(params.ecuacion_mat || '').trim().toUpperCase() === 'S';
  if (!ecuacionMat) {
    const response = await getStockCostoArticuloFull(params);
    return ((response?.data || []) as Array<Record<string, unknown>>);
  }

  const started = await startScheduledCostoArticuloFullAsyncJob(params);
  const jobId = String(started.data?.data && typeof started.data.data === 'object'
    ? (started.data.data as Record<string, unknown>).job_id || ''
    : '').trim();
  if (!jobId) {
    throw new Error('No se pudo iniciar el proceso asincrono de Costo Articulo Full.');
  }

  let transientErrors = 0;
  let lastKnownStatus = '';

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const resultResponse = await getScheduledCostoArticuloFullAsyncResult(params.empresa, jobId).catch(() => null);
    if (resultResponse?.ok) {
      const rows = Array.isArray(resultResponse.data?.data) ? (resultResponse.data.data as Array<Record<string, unknown>>) : [];
      return rows;
    }

    const pendingMeta = resultResponse?.data?.data as Record<string, unknown> | undefined;
    const pendingStatus = String(pendingMeta?.status || '').trim().toLowerCase();
    if (pendingStatus === 'error') {
      throw new Error(
        String(pendingMeta?.error || resultResponse?.data?.error || 'El proceso asincrono de Costo Articulo Full finalizo con error.'),
      );
    }

    const statusResponse = await getScheduledCostoArticuloFullAsyncStatus(params.empresa, jobId).catch(() => null);
    if (!statusResponse || !statusResponse.ok) {
      transientErrors += 1;
      if (transientErrors >= 12) {
        throw new Error('No se pudo consultar el estado del proceso asincrono de Costo Articulo Full.');
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
      continue;
    }

    transientErrors = 0;
    const job = (statusResponse.data?.data || {}) as Record<string, unknown>;
    const currentStatus = String(job.status || '').trim().toLowerCase();
    lastKnownStatus = currentStatus || lastKnownStatus;

    if (currentStatus === 'done') {
      const result = await getScheduledCostoArticuloFullAsyncResult(params.empresa, jobId);
      if (!result.ok) {
        throw new Error(String(result.data?.error || 'El proceso finalizo, pero no se pudo recuperar el resultado.'));
      }
      return (Array.isArray(result.data?.data) ? (result.data.data as Array<Record<string, unknown>>) : []);
    }

    if (currentStatus === 'error') {
      throw new Error(String(job.error || 'El proceso asincrono de Costo Articulo Full finalizo con error.'));
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  throw new Error(
    lastKnownStatus
      ? `El proceso asincrono de Costo Articulo Full no finalizo dentro del tiempo esperado. Ultimo estado: ${lastKnownStatus}.`
      : 'El proceso asincrono de Costo Articulo Full no finalizo dentro del tiempo esperado.',
  );
}

const INTERNAL_SCHEDULE_PARAM_KEYS = new Set(['schedule_range_mode']);
const HIDDEN_DISPLAY_PARAMS_BY_REPORT: Record<string, string[]> = {
  'stock.costo_articulo_full': [
    'section',
    'submitted',
    'recalcular',
    'ecuacion_mat',
    'fecha_inicio_desde',
    'fecha_inicio_hasta',
    'fecha_fin_desde',
    'fecha_fin_hasta',
  ],
  'plantillas.cartera_bloques': ['template_id'],
  'plantillas.ventas_compras_bloques': ['template_id'],
};

function isDynamicMonthlyBalanceSchedule(schedule: ReportScheduleRecord) {
  return ['finanzas.balance_general', 'finanzas.balance_general_puc'].includes(schedule.reportKey)
    && String(schedule.reportParams.schedule_range_mode || '').trim() === 'enero_mes_actual';
}

function resolveScheduledReportParams(schedule: ReportScheduleRecord, runDate = new Date()) {
  const resolved = normalizeScheduleParams(schedule.reportParams);

  if (isDynamicMonthlyBalanceSchedule(schedule)) {
    const startMonth = Math.min(12, Math.max(1, Number.parseInt(String(resolved.mesd || '01'), 10) || 1));
    const currentMonth = runDate.getMonth() + 1;
    resolved.periodo = String(runDate.getFullYear());
    resolved.mesd = String(startMonth).padStart(2, '0');
    resolved.mesh = String(Math.max(currentMonth, startMonth)).padStart(2, '0');
  }

  if (schedule.reportKey === 'stock.costo_articulo_full' && String(resolved.schedule_range_mode || '').trim() === 'enero_mes_actual') {
    const monthStart = new Date(runDate.getFullYear(), runDate.getMonth(), 1);
    const monthEnd = new Date(runDate.getFullYear(), runDate.getMonth() + 1, 0);
    const normalizedStart = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}-${String(monthStart.getDate()).padStart(2, '0')}`;
    const normalizedEnd = `${monthEnd.getFullYear()}-${String(monthEnd.getMonth() + 1).padStart(2, '0')}-${String(monthEnd.getDate()).padStart(2, '0')}`;

    resolved.fechad = normalizedStart;
    resolved.fechah = normalizedEnd;
    resolved.periodo = `${monthStart.getFullYear()}${String(monthStart.getMonth() + 1).padStart(2, '0')}`;
    resolved.anho = String(monthStart.getFullYear());
    resolved.fecha_inicio_desde = normalizedStart;
    resolved.fecha_inicio_hasta = normalizedEnd;
    resolved.fecha_fin_desde = normalizedStart;
    resolved.fecha_fin_hasta = normalizedEnd;
  }

  if (schedule.reportKey === 'cartera.unificada' && String(resolved.schedule_range_mode || '').trim() === 'enero_mes_actual') {
    const monthStart = new Date(runDate.getFullYear(), runDate.getMonth(), 1);
    const monthEnd = new Date(runDate.getFullYear(), runDate.getMonth() + 1, 0);
    const normalizedStart = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}-${String(monthStart.getDate()).padStart(2, '0')}`;
    const normalizedEnd = `${monthEnd.getFullYear()}-${String(monthEnd.getMonth() + 1).padStart(2, '0')}-${String(monthEnd.getDate()).padStart(2, '0')}`;

    resolved.desde = normalizedStart;
    resolved.hasta = normalizedEnd;
    resolved.periodo = String(monthStart.getFullYear());
  }

  if (schedule.reportKey === 'plantillas.cartera_bloques' && String(resolved.schedule_range_mode || '').trim() === 'enero_mes_actual') {
    const monthStart = new Date(runDate.getFullYear(), runDate.getMonth(), 1);
    const monthEnd = new Date(runDate.getFullYear(), runDate.getMonth() + 1, 0);
    const normalizedStart = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}-${String(monthStart.getDate()).padStart(2, '0')}`;
    const normalizedEnd = `${monthEnd.getFullYear()}-${String(monthEnd.getMonth() + 1).padStart(2, '0')}-${String(monthEnd.getDate()).padStart(2, '0')}`;

    resolved.desde = normalizedStart;
    resolved.hasta = normalizedEnd;
    resolved.periodo = String(monthStart.getFullYear());
  }

  if (schedule.reportKey === 'plantillas.ventas_compras_bloques' && String(resolved.schedule_range_mode || '').trim() === 'enero_mes_actual') {
    const monthStart = new Date(runDate.getFullYear(), runDate.getMonth(), 1);
    const monthEnd = new Date(runDate.getFullYear(), runDate.getMonth() + 1, 0);
    const normalizedStart = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}-${String(monthStart.getDate()).padStart(2, '0')}`;
    const normalizedEnd = `${monthEnd.getFullYear()}-${String(monthEnd.getMonth() + 1).padStart(2, '0')}-${String(monthEnd.getDate()).padStart(2, '0')}`;

    resolved.desde = normalizedStart;
    resolved.hasta = normalizedEnd;
    resolved.periodo = String(monthStart.getFullYear());
  }

  return resolved;
}

function buildScheduleDisplayParams(
  schedule: ReportScheduleRecord,
  effectiveParams = schedule.reportParams,
) {
  const hiddenParams = new Set(HIDDEN_DISPLAY_PARAMS_BY_REPORT[schedule.reportKey] || []);
  const displayEntries = Object.entries(effectiveParams).filter(
    ([key, value]) => !INTERNAL_SCHEDULE_PARAM_KEYS.has(key) && !hiddenParams.has(key) && String(value || '').trim(),
  );

  if (isDynamicMonthlyBalanceSchedule(schedule)) {
    displayEntries.push(['rango mensual', 'Dinamico desde el mes inicial hasta el mes de ejecucion']);
  }

  if (schedule.reportKey === 'stock.costo_articulo_full' && String(schedule.reportParams.schedule_range_mode || '').trim() === 'enero_mes_actual') {
    displayEntries.push(['rango mensual', 'Dinamico por mes completo de ejecucion']);
  }

  if (schedule.reportKey === 'cartera.unificada' && String(schedule.reportParams.schedule_range_mode || '').trim() === 'enero_mes_actual') {
    displayEntries.push(['rango mensual', 'Dinamico por mes completo de ejecucion']);
  }

  if (schedule.reportKey === 'plantillas.cartera_bloques' && String(schedule.reportParams.schedule_range_mode || '').trim() === 'enero_mes_actual') {
    displayEntries.push(['rango mensual', 'Dinamico por mes completo de ejecucion']);
  }

  if (schedule.reportKey === 'plantillas.ventas_compras_bloques' && String(schedule.reportParams.schedule_range_mode || '').trim() === 'enero_mes_actual') {
    displayEntries.push(['rango mensual', 'Dinamico por mes completo de ejecucion']);
  }

  return displayEntries;
}

function buildScheduledReportUrl(schedule: ReportScheduleRecord, baseUrl: string, effectiveParams: Record<string, string>) {
  const rawUrl = schedule.targetUrl.startsWith('http://') || schedule.targetUrl.startsWith('https://')
    ? schedule.targetUrl
    : `${baseUrl}${schedule.targetUrl.startsWith('/') ? '' : '/'}${schedule.targetUrl}`;
  const url = new URL(rawUrl);
  for (const [key, value] of Object.entries(effectiveParams)) {
    const normalized = String(value || '').trim();
    if (!normalized || INTERNAL_SCHEDULE_PARAM_KEYS.has(key)) continue;
    url.searchParams.set(key, normalized);
  }
  return url.toString();
}

async function loadScheduledCarteraReportData(schedule: ReportScheduleRecord): Promise<ScheduledCarteraReportData> {
  const effectiveParams = resolveScheduledReportParams(schedule);
  const empresa = String(effectiveParams.empresa || '').trim();
  const sucursal = String(effectiveParams.sucursal || '').trim();
  const periodo = String(effectiveParams.periodo || '').trim();
  const desde = String(effectiveParams.desde || '').trim();
  const hasta = String(effectiveParams.hasta || '').trim();
  const vencimiento = String(effectiveParams.vencimiento || 'true').trim() === 'true';

  const [cobrarResponse, pagarResponse] = await Promise.all([
    getCuentasCobrar({
      empresa,
      sucursal,
      start: desde,
      end: hasta,
      vencimiento,
    }),
    getCuentasPagar({
      empresa,
      periodo,
      compras_start: desde,
      compras_end: hasta,
    }),
  ]);

  const cobrarRows = ((cobrarResponse?.data || []) as Array<Record<string, unknown>>);
  const pagarRows = ((pagarResponse?.data || []) as Array<Record<string, unknown>>);

  let saldoAcumulado = 0;
  const receivablesRows = cobrarRows.map((row) => {
    const importe = scheduleNum(row.importe);
    const saldo = scheduleNum(row.saldo);
    saldoAcumulado += saldo;

    return [
      row.des_tp_comp ? `${String(row.cod_tp_comp || '')} - ${String(row.des_tp_comp || '')}` : String(row.cod_tp_comp || '-'),
      String(row.comp_numero || '-'),
      String(row.cuota_numero || '-'),
      String(row.razon_social || row.cod_cliente || '-'),
      formatScheduledDate(row.fecha_emi),
      formatScheduledDate(row.fecha_ven),
      formatScheduledCurrency(importe),
      formatScheduledCurrency(saldo),
      formatScheduledCurrency(saldoAcumulado),
    ];
  });

  const payablesRows = pagarRows.map((row) => {
    const saldoAnterior = scheduleNum(row.SaldoAnterior || row.saldoanterior);
    const creditos = scheduleNum(row.TotalCredito || row.totalcredito);
    const debitos = scheduleNum(row.TotalDebito || row.totaldebito);
    const saldo = scheduleNum(row.Saldo || row.saldo);

    return [
      String(row.RazonSocial || row.razonsocial || row.CodProv || row.codprov || 'Proveedor'),
      String(row.Descrip || row.descrip || row.CodMoneda || row.codmoneda || '-'),
      formatScheduledCurrency(saldoAnterior),
      formatScheduledCurrency(creditos),
      formatScheduledCurrency(debitos),
      formatScheduledCurrency(saldo),
    ];
  });

  const totalCobrarImporte = cobrarRows.reduce((acc, row) => acc + scheduleNum(row.importe), 0);
  const totalCobrarSaldo = cobrarRows.reduce((acc, row) => acc + scheduleNum(row.saldo), 0);
  const totalPagarSaldo = pagarRows.reduce((acc, row) => acc + scheduleNum(row.Saldo || row.saldo), 0);
  const totalPagarDebitos = pagarRows.reduce((acc, row) => acc + scheduleNum(row.TotalDebito || row.totaldebito), 0);
  const netoCartera = totalCobrarSaldo - totalPagarSaldo;
  const coverage = totalPagarSaldo > 0 ? (totalCobrarSaldo / totalPagarSaldo) * 100 : 100;
  const ratioCobroPago = totalPagarSaldo > 0 ? totalCobrarSaldo / totalPagarSaldo : 1;

  return {
    summary: {
      headers: ['Indicador', 'Cobrar', 'Pagar', 'Neto / diferencia', 'Lectura gerencial'],
      dataRows: [
        [
          'Saldo operativo',
          formatScheduledCurrency(totalCobrarSaldo),
          formatScheduledCurrency(totalPagarSaldo),
          formatScheduledCurrency(netoCartera),
          netoCartera >= 0 ? 'Cobertura favorable' : 'Presion de pagos',
        ],
        [
          'Volumen documentado',
          formatScheduledCurrency(receivablesRows.length, 0),
          formatScheduledCurrency(payablesRows.length, 0),
          formatScheduledCurrency(receivablesRows.length - payablesRows.length, 0),
          'Cantidad de documentos vs proveedores',
        ],
        [
          'Importe / movimiento',
          formatScheduledCurrency(totalCobrarImporte),
          formatScheduledCurrency(totalPagarDebitos),
          formatScheduledCurrency(totalCobrarImporte - totalPagarDebitos),
          'Comparacion entre importe a cobrar y debitos del periodo',
        ],
        [
          'Cobertura porcentual',
          formatScheduledCurrency(coverage, 2),
          formatScheduledCurrency(100, 2),
          formatScheduledCurrency(coverage - 100, 2),
          coverage >= 100 ? 'La cartera cubre pagos' : 'La cartera no cubre pagos',
        ],
        [
          'Ratio cobrar/pagar',
          formatScheduledCurrency(ratioCobroPago, 2),
          formatScheduledCurrency(1, 2),
          formatScheduledCurrency(ratioCobroPago - 1, 2),
          ratioCobroPago >= 1 ? 'Relacion saludable' : 'Relacion por debajo de 1',
        ],
      ],
      warning: 'Cruce ejecutivo consolidado entre cuentas por cobrar y cuentas por pagar.',
    },
    receivables: {
      headers: ['Tipo Comprobante', 'Comprobante', 'Cuota', 'Cliente', 'Emision', 'Vencimiento', 'Importe', 'Saldo', 'Saldo acumulado'],
      dataRows: receivablesRows,
    },
    payables: {
      headers: ['Proveedor', 'Moneda', 'Saldo anterior', 'Creditos', 'Debitos', 'Saldo'],
      dataRows: payablesRows,
    },
    effectiveParams,
    totalCobrarSaldo,
    totalCobrarImporte,
    totalPagarSaldo,
    totalPagarDebitos,
    netoCartera,
    coverage,
  };
}

async function loadScheduledVentasComprasReportData(schedule: ReportScheduleRecord): Promise<ScheduledVentasComprasReportData> {
  const effectiveParams = resolveScheduledReportParams(schedule);
  const empresa = String(effectiveParams.empresa || '').trim();
  const sucursal = String(effectiveParams.sucursal || '').trim();
  const moneda = String(effectiveParams.moneda || 'GS').trim() || 'GS';
  const desde = String(effectiveParams.desde || '').trim();
  const hasta = String(effectiveParams.hasta || '').trim();
  const departamento = String(effectiveParams.departamento || '').trim();
  const order = String(effectiveParams.order || 'cod_cliente').trim() || 'cod_cliente';

  const [ventasResponse, comprasResponse] = await Promise.all([
    getVentasResumido({
      empresa,
      sucursal,
      moneda,
      desde,
      hasta,
      order,
    }),
    getComprasList({
      empresa,
      sucursal,
      moneda,
      compras_start: desde,
      compras_end: hasta,
      departamento,
      proveedor: '',
      tipooc: '',
      agrupar: '',
    }),
  ]);

  const ventasRows = ((ventasResponse?.data || []) as Array<Record<string, unknown>>);
  const comprasRows = ((comprasResponse?.data || []) as Array<Record<string, unknown>>);

  const salesDataRows = ventasRows.map((row) => [
    salesGroupValue(row, order),
    `${String(row.cod_tp_comp || '')} - ${String(row.comp_numero || '')}`.trim(),
    String(row.razon_social || row.cliente || '-'),
    String(row.ruc || '-'),
    formatScheduledDate(row.fecha),
    formatScheduledCurrency(row.total_iva),
    formatScheduledCurrency(row.to_gravado),
    formatScheduledCurrency(row.totaldescuento),
    formatScheduledCurrency(scheduleNum(row.to_gravado) + scheduleNum(row.total_iva)),
  ]);

  const purchasesDataRows = comprasRows.map((row) => [
    formatScheduledDate(row.FechaFact || row.fecha_fact),
    `${String(row.Cod_Tp_Comp || row.cod_tp_comp || '')} - ${String(row.NroFact || row.nrofact || '')}`.trim(),
    String(row.RazonSocial || row.razon_social || '-'),
    String(row.des_sucursal || '-'),
    formatScheduledCurrency(row.gravada),
    formatScheduledCurrency(row.IVA || row.iva),
    formatScheduledCurrency(row.total),
    String(row.estado || row.Asentado || '-'),
  ]);

  const totalFacturado = ventasRows.reduce((acc, row) => acc + scheduleNum(row.to_gravado) + scheduleNum(row.total_iva), 0);
  const totalComprado = comprasRows.reduce((acc, row) => acc + scheduleNum(row.total), 0);
  const totalIvaVentas = ventasRows.reduce((acc, row) => acc + scheduleNum(row.total_iva), 0);
  const totalIvaCompras = comprasRows.reduce((acc, row) => acc + scheduleNum(row.IVA || row.iva), 0);
  const netoComercial = totalFacturado - totalComprado;
  const ventasVsComprasRatio = totalComprado > 0 ? totalFacturado / totalComprado : 1;

  return {
    summary: {
      headers: ['Indicador', 'Ventas', 'Compras', 'Diferencia', 'Lectura gerencial'],
      dataRows: [
        [
          'Volumen del periodo',
          formatScheduledCurrency(totalFacturado),
          formatScheduledCurrency(totalComprado),
          formatScheduledCurrency(netoComercial),
          netoComercial >= 0 ? 'Ventas por encima de compras' : 'Compras por encima de ventas',
        ],
        [
          'Documentos visibles',
          formatScheduledCurrency(salesDataRows.length, 0),
          formatScheduledCurrency(purchasesDataRows.length, 0),
          formatScheduledCurrency(salesDataRows.length - purchasesDataRows.length, 0),
          'Cantidad de comprobantes visibles',
        ],
        [
          'IVA comparado',
          formatScheduledCurrency(totalIvaVentas),
          formatScheduledCurrency(totalIvaCompras),
          formatScheduledCurrency(totalIvaVentas - totalIvaCompras),
          'Diferencia de carga impositiva visible',
        ],
        [
          'Ratio ventas/compras',
          formatScheduledCurrency(ventasVsComprasRatio, 2),
          formatScheduledCurrency(1, 2),
          formatScheduledCurrency(ventasVsComprasRatio - 1, 2),
          ventasVsComprasRatio >= 1 ? 'Relacion comercial saludable' : 'Relacion comercial presionada',
        ],
      ],
      warning: 'Cruce consolidado entre ventas visibles y compras del mismo periodo operativo.',
    },
    sales: {
      headers: ['Grupo', 'Comprobante', 'Cliente', 'RUC', 'Fecha', 'IVA', 'Gravado', 'Descuento', 'Total'],
      dataRows: salesDataRows,
      warning: `Agrupado por ${salesGroupLabel(order).toLowerCase()}.`,
    },
    purchases: {
      headers: ['Fecha', 'Comprobante', 'Proveedor', 'Sucursal', 'Gravada', 'IVA', 'Total', 'Estado'],
      dataRows: purchasesDataRows,
    },
    effectiveParams,
    totalFacturado,
    totalComprado,
    netoComercial,
    ventasVsComprasRatio,
  };
}

function normalizeTemplateBlockSelections(templateKey: string, value: unknown) {
  const selectedBlocks = Array.isArray(value)
    ? value
      .map((item) => (item && typeof item === 'object' ? item as Record<string, unknown> : null))
      .filter(Boolean)
      .map((item) => ({
        key: String(item?.key || '').trim(),
        columns: Array.isArray(item?.columns) ? item.columns.map((column) => String(column || '').trim()).filter(Boolean) : [],
      }))
      .filter((item) => item.key)
    : [];

  return selectedBlocks.length ? selectedBlocks : buildDefaultTemplateBlocks(templateKey);
}

function selectCarteraBlocks(report: ScheduledCarteraReportData, selectedBlocksInput: unknown): SelectedTemplateBlock[] {
  const selectedBlocks = normalizeTemplateBlockSelections('cartera_bloques', selectedBlocksInput);
  const sourceMap = {
    summary: report.summary,
    receivables: report.receivables,
    payables: report.payables,
  } as const;

  const resolvedBlocks = selectedBlocks
    .map((selection) => {
      const meta = getReportTemplateBlock('cartera_bloques', selection.key);
      if (!meta) return null;
      const source = sourceMap[selection.key as keyof typeof sourceMap];
      if (!source) return null;
      const indexes = meta.columns
        .map((column, index) => (selection.columns.includes(column.key) ? index : -1))
        .filter((index) => index >= 0);
      if (!indexes.length) return null;

      return {
        key: meta.key,
        label: meta.label,
        subtitle: meta.subtitle,
        warning: source.warning,
        headers: indexes.map((index) => source.headers[index] || meta.columns[index]?.header || ''),
        dataRows: source.dataRows.map((row) => indexes.map((index) => row[index] || '')),
      } satisfies SelectedTemplateBlock;
    });

  return resolvedBlocks.filter((block): block is NonNullable<typeof block> => Boolean(block));
}

function selectVentasComprasBlocks(report: ScheduledVentasComprasReportData, selectedBlocksInput: unknown): SelectedTemplateBlock[] {
  const selectedBlocks = normalizeTemplateBlockSelections('ventas_compras_bloques', selectedBlocksInput);
  const sourceMap = {
    summary: report.summary,
    sales: report.sales,
    purchases: report.purchases,
  } as const;

  const resolvedBlocks = selectedBlocks
    .map((selection) => {
      const meta = getReportTemplateBlock('ventas_compras_bloques', selection.key);
      if (!meta) return null;
      const source = sourceMap[selection.key as keyof typeof sourceMap];
      if (!source) return null;
      const indexes = meta.columns
        .map((column, index) => (selection.columns.includes(column.key) ? index : -1))
        .filter((index) => index >= 0);
      if (!indexes.length) return null;

      return {
        key: meta.key,
        label: meta.label,
        subtitle: meta.subtitle,
        warning: source.warning,
        headers: indexes.map((index) => source.headers[index] || meta.columns[index]?.header || ''),
        dataRows: source.dataRows.map((row) => indexes.map((index) => row[index] || '')),
      } satisfies SelectedTemplateBlock;
    });

  return resolvedBlocks.filter((block): block is NonNullable<typeof block> => Boolean(block));
}

async function loadScheduledBalanceReportData(schedule: ReportScheduleRecord) {
  const effectiveParams = resolveScheduledReportParams(schedule);
  const empresa = String(effectiveParams.empresa || '').trim();
  const periodo = String(effectiveParams.periodo || '').trim();
  const mesd = String(effectiveParams.mesd || '01').padStart(2, '0');
  const mesh = String(effectiveParams.mesh || mesd).padStart(2, '0');
  const moneda = String(effectiveParams.moneda || 'local').trim() || 'local';
  const cuentad = String(effectiveParams.cuentad || '1').trim() || '1';
  const cuentah = String(effectiveParams.cuentah || '9').trim() || '9';
  const nivel = String(effectiveParams.nivel || '9').trim() || '9';
  const aux = String(effectiveParams.aux || 'NO').trim() || 'NO';
  const saldo = String(effectiveParams.saldo || 'NO').trim() || 'NO';

  const response = schedule.reportKey === 'finanzas.balance_general_puc'
    ? await getBalanceGeneralPuc({
        empresa,
        periodo,
        mesd,
        mesh,
        moneda,
        cuentad,
        cuentah,
        nivel,
        aux,
        saldo,
        practicado_al: String(effectiveParams.practicado_al || '').trim(),
        recalcular_saldos: String(effectiveParams.recalcular_saldos || '').trim(),
        codigo_entidad: String(effectiveParams.codigo_entidad || '').trim(),
        balance_cuentas_puc: String(effectiveParams.balance_cuentas_puc || '').trim(),
      })
    : await getBalanceGeneral({
        empresa,
        periodo,
        mesd,
        mesh,
        moneda,
        cuentad,
        cuentah,
        nivel,
        aux,
        saldo,
      });

  const rows = ((response?.data || []) as BalanceRow[]);
  const apiResultLocal = Number((response as { resultado?: { local?: number } } | null)?.resultado?.local);
  const apiResultME = Number((response as { resultado?: { extranjera?: number } } | null)?.resultado?.extranjera);
  return {
    rows,
    moneda,
    periodo,
    mesd,
    mesh,
    effectiveParams,
    warning: String((response as { warning?: string } | null)?.warning || '').trim(),
    resultadoLocal: Number.isFinite(apiResultLocal) ? apiResultLocal : calculateBalanceResultFallback(rows, 'local'),
    resultadoME: Number.isFinite(apiResultME) ? apiResultME : calculateBalanceResultFallback(rows, 'extranjera'),
  };
}

function buildScheduledBalanceTable(rows: BalanceRow[], moneda: string) {
  const isBoth = moneda === 'ambas';
  const headers = isBoth
    ? ['Cuenta', 'Descripcion', 'Guaranies', 'Dolares']
    : ['Cuenta', 'Descripcion', 'Debito', 'Credito', 'Saldo'];

  const dataRows = rows.map((row) =>
    isBoth
      ? [
          balanceCode(row),
          balanceName(row),
          formatBalanceCurrency(balanceNum(row.SALDO_LOCAL || row.saldo_local || row.SALDO || row.saldo)),
          formatBalanceCurrency(balanceNum(row.SALDO_ME || row.saldo_me), 2),
        ]
      : [
          balanceCode(row),
          balanceName(row),
          formatBalanceCurrency(balanceNum(row.TOTAL_DEBITO || row.total_debito)),
          formatBalanceCurrency(balanceNum(row.TOTAL_CREDITO || row.total_credito)),
          formatBalanceCurrency(balanceNum(row.SALDO || row.saldo)),
        ],
  );

  return { headers, dataRows };
}

async function loadScheduledTabularReportData(schedule: ReportScheduleRecord): Promise<ScheduledAttachmentTable> {
  const empresa = String(schedule.reportParams.empresa || '').trim();
  const effectiveParams = resolveScheduledReportParams(schedule);

  if (schedule.reportKey === 'ventas.ventas_resumen') {
    const order = String(schedule.reportParams.order || 'cod_cliente').trim() || 'cod_cliente';
    const response = await getVentasResumido({
      empresa,
      sucursal: String(schedule.reportParams.sucursal || '').trim(),
      moneda: String(schedule.reportParams.moneda || 'GS').trim() || 'GS',
      desde: String(schedule.reportParams.desde || '').trim(),
      hasta: String(schedule.reportParams.hasta || '').trim(),
      order,
      tipo_cliente: String(schedule.reportParams.tipo_cliente || '').trim(),
      cliente: String(schedule.reportParams.cliente || '').trim(),
      tipo_comprobante: String(schedule.reportParams.tipo_comprobante || '').trim(),
    });
    const rows = ((response?.data || []) as Array<Record<string, unknown>>);
    return {
      headers: ['Grupo', 'Comprobante', 'Cliente', 'RUC', 'Fecha', 'IVA', 'Gravado', 'Descuento', 'Total'],
      dataRows: rows.map((row) => [
        salesGroupValue(row, order),
        `${String(row.cod_tp_comp || '')} - ${String(row.comp_numero || '')}`.trim(),
        String(row.razon_social || row.cliente || '-'),
        String(row.ruc || '-'),
        formatScheduledDate(row.fecha),
        formatScheduledCurrency(row.total_iva),
        formatScheduledCurrency(row.to_gravado),
        formatScheduledCurrency(row.totaldescuento),
        formatScheduledCurrency(scheduleNum(row.to_gravado) + scheduleNum(row.total_iva)),
      ]),
      warning: `Agrupado por ${salesGroupLabel(order).toLowerCase()}.`,
    };
  }

  if (schedule.reportKey === 'ventas.cuentas_cobrar') {
    const response = await getCuentasCobrar({
      empresa,
      sucursal: String(schedule.reportParams.sucursal || '').trim(),
      start: String(schedule.reportParams.desde || '').trim(),
      end: String(schedule.reportParams.hasta || '').trim(),
      vencimiento: String(schedule.reportParams.vencimiento || '').trim() === 'true',
      cliente: String(schedule.reportParams.cliente || '').trim(),
      calificacion: String(schedule.reportParams.calificacion || '').trim(),
      movimiento: String(schedule.reportParams.movimiento || '').trim(),
      condicion: String(schedule.reportParams.condicion || '').trim(),
      cobrador: String(schedule.reportParams.cobrador || '').trim(),
      vendedor: String(schedule.reportParams.vendedor || '').trim(),
      zona: String(schedule.reportParams.zona || '').trim(),
      tipoCliente: String(schedule.reportParams.tipoCliente || '').trim(),
    });
    const rows = ((response?.data || []) as Array<Record<string, unknown>>);
    let saldoAcumulado = 0;
    return {
      headers: ['Tipo Comprobante', 'Comprobante', 'Cuota', 'Cliente', 'Emision', 'Vencimiento', 'Importe', 'Saldo', 'Saldo acumulado'],
      dataRows: rows.map((row) => {
        const saldo = scheduleNum(row.saldo);
        saldoAcumulado += saldo;
        return [
          row.des_tp_comp ? `${String(row.cod_tp_comp || '')} - ${String(row.des_tp_comp || '')}` : String(row.cod_tp_comp || '-'),
          String(row.comp_numero || '-'),
          String(row.cuota_numero || '-'),
          String(row.razon_social || row.cod_cliente || '-'),
          formatScheduledDate(row.fecha_emi),
          formatScheduledDate(row.fecha_ven),
          formatScheduledCurrency(row.importe),
          formatScheduledCurrency(saldo),
          formatScheduledCurrency(saldoAcumulado),
        ];
      }),
    };
  }

  if (schedule.reportKey === 'compras.compras_periodo') {
    const response = await getComprasList({
      empresa,
      sucursal: String(schedule.reportParams.sucursal || '').trim(),
      moneda: String(schedule.reportParams.moneda || 'GS').trim() || 'GS',
      compras_start: String(schedule.reportParams.compras_start || '').trim(),
      compras_end: String(schedule.reportParams.compras_end || '').trim(),
      departamento: String(schedule.reportParams.departamento || '').trim(),
      proveedor: String(schedule.reportParams.proveedor || '').trim(),
      tipooc: String(schedule.reportParams.tipooc || '').trim(),
      agrupar: String(schedule.reportParams.agrupar || '').trim(),
    });
    const rows = ((response?.data || []) as Array<Record<string, unknown>>);
    return {
      headers: ['Fecha', 'Comprobante', 'Proveedor', 'Sucursal', 'Gravada', 'IVA', 'Total', 'Estado'],
      dataRows: rows.map((row) => [
        formatScheduledDate(row.FechaFact || row.fecha_fact),
        `${String(row.Cod_Tp_Comp || row.cod_tp_comp || '')} - ${String(row.NroFact || row.nrofact || '')}`.trim(),
        String(row.RazonSocial || row.razon_social || '-'),
        String(row.des_sucursal || '-'),
        formatScheduledCurrency(row.gravada),
        formatScheduledCurrency(row.IVA || row.iva),
        formatScheduledCurrency(row.total),
        String(row.estado || row.Asentado || '-'),
      ]),
    };
  }

  if (schedule.reportKey === 'compras.ordenes_compra') {
    const response = await getOrdenCompraList({
      empresa,
      sucursal: String(schedule.reportParams.sucursal || '').trim(),
      compras_start: String(schedule.reportParams.compras_start || '').trim(),
      compras_end: String(schedule.reportParams.compras_end || '').trim(),
      departamento: String(schedule.reportParams.departamento || '').trim(),
      proveedor: String(schedule.reportParams.proveedor || '').trim(),
      tipooc: String(schedule.reportParams.tipooc || '').trim(),
      estado: String(schedule.reportParams.estado || '').trim(),
    });
    const rows = ((response?.data || []) as Array<Record<string, unknown>>);
    return {
      headers: ['N° OC', 'Fecha', 'Proveedor', 'Responsable', 'Departamento', 'Cumplido %', 'Estado', 'Total'],
      dataRows: rows.map((row) => [
        String(row.nroordcomp || 'oc'),
        formatScheduledDate(row.fechaorden),
        String(row.razonsocial || '-'),
        String(row.responsable || '-'),
        String(row.descrip || '-'),
        formatScheduledCurrency(row.porccumplido, 2),
        String(row.estado || '-'),
        formatScheduledCurrency(row.total),
      ]),
    };
  }

  if (schedule.reportKey === 'stock.stock_valorizado') {
    const response = await getStockValorizado({
      empresa,
      sucursal: String(schedule.reportParams.sucursal || '').trim(),
      deposito: String(schedule.reportParams.deposito || '').trim(),
      estado: String(schedule.reportParams.estado || '').trim(),
      tipo: String(schedule.reportParams.tipo || '').trim(),
      familia: String(schedule.reportParams.familia || '').trim(),
      grupo: String(schedule.reportParams.grupo || '').trim(),
      existencia: String(schedule.reportParams.existencia || '').trim(),
      moneda: String(schedule.reportParams.moneda || 'L').trim() || 'L',
      costeo: String(schedule.reportParams.costeo || 'P').trim() || 'P',
    });
    const rows = ((response?.data || []) as Array<Record<string, unknown>>);
    return {
      headers: ['Articulo', 'Descripcion', 'Sucursal', 'Deposito', 'Existencia', 'Costo', 'Valor total'],
      dataRows: rows.map((row) => {
        const costo = scheduleNum(row.costo);
        const existencia = scheduleNum(row.total_existencia);
        return [
          String(row.cod_articulo || row.cod_original || '-'),
          String(row.des_art || '-'),
          String(row.des_sucursal || row.cod_sucursal || '-'),
          String(row.des_deposito || row.cod_deposito || '-'),
          formatScheduledCurrency(existencia, 2),
          formatScheduledCurrency(costo),
          formatScheduledCurrency(costo * existencia),
        ];
      }),
    };
  }

  if (schedule.reportKey === 'stock.stock_existencia') {
    const response = await getStockExistenciaDeposito({
      empresa,
      sucursal: String(schedule.reportParams.sucursal || '').trim(),
      deposito: String(schedule.reportParams.deposito || '').trim(),
      estado: String(schedule.reportParams.estado || '').trim(),
      tipo: String(schedule.reportParams.tipo || '').trim(),
      familia: String(schedule.reportParams.familia || '').trim(),
      grupo: String(schedule.reportParams.grupo || '').trim(),
      existencia: String(schedule.reportParams.existencia || '').trim(),
    });
    const rows = ((response?.data || []) as Array<Record<string, unknown>>);
    return {
      headers: ['Articulo', 'Descripcion', 'Familia', 'Deposito', 'Existencia', 'Pto. pedido', 'Estado'],
      dataRows: rows.map((row) => {
        const existencia = scheduleNum(row.existencia);
        const puntoPedido = scheduleNum(row.pto_pedido);
        const estado = existencia <= 0 ? 'Sin stock' : existencia <= puntoPedido && puntoPedido > 0 ? 'Bajo minimo' : 'OK';
        return [
          String(row.cod_articulo || row.cod_original || '-'),
          String(row.des_art || row.referencia || '-'),
          String(row.des_familia || row.cod_familia || '-'),
          String(row.cod_deposito || '-'),
          formatScheduledCurrency(existencia, 2),
          formatScheduledCurrency(puntoPedido, 2),
          estado,
        ];
      }),
    };
  }

  if (schedule.reportKey === 'stock.costo_articulo_full') {
    const rows = await loadScheduledCostoArticuloFullRows({
      empresa,
      articulo: String(effectiveParams.articulo || '').trim(),
      tipo: String(effectiveParams.tipo || '').trim(),
      estado: String(effectiveParams.estado || '').trim(),
      fechad: String(effectiveParams.fechad || '').trim(),
      fechah: String(effectiveParams.fechah || '').trim(),
      calcular_empresa: String(effectiveParams.calcular_empresa || '').trim(),
      ecuacion_mat: String(effectiveParams.ecuacion_mat || '').trim(),
      periodo: String(effectiveParams.periodo || '').trim(),
      anho: String(effectiveParams.anho || '').trim(),
      fecha_inicio_desde: String(effectiveParams.fecha_inicio_desde || '').trim(),
      fecha_inicio_hasta: String(effectiveParams.fecha_inicio_hasta || '').trim(),
      fecha_fin_desde: String(effectiveParams.fecha_fin_desde || '').trim(),
      fecha_fin_hasta: String(effectiveParams.fecha_fin_hasta || '').trim(),
      recalcular: String(effectiveParams.recalcular || '').trim(),
    });
    const ecuacionMat = String(effectiveParams.ecuacion_mat || '').trim().toUpperCase() === 'S';
    if (ecuacionMat) {
      return {
        headers: [
          'AÑO',
          'MES',
          'CODIGO PY',
          'CODIGO PY REACOND.',
          'PRODUCTO',
          'FOB U$S (CARTILLA EN ORIGEN)',
          '% CTO. TOTAL IMPORT.',
          'CTO. TOTAL USD (ACTUAL)',
          'SERV. COLOCACION STICKER / ENGOMADO GS.',
          'SERV. COLOCACION PROSPECTO GS.',
          'SERVICIO MO GS.',
          'ESTUCHE GS.',
          'PROSPECTO GS.',
          'INKJET GS.',
          'STICKER / SELLO DE SEGURIDAD',
          'SOLVENTE / CUCHARA',
          'TOTAL COSTO PRODUCCION GS.',
          'TOTAL COSTO PRODUCCION U$S',
          'COSTO TOTAL FINAL U$S',
        ],
        dataRows: rows.map((row) => [
          String(row.anio || '-'),
          String(row.mes || '-'),
          String(row.cod_articulo || '-'),
          String(row.cod_pt_reacondicionado || '-'),
          String(row.des_art || '-'),
          formatScheduledCurrency(row.fob_usd_origen, 2),
          formatScheduledCurrency(row.porcentaje_costo_total_importacion, 2),
          formatScheduledCurrency(row.costo_total_us_actual, 2),
          formatScheduledCurrency(row.servicio_clasificacion_director),
          formatScheduledCurrency(row.servicio_clasificacion_proveedor),
          formatScheduledCurrency(row.servicio_no_gr),
          formatScheduledCurrency(row.estuche_gr),
          formatScheduledCurrency(row.prospecto_gr),
          formatScheduledCurrency(row.inkjet_gr),
          formatScheduledCurrency(row.sticker_sello_seguridad),
          formatScheduledCurrency(row.solvente_celofane),
          formatScheduledCurrency(row.total_costo_produccion_gs),
          formatScheduledCurrency(row.total_costo_produccion_us, 2),
          formatScheduledCurrency(row.costo_total_final_us, 2),
        ]),
        warning: 'Informe generado en modo Ecuacion BC materiales.',
      };
    }

    return {
      headers: ['Codigo', 'Descripcion', 'Tipo', 'Estado', 'Costo Promedio Gs', 'Costo Ultimo Gs', 'Costo Promedio U$', 'Costo Ultimo U$', 'Moneda', 'IVA', 'Existencia'],
      dataRows: rows.map((row) => [
        String(row.cod_articulo || '-'),
        String(row.des_art || '-'),
        String(row.cod_tp_art || '-'),
        String(row.estado || '-'),
        formatScheduledCurrency(row.cto_prom_gs),
        formatScheduledCurrency(row.cto_ult_gs),
        formatScheduledCurrency(row.cto_prom_me, 2),
        formatScheduledCurrency(row.cto_ult_me, 2),
        String(row.codmoneda || '-'),
        String(row.iva ?? row.cod_iva ?? '-'),
        formatScheduledCurrency(row.existencia, 2),
      ]),
    };
  }

  throw new Error('El informe programado todavia no soporta adjuntos automáticos.');
}

function buildBalanceExcelAttachment(
  schedule: ReportScheduleRecord,
  rows: BalanceRow[],
  moneda: string,
  effectiveParams = schedule.reportParams,
) {
  const { headers, dataRows } = buildScheduledBalanceTable(rows, moneda);
  const metaRows = buildScheduleDisplayParams(schedule, effectiveParams)
    .map(
      ([key, value]) =>
        `<tr><td style="border:1px solid #dbe5f0;padding:6px 10px;background:#f8fafc;font-weight:700;">${escapeHtml(key.replace(/_/g, ' '))}</td><td style="border:1px solid #dbe5f0;padding:6px 10px;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
  const header = headers.map((item) => `<th style="border:1px solid #cbd5e1;padding:6px 8px;background:#eaf2f8;">${escapeHtml(item)}</th>`).join('');
  const body = dataRows
    .map((row) => `<tr>${row.map((cell) => `<td style="border:1px solid #cbd5e1;padding:6px 8px;">${escapeHtml(cell)}</td>`).join('')}</tr>`)
    .join('');

  const content =
    '<html><head><meta charset="utf-8"></head><body style="font-family:Arial,Helvetica,sans-serif;">' +
    `<h1 style="font-size:22px;">${escapeHtml(schedule.reportTitle)}</h1>` +
    '<table style="border-collapse:collapse;margin:12px 0 18px 0;">' +
    metaRows +
    '</table>' +
    `<table style="border-collapse:collapse;width:100%;"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>` +
    '</body></html>';

  return {
    filename: `${schedule.reportKey.replace(/[^\w.-]+/g, '_')}.xls`,
    content,
    contentType: 'application/vnd.ms-excel;charset=utf-8;',
  };
}

async function buildBalancePdfAttachment(
  schedule: ReportScheduleRecord,
  rows: BalanceRow[],
  moneda: string,
  branding?: BrandingConfigRecord | null,
  resultLocal = 0,
  resultME = 0,
  effectiveParams = schedule.reportParams,
) {
  const { headers, dataRows } = buildScheduledBalanceTable(rows, moneda);
  const logoBuffer = await loadPdfImageBuffer(branding?.logoUrl);
  const doc = new PDFDocument({
    size: 'A4',
    margin: 36,
    bufferPages: true,
  });
  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

  if (logoBuffer) {
    doc.image(logoBuffer, 36, 34, { fit: [64, 64], valign: 'center' });
  } else {
    doc.roundedRect(36, 34, 64, 64, 12).fill('#e0f2fe');
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(18).text('MS', 55, 56, { width: 28, align: 'center' });
  }

  const headerLeft = 116;
  doc.fillColor('#0e7490').font('Helvetica-Bold').fontSize(10).text((branding?.clientName || 'Multisoft Informes').toUpperCase(), headerLeft, 38);
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(15).text(branding?.tagline || 'Informes Gerenciales', headerLeft, 56);
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(18).text(schedule.reportTitle, 36, 112, { align: 'left' });
  doc.moveTo(36, 140).lineTo(559, 140).strokeColor('#0891b2').lineWidth(1.5).stroke();
  doc.y = 150;
  doc.fontSize(10).fillColor('#475569').text(`Generado automaticamente · ${new Date().toLocaleString('es-PY')}`);
  doc.moveDown(1);
  doc.fontSize(7.4).fillColor('#0f172a');
  const widths = moneda === 'ambas'
    ? [62, 220, 105, 105]
    : [62, 215, 80, 80, 86];
  const columns = widths.reduce<number[]>((acc, width, index) => {
    if (index === 0) return [20];
    acc.push(acc[index - 1] + widths[index - 1] + 8);
    return acc;
  }, []);
  const rowHeight = 12;
  const drawHeader = (y: number) => {
    headers.forEach((header, index) => {
      doc.font('Helvetica-Bold').fontSize(7.8).text(header, columns[index], y, { width: widths[index] });
    });
  };

  drawHeader(doc.y);
  let currentY = doc.y + 18;
  for (const [index, row] of dataRows.entries()) {
    if (currentY > 760) {
      doc.addPage();
      currentY = 42;
      drawHeader(currentY);
      currentY += 18;
    }
    doc.fontSize(7.1);
    doc.font(index % 5 === 0 || balanceLevel(rows[index]) <= 2 ? 'Helvetica-Bold' : 'Helvetica');
    row.forEach((cell, cellIndex) => {
      const width = cellIndex === 1 ? 38 : 14;
      doc.text(
        padPdfCell(String(cell), width),
        columns[cellIndex],
        currentY,
        { width: widths[cellIndex], align: cellIndex > 1 ? 'right' : 'left' },
      );
    });
    currentY += rowHeight;
  }

  currentY += 10;
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a').text(
    `RESULTADO DEL EJERCICIO (+) ${resultLocal >= 0 ? 'Utilidad' : 'Perdida'} (-) Perdida : ${formatBalanceCurrency(Math.abs(resultLocal))} GS.`,
    36,
    currentY,
    { width: 520 },
  );

  if (moneda === 'ambas') {
    doc.font('Helvetica').fontSize(9).fillColor('#334155').text(
      `RESULTADO DEL EJERCICIO (+) ${resultME >= 0 ? 'Utilidad' : 'Perdida'} (-) Perdida : ${formatBalanceCurrency(Math.abs(resultME), 2)} U$S.`,
      36,
      currentY + 18,
      { width: 520 },
    );
  }

  doc.end();

  return new Promise<{ filename: string; content: Buffer; contentType: string }>((resolve) => {
    doc.on('end', () => {
      resolve({
        filename: `${schedule.reportKey.replace(/[^\w.-]+/g, '_')}.pdf`,
        content: Buffer.concat(chunks),
        contentType: 'application/pdf',
      });
    });
  });
}

function buildTabularExcelAttachment(
  schedule: ReportScheduleRecord,
  table: ScheduledAttachmentTable,
  effectiveParams = schedule.reportParams,
) {
  const header = table.headers
    .map((item) => `<th style="border:1px solid #cbd5e1;padding:6px 8px;background:#eaf2f8;">${escapeHtml(item)}</th>`)
    .join('');
  const body = table.dataRows
    .map((row) => `<tr>${row.map((cell) => `<td style="border:1px solid #cbd5e1;padding:6px 8px;">${escapeHtml(cell)}</td>`).join('')}</tr>`)
    .join('');
  const metaRows = buildScheduleDisplayParams(schedule, effectiveParams)
    .map(
      ([key, value]) =>
        `<tr><td style="border:1px solid #dbe5f0;padding:6px 10px;background:#f8fafc;font-weight:700;">${escapeHtml(key.replace(/_/g, ' '))}</td><td style="border:1px solid #dbe5f0;padding:6px 10px;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  const content =
    '<html><head><meta charset="utf-8"></head><body style="font-family:Arial,Helvetica,sans-serif;">' +
    `<h1 style="font-size:22px;">${escapeHtml(schedule.reportTitle)}</h1>` +
    (table.warning ? `<p style="color:#475569;font-size:13px;margin:8px 0 12px 0;">${escapeHtml(table.warning)}</p>` : '') +
    '<table style="border-collapse:collapse;margin:12px 0 18px 0;">' +
    metaRows +
    '</table>' +
    `<table style="border-collapse:collapse;width:100%;"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>` +
    '</body></html>';

  return {
    filename: `${schedule.reportKey.replace(/[^\w.-]+/g, '_')}.xls`,
    content,
    contentType: 'application/vnd.ms-excel;charset=utf-8;',
  };
}

function buildTabularPdfAttachment(
  schedule: ReportScheduleRecord,
  table: ScheduledAttachmentTable,
  effectiveParams = schedule.reportParams,
) {
  const isCostoFullEquation = schedule.reportKey === 'stock.costo_articulo_full' && table.headers.length > 12;
  const doc = new PDFDocument({
    size: isCostoFullEquation ? 'A3' : 'A4',
    layout: isCostoFullEquation ? 'landscape' : 'portrait',
    margin: 36,
    bufferPages: true,
  });
  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

  doc.fontSize(18).fillColor('#0f172a').text(schedule.reportTitle, { align: 'left' });
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('#475569').text(`Generado automaticamente · ${new Date().toLocaleString('es-PY')}`);
  if (table.warning) {
    doc.moveDown(0.2);
    doc.fontSize(9).fillColor('#64748b').text(table.warning);
  }
  doc.moveDown(0.6);

  for (const [key, value] of buildScheduleDisplayParams(schedule, effectiveParams)) {
    const normalized = String(value || '').trim();
    if (!normalized) continue;
    doc.fontSize(9).fillColor('#0f172a').text(`${key.replace(/_/g, ' ')}: ${normalized}`);
  }

  doc.moveDown(0.8);
  doc.fontSize(10).fillColor('#0f172a');
  const tableLeft = doc.page.margins.left;
  const tableTop = doc.y;
  const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const columnGap = isCostoFullEquation ? 4 : 6;
  const widths = isCostoFullEquation
    ? [32, 30, 48, 54, 120, 48, 48, 50, 52, 52, 48, 44, 44, 42, 54, 48, 62, 62, 62]
    : (() => {
        const firstWidth = 72;
        const secondWidth = Math.min(220, Math.max(140, usableWidth - firstWidth - Math.max(1, table.headers.length - 2) * 58));
        const restWidth = table.headers.length > 2 ? Math.max(56, Math.floor((usableWidth - firstWidth - secondWidth) / (table.headers.length - 2))) : 0;
        return table.headers.map((_, index) => (index === 0 ? firstWidth : index === 1 ? secondWidth : restWidth));
      })();
  const columns = widths.reduce<number[]>((acc, width, index) => {
    if (index === 0) return [tableLeft];
    acc.push(acc[index - 1] + widths[index - 1] + columnGap);
    return acc;
  }, []);
  const headerFontSize = isCostoFullEquation ? 6.2 : 10;
  const bodyFontSize = isCostoFullEquation ? 6.3 : 10;
  const rowHeight = isCostoFullEquation ? 11 : 14;
  const headerHeight = isCostoFullEquation ? 34 : 18;
  const pageBottom = doc.page.height - doc.page.margins.bottom;
  const numericStartIndex = isCostoFullEquation ? 5 : 2;

  const drawHeader = (y: number) => {
    doc.font('Helvetica-Bold').fontSize(headerFontSize).fillColor('#0f172a');
    table.headers.forEach((header, index) => {
      doc.text(header, columns[index], y, {
        width: widths[index],
        align: index >= numericStartIndex ? 'right' : 'left',
      });
    });
  };

  drawHeader(tableTop);
  let currentY = tableTop + headerHeight;
  for (const row of table.dataRows) {
    if (currentY + rowHeight > pageBottom) {
      doc.addPage();
      drawHeader(doc.page.margins.top);
      currentY = doc.page.margins.top + headerHeight;
    }
    doc.font('Helvetica').fontSize(bodyFontSize).fillColor('#0f172a');
    row.forEach((cell, cellIndex) => {
      const widthHint = isCostoFullEquation
        ? (cellIndex === 4 ? 24 : cellIndex >= numericStartIndex ? 10 : 12)
        : (cellIndex === 1 ? 34 : cellIndex > 1 ? 12 : 18);
      doc.text(
        padPdfCell(String(cell), widthHint),
        columns[cellIndex],
        currentY,
        { width: widths[cellIndex], align: cellIndex >= numericStartIndex ? 'right' : 'left' },
      );
    });
    currentY += rowHeight;
  }

  doc.end();

  return new Promise<{ filename: string; content: Buffer; contentType: string }>((resolve) => {
    doc.on('end', () => {
      resolve({
        filename: `${schedule.reportKey.replace(/[^\w.-]+/g, '_')}.pdf`,
        content: Buffer.concat(chunks),
        contentType: 'application/pdf',
      });
    });
  });
}

function buildCarteraExcelAttachment(
  schedule: ReportScheduleRecord,
  report: ScheduledCarteraReportData,
  selectedBlocksInput?: unknown,
) {
  const metaRows = buildScheduleDisplayParams(schedule, report.effectiveParams)
    .map(
      ([key, value]) =>
        `<tr><td style="border:1px solid #dbe5f0;padding:6px 10px;background:#f8fafc;font-weight:700;">${escapeHtml(key.replace(/_/g, ' '))}</td><td style="border:1px solid #dbe5f0;padding:6px 10px;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  const buildSection = (block: SelectedTemplateBlock) => {
    const header = block.headers
      .map((item) => `<th style="border:1px solid #cbd5e1;padding:6px 8px;background:#eaf2f8;">${escapeHtml(item)}</th>`)
      .join('');
    const body = block.dataRows
      .map((row) => `<tr>${row.map((cell) => `<td style="border:1px solid #cbd5e1;padding:6px 8px;">${escapeHtml(cell)}</td>`).join('')}</tr>`)
      .join('');

    return (
      `<h2 style="font-size:18px;margin:18px 0 10px 0;">${escapeHtml(block.label)}</h2>` +
      (block.warning ? `<p style="color:#475569;font-size:13px;margin:0 0 10px 0;">${escapeHtml(block.warning)}</p>` : '') +
      `<table style="border-collapse:collapse;width:100%;margin-bottom:18px;"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`
    );
  };

  const selectedBlocks = selectCarteraBlocks(report, selectedBlocksInput);

  const executiveBody = [
    ['Saldo por cobrar', formatScheduledCurrency(report.totalCobrarSaldo)],
    ['Importe por cobrar', formatScheduledCurrency(report.totalCobrarImporte)],
    ['Saldo por pagar', formatScheduledCurrency(report.totalPagarSaldo)],
    ['Debitos por pagar', formatScheduledCurrency(report.totalPagarDebitos)],
    ['Neto de cartera', formatScheduledCurrency(report.netoCartera)],
    ['Cobertura', `${report.coverage.toFixed(2)}%`],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="border:1px solid #dbe5f0;padding:6px 10px;background:#f8fafc;font-weight:700;">${escapeHtml(label)}</td><td style="border:1px solid #dbe5f0;padding:6px 10px;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  const content =
    '<html><head><meta charset="utf-8"></head><body style="font-family:Arial,Helvetica,sans-serif;">' +
    `<h1 style="font-size:22px;">${escapeHtml(schedule.reportTitle)}</h1>` +
    '<table style="border-collapse:collapse;margin:12px 0 18px 0;">' +
    metaRows +
    '</table>' +
    '<h2 style="font-size:18px;margin:10px 0;">Resumen ejecutivo</h2>' +
    `<table style="border-collapse:collapse;width:100%;margin-bottom:18px;">${executiveBody}</table>` +
    selectedBlocks.map((block) => buildSection(block)).join('') +
    '</body></html>';

  return {
    filename: `${schedule.reportKey.replace(/[^\w.-]+/g, '_')}.xls`,
    content,
    contentType: 'application/vnd.ms-excel;charset=utf-8;',
  };
}

function getCarteraPdfLayout(block: SelectedTemplateBlock, usableWidth: number) {
  if (block.key === 'summary') {
    return {
      widths: [185, 120, 120, 135, Math.max(170, usableWidth - (185 + 120 + 120 + 135) - 24)],
      numericStartIndex: 1,
    };
  }

  if (block.key === 'receivables') {
    return {
      widths: [150, 74, 48, 170, 72, 78, 82, 82, Math.max(92, usableWidth - (150 + 74 + 48 + 170 + 72 + 78 + 82 + 82) - 48)],
      numericStartIndex: 6,
    };
  }

  if (block.key === 'payables') {
    return {
      widths: [230, 70, 95, 85, 85, Math.max(95, usableWidth - (230 + 70 + 95 + 85 + 85) - 30)],
      numericStartIndex: 2,
    };
  }

  const baseWidth = Math.max(72, Math.floor((usableWidth - Math.max(0, block.headers.length - 1) * 6) / Math.max(1, block.headers.length)));
  return {
    widths: block.headers.map(() => baseWidth),
    numericStartIndex: Math.max(2, block.headers.length - 3),
  };
}

async function buildCarteraPdfAttachment(
  schedule: ReportScheduleRecord,
  report: ScheduledCarteraReportData,
  branding?: BrandingConfigRecord | null,
  selectedBlocksInput?: unknown,
) {
  const logoBuffer = await loadPdfImageBuffer(branding?.logoUrl);
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 32,
    bufferPages: true,
  });
  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

  if (logoBuffer) {
    doc.image(logoBuffer, 32, 28, { fit: [70, 54], valign: 'center' });
  } else {
    doc.roundedRect(32, 28, 70, 54, 10).fill('#e0f2fe');
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(18).text('MS', 54, 47, { width: 26, align: 'center' });
  }

  const headerLeft = 116;
  doc.fillColor('#0e7490').font('Helvetica-Bold').fontSize(10).text((branding?.clientName || 'Multisoft Informes').toUpperCase(), headerLeft, 32);
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(15).text(branding?.tagline || 'Informes Gerenciales', headerLeft, 50);
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(18).text(schedule.reportTitle, 32, 96, { align: 'left' });
  doc.moveTo(32, 122).lineTo(810, 122).strokeColor('#0891b2').lineWidth(1.5).stroke();
  doc.y = 132;
  doc.fontSize(10).fillColor('#475569').text(`Generado automaticamente · ${new Date().toLocaleString('es-PY')}`);
  doc.moveDown(0.8);

  for (const [key, value] of buildScheduleDisplayParams(schedule, report.effectiveParams)) {
    const normalized = String(value || '').trim();
    if (!normalized) continue;
    doc.fontSize(9).fillColor('#0f172a').text(`${key.replace(/_/g, ' ')}: ${normalized}`);
  }

  doc.moveDown(0.8);
  doc.roundedRect(32, doc.y, 778, 72, 16).fill('#ecfeff');
  const kpiTop = doc.y + 12;
  const kpiItems = [
    ['Saldo por cobrar', formatScheduledCurrency(report.totalCobrarSaldo)],
    ['Saldo por pagar', formatScheduledCurrency(report.totalPagarSaldo)],
    ['Neto de cartera', formatScheduledCurrency(report.netoCartera)],
    ['Cobertura', `${report.coverage.toFixed(2)}%`],
  ];
  kpiItems.forEach(([label, value], index) => {
    const left = 48 + index * 190;
    doc.fillColor('#0e7490').font('Helvetica-Bold').fontSize(9).text(label, left, kpiTop, { width: 160 });
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(13).text(value, left, kpiTop + 18, { width: 160 });
  });

  doc.y += 92;

  const selectedBlocks = selectCarteraBlocks(report, selectedBlocksInput);

  const drawSection = (block: SelectedTemplateBlock) => {
    if (doc.y > 500) {
      doc.addPage();
      doc.y = 32;
    }

    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(13).text(block.label, 32, doc.y);
    doc.moveDown(0.3);
    if (block.warning) {
      doc.font('Helvetica').fontSize(8.5).fillColor('#64748b').text(block.warning);
      doc.moveDown(0.3);
    }

    const tableLeft = 32;
    const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnGap = 6;
    const layout = getCarteraPdfLayout(block, usableWidth);
    const widths = layout.widths;
    const columns = widths.reduce<number[]>((acc, width, index) => {
      if (index === 0) return [tableLeft];
      acc.push(acc[index - 1] + widths[index - 1] + columnGap);
      return acc;
    }, []);
    const numericStartIndex = layout.numericStartIndex;

    const drawHeader = (y: number) => {
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#0f172a');
      block.headers.forEach((header, index) => {
        doc.text(header, columns[index], y, {
          width: widths[index],
          align: index >= numericStartIndex ? 'right' : 'left',
        });
      });
    };

    drawHeader(doc.y);
    let currentY = doc.y + 20;
    const pageBottom = doc.page.height - doc.page.margins.bottom;

    for (const row of block.dataRows) {
      const rowHeight = Math.max(
        ...row.map((cell, cellIndex) => {
          doc.font('Helvetica').fontSize(7.5);
          return doc.heightOfString(String(cell || '-'), {
            width: widths[cellIndex],
            align: cellIndex >= numericStartIndex ? 'right' : 'left',
          });
        }),
        10,
      ) + 4;

      if (currentY + rowHeight > pageBottom) {
        doc.addPage();
        doc.y = 32;
        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(13).text(block.label, 32, doc.y);
        doc.moveDown(0.6);
        drawHeader(doc.y);
        currentY = doc.y + 20;
      }

      doc.font('Helvetica').fontSize(7.5).fillColor('#0f172a');
      row.forEach((cell, cellIndex) => {
        doc.text(
          String(cell || '-'),
          columns[cellIndex],
          currentY,
          {
            width: widths[cellIndex],
            align: cellIndex >= numericStartIndex ? 'right' : 'left',
            lineBreak: true,
          },
        );
      });
      currentY += rowHeight;
    }

    doc.y = currentY + 10;
  };

  selectedBlocks.forEach((block) => drawSection(block));

  doc.end();

  return new Promise<{ filename: string; content: Buffer; contentType: string }>((resolve) => {
    doc.on('end', () => {
      resolve({
        filename: `${schedule.reportKey.replace(/[^\w.-]+/g, '_')}.pdf`,
        content: Buffer.concat(chunks),
        contentType: 'application/pdf',
      });
    });
  });
}

function buildVentasComprasExcelAttachment(
  schedule: ReportScheduleRecord,
  report: ScheduledVentasComprasReportData,
  selectedBlocksInput?: unknown,
) {
  const metaRows = buildScheduleDisplayParams(schedule, report.effectiveParams)
    .map(
      ([key, value]) =>
        `<tr><td style="border:1px solid #dbe5f0;padding:6px 10px;background:#f8fafc;font-weight:700;">${escapeHtml(key.replace(/_/g, ' '))}</td><td style="border:1px solid #dbe5f0;padding:6px 10px;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  const buildSection = (block: SelectedTemplateBlock) => {
    const header = block.headers
      .map((item) => `<th style="border:1px solid #cbd5e1;padding:6px 8px;background:#eaf2f8;">${escapeHtml(item)}</th>`)
      .join('');
    const body = block.dataRows
      .map((row) => `<tr>${row.map((cell) => `<td style="border:1px solid #cbd5e1;padding:6px 8px;">${escapeHtml(cell)}</td>`).join('')}</tr>`)
      .join('');

    return (
      `<h2 style="font-size:18px;margin:18px 0 10px 0;">${escapeHtml(block.label)}</h2>` +
      (block.warning ? `<p style="color:#475569;font-size:13px;margin:0 0 10px 0;">${escapeHtml(block.warning)}</p>` : '') +
      `<table style="border-collapse:collapse;width:100%;margin-bottom:18px;"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`
    );
  };

  const selectedBlocks = selectVentasComprasBlocks(report, selectedBlocksInput);
  const executiveBody = [
    ['Facturado visible', formatScheduledCurrency(report.totalFacturado)],
    ['Comprado visible', formatScheduledCurrency(report.totalComprado)],
    ['Neto comercial', formatScheduledCurrency(report.netoComercial)],
    ['Ratio ventas/compras', report.ventasVsComprasRatio.toFixed(2)],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="border:1px solid #dbe5f0;padding:6px 10px;background:#f8fafc;font-weight:700;">${escapeHtml(label)}</td><td style="border:1px solid #dbe5f0;padding:6px 10px;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  const content =
    '<html><head><meta charset="utf-8"></head><body style="font-family:Arial,Helvetica,sans-serif;">' +
    `<h1 style="font-size:22px;">${escapeHtml(schedule.reportTitle)}</h1>` +
    '<table style="border-collapse:collapse;margin:12px 0 18px 0;">' +
    metaRows +
    '</table>' +
    '<h2 style="font-size:18px;margin:10px 0;">Resumen ejecutivo</h2>' +
    `<table style="border-collapse:collapse;width:100%;margin-bottom:18px;">${executiveBody}</table>` +
    selectedBlocks.map((block) => buildSection(block)).join('') +
    '</body></html>';

  return {
    filename: `${schedule.reportKey.replace(/[^\w.-]+/g, '_')}.xls`,
    content,
    contentType: 'application/vnd.ms-excel;charset=utf-8;',
  };
}

async function buildVentasComprasPdfAttachment(
  schedule: ReportScheduleRecord,
  report: ScheduledVentasComprasReportData,
  branding?: BrandingConfigRecord | null,
  selectedBlocksInput?: unknown,
) {
  const logoBuffer = await loadPdfImageBuffer(branding?.logoUrl);
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 32,
    bufferPages: true,
  });
  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

  if (logoBuffer) {
    doc.image(logoBuffer, 32, 28, { fit: [70, 54], valign: 'center' });
  } else {
    doc.roundedRect(32, 28, 70, 54, 10).fill('#e0f2fe');
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(18).text('MS', 54, 47, { width: 26, align: 'center' });
  }

  const headerLeft = 116;
  doc.fillColor('#0e7490').font('Helvetica-Bold').fontSize(10).text((branding?.clientName || 'Multisoft Informes').toUpperCase(), headerLeft, 32);
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(15).text(branding?.tagline || 'Informes Gerenciales', headerLeft, 50);
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(18).text(schedule.reportTitle, 32, 96, { align: 'left' });
  doc.moveTo(32, 122).lineTo(810, 122).strokeColor('#0891b2').lineWidth(1.5).stroke();
  doc.y = 132;
  doc.fontSize(10).fillColor('#475569').text(`Generado automaticamente · ${new Date().toLocaleString('es-PY')}`);
  doc.moveDown(0.8);

  for (const [key, value] of buildScheduleDisplayParams(schedule, report.effectiveParams)) {
    const normalized = String(value || '').trim();
    if (!normalized) continue;
    doc.fontSize(9).fillColor('#0f172a').text(`${key.replace(/_/g, ' ')}: ${normalized}`);
  }

  doc.moveDown(0.8);
  doc.roundedRect(32, doc.y, 778, 72, 16).fill('#eff6ff');
  const kpiTop = doc.y + 12;
  const kpiItems = [
    ['Facturado', formatScheduledCurrency(report.totalFacturado)],
    ['Comprado', formatScheduledCurrency(report.totalComprado)],
    ['Neto', formatScheduledCurrency(report.netoComercial)],
    ['Ratio', report.ventasVsComprasRatio.toFixed(2)],
  ];
  kpiItems.forEach(([label, value], index) => {
    const left = 48 + index * 190;
    doc.fillColor('#0e7490').font('Helvetica-Bold').fontSize(9).text(label, left, kpiTop, { width: 160 });
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(13).text(value, left, kpiTop + 18, { width: 160 });
  });

  doc.y += 92;
  const selectedBlocks = selectVentasComprasBlocks(report, selectedBlocksInput);

  const drawSection = (block: SelectedTemplateBlock) => {
    if (doc.y > 500) {
      doc.addPage();
      doc.y = 32;
    }

    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(13).text(block.label, 32, doc.y);
    doc.moveDown(0.3);
    if (block.warning) {
      doc.font('Helvetica').fontSize(8.5).fillColor('#64748b').text(block.warning);
      doc.moveDown(0.3);
    }

    const tableLeft = 32;
    const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const widths = block.headers.length <= 5
      ? [170, 100, 100, 100, 240]
      : block.key === 'sales'
        ? [86, 100, 160, 90, 62, 72, 72, 72, 74]
        : [72, 110, 180, 100, 72, 72, 72, 82];
    const columnGap = 6;
    const columns = widths.reduce<number[]>((acc, width, index) => {
      if (index === 0) return [tableLeft];
      acc.push(acc[index - 1] + widths[index - 1] + columnGap);
      return acc;
    }, []);
    const pageBottom = doc.page.height - doc.page.margins.bottom;
    const numericStartIndex = block.key === 'summary' ? 1 : (block.key === 'sales' ? 5 : 4);

    const drawHeader = (y: number) => {
      doc.font('Helvetica-Bold').fontSize(8.2).fillColor('#0f172a');
      block.headers.forEach((header, index) => {
        doc.text(header, columns[index], y, {
          width: widths[index] || Math.floor(usableWidth / Math.max(1, block.headers.length)),
          align: index >= numericStartIndex ? 'right' : 'left',
        });
      });
    };

    drawHeader(doc.y);
    let currentY = doc.y + 18;

    for (const row of block.dataRows) {
      if (currentY + 12 > pageBottom) {
        doc.addPage();
        doc.y = 32;
        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(13).text(block.label, 32, doc.y);
        doc.moveDown(0.6);
        drawHeader(doc.y);
        currentY = doc.y + 18;
      }

      doc.font('Helvetica').fontSize(8).fillColor('#0f172a');
      row.forEach((cell, cellIndex) => {
        const widthHint = cellIndex >= numericStartIndex ? 12 : 22;
        doc.text(
          padPdfCell(String(cell), widthHint),
          columns[cellIndex],
          currentY,
          { width: widths[cellIndex], align: cellIndex >= numericStartIndex ? 'right' : 'left' },
        );
      });
      currentY += 12;
    }

    doc.y = currentY + 10;
  };

  selectedBlocks.forEach((block) => drawSection(block));
  doc.end();

  return new Promise<{ filename: string; content: Buffer; contentType: string }>((resolve) => {
    doc.on('end', () => {
      resolve({
        filename: `${schedule.reportKey.replace(/[^\w.-]+/g, '_')}.pdf`,
        content: Buffer.concat(chunks),
        contentType: 'application/pdf',
      });
    });
  });
}

async function resolveReportScheduleRecipients(schedule: ReportScheduleRecord) {
  const emails = new Set<string>(normalizeScheduleEmails(schedule.extraEmails));
  const labels: string[] = [];

  if (schedule.recipientUserIds.length > 0) {
    const usersResult = await pool.query<Record<string, unknown>>(
      `
        SELECT id, username, first_name, last_name, email
        FROM auth_user
        WHERE id = ANY($1::int[])
          AND is_active = TRUE
      `,
      [schedule.recipientUserIds],
    );

    for (const row of usersResult.rows) {
      const email = String(row.email || '').trim().toLowerCase();
      if (email) emails.add(email);
      labels.push(displayFullName(row, 'first_name', 'last_name', 'username'));
    }
  } else {
    labels.push(...schedule.recipientUsers.map((item) => item.label));
  }

  return {
    emails: [...emails],
    labels: Array.from(new Set(labels.filter(Boolean))),
  };
}

async function createReportScheduleExecutionLog(input: {
  scheduleId: number;
  status: 'success' | 'error';
  sentCount: number;
  message: string;
}) {
  await ensureReportScheduleTables();
  await pool.query(
    `
      INSERT INTO custom_permissions_reportschedulelog
        (schedule_id, status, sent_count, message)
      VALUES
        ($1::int, $2::varchar(20), $3::int, $4::text)
    `,
    [input.scheduleId, input.status, input.sentCount, String(input.message || '').trim()],
  );
}

async function sendScheduledReportEmail(schedule: ReportScheduleRecord, origin?: string) {
  const recipients = await resolveReportScheduleRecipients(schedule);
  if (recipients.emails.length === 0) {
    throw new Error('La programacion no tiene correos validos para enviar el informe.');
  }

  const isBalanceSchedule = ['finanzas.balance_general', 'finanzas.balance_general_puc'].includes(schedule.reportKey);
  const isCarteraSchedule = schedule.reportKey === 'cartera.unificada';
  const isTemplateCarteraSchedule = schedule.reportKey === 'plantillas.cartera_bloques';
  const isTemplateVentasComprasSchedule = schedule.reportKey === 'plantillas.ventas_compras_bloques';
  let resolvedExcelAttachment: { filename: string; content: Buffer | string; contentType?: string };
  let resolvedPdfAttachment: { filename: string; content: Buffer | string; contentType?: string };
  let scheduledResultSummary = '';
  const effectiveParams = resolveScheduledReportParams(schedule);
  const empresa = String(effectiveParams.empresa || '').trim();
  const branding = empresa ? await loadBrandingConfig(empresa) : await loadBrandingConfig('GLOBAL');

  if (isBalanceSchedule) {
    const reportData = await loadScheduledBalanceReportData(schedule);
    resolvedExcelAttachment = buildBalanceExcelAttachment(schedule, reportData.rows, reportData.moneda, reportData.effectiveParams);
    resolvedPdfAttachment = await buildBalancePdfAttachment(
      schedule,
      reportData.rows,
      reportData.moneda,
      branding,
      reportData.resultadoLocal,
      reportData.resultadoME,
      reportData.effectiveParams,
    );
    const resultLabelLocal = reportData.resultadoLocal >= 0 ? 'Utilidad' : 'Perdida';
    const resultLabelME = reportData.resultadoME >= 0 ? 'Utilidad' : 'Perdida';
    scheduledResultSummary = reportData.moneda === 'ambas'
      ? `Resultado del ejercicio: ${resultLabelLocal} ${formatBalanceCurrency(Math.abs(reportData.resultadoLocal))} GS. / ${resultLabelME} ${formatBalanceCurrency(Math.abs(reportData.resultadoME), 2)} U$S.`
      : `Resultado del ejercicio: ${resultLabelLocal} ${formatBalanceCurrency(Math.abs(reportData.resultadoLocal))} GS.`;
  } else if (isCarteraSchedule) {
    const reportData = await loadScheduledCarteraReportData(schedule);
    resolvedExcelAttachment = buildCarteraExcelAttachment(schedule, reportData);
    resolvedPdfAttachment = await buildCarteraPdfAttachment(schedule, reportData, branding);
    scheduledResultSummary = `Neto de cartera: ${formatScheduledCurrency(reportData.netoCartera)} | Cobertura: ${reportData.coverage.toFixed(2)}%.`;
  } else if (isTemplateCarteraSchedule) {
    const templateId = Number(schedule.reportParams.template_id || 0);
    const template = templateId
      ? await loadReportTemplateById({ templateId, actorUserId: 0, actorIsSuperuser: true })
      : null;
    const reportData = await loadScheduledCarteraReportData({
      ...schedule,
      reportTitle: template?.name || schedule.reportTitle,
    });
    const templateConfig = (template?.config || {}) as Record<string, unknown>;
    const selectedBlocks = templateConfig.blocks;
    resolvedExcelAttachment = buildCarteraExcelAttachment(
      { ...schedule, reportTitle: template?.name || schedule.reportTitle },
      reportData,
      selectedBlocks,
    );
    resolvedPdfAttachment = await buildCarteraPdfAttachment(
      { ...schedule, reportTitle: template?.name || schedule.reportTitle },
      reportData,
      branding,
      selectedBlocks,
    );
    scheduledResultSummary = `Plantilla: ${template?.name || schedule.reportTitle} | Neto de cartera: ${formatScheduledCurrency(reportData.netoCartera)} | Cobertura: ${reportData.coverage.toFixed(2)}%.`;
  } else if (isTemplateVentasComprasSchedule) {
    const templateId = Number(schedule.reportParams.template_id || 0);
    const template = templateId
      ? await loadReportTemplateById({ templateId, actorUserId: 0, actorIsSuperuser: true })
      : null;
    const reportData = await loadScheduledVentasComprasReportData({
      ...schedule,
      reportTitle: template?.name || schedule.reportTitle,
    });
    const templateConfig = (template?.config || {}) as Record<string, unknown>;
    const selectedBlocks = templateConfig.blocks;
    resolvedExcelAttachment = buildVentasComprasExcelAttachment(
      { ...schedule, reportTitle: template?.name || schedule.reportTitle },
      reportData,
      selectedBlocks,
    );
    resolvedPdfAttachment = await buildVentasComprasPdfAttachment(
      { ...schedule, reportTitle: template?.name || schedule.reportTitle },
      reportData,
      branding,
      selectedBlocks,
    );
    scheduledResultSummary = `Plantilla: ${template?.name || schedule.reportTitle} | Facturado: ${formatScheduledCurrency(reportData.totalFacturado)} | Comprado: ${formatScheduledCurrency(reportData.totalComprado)} | Neto: ${formatScheduledCurrency(reportData.netoComercial)}.`;
  } else {
    const table = await loadScheduledTabularReportData(schedule);
    resolvedExcelAttachment = buildTabularExcelAttachment(schedule, table, effectiveParams);
    resolvedPdfAttachment = await buildTabularPdfAttachment(schedule, table, effectiveParams);
  }

  const baseUrl = resolvePublicBaseUrl(origin);
  const reportUrl = buildScheduledReportUrl(schedule, baseUrl, effectiveParams);
  const filters = buildScheduleDisplayParams(schedule, effectiveParams)
    .map(([key, value]) => ({
      label: key.replace(/_/g, ' '),
      value: String(value || '').trim(),
    }));

  const clientName = branding?.clientName || 'MultiSoft';
  const logoUrl = branding?.logoUrl || '';
  const intro = String(schedule.emailMessage || '').trim() || `Se genero el informe programado "${schedule.reportTitle}".`;
  const recipientsText = recipients.labels.length ? recipients.labels.join(', ') : recipients.emails.join(', ');
  const filtersText = filters.map((item) => `- ${item.label}: ${item.value}`).join('\n');
  const filtersHtml = filters
    .map(
      (item) =>
        `<tr><td style="padding:8px 12px;border:1px solid #dbe5f0;background:#f8fafc;font-weight:700;color:#475569;">${item.label}</td><td style="padding:8px 12px;border:1px solid #dbe5f0;color:#0f172a;">${escapeHtml(item.value)}</td></tr>`,
    )
    .join('');

  const logoBlock = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(clientName)}" style="height:52px;max-width:220px;object-fit:contain;border-radius:12px;background:#fff;padding:6px;border:1px solid rgba(255,255,255,0.12);" />`
    : `<div style="display:inline-flex;height:52px;min-width:52px;align-items:center;justify-content:center;border-radius:14px;background:#0ea5e9;color:#fff;font-size:20px;font-weight:900;letter-spacing:0.22em;padding:0 14px;">MS</div>`;

  const subject = String(schedule.emailSubject || '').trim() || `Entrega automatica: ${schedule.reportTitle}`;
  const text =
    `${intro}\n\n` +
    `Informe: ${schedule.reportTitle}\n` +
    `Modulo: ${schedule.module}\n` +
    `Frecuencia: ${humanFrequencyLabel(schedule)}\n` +
    `Destinatarios: ${recipientsText}\n` +
    (scheduledResultSummary ? `${scheduledResultSummary}\n` : '') +
    (filtersText ? `\nFiltros:\n${filtersText}\n` : '\n') +
    `\nAbrir informe: ${reportUrl}\n`;
  const html =
    '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
    '<body style="margin:0;padding:0;background:#eef2f7;font-family:Segoe UI,Arial,sans-serif;color:#0f172a;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f7;padding:32px 16px;">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:760px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 45px rgba(15,23,42,0.12);">' +
    '<tr><td style="padding:28px 32px;background:linear-gradient(135deg,#071122 0%,#0c1730 48%,#0b1430 100%);">' +
    `${logoBlock}` +
    '<div style="margin-top:18px;font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:#67e8f9;">ENTREGA PROGRAMADA</div>' +
    `<h1 style="margin:16px 0 8px 0;font-size:30px;line-height:1.1;color:#ffffff;">${escapeHtml(schedule.reportTitle)}</h1>` +
    `<p style="margin:0;font-size:15px;line-height:1.8;color:#cbd5e1;">${escapeHtml(intro)}</p>` +
    '</td></tr>' +
    '<tr><td style="padding:32px;">' +
    `<p style="margin:0 0 18px 0;font-size:15px;line-height:1.8;color:#334155;">Modulo: <strong>${escapeHtml(schedule.module)}</strong><br />Frecuencia: <strong>${escapeHtml(humanFrequencyLabel(schedule))}</strong><br />Destinatarios: <strong>${escapeHtml(recipientsText)}</strong></p>` +
    (scheduledResultSummary
      ? `<div style="margin:0 0 20px 0;padding:14px 18px;border-radius:16px;background:#ecfeff;border:1px solid #a5f3fc;color:#0f172a;font-size:14px;font-weight:700;">${escapeHtml(scheduledResultSummary)}</div>`
      : '') +
    (filtersHtml
      ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 24px 0;">${filtersHtml}</table>`
      : '') +
    `<div style="margin:24px 0 0 0;"><a href="${escapeHtml(reportUrl)}" style="display:inline-block;padding:14px 22px;background:#050b23;color:#ffffff;text-decoration:none;border-radius:14px;font-size:15px;font-weight:700;">Abrir informe</a></div>` +
    '</td></tr>' +
    '</table>' +
    '</td></tr>' +
    '</table>' +
    '</body></html>';

  for (const email of recipients.emails) {
    await sendTransactionalEmail({
      to: email,
      subject,
      text,
      html,
      attachments: [resolvedExcelAttachment, resolvedPdfAttachment],
    });
  }

  return recipients.emails.length;
}

export async function sendDirectUserNotification(input: {
  actorUserId: number;
  targetUserId: number;
  title: string;
  message: string;
  href?: string;
  sendEmail?: boolean;
}) {
  await ensureTaskTables();

  const actorUserId = Number(input.actorUserId || 0);
  const targetUserId = Number(input.targetUserId || 0);
  const title = String(input.title || '').trim();
  const message = String(input.message || '').trim();

  if (!actorUserId) {
    throw new Error('El usuario actual no es valido.');
  }
  if (!targetUserId) {
    throw new Error('Debes seleccionar un usuario.');
  }
  if (!title) {
    throw new Error('El titulo del aviso es obligatorio.');
  }
  if (!message) {
    throw new Error('El mensaje del aviso es obligatorio.');
  }

  const userValidation = await pool.query<Record<string, unknown>>(
    `
      SELECT id, username, first_name, last_name, email, is_superuser
      FROM auth_user
      WHERE id = ANY($1::int[])
        AND is_active = TRUE
    `,
    [[actorUserId, targetUserId]],
  );

  const usersById = new Map(userValidation.rows.map((row) => [Number(row.id || 0), row]));
  if (!usersById.has(actorUserId)) {
    throw new Error('El usuario actual no es valido.');
  }
  if (!usersById.has(targetUserId)) {
    throw new Error('El usuario destinatario no esta disponible.');
  }
  if (isRestrictedCollaborationUser(usersById.get(targetUserId))) {
    throw new Error('Las cuentas administrativas no reciben avisos internos.');
  }

  await createUserNotification({
    userId: targetUserId,
    actorUserId,
    type: 'user_notice',
    title,
    message,
    href: String(input.href || '').trim(),
  });

  let emailSent = false;
  let emailWarning: string | null = null;

  if (input.sendEmail) {
    const actor = usersById.get(actorUserId) || {};
    const target = usersById.get(targetUserId) || {};
    const targetEmail = String(target.email || '').trim();

    if (!targetEmail) {
      emailWarning = 'El usuario destinatario no tiene un correo configurado.';
    } else {
      const actorName = displayFullName(actor, 'first_name', 'last_name', 'username');
      const targetName = displayFullName(target, 'first_name', 'last_name', 'username');
      const href = String(input.href || '').trim();

      const text =
        `Hola ${targetName},\n\n` +
        `${actorName} te envio un aviso desde MultiSoft.\n\n` +
        `Titulo: ${title}\n` +
        `Mensaje: ${message}\n` +
        (href ? `Enlace relacionado: ${href}\n` : '') +
        '\nTambien puedes ver este aviso dentro de la bandeja de notificaciones del sistema.\n';

      const html =
        '<!DOCTYPE html>' +
        '<html lang="es">' +
        '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
        '<body style="margin:0;padding:0;background:#eef2f7;font-family:Segoe UI,Arial,sans-serif;color:#0f172a;">' +
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f7;padding:32px 16px;">' +
        '<tr><td align="center">' +
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 45px rgba(15,23,42,0.12);">' +
        '<tr><td style="padding:24px 32px;background:linear-gradient(135deg,#071122 0%,#0c1730 48%,#0b1430 100%);">' +
        '<div style="display:inline-block;padding:8px 16px;border-radius:999px;border:1px solid rgba(34,211,238,0.28);background:rgba(34,211,238,0.08);font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:#67e8f9;">MULTISOFT</div>' +
        '<h1 style="margin:18px 0 8px 0;font-size:30px;line-height:1.1;color:#ffffff;">Aviso interno</h1>' +
        `<p style="margin:0;font-size:15px;line-height:1.8;color:#cbd5e1;">${actorName} te envio una notificacion desde la plataforma.</p>` +
        '</td></tr>' +
        '<tr><td style="padding:32px;">' +
        `<p style="margin:0 0 16px 0;font-size:16px;line-height:1.8;">Hola <strong>${targetName}</strong>,</p>` +
        `<div style="margin:0 0 18px 0;padding:16px 18px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;"><div style="font-size:12px;text-transform:uppercase;letter-spacing:0.18em;color:#0891b2;font-weight:700;margin-bottom:6px;">Titulo</div><div style="font-size:18px;font-weight:700;color:#0f172a;">${title}</div></div>` +
        `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.8;color:#334155;">${message}</p>` +
        (href
          ? `<div style="margin:24px 0 24px 0;"><a href="${href}" style="display:inline-block;padding:14px 22px;background:#050b23;color:#ffffff;text-decoration:none;border-radius:14px;font-size:15px;font-weight:700;">Abrir enlace relacionado</a></div>`
          : '') +
        '<p style="margin:0;font-size:14px;line-height:1.8;color:#64748b;">Tambien puedes ver este aviso dentro de la bandeja de notificaciones del sistema.</p>' +
        '</td></tr>' +
        '</table>' +
        '</td></tr>' +
        '</table>' +
        '</body></html>';

      try {
        await sendTransactionalEmail({
          to: targetEmail,
          subject: `${title} - MultiSoft`,
          text,
          html,
        });
        emailSent = true;
      } catch (error) {
        emailWarning = error instanceof Error ? error.message : 'No se pudo enviar el correo adicional.';
      }
    }
  }

  return {
    notifications: await loadNotificationsForUser(targetUserId),
    emailSent,
    emailWarning,
  };
}

export async function loadActiveUserOptions(actorUserId?: number) {
  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT id, username, first_name, last_name, is_superuser
      FROM auth_user
      WHERE is_active = TRUE
      ORDER BY username
    `,
  );

  return result.rows
    .filter((row) => !isRestrictedCollaborationUser(row))
    .map((row) => ({
      id: Number(row.id || 0),
      username: String(row.username || ''),
      label: displayFullName(row, 'first_name', 'last_name', 'username'),
      isCurrentUser: Number(row.id || 0) === Number(actorUserId || 0),
    }))
    .filter((row) => row.id > 0);
}

export async function loadTasksForUser(userId: number) {
  await ensureTaskTables();

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.module,
        t.target_url,
        t.due_date,
        t.created_by,
        t.assigned_to,
        t.created_at,
        t.updated_at,
        t.completed_at,
        assigned.username AS assigned_username,
        assigned.first_name AS assigned_first_name,
        assigned.last_name AS assigned_last_name,
        creator.username AS creator_username,
        creator.first_name AS creator_first_name,
        creator.last_name AS creator_last_name
      FROM custom_permissions_task t
      INNER JOIN auth_user assigned ON assigned.id = t.assigned_to
      INNER JOIN auth_user creator ON creator.id = t.created_by
      WHERE t.assigned_to = $1::int OR t.created_by = $1::int
      ORDER BY
        CASE t.status
          WHEN 'pendiente' THEN 0
          WHEN 'en_proceso' THEN 1
          ELSE 2
        END,
        t.updated_at DESC,
        t.id DESC
    `,
    [userId],
  );

  const tasks = result.rows.map((row) => normalizeTaskRow(row, userId));
  return {
    assigned: tasks.filter((task) => task.isAssignedToMe),
    created: tasks.filter((task) => task.isCreatedByMe),
    all: tasks,
  };
}

export async function loadNotificationsForUser(userId: number, limit = 20) {
  await ensureTaskTables();
  await pruneNotificationsForUser(userId);

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT
        n.id,
        n.type,
        n.title,
        n.message,
        n.href,
        n.is_read,
        n.created_at,
        n.read_at,
        actor.username AS actor_username,
        actor.first_name AS actor_first_name,
        actor.last_name AS actor_last_name
      FROM custom_permissions_usernotification n
      LEFT JOIN auth_user actor ON actor.id = n.actor_user_id
      WHERE n.user_id = $1::int
      ORDER BY n.created_at DESC, n.id DESC
      LIMIT $2::int
    `,
    [userId, limit],
  );

  return result.rows.map(normalizeNotificationRow);
}

export async function markAllNotificationsRead(userId: number) {
  await ensureTaskTables();
  await pool.query(
    `
      UPDATE custom_permissions_usernotification
      SET is_read = TRUE,
          read_at = NOW()
      WHERE user_id = $1::int
        AND is_read = FALSE
    `,
    [userId],
  );

  return loadNotificationsForUser(userId);
}

export async function markNotificationRead(userId: number, notificationId: number) {
  await ensureTaskTables();
  await pool.query(
    `
      UPDATE custom_permissions_usernotification
      SET is_read = TRUE,
          read_at = NOW()
      WHERE user_id = $1::int
        AND id = $2::int
        AND is_read = FALSE
    `,
    [userId, notificationId],
  );

  return loadNotificationsForUser(userId);
}

export async function cleanupNotificationsForUser(userId: number, olderThanDays = 30) {
  await ensureTaskTables();

  const normalizedDays = Number.isFinite(Number(olderThanDays)) ? Math.max(1, Math.min(365, Number(olderThanDays))) : 30;

  await pool.query(
    `
      DELETE FROM custom_permissions_usernotification
      WHERE user_id = $1::int
        AND (
          is_read = TRUE
          OR created_at < NOW() - ($2::int * INTERVAL '1 day')
        )
    `,
    [userId, normalizedDays],
  );

  return loadNotificationsForUser(userId);
}

export async function cleanupSuccessNotificationsForUser(userId: number) {
  await ensureTaskTables();

  await pool.query(
    `
      DELETE FROM custom_permissions_usernotification
      WHERE user_id = $1::int
        AND type = 'report_schedule_success'
    `,
    [userId],
  );

  return loadNotificationsForUser(userId);
}

export async function clearReportScheduleErrorsForUser(userId: number, isSuperuser = false) {
  await ensureReportScheduleTables();
  await ensureTaskTables();

  if (isSuperuser) {
    await pool.query(
      `
        DELETE FROM custom_permissions_reportschedulelog
        WHERE status = 'error'
      `,
    );
  } else {
    await pool.query(
      `
        DELETE FROM custom_permissions_reportschedulelog
        WHERE status = 'error'
          AND schedule_id IN (
            SELECT id
            FROM custom_permissions_reportschedule
            WHERE created_by = $1::int
          )
      `,
      [userId],
    );
  }

  await pool.query(
    `
      DELETE FROM custom_permissions_usernotification
      WHERE user_id = $1::int
        AND type = 'report_schedule_error'
    `,
    [userId],
  );
}

export async function loadTaskCommentsForUser(userId: number) {
  await ensureTaskTables();

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT
        c.id,
        c.task_id,
        c.message,
        c.created_at,
        c.author_user_id,
        author.username AS author_username,
        author.first_name AS author_first_name,
        author.last_name AS author_last_name
      FROM custom_permissions_taskcomment c
      INNER JOIN custom_permissions_task t ON t.id = c.task_id
      INNER JOIN auth_user author ON author.id = c.author_user_id
      WHERE t.assigned_to = $1::int OR t.created_by = $1::int
      ORDER BY c.created_at ASC, c.id ASC
    `,
    [userId],
  );

  return result.rows.map(normalizeTaskCommentRow);
}

export async function createUserTask(input: {
  actorUserId: number;
  assignedTo: number;
  title: string;
  description?: string;
  priority?: TaskPriority;
  module?: string;
  targetUrl?: string;
  dueDate?: string | null;
}) {
  await ensureTaskTables();

  const title = String(input.title || '').trim();
  if (!title) {
    throw new Error('El titulo de la tarea es obligatorio.');
  }

  const assignedTo = Number(input.assignedTo || 0);
  if (!assignedTo) {
    throw new Error('Debes seleccionar un usuario.');
  }

  const userValidation = await pool.query<{ id: number }>(
    `
      SELECT id, username, is_superuser
      FROM auth_user
      WHERE id = ANY($1::int[])
        AND is_active = TRUE
    `,
    [[Number(input.actorUserId || 0), assignedTo]],
  );

  const validIds = new Set(userValidation.rows.map((row) => Number(row.id)));
  if (!validIds.has(Number(input.actorUserId || 0))) {
    throw new Error('El usuario actual no es valido.');
  }
  if (!validIds.has(assignedTo)) {
    throw new Error('El usuario asignado no esta disponible.');
  }
  const assignedUser = userValidation.rows.find((row) => Number(row.id) === assignedTo);
  if (isRestrictedCollaborationUser(assignedUser)) {
    throw new Error('Las cuentas administrativas no deben recibir tareas.');
  }

  const created = await pool.query<{ id: number }>(
    `
      INSERT INTO custom_permissions_task
        (title, description, status, priority, module, target_url, due_date, created_by, assigned_to)
      VALUES
        ($1::varchar(180), $2::text, 'pendiente', $3::varchar(20), $4::varchar(80), $5::text, $6::date, $7::int, $8::int)
      RETURNING id
    `,
    [
      title,
      String(input.description || '').trim(),
      normalizeTaskPriority(input.priority),
      String(input.module || '').trim(),
      String(input.targetUrl || '').trim(),
      input.dueDate ? String(input.dueDate) : null,
      input.actorUserId,
      assignedTo,
    ],
  );

  const taskId = Number(created.rows[0]?.id || 0);

  await createUserNotification({
    userId: assignedTo,
    actorUserId: input.actorUserId,
    type: 'task_assigned',
    title: 'Nueva tarea asignada',
    message: title,
    href: `/notificaciones?task=${taskId}`,
  });

  const tasks = await loadTasksForUser(input.actorUserId);
  return tasks.all.find((task) => task.id === taskId) || null;
}

export async function updateUserTaskStatus(input: {
  taskId: number;
  actorUserId: number;
  actorIsSuperuser?: boolean;
  status: TaskStatus;
}) {
  await ensureTaskTables();

  const taskId = Number(input.taskId || 0);
  if (!taskId) {
    throw new Error('Tarea invalida.');
  }

  const targetStatus = normalizeTaskStatus(input.status);
  const currentTaskResult = await pool.query<Record<string, unknown>>(
    `
      SELECT id, title, created_by, assigned_to, status
      FROM custom_permissions_task
      WHERE id = $1::int
      LIMIT 1
    `,
    [taskId],
  );

  const task = currentTaskResult.rows[0];
  if (!task) {
    throw new Error('No se encontro la tarea.');
  }

  const createdBy = Number(task.created_by || 0);
  const assignedTo = Number(task.assigned_to || 0);
  const actorUserId = Number(input.actorUserId || 0);
  const canEdit = Boolean(input.actorIsSuperuser) || actorUserId === createdBy || actorUserId === assignedTo;
  if (!canEdit) {
    throw new Error('No tienes permiso para actualizar esta tarea.');
  }

  await pool.query(
    `
      UPDATE custom_permissions_task
      SET status = $2::varchar(20),
          updated_at = NOW(),
          completed_at = CASE WHEN $2::varchar(20) = 'resuelta' THEN NOW() ELSE NULL END
      WHERE id = $1::int
    `,
    [taskId, targetStatus],
  );

  if (createdBy && createdBy !== actorUserId) {
    await createUserNotification({
      userId: createdBy,
      actorUserId,
      type: 'task_update',
      title: 'Tarea actualizada',
      message: `${String(task.title || '').trim()} · ${targetStatus.replace('_', ' ')}`,
      href: `/notificaciones?task=${taskId}`,
    });
  }

  if (assignedTo && assignedTo !== actorUserId && targetStatus === 'resuelta') {
    await createUserNotification({
      userId: assignedTo,
      actorUserId,
      type: 'task_resolved',
      title: 'Tarea marcada como resuelta',
      message: String(task.title || '').trim(),
      href: `/notificaciones?task=${taskId}`,
    });
  }

  const tasks = await loadTasksForUser(actorUserId);
  return tasks.all.find((item) => item.id === taskId) || null;
}

export async function createTaskComment(input: {
  taskId: number;
  actorUserId: number;
  actorIsSuperuser?: boolean;
  message: string;
}) {
  await ensureTaskTables();

  const taskId = Number(input.taskId || 0);
  const actorUserId = Number(input.actorUserId || 0);
  const message = String(input.message || '').trim();

  if (!taskId) {
    throw new Error('Tarea invalida.');
  }
  if (!message) {
    throw new Error('El comentario es obligatorio.');
  }

  const taskResult = await pool.query<Record<string, unknown>>(
    `
      SELECT id, title, created_by, assigned_to
      FROM custom_permissions_task
      WHERE id = $1::int
      LIMIT 1
    `,
    [taskId],
  );

  const task = taskResult.rows[0];
  if (!task) {
    throw new Error('No se encontro la tarea.');
  }

  const createdBy = Number(task.created_by || 0);
  const assignedTo = Number(task.assigned_to || 0);
  const canComment = Boolean(input.actorIsSuperuser) || actorUserId === createdBy || actorUserId === assignedTo;
  if (!canComment) {
    throw new Error('No tienes permiso para comentar esta tarea.');
  }

  await pool.query(
    `
      INSERT INTO custom_permissions_taskcomment
        (task_id, author_user_id, message)
      VALUES
        ($1::int, $2::int, $3::text)
    `,
    [taskId, actorUserId, message],
  );

  const notifyUsers = new Set<number>();
  if (createdBy && createdBy !== actorUserId) notifyUsers.add(createdBy);
  if (assignedTo && assignedTo !== actorUserId) notifyUsers.add(assignedTo);

  await Promise.all(
    [...notifyUsers].map((userId) =>
      createUserNotification({
        userId,
        actorUserId,
        type: 'task_comment',
        title: 'Nuevo comentario en tarea',
        message: String(task.title || '').trim(),
        href: `/notificaciones?task=${taskId}`,
      }),
    ),
  );

  const comments = await loadTaskCommentsForUser(actorUserId);
  return comments.filter((comment) => comment.taskId === taskId);
}

async function loadReportScheduleById(scheduleId: number) {
  await ensureReportScheduleTables();

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT
        s.*,
        creator.username AS creator_username,
        creator.first_name AS creator_first_name,
        creator.last_name AS creator_last_name,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', u.id,
                'label', trim(concat(u.first_name, ' ', u.last_name)),
                'username', u.username,
                'email', u.email
              )
              ORDER BY u.username
            )
            FROM auth_user u
            WHERE u.id = ANY(s.recipient_user_ids)
          ),
          '[]'::json
        ) AS recipient_users
      FROM custom_permissions_reportschedule s
      INNER JOIN auth_user creator ON creator.id = s.created_by
      WHERE s.id = $1::int
      LIMIT 1
    `,
    [scheduleId],
  );

  const row = result.rows[0];
  return row ? normalizeReportScheduleRow(row) : null;
}

export async function loadReportTemplatesForUser(userId: number, actorIsSuperuser = false) {
  await ensureReportTemplateTables();

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT
        t.*,
        creator.username AS creator_username,
        creator.first_name AS creator_first_name,
        creator.last_name AS creator_last_name
      FROM custom_permissions_reporttemplate t
      INNER JOIN auth_user creator ON creator.id = t.created_by_id
      WHERE ($1::boolean = TRUE OR t.created_by_id = $2::int)
      ORDER BY t.updated_at DESC, t.id DESC
    `,
    [actorIsSuperuser, userId],
  );

  return result.rows.map(normalizeReportTemplateRow);
}

export async function loadReportTemplateById(input: {
  templateId: number;
  actorUserId: number;
  actorIsSuperuser: boolean;
}) {
  await ensureReportTemplateTables();

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT
        t.*,
        creator.username AS creator_username,
        creator.first_name AS creator_first_name,
        creator.last_name AS creator_last_name
      FROM custom_permissions_reporttemplate t
      INNER JOIN auth_user creator ON creator.id = t.created_by_id
      WHERE t.id = $1::int
        AND ($2::boolean = TRUE OR t.created_by_id = $3::int)
      LIMIT 1
    `,
    [input.templateId, input.actorIsSuperuser, input.actorUserId],
  );

  const row = result.rows[0];
  return row ? normalizeReportTemplateRow(row) : null;
}

export async function createReportTemplate(input: {
  actorUserId: number;
  name: string;
  description?: string;
  module: string;
  templateKey: string;
  config: Record<string, unknown>;
}) {
  await ensureReportTemplateTables();

  const name = String(input.name || '').trim();
  if (!name) {
    throw new Error('El nombre de la plantilla es obligatorio.');
  }

  const inserted = await pool.query<Record<string, unknown>>(
    `
      INSERT INTO custom_permissions_reporttemplate
        (name, description, module, template_key, config, created_by_id)
      VALUES
        ($1::varchar(160), $2::text, $3::varchar(80), $4::varchar(80), $5::jsonb, $6::int)
      RETURNING *
    `,
    [
      name,
      String(input.description || '').trim(),
      String(input.module || '').trim() || 'Informes personalizados',
      String(input.templateKey || '').trim(),
      JSON.stringify(input.config || {}),
      input.actorUserId,
    ],
  );

  const creator = await pool.query<Record<string, unknown>>(
    `
      SELECT username AS creator_username, first_name AS creator_first_name, last_name AS creator_last_name
      FROM auth_user
      WHERE id = $1::int
      LIMIT 1
    `,
    [input.actorUserId],
  );

  return normalizeReportTemplateRow({
    ...inserted.rows[0],
    ...(creator.rows[0] || {}),
  });
}

export async function updateReportTemplate(input: {
  templateId: number;
  actorUserId: number;
  actorIsSuperuser: boolean;
  name?: string;
  description?: string;
  module?: string;
  templateKey?: string;
  config?: Record<string, unknown>;
}) {
  const existing = await loadReportTemplateById({
    templateId: input.templateId,
    actorUserId: input.actorUserId,
    actorIsSuperuser: input.actorIsSuperuser,
  });
  if (!existing) {
    throw new Error('La plantilla no existe o no tienes permisos para editarla.');
  }

  const updated = await pool.query<Record<string, unknown>>(
    `
      UPDATE custom_permissions_reporttemplate
      SET
        name = $2::varchar(160),
        description = $3::text,
        module = $4::varchar(80),
        template_key = $5::varchar(80),
        config = $6::jsonb,
        updated_at = NOW()
      WHERE id = $1::int
      RETURNING *
    `,
    [
      existing.id,
      String(input.name ?? existing.name).trim(),
      String(input.description ?? existing.description).trim(),
      String(input.module ?? existing.module).trim() || 'Informes personalizados',
      String(input.templateKey ?? existing.templateKey).trim(),
      JSON.stringify(input.config ?? existing.config ?? {}),
    ],
  );

  const creator = await pool.query<Record<string, unknown>>(
    `
      SELECT username AS creator_username, first_name AS creator_first_name, last_name AS creator_last_name
      FROM auth_user
      WHERE id = $1::int
      LIMIT 1
    `,
    [existing.createdById],
  );

  return normalizeReportTemplateRow({
    ...updated.rows[0],
    ...(creator.rows[0] || {}),
  });
}

export async function deleteReportTemplate(input: {
  templateId: number;
  actorUserId: number;
  actorIsSuperuser: boolean;
}) {
  const template = await loadReportTemplateById(input);
  if (!template) {
    throw new Error('La plantilla no existe o no tienes permisos para eliminarla.');
  }

  await ensureReportTemplateTables();
  await pool.query('DELETE FROM custom_permissions_reporttemplate WHERE id = $1::int', [template.id]);
}

export async function loadReportSchedulesForUser(userId: number, actorIsSuperuser = false) {
  await ensureReportScheduleTables();

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT
        s.*,
        creator.username AS creator_username,
        creator.first_name AS creator_first_name,
        creator.last_name AS creator_last_name,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', u.id,
                'label', trim(concat(u.first_name, ' ', u.last_name)),
                'username', u.username,
                'email', u.email
              )
              ORDER BY u.username
            )
            FROM auth_user u
            WHERE u.id = ANY(s.recipient_user_ids)
          ),
          '[]'::json
        ) AS recipient_users
      FROM custom_permissions_reportschedule s
      INNER JOIN auth_user creator ON creator.id = s.created_by
      WHERE ($1::boolean = TRUE OR s.created_by = $2::int)
      ORDER BY s.is_active DESC, s.next_run_at ASC, s.id DESC
    `,
    [actorIsSuperuser, userId],
  );

  return result.rows.map((row) => normalizeReportScheduleRow(row));
}

export async function loadReportScheduleLogsForUser(userId: number, actorIsSuperuser = false, limit = 20) {
  await ensureReportScheduleTables();

  const result = await pool.query<Record<string, unknown>>(
    `
      SELECT l.*, s.report_title, s.module
      FROM custom_permissions_reportschedulelog l
      INNER JOIN custom_permissions_reportschedule s ON s.id = l.schedule_id
      WHERE ($1::boolean = TRUE OR s.created_by = $2::int)
      ORDER BY l.executed_at DESC, l.id DESC
      LIMIT $3::int
    `,
    [actorIsSuperuser, userId, limit],
  );

  return result.rows.map((row) => normalizeReportScheduleLogRow(row));
}

export async function createReportSchedule(input: {
  actorUserId: number;
  reportKey: string;
  reportTitle: string;
  module: string;
  targetUrl: string;
  reportParams?: Record<string, string>;
  frequency?: ReportScheduleFrequency;
  timeOfDay?: string;
  dayOfWeek?: number | null;
  dayOfMonth?: number | null;
  recipientUserIds?: number[];
  extraEmails?: string[] | string;
  emailSubject?: string;
  emailMessage?: string;
  isActive?: boolean;
}) {
  await ensureReportScheduleTables();

  const actorUserId = Number(input.actorUserId || 0);
  if (!actorUserId) throw new Error('El usuario actual no es valido.');

  const reportKey = String(input.reportKey || '').trim();
  const reportTitle = String(input.reportTitle || '').trim();
  if (!reportKey || !reportTitle) {
    throw new Error('La programacion requiere identificar el informe.');
  }

  const recipientUserIds = normalizeRecipientUserIds(input.recipientUserIds);
  const extraEmails = normalizeScheduleEmails(input.extraEmails);
  if (recipientUserIds.length === 0 && extraEmails.length === 0) {
    throw new Error('Debes indicar al menos un destinatario interno o un correo externo.');
  }

  const frequency = normalizeScheduleFrequency(input.frequency);
  const timeOfDay = normalizeTimeOfDay(input.timeOfDay);
  const dayOfWeek = frequency === 'semanal' ? normalizeDayOfWeek(input.dayOfWeek) ?? 1 : null;
  const dayOfMonth = frequency === 'mensual' ? normalizeDayOfMonth(input.dayOfMonth) ?? 1 : null;
  const isActive = typeof input.isActive === 'boolean' ? input.isActive : true;

  if (recipientUserIds.length > 0) {
    const recipientsResult = await pool.query<Record<string, unknown>>(
      `
        SELECT id, username, is_superuser
        FROM auth_user
        WHERE id = ANY($1::int[])
          AND is_active = TRUE
      `,
      [recipientUserIds],
    );

    const validIds = new Set(recipientsResult.rows.map((row) => Number(row.id || 0)));
    for (const id of recipientUserIds) {
      if (!validIds.has(id)) {
        throw new Error('Uno de los usuarios seleccionados ya no esta disponible.');
      }
    }
    if (recipientsResult.rows.some((row) => isRestrictedCollaborationUser(row))) {
      throw new Error('Las cuentas administrativas no deben recibir informes programados.');
    }
  }

  const nextRunAt = buildNextScheduledRun({
    frequency,
    timeOfDay,
    dayOfWeek,
    dayOfMonth,
  });

  const result = await pool.query<{ id: number }>(
    `
      INSERT INTO custom_permissions_reportschedule
        (
          report_key, report_title, module, target_url, report_params,
          frequency, time_of_day, day_of_week, day_of_month,
          recipient_user_ids, extra_emails, email_subject, email_message,
          is_active, next_run_at, created_by
        )
      VALUES
        (
          $1::varchar(120), $2::varchar(180), $3::varchar(80), $4::text, $5::jsonb,
          $6::varchar(20), $7::varchar(5), $8::smallint, $9::smallint,
          $10::int[], $11::text[], $12::varchar(220), $13::text,
          $14::boolean, $15::timestamptz, $16::int
        )
      RETURNING id
    `,
    [
      reportKey,
      reportTitle,
      String(input.module || '').trim(),
      String(input.targetUrl || '').trim(),
      JSON.stringify(normalizeScheduleParams(input.reportParams)),
      frequency,
      timeOfDay,
      dayOfWeek,
      dayOfMonth,
      recipientUserIds,
      extraEmails,
      String(input.emailSubject || '').trim(),
      String(input.emailMessage || '').trim(),
      isActive,
      nextRunAt.toISOString(),
      actorUserId,
    ],
  );

  return loadReportScheduleById(Number(result.rows[0]?.id || 0));
}

export async function updateReportSchedule(input: {
  scheduleId: number;
  actorUserId: number;
  actorIsSuperuser?: boolean;
  isActive?: boolean;
  reportParams?: Record<string, string>;
  frequency?: ReportScheduleFrequency;
  timeOfDay?: string;
  dayOfWeek?: number | null;
  dayOfMonth?: number | null;
  recipientUserIds?: number[];
  extraEmails?: string[] | string;
  emailSubject?: string;
  emailMessage?: string;
}) {
  await ensureReportScheduleTables();

  const schedule = await loadReportScheduleById(Number(input.scheduleId || 0));
  if (!schedule) throw new Error('No se encontro la programacion.');

  const actorUserId = Number(input.actorUserId || 0);
  const canEdit = Boolean(input.actorIsSuperuser) || schedule.createdById === actorUserId;
  if (!canEdit) throw new Error('No tienes permiso para modificar esta programacion.');

  const nextReportParams = input.reportParams ? normalizeScheduleParams(input.reportParams) : schedule.reportParams;
  const recipientUserIds = input.recipientUserIds ? normalizeRecipientUserIds(input.recipientUserIds) : schedule.recipientUserIds;
  const extraEmails = input.extraEmails !== undefined ? normalizeScheduleEmails(input.extraEmails) : schedule.extraEmails;
  if (recipientUserIds.length === 0 && extraEmails.length === 0) {
    throw new Error('Debes indicar al menos un destinatario interno o un correo externo.');
  }

  const frequency = input.frequency ? normalizeScheduleFrequency(input.frequency) : schedule.frequency;
  const timeOfDay = input.timeOfDay ? normalizeTimeOfDay(input.timeOfDay) : schedule.timeOfDay;
  const dayOfWeek = frequency === 'semanal'
    ? normalizeDayOfWeek(input.dayOfWeek ?? schedule.dayOfWeek) ?? 1
    : null;
  const dayOfMonth = frequency === 'mensual'
    ? normalizeDayOfMonth(input.dayOfMonth ?? schedule.dayOfMonth) ?? 1
    : null;

  if (recipientUserIds.length > 0) {
    const recipientsResult = await pool.query<Record<string, unknown>>(
      `
        SELECT id, username, is_superuser
        FROM auth_user
        WHERE id = ANY($1::int[])
          AND is_active = TRUE
      `,
      [recipientUserIds],
    );

    const validIds = new Set(recipientsResult.rows.map((row) => Number(row.id || 0)));
    for (const id of recipientUserIds) {
      if (!validIds.has(id)) {
        throw new Error('Uno de los usuarios seleccionados ya no esta disponible.');
      }
    }
    if (recipientsResult.rows.some((row) => isRestrictedCollaborationUser(row))) {
      throw new Error('Las cuentas administrativas no deben recibir informes programados.');
    }
  }

  const isActive = typeof input.isActive === 'boolean' ? input.isActive : schedule.isActive;
  const nextRunAt = isActive
    ? buildNextScheduledRun({
        frequency,
        timeOfDay,
        dayOfWeek,
        dayOfMonth,
      })
    : null;

  await pool.query(
    `
      UPDATE custom_permissions_reportschedule
      SET report_params = $2::jsonb,
          frequency = $3::varchar(20),
          time_of_day = $4::varchar(5),
          day_of_week = $5::smallint,
          day_of_month = $6::smallint,
          recipient_user_ids = $7::int[],
          extra_emails = $8::text[],
          email_subject = $9::varchar(220),
          email_message = $10::text,
          is_active = $11::boolean,
          next_run_at = COALESCE($12::timestamptz, next_run_at),
          updated_at = NOW()
      WHERE id = $1::int
    `,
    [
      schedule.id,
      JSON.stringify(nextReportParams),
      frequency,
      timeOfDay,
      dayOfWeek,
      dayOfMonth,
      recipientUserIds,
      extraEmails,
      input.emailSubject !== undefined ? String(input.emailSubject || '').trim() : schedule.emailSubject,
      input.emailMessage !== undefined ? String(input.emailMessage || '').trim() : schedule.emailMessage,
      isActive,
      nextRunAt ? nextRunAt.toISOString() : null,
    ],
  );

  return loadReportScheduleById(schedule.id);
}

export async function deleteReportSchedule(input: {
  scheduleId: number;
  actorUserId: number;
  actorIsSuperuser?: boolean;
}) {
  await ensureReportScheduleTables();

  const schedule = await loadReportScheduleById(Number(input.scheduleId || 0));
  if (!schedule) throw new Error('No se encontro la programacion.');

  const canDelete = Boolean(input.actorIsSuperuser) || schedule.createdById === Number(input.actorUserId || 0);
  if (!canDelete) throw new Error('No tienes permiso para eliminar esta programacion.');

  await pool.query('DELETE FROM custom_permissions_reportschedule WHERE id = $1::int', [schedule.id]);
  return { ok: true };
}

async function executeReportSchedule(input: {
  schedule: ReportScheduleRecord;
  origin?: string;
  manual?: boolean;
}) {
  const sentCount = await sendScheduledReportEmail(input.schedule, input.origin);
  const nextRunAt = buildNextScheduledRun({
    frequency: input.schedule.frequency,
    timeOfDay: input.schedule.timeOfDay,
    dayOfWeek: input.schedule.dayOfWeek,
    dayOfMonth: input.schedule.dayOfMonth,
    from: new Date(Date.now() + 1000),
  });

  await pool.query(
    `
      UPDATE custom_permissions_reportschedule
      SET last_run_at = NOW(),
          next_run_at = $2::timestamptz,
          updated_at = NOW()
      WHERE id = $1::int
    `,
    [input.schedule.id, nextRunAt.toISOString()],
  );

  await createReportScheduleExecutionLog({
    scheduleId: input.schedule.id,
    status: 'success',
    sentCount,
    message: input.manual ? 'Envio manual ejecutado correctamente.' : 'Envio automatico ejecutado correctamente.',
  });

  await createUserNotification({
    userId: input.schedule.createdById,
    type: 'report_schedule_success',
    title: 'Informe programado enviado',
    message: `${input.schedule.reportTitle} · ${sentCount} destinatario(s)`,
    href: '/notificaciones',
  });

  return {
    schedule: await loadReportScheduleById(input.schedule.id),
    sentCount,
  };
}

export async function runReportScheduleNow(input: {
  scheduleId: number;
  actorUserId: number;
  actorIsSuperuser?: boolean;
  origin?: string;
}) {
  await ensureReportScheduleTables();

  const schedule = await loadReportScheduleById(Number(input.scheduleId || 0));
  if (!schedule) throw new Error('No se encontro la programacion.');

  const canRun = Boolean(input.actorIsSuperuser) || schedule.createdById === Number(input.actorUserId || 0);
  if (!canRun) throw new Error('No tienes permiso para ejecutar esta programacion.');

  try {
    return await executeReportSchedule({
      schedule,
      origin: input.origin,
      manual: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo ejecutar la programacion.';
    await createReportScheduleExecutionLog({
      scheduleId: schedule.id,
      status: 'error',
      sentCount: 0,
      message,
    });
    await createUserNotification({
      userId: schedule.createdById,
      type: 'report_schedule_error',
      title: 'Fallo un informe programado',
      message: `${schedule.reportTitle} · ${message}`,
      href: '/notificaciones',
    });
    throw error;
  }
}

export async function runDueReportSchedules(origin?: string) {
  await ensureReportScheduleTables();

  const dueResult = await pool.query<Record<string, unknown>>(
    `
      SELECT
        s.*,
        creator.username AS creator_username,
        creator.first_name AS creator_first_name,
        creator.last_name AS creator_last_name,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', u.id,
                'label', trim(concat(u.first_name, ' ', u.last_name)),
                'username', u.username,
                'email', u.email
              )
              ORDER BY u.username
            )
            FROM auth_user u
            WHERE u.id = ANY(s.recipient_user_ids)
          ),
          '[]'::json
        ) AS recipient_users
      FROM custom_permissions_reportschedule s
      INNER JOIN auth_user creator ON creator.id = s.created_by
      WHERE s.is_active = TRUE
        AND s.next_run_at <= NOW()
      ORDER BY s.next_run_at ASC, s.id ASC
    `,
  );

  const results: Array<{ scheduleId: number; ok: boolean; sentCount: number; message: string }> = [];

  for (const row of dueResult.rows) {
    const schedule = normalizeReportScheduleRow(row);
    try {
      const executed = await executeReportSchedule({ schedule, origin, manual: false });
      results.push({
        scheduleId: schedule.id,
        ok: true,
        sentCount: executed.sentCount,
        message: 'Envio ejecutado correctamente.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo ejecutar la programacion.';
      await createReportScheduleExecutionLog({
        scheduleId: schedule.id,
        status: 'error',
        sentCount: 0,
        message,
      });
      await createUserNotification({
        userId: schedule.createdById,
        type: 'report_schedule_error',
        title: 'Fallo un informe programado',
        message: `${schedule.reportTitle} · ${message}`,
        href: '/notificaciones',
      });

      const nextRunAt = buildNextScheduledRun({
        frequency: schedule.frequency,
        timeOfDay: schedule.timeOfDay,
        dayOfWeek: schedule.dayOfWeek,
        dayOfMonth: schedule.dayOfMonth,
        from: new Date(Date.now() + 1000),
      });
      await pool.query(
        `
          UPDATE custom_permissions_reportschedule
          SET next_run_at = $2::timestamptz,
              updated_at = NOW()
          WHERE id = $1::int
        `,
        [schedule.id, nextRunAt.toISOString()],
      );

      results.push({
        scheduleId: schedule.id,
        ok: false,
        sentCount: 0,
        message,
      });
    }
  }

  return {
    processed: results.length,
    success: results.filter((item) => item.ok).length,
    failed: results.filter((item) => !item.ok).length,
    results,
  };
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

import { pbkdf2Sync, timingSafeEqual } from 'node:crypto';
import { Pool } from 'pg';

type AuthUserRow = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_superuser: boolean;
  password: string;
};

type GroupRow = {
  name: string;
};

const pool = new Pool({
  host: process.env.AUTH_DB_HOST || 'localhost',
  port: Number(process.env.AUTH_DB_PORT || 5432),
  database: process.env.AUTH_DB_NAME || 'multisoft_informes',
  user: process.env.AUTH_DB_USER || 'postgres',
  password: process.env.AUTH_DB_PASSWORD || 'postgres',
});

function comparePbkdf2Sha256(encoded: string, rawPassword: string): boolean {
  const [algorithm, iterationsRaw, salt, digest] = String(encoded || '').split('$');
  if (algorithm !== 'pbkdf2_sha256' || !iterationsRaw || !salt || !digest) return false;

  const iterations = Number(iterationsRaw);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;

  const derived = pbkdf2Sync(rawPassword, salt, iterations, 32, 'sha256').toString('base64');
  const expected = Buffer.from(digest, 'utf8');
  const actual = Buffer.from(derived, 'utf8');

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export type AuthenticatedUser = {
  id: number;
  username: string;
  displayName: string;
  role: string;
  isSuperuser: boolean;
  groups: string[];
};

export async function authenticateWithPostgres(identifier: string, password: string): Promise<AuthenticatedUser | null> {
  const normalizedIdentifier = String(identifier || '').trim().toLowerCase();
  if (!normalizedIdentifier || !password) return null;

  const result = await pool.query<AuthUserRow>(
    `
      SELECT id, username, email, first_name, last_name, is_active, is_superuser, password
      FROM auth_user
      WHERE LOWER(BTRIM(username)) = $1
         OR LOWER(NULLIF(BTRIM(email), '')) = $1
      ORDER BY CASE WHEN LOWER(BTRIM(username)) = $1 THEN 0 ELSE 1 END, id
    `,
    [normalizedIdentifier],
  );

  const usernameMatch = result.rows.find(
    (row) => String(row.username || '').trim().toLowerCase() === normalizedIdentifier,
  );
  const passwordMatches = usernameMatch
    ? [usernameMatch].filter((row) => row.is_active && comparePbkdf2Sha256(row.password, password))
    : result.rows.filter((row) => row.is_active && comparePbkdf2Sha256(row.password, password));

  if (passwordMatches.length !== 1) return null;
  const user = passwordMatches[0];

  const groupsResult = await pool.query<GroupRow>(
    `
      SELECT g.name
      FROM auth_group g
      INNER JOIN auth_user_groups ug ON ug.group_id = g.id
      WHERE ug.user_id = $1
      ORDER BY g.name
    `,
    [user.id],
  );

  const groups = groupsResult.rows
    .map((row) => String(row.name || '').trim())
    .filter(Boolean);

  const fullName = [user.first_name, user.last_name].map((item) => String(item || '').trim()).filter(Boolean).join(' ');
  const primaryRole = user.is_superuser ? 'Administrador' : groups[0] || 'Usuario';

  return {
    id: user.id,
    username: user.username,
    displayName: fullName || user.username,
    role: primaryRole,
    isSuperuser: user.is_superuser,
    groups,
  };
}

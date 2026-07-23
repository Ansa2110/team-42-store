import type {
  JwtPayload,
} from './auth.types';

export function decodeJwt(
  token: string,
): JwtPayload | null {
  const [, payload] =
    token.split('.');

  if (!payload) {
    return null;
  }

  try {
    const normalized = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(
        Math.ceil(
          payload.length / 4,
        ) * 4,
        '=',
      );

    const json = decodeURIComponent(
      Array.from(
        atob(normalized),
        (character) =>
          `%${character
            .charCodeAt(0)
            .toString(16)
            .padStart(2, '0')}`,
      ).join(''),
    );

    const parsed: unknown =
      JSON.parse(json);

    return isJwtPayload(parsed)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export function getJwtExpiresAt(
  payload: JwtPayload | null,
): number | null {
  return typeof payload?.exp ===
  'number'
    ? payload.exp * 1000
    : null;
}

function isJwtPayload(
  value: unknown,
): value is JwtPayload {
  return (
    typeof value === 'object' &&
    value !== null
  );
}

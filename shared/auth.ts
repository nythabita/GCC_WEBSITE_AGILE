const allowedReturnPaths = new Set(['/', '/programs', '/assessment', '/discover', '/learn', '/apply', '/grow', '/learn/growthcamp', '/learn/growthcamp/form', '/apply/growthx', '/apply/growthx/form', '/apply/growthconnect', '/apply/growthconnect/form']);
export function safeReturnTo(value: unknown): string {
  return typeof value === 'string' && allowedReturnPaths.has(value) ? value : '/';
}
export type AccessSession = { userId: string; accessToken: string };

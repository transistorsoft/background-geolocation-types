/**
 * Supported authorization strategies.
 * Mirrors Flutter's Authorization.strategy values.
 *
 * @category Config
 */
export const AuthorizationStrategy = {
  Jwt: 'jwt',
  Sas: 'sas'
} as const;

/**
 * @internal @hidden
 */
export type AuthorizationStrategy =
  (typeof AuthorizationStrategy)[keyof typeof AuthorizationStrategy];
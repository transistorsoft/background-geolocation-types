/**
 * <!-- doc-id: AuthorizationStrategy -->
 * Supported authorization strategies.
 * Mirrors Flutter's Authorization.strategy values.
 *
 * @category Config
 */
export const AuthorizationStrategy = {  
  /**
   * <!-- doc-id: AuthorizationStrategy.Jwt -->
   * JWT-based authorization with accessToken and refreshToken.
   * Access token is sent in the Authorization header of each request.
   * Refresh token is used to obtain new access tokens when they expire.
   */
  Jwt: 'jwt',
  /**
   * <!-- doc-id: AuthorizationStrategy.Sas -->
   * Shared Access Signature (SAS) token-based authorization.
   * SAS token is sent in the Authorization header of each request.
   * Client is responsible for refreshing the SAS token before it expires.
   */
  Sas: 'sas'
} as const;

/**
 * @internal @hidden
 */
export type AuthorizationStrategy =
  (typeof AuthorizationStrategy)[keyof typeof AuthorizationStrategy];
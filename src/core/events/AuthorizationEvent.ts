/**
 * <!-- doc-id: AuthorizationEvent -->
 * Emitted by {@link BackgroundGeolocation.onAuthorization}.
 * 
 * @category Events
 */
export interface AuthorizationEvent {
  /** 
   * <!-- doc-id: AuthorizationEvent.status -->
   * HTTP status returned from your Authorization.refreshUrl (or 0 if failed). 
   */
 
  status: number;
  /** 
   * <!-- doc-id: AuthorizationEvent.success -->
   * True when the authorization request succeeded. */
  success: boolean;
  /** 
   * <!-- doc-id: AuthorizationEvent.error -->
   * Error message when success is false; otherwise null. */
  error: string | null;
  /** 
   * <!-- doc-id: AuthorizationEvent.response -->
   * Decoded JSON response when success is true; otherwise null. */
  response: any;
}
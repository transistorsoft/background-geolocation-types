/**
 * Emitted by {@link BackgroundGeolocation.onAuthorization}.
 * 
 * @category Events
 */
export interface AuthorizationEvent {
  /** 
   * HTTP status returned from your Authorization.refreshUrl (or 0 if failed). 
   */
 
  status: number;
  /** 
   * True when the authorization request succeeded. */
  success: boolean;
  /** 
   * Error message when success is false; otherwise null. */
  error: string | null;
  /** 
   * Decoded JSON response when success is true; otherwise null. */
  response: any;
}
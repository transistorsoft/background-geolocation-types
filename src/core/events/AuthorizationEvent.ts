/**
 * <!-- doc-id: AuthorizationEvent -->
 * Authorization token refresh result delivered to {@link BackgroundGeolocation.onAuthorization}.
 *
 * The SDK fires this event after each token refresh attempt triggered by
 * {@link AuthorizationConfig.refreshUrl}. Use it to update your app's local
 * credential store, handle refresh failures, or react to expired sessions.
 *
 * @example
 * ```ts
 * BackgroundGeolocation.onAuthorization((event) => {
 *   if (event.success) {
 *     console.log("[onAuthorization] Token refreshed:", event.response);
 *     // Update your app's stored token.
 *     const token = event.response.access_token;
 *   } else {
 *     console.warn("[onAuthorization] Refresh failed:", event.error);
 *   }
 * });
 * ```
 *
 * @category Events
 */
export interface AuthorizationEvent {
  /**
   * <!-- doc-id: AuthorizationEvent.status -->
   * HTTP status code returned by {@link AuthorizationConfig.refreshUrl}, or
   * `0` if the request failed before reaching the server.
   */
  status: number;
  /**
   * <!-- doc-id: AuthorizationEvent.success -->
   * `true` when the token refresh request returned a 2xx status code.
   */
  success: boolean;
  /**
   * <!-- doc-id: AuthorizationEvent.error -->
   * Error message when `success` is `false`; `null` otherwise.
   */
  error: string | null;
  /**
   * <!-- doc-id: AuthorizationEvent.response -->
   * Decoded JSON body returned by the refresh server when `success` is `true`;
   * `null` otherwise.
   */
  response: any;
}

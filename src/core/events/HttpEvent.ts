/** 
 * Emitted by {@link BackgroundGeolocation.onHttp}.
 * 
 * @category Events
 */
export interface HttpEvent {
  /** True if HTTP request succeeded (e.g., 200, 201, 204). */
  success: boolean;
  /** HTTP status code (e.g., 200, 500, 404). */
  status: number;
  /** HTTP response text provided by the server. */
  responseText: string;
}
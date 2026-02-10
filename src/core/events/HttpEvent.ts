/** 
 * <!-- doc-id: HttpEvent -->
 * Emitted by {@link BackgroundGeolocation.onHttp}.
 * 
 * @category Events
 */
export interface HttpEvent {
  /** 
   * <!-- doc-id: HttpEvent.success -->
   * True if HTTP request succeeded (e.g., 200, 201, 204). 
   */
  success: boolean;
  /** 
   * <!-- doc-id: HttpEvent.status -->
   * HTTP status code (e.g., 200, 500, 404). 
   */
  status: number;
  /** 
   * <!-- doc-id: HttpEvent.responseText -->
   * HTTP response text provided by the server. 
   */
  responseText: string;
}
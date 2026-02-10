/** 
 * <!-- doc-id: ConnectivityChangeEvent -->
 * Emitted by {@link BackgroundGeolocation.onConnectivityChange}.
 * 
 * @category Events
 */
export interface ConnectivityChangeEvent {
  /** 
   * <!-- doc-id: ConnectivityChangeEvent.connected -->
   * True when the device has network connectivity. 
   */ 
  connected: boolean;
}
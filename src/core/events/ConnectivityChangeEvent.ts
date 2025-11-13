/** 
 * Emitted by {@link BackgroundGeolocation.onConnectivityChange}.
 * 
 * @category Events
 */
export interface ConnectivityChangeEvent {
  /** True when the device has network connectivity. */
  connected: boolean;
}
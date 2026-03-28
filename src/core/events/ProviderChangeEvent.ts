/**
 * Emitted by {@link BackgroundGeolocation.onProviderChange}.
 * 
 * @category Events
 */
export interface ProviderChangeEvent {
  /** 
   * True when device location-services are enabled. 
   */ 
  enabled: boolean;
  /** 
   * Authorization status for location-services (platform numeric). 
   */
  status: number;
  /** 
   * True if network geolocation provider is available. 
   */
  network: boolean;
  /** 
   * True if GPS geolocation provider is available. 
   */
  gps: boolean;
  /** 
   * iOS 14+ "Precise" authorization (platform numeric FULL/REDUCED). 
   */
  accuracyAuthorization: number;
}
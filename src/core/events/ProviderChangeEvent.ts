/**
 * <!-- doc-id: ProviderChangeEvent -->
 * Emitted by {@link BackgroundGeolocation.onProviderChange}.
 * 
 * @category Events
 */
export interface ProviderChangeEvent {
  /** 
   * <!-- doc-id: ProviderChangeEvent.enabled -->
   * True when device location-services are enabled. 
   */ 
  enabled: boolean;
  /** 
   * <!-- doc-id: ProviderChangeEvent.status -->
   * Authorization status for location-services (platform numeric). 
   */
  status: number;
  /** 
   * <!-- doc-id: ProviderChangeEvent.network -->
   * True if network geolocation provider is available. 
   */
  network: boolean;
  /** 
   * <!-- doc-id: ProviderChangeEvent.gps -->
   * True if GPS geolocation provider is available. 
   */
  gps: boolean;
  /** 
   * <!-- doc-id: ProviderChangeEvent.accuracyAuthorization -->
   * iOS 14+ "Precise" authorization (platform numeric FULL/REDUCED). 
   */
  accuracyAuthorization: number;
}
/**
 * <!-- doc-id: ProviderChangeEvent -->
 * Location-services provider state delivered to {@link BackgroundGeolocation.onProviderChange}.
 *
 * The SDK fires this event when the user changes location permissions, toggles
 * device location settings, or — on iOS 14 and later — when the precision
 * authorization level changes between full and reduced accuracy.
 *
 * @example
 * ```ts
 * BackgroundGeolocation.onProviderChange((event) => {
 *   console.log("[onProviderChange]",
 *     "enabled:", event.enabled,
 *     "status:", event.status,
 *     "gps:", event.gps,
 *     "network:", event.network,
 *     "accuracyAuthorization:", event.accuracyAuthorization
 *   );
 *
 *   if (!event.enabled) {
 *     // Prompt the user to re-enable location services.
 *   }
 * });
 * ```
 *
 * @category Events
 */
export interface ProviderChangeEvent {
  /**
   * <!-- doc-id: ProviderChangeEvent.enabled -->
   * `true` when the device has at least one location provider enabled.
   */
  enabled: boolean;
  /**
   * <!-- doc-id: ProviderChangeEvent.status -->
   * Platform authorization status code. Use the
   * {@link BackgroundGeolocation.AuthorizationStatus} namespace constants to
   * interpret this value.
   */
  status: number;
  /**
   * <!-- doc-id: ProviderChangeEvent.network -->
   * `true` when the network-based location provider is available.
   */
  network: boolean;
  /**
   * <!-- doc-id: ProviderChangeEvent.gps -->
   * `true` when the GPS-based location provider is available.
   */
  gps: boolean;
  /**
   * <!-- doc-id: ProviderChangeEvent.accuracyAuthorization -->
   * Precision location authorization level. Use the
   * {@link BackgroundGeolocation.AccuracyAuthorization} namespace constants to
   * interpret this value.
   *
   * On iOS 14 and later this reflects whether the user has granted full or
   * reduced accuracy. On Android this value is always
   * `AccuracyAuthorization.Full`.
   */
  accuracyAuthorization: number;
}

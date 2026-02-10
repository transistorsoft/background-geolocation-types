/**
 * <!-- doc-id: CurrentPositionRequest -->
 * Options provided to {@link BackgroundGeolocation.getCurrentPosition}.
 *
 * @example
 * ```typescript
 * let location = await BackgroundGeolocation.getCurrentPosition({
 *   timeout: 30,          // 30 second timeout to fetch location
 *   persist: true,        // Defaults to state.enabled
 *   maximumAge: 5000,     // Accept the last-known-location if not older than 5000 ms.
 *   desiredAccuracy: 10,  // Try to fetch a location with an accuracy of `10` meters.
 *   samples: 3,           // How many location samples to attempt.
 *   extras: {             // Custom meta-data.
 *     "route_id": 123
 *   }
 * });
 * ```
 * @category Primary API
 */
export interface CurrentPositionRequest {
  /**
   * <!-- doc-id: CurrentPositionRequest.samples -->
   * Sets the maximum number of location-samples to fetch before returning the best possible location to your `callback`.  Default is `3`.  Only the final Location will be persisted.
   */
  samples?: number;
  /**
   * <!-- doc-id: CurrentPositionRequest.desiredAccuracy -->
   * Sets the desired accuracy of location you're attempting to fetch. When a location having `accuracy <= desiredAccuracy` is retrieved, the plugin will stop sampling and immediately return that location. Defaults to your configured {@link GeoConfig.stationaryRadius}.
   * 
   * __Note__:  This `desiredAccuracy` does not have the same meaning as {@link GeoConfig.desiredAccuracy}.  The `desiredAccuracy` in this context is a threshold which the plugin uses to determine when to stop sampling locations.  For example, if you set `desiredAccuracy: 10`, the plugin will continue to fetch locations until it retrieves one with an accuracy of `10` meters or better.  `getCurrentPosition` __always__ requests locations from the native location API using the highest possible accuracy ({@link DesiredAccuracy.High}).
   */
  desiredAccuracy?: number;
  /**
   * <!-- doc-id: CurrentPositionRequest.timeout -->
   * Location-timeout in `seconds`.  Default: `30`.  If the timeout expires before a [[Location]] is retrieved, a [[LocationError]] will fire.
   */
  timeout?: number;
  /**
   * <!-- doc-id: CurrentPositionRequest.persist -->
   * Defaults to `true` when plugin is `enabled`; `false`, otherwise.  Set `false` to disable persisting the retrieved Location in the plugin's SQLite database.
   */
  persist?: boolean;
  /**
   * <!-- doc-id: CurrentPositionRequest.maximumAge -->
   * Accept the last-recorded-location if no older than supplied value in `milliseconds`.  Default is `0`.
   */
  maximumAge?: number;
  /**
   * <!-- doc-id: CurrentPositionRequest.extras -->
   * Optional meta-data to attach to the location. These `extras` will be merged to the configured {@link PersistenceConfig.extras} and persisted / POSTed to your server (if you've configured a {@link HttpConfig.url}).
   */
  extras?: Record<string, any>;
}
/**
 * Options for {@link BackgroundGeolocation.getCurrentPosition}.
 *
 * All fields are optional. The SDK always requests location from the native
 * API at maximum accuracy ({@link DesiredAccuracy.High}), regardless of the
 * `desiredAccuracy` threshold set here.
 *
 * @example
 * ```typescript
 * const location = await BackgroundGeolocation.getCurrentPosition({
 *   timeout: 30,          // seconds before giving up
 *   maximumAge: 5000,     // accept a cached fix up to 5000 ms old
 *   desiredAccuracy: 10,  // stop sampling when accuracy ≤ 10 m
 *   samples: 3,           // take up to 3 samples and pick the best
 *   extras: {
 *     route_id: 123
 *   }
 * });
 * ```
 *
 * @category Primary API
 */
export interface CurrentPositionRequest {
  /**
   * Maximum number of location samples to collect before returning the most
   * accurate result. Default `3`. Only the final selected location is persisted.
   */
  samples?: number;

  /**
   * Accuracy threshold in meters. The SDK stops sampling as soon as it
   * receives a location with `accuracy ≤ desiredAccuracy` and returns it
   * immediately. Defaults to {@link GeoConfig.stationaryRadius}.
   *
   * ## Note
   *
   * This value is a **stopping threshold**, not a hardware accuracy setting.
   * The SDK always requests locations at {@link DesiredAccuracy.High} from
   * the native API regardless of this value.
   */
  desiredAccuracy?: number;

  /**
   * Maximum time in **seconds** to wait for a location fix. Default `30`.
   *
   * If the timeout expires before a satisfactory location is found, the
   * Promise rejects with a {@link LocationError}.
   */
  timeout?: number;

  /**
   * Whether to persist the returned location to the SDK's SQLite database
   * and upload it to {@link HttpConfig.url}. Defaults to `true` when the
   * SDK is enabled; `false` when stopped.
   */
  persist?: boolean;

  /**
   * Accept the most recently recorded location if it is no older than this
   * value in **milliseconds**. Default `0` (always fetch a fresh fix).
   */
  maximumAge?: number;

  /**
   * Optional key-value metadata to attach to the returned location. Merged
   * with any configured {@link PersistenceConfig.extras} before persisting
   * or uploading to {@link HttpConfig.url}.
   */
  extras?: Record<string, any>;
}

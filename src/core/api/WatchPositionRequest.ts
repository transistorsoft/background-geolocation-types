import type { DesiredAccuracy } from '../../enums/DesiredAccuracy';

/**
 * Options for {@link BackgroundGeolocation.watchPosition}.
 *
 * Configures the interval, accuracy, persistence, and metadata for a
 * continuous location stream. All fields are optional.
 *
 * ### ⚠️ Warning
 *
 * `watchPosition` is intended for foreground use. On iOS it prevents the app
 * from being suspended, which drains the battery. Remove the subscription when
 * your app moves to the background.
 *
 * @example
 * ```typescript
 * const subscription = BackgroundGeolocation.watchPosition(
 *   { interval: 1000, desiredAccuracy: DesiredAccuracy.High },
 *   (location) => {
 *     console.log("[watchPosition]", location);
 *   },
 *   (errorCode) => {
 *     console.warn("[watchPosition] error:", errorCode);
 *   }
 * );
 *
 * // Later, stop watching.
 * subscription.remove();
 * ```
 *
 * @category Primary API
 */
export interface WatchPositionRequest {
  /**
   * Interval in **milliseconds** between location updates.
   */
  interval?: number;

  /**
   * Target accuracy for location updates from the native API.
   * Defaults to {@link DesiredAccuracy.High}.
   */
  desiredAccuracy?: DesiredAccuracy;

  /**
   * Whether to persist each location to the SDK's SQLite database and upload
   * it to {@link HttpConfig.url}. Defaults to `true` when the SDK is enabled;
   * `false` when stopped.
   */
  persist?: boolean;

  /**
   * Optional key-value metadata to attach to each location. Merged with any
   * configured {@link PersistenceConfig.extras} before persisting or uploading
   * to {@link HttpConfig.url}.
   */
  extras?: Record<string, any>;

  /**
   * Maximum time in **milliseconds** to wait for each location fix before
   * firing an error. Default `60000`.
   */
  timeout?: number;
}

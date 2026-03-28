/**
 * Availability of motion sensors on the device, as returned by
 * {@link BackgroundGeolocation.getSensors}.
 *
 * These sensors power the SDK's motion activity-recognition system. When a
 * sensor is absent — particularly on low-end Android devices — motion
 * recognition performance degrades and the SDK may rely more heavily on
 * location-based heuristics.
 *
 * @example
 * ```ts
 * const sensors = await BackgroundGeolocation.getSensors();
 * console.log("[Sensors]", sensors);
 * ```
 *
 * @category Data
 */
export interface Sensors {
  /**
   * OS platform name: `"ios"` or `"android"`.
   */
  platform: string;

  /**
   * `true` when the device has an accelerometer.
   */
  accelerometer: boolean;

  /**
   * `true` when the device has a magnetometer (compass).
   */
  magnetometer: boolean;

  /**
   * `true` when the device has a gyroscope.
   */
  gyroscope: boolean;

  /**
   * `true` when the device supports the Significant Motion hardware trigger.
   * [Android only]
   *
   * When present, this sensor allows the SDK to wake from a deep idle state
   * only when the device actually moves, saving significant battery.
   */
  significant_motion?: boolean;

  /**
   * `true` when the device has a dedicated M-series motion co-processor
   * (iPhone 5S and later). [iOS only]
   *
   * The M-series co-processor offloads motion activity recognition from the
   * main CPU, enabling low-power step counting and activity detection.
   */
  motion_hardware?: boolean;
}

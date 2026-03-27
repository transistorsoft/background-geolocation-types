/**
 * <!-- doc-id: Sensors -->
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
   * <!-- doc-id: Sensors.platform -->
   * OS platform name: `"ios"` or `"android"`.
   */
  platform: string;

  /**
   * <!-- doc-id: Sensors.accelerometer -->
   * `true` when the device has an accelerometer.
   */
  accelerometer: boolean;

  /**
   * <!-- doc-id: Sensors.magnetometer -->
   * `true` when the device has a magnetometer (compass).
   */
  magnetometer: boolean;

  /**
   * <!-- doc-id: Sensors.gyroscope -->
   * `true` when the device has a gyroscope.
   */
  gyroscope: boolean;

  /**
   * <!-- doc-id: Sensors.significant_motion -->
   * `true` when the device supports the Significant Motion hardware trigger.
   * [Android only]
   *
   * When present, this sensor allows the SDK to wake from a deep idle state
   * only when the device actually moves, saving significant battery.
   */
  significant_motion?: boolean;

  /**
   * <!-- doc-id: Sensors.motion_hardware -->
   * `true` when the device has a dedicated M-series motion co-processor
   * (iPhone 5S and later). [iOS only]
   *
   * The M-series co-processor offloads motion activity recognition from the
   * main CPU, enabling low-power step counting and activity detection.
   */
  motion_hardware?: boolean;
}

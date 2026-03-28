import type { Config } from '../config/Config';
import type { Location } from '../data/Location';
import type { TrackingMode } from '../../enums/TrackingMode';

/**
 * Effective runtime state returned by {@link BackgroundGeolocation.ready} and
 * {@link BackgroundGeolocation.getState}.
 *
 * `State` extends {@link Config} with all active configuration values, plus a
 * set of runtime-only fields that reflect the SDK's current operating status.
 *
 * @category Primary API
 */
export interface State extends Config {
  /**
   * `true` when the SDK is actively tracking — i.e. {@link BackgroundGeolocation.start}
   * or {@link BackgroundGeolocation.startGeofences} has been called and not yet stopped.
   */
  enabled: boolean;

  /**
   * `true` when the SDK is in the **moving** state (location services active);
   * `false` when stationary.
   *
   * @example
   * ```ts
   * // Toggle the SDK's motion state from stationary to moving.
   * BackgroundGeolocation.onMotionChange((event) => {
   *   console.log('[onMotionChange] isMoving?', event.isMoving);
   * });
   *
   * await BackgroundGeolocation.changePace(true);
   * // State.isMoving is now true.
   * ```
   */
  isMoving: boolean;

  /**
   * `true` when a {@link AppConfig.schedule} is configured and
   * {@link BackgroundGeolocation.startSchedule} has been called.
   * {@link BackgroundGeolocation.stopSchedule} sets this to `false`.
   */
  schedulerEnabled: boolean;

  /**
   * Current tracking mode.
   *
   * | Value | Mode | Description |
   * |------:|------|-------------|
   * | `0` | Geofences | Geofence monitoring only — no active location tracking. |
   * | `1` | Location | Location tracking and geofence monitoring. |
   *
   * @example
   * ```ts
   * await BackgroundGeolocation.start();
   * let state = await BackgroundGeolocation.getState();
   * console.log('Tracking mode:', state.trackingMode);
   * // > 'Tracking mode: 1'
   *
   * await BackgroundGeolocation.startGeofences();
   * state = await BackgroundGeolocation.getState();
   * console.log('Tracking mode:', state.trackingMode);
   * // > 'Tracking mode: 0'
   * ```
   */
  trackingMode: TrackingMode;

  /**
   * Accumulated distance traveled since the last odometer reset, in meters.
   *
   * **See also**
   * - {@link odometerError}
   * - {@link BackgroundGeolocation.setOdometer}
   * - {@link BackgroundGeolocation.getOdometer}
   */
  odometer: number;

  /**
   * Accumulated positional error in the odometer measurement, in meters.
   *
   * Reflects noise introduced by low-accuracy location samples. Use
   * {@link LocationFilter.odometerAccuracyThreshold} to filter out
   * low-accuracy samples from odometer calculations.
   */
  odometerError: number;

  /**
   * `true` when the app was relaunched in the background by the OS — for
   * example, due to a background fetch, geofence exit, or stationary geofence
   * transition. Always `false` on Android. [iOS only]
   */
  didLaunchInBackground: boolean;

  /**
   * `true` when the app was launched after a device reboot.
   */
  didDeviceReboot: boolean;
}

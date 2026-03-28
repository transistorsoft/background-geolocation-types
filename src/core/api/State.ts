import type { Config } from '../config/Config';
import type { Location } from '../data/Location';
import type { TrackingMode } from '../../enums/TrackingMode';

/**
 * Effective runtime state returned by `BackgroundGeolocation.ready/getState`.
 *
 * `State` **is** the active {@link Config} (compound), plus runtime-only fields.
 * 
 * @category Primary API
 */
export interface State extends Config {
  /** 
   * Whether the SDK has been enabled via `start` or `startGeofences`. 
   */ 
  enabled: boolean;

  /** 
   * Whether the SDK is currently in the *moving* state (vs stationary). 
   * 
   * @example
   * ```typescript
   * // If the SDK is currently in the *stationary* state, with State.isMoving == false:
   * 
   * BackgroundGeolocation.onMotionChange((isMoving) => {
   *   console.log('[onMotionChange] isMoving?', isMoving);
   * });
   * 
   * await BackgroundGeolocation.changePace(true);
   * // State.isMoving is now true.
   * ```
   */
  isMoving: boolean;

  /**
   * `true` when a schedule is configured and `startSchedule()` executed.
   * `stopSchedule()` will set this to `false`.
   */
  schedulerEnabled: boolean;

  /**
   * Tracking mode.
   *
   * | Value | Name       | Description                   |
   * |------:|------------|-------------------------------|
   * | 0     | Geofences  | Monitor geofences only.       |
   * | 1     | Location   | Monitor location + geofences. |
   * 
   * @example
   * ```typescript
   * await BackgroundGeolocation.start();
   * 
   * const state = await BackgroundGeolocation.getState();
   * console.log('Tracking mode:', state.trackingMode);
   * > 'Tracking mode: 1'
   * 
   * await BackgroundGeolocation.startGeofences();
   * console.log('Tracking mode:', state.trackingMode);
   * > 'Tracking mode: 0'
   * ```
   */
  trackingMode: TrackingMode;

  /**
   * Current distance-traveled in meters.
   * See: {@link odometerError}, {@link BackgroundGeolocation.setOdometer}, {@link BackgroundGeolocation.getOdometer}.
   */
  odometer: number;

  /**
   * The accumulated error in the odometer (in meters).
   */
  odometerError: number;

  /**
   * iOS only. `true` when the app was launched in the background due to a
   * background event (fetch, geofence exit, stationary geofence exit).
   * Always `false` on Android.
   */
  didLaunchInBackground: boolean;

  /** 
   * Indicates if the app was launched after a device reboot. 
   */
  didDeviceReboot: boolean;  
}
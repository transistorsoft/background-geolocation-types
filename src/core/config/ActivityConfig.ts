import { TriggerActivity } from '../../enums/TriggerActivity';

/**
 * Activity recognition configuration for the background geolocation SDK.
 *
 * `ActivityConfig` controls how the SDK interprets transitions between *moving*
 * and *stationary* states using platform motion APIs (Android Activity Recognition
 * and iOS Core Motion).
 *
 * ## Contents
 * - [Overview](#overview)
 * - [Stop detection](#stop-detection)
 * - [Motion trigger](#motion-trigger)
 * - [Migration](#migration)
 *
 * ---
 *
 * ## Overview
 *
 * | Category | Properties | Notes |
 * |----------|------------|-------|
 * | **Recognition cadence** | `activityRecognitionInterval`, `minimumActivityRecognitionConfidence` | How often and how confidently the SDK polls platform motion APIs. |
 * | **Stop detection** | `disableStopDetection`, `stopOnStationary`, `stopDetectionDelay` | Controls when the SDK transitions to stationary and stops tracking. `stopDetectionDelay` is [iOS only]. |
 * | **Motion trigger** | `motionTriggerDelay`, `triggerActivities` | Controls which activities start tracking and how quickly. `motionTriggerDelay` is [Android only]. |
 * | **Permission** | `disableMotionActivityUpdates` | Opt out of Motion & Fitness / Physical Activity permission requests. |
 *
 * @example
 * ```ts
 * BackgroundGeolocation.ready({
 *   activity: {
 *     // Poll activity recognition every 10 seconds (both platforms)
 *     activityRecognitionInterval: 10000,
 *
 *     // Require ≥75% confidence before changing activity (both platforms)
 *     minimumActivityRecognitionConfidence: 75,
 *
 *     // Disable automatic stop detection (both platforms)
 *     disableStopDetection: false,
 *
 *     // Automatically stop when stationary (both platforms)
 *     stopOnStationary: true,
 *
 *     // Delay motion-trigger transitions by 30s (Android only)
 *     motionTriggerDelay: 30000,
 *
 *     // Disable platform motion activity APIs (both platforms)
 *     disableMotionActivityUpdates: false,
 *
 *     // Delay stop-detection by 10s (iOS only)
 *     stopDetectionDelay: 10000
 *   }
 * });
 * ```
 *
 * ---
 *
 * ## Stop detection
 *
 * The SDK uses platform motion APIs to detect when the device has stopped moving
 * and transitions to the *stationary* state. In that state, location services are
 * paused to conserve battery.
 *
 * - {@link ActivityConfig.disableStopDetection} disables this mechanism entirely.
 *   With it off, location services run continuously.
 * - {@link ActivityConfig.stopOnStationary} takes it a step further — the SDK
 *   calls `stop()` on itself when the {@link GeoConfig.stopTimeout} elapses,
 *   ending all tracking.
 * - {@link ActivityConfig.stopDetectionDelay} (iOS only) adds a grace period
 *   before the stop-detection system engages, preventing false stops at traffic
 *   lights or brief pauses.
 *
 * ---
 *
 * ## Motion trigger
 *
 * When in the *stationary* state, the SDK waits for a motion event before
 * re-engaging location tracking:
 *
 * - {@link ActivityConfig.triggerActivities} limits which activity types can
 *   trigger the transition to *moving*. By default all moving activities trigger.
 * - {@link ActivityConfig.motionTriggerDelay} (Android only) adds a delay before
 *   committing to the *moving* state. If the device returns to `still` before the
 *   delay expires, the transition is cancelled.
 *
 * ---
 *
 * ## Migration
 *
 * Activity recognition options previously lived at the root of `Config`. They are
 * now grouped under the `activity` key. Legacy flat keys remain available but are
 * **deprecated** and will be removed in a future major release.
 *
 * @example
 * ```ts
 * // Legacy (deprecated)
 * BackgroundGeolocation.ready({
 *   activityRecognitionInterval: 10000,
 *   disableStopDetection: true,
 *   stopOnStationary: true
 * });
 * ```
 *
 * @example
 * ```ts
 * // Current
 * BackgroundGeolocation.ready({
 *   activity: {
 *     activityRecognitionInterval: 10000,
 *     disableStopDetection: true,
 *     stopOnStationary: true
 *   }
 * });
 * ```
 *
 * **See also**
 * - {@link Config.activity}
 *
 * @category Config
 */
export interface ActivityConfig {
  /**
   * Interval in milliseconds between motion-activity polls. Defaults to
   * `10000` ms (10 seconds).
   *
   * Lower values increase responsiveness to state changes at the cost of
   * additional battery use. The minimum supported value is `500` ms.
   */
  activityRecognitionInterval?: number;

  /**
   * Minimum confidence level (0–100) required before a detected activity
   * triggers a moving/stationary state change.
   *
   * Defaults to `70` on iOS and `75` on Android. Higher values reduce
   * false-positive transitions but may cause the SDK to react more slowly
   * to genuine activity changes.
   */
  minimumActivityRecognitionConfidence?: number;

  /**
   * Disables the motion-activity-based stop-detection system. Defaults to
   * `false`.
   *
   * ## iOS
   *
   * Disables the accelerometer-based stop-detection system. When disabled,
   * the SDK falls back to the default iOS behaviour of automatically turning
   * off location services after the device has been stationary for exactly
   * 15 minutes. {@link GeoConfig.stopTimeout} has no effect in this state.
   *
   * To prevent iOS from ever turning off location services automatically,
   * also set {@link GeoConfig.pausesLocationUpdatesAutomatically} to `false`.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   activity: {
   *     disableStopDetection: true,
   *   },
   *   geolocation: {
   *     pausesLocationUpdatesAutomatically: false
   *   }
   * });
   * ```
   *
   * ## ⚠️ Warning
   *
   * With the above configuration, iOS location services will never turn off
   * and the battery will drain rapidly. Use this only when you have explicit
   * start/stop controls in your app (for example, a workout app with
   * **Start** / **Stop** buttons calling {@link BackgroundGeolocation.changePace}).
   *
   * ![](https://dl.dropbox.com/scl/fi/fhkz97f9jl4omnv7y30by/ios-stop-detection-timing.png?rlkey=cvs9h2nnngmmz9bwh1vg3796g&dl=1)
   *
   * ## Android
   *
   * Location services will never turn off while `disableStopDetection` is
   * `true`. The only way to stop tracking is to call
   * {@link BackgroundGeolocation.changePace} `false` or
   * {@link BackgroundGeolocation.stop} explicitly.
   */
  disableStopDetection?: boolean;

  /**
   * Automatically calls {@link BackgroundGeolocation.stop} when the
   * {@link GeoConfig.stopTimeout} elapses. Defaults to `false`.
   *
   * When the SDK transitions to the *stationary* state and the
   * `stopTimeout` timer expires, the SDK calls `stop()` on itself — ending
   * all tracking. The next tracking session must be started manually.
   *
   * ## ⚠️ Warning
   *
   * `stopOnStationary` fires only when the {@link GeoConfig.stopTimeout}
   * timer elapses naturally. It does **not** fire when
   * {@link BackgroundGeolocation.changePace} `false` is called manually.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   activity: {
   *     stopOnStationary: true,
   *   }
   * }).then(() => {
   *   BackgroundGeolocation.start();
   * });
   * ```
   */
  stopOnStationary?: boolean;

  /**
   * Adds a delay in milliseconds before the SDK commits to the *moving* state
   * when the Motion API reports movement. Defaults to `0` (no delay).
   * [Android only]
   *
   * When the Motion API reports a moving activity (e.g. `on_foot`,
   * `in_vehicle`), the SDK waits `motionTriggerDelay` milliseconds before
   * transitioning to *moving* and starting location tracking. If the Motion
   * API returns to `still` before the delay expires, the transition is
   * cancelled. This prevents false-positive triggers when briefly moving
   * around a stationary location (for example, walking around a home).
   *
   * The following log shows a device detecting `on_foot` but returning to
   * `still` before the delay expires, cancelling the transition:
   *
   * ```bash
   *  04-08 10:58:03.419 TSLocationManager: ╔═════════════════════════════════════════════
   *  04-08 10:58:03.419 TSLocationManager: ║ Motion Transition Result
   *  04-08 10:58:03.419 TSLocationManager: ╠═════════════════════════════════════════════
   *  04-08 10:58:03.419 TSLocationManager: ╟─ 🔴  EXIT: still
   *  04-08 10:58:03.419 TSLocationManager: ╟─ 🎾  ENTER: on_foot
   *  04-08 10:58:03.419 TSLocationManager: ╚═════════════════════════════════════════════
   *  04-08 10:58:03.416 TSLocationManager:   ⏰ Scheduled OneShot: MOTION_TRIGGER_DELAY in 30000ms
   *  .
   *  . <motionTriggerDelay timer started>
   *  .
   *  04-08 10:58:19.385 TSLocationManager: ╔═════════════════════════════════════════════
   *  04-08 10:58:19.385 TSLocationManager: ║ Motion Transition Result
   *  04-08 10:58:19.385 TSLocationManager: ╠═════════════════════════════════════════════
   *  04-08 10:58:19.385 TSLocationManager: ╟─ 🔴  EXIT: on_foot
   *  04-08 10:58:19.385 TSLocationManager: ╟─ 🎾  ENTER: still
   *  04-08 10:58:19.385 TSLocationManager: ╚═════════════════════════════════════════════
   *  04-08 10:58:19.381 TSLocationManager: [c.t.l.s.TSScheduleManager cancelOneShot]
   *  04-08 10:58:19.381 TSLocationManager:   ⏰ Cancel OneShot: MOTION_TRIGGER_DELAY <-- timer cancelled
   * ```
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   activity: {
   *     motionTriggerDelay: 30000
   *   }
   * });
   * ```
   */
  motionTriggerDelay?: number;

  /**
   * Restricts which detected activities can trigger a transition from the
   * *stationary* state to the *moving* state.
   *
   * By default the SDK triggers on any moving activity: `in_vehicle`,
   * `on_bicycle`, `on_foot`, `running`, or `walking`. Configure this to
   * limit tracking to specific use cases — for example, vehicles only.
   *
   * See {@link TriggerActivity} for all valid activity names.
   *
   * ## ⚠️ Warning
   *
   * Using `triggerActivities` requires the user to grant the
   * **Motion & Fitness** (iOS) or **Physical Activity** (Android 10+)
   * permission.
   *
   * @example
   * ```ts
   * // Only trigger tracking for vehicles
   * BackgroundGeolocation.ready({
   *   activity: {
   *     triggerActivities: ["in_vehicle"]
   *   }
   * });
   *
   * // Only trigger tracking for on_foot, walking and running
   * BackgroundGeolocation.ready({
   *   activity: {
   *     triggerActivities: ["on_foot", "walking", "running"]
   *   }
   * });
   * ```
   */
  triggerActivities?: TriggerActivity[] | TriggerActivity;

  /**
   * Disables the SDK's request for Motion & Fitness (iOS) or Physical
   * Activity (Android 10+) permission. Defaults to `false`.
   *
   * Set to `true` to suppress the permission request. The SDK remains
   * functional but without motion data it relies on less efficient fallback
   * mechanisms to detect moving/stationary transitions.
   *
   * ## iOS
   *
   * The SDK is highly optimized around motion-activity updates. Disabling
   * them increases battery consumption. Provide an
   * `NSMotionUsageDescription` in your `Info.plist` to explain the benefit
   * to users — for example:
   * > "Motion activity detection increases battery efficiency by
   * > intelligently toggling location tracking off when your device is
   * > stationary."
   *
   * ![](https://dl.dropbox.com/s/v3qt7ry1k4b3iir/ios-motion-permission.png?dl=1)
   *
   * ## Android
   *
   * Android 10+ requires runtime permission for Physical Activity. Without
   * it, the SDK falls back to a stationary geofence mechanism — the device
   * must move **200–500 m** before tracking re-engages, compared to just a
   * few meters when the Motion API is authorized.
   *
   * ![](https://dl.dropbox.com/s/6v4391oz592bdjg/android-permission-physical-activity.png?dl=1)
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   activity: {
   *     disableMotionActivityUpdates: true
   *   }
   * });
   * ```
   */
  disableMotionActivityUpdates?: boolean;

  /**
   * Delays the iOS stop-detection system from engaging after the device
   * becomes stationary. Defaults to `0` (engage immediately). [iOS only]
   *
   * When the stop-detection system engages, location services are temporarily
   * turned off and only the accelerometer is monitored. The delay timer starts
   * when the device is detected as stationary and is cancelled if any movement
   * is detected before it expires. Setting `stopDetectionDelay` to a non-zero
   * value helps avoid false stops at traffic lights or brief pauses.
   *
   * Enable {@link LoggerConfig.debug} to observe stop-detection in action —
   * the SDK emits a sound effect and local notifications when location services
   * toggle on and off.
   *
   * ![](https://dl.dropbox.com/scl/fi/fhkz97f9jl4omnv7y30by/ios-stop-detection-timing.png?rlkey=cvs9h2nnngmmz9bwh1vg3796g&dl=1)
   */
  stopDetectionDelay?: number;
}

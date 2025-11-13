import { TriggerActivity } from '../../enums/TriggerActivity';

/**
 * Activity Recognition configuration.
 *
 * The {@link ActivityConfig} object defines options related to motion and activity detection
 * for the {@link BackgroundGeolocation} SDK. These parameters control how the SDK interprets
 * transitions between *moving* and *stationary* states using platform motion APIs
 * (Android Activity Recognition / iOS Core Motion).
 *
 * __Overview__ 
 *
 * {@link ActivityConfig} is supplied via {@link Config.activity} when calling
 * {@link BackgroundGeolocation.ready} or {@link BackgroundGeolocation.setConfig}.
 *
 * | Category              | Description |
 * |-----------------------|-------------|
 * | Motion Detection      | Tune recognition cadence and sensitivity via {@link ActivityConfig.activityRecognitionInterval} *(Android)* and {@link ActivityConfig.minimumActivityRecognitionConfidence} *(Android)*. |
 * | Behavioral Options    | Control moving↔stationary transitions with {@link ActivityConfig.disableStopDetection} *(cross-platform behavioral)*, {@link ActivityConfig.stopOnStationary} *(cross-platform behavioral)*, and {@link ActivityConfig.motionTriggerDelay} *(Android)*. |
 * | Motion Updates Toggle | Enable/disable platform activity updates with {@link ActivityConfig.disableMotionActivityUpdates} *(Android & iOS)*. |
 * | iOS Timing            | Fine-tune stop-detection timing with {@link ActivityConfig.stopDetectionDelay} *(iOS)*. |
 *
 * @example
 *
 * ```ts
 * import BackgroundGeolocation, {
 *   type Config,
 *   type ActivityConfig
 * } from 'react-native-background-geolocation';
 *
 * const activity: ActivityConfig = {
 *   // Android: poll activity recognition every 10s
 *   activityRecognitionInterval: 10000,
 *
 *   // Android: require ≥75% confidence before changing activity
 *   minimumActivityRecognitionConfidence: 75,
 *
 *   // Cross-platform: enable/disable automatic stop detection
 *   disableStopDetection: false,
 *
 *   // Cross-platform: automatically stop when stationary
 *   stopOnStationary: true,
 *
 *   // Android: delay motion-trigger transitions by 30s
 *   motionTriggerDelay: 30000,
 *
 *   // Android & iOS: disable platform motion activity APIs
 *   disableMotionActivityUpdates: false,
 *
 *   // iOS: delay stop-detection by 10s
 *   stopDetectionDelay: 10000
 * };
 *
 * const config: Config = {
 *   activity
 * };
 *
 * await BackgroundGeolocation.ready(config);
 * ```
 *
 * __Migrating from legacy `Config`__
 *
 * Older versions of the SDK placed activity-recognition parameters directly
 * on the root {@link Config} object:
 *
 * ```ts
 * BackgroundGeolocation.ready({
 *   activityRecognitionInterval: 10000,
 *   disableStopDetection: true,
 *   stopOnStationary: true
 * });
 * ```
 *
 * These values are now grouped under {@link ActivityConfig}:
 *
 * ```ts
 * BackgroundGeolocation.ready({
 *   activity: {
 *     activityRecognitionInterval: 10000,
 *     disableStopDetection: true,
 *     stopOnStationary: true
 *   }
 * });
 * ```
 *
 * __See also__ 
 * - {@link Config.activity} for where this configuration is supplied.
 * 
 * @category Config
 */
export interface ActivityConfig {
  /** 
   * Interval (ms) between motion-activity updates.
   * Default: `10000`
   */
  activityRecognitionInterval?: number;

  /** 
   * Minimum motion-activity confidence (0–100) required to trigger a state change (Android only). 
   * Default: `75`
   */
  minimumActivityRecognitionConfidence?: number;

  /**
   * Disable motion-activity related stop-detection.
   *
   * __iOS:__
   *
   * Disables the accelerometer-based **Stop-detection System**.  When disabled, the plugin will use the default iOS behavior of automatically
   * turning off location-services when the device has stopped for **exactly 15 minutes**.  When disabled, you will no longer have control over {@link GeoConfig.stopTimeout}.
   *
   * To *completely* disable automatically turning off iOS location-services, you must also provide {@link GeoConfig.pausesLocationUpdatesAutomatically} __`false`__.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.ready({
   *   disableStopDetection: true,
   *   pausesLocationUpdatesAutomatically: false
   * });
   * ```
   *
   * __⚠️ iOS location-services will **never** turn off!__
   *
   * With the above configuration, iOS location-services will never turn off and you could **quickly discharge the battery**.  Do **not** do
   * this unless you know *exactly* what you're doing (eg: A jogging app with `[Start workout]` / `[Stop Workout]` buttons
   * executing {@link BackgroundGeolocation.changePace}).
   *
   * __iOS Stop-detection timing__
   *
   * ![](https://dl.dropboxusercontent.com/s/ojjdfkmua15pskh/ios-stop-detection-timing.png?dl=1)
   *
   * __Android__
   *
   * Location-services **will never turn OFF** if you set this to **`true`**!  It will be purely up to you or the user to execute
   * {@link BackgroundGeolocation.changePace} __`false`__ or {@link BackgroundGeolocation.stop} to turn off location-services.
   */
  disableStopDetection?: boolean;

  /**
   * Automatically {@link BackgroundGeolocation.stop} when the {@link GeoConfig.stopTimeout} elapses.
   *
   * The plugin can optionally automatically stop tracking when the {@link GeoConfig.stopTimeout} timer elapses.  For example, when the plugin
   * first fires {@link BackgroundGeolocation.onMotionChange} into the *moving* state, the next time an *onMotionChange* event occurs
   * into the *stationary* state, the plugin will have automatically called {@link BackgroundGeolocation.stop} upon itself.
   *
   * ⚠️ `stopOnStationary` will **only** occur due to {@link GeoConfig.stopTimeout} timer elapse.  It will **not** occur by manually executing
   * {@link BackgroundGeolocation.changePace} __`false`__.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.ready({
   *   stopOnStationary: true,
   *   isMoving: true
   * }, (state) => {
   *   BackgroundGeolocation.start();
   * });
   * ```
   */  
  stopOnStationary?: boolean;

  /**
   * __`[Android only]`__  Optionally add a delay in milliseconds to trigger Android into the *moving* state when Motion API reports the device is moving (eg: `on_foot`, `in_vehicle`)
   *
   * This can help prevent false-positive motion-triggering when one moves about their home, for example.  Only if the Motion API stays in the *moving* state for `motionTriggerDelay` milliseconds will the plugin trigger into the *moving* state and begin tracking the location.
   * If the Motion API returns to the `still` state before `motionTriggerDelay` times-out, the trigger to the *moving* state will be cancelled.
   *
   * @example
   * ```typescript
   * // Delay Android motion-triggering by 30000ms
   * BackgroundGeolocation.ready({
   *   motionTriggerDelay: 30000
   * })
   * ```
   *
   * The following `logcat` shows an Android device detecting motion __`on_foot`__ but returning to __`still`__ before __`motionTriggerDelay`__ expires, cancelling the transition to the *moving* state (see `⏰ Cancel OneShot: MOTION_TRIGGER_DELAY`):
   *
   * __Logcat__
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
   */
  motionTriggerDelay?: number;

  /**
   * Configures a comma-separated list of motion-activities which are allow to trigger location-tracking.
   * 
   * __⚠️ Warning:__ Requires that the user grant your app the "*Motion/Health*" permission.
   * 
   *
   * These are the comma-delimited list of [activity-names](https://developers.google.com/android/reference/com/google/android/gms/location/DetectedActivity) returned by the `ActivityRecognition` API which will trigger a state-change from **stationary** to **moving**.  By default, the plugin will trigger on **any** of the **moving-states**:
   *
   * | Activity Name  |
   * |----------------|
   * | `in_vehicle`   |
   * | `on_bicycle`   |
   * | `on_foot`      |
   * | `running`      |
   * | `walking`      |
   *
   * See {@link TriggerActivity} for all allowed activity names.
   *
   * If you wish, you can configure the plugin to only engage the **moving** state for vehicles-only by providing just `"in_vehicle"`, for example.
   *
   *
   * @example
   * ```typescript
   * // Only trigger tracking for vehicles
   * BackgroundGeolocation.ready({
   *   triggerActivities: "in_vehicle"
   * );
   *
   * // Only trigger tracking for on_foot, walking and running
   * BackgroundGeolocation.ready({
   *   triggerActivities: "on_foot, walking, running"
   * );
   * ```
   */
  triggerActivities?: TriggerActivity[] | TriggerActivity;

  /**
   * Disable the plugin requesting "Motion & Fitness" (ios) or "Physical Activity" (android >= 10) authorization from the User.
   *
   * Defaults to **`false`**.  Set to **`true`** to disable asking the user for this permission.
   *
   * __iOS__
   *
   * ![](https://dl.dropbox.com/s/v3qt7ry1k4b3iir/ios-motion-permission.png?dl=1)
   *
   * The plugin is **HIGHLY** optimized for motion-activity-updates.  If you **do** disable this, the plugin *will* drain more battery power.  You are **STRONGLY** advised against disabling this.  You should explain to your users with an appropriate `NSMotionUsageDescription` in your `Info.plist` file, for example:
   * > "Motion activity detection increases battery efficiency by intelligently toggling location-tracking" off when your device is detected to be stationary.
   *
   * __Android__
   *
   * Android 10+ now requires run-time permission from the user for "Physical Activity".
   * 
   * ![](https://dl.dropbox.com/s/6v4391oz592bdjg/android-permission-physical-activity.png?dl=1)
   *
   * Traditionally, the `background-geolocation` Android SDK has relied heavily upon the Motion API for determining when to toggle location-services on/off based upon whether the device is *moving* vs *stationary*.
   * However, the Android SDK has a fallback "stationary geofence" mechanism just like iOS, the exit of which will cause the plugin to change to the *moving* state, toggle location-services and begin tracking.  This will, of course, require the device moves a distance of typically **200-500 meters** before tracking engages.  With the Motion API authorized, the Android SDK typically requires just **a few meters** of movement for tracking to engage.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.ready({
   *   disableMotionActivityUpdates: true
   * });
   * ```
   */
  disableMotionActivityUpdates?: boolean;

  /**
   * __`[iOS only]`__ Allows the iOS stop-detection system to be delayed from activating.
   *  
   * Defaults to **`0`** (no delay).  Allows the stop-detection system to be delayed from activating.  When the stop-detection system *is* engaged, location-services will be temporarily turned **off** and only the accelerometer is monitored.  Stop-detection will only engage if this timer expires.  The timer is cancelled if any movement is detected before expiration.  If a value of **`0`** is specified, the stop-detection system will engage as soon as the device is detected to be stationary.
   *
   * You can experience the iOS stop-detection system at work by configuring {@link LoggerConfig.debug} __`true`__.  After the device stops moving (stopped at a traffic light, for example), the plugin will emit a *Lullabye* sound-effect and local-notifications about "Location-services: OFF / ON".
   *
   * __iOS Stop-detection timing__
   *
   * ![](https://dl.dropboxusercontent.com/s/ojjdfkmua15pskh/ios-stop-detection-timing.png?dl=1)
   */
  stopDetectionDelay?: number;
}


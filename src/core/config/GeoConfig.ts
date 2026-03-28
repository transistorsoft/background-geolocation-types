import { DesiredAccuracy } from '../../enums/DesiredAccuracy';
import { LocationFilter } from './LocationFilter';
import { ActivityType } from '../../enums/ActivityType';
/**
 * Geolocation configuration for the background geolocation SDK.
 *
 * `GeoConfig` controls how the SDK acquires, filters, and records device locations —
 * the accuracy tier, sampling rate, speed-based elasticity, stop-detection, platform
 * permissions, geofence proximity, and GPS noise filtering.
 *
 * ## Contents
 * - [Overview](#overview)
 * - [Accuracy and sampling](#accuracy-and-sampling)
 * - [Elasticity](#elasticity)
 * - [Motion detection](#motion-detection)
 * - [Permissions](#permissions)
 * - [Geofencing](#geofencing)
 * - [Filtering](#filtering)
 * - [Migration](#migration)
 * - [Examples](#examples)
 *
 * ---
 *
 * ## Overview
 *
 * `GeoConfig` is supplied via {@link Config.geolocation} when calling
 * {@link BackgroundGeolocation.ready} or {@link BackgroundGeolocation.setConfig}.
 *
 * | Category | Properties |
 * |----------|------------|
 * | **Accuracy** | {@link desiredAccuracy}, {@link distanceFilter}, {@link locationUpdateInterval}, {@link fastestLocationUpdateInterval} |
 * | **Elasticity** | {@link disableElasticity}, {@link elasticityMultiplier} |
 * | **Motion detection** | {@link stationaryRadius}, {@link stopTimeout}, {@link stopAfterElapsedMinutes}, {@link disableStopDetection} |
 * | **Permissions** | {@link locationAuthorizationRequest}, {@link locationAuthorizationAlert}, {@link disableLocationAuthorizationAlert} |
 * | **Geofencing** | {@link geofenceProximityRadius}, {@link geofenceModeHighAccuracy}, {@link geofenceInitialTriggerEntry} |
 * | **Filtering** | {@link filter} |
 *
 * @example
 * ```ts
 * BackgroundGeolocation.ready({
 *   geolocation: {
 *     desiredAccuracy: DesiredAccuracy.High,
 *     distanceFilter: 10,
 *     stopTimeout: 5,
 *     locationAuthorizationRequest: "Always"
 *   }
 * });
 * ```
 *
 * ---
 *
 * ## Accuracy and sampling
 *
 * {@link desiredAccuracy} selects the location-provider tier. Only
 * {@link DesiredAccuracy.High} activates GPS — lower tiers use Wi-Fi and cell towers
 * and consume significantly less power.
 *
 * {@link distanceFilter} sets the minimum horizontal movement in meters before a new
 * location is recorded. By default it scales automatically with speed — see
 * [Elasticity](#elasticity).
 *
 * On Android, {@link locationUpdateInterval} and {@link fastestLocationUpdateInterval}
 * replace `distanceFilter` for time-based sampling. Set `distanceFilter` to `0` to
 * activate these. {@link deferTime} batches location deliveries to reduce power
 * consumption.
 *
 * {@link useSignificantChangesOnly} disables continuous tracking in favour of coarse
 * periodic updates (~500–1000 m) with dramatically lower power consumption.
 *
 * ---
 *
 * ## Elasticity
 *
 * By default, the SDK scales {@link distanceFilter} automatically as the device's speed
 * changes — recording fewer locations at highway speed and more at walking speed.
 *
 * The formula rounds speed to the nearest 5 m/s then multiplies:
 *
 * ```
 * adjusted_distanceFilter = (round(speed, 5) / 5) × distanceFilter × elasticityMultiplier
 * ```
 *
 * Set {@link disableElasticity} to `true` to use a fixed `distanceFilter`. Increase
 * {@link elasticityMultiplier} to space locations further apart at speed.
 *
 * ---
 *
 * ## Motion detection
 *
 * The SDK uses platform motion APIs to switch between *moving* and *stationary* states,
 * turning location services off when the device is idle to save power.
 *
 * - {@link stationaryRadius} — minimum distance from the last stationary fix before
 *   continuous tracking re-engages.
 * - {@link stopTimeout} — minutes to wait after the activity recognition system reports
 *   `STILL` before transitioning to the stationary state.
 * - {@link stopAfterElapsedMinutes} — automatically stop tracking after N minutes.
 * - {@link stopOnStationary} — automatically call {@link BackgroundGeolocation.stop}
 *   when the device enters the stationary state.
 * - {@link disableStopDetection} — disable the motion-activity–based stop-detection
 *   system entirely.
 * - {@link pausesLocationUpdatesAutomatically} — [iOS only] whether iOS may
 *   automatically suspend location updates.
 *
 * ---
 *
 * ## Permissions
 *
 * {@link locationAuthorizationRequest} declares which authorization level your app
 * requires (`"Always"`, `"WhenInUse"`, or `"Any"`). The SDK guides users through the
 * platform permission flow and presents {@link locationAuthorizationAlert} when the
 * granted level falls below what was requested.
 *
 * Set {@link disableLocationAuthorizationAlert} to `true` to suppress the SDK's
 * automatic alert and handle authorization changes manually via
 * {@link BackgroundGeolocation.onProviderChange}.
 *
 * ---
 *
 * ## Geofencing
 *
 * The SDK removes the platform limit on monitored geofences by maintaining a spatial
 * database and activating only the geofences within {@link geofenceProximityRadius} of
 * the current position. As the device moves, the active set updates automatically,
 * firing {@link BackgroundGeolocation.onGeofencesChange}.
 *
 * {@link geofenceModeHighAccuracy} [Android only] runs the geofence-only service with a
 * foreground service and active location updates for near-instant transition detection.
 *
 * {@link geofenceInitialTriggerEntry} controls whether a geofence fires an entry event
 * immediately if the device is already inside it when the geofence is registered.
 *
 * ---
 *
 * ## Filtering
 *
 * {@link filter} applies Kalman smoothing, rolling-window averaging, and accuracy and
 * speed constraints to raw platform samples before they are recorded. This reduces GPS
 * jitter and improves odometer accuracy. See {@link LocationFilter} for full
 * documentation.
 *
 * ---
 *
 * ## Migration
 *
 * Geolocation options previously lived at the root of `Config`. They are now grouped
 * under the `geolocation` key. Legacy flat keys remain supported but are **deprecated**
 * and will be removed in a future major release.
 *
 * @example
 * ```ts
 * // Legacy (deprecated)
 * BackgroundGeolocation.ready({
 *   desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
 *   distanceFilter: 10,
 *   stopTimeout: 5,
 *   stationaryRadius: 150,
 *   locationTimeout: 60
 * });
 *
 * // Current
 * BackgroundGeolocation.ready({
 *   geolocation: {
 *     desiredAccuracy: DesiredAccuracy.High,
 *     distanceFilter: 10,
 *     stopTimeout: 5,
 *     stationaryRadius: 150,
 *     locationTimeout: 60
 *   }
 * });
 * ```
 *
 * ---
 *
 * ## Examples
 *
 * @example High-accuracy tracking
 * ```ts
 * BackgroundGeolocation.ready({
 *   geolocation: {
 *     desiredAccuracy: DesiredAccuracy.High,
 *     distanceFilter: 10,
 *     stopTimeout: 5,
 *     showsBackgroundLocationIndicator: true
 *   }
 * });
 * ```
 *
 * @example Low-power significant-changes mode
 * ```ts
 * BackgroundGeolocation.ready({
 *   geolocation: {
 *     useSignificantChangesOnly: true
 *   }
 * });
 * ```
 *
 * @example Geofencing with high accuracy
 * ```ts
 * BackgroundGeolocation.ready({
 *   geolocation: {
 *     geofenceProximityRadius: 1000,
 *     geofenceInitialTriggerEntry: true,
 *     geofenceModeHighAccuracy: true,
 *     desiredAccuracy: DesiredAccuracy.Medium,
 *     locationUpdateInterval: 5000,
 *     distanceFilter: 0
 *   }
 * });
 * await BackgroundGeolocation.startGeofences();
 * ```
 *
 * @category Config
 */
export interface GeoConfig {

  /**
   * Specifies the desired accuracy of the geolocation system.
   *
   * Defaults to {@link DesiredAccuracy.High}.
   *
   * | Name | Location Providers | Description |
   * |------|--------------------|-------------|
   * | {@link DesiredAccuracy.Navigation} | (**iOS only**) GPS + Wifi + Cellular | Highest power; highest accuracy |
   * | {@link DesiredAccuracy.High}       | GPS + Wifi + Cellular                | Highest power; highest accuracy |
   * | {@link DesiredAccuracy.Medium}     | Wifi + Cellular                      | Medium power; Medium accuracy;  |
   * | {@link DesiredAccuracy.Low}        | Wifi (low power) + Cellular          | Lower power; No GPS             |
   * | {@link DesiredAccuracy.VeryLow}   | Cellular only                        | Lowest power; lowest accuracy   |
   * | {@link DesiredAccuracy.Lowest}     | (**iOS only**)                       | Lowest power; lowest accuracy   |
   *
   * ## Note
   * Only {@link DesiredAccuracy.High} uses GPS. `speed`, `heading`, and `altitude` are
   * available only when GPS is active.
   *
   * **See also**
   * - [Android location accuracy](https://developer.android.com/reference/com/google/android/gms/location/LocationRequest.html#PRIORITY_BALANCED_POWER_ACCURACY)
   * - [iOS desiredAccuracy](https://developer.apple.com/reference/corelocation/cllocationmanager/1423836-desiredaccuracy?language=objc)
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     desiredAccuracy: DesiredAccuracy.High,
   *   }
   * });
   * ```
   */
  desiredAccuracy?: DesiredAccuracy;

  /**
   * Specifies the Core Motion activity type used by iOS to optimize its internal
   * stop-detection algorithm. [iOS only]
   *
   * Apple is intentionally vague about how this affects motion interpretation,
   * but each activity type provides platform hints about the expected movement
   * pattern (e.g., automotive navigation, fitness, airborne).
   *
   * Available values are defined as constants on {@link ActivityType}.
   *
   * | Name |
   * |------|
   * | {@link ActivityType.Other}                       |
   * | {@link ActivityType.AutomotiveNavigation}        |
   * | {@link ActivityType.Fitness}                     |
   * | {@link ActivityType.OtherNavigation}             |
   * | {@link ActivityType.Airborne}                    |
   *
   * ## Note
   * For more details, see Apple's documentation:
   * https://developer.apple.com/reference/corelocation/cllocationmanager/1620567-activitytype
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     activityType: ActivityType.Other,
   *   },
   * });
   * ```
   *
   * @category Geolocation
   */
  activityType?: ActivityType;

  /**
   * The minimum distance (meters) a device must move horizontally before a new location
   * is recorded.
   *
   * Defaults to `10` meters.
   *
   * By default, `distanceFilter` is elastically auto-scaled by the SDK: when speed
   * increases, `distanceFilter` increases; when speed decreases, so too does
   * `distanceFilter`.
   *
   * ## Note
   * - To disable auto-scaling, set {@link disableElasticity} to `true`.
   * - To control the scale of the automatic calculation, see {@link elasticityMultiplier}.
   *
   * `distanceFilter` is auto-scaled by rounding speed to the nearest `5 m/s` and
   * multiplying `distanceFilter` by the result:
   *
   * ## At biking speed (7.7 m/s, distanceFilter: 30)
   * ```
   * rounded_speed = round(7.7, 5)  => 10
   * multiplier = rounded_speed / 5  => 10 / 5 = 2
   * adjusted_distanceFilter = multiplier * distanceFilter
   *   => 2 * 30 = 60 meters
   * ```
   *
   * ## At highway speed (27 m/s, distanceFilter: 50)
   * ```
   * rounded_speed = round(27, 5)    => 30
   * multiplier = rounded_speed / 5  => 30 / 5 = 6
   * adjusted_distanceFilter = multiplier * distanceFilter * elasticityMultiplier
   *   => 6 * 50 = 300 meters
   * ```
   *
   * The following example shows elasticity on highway 101 towards San Francisco as the
   * driver slows into traffic — locations compress as `distanceFilter` decreases.
   *
   * ![distanceFilter at highway speed](https://dl.dropboxusercontent.com/s/uu0hs0sediw26ar/distance-filter-highway.png?dl=1)
   *
   * Compare background-geolocation at city scale. The left-hand track is from a
   * cab-ride; the right-hand track is walking speed.
   *
   * ![distanceFilter at city scale](https://dl.dropboxusercontent.com/s/yx8uv2zsimlogsp/distance-filter-city.png?dl=1)
   */
  distanceFilter?: number;

  /**
   * The minimum distance the device must move beyond the stationary location before
   * aggressive background-tracking re-engages.
   *
   * ## iOS
   * Defaults to `25` meters. In practice, iOS requires approximately **200 meters**
   * of movement before triggering exit from the stationary state — the platform does not
   * detect departure at the exact radius boundary.
   *
   * ## Android
   * Defaults to `150` meters (minimum `25`, maximum `1000`).
   *
   * ## Warning
   * Setting `stationaryRadius: 0` has no effect — a minimum of `25` meters is enforced.
   * In practice, the native API does not respond until the device has moved approximately
   * 200 meters.
   *
   * The following image shows the typical distance iOS requires to detect exit from the
   * stationary radius:
   * - *Green polylines*: transition from **stationary** → **moving** (~200 meters).
   * - *Red circles*: locations where the SDK entered the stationary state.
   *
   * ![](https://dl.dropboxusercontent.com/s/vnio90swhs6xmqm/screenshot-ios-stationary-exit.png?dl=1)
   *
   * **See also**
   * - 📘 [Philosophy of Operation](github:wiki/Philosophy-of-Operation)
   */
  stationaryRadius?: number;

  /**
   * Minutes to wait in the *moving* state with no detected movement before transitioning
   * to the *stationary* state.
   *
   * Defaults to `5` minutes.
   *
   * When in the *moving* state, the SDK waits this many minutes after the activity
   * recognition system reports `STILL` before turning off location services. A common
   * use-case is to delay GPS OFF while a car is stopped at a traffic light.
   *
   * ## Warning
   * Setting a very long `stopTimeout` keeps location services active while the device is
   * potentially motionless for extended periods, which may significantly impact battery
   * life.
   *
   * **See also**
   * - {@link BackgroundGeolocation.onMotionChange}
   * - 📘 [Philosophy of Operation](github:wiki/Philosophy-of-Operation)
   */
  stopTimeout?: number;

  /**
   * Automatically calls {@link BackgroundGeolocation.stop} when the {@link stopTimeout}
   * elapses.
   *
   * When `true`, the SDK stops itself the next time {@link BackgroundGeolocation.onMotionChange}
   * fires into the *stationary* state after the {@link stopTimeout} timer elapses.
   *
   * ## Warning
   * `stopOnStationary` fires only when the SDK transitions to the stationary state due
   * to {@link stopTimeout} expiry. It does **not** fire when you manually call
   * {@link BackgroundGeolocation.changePace} with `false`.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     stopOnStationary: true,
   *   },
   *   app: {
   *     isMoving: true,
   *   }
   * }, (state) => {
   *   BackgroundGeolocation.start();
   * });
   * ```
   */
  stopOnStationary?: boolean;

  /**
   * Prevents the iOS location API from automatically pausing location updates. [iOS only]
   *
   * When set to `false`, iOS location services never turn off automatically. By default
   * (`true`), the SDK manages this automatically — turning location services off after
   * {@link stopTimeout} minutes of inactivity.
   *
   * Setting this to `false` forces:
   * - {@link ActivityConfig.disableStopDetection} to `true` automatically
   * - You to manage tracking lifetime manually
   *
   * ## Warning
   * Setting this to `false` can cause **severe battery drain**. Only use this for
   * highly specialised use-cases where you fully control tracking lifecycle (for
   * example, a workout app that calls {@link BackgroundGeolocation.changePace} directly).
   * {@link AppConfig.preventSuspend} will no longer function in this mode.
   */
  pausesLocationUpdatesAutomatically?: boolean;

  /**
   * Disables automatic speed-based {@link distanceFilter} scaling.
   *
   * Defaults to `false`. When `false`, the SDK automatically increases
   * {@link distanceFilter} as speed increases (and decreases it as speed decreases)
   * to record fewer locations and conserve energy.
   *
   * The following example shows elasticity in action on highway 101 towards San
   * Francisco — locations become compressed as `distanceFilter` decreases when the
   * driver slows into traffic.
   *
   * ![distanceFilter at highway speed](https://dl.dropboxusercontent.com/s/uu0hs0sediw26ar/distance-filter-highway.png?dl=1)
   *
   * **See also**
   * - {@link elasticityMultiplier}
   * - {@link distanceFilter}
   */
  disableElasticity?: boolean;

  /**
   * Controls the scale of automatic speed-based {@link distanceFilter} elasticity.
   *
   * Defaults to `1.0`. Increasing `elasticityMultiplier` results in fewer location
   * samples as speed increases. A value of `0` has the same effect as setting
   * {@link disableElasticity} to `true`.
   */
  elasticityMultiplier?: number;

  /**
   * Automatically stops tracking after the specified number of minutes.
   *
   * Disabled by default. When set, the SDK automatically calls
   * {@link BackgroundGeolocation.stop} after this many minutes have elapsed since
   * {@link BackgroundGeolocation.start} was called.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     stopAfterElapsedMinutes: 30
   *   }
   * }).then((state) => {
   *   BackgroundGeolocation.start();  // SDK will automatically stop in 30 minutes
   * });
   * ```
   */
  stopAfterElapsedMinutes?: number;

  /**
   * Disables continuous background tracking in favour of periodic, coarse location
   * updates.
   *
   * Defaults to `false`. When `true`, a location is recorded only every 500–1000 meters
   * (higher in non-urban environments, depending on cell tower spacing). Many
   * configuration parameters have no effect in this mode, including {@link distanceFilter},
   * {@link stationaryRadius}, and {@link activityType}.
   *
   * Using `useSignificantChangesOnly: true` provides significant power savings at the
   * expense of fewer recorded locations.
   *
   * ## iOS
   * Engages the iOS [Significant Location Changes API](https://developer.apple.com/reference/corelocation/cllocationmanager/1423531-startmonitoringsignificantlocati?language=objc),
   * delivering updates every 500–1000 meters.
   *
   * ## Note
   * If Apple has rejected your app for using `UIBackgroundMode: "location"`, this mode
   * can be a viable alternative.
   *
   * ## Android
   * A location is recorded several times per hour while the device is in the *moving*
   * state. No foreground service is run (and no persistent {@link NotificationConfig}
   * notification is shown).
   *
   * Example 1 — `useSignificantChangesOnly: true`:
   *
   * ![](https://dl.dropboxusercontent.com/s/wdl9e156myv5b34/useSignificantChangesOnly.png?dl=1)
   *
   * Example 2 — `useSignificantChangesOnly: false` (default):
   *
   * ![](https://dl.dropboxusercontent.com/s/hcxby3sujqanv9q/useSignificantChangesOnly-false.png?dl=1)
   */
  useSignificantChangesOnly?: boolean;

  /**
   * Disables the SDK's automatic alert when location authorization is insufficient.
   *
   * Defaults to `false`. By default, the SDK shows a native alert directing the user to
   * the Settings screen when location services are disabled or the authorization level
   * falls below what {@link locationAuthorizationRequest} requires.
   *
   * When set to `true`, you are responsible for handling authorization changes by
   * listening to {@link BackgroundGeolocation.onProviderChange}.
   *
   * ## iOS
   * The alert dialog text can be customized via {@link locationAuthorizationAlert}.
   *
   * ![](https://dl.dropbox.com/s/wk66ave2mzq6m6a/ios-locationAuthorizationAlert.jpg?dl=1)
   *
   * ## Android
   * Android detects when the device's *Settings → Location* mode does not satisfy your
   * location request. For example, if the user selects *Battery Saving* (Wi-Fi only) but
   * you requested {@link DesiredAccuracy.High} (GPS), Android shows a resolution dialog
   * asking the user to confirm the required change.
   *
   * ![](https://dl.dropbox.com/scl/fi/t7bwdrmogr26rcmrbemkt/android-location-resolution-dialog.png?rlkey=won88t8xo5zcei7ktmurebb5t&dl=1)
   *
   * This dialog appears automatically on:
   * - {@link BackgroundGeolocation.onProviderChange}
   * - {@link BackgroundGeolocation.start}
   * - {@link BackgroundGeolocation.requestPermission}
   *
   * @example
   * ```ts
   * BackgroundGeolocation.onProviderChange((event) => {
   *   console.log("[onProviderChange] ", event);
   *
   *   if (!provider.enabled) {
   *     alert("Please enable location services");
   *   }
   * });
   *
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     disableLocationAuthorizationAlert: true
   *   }
   * });
   * ```
   */
  disableLocationAuthorizationAlert?: boolean;

  /**
   * Declares the location authorization level the app requires from the user.
   *
   * Defaults to `"Always"`. Valid values are:
   * - `"Always"` — background and foreground location access
   * - `"WhenInUse"` — foreground location access only
   * - `"Any"` — accept whichever level the user grants
   *
   * If you request `"Always"` but the user grants only When-In-Use, the SDK displays
   * {@link locationAuthorizationAlert} unless suppressed via
   * {@link disableLocationAuthorizationAlert}.
   *
   * ## iOS
   *
   * iOS 13+ no longer grants **Always Allow** on the initial dialog. After granting
   * **While Using the App**, iOS may later prompt the user to upgrade.
   *
   * **1. When `locationAuthorizationRequest: "Always"`**
   *
   * The user first sees the While-Using dialog, then an upgrade prompt for Always Allow:
   *
   * ![](https://dl.dropbox.com/s/0alq10i4pcm2o9q/ios-when-in-use-to-always-CHANGELOG.gif?dl=1)
   *
   * If the user denies Always, the SDK displays {@link locationAuthorizationAlert}
   * (unless disabled):
   *
   * ![](https://dl.dropbox.com/s/wk66ave2mzq6m6a/ios-locationAuthorizationAlert.jpg?dl=1)
   *
   * **2. When `locationAuthorizationRequest: "WhenInUse"`**
   *
   * Only the initial dialog appears:
   *
   * ![](https://dl.dropbox.com/s/n38qehw3cjhzngy/ios13-location-authorization.png?dl=1)
   *
   * Upgrading the config to `"Always"` later triggers the upgrade prompt immediately:
   *
   * ![](https://dl.dropbox.com/s/5syokc8rtrc9q35/ios13-location-authorization-upgrade-always.png?dl=1)
   *
   * **3. When `locationAuthorizationRequest: "Any"`**
   *
   * The SDK requests **Always** internally but accepts either result. iOS may show the
   * upgrade prompt spontaneously later:
   *
   * ![](https://dl.dropbox.com/s/5syokc8rtrc9q35/ios13-location-authorization-upgrade-always.png?dl=1)
   *
   * @example
   * ```ts
   * // Start with When-In-Use
   * BackgroundGeolocation.ready({
   *   geolocation: { locationAuthorizationRequest: "WhenInUse" }
   * });
   *
   * async function onClickStartTracking() {
   *   await BackgroundGeolocation.start();
   *
   *   // Upgrade to Always at any time.
   *   BackgroundGeolocation.setConfig({
   *     geolocation: { locationAuthorizationRequest: "Always" }
   *   });
   * }
   * ```
   *
   * ## Android
   *
   * **Android 11+ (targetSdkVersion ≥ 30)**
   *
   * Android 11 removes **Allow all the time** from the initial dialog. Apps must present
   * a custom rationale UI before navigating the user to the system Location Permissions
   * screen. The SDK automatically shows {@link AppConfig.backgroundPermissionRationale}
   * when configured.
   *
   * The rationale dialog is shown **only once** unless the user resets permissions.
   *
   * ![](https://dl.dropbox.com/s/343nbrzpaavfser/android11-location-authorization-rn.gif?dl=1)
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: { locationAuthorizationRequest: "Always" },
   *   app: {
   *     backgroundPermissionRationale: {
   *       title: "Allow access to this device's location in the background?",
   *       message: "To track your trips, please enable 'Allow all the time' location permission.",
   *       positiveAction: "Change to Allow all the time",
   *       negativeAction: "Cancel"
   *     }
   *   }
   * });
   * ```
   *
   * **1. When `locationAuthorizationRequest: "Always"`**
   *
   * After granting While Using, Android immediately displays the rationale dialog:
   *
   * ![](https://dl.dropbox.com/s/343nbrzpaavfser/android11-location-authorization-rn.gif?dl=1)
   *
   * **2. When `locationAuthorizationRequest: "WhenInUse"`**
   *
   * Only the initial system dialog appears:
   *
   * ![](https://dl.dropbox.com/s/ymybwme7fvda0ii/android11-location-when-in-use-system-dialog.png?dl=1)
   *
   * Upgrading to `"Always"` later triggers the rationale dialog:
   *
   * ![](https://dl.dropbox.com/s/4fq4erz2lpqz00m/android11-location-permission-rationale-dialog.png?dl=1)
   *
   * **3. When `locationAuthorizationRequest: "Any"`**
   *
   * Treated the same as `"Always"`.
   */
  locationAuthorizationRequest?: 'Always' | 'WhenInUse' | 'Any';

  /**
   * Customizes the text displayed in the SDK's location-authorization alert dialog. [iOS only]
   *
   * When {@link locationAuthorizationRequest} is `"Always"` or `"WhenInUse"` and the
   * user subsequently downgrades or disables location permission in iOS Settings, the SDK
   * presents an alert directing the user back to the Settings screen.
   *
   * Supply an object with all required fields to override the default strings:
   *
   * ![](https://dl.dropboxusercontent.com/s/wyoaf16buwsw7ed/docs-locationAuthorizationAlert.jpg?dl=1)
   *
   * ## Warning
   * You must supply **all** fields — not just a subset. Omitting any field will cause the
   * alert to display an empty or unexpected string.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     locationAuthorizationAlert: {
   *       titleWhenNotEnabled: "Location services are not enabled",
   *       titleWhenOff: "Location services are OFF",
   *       instructions:
   *         "Please enable 'Always' in Location Services to allow background tracking.",
   *       cancelButton: "Cancel",
   *       settingsButton: "Open Settings"
   *     }
   *   }
   * });
   * ```
   */
  locationAuthorizationAlert?: Record<string, any>;

  /**
   * Controls whether the status bar indicator appears when location services are active
   * in the background with `Always` authorization. [iOS only]
   *
   * Defaults to `true`. When `true`, iOS displays a blue bar or pill in the status bar
   * while the app uses location in the background. Users can tap the indicator to return
   * to your app.
   *
   * This property affects only apps with `Always` authorization. For apps with
   * When-In-Use authorization, iOS always changes the status bar appearance when
   * location services are active in the background.
   */
  showsBackgroundLocationIndicator?: boolean;

  /**
   * Sets the desired interval for active location updates, in milliseconds. [Android only]
   *
   * Defaults to `1000` ms. The system honors this interval on a best-effort basis — updates
   * may arrive slower (no providers available), faster (another app requests faster
   * updates), or not at all (permission or system constraints).
   *
   * Apps with only coarse location permission may have this interval silently throttled.
   *
   * ## Warning
   * `locationUpdateInterval` is ignored when {@link distanceFilter} is greater than `0`.
   * Set `distanceFilter` to `0` to activate time-based sampling.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     distanceFilter: 0,           // Required — otherwise this field is ignored.
   *     locationUpdateInterval: 5000 // Request a fix every ~5 seconds
   *   }
   * });
   * ```
   *
   * **See also**
   * - [Android LocationRequest.setInterval](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html#setInterval(long))
   */
  locationUpdateInterval?: number;

  /**
   * Sets the fastest interval for location updates, in milliseconds. [Android only]
   *
   * Defaults to `-1` (not set). When other apps or system components trigger location
   * updates at a faster rate, the SDK receives those updates passively at up to this rate
   * without increasing power usage.
   *
   * Unlike {@link locationUpdateInterval}, this value is a hard cap — the SDK never
   * receives updates faster than this interval.
   *
   * ## Note
   * - A value of `0` is allowed but not recommended, since some devices may deliver
   *   extremely rapid updates.
   * - If `fastestLocationUpdateInterval` is slower than {@link locationUpdateInterval},
   *   the effective fastest interval becomes {@link locationUpdateInterval}.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     fastestLocationUpdateInterval: 5000 // Receive passive updates at most every 5 s
   *   }
   * });
   * ```
   *
   * **See also**
   * - [Android LocationRequest.setFastestInterval](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html#setFastestInterval(long))
   */
  fastestLocationUpdateInterval?: number;

  /**
   * Sets the maximum wait time in milliseconds before batched location updates are
   * delivered. [Android only]
   *
   * Defaults to `0` (no deferral). When set to a value at least 2× the
   * {@link locationUpdateInterval}, the system may delay delivery and send multiple
   * locations at once. This can reduce battery consumption and improve accuracy on
   * capable hardware.
   *
   * Set this as large as your use-case allows if immediate location delivery is not
   * required.
   */
  deferTime?: number;

  /**
   * Allows duplicate locations to be recorded when consecutive fixes are identical. [Android only]
   *
   * Defaults to `false`. By default, the SDK ignores a location that is identical to the
   * previous one. Set `true` to record every location regardless of duplication.
   *
   * When a location is ignored, the log shows:
   * ```
   * TSLocationManager:   ℹ️  IGNORED: same as last location
   * ```
   *
   * ## Note
   * Identical locations are common when transitioning from *stationary* → *moving*
   * (where a single fix is requested before continuous updates begin) or when
   * geolocation config parameters change (e.g., {@link distanceFilter}).
   */
  allowIdenticalLocations?: boolean;

  /**
   * Defines the radius (meters) around the device used to query for geofences that
   * should be actively monitored.
   *
   * Mobile platforms allow only a limited number of concurrently monitored geofences
   * (**iOS: 20**, **Android: ~100**). The SDK removes this limitation by storing all
   * registered geofences in an internal database and activating only those within this
   * radius. As the device moves, the active set updates automatically, firing
   * {@link BackgroundGeolocation.onGeofencesChange}.
   *
   * ## iOS
   * Defaults to `2000` meters (minimum `100` meters for reliable detection).
   *
   * ## Android
   * Defaults to `1000` meters.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   * - [Animation of this behavior](https://www.transistorsoft.com/shop/products/assets/images/background-geolocation-infinite-geofencing.gif)
   *
   * ![](https://dl.dropboxusercontent.com/s/7sggka4vcbrokwt/geofenceProximityRadius_iphone6_spacegrey_portrait.png?dl=1)
   */
  geofenceProximityRadius?: number;

  /**
   * Enables high-accuracy mode for geofence-only tracking. [Android only]
   *
   * Defaults to `true`. Runs {@link BackgroundGeolocation.startGeofences} with a
   * foreground service (and its corresponding persistent {@link AppConfig.notification}),
   * making geofence transition events significantly more responsive.
   *
   * In high-accuracy mode, location-service options apply directly:
   * - {@link GeoConfig.desiredAccuracy} ({@link DesiredAccuracy.Medium} works well)
   * - {@link GeoConfig.locationUpdateInterval}
   * - {@link GeoConfig.distanceFilter}
   * - {@link GeoConfig.deferTime}
   *
   * ## Warning
   * High-accuracy mode consumes more power. The more aggressively you configure the
   * location-update params above, the more responsive geofence triggering will be — and
   * the higher the power cost.
   *
   * `geofenceModeHighAccuracy: false` — Transition events are delayed:
   * ![](https://dl.dropboxusercontent.com/s/6nxbuersjcdqa8b/geofenceModeHighAccuracy-false.png?dl=1)
   *
   * `geofenceModeHighAccuracy: true` — Transition events are nearly instantaneous:
   * ![](https://dl.dropbox.com/s/w53hqn7f7n1ug1o/geofenceModeHighAccuracy-true.png?dl=1)
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     geofenceModeHighAccuracy: true,
   *     desiredAccuracy: DesiredAccuracy.Medium,
   *     locationUpdateInterval: 5000,
   *     distanceFilter: 50,
   *   }
   * }).then((state) => {
   *   BackgroundGeolocation.startGeofences();
   * });
   * ```
   */
  geofenceModeHighAccuracy?:boolean;

  /**
   * Disables the motion-activity–based stop-detection system.
   *
   * When `true`, the SDK ignores platform motion-activity signals when determining
   * whether the device is stationary. This affects how and when location services are
   * automatically turned off on both platforms.
   *
   * ## iOS
   * Disables the accelerometer-based stop-detection system. iOS location services then
   * turn off automatically after **exactly 15 minutes** of no motion — you lose control
   * over {@link stopTimeout}.
   *
   * To prevent iOS from ever automatically disabling location services, also set
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     disableStopDetection: true,
   *     pausesLocationUpdatesAutomatically: false
   *   }
   * });
   * ```
   *
   * ## Warning
   * With `disableStopDetection: true` and `pausesLocationUpdatesAutomatically: false`,
   * iOS location services **never** turn off. This can severely drain the battery.
   * Only use this configuration if you fully control tracking manually (for example, a
   * workout app toggling tracking via {@link BackgroundGeolocation.changePace}).
   *
   * iOS stop-detection timing:
   *
   * ![](https://dl.dropbox.com/scl/fi/fhkz97f9jl4omnv7y30by/ios-stop-detection-timing.png?rlkey=cvs9h2nnngmmz9bwh1vg3796g&dl=1)
   *
   * ## Android
   * When `true`, Android location services never turn off automatically. You must
   * disable tracking manually by calling {@link BackgroundGeolocation.changePace} with
   * `false`, or {@link BackgroundGeolocation.stop}.
   */
  disableStopDetection?: boolean;

  /**
   * Controls whether a geofence fires an entry event immediately if the device is already
   * inside it when the geofence is registered.
   *
   * Defaults to `true`. Set `false` to suppress the immediate entry trigger and wait
   * until the device exits and re-enters the geofence.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}.
   */
  geofenceInitialTriggerEntry?: boolean;

  /**
   * Defines how raw GPS samples are filtered, denoised, and smoothed before being
   * recorded or used for odometer calculations.
   *
   * `LocationFilter` is supplied via {@link GeoConfig.filter} and provides
   * fine-grained control over how the SDK handles noisy or inconsistent
   * location data from the underlying platform.
   *
   * The native platform continuously produces raw `CLLocation` (iOS) or `Location`
   * (Android) samples. The filter applies Kalman filtering, rolling-window averaging,
   * and speed, distance, and accuracy constraints to produce smoother paths, reduce
   * jitter, and improve odometer stability.
   *
   * ## Filtering flow
   *
   * ![](https://dl.dropbox.com/scl/fi/71rkzdo2tr3qm651ulou8/location-filter-flowchart.svg?rlkey=16zxs3lnqvlrw137974jbsoj7&dl=1)
   *
   * | Field | Description |
   * |-------|-------------|
   * | **{@link LocationFilter.policy}** | Selects which filtering policy to apply. See {@link LocationFilterPolicy}. |
   * | **{@link LocationFilter.useKalman}** | Enables Kalman filtering of speed and position (default: `true`). |
   * | **{@link LocationFilter.kalmanDebug}** | Enables verbose Kalman diagnostic logs. |
   * | **{@link LocationFilter.kalmanProfile}** | Selects a Kalman tuning profile (see {@link KalmanProfile}). |
   * | **{@link LocationFilter.rollingWindow}** | Number of samples for rolling burst averaging. Larger values increase smoothness but reduce responsiveness. |
   * | **{@link LocationFilter.burstWindow}** | Duration of each averaging burst (seconds). Default: `10`. |
   * | **{@link LocationFilter.maxBurstDistance}** | Maximum distance (meters) for samples to be included in the same burst window. Default: `300`. |
   * | **{@link LocationFilter.trackingAccuracyThreshold}** | Minimum GPS horizontal accuracy (meters) required to accept a location. Default: `100`. |
   * | **{@link LocationFilter.maxImpliedSpeed}** | Maximum implied speed (m/s) before rejecting a sample as unrealistic. Default: `60` (~216 km/h). |
   * | **{@link LocationFilter.filterDebug}** | Enables verbose logging of filter decisions (`ACCEPTED`, `REJECTED`, etc). |
   * | **{@link LocationFilter.odometerUseKalmanFilter}** | Applies Kalman smoothing to odometer calculations. |
   * | **{@link LocationFilter.odometerAccuracyThreshold}** | Maximum accuracy (meters) allowed for a sample to affect the odometer. Default: `100`. |
   *
   * ## Note
   * - Distances are in **meters**.
   * - Time fields are in **milliseconds** unless otherwise specified.
   * - Filtering affects **recorded** locations only — it does not influence real-time motion detection.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     filter: {
   *       policy: LocationFilterPolicy.Adjust,
   *       useKalman: true,
   *       kalmanProfile: KalmanProfile.Default,
   *       trackingAccuracyThreshold: 100,
   *       odometerAccuracyThreshold: 20
   *     }
   *   }
   * });
   * ```
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     filter: {
   *       policy: LocationFilterPolicy.PassThrough,
   *       useKalman: false
   *     }
   *   }
   * });
   * ```
   */
  filter?: LocationFilter;

  /**
   * Appends extra timestamp metadata to each recorded location, including system time.
   *
   * Defaults to `false`. Some devices report GPS {@link Location.timestamp} values that
   * differ from the device's system clock. Enabling this option appends additional
   * timing fields to each location for debugging and cross-referencing.
   *
   * ## Android
   * ```java
   * JSONObject timestampMeta = new JSONObject();
   * timestampMeta.put("time", mLocation.getTime());
   * if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
   *     timestampMeta.put("systemClockElaspsedRealtime", SystemClock.elapsedRealtimeNanos()/1000000);
   *     timestampMeta.put("elapsedRealtime", mLocation.getElapsedRealtimeNanos()/1000000);
   * } else {
   *     timestampMeta.put("systemTime", System.currentTimeMillis());
   * }
   * ```
   *
   * ## iOS
   * ```objc
   * long long systemTime = (long long)([[NSDate date] timeIntervalSince1970] * 1000.0);
   * long long locationTime = (long long)([_location.timestamp timeIntervalSince1970] * 1000.0);
   * long long uptime = (long long) [self.class uptime] * 1000;
   *
   * return @{
   *     @"time": @(locationTime),
   *     @"systemTime": @(systemTime),
   *     @"systemClockElapsedRealtime": @(uptime)
   * };
   * ```
   */
  enableTimestampMeta?:boolean;
}

import { DesiredAccuracy } from '../../enums/DesiredAccuracy';
import { LocationFilter } from './LocationFilter';
import { ActivityType } from '../../enums/ActivityType';
/**
 * **Geolocation Configuration**
 *
 * {@link GeoConfig} defines all geolocation-related options for the
 * {@link BackgroundGeolocation} SDK.  
 * 
 * These parameters control:
 * - how often the SDK acquires locations,  
 * - how accurate those locations should be,  
 * - how long tracking persists when the device becomes stationary,  
 * - platform-specific permission behavior,  
 * - filtering / denoising rules,  
 * - elastic responsiveness to motion and idling.
 *
 * **Overview**
 *
 * {@link GeoConfig} is supplied via {@link Config.geolocation} when calling
 * {@link BackgroundGeolocation.ready} or {@link BackgroundGeolocation.setConfig}.
 *
 * | Category      | Description |
 * |---------------|-------------|
 * | **Accuracy**  | Precision and noise control via {@link desiredAccuracy}, {@link distanceFilter}, {@link locationUpdateInterval}, {@link fastestLocationUpdateInterval}. |
 * | **Elasticity** | Controls dynamic location sampling-rate: {@link disableElasticity}, {@link elasticityMultiplier}, {@link stopTimeout}. |
 * | **Permissions** | Platform authorization and alerts: {@link locationAuthorizationRequest}, {@link locationAuthorizationAlert}, {@link disableLocationAuthorizationAlert}. |
 * | **Geofencing** | Geofence proximity, accuracy mode, and initial triggers. |
 * | **Filtering** | Fine-grained denoising via {@link LocationFilter}. |
 *
 * **Example**
 *
 * ```ts
 * import BackgroundGeolocation, {
 *   Config,
 *   GeoConfig,
 *   DesiredAccuracy,
 *   LocationFilter
 * } from "react-native-background-geolocation";
 *
 * const config: Config = {
 *   geolocation: {
 *     // High-precision GPS
 *     desiredAccuracy: DesiredAccuracy.High,
 *
 *     // Move at least 50m before recording next location
 *     distanceFilter: 50,
 *
 *     // Consider stationary after 5 minutes with no motion
 *     stopTimeout: 5,
 *
 *     // Automatically stop tracking after 120 minutes of continuous operation
 *     stopAfterElapsedMinutes: 120,
 *
 *     // iOS: Show blue bar / pill when active in background
 *     showsBackgroundLocationIndicator: true,
 *
 *     // Noise-reduction / denoising filter
 *     filter: {
 *       policy: "adjust",
 *       maxImpliedSpeed: 60,
 *       odometerAccuracyThreshold: 20,
 *       trackingAccuracyThreshold: 100
 *     },
 *
 *     // Geofencing behavior
 *     geofenceProximityRadius: 1000,
 *     geofenceInitialTriggerEntry: true,
 *     geofenceModeHighAccuracy: true,
 *
 *     // Permissions / alerts (iOS)
 *     locationAuthorizationRequest: "Always",
 *     disableLocationAuthorizationAlert: false,
 *     locationAuthorizationAlert: {
 *       titleWhenNotEnabled: "Location Required",
 *       message: "Enable location access for full functionality.",
 *       cancelButton: "Cancel",
 *       settingsButton: "Settings"
 *     }
 *   },
 *
 *   // Additional compound config groups
 *   http: {
 *     url: "https://example.com/api/locations",
 *     autoSync: true,
 *     batchSync: true,
 *     maxBatchSize: 10,
 *     method: "POST",
 *     params: {
 *       user_id: 1234,
 *       trip_id: 5678
 *     },
 *     headers: {
 *       "X-FOO": "bar"
 *     }
 *   },
 *
 *   app: {
 *     stopOnTerminate: false,
 *     startOnBoot: true
 *   },
 *
 *   logging: {
 *     debug: true,
 *     logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE
 *   }
 * };
 *
 * await BackgroundGeolocation.ready(config);
 * ```
 *
 * **Migration from Legacy Flat Config**
 *
 * Previously, geolocation options were configured directly on the root
 * {@link Config} object:
 *
 * ```ts
 * // Legacy (flat)
 * BackgroundGeolocation.ready({
 *   desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
 *   distanceFilter: 10,
 *   stopTimeout: 5,
 *   stationaryRadius: 150,
 *   locationTimeout: 60
 * });
 * ```
 *
 * These options now belong to this {@link GeoConfig} group:
 *
 * ```ts
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
 * Legacy flat fields remain supported for backward compatibility, but they are now
 * marked **deprecated**. Prefer {@link Config.geolocation} going forward for clarity and structure.
 *
 * **See also**
 * - {@link LocationFilter}
 *
 * @category Config
 */
export interface GeoConfig {

  /**
   * Specify the desired-accuracy of the geolocation system.
   *
   * The following constants are defined upon the {@link BackgroundGeolocation} class:
   *
   * | Name                                                  | Location Providers                   | Description                     |
   * |-------------------------------------------------------|--------------------------------------|---------------------------------|
   * | {@link DesiredAccuracy.Navigation} | (**iOS only**) GPS + Wifi + Cellular | Highest power; highest accuracy |
   * | {@link DesiredAccuracy.High}       | GPS + Wifi + Cellular                | Highest power; highest accuracy |
   * | {@link DesiredAccuracy.Medium}     | Wifi + Cellular                      | Medium power; Medium accuracy;  |
   * | {@link DesiredAccuracy.Low}        | Wifi (low power) + Cellular          | Lower power; No GPS             |
   * | {@link DesiredAccuracy.VeryLow}   | Cellular only                        | Lowest power; lowest accuracy   |
   * | {@link DesiredAccuracy.Lowest}     | (**iOS only**)                       | Lowest power; lowest accuracy   |
   *
   * ### ⚠️ Note:
   * -  Only **`DESIRED_ACCURACY_HIGH`** uses GPS.  `speed`, `heading` and `altitude` are available only from GPS.
   *
   * @example
   * ```typescript
   * BackgroundGeoloction.ready({
   *   desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
   * });
   *```
   * For platform-specific information about location accuracy, see the corresponding API docs:
   * - [Android](https://developer.android.com/reference/com/google/android/gms/location/LocationRequest.html#PRIORITY_BALANCED_POWER_ACCURACY)
   * - [iOS](https://developer.apple.com/reference/corelocation/cllocationmanager/1423836-desiredaccuracy?language=objc)
   */
  desiredAccuracy?: DesiredAccuracy;

  /**
   * **`[iOS only]`** Specifies the Core Motion activity type used by iOS to
   * optimize its internal stop-detection algorithm.
   *
   * Apple is intentionally vague about how this affects motion interpretation,
   * but each activity type provides platform hints about the expected movement
   * pattern (e.g., automotive navigation, fitness, airborne).
   *
   * Available values are defined as constants on {@link ActivityType}.
   *
   * | Name                                             |
   * |--------------------------------------------------|
   * | {@link ActivityType.Other}                       |
   * | {@link ActivityType.AutomotiveNavigation}        |
   * | {@link ActivityType.Fitness}                     |
   * | {@link ActivityType.OtherNavigation}             |
   * | {@link ActivityType.Airborne}                    |
   *
   * @example
   *
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     activityType: ActivityType.Other,
   *   },
   * });
   * ```
   *
   * **Note:** For more details, see Apple docs:  
   * https://developer.apple.com/reference/corelocation/cllocationmanager/1620567-activitytype
   *
   * @category Geolocation
   */
  activityType?: ActivityType;
  /**
  * The minimum distance (measured in meters) a device must move horizontally before an update event is generated.
  *
  * However, by default, **`distanceFilter`** is elastically auto-calculated by the plugin:  When speed increases, **`distanceFilter`** increases;  when speed decreases, so too does **`distanceFilter`**.
  *
  *
  * ### ℹ️ Note:
  * - To disable this behavior, configure {@link disableElasticity} __`true`__.
  * - To control the scale of the automatic `distanceFilter` calculation, see {{@link elasticityMultiplier}
  *
  * `distanceFilter` is auto-scaled by rounding speed to the nearest `5 m/s` and adding `distanceFilter` meters for each `5 m/s` increment.
  *
  * For example, at biking speed of 7.7 m/s with a configured `distanceFilter: 30`:
  * @example
  * ```
  *   rounded_speed = round(7.7, 5)
  *   => 10
  *   multiplier = rounded_speed / 5
  *   => 10 / 5 = 2
  *   adjusted_distance_filter = multiplier * distanceFilter
  *   => 2 * 30 = 60 meters
  * ```
  *
  * At highway speed of `27 m/s` with a configured `distanceFilter: 50`:
  * @example
  * ```
  *   rounded_speed = round(27, 5)
  *   => 30
  *   multiplier = rounded_speed / 5
  *   => 30 / 5 = 6
  *   adjusted_distance_filter = multiplier * distanceFilter * elasticityMultipiler
  *   => 6 * 50 = 300 meters
  * ```
  *
  * Note the following real example of "elasticity" on highway 101 towards San Francisco as the driver slows down while running into
  * slower traffic &mdash; locations become compressed as `distanceFilter` decreases.
  *
  * ![distanceFilter at highway speed](https://dl.dropboxusercontent.com/s/uu0hs0sediw26ar/distance-filter-highway.png?dl=1)
  *
  * Compare now background-geolocation in the scope of a city.  In this image, the left-hand track is from a cab-ride, while the right-hand
  * track is walking speed.
  *
  * ![distanceFilter at city scale](https://dl.dropboxusercontent.com/s/yx8uv2zsimlogsp/distance-filter-city.png?dl=1)
  */
  distanceFilter?: number;

  /**   
  * The minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage.
  * 
  * ⚠️ Note: The device will not detect the exact moment it moves out of the stationary-radius.  In normal conditions, it will typically
  * take **~200 meters** of movement before the plugin begins tracking.
  *
  * Configuring **`stationaryRadius: 0`** has **NO EFFECT**.  In fact the plugin enforces a minimum **`stationaryRadius`** of `25` and
  * in-practice, the native API won't respond for at least 200 meters.
  *
  * The following image shows the typical distance iOS requires to detect exit of the **`stationaryRadius`**:
  * - *Green polylines*: represent a transition from **stationary** state to **moving** (__~200 meters__).
  * - *Red circles*: locations where the plugin entered the **stationary** state.
  *
  * ![](https://dl.dropboxusercontent.com/s/vnio90swhs6xmqm/screenshot-ios-stationary-exit.png?dl=1)
  *
  * ℹ️ See also:
  * - 📘 [Philosophy of Operation](github:wiki/Philosophy-of-Operation)
  *
  */
  stationaryRadius?: number;

  /**   
   * Minutes to wait in *moving* state with no movement before considering the device *stationary*.
   *
   * Defaults to `5` minutes.  When in the *moving* state, specifies the number of minutes to wait before turning off location-services and
   * transitioning to *stationary* state after the ActivityRecognition System detects the device is `STILL`.  An example use-case for this
   * configuration is to delay GPS OFF while in a car waiting at a traffic light.
  *
  * :warning: Setting a very long `stopTimeout` will cause the device's location API to remain ON while the device is potentially motionless for extended periods, which may have a significant impact on battery life.  It depends upon your use-case.
  *
  * ### ℹ️ See also:
  * - {@link BackgroundGeolocation.onMotionChange}
  * - 📘 [Philosophy of Operation](github:wiki/Philosophy-of-Operation)
  */
  stopTimeout?: number;

  /**
  * Automatically {@link BackgroundGeolocation.stop} when the {@link stopTimeout} elapses.
  *
  * The plugin can optionally automatically stop tracking when the {@link stopTimeout} timer elapses.  For example, when the plugin
  * first fires {@link BackgroundGeolocation.onMotionChange} into the *moving* state, the next time an *onMotionChange* event occurs
  * into the *stationary* state, the plugin will have automatically called {@link BackgroundGeolocation.stop} upon itself.
  *
  * ⚠️ `stopOnStationary` will **only** occur due to {@link stopTimeout} timer elapse.  It will **not** occur by manually executing
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
   * **`[iOS only]`** Prevent the iOS location API from *ever* automatically turning off.
   *
   * **⚠️ WARNING:**  
   * This option should almost always remain `undefined`.  
   * Only set this if you know **exactly** what you're doing.
   *
   * By default, the SDK automatically turns **off** iOS location-services when the
   * device remains stationary for {@link stopTimeout} minutes.
   *
   * When this option is explicitly set to `false`, location-services will **never**
   * be turned off. In this mode:
   *
   * - {@link ActivityConfig.disableStopDetection} will automatically be forced to `true`
   * - You are responsible for disabling tracking when you no longer need it
   * - This can have **severe battery-drain implications**
   * - {@link AppConfig.preventSuspend} will no longer function
   *
   * This option exists only for highly specialized use-cases and should generally
   * **not** be used in production applications.
   */
  pausesLocationUpdatesAutomatically?: boolean;

  /**
  * Defaults to **`false`**.  Set **`true`** to disable automatic, speed-based {@link distanceFilter} auto-scaling.  By default, the SDK automatically
  * increases {@link distanceFilter} as speed increases (and decreases it as speed *decreases*) in order to record fewer locations and conserve energy.
  *
  * Note the following real example of "elasticity" on highway 101 towards San Francisco as the driver slows down while running into slower
  * traffic &mdash; locations become compressed as {@link distanceFilter} decreases.
  *
  * ![distanceFilter at highway speed](https://dl.dropboxusercontent.com/s/uu0hs0sediw26ar/distance-filter-highway.png?dl=1)
  *
  * ### ℹ️ See also:
  * - {@link elasticityMultiplier}
  * - {@link distanceFilter}
  */
  disableElasticity?: boolean;

  /**
  * Controls the scale of automatic speed-based {@link distanceFilter} elasticity.
  *
  * Increasing `elasticityMultiplier` will result in fewer location samples as speed increases.  A value of `0` has the same effect as
  * {@link disableElasticity} __`true`__.
  */
  elasticityMultiplier?: number;

  /**
  * Automatically {@link BackgroundGeolocation.stop} tracking after *x* minutes.
  *
  * The plugin can optionally automatically {@link BackgroundGeolocation.stop} after some number of minutes elapses after the {@link BackgroundGeolocation.start} method was called.
  *
  * @example
  * ```typescript
  * BackgroundGeolocation.ready({
  *   stopAfterElapsedMinutes: 30
  * }).then((state) => {
  *   BackgroundGeolocation.start();  // <-- plugin will automatically #stop in 30 minutes
  * });
  * ```
  */
  stopAfterElapsedMinutes?: number;

  /**
  * Set `true` in order to disable constant background-tracking.  Locations will be recorded only periodically.
  *
  * Defaults to `false`.  A location will be recorded only every `500` to `1000` meters (can be higher in non urban environments; depends upon the spacing of Cellular towers).  Many of the plugin's configuration parameters **will have no effect**, such as {@link distanceFilter}, {@link stationaryRadius}, {@link activityType}, etc.
  *
  * Using `significantChangesOnly: true` will provide **significant** power-saving at the expense of fewer recorded locations.
  *
  * **iOS**
  *
  * Engages the iOS [Significant Location Changes API](https://developer.apple.com/reference/corelocation/cllocationmanager/1423531-startmonitoringsignificantlocati?language=objc) API for only periodic location updates every 500-1000 meters.
  *
  * ⚠️ If Apple has rejected your application, refusing to grant your app the privilege of using the **`UIBackgroundMode: "location"`**, this can be a solution.
  *
  * **Android**
  *
  * A location will be recorded several times per hour while the device is in the *moving* state.  No foreground-service will be run (nor its corresponding persistent {@link NotificationConfig}).
  *
  * Example 1 **`useSignificantChangesOnly: true`**
  * 
  * ![](https://dl.dropboxusercontent.com/s/wdl9e156myv5b34/useSignificantChangesOnly.png?dl=1)
  *
  * Example 2 **`useSignificantChangesOnly: false` (Default)**
  *
  * ![](https://dl.dropboxusercontent.com/s/hcxby3sujqanv9q/useSignificantChangesOnly-false.png?dl=1)
  */
  useSignificantChangesOnly?: boolean;

  /**
  * Disables automatic authorization alert when plugin detects the user has disabled location authorization.
  *
  * You will be responsible for handling disabled location authorization by listening to the {@link BackgroundGeolocation.onProviderChange} event.
  *
  * By default, the plugin automatically shows a native alert to the user when location-services are disabled, directing them to the settings screen.  If you **do not** desire this automated behavior, set `disableLocationAuthorizationAlert: true`.
  *
  * __iOS__
  *
  * The iOS alert dialog text elements can be configured via {@link locationAuthorizationAlert} and {@link locationAuthorizationRequest}.
  *
  * ![](https://dl.dropbox.com/s/wk66ave2mzq6m6a/ios-locationAuthorizationAlert.jpg?dl=1)
  *
  * __Android__
  *
  * Android can detect when the user has configured the device's *Settings->Location* in a manner that does not match your location request (eg: {@link desiredAccuracy}).  For example, if the user configures *Settings->Location->Mode* with *Battery Saving* (ie: Wifi only) but you've specifically requested {@link DesiredAccuracy.High} (ie: GPS), Android will show a dialog asking the user to confirm the desired changes.  If the user clicks `[OK]`, the OS will automcatically modify the Device settings.
  *
  * ![](https://dl.dropbox.com/scl/fi/t7bwdrmogr26rcmrbemkt/android-location-resolution-dialog.png?rlkey=won88t8xo5zcei7ktmurebb5t&dl=1)
  *
  * This automated Android dialog will be shown in the following cases:
  * - {@link BackgroundGeolocation.onProviderChange}
  * - {@link BackgroundGeolocation.start}
  * - {@link BackgroundGeolocation.requestPermission}
  *
  * @example
  * ```typescript
  * BackgroundGeolocation.onProviderChange((event) => {
  *   console.log("[onProviderChange] ", event);
  *
  *   if (!provider.enabled) {
  *     alert("Please enable location services");
  *   }
  * });
  *
  * BackgroundGeolocation.ready({
  *   disableLocationAuthorizationAlert: true
  * });
  * ```
  */
  disableLocationAuthorizationAlert?: boolean;

  /**
   * Defines the *desired* location-authorization level your app expects from the user:
   *
   * - **`"Always"`**
   * - **`"WhenInUse"`**
   * - **`"Any"`**
   *
   * Defaults to **`"Always"`**.
   *
   * Setting `locationAuthorizationRequest` tells the SDK *what authorization level
   * your app expects*, so it can guide the user and present helpful upgrade dialogs
   * when needed. If you do **not care** which authorization is granted, configure
   * **`"Any"`**.
   *
   * If you request **`"Always"`** but the user grants only **When-In-Use**, the SDK
   * will display {@link locationAuthorizationAlert} unless disabled via
   * {@link disableLocationAuthorizationAlert}.
   *
   *
   * **iOS**
   *
   * iOS 13 introduced major changes to the authorization workflow.  
   * Apps no longer receive **Always Allow** on the initial dialog.
   *
   * After a user first grants **While Using the App**, iOS may show a second,
   * system-managed **upgrade prompt**, asking if they’d like to enable:
   *
   * - **Keep Only While Using**
   * - **Change to Always Allow**
   *
   * **1. When `locationAuthorizationRequest: "Always"`**
   *
   * The user will first see the **While Using App** dialog, followed immediately by
   * the upgrade prompt asking for **Always Allow**:
   *
   * ![](https://dl.dropbox.com/s/0alq10i4pcm2o9q/ios-when-in-use-to-always-CHANGELOG.gif?dl=1)
   *
   * If the user *denies* Always, the SDK displays
   * {@link locationAuthorizationAlert} (unless disabled).
   *
   * ![](https://dl.dropbox.com/s/wk66ave2mzq6m6a/ios-locationAuthorizationAlert.jpg?dl=1)
   *
   * **2. When `locationAuthorizationRequest: "WhenInUse"`**
   *
   * Only the initial dialog appears:
   *
   * ![](https://dl.dropbox.com/s/n38qehw3cjhzngy/ios13-location-authorization.png?dl=1)
   *
   * If you later upgrade the config to `"Always"`, the upgrade prompt
   * appears immediately:
   *
   * ![](https://dl.dropbox.com/s/5syokc8rtrc9q35/ios13-location-authorization-upgrade-always.png?dl=1)
   *
   * **3. When `locationAuthorizationRequest: "Any"`**
   *
   * The SDK requests **Always** internally, but accepts either result.
   * iOS may spontaneously show the upgrade dialog later:
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
   *   // Later — you may upgrade to Always at any time.
   *   BackgroundGeolocation.setConfig({
   *     geolocation: { locationAuthorizationRequest: "Always" }
   *   });
   * }
   * ```
   *
   * **Android**
   *
   * **Android 11+ (targetSdkVersion ≥ 30)**
   *
   * Android 11 removes **Allow all the time** from the initial dialog.  
   * Instead, apps must present a custom rationale UI before navigating the user
   * to the system **Location Permissions** screen.
   *
   * The SDK automatically presents {@link AppConfig.backgroundPermissionRationale}
   * when configured.
   *
   * - The dialog shows **only once**, unless the user resets permissions.
   *
   * ![](https://dl.dropbox.com/s/343nbrzpaavfser/android11-location-authorization-rn.gif?dl=1)
   *
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
   * After granting **While Using**, Android immediately displays your configured
   * rationale dialog:
   *
   * ![](https://dl.dropbox.com/s/343nbrzpaavfser/android11-location-authorization-rn.gif?dl=1)
   *
   * **2. When `locationAuthorizationRequest: "WhenInUse"`**
   *
   * Only the initial system dialog appears:
   *
   * ![](https://dl.dropbox.com/s/ymybwme7fvda0ii/android11-location-when-in-use-system-dialog.png?dl=1)
   *
   * Upgrading later to `"Always"` triggers the rationale dialog:
   *
   * ![](https://dl.dropbox.com/s/4fq4erz2lpqz00m/android11-location-permission-rationale-dialog.png?dl=1)
   *
   * **3. When `locationAuthorizationRequest: "Any"`**
   *
   * Treated the same as `"Always"`.
   *   
   */
  locationAuthorizationRequest?: 'Always' | 'WhenInUse' | 'Any';

  /**
   * **[iOS only]** Customize the text displayed in the SDK’s
   * location-authorization alert dialog.
   *
   * When {@link locationAuthorizationRequest} is configured as
   * `"Always"` or `"WhenInUse"` and the user subsequently *downgrades* or disables
   * location permission in iOS Settings, the SDK presents an alert directing the
   * user back to the **Settings** screen.
   *
   * `locationAuthorizationAlert` lets you override all of the strings used in that
   * alert. You must supply an object matching {@link locationAuthorizationAlert}.
   *
   * ![](https://dl.dropboxusercontent.com/s/wyoaf16buwsw7ed/docs-locationAuthorizationAlert.jpg?dl=1)
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
   *
   * **⚠️ Warning**
   *
   * If you provide `locationAuthorizationAlert`, you **must** supply **all**
   * {@link locationAuthorizationAlert} fields — not just a subset.
   */
  locationAuthorizationAlert?: Record<string, any>;

  /**
   * [__iOS Only__] A Boolean indicating whether the status bar changes its appearance when an app uses location services in the background with `Always` authorization.
   *
   * The default value of this property is `true`. The background location usage indicator is a blue bar or a blue pill in the status bar on iOS; on watchOS the indicator is a small icon. Users can tap the indicator to return to your app.
   *
   * This property affects only apps that received `Always` authorization. When such an app moves to the background, the system uses this property to determine whether to change the status bar appearance to indicate that location services are in use. Set this value to true to maintain transparency with the user.
   *
   * For apps with When In Use authorization, the system changes the appearance of the status bar when the app uses location services in the background.
   */
  showsBackgroundLocationIndicator?: boolean;

  /**
   * **[Android only]** Desired interval for *active* location updates, in milliseconds.
   *
   * **⚠️ Important**
   * - To use `locationUpdateInterval`, you **must** also set
   *   {@link distanceFilter} to `0`.  
   *   If `distanceFilter` > 0, it **overrides** this interval.
   *
   * This value tells Android how frequently your app *wants* location updates.
   * The system will try to honor it but may deliver updates:
   * - slower (no providers available),
   * - faster (another app requests faster updates),
   * - or not at all (permission or system constraints).
   *
   * Apps with only *coarse* location permission may have this interval silently throttled.
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
   * **ℹ️ See also**
   * - Android’s `LocationRequest.setInterval`:  
   *   https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html#setInterval(long)
   */
  locationUpdateInterval?: number;

  /**
   * __`[Android only]`__ Explicitly sets the *fastest* interval for location updates,
   * in milliseconds.
   *
   * This value defines the maximum rate at which the SDK will deliver passive
   * location updates. It may be faster than {@link locationUpdateInterval}
   * when other applications or system components are triggering more frequent updates.
   *
   * Configuring a faster passive rate allows your application to benefit from
   * locations generated by other apps **without** increasing power usage.
   *
   * Unlike {@link locationUpdateInterval}, this parameter is *exact*:  
   * your application will **never** receive updates faster than this value.
   *
   * - If not configured, the default fastest interval is **30000 ms (30 seconds)**.  
   * - A value of `0` is allowed but **not recommended**, since future devices may
   *   deliver extremely rapid updates.  
   * - If `fastestLocationUpdateInterval` is *slower* than
   *   {@link locationUpdateInterval}, the effective fastest interval becomes
   *   {@link locationUpdateInterval}.
   * 
   * **Example**
   *
   * ```ts
   * import BackgroundGeolocation from "react-native-background-geolocation";
   *
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     // Receive passive updates as fast as 5 seconds
   *     fastestLocationUpdateInterval: 5000,
   *
   *     // Active updates occur according to distanceFilter or locationUpdateInterval
   *   }
   * });
   * ```
   * 
   * **See also**
   * - [Android documentation](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html#setFastestInterval(long))
   *
   */
  fastestLocationUpdateInterval?: number;

  /**
   * __`[Android only]`__ Sets the maximum wait time in milliseconds for location updates.
   *
   * Defaults to `0` (no defer).  
   * 
   * If you pass a value at least 2x larger than the interval specified with {@link locationUpdateInterval}, 
   * then location delivery may be delayed and multiple locations can be delivered at once. 
   * 
   * Locations are determined at the {@link locationUpdateInterval} rate, 
   * but can be delivered in batch after the interval you set in this method. This **can consume less battery** and **give more accurate locations**, 
   * depending on the device's hardware capabilities. You should set this value to be as large as possible for your needs if you don't need immediate location delivery.
   */
  deferTime?: number;

  /**
   * __`[Android only]`__ Allow recording locations which are duplicates of the previous.
   *
   * By default, the Android plugin will ignore a received location when it is *identical* to the previous location.  Set `true` to override this behavior 
   * and record *every* location, regardless if it is identical to the last location.
   *
   * In the logs, you will see a location being ignored:
   * 
   * ```
   * TSLocationManager:   ℹ️  IGNORED: same as last location
   * ```
   *
   * An identical location is often generated when changing state from *stationary* -> *moving*, where a single location is first requested
   * (the {@link BackgroundGeolocation.onMotionChange} location) before turning on regular location updates.
   * 
   * Changing geolocation config params can also generate a duplicate location (eg: changing {@link distanceFilter}).
   */
  allowIdenticalLocations?: boolean;

  /**
   * Defines the radius (in meters) around the device used to query for geofences
   * that should be actively monitored.
   *
   * The default — and **minimum** — value is **1000 meters**.
   *
   * Mobile platforms allow only a limited number of concurrently monitored geofences  
   * (**iOS: 20**, **Android: ~100**).  
   * 
   * The SDK removes this limitation by allowing you to register **any number of geofences**
   * (thousands even). It stores them in its internal database and performs efficient
   * spatial queries to determine which subset of geofences should be activated based on
   * the device’s current position.
   *
   * As the device moves, this radius determines when the monitored geofence set changes,
   * firing {@link BackgroundGeolocation.onGeofencesChange}.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   * - [Animation of this behavior](https://www.transistorsoft.com/shop/products/assets/images/background-geolocation-infinite-geofencing.gif)
   *
   * ![](https://dl.dropboxusercontent.com/s/7sggka4vcbrokwt/geofenceProximityRadius_iphone6_spacegrey_portrait.png?dl=1)
   */
  geofenceProximityRadius?: number;

  /**
   * Disable the motion-activity–based stop-detection system.
   *
   * When enabled (`true`), the SDK ignores platform motion-activity signals when
   * determining whether the device is *stationary*. This affects how and when
   * location-services are automatically turned off on both iOS and Android.
   *
   * **iOS**
   *
   * Disables the accelerometer-based **stop-detection system**. When disabled,
   * the plugin falls back to the default iOS behavior: location-services turn off
   * automatically after **exactly 15 minutes** of no motion. In this mode, you
   * lose control over {@link stopTimeout}.
   *
   * To *completely* prevent iOS from automatically disabling location-services,
   * you must also set {@link pausesLocationUpdatesAutomatically}
   * to `false`:
   *
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     disableStopDetection: true,
   *     pausesLocationUpdatesAutomatically: false
   *   }
   * });
   * ```
   *
   * **⚠️ iOS location-services will *never* turn off!**
   *
   * With the configuration above, iOS will **never** disable location-services.
   * This can **heavily drain the battery**. Do **not** use this unless you fully
   * control tracking manually (for example, a workout app that toggles tracking
   * using {@link BackgroundGeolocation.changePace}).
   *
   * **iOS Stop-detection timing**
   *
   * ![](https://dl.dropboxusercontent.com/s/ojjdfkmua15pskh/ios-stop-detection-timing.png?dl=1)
   *
   * **Android**
   *
   * If set to `true`, Android location-services will **never** turn off
   * automatically. It becomes your responsibility (or the user’s) to disable
   * tracking manually by calling:
   *
   * - {@link BackgroundGeolocation.changePace} with `false`, or  
   * - {@link BackgroundGeolocation.stop}
   */
  disableStopDetection?: boolean;

  /**
   * When a device is already within a just-created geofence, fire the **enter** transition immediately.
   *
   * Defaults to `true`.  Set `false` to disable triggering a geofence immediately if device is already inside it.
   *
   * __ℹ️ See also__
    * - 📘 [[Geofence | Geofencing Guide]].
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
   * **Overview**
   *
   * The native platform continuously produces raw `CLLocation` (iOS) or
   * `Location` (Android) samples. The `LocationFilter` applies:
   *
   * - Kalman filtering  
   * - rolling-window averaging  
   * - speed, distance, and accuracy constraints  
   *
   * These produce smoother paths, reduce jitter, and improve odometer stability.
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
   * **Filtering Flow**
   *
   * ![](https://dl.dropbox.com/scl/fi/71rkzdo2tr3qm651ulou8/location-filter-flowchart.svg?rlkey=16zxs3lnqvlrw137974jbsoj7&dl=1)
   *
   * **Parameters**
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
   * **Notes**
   *
   * - Distances are in **meters**.  
   * - Time fields are in **milliseconds** unless otherwise specified.  
   * - Filtering affects **recorded** locations only; it does *not* influence real-time motion detection.
   *
   * **Disable all filtering**
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
   * Enable extra timestamp meta data to be appended to each recorded location, including system-time.
   *
   * Some developers have reported GPS {@link Location.timestamp} issues with some Android devices.  This option will append extra meta-data related to the device's system time.
   *
   * __Android implementation:__
   *
   * ```Java
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
   * __iOS Implementation:__
   *
   * ```Java
   *  long long systemTime = (long long)([[NSDate date] timeIntervalSince1970] * 1000.0);
   *  long long locationTime = (long long)([_location.timestamp timeIntervalSince1970] * 1000.0);
   *  long long uptime = (long long) [self.class uptime] * 1000;
   *
   *  return @{
   *      @"time": @(locationTime),
   *      @"systemTime": @(systemTime),
   *      @"systemClockElapsedRealtime": @(uptime)
   *  };
   * ```
   */
  enableTimestampMeta?:boolean;
}
import { NotificationConfig } from './NotificationConfig';

/**
 * (__Android 11+__) Configure the dialog shown when requesting **Always** background
 * location permission.
 *
 * Android 11 changed the location authorization flow and no longer presents an
 * **“Allow all the time”** option on the initial system dialog.  
 * Instead, Android allows apps to show a custom rationale dialog explaining why
 * background access is required.
 *
 * This dialog can take the user directly to the app’s **Location Permissions**
 * settings screen, where they can explicitly grant **Allow all the time**.
 * The SDK presents this dialog automatically when:
 *
 * - {@link GeoConfig.locationAuthorizationRequest} is `"Always"`, and  
 * - {@link AppConfig.backgroundPermissionRationale} is configured.
 *
 * ![](https://dl.dropbox.com/s/343nbrzpaavfser/android11-location-authorization-rn.gif?dl=1)
 *
 * **Behavior Notes**
 *
 * - Android presents the {@link AppConfig.backgroundPermissionRationale} dialog **once only**.  
 *   After the user presses the `positiveAction`, it will not be shown again  
 *   (pressing *Cancel* does **not** count as acceptance).
 * - If the user later resets your app’s Location permission to **Ask every time**,  
 *   the rationale dialog becomes eligible to be shown again.
 *
 * ![](https://dl.dropbox.com/s/4fq4erz2lpqz00m/android11-location-permission-rationale-dialog.png?dl=1)
 * ![](https://dl.dropbox.com/s/dy65k8b0sgj5cgy/android11-location-authorization-upgrade-settings.png?dl=1)
 *
 * __Example__
 *
 * @example
 * ```ts
 * import BackgroundGeolocation from "react-native-background-geolocation";
 *
 * BackgroundGeolocation.ready({
 *   geolocation: {
 *     locationAuthorizationRequest: 'Always'
 *   },
 *   app: {
 *     backgroundPermissionRationale: {
 *       title: "Allow {applicationName} to access this device's location in the background?",
 *       message: "To track your activity in the background, please enable {backgroundPermissionOptionLabel} location access.",
 *       positiveAction: "Change to {backgroundPermissionOptionLabel}",
 *       negativeAction: "Cancel"
 *     }
 *   }
 * });
 * ```
 *
 * __Template Tags__
 *
 * The following template variables can be used inside any rationale field by writing
 * them as `{tagName}`:
 *
 * | Template Tag                            | Default value        | Description |
 * |-----------------------------------------|----------------------|-------------|
 * | **`{backgroundPermissionOptionLabel}`** | "Allow all the time" | (API 30+) Localized label for the background location permission option. |
 * | **`{applicationName}`**                 | App name             | Localized application name from `AndroidManifest`. |
 *
 * __See also__
 * - {@link GeoConfig.locationAuthorizationRequest}
 * - {@link BackgroundGeolocation.requestPermission}
 * - [Android 11 Location Updates](https://developer.android.com/about/versions/11/privacy/location)
 * 
 * @category Config
 */
export interface PermissionRationale {
  /** 
   * Title for the Android background location permission dialog. 
   */
  title?: string;
  /**
   * The body text of the dialog.
   * Provide an explanation of why you need this permission, similar in purpose to iOS' __`NSLocationAlwaysAndWhenInUseUsageDescription`__.
   */
  message?: string;
  /**
   * The text to display on the *positive action* button.
   */
  positiveAction?: string;
  /**
   * The text to display on the *negative action* button (eg: *Cancel*)
   */
  negativeAction?: string;
}


/**
 * Application & lifecycle configuration.
 *
 * `AppConfig` groups options that control how the SDK integrates with your app’s
 * lifecycle: start/stop behavior on terminate and reboot, headless/background
 * behavior, periodic heartbeats, scheduler windows, foreground notifications, and
 * the Android background-permission rationale dialog.
 *
 * Use this class via {@link Config.app}.
 *
 * @example
 * ```ts
 * BackgroundGeolocation.ready({
 *   app: {
 *     stopOnTerminate: false,
 *     startOnBoot: true
 *   }
 * });
 * ```
 *
 * __What belongs in `AppConfig`?__
 *
 * - Whether tracking **stops on app terminate**: see {@link AppConfig.stopOnTerminate}.
 * - Whether tracking **starts after device reboot**: see {@link AppConfig.startOnBoot}.
 * - Android **headless** mode: see {@link AppConfig.enableHeadless}.
 * - Periodic **heartbeat** callback: see {@link AppConfig.heartbeatInterval}.
 * - **Scheduler** windows for automated start/stop: see {@link AppConfig.schedule} and {@link AppConfig.scheduleUseAlarmManager}.
 * - Foreground-service **notification** options (Android): see {@link AppConfig.notification}.
 * - Background-permission **rationale** for Android 10+: see {@link AppConfig.backgroundPermissionRationale}.
 * - iOS background **preventSuspend** flag for heartbeat support: see {@link AppConfig.preventSuspend}.
 *
 * __Platform notes__
 *
 * **iOS**
 * - With {@link AppConfig.stopOnTerminate} set to `false`, the SDK creates a *stationary geofence* and iOS will relaunch
 *   your app in the background when the device exits that region.
 * - {@link AppConfig.preventSuspend} is required for heartbeat events and consumes additional battery — use with caution.
 *
 * **Android**
 * - With {@link AppConfig.enableHeadless} set to `true`, the native background-service continues working even after the
 *   JS/UI process is killed. Pair this with {@link HttpConfig.url} to ensure continuous uploads.
 * - The **scheduler** uses Android’s `AlarmManager` by default; control this with {@link AppConfig.scheduleUseAlarmManager}.
 *
 * @example Configure once at startup:
 *
 * ```ts
 * import BackgroundGeolocation, {
 *   type Config,
 *   type AppConfig,
 *   PermissionRationale,
 *   Notification
 * } from 'react-native-background-geolocation';
 *
 * const config: Config = {
 *   app: {
 *     stopOnTerminate: false,
 *     startOnBoot: true,
 *     enableHeadless: true,
 *     heartbeatInterval: 60,
 *     backgroundPermissionRationale: {
 *       title: "Allow MyApp to access this device's location even when closed.",
 *       message: "This app collects location data to record your trips and mileage.",
 *       positiveAction: 'Change to "{backgroundPermissionOptionLabel}"',
 *       negativeAction: 'Cancel'
 *     },
 *     notification: {
 *       title: 'Background Geolocation',
 *       text: 'Tracking location',
 *       smallIcon: 'mipmap/ic_launcher'
 *     },
 *     schedule: ['1-5 09:00-17:00'], // Weekdays 9–5
 *     scheduleUseAlarmManager: true
 *   }
 * };
 *
 * await BackgroundGeolocation.ready(config);
 * ```
 *
 * @example Update later at runtime:
 *
 * ```ts
 * await BackgroundGeolocation.setConfig({
 *   app: {
 *     heartbeatInterval: 120 // slow down heartbeats
 *   }
 * });
 * ```
 *
 * __Migration from legacy `Config` properties__
 *
 * The following legacy properties are **deprecated** on {@link Config} and should now
 * be supplied via `Config.app`:
 *
 * - `Config.stopOnTerminate`
 * - `Config.startOnBoot`
 * - `Config.enableHeadless`
 * - `Config.heartbeatInterval`
 * - `Config.schedule`
 * - `Config.scheduleUseAlarmManager`
 * - `Config.notification`
 * - `Config.backgroundPermissionRationale`
 * - `Config.preventSuspend`
 *
 * @category Config
 */
export interface AppConfig {
  /**
   * Controls whether to continue location-tracking after the application is **terminated**.
   *
   * Defaults to **`true`**.  
   * When the user terminates the app, the plugin will call {@link BackgroundGeolocation.stop | stop()},
   * ending tracking.  
   * Set {@link AppConfig.stopOnTerminate} to **`false`** to continue tracking after the app is terminated.
   *
   * If you *do* configure **`stopOnTerminate: false`**, your application **will** terminate immediately when the user swipes it away.  
   * However, Android and iOS behave very differently *after* termination:
   *
   * __iOS__
   *
   * Before an iOS app terminates, the SDK creates a **stationary geofence** of
   * {@link GeoConfig.stationaryRadius} meters around the last known position.  
   * When the user moves beyond this stationary geofence (typically ~200 meters), iOS will  
   * **fully relaunch your application in the background**, and tracking will automatically resume.
   *
   * This works even after device reboot because geofences are monitored entirely by iOS at the OS level.
   *
   * In the illustration below, imagine the user terminated the application at the **red circle** on the right.  
   * As soon as the device moves **~200 meters**, exiting the stationary geofence, iOS re-launches the app
   * and the SDK resumes tracking.
   *
   * ℹ️ *Demo video:*  
   * https://www.youtube.com/watch?v=aR6r8qV1TI8&t=214s
   *
   * ![](https://dl.dropboxusercontent.com/s/1uip231l3gds68z/screenshot-stopOnTerminate-ios.png?dl=0)
   *
   * __Android__
   *
   * Unlike iOS, Android does **not** pause tracking when the user terminates the app.  
   * The native background service continues running **headlessly**, even without the JS/UI process.
   *
   * If relying on headless mode, you must configure {@link HttpConfig.url} so that the background service
   * can continue posting locations to your server.
   *
   * __See also__
   * - {@link AppConfig.enableHeadless}
   * - [Android Headless Mode](github:wiki/Android-Headless-Mode)
   */
  stopOnTerminate?: boolean;

  /**
   * Controls whether to resume location-tracking after the device is **rebooted**.
   *
   * Defaults to **`false`**.  
   * 
   * Set {@link AppConfig.startOnBoot} to **`true`** to automatically re-engage background tracking
   * after a device restart.
   *
   * __iOS__
   *
   * iOS cannot **immediately** begin tracking after a device reboot.  Similar to {@link AppConfig.stopOnTerminate}: `false`, iOS will not relaunch your app until:
   * - The device moves beyond the **stationary geofence** created around the last known location, or  
   * - A system **Background Fetch** event fires (typically every ~15 minutes), which can also restart your app.
   *
   * __Android__
   *
   * When {@link AppConfig.startOnBoot} is `true`, Android will automatically relaunch the SDK’s
   * background service after reboot (and initial device unlock).  
   * 
   * If {@link AppConfig.enableHeadless} is also `true`, tracking will resume even if the JS/UI layer
   * has not yet started.
   *
   * __See also__
   * - {@link AppConfig.enableHeadless}
   * - {@link AppConfig.stopOnTerminate}
   */
  startOnBoot?: boolean;

  /**
   * __`[Android only]`__ Enables "Headless" operation allowing you to respond to events after you app has been terminated with [[stopOnTerminate]] __`false`__.
   *
   * Defaults to __`false`__.  In this Android terminated state, where only the plugin's foreground-service remains running, you can respond to all the plugin's events with your own callback.  For more information, see [[BackgroundGeolocation.registerHeadlessTask]].
   *
   * __ℹ️ Note:__
   * - Requires {@link AppConfig.stopOnTerminate} __`false`__.
   * - If you've configured {@link AppConfig.stopOnTerminate} __`false`__, {@link BackgroundGeolocation} will continue to record locations (and post them to your configured {@link HttpConfig.url}) *regardless of* __`enabledHeadless: true`__.  You should enable this option *only if* you wish to perform some custom work during the headless state (for example, posting a local notification).
   *
   * +__ℹ️ See also:__
   * - 📘 [Android Headless Mode](github:wiki/Android-Headless-Mode).
   * - {@link BackgroundGeolocation.registerHeadlessTask}
   */
  enableHeadless?: boolean;

  /**
   * Controls the rate (in seconds) at which {@link BackgroundGeolocation.onHeartbeat}
   * 
   * events will fire.
   *
   * **⚠️ Warning**
   *
   * - On **iOS**, {@link BackgroundGeolocation.onHeartbeat} will fire **only** when {@link AppConfig.preventSuspend} is set to `true`.
   * - On **Android**, the *minimum* interval is **60 seconds**.  
   * - It is **not possible** to configure a `heartbeatInterval` faster than 60 seconds.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     preventSuspend: true,
   *     heartbeatInterval: 60
   *   }
   * });
   *
   * BackgroundGeolocation.onHeartbeat((event) => {
   *   console.log("[onHeartbeat]", event);
   *
   *   // Optionally request a new location during heartbeat.
   *   BackgroundGeolocation.getCurrentPosition({
   *     samples: 1,
   *     persist: true
   *   }).then((location) => {
   *     console.log("[getCurrentPosition]", location);
   *   });
   * });
   * ```
   *
   * **ℹ️ See also**
   * - {@link BackgroundGeolocation.onHeartbeat}
   */
  heartbeatInterval?: number;

  /**
   * Configures a cron-like automated schedule telling the SDK when to
   * {@link BackgroundGeolocation.start | start} and
   * {@link BackgroundGeolocation.stop | stop} tracking.
   *
   * @example
   * ```ts
   * "{DAY(s)} {START_TIME}-{END_TIME}"
   * ```
   *
   * - Times are in **24h format**.
   * - `DAY` uses **Locale.US** numbering: **Sunday = 1**, **Saturday = 7**.
   * - You may provide:
   *   - a single day: `"1"`
   *   - a comma-separated list: `"2,4,6"`
   *   - a range: `"2-6"`
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     schedule: [
   *       "1 17:30-21:00",     // Sunday: 5:30pm–9pm
   *       "2-6 09:00-17:00",   // Mon–Fri: 9am–5pm
   *       "2,4,6 20:00-00:00", // Mon, Wed, Fri: 8pm–midnight
   *       "7 10:00-19:00"      // Saturday: 10am–7pm
   *     ]
   *   }
   * }).then((state) => {
   *   // Start the Scheduler
   *   BackgroundGeolocation.startSchedule();
   * });
   *
   * // Listen for schedule state changes
   * BackgroundGeolocation.onSchedule((state) => {
   *   console.log("[onSchedule] enabled?", state.enabled);
   * });
   *
   * // Later (e.g., user logout)
   * BackgroundGeolocation.stopSchedule();
   * BackgroundGeolocation.stop(); // if tracking is currently enabled
   *
   * // Modify schedule using setConfig
   * BackgroundGeolocation.setConfig({
   *   app: {
   *     schedule: [
   *       "1-7 09:00-10:00",
   *       "1-7 11:00-12:00",
   *       "1-7 13:00-14:00",
   *       "1-7 15:00-16:00",
   *       "1-7 17:00-18:00",
   *       "2,4,6 19:00-22:00"
   *     ]
   *   }
   * });
   * ```
   *
   * **Literal Dates**
   *
   * The schedule may use literal date ranges.
   *
   * ```txt
   * "yyyy-mm-dd HH:mm-HH:mm"
   * ```
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     schedule: [
   *       "2018-01-01 09:00-17:00"
   *     ]
   *   }
   * });
   * ```
   *
   * Or specify distinct start **and** stop dates:
   *
   * ```txt
   * "yyyy-mm-dd-HH:mm yyyy-mm-dd-HH:mm"
   * ```
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     schedule: [
   *       "2018-01-01-09:00 2019-01-01-17:00" // track for 1 year
   *     ]
   *   }
   * });
   * ```
   *
   * **Scheduling Geofences-Only vs Location + Geofences**
   *
   * Append `geofence` or `location` to explicitly choose a tracking mode:
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     schedule: [
   *       "1-7 09:00-17:00 location",
   *       "1-7 18:00-12:00 geofence"
   *     ]
   * }
   * ```
   *
   * Since `location` is the default mode, it may be omitted:
   * 
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     schedule: [
   *       "1-7 09:00-17:00 location",
   *       "1-7 18:00-12:00 geofence"
   *     ]
   *   }
   * });
   * ```
   *
   * Since `location` is the default mode, it may be omitted:
   *   `"1-7 13:00-14:00 geofence"`
   *
   * **iOS**
   *
   * - iOS **cannot** evaluate the schedule *exactly* at the configured time.
   *   Evaluation occurs only when the app is awakened.
   * - When in a scheduled **off** period, iOS continues monitoring low-power
   *   **Significant Location Changes (SLC)**.
   *   This guarantees periodic evaluation, especially when
   *   `{@link AppConfig.stopOnTerminate}` is `false` and the OS halts
   *   traditional Background Fetch.
   * - Schedule evaluation occurs when:
   *   - the app pauses/resumes,
   *   - any location is recorded (including SLC),
   *   - a Background Fetch event fires.
   *
   * **Android**
   *
   * - Uses `AlarmManager.setExactAndAllowWhileIdle`, typically evaluating
   *   on-the-minute.
   *
   * **ℹ️ See also**
   * - {@link BackgroundGeolocation.startSchedule}
   * - {@link BackgroundGeolocation.stopSchedule}
   */  
  schedule?: string[];

  /**
   * __Android only__ Force the Android scheduler to use `AlarmManager` (more precise) instead of `JobScheduler`.  Defaults to `false`.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     schedule: ["1-7 09:00-17:00"],
   *     scheduleUseAlarmManager: true
   *   }
   * });
   * ```
   */
  scheduleUseAlarmManager?: boolean;

  /**
   * [__Android only]__ Configures the persistent foreground-service [[Notification]] required by Android.
   *
   * ![](https://dl.dropbox.com/s/acuhy5cu4p7uofr/android-foreground-service-default.png?dl=1)
   *
   * See {@link NotificationConfig} for detailed usage.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       title: "Background tracking engaged",
   *       text: "My notification text"
   *     }
   *   }
   * });
   * ```
   */
  notification?: NotificationConfig;

  /**
   * (__Android 11+__) Configures the dialog shown when requesting *Always* location
   * permission on Android 11+.
   *
   * Android 11 changed location authorization behavior and removed the
   * **“Allow all the time”** button from the system permission dialog.  
   * Instead, apps may present a custom rationale dialog explaining *why* background
   * access is required. Selecting the dialog’s `positiveAction` sends the user
   * directly to the system **Location Permissions** screen, where they must
   * explicitly enable **Allow all the time**.
   *
   * This SDK shows that dialog automatically when you have supplied
   * {@link AppConfig.backgroundPermissionRationale}.
   *
   * ![](https://dl.dropbox.com/s/343nbrzpaavfser/android11-location-authorization-rn.gif?dl=1)
   *
   * - Android will show the rationale dialog **only once**. After the user presses
   *   the `positiveAction`, it will not appear again.  
   *   (Pressing **Cancel** does *not* count.)
   * - If the user later resets your app’s Location Permission to **Ask every time**,
   *   the rationale dialog *may* be presented again.
   *
   * ![](https://dl.dropbox.com/s/4fq4erz2lpqz00m/android11-location-permission-rationale-dialog.png?dl=1)
   * ![](https://dl.dropbox.com/s/dy65k8b0sgj5cgy/android11-location-authorization-upgrade-settings.png?dl=1)
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     locationAuthorizationRequest: 'Always'
   *   },
   *   app: {
   *     backgroundPermissionRationale: {
   *       title: "Allow {applicationName} to access this device's location in the background?",
   *       message: "To track your activity in the background, please enable {backgroundPermissionOptionLabel} location permission.",
   *       positiveAction: "Change to {backgroundPermissionOptionLabel}",
   *       negativeAction: "Cancel"
   *     }
   *   }
   * });
   * ```
   *
   * __Template Tags__
   *
   * You may embed the following template variables inside {@link PermissionRationale | PermissionRationale} fields, wrapped as **`{tagName}`**:
   *
   * | Template Tag                            | Default value        | Description |
   * |-----------------------------------------|----------------------|-------------|
   * | **`{backgroundPermissionOptionLabel}`** | *Allow all the time* | To track your activity in the background, please enable {backgroundPermissionOptionLabel} location permission. |
   * | **`{applicationName}`**                 | Your app name        | From `AndroidManifest.xml` |
   *
   * &nbsp;
   *
   * **See also**
   * - {@link GeoConfig.locationAuthorizationRequest}
   * - {@link BackgroundGeolocation.requestPermission}
   * - [Location updates in Android 11](https://developer.android.com/about/versions/11/privacy/location)
   */
  backgroundPermissionRationale?: PermissionRationale;

  /**
   * **iOS only** — Prevent iOS from suspending your application after location-services
   * have been turned off while running in the background.
   *
   * Defaults to **`false`**.  
   * 
   * Set **`true`** to keep your application alive in the background even after iOS
   * disables location-services. This is required when using a
   * {@link AppConfig.heartbeatInterval | heartbeat interval}.
   *
   * **⚠️ Warning**
   *
   * - `preventSuspend: true` should be used **only for very specific use-cases**.  
   *   It has a **large and noticeable impact on battery consumption**.
   * - You should enable `preventSuspend` only for controlled periods of time.  
   *   It is **not suitable** for continuous 24/7 operation.
   * - When the device is **unplugged** with the screen **off**, iOS still throttles
   *   {@link BackgroundGeolocation.onHeartbeat} about **2 minutes** after entering the
   *   background.  
   * 
   *   Heartbeats resume immediately if:
   *   - the screen turns on, or  
   *   - even the slightest device-motion is detected.
   *
   * @example
   * ```ts
   * // Subscribe to heartbeat events
   * BackgroundGeolocation.onHeartbeat((event) => {
   *   console.log("[onHeartbeat]", event);
   * });
   *
   * // Enable preventSuspend via AppConfig
   * BackgroundGeolocation.ready({
   *   app: {
   *     preventSuspend: true,
   *     heartbeatInterval: 60,
   *   }
   * });
   * ```
   *
   * **ℹ️ See also**
   * - {@link AppConfig.heartbeatInterval}
   * - {@link BackgroundGeolocation.onHeartbeat}
   */
  preventSuspend?: boolean;
}
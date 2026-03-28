import { NotificationConfig } from './NotificationConfig';

/**
 * Configures the background location permission rationale dialog on Android 11
 * and later. [Android only]
 *
 * Android 11 removed the **Allow all the time** option from the system location
 * permission dialog. Apps may instead show a custom rationale dialog that explains
 * why background access is needed and routes the user to the system Location
 * Permissions screen to grant it explicitly.
 *
 * ## Contents
 * - [Overview](#overview)
 * - [Template tags](#template-tags)
 *
 * ---
 *
 * ## Overview
 *
 * The SDK presents this dialog automatically when
 * {@link GeoConfig.locationAuthorizationRequest} is `"Always"` and
 * {@link AppConfig.backgroundPermissionRationale} is configured.
 *
 * Selecting the dialog's positive action sends the user directly to the system
 * **Location Permissions** screen, where they must enable **Allow all the time**
 * themselves.
 *
 * - The dialog is shown **once only**. After the user presses the positive action
 *   it will not appear again. Pressing **Cancel** does not count as acceptance.
 * - If the user later resets your app's Location permission to **Ask every time**,
 *   the dialog becomes eligible to be shown again.
 *
 * ![](https://dl.dropbox.com/s/343nbrzpaavfser/android11-location-authorization-rn.gif?dl=1)
 * ![](https://dl.dropbox.com/s/4fq4erz2lpqz00m/android11-location-permission-rationale-dialog.png?dl=1)
 * ![](https://dl.dropbox.com/s/dy65k8b0sgj5cgy/android11-location-authorization-upgrade-settings.png?dl=1)
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
 * ---
 *
 * ## Template tags
 *
 * Embed the following variables inside any rationale field using `{tagName}` syntax:
 *
 * | Template Tag | Default value | Description |
 * |---|---|---|
 * | `{backgroundPermissionOptionLabel}` | "Allow all the time" | (API 30+) Localized label for the background location permission option. |
 * | `{applicationName}` | App name | Localized application name from `AndroidManifest`. |
 *
 * **See also**
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
   * Body text of the dialog. Explain why your app needs background location
   * access, similar in purpose to the iOS `NSLocationAlwaysAndWhenInUseUsageDescription`.
   */
  message?: string;
  /**
   * Text to display on the positive action button.
   */
  positiveAction?: string;
  /**
   * Text to display on the negative action button (e.g. "Cancel").
   */
  negativeAction?: string;
}


/**
 * Application and lifecycle configuration for the background geolocation SDK.
 *
 * `AppConfig` controls how the SDK integrates with your app's lifecycle: tracking
 * behavior on terminate and reboot, headless operation, periodic heartbeats,
 * automated scheduler windows, foreground notifications, and the Android
 * background-permission rationale dialog.
 *
 * ## Contents
 * - [Overview](#overview)
 * - [Lifecycle](#lifecycle)
 * - [Heartbeat](#heartbeat)
 * - [Scheduler](#scheduler)
 * - [Background permission](#background-permission)
 * - [Migration](#migration)
 * - [Examples](#examples)
 *
 * ---
 *
 * ## Overview
 *
 * | Category | Properties | Notes |
 * |----------|------------|-------|
 * | **Lifecycle** | `stopOnTerminate`, `startOnBoot` | Controls tracking across app terminate and device reboot. |
 * | **Headless** | `enableHeadless` | [Android only] Tracking continues with no JS/UI process. |
 * | **Heartbeat** | `heartbeatInterval`, `preventSuspend` | Periodic background callbacks. `preventSuspend` is [iOS only]. |
 * | **Scheduler** | `schedule`, `scheduleUseAlarmManager` | Automated start/stop windows. `scheduleUseAlarmManager` is [Android only]. |
 * | **Notification** | `notification` | [Android only] Foreground service notification. |
 * | **Permission** | `backgroundPermissionRationale` | [Android only] Android 11+ background location rationale. |
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
 * ---
 *
 * ## Lifecycle
 *
 * {@link AppConfig.stopOnTerminate} (default `true`) controls whether tracking
 * stops when the user terminates the app. Set to `false` to continue tracking
 * after termination — iOS and Android handle this differently:
 *
 * - **iOS** creates a stationary geofence and relaunches the app when the device
 *   exits it (~200 m). Tracking resumes automatically.
 * - **Android** continues the native background service headlessly. Pair with
 *   {@link HttpConfig.url} to ensure uploads continue without the UI layer.
 *
 * {@link AppConfig.startOnBoot} (default `false`) controls whether tracking
 * resumes after a device reboot. On Android, the background service restarts
 * automatically. On iOS, the OS must first wake the app via a stationary geofence
 * exit or a Background Fetch event.
 *
 * {@link AppConfig.enableHeadless} (default `false`) allows Android to respond
 * to SDK events even after the app is terminated. Requires
 * `stopOnTerminate: false`. [Android only]
 *
 * ---
 *
 * ## Heartbeat
 *
 * {@link AppConfig.heartbeatInterval} fires {@link BackgroundGeolocation.onHeartbeat}
 * periodically while the app is in the background. On iOS, this requires
 * {@link AppConfig.preventSuspend} `true` to keep the app alive. On Android, the
 * minimum interval is 60 seconds.
 *
 * {@link AppConfig.preventSuspend} (default `false`) prevents iOS from suspending
 * the app when location services are inactive. Required for heartbeat support on
 * iOS but increases battery consumption — use only for specific, time-limited
 * use cases. [iOS only]
 *
 * ---
 *
 * ## Scheduler
 *
 * {@link AppConfig.schedule} accepts an array of schedule strings that tell the
 * SDK when to automatically start and stop tracking. Each string follows the
 * format `"DAY(s) HH:mm-HH:mm"` using 24h time and Locale.US day numbers
 * (Sunday=1, Saturday=7).
 *
 * Call {@link BackgroundGeolocation.startSchedule} to activate the scheduler
 * after calling `ready()`.
 *
 * {@link AppConfig.scheduleUseAlarmManager} (default `false`) forces the Android
 * scheduler to use `AlarmManager` (exact, on-the-minute) instead of
 * `JobScheduler` (inexact). [Android only]
 *
 * ---
 *
 * ## Background permission
 *
 * Android 11 removed the **Allow all the time** option from the system location
 * dialog. Configure {@link AppConfig.backgroundPermissionRationale} to show a
 * custom rationale dialog that routes the user to the system Location Permissions
 * screen to grant background access. The SDK shows this dialog automatically when
 * {@link GeoConfig.locationAuthorizationRequest} is `"Always"`. [Android only]
 *
 * See {@link PermissionRationale} for the full dialog configuration reference.
 *
 * ---
 *
 * ## Migration
 *
 * The following properties were previously on the root `Config` object and are
 * now deprecated there. Supply them via `Config.app` instead:
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
 * ---
 *
 * ## Examples
 *
 * @example Configure once at startup:
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
 * ```ts
 * await BackgroundGeolocation.setConfig({
 *   app: {
 *     heartbeatInterval: 120 // slow down heartbeats
 *   }
 * });
 * ```
 *
 * @category Config
 */
export interface AppConfig {
  /**
   * Controls whether tracking stops when the application is terminated by the
   * user. Defaults to `true`.
   *
   * When `true`, the SDK calls `stop()` as the app terminates. Set to `false`
   * to keep tracking alive after termination — iOS and Android behave differently
   * in this state.
   *
   * ## iOS
   *
   * Before termination, the SDK registers a stationary geofence of
   * {@link GeoConfig.stationaryRadius} meters around the last known position.
   * When the device exits that geofence (~200 m), iOS fully relaunches the app
   * in the background and tracking resumes automatically. This mechanism survives
   * device reboot because iOS monitors geofences at the OS level.
   *
   * Demo video: https://www.youtube.com/watch?v=aR6r8qV1TI8&t=214s
   *
   * ![](https://dl.dropboxusercontent.com/s/1uip231l3gds68z/screenshot-stopOnTerminate-ios.png?dl=0)
   *
   * ## Android
   *
   * Android does not pause tracking when the user terminates the app. The native
   * background service continues running headlessly without the JS/UI process.
   * Configure {@link HttpConfig.url} so the service can continue uploading
   * locations to your server.
   *
   * **See also**
   * - {@link AppConfig.enableHeadless}
   * - [Android Headless Mode](github:wiki/Android-Headless-Mode)
   */
  stopOnTerminate?: boolean;

  /**
   * Controls whether tracking resumes automatically after the device reboots.
   * Defaults to `false`.
   *
   * ## iOS
   *
   * iOS cannot begin tracking immediately after a reboot. Similar to
   * {@link AppConfig.stopOnTerminate} `false`, the SDK waits until one of the
   * following occurs:
   * - The device exits the stationary geofence created around the last known
   *   location.
   * - A system Background Fetch event fires (typically every ~15 minutes).
   *
   * ## Android
   *
   * When `true`, Android relaunches the SDK background service after reboot and
   * initial device unlock. If {@link AppConfig.enableHeadless} is also `true`,
   * tracking resumes even before the JS/UI layer starts.
   *
   * **See also**
   * - {@link AppConfig.enableHeadless}
   * - {@link AppConfig.stopOnTerminate}
   */
  startOnBoot?: boolean;

  /**
   * Enables headless operation so the SDK can respond to events after the app
   * has been terminated with {@link AppConfig.stopOnTerminate} `false`. Defaults
   * to `false`. [Android only]
   *
   * In the headless state only the native foreground service is running — the
   * JS/UI process is gone. Register a callback with
   * {@link BackgroundGeolocation.registerHeadlessTask} to handle events in this
   * state.
   *
   * ## Note
   *
   * - Requires {@link AppConfig.stopOnTerminate} `false`.
   * - With `stopOnTerminate: false`, the SDK records and uploads locations
   *   regardless of `enableHeadless`. Enable this only if you need to perform
   *   custom work during the headless state (for example, posting a local
   *   notification).
   *
   * **See also**
   * - [Android Headless Mode](github:wiki/Android-Headless-Mode)
   * - {@link BackgroundGeolocation.registerHeadlessTask}
   */
  enableHeadless?: boolean;

  /**
   * Rate in seconds at which {@link BackgroundGeolocation.onHeartbeat} events
   * fire while the app is in the background.
   *
   * ## iOS
   *
   * Requires {@link AppConfig.preventSuspend} `true`. Defaults to `60` seconds
   * when enabled.
   *
   * ## Android
   *
   * Heartbeat is disabled by default (`-1`). Set to a positive integer of at
   * least `60` to enable it. Values below `60` are not supported.
   *
   * ## ⚠️ Warning
   *
   * - On iOS, heartbeat fires only when {@link AppConfig.preventSuspend} is
   *   `true`.
   * - On Android, the minimum supported interval is `60` seconds.
   *
   * **See also**
   * - {@link BackgroundGeolocation.onHeartbeat}
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
   */
  heartbeatInterval?: number;

  /**
   * Configures a cron-like automated schedule that tells the SDK when to
   * {@link BackgroundGeolocation.start | start} and
   * {@link BackgroundGeolocation.stop | stop} tracking.
   *
   * @example
   * ```ts
   * "{DAY(s)} {START_TIME}-{END_TIME}"
   * ```
   *
   * - Times are in **24h format**.
   * - `DAY` uses **Locale.US** day numbers: **Sunday = 1**, **Saturday = 7**.
   * - Day values may be a single day (`"1"`), a comma-separated list (`"2,4,6"`),
   *   or a range (`"2-6"`).
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
   * BackgroundGeolocation.stop(); // if tracking is currently active
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
   * ## Literal dates
   *
   * A schedule entry may use a literal date range:
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
   * ## Scheduling modes
   *
   * Append `geofence` or `location` to explicitly choose a tracking mode.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     schedule: [
   *       "1-7 09:00-17:00 location",
   *       "1-7 18:00-00:00 geofence"
   *     ]
   *   }
   * });
   * ```
   *
   * ## iOS
   *
   * - iOS cannot evaluate the schedule exactly at the configured time.
   *   Evaluation occurs only when the app is awakened.
   * - During a scheduled **off** period, iOS continues monitoring low-power
   *   Significant Location Changes (SLC) to guarantee periodic re-evaluation,
   *   especially when {@link AppConfig.stopOnTerminate} is `false` and the OS
   *   halts traditional Background Fetch.
   * - Schedule evaluation occurs when the app pauses/resumes, any location is
   *   recorded (including SLC), or a Background Fetch event fires.
   *
   * ## Android
   *
   * Uses `AlarmManager.setExactAndAllowWhileIdle`, typically evaluating
   * on-the-minute.
   *
   * **See also**
   * - {@link BackgroundGeolocation.startSchedule}
   * - {@link BackgroundGeolocation.stopSchedule}
   */
  schedule?: string[];

  /**
   * Forces the Android scheduler to use `AlarmManager` (exact, on-the-minute)
   * instead of `JobScheduler` (inexact). Defaults to `false`. [Android only]
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
   * Configures the persistent foreground-service notification required by
   * Android. [Android only]
   *
   * ![](https://dl.dropbox.com/s/acuhy5cu4p7uofr/android-foreground-service-default.png?dl=1)
   *
   * See {@link NotificationConfig} for detailed usage.
   *
   * @example
   * ```ts
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
   * Configures the dialog shown when requesting *Always* background location
   * permission on Android 11 and later. [Android only]
   *
   * Android 11 removed the **Allow all the time** button from the system
   * permission dialog. Apps may instead present a custom rationale dialog
   * explaining why background access is required. Selecting the dialog's
   * `positiveAction` sends the user directly to the system **Location
   * Permissions** screen, where they must enable **Allow all the time**.
   *
   * The SDK shows this dialog automatically when
   * {@link AppConfig.backgroundPermissionRationale} is configured and
   * {@link GeoConfig.locationAuthorizationRequest} is `"Always"`.
   *
   * - The rationale dialog is shown **once only**. After the user presses the
   *   `positiveAction`, it will not appear again. Pressing **Cancel** does not
   *   count.
   * - If the user later resets your app's Location permission to **Ask every
   *   time**, the dialog may be presented again.
   *
   * ![](https://dl.dropbox.com/s/343nbrzpaavfser/android11-location-authorization-rn.gif?dl=1)
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
   * ## Template tags
   *
   * Embed the following variables inside {@link PermissionRationale | PermissionRationale}
   * fields using `{tagName}` syntax:
   *
   * | Template Tag | Default value | Description |
   * |---|---|---|
   * | `{backgroundPermissionOptionLabel}` | *Allow all the time* | Localized label for the background permission option (API 30+). |
   * | `{applicationName}` | Your app name | From `AndroidManifest.xml`. |
   *
   * **See also**
   * - {@link GeoConfig.locationAuthorizationRequest}
   * - {@link BackgroundGeolocation.requestPermission}
   * - [Location updates in Android 11](https://developer.android.com/about/versions/11/privacy/location)
   */
  backgroundPermissionRationale?: PermissionRationale;

  /**
   * Prevents iOS from suspending the application after location services have
   * been disabled while running in the background. Defaults to `false`.
   * [iOS only]
   *
   * Set to `true` to keep the app alive in the background even after iOS
   * disables location services. This is required for
   * {@link AppConfig.heartbeatInterval} to fire on iOS.
   *
   * ## ⚠️ Warning
   *
   * `preventSuspend: true` has a large and noticeable impact on battery
   * consumption. Use it only for specific, time-limited use cases — it is not
   * suitable for continuous 24/7 operation.
   *
   * When the device is unplugged with the screen off, iOS still throttles
   * heartbeat events approximately 2 minutes after entering the background.
   * Heartbeats resume immediately when the screen turns on or any device motion
   * is detected.
   *
   * **See also**
   * - {@link AppConfig.heartbeatInterval}
   * - {@link BackgroundGeolocation.onHeartbeat}
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
   */
  preventSuspend?: boolean;
}

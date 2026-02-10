import type { Logger } from './Logger';
import type { DeviceSettings} from './DeviceSettings';
import type { CurrentPositionRequest } from './CurrentPositionRequest';
import type { WatchPositionRequest } from './WatchPositionRequest';
import type { Config } from '../config/Config';
import type { State } from './State';
import type { GeoConfig } from '../config/GeoConfig';
import type { HttpConfig } from '../config/HttpConfig';
import type { AppConfig } from '../config/AppConfig';
import type { PersistenceConfig } from '../config/PersistenceConfig';
import type { ActivityConfig } from '../config/ActivityConfig';
import type { AuthorizationConfig } from '../config/AuthorizationConfig';
import type { NotificationConfig } from '../config/NotificationConfig';

import type { Location } from '../data/Location';
import type { LocationError } from '../../enums/LocationError';
import type { Geofence } from '../data/Geofence';
import type { DeviceInfo} from '../data/DeviceInfo';
import type { Sensors } from '../data/Sensors';

import type { Subscription } from '../events/Subscription';
import type { GeofenceEvent } from '../events/GeofenceEvent';
import type { AuthorizationEvent } from '../events/AuthorizationEvent';
import type { MotionActivityEvent } from '../events/MotionActivityEvent';
import type { HeadlessEvent } from '../events/HeadlessEvent';
import type { HeartbeatEvent } from '../events/HeartbeatEvent';
import type { GeofencesChangeEvent } from '../events/GeofencesChangeEvent';
import type { ConnectivityChangeEvent } from '../events/ConnectivityChangeEvent';
import type { MotionChangeEvent } from '../events/MotionChangeEvent';
import type { ProviderChangeEvent } from '../events/ProviderChangeEvent';
import type { HttpEvent } from '../events/HttpEvent';

// Enums (adapters will attach these as statics at runtime)
import type { Event } from '../../enums/Event';
import type { AuthorizationStatus } from '../../enums/AuthorizationStatus';
import type { LogLevel } from '../../enums/LogLevel';
import type { DesiredAccuracy } from '../../enums/DesiredAccuracy';
import type { PersistMode } from '../../enums/PersistMode';
import type { AuthorizationStrategy } from '../../enums/AuthorizationStrategy';
import type { LocationFilterPolicy } from '../../enums/LocationFilterPolicy';
import type { KalmanProfile } from '../../enums/KalmanProfile';
import type { HttpMethod } from '../../enums/HttpMethod';
import type { TriggerActivity } from '../../enums/TriggerActivity';
import type { NotificationPriority } from '../../enums/NotificationPriority';
import type { AccuracyAuthorization } from '../../enums/AccuracyAuthorization';
import type { TransistorAuthorizationToken } from './TransistorAuthorizationService';

/** 
 * Payloads for strongly-typed event listeners. 
 * @internal @hidden
 */
export interface EventPayloads {
  location: Location;
  motionchange: MotionChangeEvent;
  activitychange: MotionActivityEvent;
  geofence: GeofenceEvent;
  geofenceschange: GeofencesChangeEvent;
  http: HttpEvent;
  heartbeat: HeartbeatEvent;
  providerchange: ProviderChangeEvent;
  authorization: AuthorizationEvent;
  connectivitychange: ConnectivityChangeEvent;
  enabledchange: { enabled: boolean };
  powersavechange: { isPowerSaveMode: boolean };
  schedule: { identifier?: string };
  notification: { action: string };
  [event: string]: any;
}

/** 
 * on/once/remove… with typed payloads. 
 * @internal @hidden
 */
export interface BackgroundGeolocationEvents {    
  /**
   * <!-- doc-id: BackgroundGeolocation.onLocation -->
   * Subscribe to location events.
   *
   * Every location recorded by the SDK is provided to your `callback`, including those from {@link onMotionChange}, {@link getCurrentPosition} and {@link watchPosition}.
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onLocation((location) => {
   *   console.log("[onLocation] success: ", location);
   * }, (error) => {
   *   console.log("[onLocation] ERROR: ", error);
   * });
   * ```
   *
   * __Error Codes__
   *
   * If the native location API fails to return a location, the `failure` callback will be provided a {@link LocationError}.
   *
   * __⚠️ Note {@link Location.sample|`Location.sample`}:__
   *
   * When performing a {@link onMotionChange} or {@link getCurrentPosition}, the plugin requests **multiple** location *samples* in order to record the most accurate location possible.  These *samples* are **not** persisted to the database but they will be provided to your `callback`, for your convenience, since it can take some seconds for the best possible location to arrive.
   *
   * For example, you might use these samples to progressively update the user's position on a map.  You can detect these *samples* in your `callback` via `location.sample == true`.  If you're manually `POST`ing location to your server, you should ignore these locations.
   *
   * @event location
   */
  onLocation(cb: (location: Location) => void, onError?: (err: LocationError) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onMotionChange -->
   * Subscribe to __`motionchange`__ events.
   *
   * Your `callback` will be executed each time the device has changed-state between **MOVING** or **STATIONARY**.
   *
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onMotionChange((event:MotionChangeEvent) => {
   *   if (event.isMoving) {
   *      console.log("[onMotionChange] Device has just started MOVING ", event.location);
   *   } else {
   *      console.log("[onMotionChange] Device has just STOPPED:  ", event.location);
   *   }
   * });
   * ```
   *
   * ----------------------------------------------------------------------
   * __⚠️ Warning:  `autoSyncThreshold`__
   *
   * If you've configured {@link HttpConfig.autoSyncThreshold}, it **will be ignored** during a `onMotionChange` event &mdash; all queued locations will be uploaded, since:
   * - If an `onMotionChange` event fires **into the *moving* state**, the device may have been sitting dormant for a long period of time.  The plugin is *eager* to upload this state-change to the server as soon as possible.
   * - If an `onMotionChange` event fires **into the *stationary* state**, the device may be about to lie dormant for a long period of time.  The plugin is *eager* to upload all queued locations to the server before going dormant.
   * ----------------------------------------------------------------------
   *
   * __ℹ️ See also:__
   * - {@link GeoConfig.stopTimeout}
   * - 📘 [Philosophy of Operation](github:wiki/Philosophy-of-Operation)
   *
   * @event motionchange
   */
  onMotionChange(cb: (event: MotionChangeEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onGeofence -->
   * Subscribe to Geofence transition events.
   *
   * Your supplied `callback` will be called when any monitored geofence crossing occurs.
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onGeofence((event) => {
   *   console.log("[onGeofence] ", event);
   * });
   * ```
   *
   * __ℹ️ See also:
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @event geofence
   */
  onGeofence(cb: (event: GeofenceEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onGeofencesChange -->
   * Subscribe to changes in actively monitored geofences.
   *
   * Fired when the list of monitored-geofences changed.  The BackgroundGeolocation SDK contains powerful geofencing features that allow you to monitor
   * any number of circular geofences you wish (thousands even), in spite of limits imposed by the native platform APIs (**20 for iOS; 100 for Android**).
   *
   * The plugin achieves this by storing your geofences in its database, using a [geospatial query](https://en.wikipedia.org/wiki/Spatial_query) to determine
   * those geofences in proximity (@see {@link GeoConfig.geofenceProximityRadius}), activating only those geofences closest to the device's current location
   * (according to limit imposed by the corresponding platform).
   *
   * When the device is determined to be moving, the plugin periodically queries for geofences in proximity (eg. every minute) using the latest recorded
   * location.  This geospatial query is **very fast**, even with tens-of-thousands geofences in the database.
   *
   * It's when this list of monitored geofences *changes*, that the plugin will fire the `onGeofencesChange` event.
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onGeofencesChange((event) => {
   *   let on = event.on;     //<-- new geofences activated.
   *   let off = event.off; //<-- geofences that were just de-activated.
   *
   *   // Create map circles
   *   on.forEach((geofence) => {
   *     createGeofenceMarker(geofence)
   *   });
   *
   *   // Remove map circles
   *   off.forEach((identifier) => {
   *     removeGeofenceMarker(identifier);
   *   }
   * });
   * ```
   *
   * __ℹ️ See also:__
   * - 📘 {@link Geofence | Geofencing Guide}
   * @event geofenceschange
   */
  onGeofencesChange(cb: (event: GeofencesChangeEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onActivityChange -->
   * Subscribe to changes in motion activity.
   *
   * Your `callback` will be executed each time the activity-recognition system receives an event (`still, on_foot, in_vehicle, on_bicycle, running`).
   *
   * __Android:__
   * Android {@link MotionActivityEvent.confidence} always reports `100%`.
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onActivityChange((event) => {
   *   console.log("[onActivityChange] ", event);
   * });
   * ```
   * @event activitychange
   */
  onActivityChange(cb: (event: MotionActivityEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onProviderChange -->
   * Subscribe to changes in device's location-services configuration / authorization.
   *
   * Your `callback` fill be executed whenever a change in the state of the device's **Location Services** has been detected.  eg: "GPS ON", "WiFi only".
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onProviderChange((event) => {
   *   console.log("[onProviderChange: ", event);
   *
   *   switch(event.status) {
   *     case BackgroundGeolocation.AUTHORIZATION_STATUS_DENIED:
   *       // Android & iOS
   *       console.log("- Location authorization denied");
   *       break;
   *     case BackgroundGeolocation.AUTHORIZATION_STATUS_ALWAYS:
   *       // Android & iOS
   *       console.log("- Location always granted");
   *       break;
   *     case BackgroundGeolocation.AUTHORIZATION_STATUS_WHEN_IN_USE:
   *       // iOS only
   *       console.log("- Location WhenInUse granted");
   *       break;
   *   }
   * });
   * ```
   *
   * __ℹ️ See also:__ 
   * - You can explicitly request the current state of location-services using {@link getProviderState}.
   *
   * __⚠️ Note:__
   * - The plugin always force-fires an {@link onProviderChange} event whenever the app is launched (right after the {@link ready} method is executed), regardless of current state, so you can learn the the current state of location-services with each boot of your application.
   *
   * @event providerchange
   */
  onProviderChange(cb: (event: ProviderChangeEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onHeartbeat -->
   * Subscribe to periodic heartbeat events.
   *
   * Your `callback` will be executed for each {@link AppConfig.heartbeatInterval} while the device is in **stationary** state (**iOS** requires {@link AppConfig.preventSuspend}: true as well).
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.ready({
   *   heartbeatInterval: 60,
   *   preventSuspend: true // <-- Required for iOS
   * });
   *
   * const subscription = BackgroundGeolocation.onHeartbeat((event) => {
   *   console.log("[onHeartbeat] ", event);
   *
   *   // You could request a new location if you wish.
   *   BackgroundGeolocation.getCurrentPosition({
   *     samples: 1,
   *     persist: true
   *   }).then((location) => {
   *     console.log("[getCurrentPosition] ", location);
   *   });
   * })
   * ```
   *
   * __⚠️ Note:__  
   * -  The {@link Location} provided by the {@link HeartbeatEvent} is only the last-known location.  The *heartbeat* event does not actively engage location-services.  If you wish to get the current location in your `callback`, use {@link getCurrentPosition}.
   * @event heartbeat
   */
  onHeartbeat(cb: (event: HeartbeatEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onHttp -->
   * Subscribe to HTTP responses from your server {@link HttpConfig.url}.
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onHttp((response) => {
   *   let status = response.status;
   *   let success = response.success;
   *   let responseText = response.responseText;
   *   console.log("[onHttp] ", response);
   * });
   * ```
   * __ℹ️ See also:__
   *  - {@link HttpConfig | HTTP Guide}
   *
   * @event http
   */
  onHttp(cb: (event: HttpEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onSchedule -->
   * Subscribe to {@link AppConfig.schedule} events.
   *
   * Your `callback` will be executed each time a {@link AppConfig.schedule} event fires.  Your `callback` will be provided with the current {@link State}:  **`state.enabled`**
   * will reflect the state according to your {@link AppConfig.schedule}.
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onSchedule((state) => {
   *   if (state.enabled) {
   *     console.log("[onSchedule] scheduled start tracking");
   *   } else {
   *     console.log("[onSchedule] scheduled stop tracking");
   *   }
   * });
   * ```
   * @event schedule
   */
  onSchedule(cb: (state: State) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onConnectivityChange -->
   * Subscribe to changes in network connectivity.
   *
   * Fired when the state of the device's network-connectivity changes (enabled -> disabled and vice-versa).  By default, the plugin will automatically fire
   * a `connectivitychange` event with the current state network-connectivity whenever the {@link start} method is executed.
   *
   * ℹ️ The SDK subscribes internally to `connectivitychange` events &mdash; if you've configured the SDK's HTTP Service (See {@link HttpEvent | HTTP Guide}) and your app has queued locations,
   * the SDK will automatically initiate uploading to your configured {@link HttpConfig.url} when network connectivity is detected.
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onConnectivityChange((event) => {
   *   console.log("[onConnectivityChange] ", event);
   * });
   * ```
   * @event connectivitychange
   */
  onConnectivityChange(cb: (event: ConnectivityChangeEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onPowerSaveChange -->
   * Subscribe to state changes in OS power-saving system.
   *
   * Fired when the state of the operating-system's "Power Saving" mode changes.  Your `callback` will be provided with a `bool` showing whether
   * "Power Saving" is **enabled** or **disabled**.  Power Saving mode can throttle certain services in the background, such as HTTP requests or GPS.
   *
   * ℹ️ You can manually request the current-state of "Power Saving" mode with the method {@link isPowerSaveMode}.
   *
   * __iOS__
   *
   * iOS Power Saving mode can be engaged manually by the user in **Settings -> Battery** or from an automatic OS dialog.
   *
   * ![](https://dl.dropboxusercontent.com/s/lz3zl2jg4nzstg3/Screenshot%202017-09-19%2010.34.21.png?dl=1)
   *
   * __Android__
   *
   * Android Power Saving mode can be engaged manually by the user in **Settings -> Battery -> Battery Saver** or automatically with a user-specified "threshold" (eg: 15%).
   *
   * ![](https://dl.dropboxusercontent.com/s/raz8lagrqayowia/Screenshot%202017-09-19%2010.33.49.png?dl=1)
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onPowerSaveChange((isPowerSaveMode) => {
   *   console.log("[onPowerSaveChange: ", isPowerSaveMode);
   * });
   * ```
   * @event powersavechange
   */
  onPowerSaveChange(cb: (enabled: boolean) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onEnabledChange -->
   * Subscribe to changes in plugin {@link State.enabled}.
   *
   * Fired when the SDK's {@link State.enabled} changes.  For example, executing {@link start} and {@link stop} will cause the `onEnabledChange` event to fire.
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onEnabledChange(isEnabled => {
   *   console.log("[onEnabledChanged] isEnabled? ", isEnabled);
   * });
   * ```
   * @event enabledchange
   */
  onEnabledChange(cb: (enabled: boolean) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onNotificationAction -->
   * [__Android-only__] Subscribe to button-clicks of a custom {@link NotificationConfig.layout} on the Android foreground-service notification.
   */
  onNotificationAction(cb: (buttonId: string) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onAuthorization -->
   * Subscribe to {@link Config.authorization} events.
   *
   * Fired when {@link AuthorizationConfig.refreshUrl} responds, either successfully or not.  If successful, {@link AuthorizationEvent.success} will be `true` and {@link AuthorizationEvent.response} will
   * contain the decoded JSON response returned from the server.
   *
   * If authorization failed, {@link AuthorizationEvent.error} will contain the error message.
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onAuthorization((event) => {
   *   if (event.success) {
   *     console.log("[authorization] ERROR: ", event.error);
   *   } else {
   *     console.log("[authorization] SUCCESS: ", event.response);
   *   }
   * });
   * ```
   * @event authorization  
   */
  onAuthorization(cb: (event: AuthorizationEvent) => void): Subscription;

  /** 
   * @deprecated Use strongly-typed helpers above. 
   * @hidden
   */
  addListener(event: string, success: Function, failure?: Function): void;
  /** 
   * @deprecated Use Subscription.remove() returned by helpers above. 
   * @hidden
   */
  removeListener(event: string, cb: Function): void;
  
  /**
   * <!-- doc-id: BackgroundGeolocation.removeListeners -->
   * Removes all event-listeners.
   *
   * Calls {@link Subscription.remove} on all subscriptions.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.removeListeners();
   * ```
   */
  removeListeners(): Promise<void>;

  /**
   * <!-- doc-id: BackgroundGeolocation.registerHeadlessTask -->
   * Registers a Javascript callback to execute in the Android "Headless" state, where the app has been terminated configured with
   * {@link AppConfig.stopOnTerminate}:false`.  The received `event` object contains a `name` (the event name) and `params` (the event data-object).
   *
   * __⚠️ Note Cordova &amp; Capacitor__
   * - Javascript headless callbacks are not supported by Cordova or Capacitor.  See [Android Headless Mode](github:wiki/Android-Headless-Mode) 
   *
   * __⚠️ Warning:__
   * - You __must__ `registerHeadlessTask` in your application root file (eg: `index.js`).
   * 
   * __⚠️ Warning:__
   * - Your `function` __must__ be declared as `async`.  You must `await` all work within your task.  Your headless-task will automatically be terminated after executing the last line of your function.
   *
   * @example
   * ```typescript
   * const BackgroundGeolocationHeadlessTask = async (event) => {
   *   const params = event.params;
   *   console.log("[BackgroundGeolocation HeadlessTask] -", event.name, params);
   *
   *   switch (event.name) {
   *     case "terminate":
   *       // Use await for async tasks
   *       const location = await BackgroundGeolocation.getCurrentPosition({
   *         samples: 1,
   *         persist: false
   *       });
   *       console.log("[BackgroundGeolocation HeadlessTask] - getCurrentPosition:", location);
   *       break;
   *   }
   *   // You must await all work you do in your task.  
   *   // Headless-tasks are automatically terminated after executing the last line of your function.
   *   await doWork();
   * }
   *
   * BackgroundGeolocation.registerHeadlessTask(BackgroundGeolocationHeadlessTask);
   * ```
   *
   * __Debugging__
   * 
   * While implementing your headless-task It's crucial to observe your Android logs in a terminal via 
   * 
   * ```bash
   * $ adb logcat *:S TSLocationManager:V ReactNativeJS:V
   * 
   * TSLocationManager: [c.t.r.HeadlessTask onHeadlessEvent] 💀  event: connectivitychange
   * TSLocationManager: [c.t.r.HeadlessTask createReactContextAndScheduleTask] initialize ReactContext
   * TSLocationManager: [c.t.r.HeadlessTask onHeadlessEvent] 💀  event: providerchange
   * TSLocationManager: [c.t.r.HeadlessTask onHeadlessEvent] 💀  event: terminate
   * ReactNativeJS: '[BGGeoHeadlessTask] ', 'connectivitychange', taskId: 1
   * TSLocationManager: [c.t.r.HeadlessTask invokeStartTask] taskId: 1
   * TSLocationManager: [c.t.r.HeadlessTask invokeStartTask] taskId: 2
   * TSLocationManager: [c.t.r.HeadlessTask invokeStartTask] taskId: 3
   * ReactNativeJS: '[BGGeoHeadlessTask] ', 'providerchange', taskId: 2
   * ReactNativeJS: '[BGGeoHeadlessTask] ', 'terminate', taskId: 3
   * TSLocationManager: [c.t.l.u.BackgroundTaskManager$Task start] ⏳ startBackgroundTask: 1
   * TSLocationManager: [c.t.l.u.BackgroundTaskManager$Task start] ⏳ startBackgroundTask: 2
   * ReactNativeJS: *** [doWork] START
   * ReactNativeJS: *** [doWork] START
   * TSLocationManager: [c.t.l.u.BackgroundTaskManager$Task start] ⏳ startBackgroundTask: 3
   * ReactNativeJS: *** [doWork] START
   * .
   * .
   * .
   * ReactNativeJS: *** [doWork] FINISH
   * ReactNativeJS: *** [doWork] FINISH
   * ReactNativeJS: *** [doWork] FINISH
   * TSLocationManager: [c.t.l.u.BackgroundTaskManager$Task stop] ⏳ stopBackgroundTask: 1
   * TSLocationManager: [c.t.l.u.BackgroundTaskManager$Task stop] ⏳ stopBackgroundTask: 2
   * TSLocationManager: [c.t.l.u.BackgroundTaskManager$Task stop] ⏳ stopBackgroundTask: 3
   * TSLocationManager: [c.t.r.HeadlessTask$1 onHeadlessJsTaskFinish] taskId: 1
   * TSLocationManager: [c.t.r.HeadlessTask$1 onHeadlessJsTaskFinish] taskId: 2
   * TSLocationManager: [c.t.r.HeadlessTask$1 onHeadlessJsTaskFinish] taskId: 3
   * ```
   * 
   * __ℹ️ See also:__
   * - 📘 [Android Headless Mode](github:wiki/Android-Headless-Mode).
   * - {@link AppConfig.enableHeadless}
   *
   */
  registerHeadlessTask(callback: (event: HeadlessEvent) => Promise<void>): void;
}

/**
 * Core SDK API each adapter (RN/Cap/Cordova) implements.
 * Runtime default export should satisfy this interface.
 * @internal @hidden
 */
export interface BackgroundGeolocationAPI extends BackgroundGeolocationEvents {
  
  /**
   * <!-- doc-id: BackgroundGeolocation.deviceSettings -->
   * {@link DeviceSettings} API
   */
  readonly deviceSettings: DeviceSettings;
  /**
   * <!-- doc-id: BackgroundGeolocation.logger -->
   * {@link Logger} API
   */
  readonly logger: Logger;

  /**
   * <!-- doc-id: BackgroundGeolocation.ready -->
   *
   * Signal to the plugin that your app is launched and ready, proving the default {@link Config}.
   *
   * The supplied {@link Config} will be applied **only at first install** of your app — for every launch thereafter,
   * the plugin will automatically load its last-known configuration from persistent storage.
   * The plugin always remembers the configuration you apply to it.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.ready({
   *   desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
   *   distanceFilter: 10,
   *   stopOnTerminate: false,
   *   startOnBoot: true,
   *   url: "http://your.server.com",
   *   headers: {
   *    "my-auth-token": "secret-token"
   *   }
   * }).then((state) => {
   *  console.log("[ready] success", state);
   * });
   * ```
   *
   * __⚠️ Warning:__ 
   * - You must call __`.ready(confg)`__ **once** and **only** once, each time your app is launched.
   * - Do not hide the call to `.ready(config)` within a view which is loaded only by clicking a UI action.  This is particularly important
   * for iOS in the case where the OS relaunches your app in the background when the device is detected to be moving.  If you don't ensure that `.ready(config)` is called in this case, tracking will not resume.
   *
   * __The {@link reset} method.__
   *
   * If you wish, you can use the {@link reset} method to reset all {@link Config} options to documented default-values (with optional overrides):
   *
   * __{@link Config.reset}: false__
   *
   * Configuring the plugin with __`reset: false`__ should generally be avoided unless you know *exactly* what it does.  People often find this from the *Demo* app.  If you do configure `reset: false`, you'll find that your `Config` provided to `.ready` is consumed **only at first launch after install**.  Thereafter, the plugin will ignore any changes you've provided there.  The only way to change the config then is to use {@link setConfig}.
   *
   * You will especially not want to use `reset: false` during development, while you're fine-tuning your `Config` options.
   * 
   * The reason the *Demo* app uses `reset: false` is because it hosts an advanced "*Settings*" screen to tune the `Config` at runtime and we don't want those runtime changes to be overwritten by `.ready(config)` each time the app launches.
   * 
   * ⚠️ If you *don't* undestand what __`reset: false`__ does, **NO NOT USE IT**.  If you blindly copy/pasted it from the *Demo* app, **REMOVE IT** from your `Config`.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.reset();
   * // Reset to documented default-values with overrides
   * bgGeo.reset({
   *   distanceFilter:  10
   * });
   * ```
   */
  ready(config: Config): Promise<State>;

  /**
   * <!-- doc-id: BackgroundGeolocation.reset -->
   * Resets the SDK configuration to documented default-values.
   *
   * If an optional {@link Config} is provided, it will be applied *after* the configuration reset.
   *
   */
  reset(config:Config): Promise<State>;
  
  /**
   * <!-- doc-id: BackgroundGeolocation.start -->
   * Enable location + geofence tracking.
   *
   * This is the SDK's power **ON** button.  The plugin will initially start into its **stationary** state, fetching an initial location before
   * turning off location services.  Android will be monitoring its **Activity Recognition System** while iOS will create a stationary geofence around
   * the current location.
   *
   * __⚠️ Note:__
   * If you've configured a {@link AppConfig.schedule}, this method will override that schedule and engage tracking immediately.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.start().then((state) => {
   *   console.log("[start] success - ", state);
   * });
   * ```
   *
   * __ℹ️ See also:__
   * - {@link stop}
   * - {@link startGeofences}
   * - 📘 [Philosophy of Operation](github:wiki/Philosophy-of-Operation)
   */
  start(): Promise<State>;

  /**
   * <!-- doc-id: BackgroundGeolocation.stop -->
   * Disable location and geofence monitoring.  This is the SDK's power **OFF** button.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.stop();
   * ```
   *
   * __⚠️ Note:__
   * If you've configured a {@link AppConfig.schedule}, **`#stop`** will **not** halt the Scheduler.  You must explicitly {@link stopSchedule} as well:
   *
   * @example
   * ```typescript
   * // Later when you want to stop the Scheduler (eg: user logout)
   * BackgroundGeolocation.stopSchedule();
   * ```
   */
  stop(): Promise<State>;

  /**
   * <!-- doc-id: BackgroundGeolocation.changePace -->
   * Manually toggles the SDK's **motion state** between **stationary** and **moving**.
   *
   * When provided a value of  **`true`**, the plugin will engage location-services and begin aggressively tracking the device's location *immediately*,
   * bypassing stationary monitoring.
   *
   * If you were making a "Jogging" application, this would be your **`[Start Workout]`** button to immediately begin location-tracking.  Send **`false`**
   * to turn **off** location-services and return the plugin to the **stationary** state.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.changePace(true);  // <-- Location-services ON ("moving" state)
   * BackgroundGeolocation.changePace(false); // <-- Location-services OFF ("stationary" state)
   * ```
   */
  changePace(isMoving: boolean): Promise<State>;

  /**
   * <!-- doc-id: BackgroundGeolocation.startGeofences -->
   * Engages the geofences-only {@link State.trackingMode}.
   *
   * In this mode, no active location-tracking will occur &mdash; only geofences will be monitored.  To stop monitoring "geofences" {@link TrackingMode},
   * simply use the usual {@link stop} method.
   *
   * @example
   * ```typescript
   * // Add a geofence.
   * BackgroundGeolocation.addGeofence({
   *   notifyOnExit: true,
   *   radius: 200,
   *   identifier: "ZONE_OF_INTEREST",
   *   latitude: 37.234232,
   *   longitude: 42.234234
   * });
   *
   * // Listen to geofence events.
   * BackgroundGeolocation.onGeofence((event) => {
   *   console.log("[onGeofence] -  ", event);
   * });
   *
   * // Configure the plugin
   * BackgroundGeolocation.ready({
   *   url: "http://my.server.com",
   *   autoSync: true
   * }).then(((state) => {
   *   // Start monitoring geofences.
   *   BackgroundGeolocation.startGeofences();
   * });
   * ```
   *
   * __ℹ️ See also:__
   * - {@link stop}
   * - 📘 {@link Geofence | Geofencing Guide}
   */
  startGeofences(): Promise<State>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getState -->
   * Return the current {@link State} of the plugin, including all {@link Config} parameters.
   *
   * @example
   * ```typescript
   * let state = await BackgroundGeolocation.getState();
   * console.log("[state] ", state.enabled, state.trackingMode);
   * ```
   */
   getState(): Promise<State>; 

  /**
   * <!-- doc-id: BackgroundGeolocation.setConfig -->
   *
   * Re-configure the SDK's {@link Config} parameters.  This is the method to use when you wish to *change*
   * the plugin {@link Config} *after* {@link ready} has been executed.
   *
   * The supplied {@link Config} will be appended to the current configuration and applied in realtime.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.setConfig({
   *   desiredAccuracy: Config.DESIRED_ACCURACY_HIGH,
   *   distanceFilter: 100.0,
   *   stopOnTerminate: false,
   *   startOnBoot: true
   * }).then((state) => {
   *   console.log("[setConfig] success: ", state);
   * })
   * ```
   */
  setConfig(config: Partial<Config>): Promise<State>;    
  /**
   * <!-- doc-id: BackgroundGeolocation.getCurrentPosition -->
   * Retrieves the current {@link Location}.
   *
   * This method instructs the native code to fetch exactly one location using maximum power & accuracy.  The native code will persist the fetched location to
   * its SQLite database just as any other location in addition to POSTing to your configured {@link HttpConfig.url}.
   * If an error occurs while fetching the location, `catch` will be provided with an {@link LocationError}.
   *
   *
   * ### Options
   *
   * See {@link CurrentPositionRequest}.
   *
   * ### Error Codes
   *
   * See {@link LocationError}.
   *
   * @example
   * ```typescript
   * let location = await BackgroundGeolocation.getCurrentPosition({
   *   timeout: 30,          // 30 second timeout to fetch location
   *   maximumAge: 5000,     // Accept the last-known-location if not older than 5000 ms.
   *   desiredAccuracy: 10,  // Try to fetch a location with an accuracy of `10` meters.
   *   samples: 3,           // How many location samples to attempt.
   *   extras: {             // Custom meta-data.
   *     "route_id": 123
   *   }
   * });
   * ```
   * __⚠️ Note:__
   * - While `getCurrentPosition` will receive only **one** {@link Location}, the plugin *does* request **multiple** location samples which will all be provided
   * to the {@link onLocation} event-listener.  You can detect these samples via {@link Location.sample} `== true`.
   */
  getCurrentPosition(options?: CurrentPositionRequest): Promise<Location>;

  /**
   * <!-- doc-id: BackgroundGeolocation.watchPosition -->
   * Start a stream of continuous location-updates.  The native code will persist the fetched location to its SQLite database
   * just as any other location (If the SDK is currently {@link State.enabled}) in addition to POSTing to your configured {@link HttpConfig.url} (if you've enabled the HTTP features).
   *
   * `watchPosition` will return a {@link Subscription} which you must retain in order to later halt the location-stream.
   * 
   * __⚠️ Warning:__
   * `watchPosition` is **not** recommended for **long term** monitoring in the background &mdash; It's primarily designed for use in the foreground **only**.  You might use it for fast-updates of the user's current position on the map, for example.
   * The SDK's primary [Philosophy of Operation](github:wiki/Philosophy-of-Operation) **does not require** `watchPosition`.
   *
   * __iOS:__
   * `watchPosition` will continue to run in the background, preventing iOS from suspending your application.  Take care to listen to `suspend` event and call {@link Subscription.remove} if you don't want your app to keep running in the background, consuming battery.
   *
   * @example
   * ```typescript
   * onResume() async {
   *   // Start watching position while app in foreground, retaining the return Subscription.
   *   this.watchPositionSubscription = await BackgroundGeolocation.watchPosition({
   *     interval: 1000,
   *     extras: {foo: "bar"}
   *   }, (location) => {
   *     console.log("[watchPosition] -", location);
   *   }, (errorCode) => {
   *     console.log("[watchPosition] ERROR -", errorCode);
   *   })
   * }
   *
   * onSuspend() {
   *   // Halt watching position when app goes to background.
   *   this.watchPositionSubscription.remove();
   *   this.watchPositionSubscription = null;
   *
   * }
   * ```
   */
  watchPosition(options: WatchPositionRequest, locationCallback: (location: Location) => void, errorCallback?: (errorCode: number) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.stopWatchPosition -->
   * Stop watch-position updates initiated from {@link watchPosition}.
   * 
   * @example
   * ```typescript
   * onResume() async {
   *   // Start watching position while app in foreground.
   *   this.watchPositionSubscription = await BackgroundGeolocation.watchPosition({
   *     interval: 1000,
   *     extras: {foo: "bar"}
   *   }, (location) => {
   *     console.log("[watchPosition] -", location);
   *   }, (errorCode) => {
   *     console.log("[watchPosition] ERROR -", errorCode);
   *   });
   * }
   *
   * onSuspend() {
   *   // Halt watching position when app goes to background.
   *   this.watchPositionSubscription.remove();
   *   this.watchPositionSubscription = null;
   * }
   * ```
   * 
   * __ℹ️ See also:__
   * - {@link watchPosition}
   * @internal
   */
  stopWatchPosition?(watchId?:number): void;

  /**
   * <!-- doc-id: BackgroundGeolocation.resetOdometer -->
   * Initialize the `odometer` to `0`.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.resetOdometer().then((location) => {
   *   // This is the location where odometer was set at.
   *   console.log("[setOdometer] success: ", location);
   * });
   * ```
   *
   * __⚠️ Note:__
   * - {@link resetOdometer} will internally perform a {@link getCurrentPosition} in order the record to exact location *where* odometer was set.
   * - {@link resetOdometer} is the same as {@link setOdometer|`.setOdometer(0)`}
   */
  resetOdometer(): Promise<number>;

  /**
   * <!-- doc-id: BackgroundGeolocation.setOdometer -->
   * Initialize the `odometer` to *any* arbitrary value.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.setOdometer(1234.56).then((location) => {
   *   // This is the location where odometer was set at.
   *   console.log("[setOdometer] success: ", location);
   * });
   * ```
   *
   * __⚠️ Note:__
   * - {@link setOdometer} will internally perform a {@link getCurrentPosition} in order to record the exact location *where* odometer was set.
   */
  setOdometer(value: number): Promise<number>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getOdometer -->
   * Retrieve the current distance-traveled ("odometer").
   *
   * The plugin constantly tracks distance traveled, computing the distance between the current location and last and maintaining the sum.  To fetch the
   * current **odometer** reading:
   *
   * @example
   * ```typescript
   * let odometer = await BackgroundGeolocation.getOdometer();
   * ```
   *
   * __ℹ️ See also:__
   *  - {@link LocationFilter.odometerAccuracyThreshold}.
   *  - {@link resetOdometer} / {@link setOdometer}.
   *
   * __⚠️ Warning:__
   * - Odometer calculations are dependent upon the accuracy of received locations.  If location accuracy is poor, this will necessarily introduce error into odometer calculations.
   */  
  getOdometer(): Promise<number>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getProviderState -->
   * Retrieves the current state of location-provider authorization.
   *
   * __ℹ️ See also:__
   * - You can also *listen* for changes in location-authorization using the event {@link onProviderChange}.
   *
   * @example
   * ```typescript
   * let providerState = await BackgroundGeolocation.getProviderState();
   * console.log("- Provider state: ", providerState);
   * ```
   */
  getProviderState(): Promise<ProviderChangeEvent>;

  /**
   * <!-- doc-id: BackgroundGeolocation.requestPermission -->
   * Manually request location permission from the user with the configured {@link GeoConfig.locationAuthorizationRequest}.
   *
   * The method will resolve successful if *either* __`WhenInUse`__ or __`Always`__ is authorized, regardless of {@link GeoConfig.locationAuthorizationRequest}.  Otherwise an error will be returned (eg: user denies location permission).
   *
   * If the user has already provided authorization for location-services, the method will resolve successfully immediately.
   *
   * If iOS has *already* presented the location authorization dialog and the user has not currently authorized your desired {@link GeoConfig.locationAuthorizationRequest}, the SDK will present an error dialog offering to direct the user to your app's Settings screen.
   * - To disable this behaviour, see {@link GeoConfig.disableLocationAuthorizationAlert}.
   * - To customize the text on this dialog, see {@link GeoConfig.locationAuthorizationAlert}.
   *
   * __⚠️ Note:__
   * - The SDK will **already request permission** from the user when you execute {@link start}, {@link startGeofences}, {@link getCurrentPosition}, etc.  You **do not need to explicitly execute this method** with typical use-cases.
   *
   * @example
   * ```typescript
   * async componentDidMount() {
   *   // Listen to onProviderChange to be notified when location authorization changes occur.
   *   BackgroundGeolocation.onProviderChange((event) => {
   *     console.log('[providerchange]', event);
   *   });
   *
   *   // First ready the plugin with your configuration.
   *   let state = await BackgroundGeolocation.ready({
   *     locationAuthorizationRequest: 'Always'
   *   });
   *
   *   // Manually request permission with configured locationAuthorizationRequest.
   *   try {
   *     int status = await BackgroundGeolocation.requestPermission();
   *     console.log('[requestPermission] success: ', status);
   *   } catch(status) {
   *     console.warn('[requestPermission] FAILURE: ', status);
   *   }
   * }
   * ```
   *
   * __ℹ️ See also:__
   * - {@link GeoConfig.locationAuthorizationRequest}
   * - {@link GeoConfig.disableLocationAuthorizationAlert}
   * - {@link GeoConfig.locationAuthorizationAlert}
   * - {@link AppConfig.backgroundPermissionRationale} (**Android+*)
   * - {@link requestTemporaryFullAccuracy} (*iOS 14+*)
   */
  requestPermission(): Promise<AuthorizationStatus>;

  /**
   * <!-- doc-id: BackgroundGeolocation.requestTemporaryFullAccuracy -->
   * __`[iOS 14+]`__ iOS 14 has introduced a new __`[Precise: On]`__ switch on the location authorization dialog allowing users to disable high-accuracy location.
   *
   * The method [`requestTemporaryFullAccuracy` (Apple docs)](https://developer.apple.com/documentation/corelocation/cllocationmanager/3600217-requesttemporaryfullaccuracyauth?language=objc) will allow you to present a dialog to the user requesting temporary *full accuracy* for the lifetime of this application run (until terminate).
   *
   * ![](https://dl.dropbox.com/s/dj93xpg51vspqk0/ios-14-precise-on.png?dl=1)
   *
   * __Configuration &mdash; `Info.plist`__
   *
   * In order to use this method, you must configure your __`Info.plist`__ with the `Dictionary` key:
   * __`Privacy - Location Temporary Usage Description Dictionary`__
   *
   * ![](https://dl.dropbox.com/s/52f5lnjc4d9g8w7/ios-14-Privacy-Location-Temporary-Usage-Description-Dictionary.png?dl=1)
   *
   * The keys of this `Dictionary` (eg: `Delivery`) are supplied as the first argument to the method.  The `value` will be printed on the dialog shown to the user, explaing the purpose of your request for full accuracy.
   *
   * If the dialog fails to be presented, an error will be thrown:
   * - The Info.plist file doesn’t have an entry for the given purposeKey value.
   * - The app is already authorized for full accuracy.
   * - The app is in the background.
   *
   * ![](https://dl.dropbox.com/s/8cc0sniv3pvpetl/ios-14-requestTemporaryFullAccuracy.png?dl=1)
   *
   * __Note:__ Android and older versions of iOS `< 14` will return {@link AccuracyAuthorization.Full}.
   *
   * @example
   *
   * ```javascript
   * BackgroundGeolocation.onProviderChange((event) => {
   *   if (event.accuracyAuthorization == BackgroundGeolocation.ACCURACY_AUTHORIZATION_REDUCED) {
   *     // Supply "Purpose" key from Info.plist as 1st argument.
   *     BackgroundGeolocation.requestTemporaryFullAccuracy("Delivery").then((accuracyAuthorization) => {
   *       if (accuracyAuthorization == BackgroundGeolocation.ACCURACY_AUTHORIZATION_FULL) {
   *         console.log('[requestTemporaryFullAccuracy] GRANTED: ', accuracyAuthorization);
   *       } else {
   *         console.log('[requestTemporaryFullAccuracy] DENIED: ', accuracyAuthorization);
   *       }
   *     }).catch((error) => {
   *       console.warn("[requestTemporaryFullAccuracy] FAILED TO SHOW DIALOG: ", error);
   *     });
   *   }
   * });
   * ```
   *
   * __See also:__
   * - {@link ProviderChangeEvent.accuracyAuthorization}.
   * - [What's new in iOS 14 `CoreLocation`](https://levelup.gitconnected.com/whats-new-with-corelocation-in-ios-14-bd28421c95c4)
   *
   */
  requestTemporaryFullAccuracy(purposeKey: string): Promise<AccuracyAuthorization>;
  
  /// ------------------------------------------------------------------------------------------------
  /// Geofencing API
  /// ------------------------------------------------------------------------------------------------

  /**
   * <!-- doc-id: BackgroundGeolocation.addGeofence -->
   * Adds a {@link Geofence} to be monitored by the native Geofencing API.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.addGeofence({
   *   identifier: "Home",
   *   radius: 150,
   *   latitude: 45.51921926,
   *   longitude: -73.61678581,
   *   notifyOnEntry: true,
   *   notifyOnExit: false,
   *   notifyOnDwell: true,
   *   loiteringDelay: 30000,  // 30 seconds
   *   extras: {               // Optional arbitrary meta-data
   *     zone_id: 1234
   *   }
   * }).then((success) => {
   *   console.log("[addGeofence] success");
   * }).catch((error) => {
   *   console.log("[addGeofence] FAILURE: ", error);
   * });
   * ```
   *
   * __ℹ️ Note:__
   * - If a geofence(s) *already* exists with the configured {@link Geofence.identifier}, the previous one(s) will be **deleted** before the new one is inserted.
   * - When adding *multiple*, it's about **10 times faster** to use {@link addGeofences} instead.
   * - 📘 {@link Geofence | Geofencing Guide}
   */
  addGeofence(geofence: Geofence): Promise<boolean>;

  /**
   * <!-- doc-id: BackgroundGeolocation.addGeofences -->
   * Adds a list of {@link Geofence} to be monitored by the native Geofencing API.
   *
   * @example
   * ```typescript
   * let geofences = [{
   *   identifier: "foo",
   *   radius: 200,
   *   latitude: 45.51921926,
   *   longitude: -73.61678581,
   *   notifyOnEntry: true
   * },
   *   identifier: "bar",
   *   radius: 200,
   *   latitude: 45.51921926,
   *   longitude: -73.61678581,
   *   notifyOnEntry: true
   * }];
   *
   * BackgroundGeolocation.addGeofences(geofences);
   * ```
   *
   * __ℹ️ Note:__
   * - If a geofence(s) *already* exists with the configured {@link Geofence.identifier}, the previous one(s) will be **deleted** before the new one is inserted.
   * - 📘 {@link Geofence | Geofencing Guide}
   * - {@link addGeofence}
   *
   */
  addGeofences(geofences: Geofence[]): Promise<boolean>;

  /**
   * <!-- doc-id: BackgroundGeolocation.removeGeofence -->
   * Removes a {@link Geofence} having the given {@link Geofence.identifier}.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.removeGeofence("Home").then((success) => {
   *   console.log("[removeGeofence] success");
   * }).catch((error) => {
   *   console.log("[removeGeofence] FAILURE: ", error);
   * });
   * ```
   *
   * __ℹ️ See also:__
   * - 📘 {@link Geofence | Geofencing Guide}
   */
  removeGeofence(identifier: string): Promise<boolean>;

  /**
   * <!-- doc-id: BackgroundGeolocation.removeGeofences -->
   * Destroy all {@link Geofence}
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.removeGeofences();
   * ```
   *
   * __ℹ️ See also:__
   * - 📘 {@link Geofence | Geofencing Guide}
   */
  removeGeofences(identifiers?: string[]): Promise<boolean>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getGeofences -->
   * Fetch a list of all {@link Geofence} in the SDK's database.  If there are no geofences being monitored, you'll receive an empty `Array`.
   *
   * @example
   * ```typescript
   * let geofences = await BackgroundGeolocation.getGeofences();
   * console.log("[getGeofences: ", geofences);
   * ```
   * __ℹ️ See also:__
   * - 📘 {@link Geofence | Geofencing Guide}
   */
  getGeofences(): Promise<Geofence[]>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getGeofence -->
   * Fetch a single {@link Geofence} by identifier from the SDK's database.
   *
   * @example
   * ```typescript
   * let geofence = await BackgroundGeolocation.getGeofence("HOME");
   * console.log("[getGeofence] ", geofence);
   * ```
   *
   * __ℹ️ See also:__
   * - 📘 {@link Geofence | Geofencing Guide}
   */
  getGeofence(identifier: string): Promise<Geofence>;

  /**
   * <!-- doc-id: BackgroundGeolocation.geofenceExists -->
   * Determine if a particular geofence exists in the SDK's database.
   *
   * @example
   * ```typescript
   * let exists = await BackgroundGeolocation.geofenceExists("HOME");
   * console.log("[geofenceExists] ", exists);
   * ```
   * __ℹ️ See also:__
   * - 📘 {@link Geofence | Geofencing Guide}
   */
  geofenceExists(identifier: string): Promise<boolean>;


  /// ------------------------------------------------------------------------------------------------
  /// Scheduling API
  /// ------------------------------------------------------------------------------------------------

  /**
   * <!-- doc-id: BackgroundGeolocation.startSchedule -->
   * Initiate the configured {@link AppConfig.schedule}.
   *
   * If a {@link AppConfig.schedule} was configured, this method will initiate that schedule.  The plugin will automatically be started or stopped according to
   * the configured {@link AppConfig.schedule}.
   *
   * To halt scheduled tracking, use {@link stopSchedule}.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.startSchedule.then((state) => {
   *   console.log("[startSchedule] success: ", state);
   * })
   * ```
   * __ℹ️ See also:__
   *  
   * - {@link AppConfig.schedule}
   * - {@link startSchedule}
   */
  startSchedule(): Promise<void>;

  /**
   * <!-- doc-id: BackgroundGeolocation.stopSchedule -->
   * Halt scheduled tracking.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.stopSchedule.then((state) => {
   *   console.log("[stopSchedule] success: ", state);
   * })
   * ```
   *
   * ⚠️ {@link stopSchedule} will **not** execute {@link stop} if the plugin is currently tracking.  You must explicitly execute {@link stop}.
   *
   * @example
   * ```typescript
   * // Later when you want to stop the Scheduler (eg: user logout)
   * await BackgroundGeolocation.stopSchedule().then((state) => {
   *   if (state.enabled) {
   *     BackgroundGeolocation.stop();
   *   }
   * })
   * ```
   * __ℹ️ See also:__
   * - {@link startSchedule}
   */
  stopSchedule(): Promise<void>;

  /// ------------------------------------------------------------------------------------------------
  /// Logger API
  /// ------------------------------------------------------------------------------------------------

  /**
   * <!-- doc-id: BackgroundGeolocation.setLogLevel -->
   * Sets the {@link LoggerConfig.logLevel}.
   */
  setLogLevel(level: LogLevel): Promise<void>;

  setLogPersist(mode: PersistMode): Promise<void>;

  /// ------------------------------------------------------------------------------------------------
  /// Device API
  /// ------------------------------------------------------------------------------------------------

  /**
   * <!-- doc-id: BackgroundGeolocation.getDeviceInfo -->
   * Returns the device information.
   * @example
   * ```typescript
   * const deviceInfo = await BackgroundGeolocation.getDeviceInfo();
   * console.log(deviceInfo);
   * ```
   */
  getDeviceInfo(): Promise<DeviceInfo>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getSensors -->
   * Returns the presence of device sensors *accelerometer*, *gyroscope*, *magnetometer*
   *
   * These core {@link Sensors} are used by the motion activity-recognition system -- when any of these sensors are missing from a device (particularly on cheap
   * Android devices), the performance of the motion activity-recognition system will be **severely** degraded and highly inaccurate.
   *
   * @example
   * ```typescript
   * let sensors = await BackgroundGeolocation.sensors;
   * console.log(sensors);
   * ```
   */
  getSensors(): Promise<Sensors>;
   
  /**
   * <!-- doc-id: BackgroundGeolocation.isPowerSaveMode -->
   * Fetches the state of the operating-system's "Power Saving" mode.
   *
   * Power Saving mode can throttle certain services in the background, such as HTTP requests or GPS.
   *
   * ℹ️ You can listen to changes in the state of "Power Saving" mode from the event {@link onPowerSaveChange}.
   *
   * __iOS__
   *
   * iOS Power Saving mode can be engaged manually by the user in **Settings -> Battery** or from an automatic OS dialog.
   *
   * ![](https://dl.dropboxusercontent.com/s/lz3zl2jg4nzstg3/Screenshot%202017-09-19%2010.34.21.png?dl=1)
   *
   * __Android__
   *
   * Android Power Saving mode can be engaged manually by the user in **Settings -> Battery -> Battery Saver** or automatically with a user-specified
   * "threshold" (eg: 15%).
   *
   * ![](https://dl.dropboxusercontent.com/s/raz8lagrqayowia/Screenshot%202017-09-19%2010.33.49.png?dl=1)
   *
   * @example
   * ```typescript
   * let isPowerSaveMode = await BackgroundGeolocation.isPowerSaveMode;
   * ```
   */
  isPowerSaveMode(): Promise<boolean>;

  /// ------------------------------------------------------------------------------------------------
  /// Persistence API
  /// ------------------------------------------------------------------------------------------------

  /**
   * <!-- doc-id: BackgroundGeolocation.destroyLocations -->
   * Remove all records in SDK's SQLite database.
   *
   * @example
   * ```typescript
   * let success = await BackgroundGeolocation.destroyLocations();
   * ```
   */
  destroyLocations(): Promise<void>;

  /**
   * <!-- doc-id: BackgroundGeolocation.destroyLocation -->
   * Destroy a single location by {@link Location.uuid}
   *
   * @example
   * ```typescript
   * await BackgroundGeolocation.destroyLocation(location.uuid);
   * ```
   */
  destroyLocation(uuid: string): Promise<void>;

  /**
   * @hidden
   * Users can simply call {@link getCurrentPosition} to insert locations on-demand.
   */
  insertLocation(location: Location): Promise<Location>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getLocations -->
   * Retrieve a List of {@link Location} currently stored in the SDK's SQLite database.
   *
   * @example
   * ```typescript
   * let locations = await BackgroundGeolocation.getLocations();
   * ```
   */
  getLocations(): Promise<Array<Object>>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getCount -->
   * Retrieve the count of all locations current stored in the SDK's SQLite database.
   *
   * @example
   * ```typescript
   * let count = await BackgroundGeolocation.getCount();
   * ```
   */
  getCount(): Promise<number>;

  /// ------------------------------------------------------------------------------------------------
  /// HTTP API
  /// ------------------------------------------------------------------------------------------------

  /**
   * <!-- doc-id: BackgroundGeolocation.sync -->
   * Manually execute upload to configured {@link HttpConfig.url} of all {@link Location} records currently stored in the SDK's SQLite database.
   *
   * If the plugin is configured for HTTP with an {@link HttpConfig.url} and {@link HttpConfig.autoSync} `false`, the {@link sync} method will initiate POSTing the locations
   * currently stored in the native SQLite database to your configured {@link HttpConfig.url}.  When your HTTP server returns a response of `200 OK`, that record(s)
   * in the database will be DELETED.
   *
   * If you configured {@link HttpConfig.batchSync} `true`, all the locations will be sent to your server in a single HTTP POST request, otherwise the plugin will
   * execute an HTTP post for **each** {@link Location} in the database (REST-style).  Your callback will be executed and provided with a `List` of all the
   * locations from the SQLite database.  If you configured the plugin for HTTP (by configuring a {@link HttpConfig.url}), your callback will be executed after all
   * the HTTP request(s) have completed.  If the plugin failed to sync to your server (possibly because of no network connection), the failure callback will
   * be called with an error message.  If you are **not** using the HTTP features, {@link sync} will delete all records from its SQLite database.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.sync((records) => {
   *   console.log("[sync] success: ", records);
   * }).catch((error) => {
   *   console.log("[sync] FAILURE: ", error);
   * });
   *
   * ```
   *  ℹ️ For more information, see the {@link HttpConfig | HTTP Guide}
   */
  sync(): Promise<Array<Object>>;

  /// ------------------------------------------------------------------------------------------------
  /// BackgroundTask API
  /// ------------------------------------------------------------------------------------------------

  /**
   * <!-- doc-id: BackgroundGeolocation.startBackgroundTask -->
   * Sends a signal to OS that you wish to perform a long-running task.
   *
   * The OS will keep your running in the background and not suspend it until you signal completion with the {@link stopBackgroundTask} method.  Your callback will be provided with a single parameter `taskId`
   * which you will send to the {@link stopBackgroundTask} method.
   *
   * @example
   * ```typescript
   * onLocation(location) {
   *   console.log("[location] ", location);
   *
   *   // Perform some long-running task (eg: HTTP request)
   *   BackgroundGeolocation.startBackgroundTask().then((taskId) => {
   *     performLongRunningTask.then(() => {
   *       // When your long-running task is complete, signal completion of taskId.
   *       BackgroundGeolocation.stopBackgroundTask(taskId);
   *     }).catch(error) => {
   *       // Be sure to catch errors:  never leave you background-task hanging.
   *       console.error(error);
   *       BackgroundGeolocation.stopBackgroundTask();
   *     });
   *   });
   * }
   * ```
   *
   * __iOS:__
   * The iOS implementation uses [beginBackgroundTaskWithExpirationHandler](https://developer.apple.com/documentation/uikit/uiapplication/1623031-beginbackgroundtaskwithexpiratio)
   *
   * ⚠️ iOS provides **exactly** 180s of background-running time.  If your long-running task exceeds this time, the plugin has a fail-safe which will
   * automatically {@link stopBackgroundTask} your **`taskId`** to prevent the OS from force-killing your application.
   *
   * Logging of iOS background tasks looks like this:
   * ```
   * ✅-[BackgroundTaskManager createBackgroundTask] 1
   * .
   * .
   * .
   *
   * ✅-[BackgroundTaskManager stopBackgroundTask:]_block_invoke 1 OF (
   *     1
   * )
   * ```
   * __Android:__
   *
   * The Android implementation launches a [`WorkManager`](https://developer.android.com/topic/libraries/architecture/workmanager) task.
   *
   * ⚠️ The Android plugin imposes a limit of **3 minutes** for your background-task before it automatically `FORCE KILL`s it.
   *
   *
   * Logging for Android background-tasks looks like this (when you see an hourglass ⏳ icon, a foreground-service is active)
   * ```
   *  I TSLocationManager: [c.t.l.u.BackgroundTaskManager onStartJob] ⏳ startBackgroundTask: 6
   *  .
   *  .
   *  .
   *  I TSLocationManager: [c.t.l.u.BackgroundTaskManager$Task stop] ⏳ stopBackgroundTask: 6
   * ```
   */
  startBackgroundTask(): Promise<number>;

  /**
   * <!-- doc-id: BackgroundGeolocation.stopBackgroundTask -->
   * Signal completion of {@link startBackgroundTask}
   *
   * Sends a signal to the native OS that your long-running task, addressed by `taskId` provided by {@link startBackgroundTask} is complete and the OS may proceed
   * to suspend your application if applicable.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.startBackgroundTask().then((taskId) => {
   *   // Perform some long-running task (eg: HTTP request)
   *   performLongRunningTask.then(() => {
   *     // When your long-running task is complete, signal completion of taskId.
   *     BackgroundGeolocation.stopBackgroundTask(taskId);
   *   });
   * });
   * ```
   */
  stopBackgroundTask(taskId: number): Promise<void>;

  /**
   * @private
   * @hidden
   * __[Android-only]__ Signals completion of an Android headless-task (see {@link AppConfig.enableHeadless})
   */
  finishHeadlessTask(taskId: string): Promise<number>;

  // ------------------------------------------------------------------------------------------------
  // TransistorAuthorizationService API
  // ------------------------------------------------------------------------------------------------

  /**
   * <!-- doc-id: BackgroundGeolocation.findOrCreateTransistorAuthorizationToken -->
   * Find or create a Transistor authorization token.
   * 
   * See {@link TransistorAuthorizationService} for more information.
   */
  findOrCreateTransistorAuthorizationToken(orgname:string, username:string, url?:string): Promise<TransistorAuthorizationToken>;

  /**
   * <!-- doc-id: BackgroundGeolocation.destroyTransistorAuthorizationToken -->
   * Destroy a Transistor authorization token.
   *
   * See {@link TransistorAuthorizationService} for more information.
   */
  destroyTransistorAuthorizationToken(url:string): Promise<void>;

  /**
   * <!-- doc-id: BackgroundGeolocation.playSound -->
   * Play a system sound.
   *
   * - **iOS**: provide a numeric SystemSoundID.
   * - **Android**: provide a string sound-name.
   */
  playSound(soundId: number | string): void;
}

/** 
 * <!-- doc-id: BackgroundGeolocation -->
 * Primary BackgroundGeolocation API
 *
 * __Overview__
 *
 * The `BackgroundGeolocation` interface defines the **complete, strongly-typed API surface**
 * for Transistor Software’s Background Geolocation SDK.  
 * This is the main entry-point used by all JavaScript adapters:
 *
 * - React Native (`{{pluginName}}`)
 * - Capacitor
 * - Cordova
 *
 * The API provides:
 *
 * - **Configuration** via a single {@link Config} object composed of modular
 *   sub-configs (`GeoConfig`, `HttpConfig`, `PersistenceConfig`, etc)
 * - **Lifecycle control** (`ready`, `start`, `stop`, `setConfig`, `reset`)
 * - **Location tracking** (motion-based tracking, `getCurrentPosition`,
 *   `watchPosition`)
 * - **Geofencing** (`addGeofence`, `onGeofence`, etc)
 * - **Events subsystem** with fully-typed callbacks (`onLocation`,
 *   `onMotionChange`, `onHttp`, `onProviderChange`, etc)
 * - **Native services** such as background-tasks, authorization workflows,
 *   scheduling, and device-capability checks
 * - **Persistence + HTTP** via an internal SQLite buffer and optional
 *   auto-upload system
 *
 * __Typed Configuration (Compound Config)__
 *
 * Instead of a large “flat” configuration object, the SDK uses a
 * *compound-configuration model*:
 *
 * @example Compound Configuration
 * ```ts
 * import BackgroundGeolocation, {
 *   Config,
 *   GeoConfig,
 *   HttpConfig
 * } from "{{pluginName}}";
 *
 * const config: Config = {
 *   geolocation: {
 *     desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
 *     distanceFilter: 20
 *   },
 *   http: {
 *     url: "https://example.com/locations",
 *     autoSync: true
 *   },
 *   persistence: {
 *     maxDaysToPersist: 7
 *   }
 * };
 *
 * BackgroundGeolocation.ready(config);
 * ```
 *
 * This structure ensures:
 *
 * - **Clear separation of concerns**
 * - **Type-safe configuration**
 * - **Automatic backwards-compatibility** with legacy flat keys
 *
 * __Typed Enum Namespaces__
 *
 * All configuration flags that were previously “magic constants”  
 * (e.g., `LOG_LEVEL_VERBOSE`, `DESIRED_ACCURACY_HIGH`) now live in  
 * strongly-typed namespaces attached to the default export:
 *
 * - {@link BackgroundGeolocation.LogLevel}
 * - {@link BackgroundGeolocation.DesiredAccuracy}
 * - {@link BackgroundGeolocation.PersistMode}
 * - {@link BackgroundGeolocation.NotificationPriority}
 * - {@link BackgroundGeolocation.Event}
 * - …and more
 *
 * These can also be imported individually:
 *  
 * @example
 * ```ts
 * import BackgroundGeolocation, { LogLevel } from "{{pluginName}}";
 *
 * BackgroundGeolocation.ready({
 *   logger: {
 *     logLevel: LogLevel.Debug
 *   }
 * });
 * ```
 *
 * __Event System__
 *
 * The SDK exposes a robust, typed event API:
 *  
 * @example Event Listeners
 * ```ts
 * BackgroundGeolocation.onLocation((location) => {
 *   console.log("New location:", location);
 * });
 *
 * BackgroundGeolocation.onMotionChange((event) => {
 *   console.log("Device is moving?", event.isMoving);
 * });
 * ```
 *
 * All events return **Subscription** objects which must be removed when no longer
 * needed:
 *
 * @example Removing Event Listeners
 * ```ts
 * const sub = BackgroundGeolocation.onHttp((e) => { ... });
 * sub.remove();
 * ```
 *
 * __Native Lifecycle Requirements__
 *
 * On both iOS and Android, `BackgroundGeolocation.ready(config)` must be called
 * **exactly once per app launch**, before calling `start()`.  
 * The SDK automatically restores its last-known configuration from persistent
 * storage after first install.
 *
 * __Philosophy of Operation__
 *
 * Transistorsoft’s tracking engine is built around:
 *
 * - **Motion-based state transitions** (stationary ↔ moving)
 * - **Aggressive tracking only when moving**
 * - **Energy-efficient passive monitoring when stationary**
 * - **Reliable persistence via SQLite**
 * - **Automatic retries + batching** for HTTP uploads
 *
 * Combined, this enables *battery-efficient*, *high-quality* background tracking
 * across iOS and Android.
 *
 * __Capabilities__
 *
 * - High-frequency tracking while the device is moving
 * - Zero-movement battery preservation
 * - Geofence monitoring at scale (thousands of geofences)
 * - Offline storage + sync when network is restored
 * - Background tasks for long-running operations
 * - Authorization state + system diagnostics 
 *  
 * @example Getting Started
 * ```ts
 * import BackgroundGeolocation from "{{pluginName}}";
 *
 * const state = await BackgroundGeolocation.ready({
 *   geolocation: { distanceFilter: 10 },
 *   http: { url: "https://example.com/locations", autoSync: true }
 * });
 *
 * if (!state.enabled) {
 *   await BackgroundGeolocation.start();
 * }
 * ```
 *
 * Once `start()` is called, the SDK begins operating according to your
 * configuration and continues running—even in the background—until you call
 * `stop()`.
 *
 * @category Primary API
 */
export interface BackgroundGeolocation extends BackgroundGeolocationAPI {
  /**
   * <!-- doc-id: BackgroundGeolocation.LogLevel -->
   * __LogLevel__
   * Controls verbosity of the SDK logger.  
   * Used by LoggerConfig.logLevel.  
   * Values range from silent (`Off`) to extremely verbose (`Verbose`).
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   logger: { 
   *     logLevel: BackgroundGeolocation.LogLevel.Verbose
   *   }
   * });
   * ```
   * @readonly
   */
  LogLevel: typeof import('../../enums/LogLevel').LogLevel;

  /**
   * <!-- doc-id: BackgroundGeolocation.DesiredAccuracy -->
   * __DesiredAccuracy__
   * Controls the native location engine’s target accuracy.  
   * Higher accuracy consumes more battery.  
   * Used by GeoConfig.desiredAccuracy.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High
   *   }
   * });
   * ```
   * @readonly
   */
  DesiredAccuracy: typeof import('../../enums/DesiredAccuracy').DesiredAccuracy;

  /**
   * <!-- doc-id: BackgroundGeolocation.PersistMode -->
   * __PersistMode__
   * Controls which records the SDK persists to SQLite:  
   * locations only, geofences only, both, or none.  
   * Used by PersistenceConfig.persistMode.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   persistence: {
   *     persistMode: BackgroundGeolocation.PersistMode.All
   *   }
   * });
   * ```
   * @readonly
   */
  PersistMode: typeof import('../../enums/PersistMode').PersistMode;

  /**
   * <!-- doc-id: BackgroundGeolocation.AuthorizationStrategy -->
   * __AuthorizationStrategy__
   * Defines how the HTTP service performs authorization.  
   * Includes basic, JWT, and custom strategies.  
   * Used by AuthorizationConfig.strategy.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   authorization: {
   *     strategy: BackgroundGeolocation.AuthorizationStrategy.Jwt
   *   }
   * });
   * ```
   * @readonly
   */
  AuthorizationStrategy: typeof import('../../enums/AuthorizationStrategy').AuthorizationStrategy;

  /**
   * <!-- doc-id: BackgroundGeolocation.LocationFilterPolicy -->
   * __LocationFilterPolicy__
   * Selects the filtering engine policy for noise-reduction and smoothing.  
   * Used by GeoConfig.locationFilter.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     filter: {
   *       policy: BackgroundGeolocation.LocationFilterPolicy.Adjust
   *     }
   * });
   * ```
   * @readonly
   */
  LocationFilterPolicy: typeof import('../../enums/LocationFilterPolicy').LocationFilterPolicy;

  /**
   * <!-- doc-id: BackgroundGeolocation.KalmanProfile -->
   * __KalmanProfile__
   * Selects a preset tuning profile for the Kalman filter used in the
   * filtering engine (aggressive, moderate, or relaxed smoothing).
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     kalmanProfile: BackgroundGeolocation.KalmanProfile.Aggressive
   *   }
   * });
   * ```
   * @readonly
   */
  KalmanProfile: typeof import('../../enums/KalmanProfile').KalmanProfile;

  /**
   * <!-- doc-id: BackgroundGeolocation.HttpMethod -->
   * __HttpMethod__
   * Defines the HTTP method used for uploads (POST, PUT, etc).  
   * Used by HttpConfig.method.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   http: {
   *     method: BackgroundGeolocation.HttpMethod.Post
   *   }
   * });
   * ```
   * @readonly
   */
  HttpMethod: typeof import('../../enums/HttpMethod').HttpMethod;

  /**
   * <!-- doc-id: BackgroundGeolocation.TriggerActivity -->
   * __TriggerActivity__
   * Defines which physical motion activities can trigger motion-detection
   * transitions (still → moving).  
   * Used by ActivityConfig.triggerActivities.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   activity: {
   *     triggerActivities: [
   *       BackgroundGeolocation.TriggerActivity.InVehicle
   *     ]
   *   }
   * });
   * ```
   * @readonly
   */
  TriggerActivity: typeof import('../../enums/TriggerActivity').TriggerActivity;

  /**
   * <!-- doc-id: BackgroundGeolocation.NotificationPriority -->
   * __NotificationPriority__  
   * Controls Android foreground-service notification priority and icon
   * placement (top, bottom, hidden).  
   * Used by NotificationConfig.priority.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   notification: {
   *     priority: BackgroundGeolocation.NotificationPriority.High
   *   }
   * });
   * ```
   * @readonly
   */
  NotificationPriority: typeof import('../../enums/NotificationPriority').NotificationPriority;

  /**
   * <!-- doc-id: BackgroundGeolocation.Event -->
   * __Event__
   * Enumerates all event names emitted by the SDK (location, geofence,
   * motionchange, heartbeat, etc).  
   * 
   * @readonly
   */
  Event: typeof import('../../enums/Event').Event;

  /**
   * <!-- doc-id: BackgroundGeolocation.LocationRequest -->
   * __LocationRequest__
   * Defines the type of permission request made to iOS (Always, WhenInUse,
   * or Any).  
   * Used by GeoConfig.locationAuthorizationRequest.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     locationAuthorizationRequest: BackgroundGeolocation.LocationRequest.Always
   *   }
   * });
   * ```
   * @readonly
   */
  LocationRequest: typeof import('../../enums/LocationRequest').LocationRequest;

  /**
   * <!-- doc-id: BackgroundGeolocation.AccuracyAuthorization -->
   * __AccuracyAuthorization__  
   * iOS 14+: Indicates whether the user granted full or reduced accuracy.  
   * Used by ProviderChangeEvent.accuracyAuthorization and
   * requestTemporaryFullAccuracy.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.onProviderChange((event) => {
   *   if (event.accuracyAuthorization ===
   *       BackgroundGeolocation.AccuracyAuthorization.Reduced) {
   *     // Handle reduced-accuracy case
   *   }
   * });
   * ```
   * @readonly
   */
  AccuracyAuthorization: typeof import('../../enums/AccuracyAuthorization').AccuracyAuthorization;

  /**
   * <!-- doc-id: BackgroundGeolocation.AuthorizationStatus -->
   * __AuthorizationStatus__  
   * Represents OS-level authorization state for location-services  
   * (Denied, Restricted, Always, WhenInUse).  
   * Returned from requestPermission() and onProviderChange.
   *
   * @example
   * ```ts
   * const status = await BackgroundGeolocation.requestPermission();
   * if (status === BackgroundGeolocation.AuthorizationStatus.Always) {
   *   // Good to start tracking
   * }
   * ```
   * @readonly
   */
  AuthorizationStatus: typeof import('../../enums/AuthorizationStatus').AuthorizationStatus;

  /**
   * <!-- doc-id: BackgroundGeolocation.ActivityType -->
   * __ActivityType__  
   * iOS-only: Specifies the type of user activity (AutomotiveNavigation,
   * Fitness, OtherNavigation, etc).  
   * Used by {@link GeoConfig.activityType}.
   */
  ActivityType: typeof import('../../enums/ActivityType').ActivityType;
}


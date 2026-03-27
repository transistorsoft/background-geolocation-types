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
   * Every location recorded by the SDK is delivered to your callback, including
   * locations from {@link onMotionChange}, {@link getCurrentPosition}, and
   * {@link watchPosition}.
   *
   * ### Error Codes
   *
   * If the native location API fails, the error callback receives a
   * {@link LocationError} code.
   *
   * ### Note
   *
   * During {@link onMotionChange} and {@link getCurrentPosition}, the SDK
   * requests multiple location samples to find the most accurate fix. These
   * intermediate samples are **not** persisted, but are delivered to this
   * callback with {@link Location.sample} set to `true`. Filter out sample
   * locations before manually posting to your server.
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
   * @event location
   */
  onLocation(cb: (location: Location) => void, onError?: (err: LocationError) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onMotionChange -->
   * Subscribe to motion-change events.
   *
   * Fires each time the device transitions between the **moving** and
   * **stationary** states.
   *
   * ### ⚠️ Warning
   *
   * When a motion-change event fires, {@link HttpConfig.autoSyncThreshold} is
   * ignored — all queued locations are uploaded immediately. The SDK flushes
   * eagerly before going dormant (moving→stationary) and immediately after
   * waking up (stationary→moving).
   *
   * **See also**
   * - {@link GeoConfig.stopTimeout}
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onMotionChange((event: MotionChangeEvent) => {
   *   if (event.isMoving) {
   *     console.log("[onMotionChange] Device has just started MOVING ", event.location);
   *   } else {
   *     console.log("[onMotionChange] Device has just STOPPED: ", event.location);
   *   }
   * });
   * ```
   *
   * @event motionchange
   */
  onMotionChange(cb: (event: MotionChangeEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onGeofence -->
   * Subscribe to geofence transition events.
   *
   * Fires when any monitored geofence crossing occurs.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onGeofence((event) => {
   *   console.log("[onGeofence] ", event);
   * });
   * ```
   *
   * @event geofence
   */
  onGeofence(cb: (event: GeofenceEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onGeofencesChange -->
   * Subscribe to changes in the set of actively monitored geofences.
   *
   * Fires when the SDK's active geofence set changes. The SDK can monitor any
   * number of geofences in its database — even thousands — despite native
   * platform limits (20 for iOS; 100 for Android). It achieves this with a
   * [geospatial query](https://en.wikipedia.org/wiki/Spatial_query) that
   * activates only the geofences nearest to the device's current location (see
   * {@link GeoConfig.geofenceProximityRadius}). When the device is moving, the
   * query runs periodically and the active set may change — that change triggers
   * this event.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onGeofencesChange((event) => {
   *   const on = event.on;   // newly activated geofences
   *   const off = event.off; // deactivated geofence identifiers
   *
   *   // Create map circles
   *   on.forEach((geofence) => {
   *     createGeofenceMarker(geofence);
   *   });
   *
   *   // Remove map circles
   *   off.forEach((identifier) => {
   *     removeGeofenceMarker(identifier);
   *   });
   * });
   * ```
   *
   * @event geofenceschange
   */
  onGeofencesChange(cb: (event: GeofencesChangeEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onActivityChange -->
   * Subscribe to motion-activity changes.
   *
   * Fires each time the activity-recognition system reports a new activity
   * (`still`, `on_foot`, `in_vehicle`, `on_bicycle`, `running`).
   *
   * #### Android
   *
   * {@link MotionActivityEvent.confidence} always reports `100`.
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onActivityChange((event) => {
   *   console.log("[onActivityChange] ", event);
   * });
   * ```
   *
   * @event activitychange
   */
  onActivityChange(cb: (event: MotionActivityEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onProviderChange -->
   * Subscribe to location-services authorization changes.
   *
   * Fires whenever the state of the device's location-services authorization
   * changes (e.g. GPS enabled, WiFi-only, permission revoked). The SDK also
   * fires this event immediately after {@link ready} completes, so you always
   * receive the current authorization state on each app launch.
   *
   * **See also**
   * - {@link getProviderState}
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onProviderChange((event) => {
   *   console.log("[onProviderChange]: ", event);
   *
   *   switch (event.status) {
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
   * @event providerchange
   */
  onProviderChange(cb: (event: ProviderChangeEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onHeartbeat -->
   * Subscribe to periodic heartbeat events.
   *
   * Fires at each {@link AppConfig.heartbeatInterval} while the device is in
   * the **stationary** state. On iOS, {@link AppConfig.preventSuspend} must
   * also be `true` to receive heartbeats in the background.
   *
   * ### Note
   *
   * The {@link Location} provided by the {@link HeartbeatEvent} is only the
   * last-known location — the heartbeat does not engage location services. To
   * fetch a fresh location inside your callback, call {@link getCurrentPosition}.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.ready({
   *   app: {
   *     heartbeatInterval: 60,
   *     preventSuspend: true  // required for iOS
   *   }
   * });
   *
   * const subscription = BackgroundGeolocation.onHeartbeat((event) => {
   *   console.log("[onHeartbeat] ", event);
   *
   *   // Optionally fetch a fresh location.
   *   BackgroundGeolocation.getCurrentPosition({
   *     samples: 1,
   *     persist: true
   *   }).then((location) => {
   *     console.log("[getCurrentPosition] ", location);
   *   });
   * });
   * ```
   *
   * @event heartbeat
   */
  onHeartbeat(cb: (event: HeartbeatEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onHttp -->
   * Subscribe to HTTP responses from your server {@link HttpConfig.url}.
   *
   * **See also**
   * - {@link HttpConfig | HTTP Guide}
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onHttp((response) => {
   *   const status = response.status;
   *   const success = response.success;
   *   const responseText = response.responseText;
   *   console.log("[onHttp] ", response);
   * });
   * ```
   *
   * @event http
   */
  onHttp(cb: (event: HttpEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onSchedule -->
   * Subscribe to {@link AppConfig.schedule} events.
   *
   * Fires each time a schedule event activates or deactivates tracking.
   * Check `state.enabled` in your callback to determine whether tracking
   * was started or stopped.
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
   *
   * @event schedule
   */
  onSchedule(cb: (state: State) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onConnectivityChange -->
   * Subscribe to network connectivity changes.
   *
   * Fires when the device's network connectivity transitions between connected
   * and disconnected. By default, the SDK also fires this event at
   * {@link start} time with the current connectivity state. When connectivity
   * is restored and the SDK has queued locations, it automatically initiates
   * an upload to {@link HttpConfig.url}.
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onConnectivityChange((event) => {
   *   console.log("[onConnectivityChange] ", event);
   * });
   * ```
   *
   * @event connectivitychange
   */
  onConnectivityChange(cb: (event: ConnectivityChangeEvent) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onPowerSaveChange -->
   * Subscribe to OS power-saving mode changes.
   *
   * Fires when the operating system's power-saving mode is enabled or
   * disabled. Power-saving mode can throttle background services such as GPS
   * and HTTP uploads.
   *
   * **See also**
   * - {@link isPowerSaveMode}
   *
   * #### iOS
   *
   * Power Saving mode is enabled manually in **Settings → Battery** or via an
   * automatic OS prompt.
   *
   * ![](https://dl.dropboxusercontent.com/s/lz3zl2jg4nzstg3/Screenshot%202017-09-19%2010.34.21.png?dl=1)
   *
   * #### Android
   *
   * Battery Saver is enabled manually in **Settings → Battery → Battery Saver**
   * or automatically when the battery drops below a configured threshold.
   *
   * ![](https://dl.dropboxusercontent.com/s/raz8lagrqayowia/Screenshot%202017-09-19%2010.33.49.png?dl=1)
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onPowerSaveChange((isPowerSaveMode) => {
   *   console.log("[onPowerSaveChange]: ", isPowerSaveMode);
   * });
   * ```
   *
   * @event powersavechange
   */
  onPowerSaveChange(cb: (enabled: boolean) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onEnabledChange -->
   * Subscribe to changes in plugin {@link State.enabled}.
   *
   * Fires when {@link State.enabled} changes. Calling {@link start} or
   * {@link stop} triggers this event.
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onEnabledChange((isEnabled) => {
   *   console.log("[onEnabledChange] isEnabled? ", isEnabled);
   * });
   * ```
   *
   * @event enabledchange
   */
  onEnabledChange(cb: (enabled: boolean) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onNotificationAction -->
   * Subscribe to button-click actions on the Android foreground-service
   * notification. [Android only]
   *
   * Fires when the user taps a button defined in a custom
   * {@link NotificationConfig.layout}.
   */
  onNotificationAction(cb: (buttonId: string) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.onAuthorization -->
   * Subscribe to {@link Config.authorization} events.
   *
   * Fires when {@link AuthorizationConfig.refreshUrl} responds, either
   * successfully or not. On success, {@link AuthorizationEvent.success} is
   * `true` and {@link AuthorizationEvent.response} contains the decoded JSON
   * response. On failure, {@link AuthorizationEvent.error} contains the error
   * message.
   *
   * @example
   * ```typescript
   * const subscription = BackgroundGeolocation.onAuthorization((event) => {
   *   if (event.success) {
   *     console.log("[authorization] SUCCESS: ", event.response);
   *   } else {
   *     console.log("[authorization] ERROR: ", event.error);
   *   }
   * });
   * ```
   *
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
   * Remove all event listeners.
   *
   * Calls {@link Subscription.remove} on all active subscriptions.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.removeListeners();
   * ```
   */
  removeListeners(): Promise<void>;

  /**
   * <!-- doc-id: BackgroundGeolocation.registerHeadlessTask -->
   * Registers a headless-task callback for Android background events when the
   * app has been terminated with {@link AppConfig.stopOnTerminate}`:false`.
   * [Android only]
   *
   * The callback receives a {@link HeadlessEvent} with a `name` (event name)
   * and `params` (event data).
   *
   * ### ⚠️ Warning
   *
   * You must call `registerHeadlessTask` in your application root file (e.g.
   * `index.js`), not inside a component or behind a UI action.
   *
   * ### ⚠️ Warning
   *
   * Your function must be declared `async`. Await all work inside it — the
   * headless task is automatically terminated after the last line executes.
   *
   * ### Note
   *
   * Javascript headless callbacks are not supported by Cordova or Capacitor.
   *
   * ### Debugging
   *
   * While implementing your headless task, observe Android logs via:
   *
   * ```bash
   * $ adb logcat *:S TSLocationManager:V ReactNativeJS:V
   * ```
   *
   * **See also**
   * - 📘 [Android Headless Mode](github:wiki/Android-Headless-Mode)
   * - {@link AppConfig.enableHeadless}
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
   *   // Headless-tasks are automatically terminated after executing the last line.
   *   await doWork();
   * }
   *
   * BackgroundGeolocation.registerHeadlessTask(BackgroundGeolocationHeadlessTask);
   * ```
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
   * Signal to the SDK that your app is launched and ready, supplying the
   * default {@link Config}.
   *
   * Call `ready` exactly once per app launch, before calling {@link start}.
   * The SDK applies your configuration, restores persisted state, and prepares
   * for tracking. On subsequent launches after first install, it loads the
   * persisted configuration and merges your supplied {@link Config} on top.
   * See {@link Config.reset} for finer control over this behaviour.
   *
   * ### ⚠️ Warning
   *
   * Call `ready` once per app launch from your application root — not inside a
   * component or behind a UI action. On iOS, the OS can relaunch your app in
   * the background when the device starts moving; if `ready` is not called in
   * that path, tracking will not resume.
   *
   * **See also**
   * - {@link Config.reset}
   * - {@link setConfig}
   *
   * @example
   * ```typescript
   * const state = await BackgroundGeolocation.ready({
   *   geolocation: {
   *     desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
   *     distanceFilter: 10,
   *   },
   *   app: {
   *     stopOnTerminate: false,
   *     startOnBoot: true,
   *   },
   *   http: {
   *     url: "http://your.server.com",
   *     headers: { "my-auth-token": "secret-token" },
   *   }
   * });
   * console.log("[ready] success", state);
   * ```
   */
  ready(config: Config): Promise<State>;

  /**
   * <!-- doc-id: BackgroundGeolocation.reset -->
   * Reset the SDK configuration to documented default values.
   *
   * If an optional {@link Config} is provided, it is applied after the reset.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.reset();
   * // Reset to default values with overrides
   * BackgroundGeolocation.reset({
   *   geolocation: { distanceFilter: 10 }
   * });
   * ```
   */
  reset(config:Config): Promise<State>;

  /**
   * <!-- doc-id: BackgroundGeolocation.start -->
   * Enable location and geofence tracking.
   *
   * This is the SDK's power **ON** switch. The SDK enters its **stationary**
   * state, acquires an initial location, then turns off location services until
   * motion is detected. On Android, the Activity Recognition System monitors
   * for motion; on iOS, a stationary geofence is created around the current
   * location.
   *
   * ### Note
   *
   * If a {@link AppConfig.schedule} is configured, `start` overrides the
   * schedule and begins tracking immediately.
   *
   * **See also**
   * - {@link stop}
   * - {@link startGeofences}
   *
   * @example
   * ```typescript
   * const state = await BackgroundGeolocation.start();
   * console.log("[start] success - ", state);
   * ```
   */
  start(): Promise<State>;

  /**
   * <!-- doc-id: BackgroundGeolocation.stop -->
   * Disable location and geofence monitoring.
   *
   * This is the SDK's power **OFF** switch.
   *
   * ### Note
   *
   * If a {@link AppConfig.schedule} is configured, `stop` does **not** halt
   * the scheduler. Call {@link stopSchedule} explicitly if you also want to
   * stop scheduled tracking (for example, on user logout).
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.stop();
   * ```
   *
   * @example Stop tracking and the scheduler
   * ```typescript
   * // Later when you want to stop the Scheduler (eg: user logout)
   * BackgroundGeolocation.stopSchedule();
   * ```
   */
  stop(): Promise<State>;

  /**
   * <!-- doc-id: BackgroundGeolocation.changePace -->
   * Manually toggle the SDK's motion state between **stationary** and **moving**.
   *
   * Passing `true` immediately engages location services and begins tracking,
   * bypassing stationary monitoring. Passing `false` turns off location
   * services and returns the SDK to the stationary state.
   *
   * Use this in workout-style apps where you want explicit start/stop control
   * independent of the device's motion sensors.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.changePace(true);  // location services ON ("moving")
   * BackgroundGeolocation.changePace(false); // location services OFF ("stationary")
   * ```
   */
  changePace(isMoving: boolean): Promise<State>;

  /**
   * <!-- doc-id: BackgroundGeolocation.startGeofences -->
   * Switch to geofences-only tracking mode.
   *
   * In this mode no active location tracking occurs — only geofences are
   * monitored. Use the usual {@link stop} method to exit geofences-only mode.
   *
   * **See also**
   * - {@link stop}
   * - 📘 {@link Geofence | Geofencing Guide}
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
   *   console.log("[onGeofence] - ", event);
   * });
   *
   * // Configure and start in geofences-only mode.
   * BackgroundGeolocation.ready({
   *   http: { url: "http://my.server.com", autoSync: true }
   * }).then((state) => {
   *   BackgroundGeolocation.startGeofences();
   * });
   * ```
   */
  startGeofences(): Promise<State>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getState -->
   * Return the current {@link State} of the SDK, including all {@link Config} parameters.
   *
   * @example
   * ```typescript
   * const state = await BackgroundGeolocation.getState();
   * console.log("[state] ", state.enabled, state.trackingMode);
   * ```
   */
   getState(): Promise<State>;

  /**
   * <!-- doc-id: BackgroundGeolocation.setConfig -->
   * Update the SDK's {@link Config} at runtime.
   *
   * The supplied {@link Config} is merged into the current configuration and
   * applied immediately. Use this after {@link ready} has been called to
   * change settings dynamically.
   *
   * @example
   * ```typescript
   * const state = await BackgroundGeolocation.setConfig({
   *   geolocation: {
   *     desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
   *     distanceFilter: 100.0,
   *   },
   *   app: {
   *     stopOnTerminate: false,
   *     startOnBoot: true,
   *   },
   * });
   * console.log("[setConfig] success: ", state);
   * ```
   */
  setConfig(config: Partial<Config>): Promise<State>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getCurrentPosition -->
   * Retrieve the current {@link Location}.
   *
   * Instructs the SDK to fetch a single location at maximum power and
   * accuracy. The location is persisted to SQLite and posted to
   * {@link HttpConfig.url} just like any other recorded location. If an error
   * occurs, the promise rejects with a {@link LocationError}.
   *
   * ### Options
   *
   * See {@link CurrentPositionRequest}.
   *
   * ### Error Codes
   *
   * See {@link LocationError}.
   *
   * ### Note
   *
   * The SDK requests multiple location samples internally to find the best
   * fix. All intermediate samples are delivered to {@link onLocation} with
   * {@link Location.sample} set to `true`. Filter these out if you are
   * manually posting locations to your server.
   *
   * @example
   * ```typescript
   * const location = await BackgroundGeolocation.getCurrentPosition({
   *   timeout: 30,          // 30 second timeout to fetch location
   *   maximumAge: 5000,     // Accept the last-known-location if not older than 5000 ms.
   *   desiredAccuracy: 10,  // Try to fetch a location with an accuracy of `10` meters.
   *   samples: 3,           // How many location samples to attempt.
   *   extras: {             // Custom meta-data.
   *     "route_id": 123
   *   }
   * });
   * ```
   */
  getCurrentPosition(options?: CurrentPositionRequest): Promise<Location>;

  /**
   * <!-- doc-id: BackgroundGeolocation.watchPosition -->
   * Start a continuous stream of location updates.
   *
   * Each location is persisted to SQLite (when the SDK is {@link State.enabled})
   * and posted to {@link HttpConfig.url} if HTTP is configured. Returns a
   * {@link Subscription} that must be retained to halt the stream.
   *
   * ### ⚠️ Warning
   *
   * `watchPosition` is designed for foreground use only — not for long-term
   * background monitoring. The SDK's motion-based tracking model does not
   * require it.
   *
   * #### iOS
   *
   * `watchPosition` continues running in the background, preventing iOS from
   * suspending your app. Remove the subscription in your app's suspend handler
   * to avoid draining the battery.
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
   *   });
   * }
   *
   * onSuspend() {
   *   // Halt watching position when app goes to background.
   *   this.watchPositionSubscription.remove();
   *   this.watchPositionSubscription = null;
   * }
   * ```
   */
  watchPosition(options: WatchPositionRequest, locationCallback: (location: Location) => void, errorCallback?: (errorCode: number) => void): Subscription;

  /**
   * <!-- doc-id: BackgroundGeolocation.stopWatchPosition -->
   * Stop watch-position updates initiated from {@link watchPosition}.
   *
   * **See also**
   * - {@link watchPosition}
   *
   * @internal
   */
  stopWatchPosition?(watchId?:number): void;

  /**
   * <!-- doc-id: BackgroundGeolocation.resetOdometer -->
   * Reset the odometer to `0`.
   *
   * Internally performs a {@link getCurrentPosition} to record the exact
   * location where the odometer was reset. Equivalent to
   * {@link setOdometer|`.setOdometer(0)`}.
   *
   * @example
   * ```typescript
   * const location = await BackgroundGeolocation.resetOdometer();
   * console.log("[resetOdometer] reset at: ", location);
   * ```
   */
  resetOdometer(): Promise<number>;

  /**
   * <!-- doc-id: BackgroundGeolocation.setOdometer -->
   * Set the odometer to an arbitrary value.
   *
   * Internally performs a {@link getCurrentPosition} to record the exact
   * location where the odometer was set.
   *
   * @example
   * ```typescript
   * const location = await BackgroundGeolocation.setOdometer(1234.56);
   * console.log("[setOdometer] set at: ", location);
   * ```
   */
  setOdometer(value: number): Promise<number>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getOdometer -->
   * Retrieve the current odometer reading in meters.
   *
   * The SDK continuously accumulates distance traveled between recorded
   * locations.
   *
   * ### ⚠️ Warning
   *
   * Odometer accuracy depends on location accuracy. Noisy or inaccurate
   * locations introduce error into accumulated distance. Use
   * {@link LocationFilter.odometerAccuracyThreshold} to filter low-accuracy
   * samples from odometer calculations.
   *
   * **See also**
   * - {@link LocationFilter.odometerAccuracyThreshold}
   * - {@link resetOdometer} / {@link setOdometer}
   *
   * @example
   * ```typescript
   * const odometer = await BackgroundGeolocation.getOdometer();
   * ```
   */
  getOdometer(): Promise<number>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getProviderState -->
   * Retrieve the current location-services authorization state.
   *
   * **See also**
   * - {@link onProviderChange} to subscribe to future authorization changes.
   *
   * @example
   * ```typescript
   * const providerState = await BackgroundGeolocation.getProviderState();
   * console.log("- Provider state: ", providerState);
   * ```
   */
  getProviderState(): Promise<ProviderChangeEvent>;

  /**
   * <!-- doc-id: BackgroundGeolocation.requestPermission -->
   * Manually request location permission using the configured
   * {@link GeoConfig.locationAuthorizationRequest}.
   *
   * Resolves successfully if either `WhenInUse` or `Always` is granted,
   * regardless of the requested level. Rejects if the user denies.
   *
   * If permission is already granted, resolves immediately. If iOS has
   * already shown the authorization dialog and the current grant does not
   * match the configured request, the SDK presents an alert offering to
   * direct the user to your app's Settings page.
   *
   * ### Note
   *
   * The SDK automatically requests permission when you call {@link start},
   * {@link startGeofences}, or {@link getCurrentPosition}. You do not need to
   * call this method in typical use.
   *
   * **See also**
   * - {@link GeoConfig.locationAuthorizationRequest}
   * - {@link GeoConfig.disableLocationAuthorizationAlert}
   * - {@link GeoConfig.locationAuthorizationAlert}
   * - {@link AppConfig.backgroundPermissionRationale} (Android)
   * - {@link requestTemporaryFullAccuracy} (iOS 14+)
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.onProviderChange((event) => {
   *   console.log('[providerchange]', event);
   * });
   *
   * const state = await BackgroundGeolocation.ready({
   *   geolocation: { locationAuthorizationRequest: 'Always' }
   * });
   *
   * try {
   *   const status = await BackgroundGeolocation.requestPermission();
   *   console.log('[requestPermission] success: ', status);
   * } catch (status) {
   *   console.warn('[requestPermission] FAILURE: ', status);
   * }
   * ```
   */
  requestPermission(): Promise<AuthorizationStatus>;

  /**
   * <!-- doc-id: BackgroundGeolocation.requestTemporaryFullAccuracy -->
   * Request temporary full-accuracy location authorization. [iOS 14+]
   *
   * iOS 14 allows users to grant only reduced location accuracy. This method
   * presents the system dialog
   * ([`requestTemporaryFullAccuracyAuthorization`](https://developer.apple.com/documentation/corelocation/cllocationmanager/3600217-requesttemporaryfullaccuracyauth?language=objc))
   * requesting full accuracy for the lifetime of the current app session.
   *
   * ![](https://dl.dropbox.com/s/8cc0sniv3pvpetl/ios-14-requestTemporaryFullAccuracy.png?dl=1)
   *
   * #### Configuration — Info.plist
   *
   * Add the `Privacy - Location Temporary Usage Description Dictionary` key
   * to your `Info.plist`:
   *
   * ![](https://dl.dropbox.com/s/52f5lnjc4d9g8w7/ios-14-Privacy-Location-Temporary-Usage-Description-Dictionary.png?dl=1)
   *
   * The dictionary keys (e.g. `Delivery`) are passed as `purposeKey`. The
   * corresponding value is the message shown to the user explaining the
   * purpose of your request.
   *
   * The dialog fails to present if:
   * - The `Info.plist` entry for `purposeKey` is missing.
   * - The app is already authorized for full accuracy.
   * - The app is in the background.
   *
   * ### Note
   *
   * On Android and iOS versions below 14, this method returns
   * {@link AccuracyAuthorization.Full} immediately without presenting a dialog.
   *
   * **See also**
   * - {@link ProviderChangeEvent.accuracyAuthorization}
   *
   * @example
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
   */
  requestTemporaryFullAccuracy(purposeKey: string): Promise<AccuracyAuthorization>;

  /// ------------------------------------------------------------------------------------------------
  /// Geofencing API
  /// ------------------------------------------------------------------------------------------------

  /**
   * <!-- doc-id: BackgroundGeolocation.addGeofence -->
   * Add a {@link Geofence} to be monitored by the native geofencing API.
   *
   * ### Note
   *
   * If a geofence with the same {@link Geofence.identifier} already exists,
   * it is deleted before the new one is inserted. When adding multiple
   * geofences, {@link addGeofences} is approximately 10× faster.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
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
   */
  addGeofence(geofence: Geofence): Promise<boolean>;

  /**
   * <!-- doc-id: BackgroundGeolocation.addGeofences -->
   * Add a list of {@link Geofence} to be monitored by the native geofencing API.
   *
   * ### Note
   *
   * If any geofence already exists with a matching {@link Geofence.identifier},
   * it is deleted before the new one is inserted.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   * - {@link addGeofence}
   *
   * @example
   * ```typescript
   * const geofences = [{
   *   identifier: "foo",
   *   radius: 200,
   *   latitude: 45.51921926,
   *   longitude: -73.61678581,
   *   notifyOnEntry: true
   * }, {
   *   identifier: "bar",
   *   radius: 200,
   *   latitude: 45.51921926,
   *   longitude: -73.61678581,
   *   notifyOnEntry: true
   * }];
   *
   * BackgroundGeolocation.addGeofences(geofences);
   * ```
   */
  addGeofences(geofences: Geofence[]): Promise<boolean>;

  /**
   * <!-- doc-id: BackgroundGeolocation.removeGeofence -->
   * Remove the {@link Geofence} with the given {@link Geofence.identifier}.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.removeGeofence("Home").then((success) => {
   *   console.log("[removeGeofence] success");
   * }).catch((error) => {
   *   console.log("[removeGeofence] FAILURE: ", error);
   * });
   * ```
   */
  removeGeofence(identifier: string): Promise<boolean>;

  /**
   * <!-- doc-id: BackgroundGeolocation.removeGeofences -->
   * Remove all monitored {@link Geofence} records, or a specific subset by
   * identifier.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.removeGeofences();
   * ```
   */
  removeGeofences(identifiers?: string[]): Promise<boolean>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getGeofences -->
   * Fetch all {@link Geofence} records from the SDK's database.
   *
   * Returns an empty array if no geofences are stored.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```typescript
   * const geofences = await BackgroundGeolocation.getGeofences();
   * console.log("[getGeofences]: ", geofences);
   * ```
   */
  getGeofences(): Promise<Geofence[]>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getGeofence -->
   * Fetch a single {@link Geofence} by identifier from the SDK's database.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```typescript
   * const geofence = await BackgroundGeolocation.getGeofence("HOME");
   * console.log("[getGeofence] ", geofence);
   * ```
   */
  getGeofence(identifier: string): Promise<Geofence>;

  /**
   * <!-- doc-id: BackgroundGeolocation.geofenceExists -->
   * Determine whether a geofence with the given identifier exists in the SDK's database.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```typescript
   * const exists = await BackgroundGeolocation.geofenceExists("HOME");
   * console.log("[geofenceExists] ", exists);
   * ```
   */
  geofenceExists(identifier: string): Promise<boolean>;


  /// ------------------------------------------------------------------------------------------------
  /// Scheduling API
  /// ------------------------------------------------------------------------------------------------

  /**
   * <!-- doc-id: BackgroundGeolocation.startSchedule -->
   * Activate the configured {@link AppConfig.schedule}.
   *
   * Initiates the schedule defined in {@link AppConfig.schedule}. The SDK
   * automatically starts or stops tracking according to the schedule. To halt
   * scheduled tracking, call {@link stopSchedule}.
   *
   * **See also**
   * - {@link AppConfig.schedule}
   * - {@link stopSchedule}
   *
   * @example
   * ```typescript
   * const state = await BackgroundGeolocation.startSchedule();
   * console.log("[startSchedule] success: ", state);
   * ```
   */
  startSchedule(): Promise<void>;

  /**
   * <!-- doc-id: BackgroundGeolocation.stopSchedule -->
   * Halt scheduled tracking.
   *
   * ### ⚠️ Warning
   *
   * `stopSchedule` does **not** call {@link stop} if the SDK is currently
   * tracking. Call {@link stop} explicitly if you also want to end the current
   * tracking session.
   *
   * **See also**
   * - {@link startSchedule}
   *
   * @example
   * ```typescript
   * await BackgroundGeolocation.stopSchedule();
   * ```
   *
   * @example Stop the scheduler and active tracking
   * ```typescript
   * // Later when you want to stop the Scheduler (eg: user logout)
   * await BackgroundGeolocation.stopSchedule();
   * const state = await BackgroundGeolocation.getState();
   * if (state.enabled) {
   *   BackgroundGeolocation.stop();
   * }
   * ```
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
   * Returns device information.
   *
   * @example
   * ```typescript
   * const deviceInfo = await BackgroundGeolocation.getDeviceInfo();
   * console.log(deviceInfo);
   * ```
   */
  getDeviceInfo(): Promise<DeviceInfo>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getSensors -->
   * Returns the availability of motion sensors: accelerometer, gyroscope, and
   * magnetometer.
   *
   * These sensors power the motion activity-recognition system. When any
   * sensor is absent (particularly on low-end Android devices), motion
   * recognition performance degrades significantly.
   *
   * @example
   * ```typescript
   * const sensors = await BackgroundGeolocation.getSensors();
   * console.log(sensors);
   * ```
   */
  getSensors(): Promise<Sensors>;

  /**
   * <!-- doc-id: BackgroundGeolocation.isPowerSaveMode -->
   * Returns the current state of the operating system's power-saving mode.
   *
   * Power-saving mode can throttle background services such as GPS and HTTP
   * uploads.
   *
   * **See also**
   * - {@link onPowerSaveChange} to subscribe to future changes.
   *
   * #### iOS
   *
   * Power Saving mode is enabled manually in **Settings → Battery** or via an
   * automatic OS prompt.
   *
   * ![](https://dl.dropboxusercontent.com/s/lz3zl2jg4nzstg3/Screenshot%202017-09-19%2010.34.21.png?dl=1)
   *
   * #### Android
   *
   * Battery Saver is enabled manually in **Settings → Battery → Battery Saver**
   * or automatically when the battery drops below a configured threshold.
   *
   * ![](https://dl.dropboxusercontent.com/s/raz8lagrqayowia/Screenshot%202017-09-19%2010.33.49.png?dl=1)
   *
   * @example
   * ```typescript
   * const isPowerSaveMode = await BackgroundGeolocation.isPowerSaveMode();
   * ```
   */
  isPowerSaveMode(): Promise<boolean>;

  /// ------------------------------------------------------------------------------------------------
  /// Persistence API
  /// ------------------------------------------------------------------------------------------------

  /**
   * <!-- doc-id: BackgroundGeolocation.destroyLocations -->
   * Remove all records from the SDK's SQLite database.
   *
   * @example
   * ```typescript
   * await BackgroundGeolocation.destroyLocations();
   * ```
   */
  destroyLocations(): Promise<void>;

  /**
   * <!-- doc-id: BackgroundGeolocation.destroyLocation -->
   * Remove a single location by {@link Location.uuid}.
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
   * Retrieve all {@link Location} records stored in the SDK's SQLite database.
   *
   * @example
   * ```typescript
   * const locations = await BackgroundGeolocation.getLocations();
   * ```
   */
  getLocations(): Promise<Array<Object>>;

  /**
   * <!-- doc-id: BackgroundGeolocation.getCount -->
   * Retrieve the count of all locations currently stored in the SDK's SQLite database.
   *
   * @example
   * ```typescript
   * const count = await BackgroundGeolocation.getCount();
   * ```
   */
  getCount(): Promise<number>;

  /// ------------------------------------------------------------------------------------------------
  /// HTTP API
  /// ------------------------------------------------------------------------------------------------

  /**
   * <!-- doc-id: BackgroundGeolocation.sync -->
   * Manually upload all queued locations to {@link HttpConfig.url}.
   *
   * Initiates a POST of all records in the SQLite database to your configured
   * {@link HttpConfig.url}. Records that receive a `200 OK` response are
   * deleted from the database. If {@link HttpConfig.batchSync} is `true`, all
   * locations are sent in a single request; otherwise one request is made per
   * location. If no HTTP service is configured, all records are deleted from
   * the database.
   *
   * **See also**
   * - {@link HttpConfig | HTTP Guide}
   *
   * @example
   * ```typescript
   * const records = await BackgroundGeolocation.sync();
   * console.log("[sync] success: ", records);
   * ```
   */
  sync(): Promise<Array<Object>>;

  /// ------------------------------------------------------------------------------------------------
  /// BackgroundTask API
  /// ------------------------------------------------------------------------------------------------

  /**
   * <!-- doc-id: BackgroundGeolocation.startBackgroundTask -->
   * Signal to the OS that you need to perform a long-running task.
   *
   * The OS keeps the app running in the background until you signal completion
   * with {@link stopBackgroundTask}. Your callback receives a `taskId` which
   * you must pass to `stopBackgroundTask` when finished — always call it,
   * even if an error occurs, to avoid hanging the background task.
   *
   * #### iOS
   *
   * Uses [`beginBackgroundTaskWithExpirationHandler`](https://developer.apple.com/documentation/uikit/uiapplication/1623031-beginbackgroundtaskwithexpiratio).
   * iOS provides exactly **180 seconds** of background time. The SDK
   * automatically stops the task before the OS force-kills the app.
   *
   * ```
   * ✅-[BackgroundTaskManager createBackgroundTask] 1
   * ✅-[BackgroundTaskManager stopBackgroundTask:]_block_invoke 1 OF (1)
   * ```
   *
   * #### Android
   *
   * Uses [`WorkManager`](https://developer.android.com/topic/libraries/architecture/workmanager).
   * The SDK imposes a **3-minute** limit before automatically force-killing
   * the task.
   *
   * ```
   *  I TSLocationManager: [c.t.l.u.BackgroundTaskManager onStartJob] ⏳ startBackgroundTask: 6
   *  I TSLocationManager: [c.t.l.u.BackgroundTaskManager$Task stop] ⏳ stopBackgroundTask: 6
   * ```
   *
   * @example
   * ```typescript
   * onLocation(location) {
   *   console.log("[location] ", location);
   *
   *   // Perform some long-running task (eg: HTTP request)
   *   BackgroundGeolocation.startBackgroundTask().then((taskId) => {
   *     performLongRunningTask().then(() => {
   *       // When your long-running task is complete, signal completion of taskId.
   *       BackgroundGeolocation.stopBackgroundTask(taskId);
   *     }).catch((error) => {
   *       // Be sure to catch errors: never leave your background-task hanging.
   *       console.error(error);
   *       BackgroundGeolocation.stopBackgroundTask(taskId);
   *     });
   *   });
   * }
   * ```
   */
  startBackgroundTask(): Promise<number>;

  /**
   * <!-- doc-id: BackgroundGeolocation.stopBackgroundTask -->
   * Signal completion of a {@link startBackgroundTask} to the OS.
   *
   * The OS may now suspend the app if appropriate.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.startBackgroundTask().then((taskId) => {
   *   // Perform some long-running task (eg: HTTP request)
   *   performLongRunningTask().then(() => {
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
   * - **iOS**: provide a numeric `SystemSoundID`.
   * - **Android**: provide a sound name string.
   */
  playSound(soundId: number | string): void;
}

/**
 * <!-- doc-id: BackgroundGeolocation -->
 * Primary SDK API — the single entry point for all geolocation, geofencing,
 * HTTP sync, and configuration operations.
 *
 * ### Contents
 * - [Overview](#overview)
 * - [Lifecycle](#lifecycle)
 * - [Configuration](#configuration)
 * - [Events](#events)
 * - [Examples](#examples)
 *
 * ---
 *
 * ### Overview
 *
 * The SDK operates around a **motion-based state machine**: it tracks
 * aggressively while the device is moving and pauses location services when
 * stationary, delivering high-quality background tracking with minimal battery
 * impact.
 *
 * | Area | Key methods |
 * |------|-------------|
 * | **Lifecycle** | {@link ready}, {@link start}, {@link stop}, {@link setConfig}, {@link reset} |
 * | **Location** | {@link getCurrentPosition}, {@link watchPosition}, {@link getOdometer} |
 * | **Geofencing** | {@link addGeofence}, {@link startGeofences}, {@link onGeofence} |
 * | **Events** | {@link onLocation}, {@link onMotionChange}, {@link onHttp}, {@link onProviderChange} |
 * | **Persistence** | {@link getLocations}, {@link getCount}, {@link sync}, {@link destroyLocations} |
 * | **Background tasks** | {@link startBackgroundTask}, {@link stopBackgroundTask} |
 *
 * ---
 *
 * ### Lifecycle
 *
 * Call {@link ready} exactly once per app launch — before any other SDK
 * method. It applies your configuration, restores persisted state, and
 * prepares the SDK to track. Then call {@link start} to begin tracking, and
 * {@link stop} to halt it.
 *
 * The SDK automatically restores its last-known configuration from persistent
 * storage after first install, so only the initial configuration is required.
 *
 * ---
 *
 * ### Configuration
 *
 * The SDK uses a compound-configuration model. Options are grouped into typed
 * sub-interfaces ({@link GeoConfig}, {@link HttpConfig}, {@link AppConfig},
 * etc.) passed as a single {@link Config} object. All SDK constants are
 * available as strongly-typed enum namespaces on the default export:
 *
 * - {@link BackgroundGeolocation.LogLevel}
 * - {@link BackgroundGeolocation.DesiredAccuracy}
 * - {@link BackgroundGeolocation.PersistMode}
 * - {@link BackgroundGeolocation.Event}
 *
 * @example Compound configuration
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
 * ---
 *
 * ### Events
 *
 * Each `onX` method returns a {@link Subscription} that must be removed when
 * no longer needed:
 *
 * @example Event listeners
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
 * @example Removing event listeners
 * ```ts
 * const sub = BackgroundGeolocation.onHttp((e) => { ... });
 * sub.remove();
 * ```
 *
 * ---
 *
 * ### Examples
 *
 * @example Getting started
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
   * Controls the native location engine's target accuracy.
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
   * Used by LocationFilter.policy.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     filter: {
   *       policy: BackgroundGeolocation.LocationFilterPolicy.Adjust
   *     }
   *   }
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
   * Used by LocationFilter.kalmanProfile.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     filter: {
   *       kalmanProfile: BackgroundGeolocation.KalmanProfile.Aggressive
   *     }
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
   *   app: {
   *     notification: {
   *       priority: BackgroundGeolocation.NotificationPriority.High
   *     }
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


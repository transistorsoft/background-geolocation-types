import type { Logger } from './Logger';
import type { DeviceSettings} from './DeviceSettings';
import type { CurrentPositionRequest } from './CurrentPositionRequest';
import type { WatchPositionRequest } from './WatchPositionRequest';
import type { LocationQuery } from './LocationQuery';
import type { Config } from '../config/Config';
import type { State } from './State';
import type { GeoConfig } from '../config/GeoConfig';
import type { HttpConfig } from '../config/HttpConfig';
import type { AppConfig } from '../config/AppConfig';
import type { PersistenceConfig } from '../config/PersistenceConfig';
import type { ActivityConfig } from '../config/ActivityConfig';
import type { AuthorizationConfig } from '../config/AuthorizationConfig';
import type { NotificationConfig } from '../config/NotificationConfig';

import type { Location, LocationInput } from '../data/Location';
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
import type { LocationFilterEvent } from '../events/LocationFilterEvent';
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
  locationfilter: LocationFilterEvent;
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
   * Subscribe to location events.
   *
   * Every location recorded by the SDK is delivered to your callback, including
   * locations from {@link onMotionChange}, {@link getCurrentPosition}, and
   * {@link watchPosition}.
   *
   * ## Error Codes
   *
   * If the native location API fails, the error callback receives a
   * {@link LocationError} code.
   *
   * ## Note
   *
   * During {@link onMotionChange} and {@link getCurrentPosition}, the SDK
   * requests multiple location samples to find the most accurate fix. These
   * intermediate samples are **not** persisted, but are delivered to this
   * callback with {@link Location.sample} set to `true`. Filter out sample
   * locations before manually posting to your server.
   *
   * @example
   * ```ts
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
   * Subscribe to motion-change events.
   *
   * Fires each time the device transitions between the **moving** and
   * **stationary** states.
   *
   * ## ⚠️ Warning
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
   * ```ts
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
   * Subscribe to location-filter rejection events.
   *
   * Fires when the SDK **rejects** data before it reaches your stream — either a raw
   * location sample dropped by the tracking location-filter, or a **geofence trigger**
   * rejected as spurious or duplicate. See {@link LocationFilterReason} for the full
   * list of {@link LocationFilterEvent.reason} values and what each means.
   *
   * For geofence-trigger rejections, {@link LocationFilterEvent.geofence} is present —
   * it identifies the fence, the rejected transition (`ENTER` / `EXIT`), and why — and
   * {@link LocationFilterEvent.location} carries the trigger fix. It is `undefined` for
   * sample rejections, where {@link LocationFilterEvent.trackingAccuracyThreshold} applies.
   *
   * ## Note
   *
   * Rejected locations are **not** delivered to {@link onLocation}. The filter
   * silently drops them to keep your path and odometer clean, which means a long
   * run of poor fixes can leave {@link onLocation} quiet for an extended period.
   * Subscribe here to observe those rejections and adapt — for example, surface a
   * "poor GPS signal" hint to the user, or temporarily relax
   * {@link LocationFilter.trackingAccuracyThreshold}.
   *
   * **See also**
   * - {@link LocationFilterReason}
   * - {@link LocationFilter.trackingAccuracyThreshold}
   *
   * @example
   * ```ts
   * const subscription = BackgroundGeolocation.onLocationFilter((event) => {
   *   console.log("[onLocationFilter] rejected: ", event.reason, event.accuracy);
   * });
   * ```
   *
   * @event locationfilter
   */
  onLocationFilter(cb: (event: LocationFilterEvent) => void): Subscription;

  /**
   * Subscribe to geofence transition events.
   *
   * Fires when any monitored geofence crossing occurs.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```ts
   * const subscription = BackgroundGeolocation.onGeofence((event) => {
   *   console.log("[onGeofence] ", event);
   * });
   * ```
   *
   * @event geofence
   */
  onGeofence(cb: (event: GeofenceEvent) => void): Subscription;

  /**
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
   * ```ts
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
   * Subscribe to motion-activity changes.
   *
   * Fires each time the activity-recognition system reports a new activity
   * (`still`, `on_foot`, `in_vehicle`, `on_bicycle`, `running`).
   *
   * ## Android
   *
   * {@link MotionActivityEvent.confidence} always reports `100`.
   *
   * @example
   * ```ts
   * const subscription = BackgroundGeolocation.onActivityChange((event) => {
   *   console.log("[onActivityChange] ", event);
   * });
   * ```
   *
   * @event activitychange
   */
  onActivityChange(cb: (event: MotionActivityEvent) => void): Subscription;

  /**
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
   * ```ts
   * const subscription = BackgroundGeolocation.onProviderChange((event) => {
   *   console.log("[onProviderChange]: ", event);
   *
   *   switch (event.status) {
   *     case BackgroundGeolocation.AuthorizationStatus.Denied:
   *       // Android & iOS
   *       console.log("- Location authorization denied");
   *       break;
   *     case BackgroundGeolocation.AuthorizationStatus.Always:
   *       // Android & iOS
   *       console.log("- Location always granted");
   *       break;
   *     case BackgroundGeolocation.AuthorizationStatus.WhenInUse:
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
   * Subscribe to periodic heartbeat events.
   *
   * Fires at each {@link AppConfig.heartbeatInterval} while the device is in
   * the **stationary** state. On iOS, {@link AppConfig.preventSuspend} must
   * also be `true` to receive heartbeats in the background.
   *
   * ## Note
   *
   * The {@link Location} provided by the {@link HeartbeatEvent} is only the
   * last-known location — the heartbeat does not engage location services. To
   * fetch a fresh location inside your callback, call {@link getCurrentPosition}.
   *
   * @example
   * ```ts
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
   * Subscribe to HTTP responses from your server {@link HttpConfig.url}.
   *
   * **See also**
   * - {@link HttpConfig | HTTP Guide}
   *
   * @example
   * ```ts
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
   * Subscribe to {@link AppConfig.schedule} events.
   *
   * Fires each time a schedule event activates or deactivates tracking.
   * Check `state.enabled` in your callback to determine whether tracking
   * was started or stopped.
   *
   * @example
   * ```ts
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
   * Subscribe to network connectivity changes.
   *
   * Fires when the device's network connectivity transitions between connected
   * and disconnected. By default, the SDK also fires this event at
   * {@link start} time with the current connectivity state. When connectivity
   * is restored and the SDK has queued locations, it automatically initiates
   * an upload to {@link HttpConfig.url}.
   *
   * @example
   * ```ts
   * const subscription = BackgroundGeolocation.onConnectivityChange((event) => {
   *   console.log("[onConnectivityChange] ", event);
   * });
   * ```
   *
   * @event connectivitychange
   */
  onConnectivityChange(cb: (event: ConnectivityChangeEvent) => void): Subscription;

  /**
   * Subscribe to OS power-saving mode changes.
   *
   * Fires when the operating system's power-saving mode is enabled or
   * disabled. Power-saving mode can throttle background services such as GPS
   * and HTTP uploads.
   *
   * **See also**
   * - {@link isPowerSaveMode}
   *
   * ## iOS
   *
   * Power Saving mode is enabled manually in **Settings → Battery** or via an
   * automatic OS prompt.
   *
   * ![](https://dl.dropboxusercontent.com/s/lz3zl2jg4nzstg3/Screenshot%202017-09-19%2010.34.21.png?dl=1)
   *
   * ## Android
   *
   * Battery Saver is enabled manually in **Settings → Battery → Battery Saver**
   * or automatically when the battery drops below a configured threshold.
   *
   * ![](https://dl.dropboxusercontent.com/s/raz8lagrqayowia/Screenshot%202017-09-19%2010.33.49.png?dl=1)
   *
   * @example
   * ```ts
   * const subscription = BackgroundGeolocation.onPowerSaveChange((isPowerSaveMode) => {
   *   console.log("[onPowerSaveChange]: ", isPowerSaveMode);
   * });
   * ```
   *
   * @event powersavechange
   */
  onPowerSaveChange(cb: (enabled: boolean) => void): Subscription;

  /**
   * Subscribe to changes in plugin {@link State.enabled}.
   *
   * Fires when {@link State.enabled} changes. Calling {@link start} or
   * {@link stop} triggers this event.
   *
   * @example
   * ```ts
   * const subscription = BackgroundGeolocation.onEnabledChange((isEnabled) => {
   *   console.log("[onEnabledChange] isEnabled? ", isEnabled);
   * });
   * ```
   *
   * @event enabledchange
   */
  onEnabledChange(cb: (enabled: boolean) => void): Subscription;

  /**
   * Subscribe to button-click actions on the Android foreground-service
   * notification. [Android only]
   *
   * Fires when the user taps a button defined in a custom
   * {@link NotificationConfig.layout}.
   */
  onNotificationAction(cb: (buttonId: string) => void): Subscription;

  /**
   * Subscribe to {@link Config.authorization} events.
   *
   * Fires when {@link AuthorizationConfig.refreshUrl} responds, either
   * successfully or not. On success, {@link AuthorizationEvent.success} is
   * `true` and {@link AuthorizationEvent.response} contains the decoded JSON
   * response. On failure, {@link AuthorizationEvent.error} contains the error
   * message.
   *
   * @example
   * ```ts
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
   * Remove all event listeners.
   *
   * Calls {@link Subscription.remove} on all active subscriptions.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.removeListeners();
   * ```
   */
  removeListeners(): Promise<void>;

  /**
   * Registers a headless-task callback for Android background events when the
   * app has been terminated with {@link AppConfig.stopOnTerminate}`:false`.
   * [Android only]
   *
   * The callback receives a {@link HeadlessEvent} with a `name` (event name)
   * and `params` (event data).
   *
   * ## ⚠️ Warning
   *
   * You must call `registerHeadlessTask` in your application root file (e.g.
   * `index.js`), not inside a component or behind a UI action.
   *
   * ## ⚠️ Warning
   *
   * Your function must be declared `async`. Await all work inside it — the
   * headless task is automatically terminated after the last line executes.
   *
   * ## Note
   *
   * Javascript headless callbacks are not supported by Cordova or Capacitor.
   *
   * ## Debugging
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
   * ```ts
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
   * {@link DeviceSettings} API
   */
  readonly deviceSettings: DeviceSettings;
  /**
   * {@link Logger} API
   */
  readonly logger: Logger;

  /**
   * Signal to the SDK that your app is launched and ready, supplying the
   * default {@link Config}.
   *
   * Call `ready` exactly once per app launch, before calling {@link start}.
   * The SDK applies your configuration, restores persisted state, and prepares
   * for tracking. On subsequent launches after first install, it loads the
   * persisted configuration and merges your supplied {@link Config} on top.
   * See {@link Config.reset} for finer control over this behaviour.
   *
   * ## ⚠️ Warning
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
   * ```ts
   * const state = await BackgroundGeolocation.ready({
   *   geolocation: {
   *     desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
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
   * Reset the SDK configuration to documented default values.
   *
   * If an optional {@link Config} is provided, it is applied after the reset.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.reset();
   * // Reset to default values with overrides
   * BackgroundGeolocation.reset({
   *   geolocation: { distanceFilter: 10 }
   * });
   * ```
   */
  reset(config:Config): Promise<State>;

  /**
   * Enable location and geofence tracking.
   *
   * This is the SDK's power **ON** switch. The SDK enters its **stationary**
   * state, acquires an initial location, then turns off location services until
   * motion is detected. On Android, the Activity Recognition System monitors
   * for motion; on iOS, a stationary geofence is created around the current
   * location.
   *
   * ## Note
   *
   * If a {@link AppConfig.schedule} is configured, `start` overrides the
   * schedule and begins tracking immediately.
   *
   * **See also**
   * - {@link stop}
   * - {@link startGeofences}
   *
   * @example
   * ```ts
   * const state = await BackgroundGeolocation.start();
   * console.log("[start] success - ", state);
   * ```
   */
  start(): Promise<State>;

  /**
   * Disable location and geofence monitoring.
   *
   * This is the SDK's power **OFF** switch.
   *
   * ## Note
   *
   * If a {@link AppConfig.schedule} is configured, `stop` does **not** halt
   * the scheduler. Call {@link stopSchedule} explicitly if you also want to
   * stop scheduled tracking (for example, on user logout).
   *
   * @example
   * ```ts
   * BackgroundGeolocation.stop();
   * ```
   *
   * @example Stop tracking and the scheduler
   * ```ts
   * // Later when you want to stop the Scheduler (eg: user logout)
   * BackgroundGeolocation.stopSchedule();
   * ```
   */
  stop(): Promise<State>;

  /**
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
   * ```ts
   * BackgroundGeolocation.changePace(true);  // location services ON ("moving")
   * BackgroundGeolocation.changePace(false); // location services OFF ("stationary")
   * ```
   */
  changePace(isMoving: boolean): Promise<State>;

  /**
   * Switch to geofences-only tracking mode.
   *
   * In this mode no active location tracking occurs — only geofences are
   * monitored. Use the usual {@link stop} method to exit geofences-only mode.
   *
   * {@link start} and `startGeofences` are mutually exclusive — call one or the
   * other, never both. {@link start} enables full tracking: location recording and
   * geofence monitoring run together. `startGeofences` enables geofence monitoring
   * only, with no continuous location recording. Calling {@link start} while already
   * in geofences-only mode (or vice versa) switches modes; there is no need to call
   * {@link stop} first.
   *
   * **See also**
   * - {@link stop}
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```ts
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
   * Return the current {@link State} of the SDK, including all {@link Config} parameters.
   *
   * @example
   * ```ts
   * const state = await BackgroundGeolocation.getState();
   * console.log("[state] ", state.enabled, state.trackingMode);
   * ```
   */
   getState(): Promise<State>;

  /**
   * Update the SDK's {@link Config} at runtime.
   *
   * The supplied {@link Config} is merged into the current configuration and
   * applied immediately. Use this after {@link ready} has been called to
   * change settings dynamically.
   *
   * @example
   * ```ts
   * const state = await BackgroundGeolocation.setConfig({
   *   geolocation: {
   *     desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
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
   * Retrieve the current {@link Location}.
   *
   * Instructs the SDK to fetch a single location at maximum power and
   * accuracy. The location is persisted to SQLite and posted to
   * {@link HttpConfig.url} just like any other recorded location. If an error
   * occurs, the promise rejects with a {@link LocationError}.
   *
   * ## Options
   *
   * See {@link CurrentPositionRequest}.
   *
   * ## Error Codes
   *
   * See {@link LocationError}.
   *
   * ## Note
   *
   * The SDK requests multiple location samples internally to find the best
   * fix. All intermediate samples are delivered to {@link onLocation} with
   * {@link Location.sample} set to `true`. Filter these out if you are
   * manually posting locations to your server.
   *
   * ## Android: running without foreground-service permissions
   *
   * In the FGS-permission-free configuration (see
   * {@link GeoConfig.useSignificantChangesOnly}), `getCurrentPosition` operates
   * best-effort: samples are fetched by an expedited `WorkManager` job instead
   * of a foreground service, honoring `samples`, `desiredAccuracy` and
   * `maximumAge` as usual.  With the app in the foreground this behaves
   * identically to the fully-permissioned SDK; in the background, Android
   * throttles location delivery to unpromoted apps — expect slower fixes,
   * fewer samples, or a timeout.
   *
   * @example
   * ```ts
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
   * Start a continuous stream of location updates.
   *
   * Each location is persisted to SQLite (when the SDK is {@link State.enabled})
   * and posted to {@link HttpConfig.url} if HTTP is configured. Returns a
   * {@link Subscription} that must be retained to halt the stream.
   *
   * ## ⚠️ Warning
   *
   * `watchPosition` is designed for foreground use only — not for long-term
   * background monitoring. The SDK's motion-based tracking model does not
   * require it.
   *
   * ## Android: running without foreground-service permissions
   *
   * In the FGS-permission-free configuration (see
   * {@link GeoConfig.useSignificantChangesOnly}), `watchPosition` remains
   * foreground-service-bound and is reliable only while the app is in the
   * foreground.
   *
   * ## iOS
   *
   * `watchPosition` continues running in the background, preventing iOS from
   * suspending your app. Remove the subscription in your app's suspend handler
   * to avoid draining the battery.
   *
   * @example
   * ```ts
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
   * Stop watch-position updates initiated from {@link watchPosition}.
   *
   * **See also**
   * - {@link watchPosition}
   *
   * @internal
   */
  stopWatchPosition?(watchId?:number): void;

  /**
   * Reset the odometer to `0`.
   *
   * Internally performs a {@link getCurrentPosition} to record the exact
   * location where the odometer was reset. Equivalent to
   * {@link setOdometer|`.setOdometer(0)`}.
   *
   * @example
   * ```ts
   * const location = await BackgroundGeolocation.resetOdometer();
   * console.log("[resetOdometer] reset at: ", location);
   * ```
   */
  resetOdometer(): Promise<number>;

  /**
   * Set the odometer to an arbitrary value.
   *
   * Internally performs a {@link getCurrentPosition} to record the exact
   * location where the odometer was set.
   *
   * @example
   * ```ts
   * const location = await BackgroundGeolocation.setOdometer(1234.56);
   * console.log("[setOdometer] set at: ", location);
   * ```
   */
  setOdometer(value: number): Promise<number>;

  /**
   * Retrieve the current odometer reading in meters.
   *
   * The SDK continuously accumulates distance traveled between recorded
   * locations.
   *
   * ## ⚠️ Warning
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
   * ```ts
   * const odometer = await BackgroundGeolocation.getOdometer();
   * ```
   */
  getOdometer(): Promise<number>;

  /**
   * Retrieve the current location-services authorization state.
   *
   * **See also**
   * - {@link onProviderChange} to subscribe to future authorization changes.
   *
   * @example
   * ```ts
   * const providerState = await BackgroundGeolocation.getProviderState();
   * console.log("- Provider state: ", providerState);
   * ```
   */
  getProviderState(): Promise<ProviderChangeEvent>;

  /**
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
   * ## Note
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
   * ```ts
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
   * Request temporary full-accuracy location authorization. [iOS 14+]
   *
   * iOS 14 allows users to grant only reduced location accuracy. This method
   * presents the system dialog
   * ([`requestTemporaryFullAccuracyAuthorization`](https://developer.apple.com/documentation/corelocation/cllocationmanager/3600217-requesttemporaryfullaccuracyauth?language=objc))
   * requesting full accuracy for the lifetime of the current app session.
   *
   * ![](https://dl.dropbox.com/s/8cc0sniv3pvpetl/ios-14-requestTemporaryFullAccuracy.png?dl=1)
   *
   * ## Configuration — Info.plist
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
   * ## Note
   *
   * On Android and iOS versions below 14, this method returns
   * {@link AccuracyAuthorization.Full} immediately without presenting a dialog.
   *
   * **See also**
   * - {@link ProviderChangeEvent.accuracyAuthorization}
   *
   * @example
   * ```ts
   * BackgroundGeolocation.onProviderChange((event) => {
   *   if (event.accuracyAuthorization == BackgroundGeolocation.AccuracyAuthorization.Reduced) {
   *     // Supply "Purpose" key from Info.plist as 1st argument.
   *     BackgroundGeolocation.requestTemporaryFullAccuracy("Delivery").then((accuracyAuthorization) => {
   *       if (accuracyAuthorization == BackgroundGeolocation.AccuracyAuthorization.Full) {
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
   * Add a {@link Geofence} to be monitored by the native geofencing API.
   *
   * ## Note
   *
   * If a geofence with the same {@link Geofence.identifier} already exists,
   * it is deleted before the new one is inserted. When adding multiple
   * geofences, {@link addGeofences} is approximately 10× faster.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```ts
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
   * Add a list of {@link Geofence} to be monitored by the native geofencing API.
   *
   * ## Note
   *
   * If any geofence already exists with a matching {@link Geofence.identifier},
   * it is deleted before the new one is inserted.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   * - {@link addGeofence}
   *
   * @example
   * ```ts
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
   * Remove the {@link Geofence} with the given {@link Geofence.identifier}.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```ts
   * BackgroundGeolocation.removeGeofence("Home").then((success) => {
   *   console.log("[removeGeofence] success");
   * }).catch((error) => {
   *   console.log("[removeGeofence] FAILURE: ", error);
   * });
   * ```
   */
  removeGeofence(identifier: string): Promise<boolean>;

  /**
   * Remove all monitored {@link Geofence} records, or a specific subset by
   * identifier.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```ts
   * BackgroundGeolocation.removeGeofences();
   * ```
   */
  removeGeofences(identifiers?: string[]): Promise<boolean>;

  /**
   * Fetch all {@link Geofence} records from the SDK's database.
   *
   * Returns an empty array if no geofences are stored.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```ts
   * const geofences = await BackgroundGeolocation.getGeofences();
   * console.log("[getGeofences]: ", geofences);
   * ```
   */
  getGeofences(): Promise<Geofence[]>;

  /**
   * Fetch a single {@link Geofence} by identifier from the SDK's database.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```ts
   * const geofence = await BackgroundGeolocation.getGeofence("HOME");
   * console.log("[getGeofence] ", geofence);
   * ```
   */
  getGeofence(identifier: string): Promise<Geofence>;

  /**
   * Determine whether a geofence with the given identifier exists in the SDK's database.
   *
   * **See also**
   * - 📘 {@link Geofence | Geofencing Guide}
   *
   * @example
   * ```ts
   * const exists = await BackgroundGeolocation.geofenceExists("HOME");
   * console.log("[geofenceExists] ", exists);
   * ```
   */
  geofenceExists(identifier: string): Promise<boolean>;


  /// ------------------------------------------------------------------------------------------------
  /// Scheduling API
  /// ------------------------------------------------------------------------------------------------

  /**
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
   * ```ts
   * const state = await BackgroundGeolocation.startSchedule();
   * console.log("[startSchedule] success: ", state);
   * ```
   */
  startSchedule(): Promise<void>;

  /**
   * Halt scheduled tracking.
   *
   * ## ⚠️ Warning
   *
   * `stopSchedule` does **not** call {@link stop} if the SDK is currently
   * tracking. Call {@link stop} explicitly if you also want to end the current
   * tracking session.
   *
   * **See also**
   * - {@link startSchedule}
   *
   * @example
   * ```ts
   * await BackgroundGeolocation.stopSchedule();
   * ```
   *
   * @example Stop the scheduler and active tracking
   * ```ts
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
   * Sets the {@link LoggerConfig.logLevel}.
   */
  setLogLevel(level: LogLevel): Promise<void>;

  /** @hidden */
  setLogPersist(mode: PersistMode): Promise<void>;

  /// ------------------------------------------------------------------------------------------------
  /// Device API
  /// ------------------------------------------------------------------------------------------------

  /**
   * Returns device information.
   *
   * @example
   * ```ts
   * const deviceInfo = await BackgroundGeolocation.getDeviceInfo();
   * console.log(deviceInfo);
   * ```
   */
  getDeviceInfo(): Promise<DeviceInfo>;

  /**
   * Returns the availability of motion sensors: accelerometer, gyroscope, and
   * magnetometer.
   *
   * These sensors power the motion activity-recognition system. When any
   * sensor is absent (particularly on low-end Android devices), motion
   * recognition performance degrades significantly.
   *
   * @example
   * ```ts
   * const sensors = await BackgroundGeolocation.getSensors();
   * console.log(sensors);
   * ```
   */
  getSensors(): Promise<Sensors>;

  /**
   * Returns the current state of the operating system's power-saving mode.
   *
   * Power-saving mode can throttle background services such as GPS and HTTP
   * uploads.
   *
   * **See also**
   * - {@link onPowerSaveChange} to subscribe to future changes.
   *
   * ## iOS
   *
   * Power Saving mode is enabled manually in **Settings → Battery** or via an
   * automatic OS prompt.
   *
   * ![](https://dl.dropboxusercontent.com/s/lz3zl2jg4nzstg3/Screenshot%202017-09-19%2010.34.21.png?dl=1)
   *
   * ## Android
   *
   * Battery Saver is enabled manually in **Settings → Battery → Battery Saver**
   * or automatically when the battery drops below a configured threshold.
   *
   * ![](https://dl.dropboxusercontent.com/s/raz8lagrqayowia/Screenshot%202017-09-19%2010.33.49.png?dl=1)
   *
   * @example
   * ```ts
   * const isPowerSaveMode = await BackgroundGeolocation.isPowerSaveMode();
   * ```
   */
  isPowerSaveMode(): Promise<boolean>;

  /// ------------------------------------------------------------------------------------------------
  /// Persistence API
  /// ------------------------------------------------------------------------------------------------

  /**
   * Remove all records from the SDK's SQLite database.
   *
   * @example
   * ```ts
   * await BackgroundGeolocation.destroyLocations();
   * ```
   */
  destroyLocations(): Promise<void>;

  /**
   * Remove a single location by {@link Location.uuid}.
   *
   * @example
   * ```ts
   * await BackgroundGeolocation.destroyLocation(location.uuid);
   * ```
   */
  destroyLocation(uuid: string): Promise<void>;

  /**
   * Manually insert a location record into the SDK's SQLite database.
   *
   * The record is stored **as given** — the SDK does not overwrite its `timestamp`, `activity`,
   * `is_moving`, `odometer`, `battery`, or other fields with current device state. This is intended
   * for importing history or externally-sourced fixes the SDK did not record itself. Only
   * {@link LocationInput.coords} (latitude and longitude) is required; a missing or unparseable
   * {@link LocationInput.timestamp} defaults to the current time. Resolves with the `uuid` of the
   * inserted record — the SDK generates one when {@link LocationInput.uuid} is omitted.
   *
   * ### Note
   * `insertLocation` deliberately bypasses {@link PersistenceConfig.persistMode} — an explicit insert
   * always writes to the database, regardless of the configured persistence mode. For recording the
   * device's own position on demand, prefer {@link getCurrentPosition}.
   *
   * **See also**
   * - {@link getCurrentPosition}
   * - {@link getLocations}
   * - {@link getCount}
   * - {@link destroyLocation}
   *
   * @example
   * ```ts
   * const uuid = await BackgroundGeolocation.insertLocation({
   *   timestamp: "2024-01-15T10:30:00.000Z",
   *   coords: { latitude: 45.5152, longitude: -73.6104 },
   *   extras: { source: "import" }
   * });
   * console.log("[insertLocation] inserted record:", uuid);
   * ```
   */
  insertLocation(location: LocationInput): Promise<string>;

  /**
   * Retrieve {@link Location} records stored in the SDK's SQLite database.
   *
   * Provide an optional {@link LocationQuery} to page through a large table,
   * constraining results by {@link LocationQuery.limit | limit}, starting
   * {@link LocationQuery.offset | offset} (or {@link LocationQuery.page | page}),
   * and sort {@link LocationQuery.order | order}. Without a query, every record is
   * returned in a single call — which can exhaust memory on a table of several
   * thousand records, so prefer paging for large datasets. Size your paging with
   * {@link getCount}.
   *
   * @example
   * ```ts
   * // All records
   * const locations = await BackgroundGeolocation.getLocations();
   *
   * // One page of 500, newest first
   * const page = await BackgroundGeolocation.getLocations({
   *   limit: 500,
   *   page: 0,
   *   order: SQLQueryOrder.Desc
   * });
   * ```
   */
  getLocations(query?: LocationQuery): Promise<Array<Object>>;

  /**
   * Retrieve the count of all locations currently stored in the SDK's SQLite database.
   *
   * @example
   * ```ts
   * const count = await BackgroundGeolocation.getCount();
   * ```
   */
  getCount(): Promise<number>;

  /// ------------------------------------------------------------------------------------------------
  /// HTTP API
  /// ------------------------------------------------------------------------------------------------

  /**
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
   * ```ts
   * const records = await BackgroundGeolocation.sync();
   * console.log("[sync] success: ", records);
   * ```
   */
  sync(): Promise<Array<Object>>;

  /// ------------------------------------------------------------------------------------------------
  /// BackgroundTask API
  /// ------------------------------------------------------------------------------------------------

  /**
   * Signal to the OS that you need to perform a long-running task.
   *
   * The OS keeps the app running in the background until you signal completion
   * with {@link stopBackgroundTask}. Your callback receives a `taskId` which
   * you must pass to `stopBackgroundTask` when finished — always call it,
   * even if an error occurs, to avoid hanging the background task.
   *
   * ## iOS
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
   * ## Android
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
   * ```ts
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
   * Signal completion of a {@link startBackgroundTask} to the OS.
   *
   * The OS may now suspend the app if appropriate.
   *
   * @example
   * ```ts
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
   * Find or create a Transistor authorization token.
   *
   * See {@link TransistorAuthorizationService} for more information.
   */
  findOrCreateTransistorAuthorizationToken(orgname:string, username:string, url?:string): Promise<TransistorAuthorizationToken>;

  /**
   * Destroy a Transistor authorization token.
   *
   * See {@link TransistorAuthorizationService} for more information.
   */
  destroyTransistorAuthorizationToken(url:string): Promise<void>;

  /**
   * Play a system sound.
   *
   * ## iOS
   *
   * Provide a numeric `SystemSoundID`.
   *
   * ## Android
   *
   * Provide a sound name string.
   */
  playSound(soundId: number | string): void;
}

/**
 * Primary SDK API — the single entry point for all geolocation, geofencing,
 * HTTP sync, and configuration operations.
 *
 * ## Contents
 * - [Overview](#overview)
 * - [Lifecycle](#lifecycle)
 * - [Configuration](#configuration)
 * - [Events](#events)
 * - [Examples](#examples)
 *
 * ---
 *
 * ## Overview
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
 * ## Lifecycle
 *
 * Think of the SDK like a stereo receiver:
 *
 * - **Wiring the speakers** — Register event listeners ({@link onLocation}, {@link onGeofence}, etc.)
 *   before calling {@link ready}. The SDK buffers events until {@link ready} resolves, so listeners
 *   registered afterward may miss them. You do not need to remove listeners when you call
 *   {@link stop} — the SDK simply stops emitting events when it isn't running.
 *
 * - **Plugging in the power cord** — {@link ready} initializes the SDK, restores
 *   persisted state, and applies your configuration. Call it once per launch, before any
 *   method that acquires a location or requests permissions. Your config is not applied
 *   until {@link ready} resolves.
 *
 * - **The power button** — {@link start} and {@link stop} begin and halt location tracking. The SDK
 *   persists its enabled state across launches. If the app is terminated while tracking
 *   is active, the next call to {@link ready} will automatically resume tracking — you do not
 *   need to call {@link start} again.
 *
 * Always call `ready` on every launch — no exceptions. The SDK buffers all events from the
 * moment the app starts, and holds them until `ready` is called. If your app launches and
 * never calls `ready`, the SDK sits silently waiting: no events fire, no locations are
 * recorded, no uploads are attempted. It does not matter whether tracking was already active
 * from a previous session — `ready` is the signal that tells the SDK your app is alive and
 * listening. This is why the method is named `ready`.
 *
 * Calling methods before {@link ready} resolves is perfectly fine, provided they do not request
 * a location or trigger a permission dialog. Methods that only read from the SDK's SQLite
 * database are safe — for example {@link getState}, {@link getLocations}, {@link getGeofences},
 * {@link removeGeofences}. Avoid {@link start}, {@link requestPermission}, {@link getCurrentPosition}, and
 * {@link watchPosition} until after {@link ready} resolves. The SDK defaults apply until your config
 * arrives — calling a permission-sensitive method too early will use those defaults, not
 * your configured values.
 *
 * ---
 *
 * ## Configuration
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
 * // Register event-listeners before calling .ready()
 * BackgroundGeolocation.onLocation((location) => {
 *   console.log("[onLocation]", location);
 * });
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
 * ## Events
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
 * ## Examples
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
   * Enum namespace controlling verbosity of the SDK logger.
   *
   * Used by `LoggerConfig.logLevel`. Values range from silent (`Off`) to
   * extremely verbose (`Verbose`).
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
   * Enum namespace controlling the native location engine's target accuracy.
   *
   * Higher accuracy consumes more battery. Used by `GeoConfig.desiredAccuracy`.
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
   * Enum namespace controlling which records the SDK persists to SQLite:
   * locations only, geofences only, both, or none.
   *
   * Used by `PersistenceConfig.persistMode`.
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
   * Enum namespace defining how the HTTP service performs authorization.
   *
   * Includes basic, JWT, and custom strategies. Used by `AuthorizationConfig.strategy`.
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
   * Enum namespace selecting the filtering engine policy for noise-reduction and smoothing.
   *
   * Used by `LocationFilter.policy`.
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
   * Enum namespace selecting a preset Kalman filter tuning profile
   * (aggressive, moderate, or relaxed smoothing).
   *
   * Used by `LocationFilter.kalmanProfile`.
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
   * Enum namespace defining the HTTP method used for location uploads (POST, PUT, etc).
   *
   * Used by `HttpConfig.method`.
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
   * Enum namespace defining which physical motion activities can trigger
   * motion-detection transitions (still → moving).
   *
   * Used by `ActivityConfig.triggerActivities`.
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
   * Enum namespace controlling Android foreground-service notification priority
   * and icon placement (top, bottom, hidden). [Android only]
   *
   * Used by `NotificationConfig.priority`.
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
   * Enum namespace of all event names emitted by the SDK
   * (`location`, `geofence`, `motionchange`, `heartbeat`, etc).
   *
   * @readonly
   */
  Event: typeof import('../../enums/Event').Event;

  /**
   * Enum namespace defining the type of location permission request
   * (Always, WhenInUse, or Any). [iOS only]
   *
   * Used by `GeoConfig.locationAuthorizationRequest`.
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
   * Enum namespace indicating whether the user granted full or reduced location
   * accuracy. [iOS 14+]
   *
   * Used by `ProviderChangeEvent.accuracyAuthorization` and
   * `requestTemporaryFullAccuracy`.
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
   * Enum namespace representing the OS-level authorization state for
   * location services (Denied, Restricted, Always, WhenInUse).
   *
   * Returned from `requestPermission()` and `onProviderChange`.
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
   * Enum namespace specifying the type of user activity
   * (AutomotiveNavigation, Fitness, OtherNavigation, etc). [iOS only]
   *
   * Used by {@link GeoConfig.activityType}.
   */
  ActivityType: typeof import('../../enums/ActivityType').ActivityType;
}


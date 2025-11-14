import { PersistMode } from '../../enums/PersistMode';

/**
 * **Persistence / Storage Configuration**
 *
 * The **PersistenceConfig** group controls how the SDK stores, orders, and
 * purges records in its on-device SQLite database. The database acts as a
 * durable buffer between data producers (locations, geofences) and consumers
 * (your app code and the HTTP service).
 *
 * ```ts
 * BackgroundGeolocation.ready({
 *   persistence: {
 *     maxDaysToPersist: 3,
 *     maxRecordsToPersist: 1000,
 *     extras: {
 *       'user_id': 123,
 *       'appVersion': '1.2.3'
 *     },
 *     persistMode: PersistMode.All
 *   }
 * });
 * ```
 *
 * The SDK **prefers an empty database**. Each new {@link Location} (and geofence
 * event) is written to SQLite immediately, then consumed (and typically deleted)
 * by downstream services such as the HTTP uploader. When a record is successfully
 * processed (e.g., posted to your server), it is removed to keep the buffer
 * small and responsive.
 *
 * Configure **PersistenceConfig** via {@link Config.persistence}.
 *
 * __What gets stored?__
 *
 * - **Locations** recorded by the tracker  
 * - **Geofence events** (enter / exit / dwell)  
 * - **Extras** merged at write time via {@link extras}
 *
 * __When are records deleted?__
 *
 * A record is deleted when **any** of the following occur:
 *
 * - Your server returns a `20x` for the HTTP upload (see {@link HttpConfig})
 * - You call {@link BackgroundGeolocation.destroyLocations}
 * - {@link maxDaysToPersist} elapses (rolling TTL purge)
 * - {@link maxRecordsToPersist} would be exceeded  
 *   (oldest records are dropped)
 *
 * Inspect pending records using:
 *
 * - {@link BackgroundGeolocation.getCount}  
 * - {@link BackgroundGeolocation.getLocations}
 *
 * __Ordering__
 *
 * The order in which records are selected for upload or consumption is controlled by
 * {@link locationsOrderDirection}:
 *
 * - `"ASC"` → oldest first (default)
 * - `"DESC"` → newest first
 *
 * __JSON templating__
 *
 * Customize the JSON structure of uploaded records:
 *
 * - {@link locationTemplate}
 * - {@link geofenceTemplate}
 *
 * Templates receive the full record context and can reshape, rename, or nest fields
 * to match backend requirements (see also {@link HttpConfig.rootProperty}).
 *
 * __Extras__
 *
 * {@link extras} is a free-form key/value map merged into **every**
 * record when written. Ideal for static context such as `user_id`, `route_id`,
 * `appVersion`, etc.
 *
 * __Persist mode__
 *
 * Control what is written to SQLite with {@link PersistMode}:
 *
 * - {@link PersistMode.All} — persist **locations + geofences**  
 * - {@link PersistMode.Location} — persist **locations only**  
 * - {@link PersistMode.Geofence} — persist **geofences only**  
 * - {@link PersistMode.None} — **do not persist** (live callbacks still fire)
 *
 * > Even with {@link PersistMode.None}, HTTP uploads can still occur if triggered
 * > directly. Persistence controls the *buffer*, not the upload.
 *
 * __Example__
 *
 * ```ts
 * const location = await bg.BackgroundGeolocation.getCurrentPosition({
 *   persist: true,
 *   extras: {"get_current_position": true},
 *   samples: 3,
 * });
 * ```
 *
 * In this case, the fetched location is persisted (because `persist: true`,
 * overriding {@link persistMode}), then uploaded immediately if
 * {@link HttpConfig.autoSync} is enabled.
 *
 * __ProviderChange Records__
 *
 * Disable storage of diagnostic “provider change” records (GPS toggled, settings
 * changed, etc.) with {@link disableProviderChangeRecord} to keep
 * the database lean.
 *
 * __Examples__
 *
 * **Configure persistence behavior**
 * ```ts
 * const config = {
 *   persistence: {
 *     maxDaysToPersist: 14,
 *     maxRecordsToPersist: 5000,
 *     locationsOrderDirection: 'ASC',
 *     persistMode: PersistMode.All,
 *     extras: {'user_id': 123, 'appVersion': '1.2.3'},
 *   },
 *   http: {
 *     url: 'https://example.com/locations',
 *     autoSync: true,
 *   }
 * });
 * const state = await BackgroundGeolocation.ready(config);
 * ```
 *
 * **Inspect and purge the database**
 * ```ts
 * final pending = await BackgroundGeolocation.getCount();
 * console.log('Pending records: $pending');
 *
 * // Purge all records
 * final ok = await bg.BackgroundGeolocation.destroyLocations();
 * console.log('Destroyed all records? $ok');
 * ```
 *
 * **Custom JSON templates**
 * ```ts
 * const config = {
 *   persistence: {
 *     locationTemplate: '''
 *     {
 *       "lat": <%= latitude %>,
 *       "lng": <%= longitude %>,
 *       "ts": "<%= timestamp %>",
 *       "meta": <%= JSON.stringify(extras) %>
 *     }
 *     ''',
 *     geofenceTemplate: '''
 *     {
 *       "id": "<%= identifier %>",
 *       "action": "<%= action %>",
 *       "ts": "<%= timestamp %>"
 *     }
 *     ''',
 *   },
 * };
 * ```
 *
 * __Migration from legacy flat Config__
 *
 * ```ts
 * // Legacy
 * {
 *   maxDaysToPersist: 14,
 *   maxRecordsToPersist: 5000,
 *   locationsOrderDirection: 'ASC',
 *   locationTemplate: '{...}',
 *   geofenceTemplate: '{...}',
 *   persistMode: Config.PERSIST_MODE_ALL,
 *   extras: {'user_id': 123},
 *   disableProviderChangeRecord: true,
 * };
 * ```
 *
 * Now grouped under **PersistenceConfig**:
 *
 * ```ts
 * {
 *   persistence: {
 *     maxDaysToPersist: 14,
 *     maxRecordsToPersist: 5000,
 *     locationsOrderDirection: 'ASC',
 *     locationTemplate: '{...}',
 *     geofenceTemplate: '{...}',
 *     persistMode: PersistMode.all,
 *     extras: {'user_id': 123},
 *     disableProviderChangeRecord: true,
 *   },
 * };
 * ```
 *
 * Legacy keys remain but are marked **@deprecated**. Prefer the compound form going forward.
 * 
 * @category Config
 */
export interface PersistenceConfig {
  /**
   * Optional custom template for rendering {@link Location} JSON request data
   * in HTTP uploads.
   *
   * The {@link locationTemplate} is evaluated using
   * Ruby-style ERB tags:
   *
   * ```erb
   * <%= variable_name %>
   * ```
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   persistence: {
   *     locationTemplate:
   *       '{"lat":<%= latitude %>,"lng":<%= longitude %>,"event":"<%= event %>",isMoving:<%= is_moving %>}'
   *   }
   * });
   *
   * // Or use a compact Array template:
   * BackgroundGeolocation.ready({
   *   persistence: {
   *     locationTemplate:
   *       '[<%=latitude%>, <%=longitude%>, "<%=event%>", <%=is_moving%>]'
   *   }
   * });
   * ```
   *
   * __⚠️ Quoting string data__
   *
   * The plugin does *not* automatically insert quotes around string values.  
   * Templates are JSON-encoded **exactly as written**.
   *
   * The following will cause a JSON error because `timestamp` is a string
   * but is rendered unquoted:
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.ready({
   *   persistence: {
   *     locationTemplate: '{"timestamp": <%= timestamp %>}'
   *   }
   * });
   * ```
   *
   * This renders invalid JSON:
   *
   * ```json
   * {"timestamp": 2018-01-01T12:01:01.123Z}
   * ```
   *
   * Correct usage:
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.ready({
   *  persistence: {
   *   locationTemplate: '{"timestamp": "<%= timestamp %>"}'
   *  }
   * });
   * ```
   *
   * ```json
   * {"timestamp": "2018-01-01T12:01:01.123Z"}
   * ```
   *
   * __Configured {@link PersistenceConfig.extras | extras}__
   *
   * If {@link extras} are configured, the key/value pairs are merged directly
   * into the rendered location JSON.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.ready({
   *   http: {
   *     url: 'https://my.server.com/locations',
   *     rootProperty: 'data',
   *   },
   *   persistence: {
   *     locationTemplate: '{"lat":<%= latitude %>,"lng":<%= longitude %>}',
   *     extras: { foo: "bar" }
   *   }
   * });
   * ```
   *
   * Produces:
   *
   * ```json
   * {
   *   "data": {
   *     "lat": 23.23232323,
   *     "lng": 37.37373737,
   *     "foo": "bar"
   *   }
   * }
   * ```
   *
   * __Template Tags__
   *
   * | Tag                    | Type      | Description |
   * |------------------------|-----------|-------------|
   * | `latitude`             | `Float`   |             |
   * | `longitude`            | `Float`   |             |
   * | `speed`                | `Float`   | Meters      |
   * | `heading`              | `Float`   | Degrees     |
   * | `accuracy`             | `Float`   | Meters      |
   * | `altitude`             | `Float`   | Meters      |
   * | `altitude_accuracy`    | `Float`   | Meters      |
   * | `timestamp`            | `String`  | ISO-8601    |
   * | `uuid`                 | `String`  | Unique ID   |
   * | `event`                | `String`  | `motionchange`, `geofence`, `heartbeat`, `providerchange` |
   * | `odometer`             | `Float`   | Meters      |
   * | `activity.type`        | `String`  | `still`, `on_foot`, `running`, `on_bicycle`, `in_vehicle`, `unknown` |
   * | `activity.confidence`  | `Integer` | 0–100%      |
   * | `battery.level`        | `Float`   | 0–100%      |
   * | `battery.is_charging`  | `Boolean` | Is device plugged in? |
   * | `mock`                 | `Boolean` | True if generated by mock provider |
   * | `is_moving`            | `Boolean` | Device was moving when recorded |
   * | `timestampMeta`        | `Object`  | Timestamp metadata; see {@link GeoConfig.enableTimestampMeta} |
   *
   * __ℹ️ See also__
   * - {@link HttpEvent | HTTP Guide}
   * - {@link geofenceTemplate}
   * - {@link HttpConfig.rootProperty}
   */
  locationTemplate?: string;

  /**
   * Optional custom template for rendering {@link GeofenceEvent}
   * JSON request data in HTTP uploads.
   *
   * The {@link geofenceTemplate} behaves like
   * {@link locationTemplate}, but includes two
   * additional tags: `geofence.identifier` and `geofence.action`.
   *
   * The template is evaluated using Ruby-style ERB tags:
   *
   * ```erb
   * <%= variable_name %>
   * ```
   *
   * **ℹ️ See also**
   * - {@link locationTemplate}
   * - {@link HttpConfig.rootProperty}
   * - {@link HttpEvent | HTTP Guide}
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.ready({
   *   persistence: {
   *     geofenceTemplate:
   *       '{ "lat":<%= latitude %>, "lng":<%= longitude %>, "geofence":"<%= geofence.identifier %>:<%= geofence.action %>" }'
   *   }
   * });
   *
   * // Or a compact Array form:
   * BackgroundGeolocation.ready({
   *   persistence: {
   *     geofenceTemplate:
   *       '[<%= latitude %>, <%= longitude %>, "<%= geofence.identifier %>", "<%= geofence.action %>"]'
   *   }
   * });
   * ```
   *
   * __⚠️ Quoting string data__
   *
   * The plugin does *not* automatically apply double-quotes around string
   * data. Templates are JSON-encoded **exactly as written**.
   *
   * Incorrect:
   *
   * ```typescript
   * BackgroundGeolocation.ready({
   *   persistence: {
   *     geofenceTemplate: '{"timestamp": <%= timestamp %>}'
   *   }
   * });
   * ```
   *
   * Produces invalid JSON:
   *
   * ```json
   * {"timestamp": 2018-01-01T12:01:01.123Z}
   * ```
   *
   * Correct:
   *
   * ```typescript
   * BackgroundGeolocation.ready({
   *   persistence: {
   *     geofenceTemplate: '{"timestamp": "<%= timestamp %>"}'
   *   }
   * });
   * ```
   *
   * ```json
   * {"timestamp": "2018-01-01T12:01:01.123Z"}
   * ```
   *
   * **Template Tags**
   *
   * Identical to {@link locationTemplate} with the
   * following additions:
   *
   * | Tag                      | Type     | Description |
   * |--------------------------|----------|-------------|
   * | `geofence.identifier`    | `String` | Identifier of the activated geofence |
   * | `geofence.action`        | `String` | `"ENTER"` or `"EXIT"` |
   * | `latitude`               | `Float`  |             |
   * | `longitude`              | `Float`  |             |
   * | `speed`                  | `Float`  | Meters      |
   * | `heading`                | `Float`  | Degrees     |
   * | `accuracy`               | `Float`  | Meters      |
   * | `altitude`               | `Float`  | Meters      |
   * | `altitude_accuracy`      | `Float`  | Meters      |
   * | `timestamp`              | `String` | ISO-8601    |
   * | `uuid`                   | `String` | Unique ID   |
   * | `event`                  | `String` | `motionchange`, `geofence`, `heartbeat`, `providerchange` |
   * | `odometer`               | `Float`  | Meters      |
   * | `activity.type`          | `String` | `still`, `on_foot`, `running`, `on_bicycle`, `in_vehicle`, `unknown` |
   * | `activity.confidence`    | `Integer`| 0–100%      |
   * | `battery.level`          | `Float`  | 0–100%      |
   * | `battery.is_charging`    | `Boolean`| Whether device is plugged in |
   * | `mock`                   | `Boolean`| True when location was generated from a mock app |
   * | `is_moving`              | `Boolean`| True if recorded while in *moving* state |
   * | `timestampMeta`          | `Object` | Timestamp metadata; see {@link GeoConfig.enableTimestampMeta} |
   */
  geofenceTemplate?: string;

  /**
   * Maximum number of days to retain a persisted geolocation record
   * in the plugin’s on-device SQLite database.
   *
   * When your server fails to return **HTTP 200 OK**, the SDK will continue
   * retrying uploads according to your {@link HttpConfig} settings. If a record
   * remains unuploaded for longer than **maxDaysToPersist**, it will be
   * permanently discarded to prevent unbounded database growth.
   *
   */
  maxDaysToPersist?: number;

  /**
   * Maximum number of records the SDK may retain in its on-device SQLite
   * database.
   *
   * A value of `-1` (default) means **no limit**. When a limit is set and the
   * number of stored records would exceed this value, the oldest records are
   * purged to make room for the newest.
   *
   * See {@link HttpEvent} for details on upload behavior.
   */
  maxRecordsToPersist?: number;

  /**
   * Sort order for persisted locations.
   * `'ASC'` = oldest first; `'DESC'` = newest first.
   */
  locationsOrderDirection?: 'ASC' | 'DESC';

  /**
   * Controls which event types the SDK will persist into its internal SQLite
   * database: locations, geofences, or both.
   *
   * All recorded events are always delivered to their live callbacks
   * ({@link BackgroundGeolocation.onLocation} and
   * {@link BackgroundGeolocation.onGeofence}). This option only determines
   * what is written to persistent storage. Events that are *not* persisted are
   * also *not* eligible for HTTP uploads via {@link HttpConfig.url}.
   *
   * | Name                                                     | Description                       |
   * |----------------------------------------------------------|-----------------------------------|
   * | {@link PersistMode.All}           | **Default** — persist both geofence and location events. |
   * | {@link PersistMode.Location}      | Persist **location** events only.                        |
   * | {@link PersistMode.Geofence}      | Persist **geofence** events only.                        |
   * | {@link PersistMode.None}          | Persist **nothing**.                                     |
   *
   * __Warning__:  
   * 
   * This option is intended for specialized cases. For example, if you need
   * continuous location tracking via {@link BackgroundGeolocation.start} but
   * only want to *store* geofence events, configure:
   * `persistMode: PersistMode.Geofence`.
   */
  persistMode?: PersistMode;

  /**
   * Optional arbitrary key/value pairs merged into **each** recorded location.
   *
   * These values are persisted and included in all HTTP uploads, making them
   * ideal for attaching contextual metadata such as `user_id`, `route_id`,
   * or `session_id`.
   *
   * __See also:__  
   * - 📘 {@link HttpEvent | HTTP Guide}
   *
   * __Example:__
   * ```typescript
   * BackgroundGeolocation.ready({
   *   http: {
   *     url: "https://my-server.com/locations",   
   *     params: {
   *       device_id: "abc123"  // <-- appended to root JSON of each POST request
   *     }
   *   },
   *   persistence: {
   *     extras: {
   *       route_id: 1234       // <-- merged onto each location record
   *     }
   *   }
   * });
   * ```
   *
   * __Incoming request at your server:__
   * ```json
   * POST /locations
   * {
   *   "device_id": "abc123",        // from `params`
   *   "location": {
   *     "coords": {
   *       "latitude": 45.51927004945047,
   *       "longitude": -73.61650072045029
   *     },
   *     "extras": {                 // from `extras`
   *       "route_id": 1234
   *     }
   *   }
   * }
   * ```
   */
  extras?: Record<string, any>;

  /**
   * __Android-only__  
   * Disable the automatic insertion of a synthetic “provider-change” location
   * into the SDK’s SQLite database (and its subsequent HTTP upload).
   *
   * By default, when an {@link BackgroundGeolocation.onProviderChange} event fires, the Android SDK
   * records a special location documenting *when* and *where* the device’s
   * location-services state changed (e.g., GPS disabled).  
   * This behavior historically existed to support platforms with limited or
   * unreliable Headless Task implementations (e.g., Cordova, Capacitor).
   *
   * Some developers have strict server-side JSON schemas or use
   * {@link locationTemplate}, making it impossible to accept the automatically
   * injected `provider` field. In these cases, set this flag to `true`.
   *
   * ![](https://www.dropbox.com/s/ljacoquuuv5sd5r/disableProviderChangeRecord.png?dl=1)
   *
   * __Example:__
   * ```typescript
   * BackgroundGeolocation.ready({
   *   persistence: {
   *     disableProviderChangeRecord: true
   *  }
   * });
   * ```
   */
  disableProviderChangeRecord?: boolean;
}
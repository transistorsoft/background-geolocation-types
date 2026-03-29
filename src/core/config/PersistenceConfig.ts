import { PersistMode } from '../../enums/PersistMode';

/**
 * Persistence and storage configuration for the background geolocation SDK.
 *
 * `PersistenceConfig` controls how the SDK stores, orders, templates, and purges
 * records in its on-device SQLite database — the durable buffer between data
 * producers (locations, geofences) and consumers (your app and the HTTP service).
 *
 * ## Contents
 * - [Overview](#overview)
 * - [Storage lifecycle](#storage-lifecycle)
 * - [Ordering](#ordering)
 * - [Templates](#templates)
 * - [Persist mode](#persist-mode)
 * - [Examples](#examples)
 *
 * ---
 *
 * ## Overview
 *
 * The SDK maintains an internal SQLite database as a rolling queue. Each recorded
 * {@link Location} and geofence event is written immediately, then consumed and
 * deleted by downstream services. The SDK prefers an empty database — records exist
 * only while awaiting upload or retrieval.
 *
 * | Category | Properties | Notes |
 * |----------|------------|-------|
 * | **Retention** | {@link maxDaysToPersist}, {@link maxRecordsToPersist} | TTL and count-based purge limits. |
 * | **Ordering** | {@link locationsOrderDirection} | Controls upload and retrieval order. |
 * | **Templates** | {@link locationTemplate}, {@link geofenceTemplate} | Custom JSON structure for uploads. |
 * | **Extras** | {@link extras} | Static key/value pairs merged into every record. |
 * | **Persist mode** | {@link persistMode} | Which event types are written to SQLite. |
 * | **Diagnostics** | {@link disableProviderChangeRecord} | Suppress provider-change records. |
 *
 * @example
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
 * ---
 *
 * ## Storage lifecycle
 *
 * Records are written to SQLite immediately upon recording and deleted when **any**
 * of the following occur:
 *
 * - Your server returns a `20x` response for the HTTP upload (see {@link HttpConfig})
 * - You call {@link BackgroundGeolocation.destroyLocations}
 * - {@link maxDaysToPersist} elapses (rolling TTL purge)
 * - {@link maxRecordsToPersist} would be exceeded (oldest records are dropped)
 *
 * Inspect the pending queue with {@link BackgroundGeolocation.getCount} or
 * {@link BackgroundGeolocation.getLocations}.
 *
 * ---
 *
 * ## Ordering
 *
 * {@link locationsOrderDirection} controls the order in which records are selected
 * for upload or returned by {@link BackgroundGeolocation.getLocations}:
 *
 * - `"ASC"` — oldest first (default)
 * - `"DESC"` — newest first
 *
 * ---
 *
 * ## Templates
 *
 * By default the SDK serializes locations and geofence events using its standard
 * JSON schema. Use {@link locationTemplate} and {@link geofenceTemplate} to
 * substitute a custom ERB template that reshapes the JSON to match your backend.
 *
 * Use {@link extras} to merge static key/value metadata into every record at write
 * time, without a custom template.
 *
 * ---
 *
 * ## Persist mode
 *
 * {@link persistMode} controls which event types are written to SQLite. All events
 * are still delivered to their live callbacks ({@link BackgroundGeolocation.onLocation},
 * {@link BackgroundGeolocation.onGeofence}) regardless of this setting. Events that
 * are not persisted are not eligible for HTTP uploads via {@link HttpConfig.url}.
 *
 * The `persist` option on individual API calls can override this setting per-request:
 *
 * @example
 * ```ts
 * const location = await BackgroundGeolocation.getCurrentPosition({
 *   persist: true,
 *   extras: { get_current_position: true },
 *   samples: 3,
 * });
 * ```
 *
 * ---
 *
 * ## Examples
 *
 * @example Configure persistence behavior
 * ```ts
 * const state = await BackgroundGeolocation.ready({
 *   persistence: {
 *     maxDaysToPersist: 14,
 *     maxRecordsToPersist: 5000,
 *     locationsOrderDirection: 'ASC',
 *     persistMode: PersistMode.All,
 *     extras: { user_id: 123, appVersion: '1.2.3' },
 *   },
 *   http: {
 *     url: 'https://example.com/locations',
 *     autoSync: true,
 *   }
 * });
 * ```
 *
 * @example Inspect and purge the database
 * ```ts
 * const pending = await BackgroundGeolocation.getCount();
 * console.log('Pending records:', pending);
 *
 * // Purge all records
 * const ok = await BackgroundGeolocation.destroyLocations();
 * console.log('Destroyed all records?', ok);
 * ```
 *
 * @example Custom JSON templates
 * ```ts
 * BackgroundGeolocation.ready({
 *   persistence: {
 *     locationTemplate: `{
 *       "lat": <%= latitude %>,
 *       "lng": <%= longitude %>,
 *       "ts": "<%= timestamp %>",
 *       "meta": <%= JSON.stringify(extras) %>
 *     }`,
 *     geofenceTemplate: `{
 *       "id": "<%= identifier %>",
 *       "action": "<%= action %>",
 *       "ts": "<%= timestamp %>"
 *     }`,
 *   },
 * });
 * ```
 *
 * @category Config
 */
export interface PersistenceConfig {
  /**
   * Optional custom ERB template for reshaping {@link Location} JSON in HTTP uploads.
   *
   * When set, the SDK evaluates the template string against each location record
   * before serializing it. Use Ruby-style ERB tags to interpolate field values:
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
   * ## ⚠️ Warning
   *
   * The SDK does not automatically insert quotes around string values. Templates
   * are JSON-encoded exactly as written.
   *
   * The following produces invalid JSON because `timestamp` is a string but is
   *
   * @example
   * ```ts
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
   * @example
   * ```ts
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
   * ## Configured {@link PersistenceConfig.extras | extras}
   *
   * If {@link extras} are configured, the key/value pairs are merged directly
   * into the rendered location JSON.
   *
   * @example
   * ```ts
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
   * ## Template tags
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
   * **See also**
   * - {@link HttpEvent | HTTP Guide}
   * - {@link geofenceTemplate}
   * - {@link HttpConfig.rootProperty}
   */
  locationTemplate?: string;

  /**
   * Optional custom ERB template for reshaping {@link GeofenceEvent} JSON in HTTP uploads.
   *
   * Behaves like {@link locationTemplate} but includes two additional tags:
   * `geofence.identifier` and `geofence.action`. Use Ruby-style ERB tags to
   * interpolate field values:
   *
   * ```erb
   * <%= variable_name %>
   * ```
   *
   * @example
   * ```ts
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
   * ## ⚠️ Warning
   *
   * The SDK does not automatically apply double-quotes around string data.
   * Templates are JSON-encoded exactly as written.
   *
   * @example Incorrect
   * ```ts
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
   * @example Correct
   * ```ts
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
   * ## Template tags
   *
   * Identical to {@link locationTemplate} with the following additions:
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
   *
   * **See also**
   * - {@link locationTemplate}
   * - {@link HttpConfig.rootProperty}
   * - {@link HttpEvent | HTTP Guide}
   */
  geofenceTemplate?: string;

  /**
   * Maximum number of days to retain a persisted record in the SDK's on-device
   * SQLite database. Defaults to `1` day.
   *
   * When your server fails to return a `20x` response, the SDK continues retrying
   * uploads. If a record remains unuploaded for longer than `maxDaysToPersist` days,
   * it is permanently discarded to prevent unbounded database growth.
   */
  maxDaysToPersist?: number;

  /**
   * Maximum number of records the SDK may retain in its on-device SQLite database.
   * Defaults to `-1` (no limit).
   *
   * When a limit is set and the stored record count would exceed it, the oldest
   * records are purged to make room for the newest.
   *
   * See {@link HttpEvent} for details on upload behavior.
   */
  maxRecordsToPersist?: number;

  /**
   * Sort order used when selecting records for upload or returning them from
   * {@link BackgroundGeolocation.getLocations}. Defaults to `"ASC"` (oldest first).
   *
   * - `"ASC"` — oldest records first
   * - `"DESC"` — newest records first
   */
  locationsOrderDirection?: 'ASC' | 'DESC';

  /**
   * Controls which event types the SDK writes to its internal SQLite database.
   * Defaults to {@link PersistMode.All}.
   *
   * All recorded events are always delivered to their live callbacks
   * ({@link BackgroundGeolocation.onLocation} and
   * {@link BackgroundGeolocation.onGeofence}). This setting only determines
   * what is written to persistent storage. Events that are not persisted are
   * also not eligible for HTTP uploads via {@link HttpConfig.url}.
   *
   * | Value | Description |
   * |-------|-------------|
   * | {@link PersistMode.All} | **Default** — persist both location and geofence events. |
   * | {@link PersistMode.Location} | Persist location events only. |
   * | {@link PersistMode.Geofence} | Persist geofence events only. |
   * | {@link PersistMode.None} | Persist nothing. |
   *
   * ## ⚠️ Warning
   *
   * This setting is intended for specialized cases. For example, if you need
   * continuous location tracking via {@link BackgroundGeolocation.start} but only
   * want to store geofence events, configure `persistMode: PersistMode.Geofence`.
   */
  persistMode?: PersistMode;

  /**
   * Optional arbitrary key/value pairs merged into each recorded location at
   * write time.
   *
   * These values are persisted and included in all HTTP uploads, making them
   * ideal for attaching static contextual metadata such as `user_id`, `route_id`,
   * or `session_id`.
   *
   * **See also**
   * - {@link HttpEvent | HTTP Guide}
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   http: {
   *     url: "https://my-server.com/locations",
   *     params: {
   *       device_id: "abc123"  // appended to root JSON of each POST request
   *     }
   *   },
   *   persistence: {
   *     extras: {
   *       route_id: 1234       // merged onto each location record
   *     }
   *   }
   * });
   * ```
   *
   * The resulting HTTP request body:
   * ```json
   * POST /locations
   * {
   *   "device_id": "abc123",
   *   "location": {
   *     "coords": {
   *       "latitude": 45.51927004945047,
   *       "longitude": -73.61650072045029
   *     },
   *     "extras": {
   *       "route_id": 1234
   *     }
   *   }
   * }
   * ```
   */
  extras?: Record<string, any>;

  /**
   * Disables the automatic insertion of a synthetic "provider-change" location
   * into the SDK's SQLite database and its subsequent HTTP upload. [Android only]
   *
   * By default, when an {@link BackgroundGeolocation.onProviderChange} event fires,
   * the Android SDK records a special location documenting when and where the
   * device's location-services state changed (e.g., GPS disabled). This behavior
   * historically existed to support platforms with limited or unreliable Headless
   * Task implementations (e.g., Cordova, Capacitor).
   *
   * Set this to `true` if your server-side JSON schema or {@link locationTemplate}
   * cannot accommodate the automatically injected `provider` field.
   *
   * ![](https://www.dropbox.com/s/ljacoquuuv5sd5r/disableProviderChangeRecord.png?dl=1)
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   persistence: {
   *     disableProviderChangeRecord: true
   *  }
   * });
   * ```
   */
  disableProviderChangeRecord?: boolean;
}

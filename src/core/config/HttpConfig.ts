
import { HttpMethod } from '../../enums/HttpMethod';

/**
 * HTTP and networking configuration for the background geolocation SDK.
 *
 * `HttpConfig` controls how recorded locations are uploaded to your server —
 * the endpoint, HTTP verb, headers, params, batching behaviour, and request timeouts.
 *
 * ### Contents
 * - [Overview](#overview)
 * - [Upload lifecycle](#upload-lifecycle)
 * - [Payload composition](#payload-composition)
 * - [Sync strategy](#sync-strategy)
 * - [Error handling](#error-handling)
 * - [Remote control](#remote-control)
 * - [Logging](#logging)
 * - [Migration](#migration)
 * - [Examples](#examples)
 *
 * ---
 *
 * ### Overview
 *
 * The SDK persistently stores each recorded location in an internal SQLite
 * database before attempting to upload it. The HTTP service continuously
 * consumes this queue in the background, surviving app termination and device
 * reboot. When connectivity returns it resumes automatically.
 *
 * | Category | Properties | Notes |
 * |----------|------------|-------|
 * | **Destination** | {@link url}, {@link method} | `method` defaults to `POST`. |
 * | **Payload** | {@link rootProperty}, {@link params}, {@link headers} | Controls JSON body and headers. |
 * | **Sync cadence** | {@link autoSync}, {@link autoSyncThreshold}, {@link batchSync}, {@link maxBatchSize} | Immediate vs batched uploads. |
 * | **Network policy** | {@link disableAutoSyncOnCellular}, {@link timeout} | Conserve bandwidth and battery. |
 *
 * @example
 * ```ts
 * BackgroundGeolocation.ready({
 *   http: {
 *     url: "https://api.example.com/locations",
 *     autoSync: true,
 *     params: { user_id: 1234 }
 *   }
 * });
 * ```
 *
 * ---
 *
 * ### Upload lifecycle
 *
 * Each location follows this path from recording to delivery:
 *
 * 1. A location is recorded and immediately rendered to JSON — using the default schema or
 *    {@link PersistenceConfig.locationTemplate} if configured — then written to SQLite.
 * 2. A **record-level lock** is acquired to prevent duplicate uploads.
 * 3. The stored JSON is read from SQLite and posted to {@link url}.
 * 4. A **2xx** response marks the record as delivered — it is deleted from the database.
 * 5. On failure, the lock is released and the record is retried later.
 *
 * The SQLite buffer acts as a rolling queue and is normally empty. Records are removed when:
 * - your server returns a 2xx (see {@link HttpEvent})
 * - {@link BackgroundGeolocation.destroyLocations} is called
 * - TTL from {@link PersistenceConfig.maxDaysToPersist} expires
 * - {@link PersistenceConfig.maxRecordsToPersist} is exceeded
 *
 * Inspect queue size with {@link BackgroundGeolocation.getCount} or fetch
 * records with {@link BackgroundGeolocation.getLocations}.
 *
 * ---
 *
 * ### Payload composition
 *
 * - **Body:** JSON. If {@link batchSync} is `true`, an array of records is sent.
 *   If {@link rootProperty} is set, the payload becomes `{ "<rootProperty>": [...] }`.
 * - **Headers:** Merged from {@link headers} plus any authorization headers
 *   injected by {@link AuthorizationConfig}.
 * - **Params:** Merged into every payload at the root level, or under
 *   {@link rootProperty} if configured.
 *
 * Uploads use `application/json`. Authorization refresh requests use
 * `application/x-www-form-urlencoded`.
 *
 * ---
 *
 * ### Sync strategy
 *
 * | Option | Behaviour |
 * |--------|-----------|
 * | {@link autoSync} | Upload immediately after each recorded location. |
 * | {@link autoSyncThreshold} | Wait until N records are queued before uploading. |
 * | {@link batchSync} | Bundle all queued records into a single HTTP request. |
 * | {@link maxBatchSize} | Cap the number of records per batch request. |
 * | {@link disableAutoSyncOnCellular} | Defer uploads until Wi-Fi is available. |
 * | {@link timeout} | Abort requests exceeding this duration (ms). |
 *
 * ---
 *
 * ### Error handling
 *
 * On a non-2xx response or network failure, records remain locked in the queue
 * and are retried when:
 * - new locations are recorded
 * - the app resumes or the device reboots
 * - {@link BackgroundGeolocation.onConnectivityChange} fires
 * - {@link BackgroundGeolocation.onHeartbeat} fires
 * - iOS background fetch runs
 *
 * To trigger a manual upload at any time:
 *
 * @example Manual sync
 * ```ts
 * await BackgroundGeolocation.sync();
 * ```
 *
 * ---
 *
 * ### Remote control
 *
 * Your server can instruct the SDK to execute commands by including a
 * `background_geolocation` key in any HTTP response body.
 *
 * @example
 * ```json
 * {
 *   "background_geolocation": [
 *     ["setConfig", { "geolocation": { "distanceFilter": 25 } }],
 *     ["start"]
 *   ]
 * }
 * ```
 *
 * | Command | Arguments | Effect |
 * |---------|-----------|--------|
 * | `"start"` | — | {@link BackgroundGeolocation.start} |
 * | `"stop"` | — | {@link BackgroundGeolocation.stop} |
 * | `"startGeofences"` | — | {@link BackgroundGeolocation.startGeofences} |
 * | `"changePace"` | `boolean` | {@link BackgroundGeolocation.changePace} |
 * | `"setConfig"` | `{Config}` | {@link BackgroundGeolocation.setConfig} |
 * | `"addGeofence"` | `{Geofence}` | {@link BackgroundGeolocation.addGeofence} |
 * | `"addGeofences"` | `[{Geofence}, ...]` | {@link BackgroundGeolocation.addGeofences} |
 * | `"removeGeofence"` | `identifier: string` | {@link BackgroundGeolocation.removeGeofence} |
 * | `"removeGeofences"` | list or none | Remove some or all geofences. |
 * | `"uploadLog"` | `url: string` | Upload the plugin log. |
 * | `"destroyLog"` | — | Delete the plugin log. |
 *
 * ---
 *
 * ### Logging
 *
 * The SDK log provides a trace of the full HTTP lifecycle:
 *
 * ```
 * Location
 * INSERT: record stored
 * Locked 1 records
 * HTTP POST
 * Response: 200
 * DESTROY
 * ```
 *
 * | # | Entry | Meaning |
 * |:-:|-------|---------|
 * | 1 | Location | Raw location recorded |
 * | 2 | INSERT | Persisted to SQLite |
 * | 3 | Locked | Marked for upload |
 * | 4 | HTTP POST/PUT | Upload attempted |
 * | 5 | Response | Server status code |
 * | 6 | DESTROY / UNLOCK | Delivered / failed, queued for retry |
 *
 * ---
 *
 * ### Migration
 *
 * HTTP options previously lived at the root of `Config`. They are now grouped
 * under the `http` key. Legacy flat keys remain available but are **deprecated**
 * and will be removed in a future major release.
 *
 * @example Legacy flat Config
 * ```ts
 * BackgroundGeolocation.ready({
 *   url: "https://api.example.com",
 *   autoSync: true,
 *   headers: { Authorization: "Bearer ..." }
 * });
 * ```
 *
 * @example New compound Config
 * ```ts
 * BackgroundGeolocation.ready({
 *   http: {
 *     url: "https://api.example.com",
 *     autoSync: true,
 *     headers: { Authorization: "Bearer ..." }
 *   }
 * });
 * ```
 *
 * ---
 *
 * ### Examples
 *
 * @example Simple upload
 * ```ts
 * BackgroundGeolocation.ready({
 *   http: {
 *     url: "https://api.example.com/locations",
 *     method: "POST",
 *     autoSync: true,
 *     headers: { Authorization: "Bearer secret" },
 *     params: { device_id: "abc-123" }
 *   }
 * });
 * ```
 *
 * @example Batched uploads
 * ```ts
 * BackgroundGeolocation.ready({
 *   http: {
 *     url: "https://api.example.com/locations/bulk",
 *     batchSync: true,
 *     maxBatchSize: 25,
 *     autoSyncThreshold: 10,
 *     rootProperty: "locations"
 *   }
 * });
 * ```
 *
 * @example Conserve cellular data
 * ```ts
 * BackgroundGeolocation.ready({
 *   http: {
 *     url: "https://api.example.com/locations",
 *     autoSync: true,
 *     disableAutoSyncOnCellular: true
 *   }
 * });
 * ```
 *
 * @example Manual sync
 * ```ts
 * await BackgroundGeolocation.setConfig({
 *   http: { url: "https://api.example.com", autoSync: false }
 * });
 * await BackgroundGeolocation.sync();
 * ```
 *
 * @category Config
 */
export interface HttpConfig {
  /**
   * The server URL where the SDK posts recorded locations.
   *
   * The SDK hosts a robust HTTP service that continuously uploads recorded
   * locations to your server in the background, surviving app termination and
   * device reboot.
   *
   * ### Warning
   * Use the SDK's built-in HTTP service rather than posting locations from your
   * own code. When {@link AppConfig.stopOnTerminate} is `false`, your app
   * component terminates but the native background service continues recording
   * and uploading. The SDK automatically retries on failure — ad-hoc HTTP
   * requests from application code cannot provide the same reliability.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.onHttp((event) => {
   *   console.log("[onHttp]", event);
   * });
   *
   * BackgroundGeolocation.ready({
   *   http: {
   *     url: "https://my-server.com/locations",
   *     params: { user_id: 1234 },
   *     headers: { Authorization: "Basic my-secret-key" },
   *     autoSync: true,
   *     method: "POST"
   *   }
   * });
   * ```
   */
  url?: string;

  /**
   * HTTP headers applied to every outbound upload request.
   *
   * The supplied headers are merged with the SDK's automatically applied headers
   * (including `"content-type": "application/json"`). When {@link AuthorizationConfig}
   * is configured, the SDK also injects an `Authorization` header automatically.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   http: {
   *     url: "https://my.server.com",
   *     headers: {
   *       Authorization: "Bearer <a secret key>",
   *       "X-FOO": "BAR"
   *     }
   *   }
   * });
   * ```
   *
   * Incoming request headers at your server:
   *
   * ```text
   * POST /locations
   * {
   *   "host": "tracker.transistorsoft.com",
   *   "content-type": "application/json",
   *   "content-length": "456",
   *   ...
   *   "authorization": "Bearer <a secret key>",
   *   "X-FOO": "BAR"
   * }
   * ```
   *
   * **See also**
   * - {@link AuthorizationConfig}
   */
  headers?: Record<string, string>;

  /**
   * Key/value pairs merged into the JSON body of every outbound upload request.
   *
   * Params are merged at the root level of the payload, or nested under
   * {@link rootProperty} when that is configured.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   http: {
   *     url: "https://my-server.com/locations",
   *     params: {
   *       user_id: 1234,
   *       device_id: "abc123"
   *     }
   *   }
   * });
   * ```
   *
   * Request body received by your server:
   *
   * ```json
   * {
   *   "location": {
   *     "coords": {
   *       "latitude": 45.51927,
   *       "longitude": -73.61650
   *     }
   *   },
   *   "user_id": 1234,
   *   "device_id": "abc123"
   * }
   * ```
   *
   * **See also**
   * - {@link rootProperty}
   */
  params?: Record<string, any>;

  /**
   * The HTTP method used when uploading locations to {@link url}.
   *
   * Defaults to `POST`. Valid values: `POST`, `PUT`, `PATCH`.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   http: {
   *     url: "https://my-server.com/locations",
   *     method: "PUT"
   *   }
   * });
   * ```
   */
  method?: HttpMethod;

  /**
   * Uploads each recorded location to {@link url} immediately after it is recorded.
   *
   * Defaults to `true`. When a {@link url} is configured, the SDK attempts to
   * upload each location as soon as it is written to SQLite. All recorded locations
   * are persisted in the internal database until successfully delivered, regardless
   * of this setting.
   *
   * When `autoSync` is `false`, call {@link BackgroundGeolocation.sync} to trigger
   * uploads manually.
   *
   * ### Note
   * With `autoSync: false`, the queue grows until you call
   * {@link BackgroundGeolocation.sync} or until uploads succeed automatically
   * on the next retry trigger.
   *
   * **See also**
   * - {@link autoSyncThreshold}
   * - {@link batchSync}
   * - {@link maxBatchSize}
   */
  autoSync?: boolean;

  /**
   * Minimum number of queued records required before an automatic upload fires.
   *
   * Defaults to `0` (no threshold — upload after every recorded location).
   *
   * When set above `0`, the SDK waits until at least this many locations are
   * queued before uploading. Combining `autoSyncThreshold` with {@link batchSync}
   * significantly reduces battery consumption by minimizing the number of HTTP
   * requests.
   *
   * ### Warning
   * `autoSyncThreshold` is ignored during {@link BackgroundGeolocation.onMotionChange}
   * transitions. When the device enters the *moving* state, any queued locations
   * are uploaded immediately. When it enters the *stationary* state, all remaining
   * queued locations are flushed before the SDK goes idle.
   *
   * **See also**
   * - {@link autoSync}
   * - {@link batchSync}
   */
  autoSyncThreshold?: number;

  /**
   * Defers automatic uploads until the device is on Wi-Fi.
   *
   * Defaults to `false`. When `true`, {@link autoSync} uploads occur only when
   * a Wi-Fi connection is active. Locations continue to be recorded and queued
   * while on cellular — they are uploaded once Wi-Fi becomes available.
   *
   * ### Warning
   * This setting is ignored when calling {@link BackgroundGeolocation.sync}
   * manually. Manual syncs always proceed regardless of connection type.
   *
   * **See also**
   * - {@link autoSync}
   * - {@link BackgroundGeolocation.sync}
   */
  disableAutoSyncOnCellular?: boolean;

  /**
   * Bundles all queued locations into a single HTTP request.
   *
   * Defaults to `false`. When `true`, the SDK sends all records currently in the
   * SQLite queue in one HTTP request rather than one request per location. Use
   * {@link maxBatchSize} to cap the number of records per request.
   *
   * Batching is most effective when combined with {@link autoSyncThreshold} to
   * reduce upload frequency and conserve power.
   *
   * **See also**
   * - {@link autoSync}
   * - {@link autoSyncThreshold}
   * - {@link maxBatchSize}
   */
  batchSync?: boolean;

  /**
   * Maximum number of records included in each batched HTTP request.
   *
   * Defaults to `-1` (no limit — all queued records in one request).
   *
   * When {@link batchSync} is `true` and the queue exceeds `maxBatchSize`, the
   * SDK generates multiple requests until the queue is fully drained. This
   * prevents excessively large request bodies after the device has been offline
   * for an extended period.
   *
   * **See also**
   * - {@link batchSync}
   */
  maxBatchSize?: number;

  /**
   * Wraps the location payload under a named root key in the JSON body.
   *
   * Defaults to `"location"`. When set, outgoing payloads nest the serialized
   * location record under this key:
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   http: {
   *     rootProperty: "myData",
   *     url: "https://my.server.com",
   *   }
   * });
   * ```
   *
   * Produces:
   *
   * ```json
   * {
   *   "myData": {
   *     "coords": {
   *       "latitude": 23.232323,
   *       "longitude": 37.373737
   *     }
   *   }
   * }
   * ```
   *
   * Set to `"."` to place the location data directly at the root of the JSON body:
   *
   * ```json
   * {
   *   "coords": {
   *     "latitude": 23.232323,
   *     "longitude": 37.373737
   *   }
   * }
   * ```
   *
   * **See also**
   * - {@link PersistenceConfig.locationTemplate}
   * - {@link PersistenceConfig.geofenceTemplate}
   */
  rootProperty?: string;

  /**
   * HTTP request timeout in milliseconds.
   *
   * Defaults to `60000` ms (60 seconds). When a request exceeds this duration,
   * the SDK fires {@link BackgroundGeolocation.onHttp} with a failure event and
   * the record is unlocked for retry.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.onHttp((response) => {
   *   if (!response.success) {
   *     console.log("[onHttp] FAILURE:", response);
   *   }
   * });
   *
   * BackgroundGeolocation.ready({
   *   http: {
   *     url: "https://my-server.com/locations",
   *     timeout: 3000
   *   }
   * });
   * ```
   */
  timeout?: number;
}


import { HttpMethod } from '../../enums/HttpMethod';

/**
 * **HTTP / Networking Configuration**
 *
 * The {@link HttpConfig} group controls how recorded locations are uploaded to
 * your server. It defines the endpoint, HTTP verb, headers, params, batching
 * behavior, and request timeouts.
 *
 * These options apply to all automatic syncs as well as manual syncs triggered
 * by the app.
 *
 * @example
 * ```ts
 * BackgroundGeolocation.ready({
 *   http: {
 *     url: "https://example.com/locations",
 *     autoSync: true,
 *     params: { user_id: 1234 }
 *   }
 * });
 * ```
 *
 * **Overview**
 *
 * The SDK persistently stores each recorded location in its internal SQLite
 * database before attempting to upload it. The HTTP Service continuously consumes
 * this queue of stored records in the background. For each record:
 *
 * 1. A **record-level lock** is acquired to prevent duplicate uploads.  
 * 2. The record is serialized into an HTTP request and posted to {@link url}.  
 * 3. A **2xx** response marks the record as delivered and it is deleted.  
 * 4. Failed or timed-out uploads remain locked until released for retry.  
 *
 * The uploader operates automatically across:
 *
 * - background execution  
 * - app termination  
 * - device reboot  
 *
 * When connectivity returns, it resumes processing any remaining records.
 *
 * | Area            | Keys                                        | Notes |
 * |-----------------|----------------------------------------------|-------|
 * | **Destination** | {@link url}, {@link method}                             | `method` defaults to `POST`. |
 * | **Payload**     | {@link rootProperty}, {@link params}, {@link headers}          | Controls JSON body and headers. |
 * | **Sync cadence** | {@link autoSync}, {@link autoSyncThreshold}, {@link batchSync}, {@link maxBatchSize} | Immediate vs batched uploads. |
 * | **Network policy** | {@link disableAutoSyncOnCellular}, {@link timeout}   | Conserve bandwidth and battery. |
 *
 * **How uploads work**
 *
 * 1. Each location is written to SQLite.  
 * 2. Pending records are locked for upload.  
 * 3. Locked records are sent to {@link url}.  
 * 4. On success (2xx), the record is deleted.  
 * 5. On failure, the record is unlocked and retried later.  
 *
 * **The SQLite buffer**
 *
 * The storage acts as a rolling buffer and is normally empty. Records disappear
 * when:
 *
 * - your server returns a 2xx (see {@link HttpEvent})  
 * - {@link BackgroundGeolocation.destroyLocations} is called  
 * - TTL from {@link PersistenceConfig.maxDaysToPersist} expires  
 * - {@link PersistenceConfig.maxRecordsToPersist} is exceeded  
 *
 * Inspect queue size using {@link BackgroundGeolocation.getCount} or fetch with
 * {@link BackgroundGeolocation.getLocations}.
 *
 * **Payload composition**
 *
 * - **Body:** JSON. If `batchSync` is `true`, an array of records is sent.  
 *   If `rootProperty` is set, payload becomes:
 *
 *   ```json
 *   { "<rootProperty>": [...] }
 *   ```
 *
 * - **Headers:** Combined from {@link headers} plus authorization if
 *   configured.
 *
 * - **Params:** Added to every payload at the root or under `rootProperty`.
 *
 * Uploads use `application/json`; authorization refresh requests use
 * `application/x-www-form-urlencoded`.
 *
 * **Sync strategy**
 *
 * - `autoSync`: upload after each record  
 * - `autoSyncThreshold`: wait for N records  
 * - `batchSync`: upload several records in one request  
 * - `maxBatchSize`: max records per batch  
 * - `timeout`: maximum HTTP duration  
 * - `disableAutoSyncOnCellular`: defer uploads until Wi-Fi  
 *
 * **Error handling & retries**
 *
 * On non-2xx or network failure, records remain in queue and are retried when:
 *
 * - new locations arrive  
 * - app resumes / device boots  
 * - {@link BackgroundGeolocation.onConnectivityChange} fires  
 * - {@link BackgroundGeolocation.onHeartbeat} fires  
 * - iOS background fetch runs  
 *
 * Or manually:
 *
 * @example Manual sync
 * ```ts
 * await BackgroundGeolocation.sync();
 * ```
 *
 * **HTTP Logging**
 *
 * Logs provide insight into HTTP behavior:
 *
 * ```text
 * 📍 Location
 * ✅ INSERT: record stored
 * 🔒 Locked 1 records
 * 🔵 HTTP POST
 * 🔵 Response: 200
 * ✅ DESTROY
 * ```
 *
 * | # | Entry                     | Meaning |
 * |:-:|---------------------------|---------|
 * | 1 | `📍 Location`             | Raw location recorded |
 * | 2 | `INSERT`                 | Persisted to SQLite |
 * | 3 | `Locked`                 | Marked for upload |
 * | 4 | `HTTP POST/PUT`          | Attempted upload |
 * | 5 | `Response`               | Server status |
 * | 6 | `DESTROY` / `UNLOCK`     | Success / failed retry |
 *
 * **Remote control via HTTP response (RPC)**
 *
 * Your server may instruct the SDK to execute commands by returning JSON
 * containing a `background_geolocation` payload.
 *
 * **Multiple commands**
 * ```json
 * {
 *   "background_geolocation": [
 *     ["setConfig", { "geolocation": { "distanceFilter": 25 } }],
 *     ["start"]
 *   ]
 * }
 * ```
 *
 * **Single command**
 * ```json
 * { "background_geolocation": ["stop"] }
 * ```
 *
 * **Supported remote commands**
 *
 * | Command           | Arguments                  | Effect |
 * |-------------------|----------------------------|--------|
 * | `"start"`         | —                          | {@link BackgroundGeolocation.start} |
 * | `"stop"`          | —                          | {@link BackgroundGeolocation.stop} |
 * | `"startGeofences"`| —                          | {@link BackgroundGeolocation.startGeofences} |
 * | `"changePace"`    | boolean                    | {@link BackgroundGeolocation.changePace} |
 * | `"setConfig"`     | `{Config}`                 | {@link BackgroundGeolocation.setConfig} |
 * | `"addGeofence"`   | `{Geofence}`               | {@link BackgroundGeolocation.addGeofence} |
 * | `"addGeofences"`  | `[{Geofence}, ...]`        | {@link BackgroundGeolocation.addGeofences} |
 * | `"removeGeofence"`| `identifier:string`        | {@link BackgroundGeolocation.removeGeofence} |
 * | `"removeGeofences"`| list or none             | remove all or some |
 * | `"uploadLog"`     | `url:string`               | upload plugin log |
 * | `"destroyLog"`    | —                          | delete plugin log |
 *
 * **Examples**
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
 *     autoSync: true,
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
 *
 * await BackgroundGeolocation.sync();
 * ```
 *
 * **Migration from legacy flat Config**
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
 * Legacy keys remain available but are **@deprecated** and will be removed in a
 * future major release.
 *
 * @category Config
 */
export interface HttpConfig {
  /**
   * Server URL where you want the SDK to post recorded locations.
   *
   * Both the iOS and Android native code host their own robust HTTP service
   * which can automatically upload recorded locations to your server. This is
   * particularly important on **Android** when running headless with
   * {@link AppConfig.stopOnTerminate} set to `false`, since only the plugin's
   * background service continues running in that state.
   *
   * @example
   * ```ts
   * // Listen to HTTP events.
   * BackgroundGeolocation.onHttp((event) => {
   *   console.log("[onHttp]", event);
   * });
   *
   * BackgroundGeolocation.ready({
   *   http: {
   *     url: "https://my-server.com/locations",
   *     params: {
   *       user_id: 1234
   *     },
   *     headers: {
   *       Authorization: "Basic my-secret-key"
   *     },
   *     autoSync: true,
   *     method: "POST"
   *   },
   *   app: {
   *     stopOnTerminate: false
   *   }
   * });
   * ```
   *
   * __Warning:__ It is highly recommended to let the SDK manage uploads to your
   * server, **especially on Android** when {@link AppConfig.stopOnTerminate} is
   * `false`. In that mode your application component *will* terminate—only the
   * native Android background service continues operating, recording locations
   * and posting them to your server. The SDK’s HTTP service automatically
   * retries on failures and is more reliable for background delivery than
   * ad-hoc HTTP requests from your own code.
   *
   * See the HTTP guide under {@link HttpConfig} for full examples, error
   * handling, and payload structure.
   */
  url?: string;

  /**
   * Optional HTTP headers applied to every outbound upload request.
   *
   * These headers are merged with the SDK’s automatically applied headers
   * (such as `"content-type": "application/json"`). When using authorization,
   * the SDK also injects an `Authorization` header as needed.
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
   * Observing incoming requests at your server:
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
   * **Note:**  
   * The SDK automatically applies several required headers, including:
   * - `"content-type": "application/json"`
   * - authorization headers when using {@link AuthorizationConfig}
   *
   * __See also:__ the **HTTP Guide** under {@link HttpConfig}.
   */
  headers?: Record<string, string>;

  /**
   * Optional HTTP **`params`** appended to the JSON body of each outbound upload request.
   *
   * These key/value pairs are merged into the payload sent to your server
   * (either at the root level or under `rootProperty`, if configured).
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
   * Example request body received by your server:
   *
   * ```json
   * {
   *   "location": {
   *     "coords": {
   *       "latitude": 45.51927,
   *       "longitude": -73.61650
   *       // ...
   *     }
   *   },
   *   "user_id": 1234,      // <-- params merged into the payload
   *   "device_id": "abc123"
   * }
   * ```
   *
   * __See also:__ the **HTTP Guide** under {@link HttpConfig}.
   */
  params?: Record<string, any>;

  /**
   * The HTTP method used when uploading locations to your configured {@link url}.
   *
   * Defaults to **`POST`**.  
   * 
   * Valid values: **`POST`**, **`PUT`**, **`OPTIONS`**.
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
   * Immediately upload each recorded location to your configured {@link url}.
   *
   * Defaults to **`true`**.
   *
   * When `autoSync` is enabled and a {@link url} is provided, the SDK
   * will attempt to upload each location **as soon as it is recorded**.
   *
   * If you set `autoSync: false`, you must manually call
   * {@link BackgroundGeolocation.sync} to initiate uploads.  
   * Regardless of `autoSync`, *all* recorded locations are persisted in the
   * SDK’s internal SQLite database until successfully delivered.
   *
   * __Note:__ The queue continues to grow until you call {@link BackgroundGeolocation.sync} or until uploads succeed.
   *
   * **See also**
   * - {@link autoSyncThreshold}
   * - {@link batchSync}
   * - {@link maxBatchSize}
   * - HTTP Guide at {@link HttpConfig}
   */
  autoSync?: boolean;

  /**
   * The minimum number of persisted records the plugin must accumulate
   * before triggering an automatic upload via {@link autoSync}.
   *
   * Defaults to **`0`** (no threshold).
   *
   * When set to a value greater than `0`, the SDK will wait until at least that
   * many locations are recorded before uploading to your configured
   * {@link url}.  
   *  
   * Using `autoSyncThreshold` together with {@link batchSync} can
   * significantly **reduce battery consumption**, since batching minimizes the
   * number of HTTP requests (which cost far more power than GPS work).
   *
   *
   * __⚠️ Warning:__ Ignored during `onMotionChange`
   *
   * If you've configured `autoSyncThreshold`, it will be **ignored** during
   * {@link BackgroundGeolocation.onMotionChange} transitions:
   *
   * - Entering the **moving** state:  
   *   The device may have been dormant for a long time; the SDK eagerly uploads
   *   queued locations immediately.
   *
   * - Entering the **stationary** state:  
   *   The device may *soon become* dormant; the SDK eagerly uploads all queued
   *   locations before going idle.
   *
   *
   * **See also**
   * - HTTP Guide at {@link HttpConfig}
   */
  autoSyncThreshold?: number;

  /**
   * Disable {@link autoSync} when the device is connected over **cellular data**.
   *
   * Defaults to **`false`**.  
   * 
   * When set to **`true`**, automatic HTTP uploads will occur **only when on Wi-Fi**.
   *
   * This is useful for conserving mobile data usage, particularly when large
   * batches of locations may accumulate while offline.
   *
   * __⚠️ Warning:__
   * This option is **ignored** when manually invoking
   * {@link BackgroundGeolocation.sync}. Manual syncs always proceed regardless of connection type.
   *
   * **See also**
   * - {@link autoSync}
   * - {@link BackgroundGeolocation.sync}
   */
  disableAutoSyncOnCellular?: boolean;

  /**
   * Upload **multiple locations** to your {@link url} in a single HTTP request.
   *
   * Defaults to **`false`**.  
   * When set to **`true`**, the SDK will bundle **all currently queued locations** in
   * the native SQLite database and upload them together in **one** HTTP request.
   *
   * When `batchSync` is **`false`**, the HTTP service performs **one request per
   * location**, which can increase battery and network usage.
   *
   * Batching is often used together with {@link autoSyncThreshold} to
   * reduce upload frequency and conserve power.
   *
   * **See also**
   * - {@link url}
   * - {@link autoSync}
   * - {@link autoSyncThreshold}
   * - **HTTP Guide** at {@link HttpConfig}
   */
  batchSync?: boolean;

  /**
   * Controls the number of records attached to **each** batched HTTP request.
   *
   * Defaults to **`-1`** (no maximum).
   *
   * When using {@link batchSync} with {@link url} configured,
   * this option limits how many queued location records may be included in a single
   * HTTP request.
   *
   * If the number of queued records exceeds `maxBatchSize`, the SDK will generate
   * **multiple HTTP requests** until the queue is fully drained.
   *
   * This prevents extremely large request bodies when the device has been offline
   * for long periods (where megabytes of location data may accumulate).   
   *
   * **See also**
   * - {@link batchSync}
   * - {@link url}
   * - **HTTP Guide** at {@link HttpConfig}
   */
  maxBatchSize?: number;

  /**
   * The root property of the JSON object where location data will be placed.
   *
   * When set, outgoing HTTP payloads will wrap the serialized location record(s)
   * under the specified key.
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
   * Produces payloads shaped like:
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
   * If you specify `"."` (dot), the SDK places the data **directly in the root**
   * of the JSON body:
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
   * **Note:** See the **HTTP Guide** at {@link HttpConfig} for detailed payload
   * examples and composition rules.
   *
   * **See also**
   * - {@link PersistenceConfig.locationTemplate}
   * - {@link PersistenceConfig.geofenceTemplate}
   */
  rootProperty?: string;

  /**
   * HTTP request timeout in **milliseconds**.
   *
   * When an HTTP request exceeds this timeout, the SDK fires
   * {@link BackgroundGeolocation.onHttp} with a failure event.
   *
   * Defaults to **`60000` ms**.
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
   *     timeout: 3000   // 3-second timeout
   *   }
   * });
   * ```
   */
  timeout?: number;
}
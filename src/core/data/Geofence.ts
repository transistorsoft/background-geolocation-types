/**
 * A list of vertices defining a Polygon geofence
 * 
 * See {@link Geofence.vertices}
 */
export type Vertices = [number, number][];

/**
 * The Background Geolocation SDK implements the native iOS and Android Geofencing APIs.
 *
 * __ℹ️ Note:__
 * - Native iOS & Android API support only *circular* geofences, however the plugin does implement a custom mechanism for handling *Polygon Geofences*; see {@link Geofence.vertices}.
 * - The minimum reliable {@link Geofence.radius} is `200` meters.
 * - The native geofencing API for both iOS and Android *require* the user authorize {@link GeoConfig.locationAuthorizationRequest} **`Always`** &mdash; **`When in Use`** will **not** work.
 *
 * __Adding Geofences__
 *
 * Adding a single geofence with {@link BackgroundGeolocation.addGeofence}.
 * 
 * @example Single Geofence:
 * ```typescript
 * BackgroundGeolocation.addGeofence({
 *   identifier: "Home",
 *   radius: 200,
 *   latitude: 45.51921926,
 *   longitude: -73.61678581,
 *   notifyOnEntry: true,
 *   notifyOnExit: true,
 *   extras: {
 *     route_id: 1234
 *   }
 * }).then((success) => {
 *   console.log("[addGeofence] success");
 * }).catch((error) => {
 *   console.log("[addGeofence] FAILURE: ", error);
 * });
 * ```
 *
 * Adding multiple geofences with {@link BackgroundGeolocation.addGeofences}.
 * 
 * @example Multiple Geofences
 * ```typescript
 * await BackgroundGeolocation.addGeofences([{
 *   identifier: "Home",
 *   radius: 200,
 *   latitude: 45.51921926,
 *   longitude: -73.61678581,
 *   notifyOnEntry: true,
 * }, {
 *   identifier: "Work",
 *   radius: 200,
 *   latitude: 45.61921927,
 *   longitude: -73.71678582,
 *   notifyOnEntry: true
 * }]);
 * console.log("[addGeofences] success");
 * 
 * ```
 *
 * __ℹ️ Note:__ Adding a geofence having an {@link Geofence.identifier} which already exists within the SDK geofence database will cause the previous record to be destroyed and the new one inserted.
 *
 *
 * __Listening for Geofence Events__
 *
 * Listen to geofence events with {@link BackgroundGeolocation.onGeofence}.
 *
 * @example 
 * ```typescript
 * // Listen for geofence events.
 * BackgroundGeolocation.onGeofence(geofence => {
 *   console.log("[geofence] ", geofence.identifier, geofence.action);
 * });
 * ```
 * 
 * __Polygon Geofencing__
 *
 * The Background Geolocation SDK supports *Polygon Geofences* (Geofences of any shape).  See API docs {@link Geofence.vertices}.
 * * ℹ️ __*Polygon Geofencing*__ is [sold as a separate add-on](https://shop.transistorsoft.com/products/polygon-geofencing) (fully functional in *DEBUG* builds).
 *  
 *
 * ![](https://dl.dropbox.com/scl/fi/sboshfvar0h41azmb4tyv/polygon-geofencing-parc-outremont-400.png?rlkey=d2s0n3zbzu72e7s2gch9kxd4a&dl=1)
 * ![](https://dl.dropbox.com/scl/fi/xz48myvjnpp8ko0l2tufg/polygon-geofencing-parc-lafontaine-400.png?rlkey=sf20ns959uj0a0fq0atmj55bz&dl=1)
 *  
 *
 * __Infinite Geofencing__
 *
 * The Background Geolocation SDK contains unique and powerful Geofencing features that allow you to monitor any number of circular geofences you wish (thousands even),
 * in spite of limits imposed by the native platform APIs (**20 for iOS; 100 for Android**).
 *
 * The SDK achieves this by storing your geofences in its database, using a [geospatial query](https://en.wikipedia.org/wiki/Spatial_query) to determine those geofences 
 * in proximity ({@link GeoConfig.geofenceProximityRadius}), activating only those geofences closest to the device's current location (according the limit imposed by the corresponding platform).
 *
 * - When the device is determined to be moving, the plugin periodically queries for geofences within the {@link GeoConfig.geofenceProximityRadius} (eg. every minute) using the latest recorded location.  This geospatial query is **very fast**, even with tens-of-thousands geofences in the database.
 * - The SDK **enforces** a *minimum* {@link GeoConfig.geofenceProximityRadius} of `1000` meters.
 * - In the following image, the *green* geofences within {@link GeoConfig.geofenceProximityRadius} are *actively* monitored.  The *grey* geofences outside {@link GeoConfig.geofenceProximityRadius} still exist within the SDK's database but are *not* actively being monitored.
 *
 * ![](https://dl.dropboxusercontent.com/s/7sggka4vcbrokwt/geofenceProximityRadius_iphone6_spacegrey_portrait.png?dl=1)
 *
 *
 * __Listening for changes in the actively-monitored set-of-geofences.__
 *
 * As the SDK periodically queries for geofences within the {@link GeoConfig.geofenceProximityRadius}, you can listen for changes in the actively-monitored 
 * geofences using the event {@link BackgroundGeolocation.onGeofencesChange}.  This event will let you know those geofences which have *begun* to be *actively monitored*
 * ({@link GeofencesChangeEvent.on}) in addition to those which just *ceased* to be actively monitored ({@link GeofencesChangeEvent.off}).
 *
 * @example
 * ```typescript
 * BackgroundGeolocation.onGeofencesChange((event) => {
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
 *   });
 * });
 * ```
 * 
 * __⚠️ Note:__
 * - When **all** geofences have been removed, the {@link GeofencesChangeEvent} will provide empty lists for both {@link GeofencesChangeEvent.on} & {@link GeofencesChangeEvent.off}.
 *
 * __Removing Geofences__
 *
 * Once a geofence has been inserted into the SDK's database using {@link BackgroundGeolocation.addGeofence} or {@link BackgroundGeolocation.addGeofences}, they will be monitored *forever*
 * (as long as the plugin remains `State.enabled == true`).  If you've configured {@link AppConfig.stopOnTerminate} __`false`__ and {@link AppConfig.startOnBoot} __`true`__, geofences will continue to 
 * be monitored even if the application is terminated or device rebooted.
 * 
 * To cease monitoring a geofence or *geofences*, you must *remove* them from the SDK's database (or call {@link BackgroundGeolocation.stop}).
 *
 * - Removing a single geofence by {@link Geofence.identifier} with {@link BackgroundGeolocation.removeGeofence}:
 * @example
 * ```typescript
 * BackgroundGeolocation.removeGeofence("HOME").then(success => {
 *   console.log("[removeGeofence] success");
 * })
 * ```
 *
 * - Removing *all* geofences with {@link BackgroundGeolocation.removeGeofences}:
 * @example
 * ```typescript
 * BackgroundGeolocation.removeGeofences().then(success => {
 *   console.log("[removeGeofences] all geofences have been destroyed");
 * })
 * ```
 *
 * __Querying Geofences__
 *
 * Use the method {@link BackgroundGeolocation.getGeofences} to retrieve the entire Array of {@link Geofence} stored in the SDK's database.
 *
 * @example
 * ```typescript
 * BackgroundGeolocation.getGeofences().then(geofences => {
 *   console.log("[getGeofences] ", geofences);
 * })
 * ```
 *
 * __Monitoring *only* geofences__
 *
 * The BackgroundGeolocation SDK allows you to optionally monitor *only* geofences without constant location-tracking.  To engage *geofences-only* mode, 
 * use the method {@link BackgroundGeolocation.startGeofences} instead of {@link BackgroundGeolocation.start}.
 *
 * Use option {@link GeoConfig.geofenceModeHighAccuracy}:true to improve the responsiveness of geofence events.
 *
 * @example
 * ```typescript
 * BackgroundGeolocation.onGeofence(geofence => {
 *   console.log("[geofence] ", geofence);
 * })
 *
 * BackgroundGeolocation.ready({
 *   http: {
 *     url: "http://your.server.com/geofences",
 *     autoSync: true,
 *   },
 *   geolocation: {
 *     geofenceModeHighAccuracy: true   // <-- consumes more power; default is false.
 *   }
 * }, state => {
 *   // engage geofences-only mode:
 *   BackgroundGeolocation.startGeofences();
 * })
 * ```
 *
 * __Toggling between tracking-modes {@link BackgroundGeolocation.start} and {@link BackgroundGeolocation.startGeofences}__
 *
 * The SDK can easily be toggled between {@link State.trackingMode} simply by executing the corresponding {@link BackgroundGeolocation.start} or {@link BackgroundGeolocation.startGeofences} methods.
 *
 * @example
 * ```typescript
 * // Listen to geofence events
 * BackgroundGeolocation.onGeofence(geofence => {
 *   console.log("[geofence] ", geofence);
 *   if (geofence.identifier == "DANGER_ZONE") {
 *     if (geofence.action == "ENTER") {
 *       // Entering the danger-zone, we want to aggressively track location.
 *       BackgroundGeolocation.start();
 *     } else if (geofence.action == "EXIT") {
 *       // Exiting the danger-zone, we resume geofences-only tracking.
 *       BackgroundGeolocation.startGeofences();
 *     }
 *   }
 * })
 *
 * // Add a geofence.
 * BackgroundGeolocation.addGeofence({
 *   identifier: "DANGER_ZONE",
 *   radius: 1000,
 *   latitude: 45.51921926,
 *   longitude: -73.61678581,
 *   notifyOnEntry: true,
 *   notifyOnExit: true,
 * })
 *
 * // Ready the plugin.
 * BackgroundGeolocation.ready({
 *   geolocation: {
 *     desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
 *     distanceFilter: 10,
 *   },
 *   http: {
 *     url: "http://your.server.com/locations",
 *     autoSync: true,
 *   }
 * }, state => {
 *   BackgroundGeolocation.startGeofences();
 * })
 * ```
 * 
 * @category Data
 * @category Geofencing
 */
export interface Geofence {
  /**
   * Unique geofence identifier.
   */
  identifier: string;
  /**
   * Latitude of geofence center
   */
  latitude: number;
  /**
   * Longitude of geofence center
   */
  longitude: number;
  /**
   * Radius of the circular geofence.
   *
   * ⚠️ The minimum reliable `radius` is __`200`__ meters.  Anything less will likely not cause a geofence to trigger.  
   * This is documented by Apple [here](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/LocationAwarenessPG/RegionMonitoring/RegionMonitoring.html):
   * > *"The specific threshold distances are determined by the hardware and the location technologies that are currently available. For example, if WiFi is disabled, region monitoring
   * is significantly less accurate. However, for testing purposes, __you can assume that the minimum distance is approximately 200 meters__*".
   */
  radius: number;
  /**
   * Set `true` to fire event when device *enters* this geofence.
   *
   * __ℹ️ See also:__
   * - {@link GeoConfig.geofenceInitialTriggerEntry}
   */
  notifyOnEntry?: boolean;
  /**
   * Set `true` to fire event when device *exits* this geofence.
   */
  notifyOnExit?: boolean;
  /**
   * Set `true` to fire event when device "loiters" within this geofence for {@link loiteringDelay} milliseconds.
   */
  notifyOnDwell?: boolean;
  /**
   * Minimum time in *milliseconds* the device must "loiter" within this geofence before {@link notifyOnDwell} event fires.
   */
  loiteringDelay?: number;
  /**
   * Arbitrary key-values appended to the geofence event and posted to your configured {@link HttpConfig.url}.
   */
  extras?: Record<string, unknown>;
  /**
   * Optional: a list of vertices (`[ [lat, lng],...]`) defining a Polygon geofence.  By default, geofences are circular.
   * 
   * ℹ️ __*Polygon Geofencing*__ is [sold as a separate add-on](https://shop.transistorsoft.com/products/polygon-geofencing) (fully functional in *DEBUG* builds).
   *     
   * When defining a polygon geofence, you do **not** provide {@link latitude}, {@link longitude} or {@link radius} &mdash; those will be automatically calculated based upon the geometry of the polygon.
   *
   * The following image shows polygon geofences on a map:
   *
   * ![](https://dl.dropbox.com/scl/fi/xzf6yau5wcg1az8fy0lbm/geofencing-polygons-on-map.PNG?rlkey=e82h494msbgt8ngu4s2pjwemb&dl=1)
   *
   * The *blue polygons* represent the *actual* polygon geofences and the containing *green circles* are traditional circular geofences provided by the native *iOS/Android* Geofencing APIs.  
   * The background-geolocation SDK automatically calculates the containing, native cirular geofence by solving the [*minimum enclosing circle*](https://en.wikipedia.org/wiki/Smallest-circle_problem) 
   * for the given {@link vertices}.  This is why you do not provide {@link latitude}, {@link longitude} and {@link radius}.
   *
   * - When the device *enters* the containing circular geofence, the SDK uses that as a signal that the device is approaching a polygon.  At this moment, the SDK begins aggressively monitoring the location to perform "hit-testing" upon the polygon using a fast algorithm implemented with C++ code.
   * - When the device *exits* the containing circular geofence, that's the SDK's signal for it to *cease* monitoring that polygon.
   *
   * @example
   * ```javascript
   * BackgroundGeolocation.addGeofence({
   *   identifier: 'Home',
   *   notifyOnEntry: true,
   *   notifyOnExit: true,
   *   vertices: [
   *     [45.518947279987714, -73.6049889209514],  // <-- [lat, lng]
   *     [45.5182711292279, -73.60338649600598],
   *     [45.517082240237634, -73.60432670908212],
   *     [45.51774871402813, -73.60604928622278]
   *   ]
   * });
   * ```     
   *
   * - __Entering / exiting a *cross-shaped* polygon geofence:__
   * 
   * ![](https://dl.dropbox.com/scl/fi/iorrnrm0zno91jtg0ctse/polygon-geofencing-cross.PNG?rlkey=p4kufqhxgw9jrmuz4vkqisprw&dl=1)
   * 
   * - __Entering / exiting a park:__
   * 
   * ![](https://dl.dropbox.com/scl/fi/qvg9n3s5iacje5szgcqfv/polygon-geofencing-parc-outremont.PNG?rlkey=c6iax7a19db2v6xdxf18k2a7k&dl=1)
   * 
   * - __Entering / exiting a diamond-shaped polygon:__
   * 
   * ![](https://dl.dropbox.com/scl/fi/29m3xwb7tm0532mthgjfy/polygon-geofencing-diamond.PNG?rlkey=9ucc5hs7460ig7226iutas4cw&dl=1)
   * 
   * - __Designing a polygon geofence around a park using the demo app:__
   * 
   * ![](https://dl.dropbox.com/scl/fi/806mxnz9cdfd4ely8uwfe/polygon-geofencing-parc-lafontaine.PNG?rlkey=yrlbfisx8o5itfz6h0d0inel1&dl=1)
   * 
   */
  vertices?: Vertices;

  // Runtime fields

  /**   
   * Runtime state:  The current entry-state of the geofence.
   * 
   * - 0 = OUTSIDE
   * - 1 = INSIDE
   * 
   * ⚠️ Readonly
   */
  readonly entryState?: number;          // 0=unknown, 1=inside, 2=outside
  /**
   * Runtime state:  Number of times this geofence has been triggered.
   * 
   * ⚠️ Readonly
   */
  readonly hits?: number;                // number of triggers
  /**   
   * Runtime state:  Epoch timestamp (seconds) of last geofence transition.
   * 
   * ⚠️ Readonly
   */
  readonly stateUpdatedAt?: number;      // epoch timestamp (seconds)

}


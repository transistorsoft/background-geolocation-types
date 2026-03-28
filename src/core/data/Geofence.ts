/**
 * An array of `[latitude, longitude]` pairs defining a polygon geofence.
 *
 * See {@link Geofence.vertices}.
 */
export type Vertices = [number, number][];

/**
 * A geofence definition for monitoring circular or polygon regions.
 *
 * The SDK implements the native iOS and Android Geofencing APIs, extended
 * with polygon support and a proximity-based infinite-geofencing system that
 * overcomes the platform limits of 20 (iOS) and 100 (Android) simultaneous
 * geofences.
 *
 * ## Contents
 * - [Overview](#overview)
 * - [Adding geofences](#adding-geofences)
 * - [Listening for events](#listening-for-events)
 * - [Polygon geofencing](#polygon-geofencing)
 * - [Infinite geofencing](#infinite-geofencing)
 * - [Removing geofences](#removing-geofences)
 * - [Geofences-only mode](#geofences-only-mode)
 * - [Examples](#examples)
 *
 * ---
 *
 * ## Overview
 *
 * | Field | Required | Description |
 * |-------|:--------:|-------------|
 * | {@link identifier} | ✅ | Unique name for this geofence. |
 * | {@link latitude} | ✅* | Center latitude (*omit for polygon geofences). |
 * | {@link longitude} | ✅* | Center longitude (*omit for polygon geofences). |
 * | {@link radius} | ✅* | Radius in meters (*omit for polygon geofences). |
 * | {@link notifyOnEntry} | — | Fire event on entry. |
 * | {@link notifyOnExit} | — | Fire event on exit. |
 * | {@link notifyOnDwell} | — | Fire event after loitering for {@link loiteringDelay} ms. |
 * | {@link vertices} | — | Polygon geofence vertices (replaces lat/lng/radius). |
 * | {@link extras} | — | Arbitrary key-value metadata posted with each event. |
 *
 * ## ⚠️ Warning
 *
 * Both platforms require {@link GeoConfig.locationAuthorizationRequest} to be
 * `"Always"`. Geofencing does **not** work with `"WhenInUse"` only.
 *
 * ---
 *
 * ## Adding geofences
 *
 * Use {@link BackgroundGeolocation.addGeofence} for a single geofence, or
 * {@link BackgroundGeolocation.addGeofences} for bulk inserts (approximately
 * 10× faster than inserting individually).
 *
 * If a geofence with the same {@link identifier} already exists in the
 * database, it is replaced.
 *
 * @example Single geofence
 * ```typescript
 * BackgroundGeolocation.addGeofence({
 *   identifier: "Home",
 *   radius: 200,
 *   latitude: 45.51921926,
 *   longitude: -73.61678581,
 *   notifyOnEntry: true,
 *   notifyOnExit: true,
 *   extras: { route_id: 1234 }
 * });
 * ```
 *
 * @example Multiple geofences
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
 * ```
 *
 * ---
 *
 * ## Listening for events
 *
 * Subscribe to geofence transitions with {@link BackgroundGeolocation.onGeofence}.
 * Subscribe to changes in the actively monitored set with
 * {@link BackgroundGeolocation.onGeofencesChange}.
 *
 * @example
 * ```typescript
 * BackgroundGeolocation.onGeofence((event) => {
 *   console.log("[onGeofence]", event.identifier, event.action);
 * });
 *
 * BackgroundGeolocation.onGeofencesChange((event) => {
 *   const on = event.on;   // newly activated geofences
 *   const off = event.off; // deactivated geofence identifiers
 *
 *   on.forEach((geofence) => createGeofenceMarker(geofence));
 *   off.forEach((identifier) => removeGeofenceMarker(identifier));
 * });
 * ```
 *
 * ## Note
 *
 * When all geofences are removed, {@link BackgroundGeolocation.onGeofencesChange}
 * fires with empty arrays for both `on` and `off`.
 *
 * ---
 *
 * ## Polygon geofencing
 *
 * The SDK supports polygon geofences of any shape via the {@link vertices}
 * field. Polygon geofencing is
 * [sold as a separate add-on](https://shop.transistorsoft.com/products/polygon-geofencing)
 * but is fully functional in DEBUG builds.
 *
 * When defining a polygon geofence, omit {@link latitude}, {@link longitude},
 * and {@link radius} — the SDK calculates the minimum enclosing circle
 * automatically from the polygon geometry.
 *
 * ![](https://dl.dropbox.com/scl/fi/sboshfvar0h41azmb4tyv/polygon-geofencing-parc-outremont-400.png?rlkey=d2s0n3zbzu72e7s2gch9kxd4a&dl=1)
 * ![](https://dl.dropbox.com/scl/fi/xz48myvjnpp8ko0l2tufg/polygon-geofencing-parc-lafontaine-400.png?rlkey=sf20ns959uj0a0fq0atmj55bz&dl=1)
 *
 * @example Polygon geofence
 * ```typescript
 * BackgroundGeolocation.addGeofence({
 *   identifier: "Park",
 *   notifyOnEntry: true,
 *   notifyOnExit: true,
 *   vertices: [
 *     [45.518947279987714, -73.6049889209514],
 *     [45.5182711292279,   -73.60338649600598],
 *     [45.517082240237634, -73.60432670908212],
 *     [45.51774871402813,  -73.60604928622278]
 *   ]
 * });
 * ```
 *
 * ---
 *
 * ## Infinite geofencing
 *
 * The SDK stores all geofences in its database and uses a
 * [geospatial query](https://en.wikipedia.org/wiki/Spatial_query) to
 * activate only the nearest geofences within
 * {@link GeoConfig.geofenceProximityRadius}, staying within the platform
 * limit. As the device moves, the active set is periodically refreshed.
 *
 * - The minimum {@link GeoConfig.geofenceProximityRadius} is enforced at `1000` meters.
 * - Geofences within the radius (green in the diagram below) are actively monitored.
 * - Geofences outside the radius (grey) remain in the database but are dormant.
 *
 * ![](https://dl.dropboxusercontent.com/s/7sggka4vcbrokwt/geofenceProximityRadius_iphone6_spacegrey_portrait.png?dl=1)
 *
 * ---
 *
 * ## Removing geofences
 *
 * Geofences persist in the SDK's database until explicitly removed. If
 * {@link AppConfig.stopOnTerminate} is `false` and
 * {@link AppConfig.startOnBoot} is `true`, geofences continue to be
 * monitored across app termination and device reboots.
 *
 * @example Remove a single geofence
 * ```typescript
 * await BackgroundGeolocation.removeGeofence("Home");
 * ```
 *
 * @example Remove all geofences
 * ```typescript
 * await BackgroundGeolocation.removeGeofences();
 * ```
 *
 * @example Fetch all stored geofences
 * ```typescript
 * const geofences = await BackgroundGeolocation.getGeofences();
 * console.log("[getGeofences]", geofences);
 * ```
 *
 * ---
 *
 * ## Geofences-only mode
 *
 * Call {@link BackgroundGeolocation.startGeofences} instead of
 * {@link BackgroundGeolocation.start} to monitor geofences without continuous
 * location tracking. Use {@link GeoConfig.geofenceModeHighAccuracy} to
 * improve event responsiveness at the cost of higher power usage.
 *
 * The SDK can switch between full tracking and geofences-only mode at any
 * time by calling the corresponding start method.
 *
 * @example Geofences-only mode
 * ```typescript
 * BackgroundGeolocation.onGeofence((event) => {
 *   console.log("[onGeofence]", event);
 * });
 *
 * await BackgroundGeolocation.ready({
 *   http: { url: "https://your.server.com/geofences", autoSync: true },
 *   geolocation: { geofenceModeHighAccuracy: true }
 * });
 * BackgroundGeolocation.startGeofences();
 * ```
 *
 * ---
 *
 * ## Examples
 *
 * @example Toggle between location tracking and geofences-only mode
 * ```typescript
 * BackgroundGeolocation.onGeofence((event) => {
 *   if (event.identifier === "DANGER_ZONE") {
 *     if (event.action === "ENTER") {
 *       // Entering the zone — switch to full location tracking.
 *       BackgroundGeolocation.start();
 *     } else if (event.action === "EXIT") {
 *       // Exiting the zone — return to geofences-only mode.
 *       BackgroundGeolocation.startGeofences();
 *     }
 *   }
 * });
 *
 * BackgroundGeolocation.addGeofence({
 *   identifier: "DANGER_ZONE",
 *   radius: 1000,
 *   latitude: 45.51921926,
 *   longitude: -73.61678581,
 *   notifyOnEntry: true,
 *   notifyOnExit: true,
 * });
 *
 * await BackgroundGeolocation.ready({
 *   geolocation: {
 *     desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
 *     distanceFilter: 10,
 *   },
 *   http: { url: "https://your.server.com/locations", autoSync: true }
 * });
 * BackgroundGeolocation.startGeofences();
 * ```
 *
 * @category Data
 * @category Geofencing
 */
export interface Geofence {
  /**
   * Unique identifier for this geofence.
   *
   * Used to reference the geofence in events and removal calls. Adding a
   * geofence with an identifier that already exists replaces the existing one.
   */
  identifier: string;

  /**
   * Latitude of the circular geofence center.
   *
   * Omit when defining a polygon geofence via {@link vertices} — the SDK
   * calculates the center automatically.
   */
  latitude: number;

  /**
   * Longitude of the circular geofence center.
   *
   * Omit when defining a polygon geofence via {@link vertices} — the SDK
   * calculates the center automatically.
   */
  longitude: number;

  /**
   * Radius of the circular geofence in meters.
   *
   * Omit when defining a polygon geofence via {@link vertices} — the SDK
   * calculates the enclosing radius automatically.
   *
   * ## ⚠️ Warning
   *
   * The minimum reliable radius is **`200` meters**. Below this threshold,
   * geofences may not trigger reliably on either platform.
   *
   * Apple documents this explicitly:
   * > *"For testing purposes, you can assume that the minimum distance is
   * approximately 200 meters."*
   */
  radius: number;

  /**
   * Fire a {@link GeofenceEvent} when the device enters this geofence.
   *
   * **See also**
   * - {@link GeoConfig.geofenceInitialTriggerEntry}
   */
  notifyOnEntry?: boolean;

  /**
   * Fire a {@link GeofenceEvent} when the device exits this geofence.
   */
  notifyOnExit?: boolean;

  /**
   * Fire a {@link GeofenceEvent} when the device has remained inside this
   * geofence for {@link loiteringDelay} milliseconds.
   */
  notifyOnDwell?: boolean;

  /**
   * Minimum time in milliseconds the device must remain inside the geofence
   * before a {@link notifyOnDwell} event fires. Default `0`.
   */
  loiteringDelay?: number;

  /**
   * Arbitrary key-value metadata attached to each geofence event and included
   * in the payload posted to {@link HttpConfig.url}.
   */
  extras?: Record<string, unknown>;

  /**
   * Polygon geofence vertices as `[[lat, lng], ...]` pairs.
   *
   * When provided, the geofence is treated as a polygon rather than a circle.
   * Omit {@link latitude}, {@link longitude}, and {@link radius} — the SDK
   * solves the [minimum enclosing circle](https://en.wikipedia.org/wiki/Smallest-circle_problem)
   * from the vertex geometry and registers that as the native circular geofence.
   *
   * When the device enters the enclosing circle, the SDK begins C++ hit-testing
   * against the polygon at high frequency. When it exits the circle, polygon
   * monitoring ceases.
   *
   * ## Note
   *
   * Polygon geofencing is [sold as a separate add-on](https://shop.transistorsoft.com/products/polygon-geofencing)
   * but is fully functional in DEBUG builds.
   *
   * ![](https://dl.dropbox.com/scl/fi/xzf6yau5wcg1az8fy0lbm/geofencing-polygons-on-map.PNG?rlkey=e82h494msbgt8ngu4s2pjwemb&dl=1)
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.addGeofence({
   *   identifier: "Home",
   *   notifyOnEntry: true,
   *   notifyOnExit: true,
   *   vertices: [
   *     [45.518947279987714, -73.6049889209514],
   *     [45.5182711292279,   -73.60338649600598],
   *     [45.517082240237634, -73.60432670908212],
   *     [45.51774871402813,  -73.60604928622278]
   *   ]
   * });
   * ```
   *
   * ![](https://dl.dropbox.com/scl/fi/iorrnrm0zno91jtg0ctse/polygon-geofencing-cross.PNG?rlkey=p4kufqhxgw9jrmuz4vkqisprw&dl=1)
   * ![](https://dl.dropbox.com/scl/fi/qvg9n3s5iacje5szgcqfv/polygon-geofencing-parc-outremont.PNG?rlkey=c6iax7a19db2v6xdxf18k2a7k&dl=1)
   * ![](https://dl.dropbox.com/scl/fi/29m3xwb7tm0532mthgjfy/polygon-geofencing-diamond.PNG?rlkey=9ucc5hs7460ig7226iutas4cw&dl=1)
   */
  vertices?: Vertices;

  // Runtime fields — populated by the SDK; do not set manually.

  /**
   * Current entry state of the geofence.
   *
   * | Value | State |
   * |------:|-------|
   * | `0` | Outside |
   * | `1` | Inside |
   *
   * @readonly
   */
  readonly entryState?: number;

  /**
   * Number of times this geofence has been triggered since it was added.
   *
   * @readonly
   */
  readonly hits?: number;

  /**
   * Epoch timestamp in seconds of the last geofence transition.
   *
   * @readonly
   */
  readonly stateUpdatedAt?: number;
}

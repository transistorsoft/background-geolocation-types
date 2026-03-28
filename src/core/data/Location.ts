import { ProviderChangeEvent} from '../events/ProviderChangeEvent';
import { MotionActivityType } from '../../enums/MotionActivityType';
import { GeofenceEvent } from '../events/GeofenceEvent';

/**
 * Geographic coordinates attached to a {@link Location}.
 *
 * @category Data
*/
export interface Coords {
  /**
   * Floor within a building, when indoor-positioning hardware (e.g. Bluetooth
   * beacons) is available. [iOS only]
   */
  floor?: number;

  /**
   * Latitude in decimal degrees.
   */
  latitude: number;

  /**
   * Longitude in decimal degrees.
   */
  longitude: number;

  /**
   * Horizontal accuracy radius in meters.
   */
  accuracy: number;

  /**
   * Altitude above a reference plane in meters.
   *
   * ## iOS
   *
   * Altitude above mean sea level.
   *
   * ## Android
   *
   * Altitude above the WGS84 reference ellipsoid. See also
   * {@link ellipsoidal_altitude}.
   */
  altitude?: number;

  /**
   * Altitude above the WGS84 reference ellipsoid in meters.
   */
  ellipsoidal_altitude?: number;

  /**
   * Vertical accuracy in meters. Returns `-1` if unavailable.
   *
   * ## iOS
   *
   * When positive, the `altitude` value is within ±`altitude_accuracy` meters.
   * When negative, `altitude` is invalid. Determining altitude accuracy
   * requires a GPS-capable device; on some devices this value is always
   * negative.
   *
   * ## Android
   *
   * Defined as the 1-sigma vertical accuracy at 68% confidence — the
   * half-width of the range above and below `altitude` within which the true
   * altitude has a 68% probability of falling.
   */
  altitude_accuracy?: number;

  /**
   * Direction of travel in degrees (0–360, clockwise from true north).
   *
   * ## Note
   *
   * Only present when the location came from GPS. Returns `-1` otherwise.
   */
  heading?: number;

  /**
   * Heading accuracy in degrees.
   *
   * ## Note
   *
   * Only present when the location came from GPS. Returns `-1` otherwise.
   */
  heading_accuracy?: number;

  /**
   * Ground speed in meters per second.
   *
   * ## Note
   *
   * Only present when the location came from GPS. Returns `-1` otherwise.
   */
  speed?: number;

  /**
   * Speed accuracy in meters per second.
   *
   * ## Note
   *
   * Only present when the location came from GPS. Returns `-1` otherwise.
   */
  speed_accuracy?: number;
}

/**
 * Device battery state at the time a {@link Location} was recorded.
 *
 * @category Data
 */
export interface Battery {
  /**
   * `true` when the device is connected to a power source.
   */
  is_charging: boolean;

  /**
   * Battery charge level: `0.0` = empty, `1.0` = fully charged.
   */
  level: number;
}

/**
 * The motion activity reported by the device at the time a {@link Location}
 * was recorded.
 *
 * @category Data
 */
export interface MotionActivity {
  /**
   * Detected motion activity type (e.g. `still`, `on_foot`, `in_vehicle`).
   */
  type: MotionActivityType;

  /**
   * Confidence of the reported activity as a percentage (0–100).
   */
  confidence: number;
}

/**
 * A location record captured by the device's native location API and
 * delivered by the SDK.
 *
 * iOS uses `CLLocationManager` / `CLLocation`; Android uses
 * `FusedLocationProviderClient` / `android.location.Location`.
 *
 * ## Contents
 * - [Overview](#overview)
 * - [JavaScript schema](#javascript-schema)
 * - [HTTP POST schema](#http-post-schema)
 *
 * ---
 *
 * ## Overview
 *
 * | Field | Description |
 * |-------|-------------|
 * | {@link timestamp} | ISO-8601 UTC timestamp from the native API. |
 * | {@link uuid} | Universally unique identifier for this record. |
 * | {@link coords} | Latitude, longitude, accuracy, speed, heading, altitude. |
 * | {@link activity} | Motion activity at time of recording. |
 * | {@link battery} | Battery level and charging state. |
 * | {@link odometer} | Accumulated distance traveled in meters. |
 * | {@link event} | SDK event that triggered this location. |
 * | {@link is_moving} | `true` when recorded in the moving state. |
 * | {@link sample} | `true` for intermediate accuracy-sampling locations. |
 * | {@link extras} | Optional custom metadata. |
 *
 * ---
 *
 * ## JavaScript schema
 *
 * @example
 * ```json
 * {
 *   "timestamp":  "2015-05-05T04:31:54.123Z",
 *   "event":      "motionchange",
 *   "is_moving":  true,
 *   "uuid":       "904e9958-4828-4e4e-b380-be403c964a7e",
 *   "age":        1200,
 *   "coords": {
 *     "latitude":             45.519239,
 *     "longitude":           -73.617058,
 *     "accuracy":             15,
 *     "speed":                1.2,
 *     "heading":              270,
 *     "altitude":             45.2,
 *     "ellipsoidal_altitude": 45.3
 *   },
 *   "activity": { "type": "on_foot", "confidence": 85 },
 *   "battery":  { "level": 0.72, "is_charging": false },
 *   "odometer": 12543.8
 * }
 * ```
 *
 * ---
 *
 * ## HTTP POST schema
 *
 * @example
 * ```json
 * {
 *   "location": {
 *     "timestamp":  "2015-05-05T04:31:54.123Z",
 *     "event":      "motionchange",
 *     "is_moving":  true,
 *     "uuid":       "904e9958-4828-4e4e-b380-be403c964a7e",
 *     "age":        1200,
 *     "odometer":   12543.8,
 *     "coords": {
 *       "latitude":             45.519239,
 *       "longitude":           -73.617058,
 *       "accuracy":             15,
 *       "speed":                1.2,
 *       "heading":              270,
 *       "altitude":             45.2,
 *       "ellipsoidal_altitude": 45.3
 *     },
 *     "extras":   { "foo": "bar" },
 *     "activity": { "type": "on_foot", "confidence": 85 },
 *     "geofence": { "identifier": "Home", "action": "ENTER" },
 *     "battery":  { "level": 0.72, "is_charging": false }
 *   }
 * }
 * ```
 *
 * @category Data
 */
export interface Location {
  /**
   * ISO-8601 UTC timestamp provided by the native location API.
   */
  timestamp: string;

  /**
   * Age of the location in milliseconds, measured from the device system
   * clock at the time the location was received.
   *
   * `location.timestamp` + `location.age` = device system time when the
   * SDK received the location from the native API.
   */
  age: number;

  /**
   * Accumulated distance traveled in meters since the last odometer reset.
   *
   * The SDK integrates the distance between each pair of accepted locations
   * to maintain a running total. This value survives app restarts unless
   * explicitly reset.
   *
   * ## How it's calculated
   *
   * - Distance is computed between each consecutive pair of accepted locations.
   * - The {@link LocationFilter} evaluates accuracy and motion context for
   *   each sample. Low-quality samples may be rejected or down-weighted
   *   based on {@link LocationFilter.odometerAccuracyThreshold}.
   * - Accumulated drift is exposed via {@link Location.odometer_error}.
   *
   * ## When it increases
   *
   * - After the device moves and a new location is recorded.
   * - During both moving and stationary states when minor motion is detected.
   * - In geofences-only mode, at each geofence transition or stationary exit.
   *
   * ## When it does not increase
   *
   * - When a sample fails accuracy thresholds.
   * - When the device is stationary and no sufficient movement is detected.
   *
   * **See also**
   * - {@link LocationFilter}
   * - {@link LocationFilter.odometerAccuracyThreshold}
   * - {@link BackgroundGeolocation.resetOdometer}
   * - {@link BackgroundGeolocation.getOdometer}
   *
   * @example
   * ```ts
   * BackgroundGeolocation.onLocation((location) => {
   *   console.log("Distance traveled:", location.odometer);
   * });
   *
   * // Reset at the start of a trip
   * await BackgroundGeolocation.resetOdometer();
   * ```
   */
  odometer: number;

  /**
   * Accumulated odometer drift in meters.
   *
   * Represents the uncertainty that has built up in the {@link odometer}
   * value due to GPS noise, tunnel blackouts, and other inaccurate samples.
   *
   * ## How to use it
   *
   * Treat this as a confidence interval for {@link odometer}. For example,
   * if `odometer = 12000` and `odometer_error = 40`, the true traveled
   * distance is likely within ±40 meters of the reported value.
   *
   * Resetting or setting a new {@link odometer} value automatically resets
   * `odometer_error` to `0`. Values typically remain low (< 10 m) under
   * good GPS conditions but grow during long tunnels, dense urban canyons, or
   * extended indoor tracking.
   *
   * **See also**
   * - {@link odometer}
   *
   * @example
   * ```ts
   * BackgroundGeolocation.onLocation((location) => {
   *   console.log("Odometer:", location.odometer);
   *   if (location.odometer_error > 50) {
   *     console.warn("High odometer drift — signal quality degraded");
   *   }
   * });
   * ```
   */
  odometer_error: number;

  /**
   * `true` when the SDK was in the **moving** state when this location was
   * recorded.
   */
  is_moving: boolean;

  /**
   * Universally unique identifier for this location record.
   *
   * Use this to correlate locations in your server database with those in the
   * SDK logs, or to detect whether a location has been delivered more than once.
   */
  uuid: string;

  /**
   * SDK event that triggered this location record.
   *
   * One of: `"motionchange"`, `"providerchange"`, `"geofence"`, `"heartbeat"`.
   */
  event?: string;

  /**
   * `true` when the location was generated by a mock location app or simulator.
   */
  mock?: boolean;

  /**
   * `true` for intermediate sample locations collected during accuracy
   * convergence.
   *
   * The SDK collects multiple samples when transitioning between motion states
   * or during {@link BackgroundGeolocation.getCurrentPosition} to find the
   * most accurate fix. These samples are delivered to
   * {@link BackgroundGeolocation.onLocation} but are **not** persisted to
   * SQLite. Filter them out before manually posting locations to your server.
   */
  sample?: boolean;

  /**
   * Geographic coordinates: latitude, longitude, accuracy, speed, heading,
   * and altitude.
   */
  coords: Coords;

  /**
   * Device battery state at the time this location was recorded.
   */
  battery: Battery;

  /**
   * Optional arbitrary metadata attached to this location.
   *
   * Merged with configured {@link PersistenceConfig.extras} before persisting
   * and included in the payload posted to {@link HttpConfig.url}.
   */
  extras?: Record<string, any>;

  /**
   * The geofence event that triggered this location, if applicable.
   *
   * Present only when {@link event} is `"geofence"`.
   */
  geofence?: GeofenceEvent;

  /**
   * Motion activity detected by the device at the time this location was
   * recorded (e.g. `still`, `on_foot`, `in_vehicle`).
   */
  activity: MotionActivity;

  /**
   * Location-services provider state at the time this location was recorded.
   *
   * Present only when {@link event} is `"providerchange"`.
   */
  provider?: ProviderChangeEvent;
}

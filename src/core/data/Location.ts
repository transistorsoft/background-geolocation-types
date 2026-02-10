import { ProviderChangeEvent} from '../events/ProviderChangeEvent';
import { MotionActivityType } from '../../enums/MotionActivityType';
import { GeofenceEvent } from '../events/GeofenceEvent';

/**
 * <!-- doc-id: Coords -->
 * This object is attached to instances of {@link Location.coords}.
 * 
 * @category Data
*/
export interface Coords {
  /**
   * <!-- doc-id: Coords.floor -->
   * __[iOS Only]__ When the environment contains indoor-tracking hardware (eg: bluetooth beacons) the current floor within a building.
   */
  floor?: number;
  /**
   * <!-- doc-id: Coords.latitude -->
   * Latitude of the location.
   */
  latitude: number;
  /**
   * <!-- doc-id: Coords.longitude -->
   * Longitude of the location.
   */
  longitude: number;
  /**
   * <!-- doc-id: Coords.accuracy -->
   * Accuracy in meters.
   */
  accuracy: number;
  /**
   * <!-- doc-id: Coords.altitude -->
   * [iOS] Altitude above sea-level in meters.
   * [Android] The altitude of this location in meters above the WGS84 reference ellipsoid.
   * - See {@link ellipsoidal_altitude}
   *
   */
  altitude?: number;
  /**
   * <!-- doc-id: Coords.ellipsoidal_altitude -->
   * The altitude of this location in meters above the WGS84 reference ellipsoid.
   */
  ellipsoidal_altitude?: number;
  /**
   * <!-- doc-id: Coords.altitude_accuracy -->
   * Altitude accuracy in meters.
   *
   * If this location does not have `altitude_accuracy`, then `-1` is returned.
   *
   * __iOS:__
   *
   * When this property contains 0 or a positive number, the value in the altitude property is plus or minus the specified number of meters. When this property contains a negative number, the value in the altitude property is invalid.
   *
   * Determining the [altitudeAccuracy] requires a device with GPS capabilities. Thus, on some devices, this property always contains a negative value.
   *
   * __Android:__
   *
   * Android defines vertical accuracy at 68% confidence. Specifically, as 1-side of the 2-sided range above and below the estimated altitude reported by [altitude], within which there is a 68% probability of finding the true altitude.
   *
   * In the case where the underlying distribution is assumed Gaussian normal, this would be considered 1 standard deviation.
   *
   * For example, if [altitude] returns `150`, and [verticalAccuracy] returns `20` then there is a 68% probability of the true altitude being between `130` and `170` meters.
   *
   */
  altitude_accuracy?: number;
  /**
   * <!-- doc-id: Coords.heading -->
   * Heading in degrees.
   * ⚠️ Note:  Only present when location came from GPS.  `-1` otherwise.
   */
  heading?: number;
  /**
   * <!-- doc-id: Coords.heading_accuracy -->
   * Heading accuracy in degrees.
   * ⚠️ Note:  Only present when location came from GPS.  `-1` otherwise.
   */
  heading_accuracy?: number;
  /**
   * <!-- doc-id: Coords.speed -->
   * Speed in meters / second.
   * ⚠️ Note:  Only present when location came from GPS.  `-1` otherwise.
   */
  speed?: number;
  /**
   * <!-- doc-id: Coords.speed_accuracy -->
   * Speed accuracy in meters / second.
   * ⚠️ Note:  Only present when location came from GPS.  `-1` otherwise.
   */
  speed_accuracy?: number;
}

/**
 * <!-- doc-id: Battery -->
 * This object is attached to instances of {@link Location.battery}.
 * 
 * @category Data
 */
export interface Battery {
  /**
   * <!-- doc-id: Battery.is_charging -->
   * `true` when device is plugged in to power.
   */
  is_charging: boolean;
  /**
   * <!-- doc-id: Battery.level -->
   * Battery level.  `0.0` = empty; `1.0` = full charge.
   */
  level: number;
}

/**
 * <!-- doc-id: MotionActivity -->
 * The last known motion-activity when this location was recorded.
 * 
 * @category Data
 */
export interface MotionActivity {
  /**
   * <!-- doc-id: MotionActivity.type -->
   * The reported device {@link MotionActivityType motion activity} (eg: `still`, `on_foot`, `in_vehicle`).
   */
  type: MotionActivityType;
  /**
   * <!-- doc-id: MotionActivity.confidence -->
   * Confidence of the reported device motion activity in %.
   */
  confidence: number;
}

/**
 * <!-- doc-id: Location -->
 * A `Location` object represents a geographic location captured by the device's native location API.
 * 
 * - `CLLocationManager` delivers instance of `CLLocation` on iOS
 * - `FusedLocationProviderClient` deliver instance of `android.location.Location` on Android
 *
 * __Javascript Callback Schema__
 * 
 * @example
 * ```
 * {
 *    "timestamp":     [Date],     // <-- Javascript Date instance
 *    "event":         [String],   // <-- motionchange|geofence|heartbeat
 *    "is_moving":     [Boolean],  // <-- The motion-state when location was recorded.
 *    "uuid":          [String],   // <-- Universally unique identifier
 *    "age":           [Integer],  // <-- Age of the location in milliseconds
 *    "coords": {
 *        "latitude":  [Double],
 *        "longitude": [Double],
 *        "accuracy":  [Double],
 *        "speed":     [Double],
 *        "heading":   [Double],
 *        "altitude":  [Double]
 *        "ellipsoidal_altitude":  [Double]
 *    },
 *    "activity": {
 *        "type": [still|on_foot|walking|running|in_vehicle|on_bicycle],
 *        "confidence": [0-100%]
 *    },
 *    "battery": {
 *        "level": [Double],
 *        "is_charging": [Boolean]
 *    },
 *    "odometer": [Double/meters]
 * }
 * ```
 * 
 * __HTTP POST Schema__
 *
 * The location-data schema POSTed to your server takes the following form:
 * @example
 * ```
 * {
 *     "location": {
 *         "coords": {
 *             "latitude":   [Double],
 *             "longitude":  [Double],
 *             "accuracy":   [Double],
 *             "speed":      [Double],
 *             "heading":    [Double],
 *             "altitude":   [Double],
 *             "ellipsoidal_altitude": [Double]
 *         },
 *         "extras": {   // <-- optional meta-data
 *             "foo": "bar"
 *         },
 *         "activity": {
 *             "type": [still|on_foot|walking|running|in_vehicle|on_bicycle|unknown],
 *             "confidence": [0-100%]
 *         },
 *         "geofence": {  // <-- Present only if a geofence was triggered at this location
 *             "identifier": [String],
 *             "action": [String ENTER|EXIT]
 *         },
 *         "battery": {
 *             "level": [Double],
 *             "is_charging": [Boolean]
 *         },
 *         "timestamp": [ISO-8601 UTC], // eg:  "2015-05-05T04:31:54.123Z"
 *         "age":       [Integer],      // <-- Age of the location in milliseconds
 *         "uuid":      [String],       // <-- Universally unique identifier
 *         "event"      [String],       // <-- motionchange|geofence|heartbeat
 *         "is_moving": [Boolean],      // <-- The motion-state when recorded.
 *         "odometer": [Double/meters]
 *     }
 *  }
 * ```
 * 
 * @category Data
 */
export interface Location {
  /**
   * <!-- doc-id: Location.timestamp -->
   * `ISO-8601 UTC` timestamp provided by the native location API.
   */
  timestamp: string;
  /**
   * <!-- doc-id: Location.age -->
   * The age of the location in milliseconds, relative to the Device system-time when the location was received.
   * For example, if the reported `age` is `10000`, that location was recorded 10s ago, relative to the system-time.
   * `location.timestamp` + `location.age` = Device system-time when location was recorded.
  */
  age: number;
  /**
   * <!-- doc-id: Location.odometer -->
   * Total distance traveled, in meters, since the odometer was last set or reset.
   *
   * The SDK continuously integrates distance between recorded locations to maintain
   * a running total. This value increases regardless of tracking mode and persists
   * across app restarts (unless explicitly reset).
   *
   * __ℹ️ How it's calculated:__
   * - Distance is computed between each pair of accepted locations.
   * - The {@link LocationFilter} evaluates the accuracy and motion context of each sample.
   * - Low-quality samples may be rejected or down-weighted depending on
   *   {@link LocationFilter.odometerAccuracyThreshold}, reducing odometer pollution.
   * - The accumulated drift is exposed via {@link Location.odometer_error}.
   *
   * __When the odometer increases:__
   * - After the device moves and a new location is recorded.
   * - During both moving and stationary states (if minor motion is detected).
   * - In geofences-only mode, the odometer increases whenever a location is recorded
   *   for a geofence transition or stationary exit.
   *
   * __When it does *not* increase:__
   * - When a sample fails accuracy thresholds.
   * - When {@link is_moving} is false *and* no sufficient movement occurs.
   *
   * __Resetting or setting the odometer:__
   * - Use {@link BackgroundGeolocation.resetOdometer} to zero it out.
   * - Use {@link BackgroundGeolocation.setOdometer} to force a new value manually.
   *   This also resets {@link Location.odometer_error} to `0`.
   *
   * __Persistence:__
   * - The odometer value is stored in `State` and is restored after app restart.
   * - Only a user-initiated reset or explicit call to `setOdometer` clears it.
   *
   * __Best practices:__
   * - Display the odometer directly to users (e.g., trip distance, workout distance).
   * - Use {@link Location.odometer_error} to measure confidence in the odometer.
   * - For fitness apps, consider resetting it at the beginning of each workout session.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.onLocation(location => {
   *   console.log("Distance traveled:", location.odometer);
   *
   *   if (location.odometer_error > 25) {
   *     console.warn("Odometer accuracy degraded");
   *   }
   * });
   *
   * // Reset at start of a trip
   * await BackgroundGeolocation.resetOdometer();
   * ```
   *
   * ℹ️
   * - {@link LocationFilter}
   * - {@link LocationFilter.odometerAccuracyThreshold}
   * - {@link BackgroundGeolocation.resetOdometer}
   * - {@link BackgroundGeolocation.getOdometer}
   */
  odometer: number;
  /**
   * <!-- doc-id: Location.odometer_error -->
   * Accumulated **odometer drift**, in meters.
   *
   * __ℹ️ Why does this exist?__
   * - The SDK maintains a continuously increasing {@link odometer} value by integrating distance between recorded locations.
   * - When GNSS accuracy is degraded (tunnels, downtown canyons, indoor / underground environments), distance calculations can accumulate **drift**.
   * - The `odometer_error` value tells you *how much uncertainty* has accumulated in the current odometer estimate.
   *
   * __How to use it:__
   * - Treat this as a “confidence interval” for {@link odometer}.  
   *   For example, if `odometer = 12000` and `odometer_error = 40`, the *true* travelled distance is likely within **±40 meters** of the reported value.
   * - Resetting or setting a new {@link odometer} value automatically resets `odometer_error` to `0`.
   * - Values typically remain low (e.g., < 10m) during good GPS conditions, but can grow during:
   *   - long tunnels  
   *   - heavy multipath environments  
   *   - extended indoor tracking  
   *
   * __Best practice:__
   * - Display `odometer` normally to end-users.
   * - Use `odometer_error` internally for data-quality scoring, filtering, or highlighting low-accuracy segments.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.onLocation(location => {
   *   console.log("Odometer:", location.odometer);
   *   console.log("Odometer drift:", location.odometer_error);
   *
   *   if (location.odometer_error > 50) {
   *     console.warn("High odometer drift — signal quality degraded");
   *   }
   * });
   * ```
   * ℹ️
   * - {@link odometer}
   */  
  odometer_error: number;
  /**
   * <!-- doc-id: Location.is_moving -->
   * `true` if location was recorded while plugin is in the *moving* state.
   */
  is_moving: boolean;
  /**
   * <!-- doc-id: Location.uuid -->
   * Universally Unique Identifier.  You can use this to match locations recorded at your server with those in the logs.
   * It can also be used to ensure if the plugin has ever posted the same location *twice*.
   */
  uuid: string;
  /**
   * <!-- doc-id: Location.event -->
   * Event responsible for generating this location (`motionchange`, `providerchange`, `geofence`, `heartbeat`).
   */
  event?: string;
  /**
   * <!-- doc-id: Location.mock -->
   * Present (and `true`) if the location was generated by a "Fake Location" application or simulator.
   */
  mock?: boolean;
  /**
   * <!-- doc-id: Location.sample -->
   * `true` if the plugin is currently waiting for the best possible location to arrive.  Samples are recorded when the plugin is transitioning between motion-states (*moving* vs *stationary*) or {@link BackgroundGeolocation.getCurrentPosition}.
   * If you're manually posting location to your server, you should not persist these "samples".
   */
  sample?: boolean;
  /**
   * <!-- doc-id: Location.coords -->
   * `latitude`, `longitude`, `speed`, `heading`, etc.
   */
  coords: Coords;
  /**
   * <!-- doc-id: Location.battery -->
   * Device battery level when the location was recorded.
   */
  battery: Battery;
  /**
   * <!-- doc-id: Location.extras -->
   * Optional arbitrary meta-data attached to this location.
   */
  extras?: Record<string, any>;
  /**
   * <!-- doc-id: Location.geofence -->
   * If this location was recorded due to a geofence transition, the corresponding geofence-event.
   */
  geofence?: GeofenceEvent;
  /**
   * <!-- doc-id: Location.activity -->
   * Device motion-activity when this location was recorded (eg: `still`, `on_foot`, `in_vehicle`).
   */
  activity: MotionActivity;
  /**
   * <!-- doc-id: Location.provider -->
   * If this location was recorded due to {@link ProviderChangeEvent}, this is a reference to the location-provider state.
   */
  provider?: ProviderChangeEvent;
}
import type { Location } from '../data/Location';
import type { GeofenceAction } from '../../enums/GeofenceAction';
import { Geofence } from '../data/Geofence';

/**
 * Geofence transition delivered to {@link BackgroundGeolocation.onGeofence}.
 *
 * The SDK fires this event each time the device crosses a monitored geofence
 * boundary. Each event carries the transition type (`ENTER`, `EXIT`, or
 * `DWELL`), the location recorded at the moment of the crossing, and the full
 * {@link Geofence} record that triggered it.
 *
 * @example
 * ```ts
 * BackgroundGeolocation.onGeofence((event) => {
 *   console.log(
 *     "[onGeofence]",
 *     event.identifier,
 *     event.action,
 *     event.location
 *   );
 * });
 * ```
 *
 * @category Events
 * @category Geofencing
 */
export interface GeofenceEvent {
  /**
   * ISO-8601 UTC timestamp from the device system clock at the moment the OS
   * delivered the geofence event.
   */
  timestamp: string;
  /**
   * The {@link Geofence.identifier} of the geofence that triggered this event.
   */
  identifier: string;
  /**
   * Transition type that fired: `ENTER`, `EXIT`, or `DWELL`.
   */
  action: GeofenceAction;
  /**
   * Location recorded at the moment the geofence boundary was crossed.
   */
  location: Location;
  /**
   * Optional metadata originally configured on the {@link Geofence}. Present
   * only when the geofence was created with an `extras` map.
   */
  extras?: Record<string, any>;
  /**
   * The complete {@link Geofence} record that triggered this event.
   */
  geofence?: Geofence;
}

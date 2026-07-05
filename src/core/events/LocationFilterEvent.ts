import type { Location } from '../data/Location';
import type { LocationFilterReason } from '../../enums/LocationFilterReason';

/**
 * Identifies the geofence trigger that {@link LocationFilterEvent} reports as rejected:
 * the fence, the rejected transition (`ENTER` | `EXIT`), why it was rejected, and the
 * trigger-vs-fence geometry when it was evaluated.
 *
 * @category Events
 */
export interface GeofenceFilterInfo {
  /** Identifier of the geofence whose trigger was rejected. */
  identifier: string;
  /** The rejected transition: `"ENTER"` | `"EXIT"`. */
  action: string;
  /** Verdict detail, eg: `"spurious EXIT (no path evidence of transit)"`. */
  reason: string;
  /** Trigger distance from the fence center (meters); `-1` when not evaluated. */
  dist: number;
  /** The fence radius (meters). */
  radius: number;
  /** How far outside the fence boundary (plus margin) the trigger sat (meters); `-1` when not evaluated. */
  outsideBy: number;
}

/**
 * Delivered to {@link BackgroundGeolocation.onLocationFilter} when the SDK **rejects**
 * data before it reaches your event stream — either a raw tracking sample rejected by
 * the location-filter, or a **geofence trigger** rejected as spurious or duplicate.
 *
 * Rejected data is **not** delivered to {@link BackgroundGeolocation.onLocation} /
 * {@link BackgroundGeolocation.onGeofence}, so this event is the only way to observe
 * and adapt to it (eg: accuracy degrading while stationary, or auditing which geofence
 * transitions the SDK suppressed and why).
 *
 * **Discriminator**: {@link geofence} is present *only* when the rejected datum is a
 * geofence trigger — it names the fence and the rejected transition, and
 * {@link location} carries the trigger fix that caused it.
 *
 * @example
 * ```ts
 * BackgroundGeolocation.onLocationFilter((event) => {
 *   if (event.geofence) {
 *     // A geofence trigger was rejected.
 *     const gf = event.geofence;
 *     console.log(`[onLocationFilter] geofence ${gf.action} '${gf.identifier}' rejected: ${gf.reason}`);
 *     console.log("- trigger location:", event.location);
 *   } else {
 *     // A raw tracking sample was rejected.
 *     console.log("[onLocationFilter] rejected:", event.reason, event.accuracy);
 *     if (event.accuracy > event.trackingAccuracyThreshold * 5) {
 *       // GPS has degraded badly — adapt (eg: surface a "poor signal" hint).
 *     }
 *   }
 * });
 * ```
 *
 * @category Events
 */
export interface LocationFilterEvent {
  /**
   * The rejected location — the raw sample that failed the filter, or, for geofence
   * rejections, the trigger fix that fired the rejected transition.
   *
   * The coordinates, accuracy, and timestamp describe the rejected sample itself.
   * Derived fields such as {@link Location.odometer} reflect the **last accepted**
   * fix — a rejected sample does not advance the odometer.
   */
  location: Location;
  /**
   * Normalized reason the location was rejected.
   */
  reason: LocationFilterReason;
  /**
   * Horizontal accuracy (meters) of the rejected sample. Convenience copy of
   * {@link Location.coords}.`accuracy` for quick threshold comparison.
   */
  accuracy: number;
  /**
   * The {@link LocationFilter.trackingAccuracyThreshold} (meters) in effect when
   * the sample was rejected. Lets you detect "accuracy degraded past my
   * threshold" without separately reading the config.
   *
   * `-1` for geofence-trigger rejections, where it is not applicable.
   */
  trackingAccuracyThreshold: number;
  /**
   * Present when a geofence `ENTER`/`EXIT` trigger was rejected rather than a
   * tracking sample: identifies the fence, the rejected transition, and why —
   * {@link location} carries the trigger fix that caused it.
   */
  geofence?: GeofenceFilterInfo;
}

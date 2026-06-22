import type { Location } from '../data/Location';
import type { LocationFilterReason } from '../../enums/LocationFilterReason';

/**
 * Delivered to {@link BackgroundGeolocation.onLocationFilter} when the SDK's
 * tracking location-filter **rejects** a raw location sample.
 *
 * Rejected locations are **not** delivered to {@link BackgroundGeolocation.onLocation},
 * so this event is the only way to observe and adapt to them (eg: accuracy
 * degrading while stationary).
 *
 * @example
 * ```ts
 * BackgroundGeolocation.onLocationFilter((event) => {
 *   console.log("[onLocationFilter] rejected:", event.reason, event.accuracy);
 *   if (event.accuracy > event.trackingAccuracyThreshold * 5) {
 *     // GPS has degraded badly — adapt (eg: surface a "poor signal" hint).
 *   }
 * });
 * ```
 *
 * @category Events
 */
export interface LocationFilterEvent {
  /**
   * The rejected location (the raw sample that failed the filter).
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
   */
  trackingAccuracyThreshold: number;
}

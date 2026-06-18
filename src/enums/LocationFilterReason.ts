/**
 * Reason a location was rejected by the tracking location-filter, delivered to
 * {@link BackgroundGeolocation.onLocationFilter} via {@link LocationFilterEvent.reason}.
 *
 * | Value | Reason |
 * |-------|--------|
 * | `"low-accuracy"`   | Horizontal accuracy was worse than {@link LocationFilter.trackingAccuracyThreshold}. |
 * | `"implied-speed"`  | Implied speed between samples exceeded the plausible maximum (likely a GPS spike). |
 * | `"outlier-capped"` | Sample was a statistical outlier well beyond the expected travel distance. |
 *
 * @category Events
 */
export const LocationFilterReason = {
  /**
   * Horizontal accuracy was worse than {@link LocationFilter.trackingAccuracyThreshold}.
   */
  LowAccuracy: 'low-accuracy',
  /**
   * Implied speed between samples exceeded the plausible maximum (likely a GPS spike).
   */
  ImpliedSpeed: 'implied-speed',
  /**
   * Sample was a statistical outlier well beyond the expected travel distance.
   */
  OutlierCapped: 'outlier-capped',
} as const;

/**
 * Union type of possible location-filter rejection reasons.
 * @internal @hidden
 */
export type LocationFilterReason = (typeof LocationFilterReason)[keyof typeof LocationFilterReason];

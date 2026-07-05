/**
 * Reason a location was rejected by the tracking location-filter, delivered to
 * {@link BackgroundGeolocation.onLocationFilter} via {@link LocationFilterEvent.reason}.
 *
 * | Value | Reason |
 * |-------|--------|
 * | `"low-accuracy"`   | Horizontal accuracy was worse than {@link LocationFilter.trackingAccuracyThreshold}. |
 * | `"implied-speed"`  | Implied speed between samples exceeded the plausible maximum (likely a GPS spike). |
 * | `"outlier-capped"` | Sample was a statistical outlier well beyond the expected travel distance. |
 * | `"geofence-spurious-exit"` | A geofence `EXIT` trigger was rejected — GPS jitter while stationary, an implausibly distant trigger, or no recorded-path evidence that the fence was ever transited. See {@link LocationFilterEvent.geofence}. |
 * | `"geofence-duplicate-enter"` | A geofence `ENTER` trigger was rejected because the SDK already holds the fence in the entered state. See {@link LocationFilterEvent.geofence}. |
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
  /**
   * A geofence `EXIT` trigger was rejected — GPS jitter while stationary, an
   * implausibly distant trigger, or no recorded-path evidence that the fence was
   * ever transited.  {@link LocationFilterEvent.geofence} identifies the fence and
   * carries the verdict detail.
   */
  GeofenceSpuriousExit: 'geofence-spurious-exit',
  /**
   * A geofence `ENTER` trigger was rejected because the SDK already holds the
   * fence in the entered state.  {@link LocationFilterEvent.geofence} identifies
   * the fence.
   */
  GeofenceDuplicateEnter: 'geofence-duplicate-enter',
} as const;

/**
 * Union type of possible location-filter rejection reasons.
 * @internal @hidden
 */
export type LocationFilterReason = (typeof LocationFilterReason)[keyof typeof LocationFilterReason];

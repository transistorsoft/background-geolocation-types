/**
 * Persistence modes for BackgroundGeolocation SDK.
 * Mirrors Flutter's `PersistMode` enum.
 * 
 * @category Config
 */
export const PersistMode = {
  /**
   * Persist both location and geofence data.
   */
  All: 2,
  /**
   * Persist location data only.
   */
  Location: 1,
  /**
   * Persist geofence data only.
   */
  Geofence: -1,
  /**
   * Do not persist any data.
   */
  None: 0
} as const;

/** @internal @hidden */
export type PersistMode = (typeof PersistMode)[keyof typeof PersistMode];
/**
 * <!-- doc-id: PersistMode -->
 * Persistence modes for BackgroundGeolocation SDK.
 * Mirrors Flutter's `PersistMode` enum.
 * 
 * @category Config
 */
export const PersistMode = {
  /**
   * <!-- doc-id: PersistMode.All -->
   * Persist both location and geofence data.
   */
  All: 2,
  /**
   * <!-- doc-id: PersistMode.Location -->
   * Persist location data only.
   */
  Location: 1,
  /**
   * <!-- doc-id: PersistMode.Geofence -->
   * Persist geofence data only.
   */
  Geofence: -1,
  /**
   * <!-- doc-id: PersistMode.None -->
   * Do not persist any data.
   */
  None: 0
} as const;

/** @internal @hidden */
export type PersistMode = (typeof PersistMode)[keyof typeof PersistMode];
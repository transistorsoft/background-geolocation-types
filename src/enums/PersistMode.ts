/**
 * Persistence modes for BackgroundGeolocation SDK.
 * Mirrors Flutter's `PersistMode` enum.
 * 
 * @category Config
 */
export const PersistMode = {
  All: 2,
  Location: 1,
  Geofence: -1,
  None: 0
} as const;

/** @internal @hidden */
export type PersistMode = (typeof PersistMode)[keyof typeof PersistMode];
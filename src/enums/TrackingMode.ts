/**
 * SDK tracking mode (legacy RN values preserved).
 *
 * | Value | Name       | Description                   |
 * |------:|------------|-------------------------------|
 * | 0     | Geofences  | Monitor geofences only.       |
 * | 1     | Location   | Monitor location + geofences. |
 * 
 * @category Config
 */
export const TrackingMode = {
  Geofences: 0,
  Location: 1
} as const;

/** @internal @hidden */
export type TrackingMode = typeof TrackingMode[keyof typeof TrackingMode];
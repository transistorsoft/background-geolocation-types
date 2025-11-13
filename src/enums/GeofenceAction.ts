/**
 * Geofence transition actions emitted by the SDK 
 * 
 * Used with {@link GeofenceEvent} from {@link BackgroundGeolocation.onGeofence}.   
 *  
 * | Action | Meaning                      |
 * |--------|------------------------------|
 * | ENTER  | Device entered the geofence  |
 * | EXIT   | Device exited the geofence   |
 * | DWELL  | Device dwelled inside        |
 * 
 * @category Events
 */
export const GeofenceAction = {
  Enter: 'ENTER',
  Exit: 'EXIT',
  Dwell: 'DWELL'
} as const;

/** 
 * Union of geofence transition strings. 
 * @internal @hidden
 */
export type GeofenceAction =
  (typeof GeofenceAction)[keyof typeof GeofenceAction];
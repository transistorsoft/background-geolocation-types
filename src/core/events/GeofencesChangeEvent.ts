import type { Geofence } from '../data/Geofence';

/** 
 * Emitted by {@link BackgroundGeolocation.onGeofencesChange}.
 * 
 * @category Events
 */
export interface GeofencesChangeEvent {
  /** 
   * Geofences that have just been activated. 
   */ 
  on: Geofence[];
  /** 
   * Identifiers of geofences that have just been de-activated (or removed). 
   */
  off: string[];
}
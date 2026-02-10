import type { Geofence } from '../data/Geofence';

/** 
 * <!-- doc-id: GeofencesChangeEvent -->
 * Emitted by {@link BackgroundGeolocation.onGeofencesChange}.
 * 
 * @category Events
 */
export interface GeofencesChangeEvent {
  /** 
   * <!-- doc-id: GeofencesChangeEvent.on -->
   * Geofences that have just been activated. 
   */ 
  on: Geofence[];
  /** 
   * <!-- doc-id: GeofencesChangeEvent.off -->
   * Identifiers of geofences that have just been de-activated (or removed). 
   */
  off: string[];
}
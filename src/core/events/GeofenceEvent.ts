import type { Location } from '../data/Location';
import type { GeofenceAction } from '../../enums/GeofenceAction';
import { Geofence } from '../data/Geofence';
/** 
 * Emitted by {@link BackgroundGeolocation.onGeofence}.
 * 
 * @category Events
 * @category Geofencing
 */
export interface GeofenceEvent {
  /** 
   * Device system time when the OS received the geofence event. */
  timestamp: string;
  /** 
   * Identifier of the geofence which fired. 
   */ 
  identifier: string;
  /** 
   * Transition type: 'ENTER' | 'EXIT' | 'DWELL'. 
   */ 
  action: GeofenceAction;
  /** 
   * Location where the geofence transition occurred. 
   */ 
  location: Location;
  /** 
   * Optional extras originally configured on the Geofence. 
   */
  extras?: Record<string, any>;
  /** 
   * Geofence record which fired 
   */
  geofence?:Geofence;
}
import type { Location } from '../data/Location';
import type { GeofenceAction } from '../../enums/GeofenceAction';
import { Geofence } from '../data/Geofence';
/** 
 * <!-- doc-id: GeofenceEvent -->
 * Emitted by {@link BackgroundGeolocation.onGeofence}.
 * 
 * @category Events
 * @category Geofencing
 */
export interface GeofenceEvent {
  /** 
   * <!-- doc-id: GeofenceEvent.timestamp -->
   * Device system time when the OS received the geofence event. */
  timestamp: string;
  /** 
   * <!-- doc-id: GeofenceEvent.identifier -->
   * Identifier of the geofence which fired. 
   */ 
  identifier: string;
  /** 
   * <!-- doc-id: GeofenceEvent.action -->
   * Transition type: 'ENTER' | 'EXIT' | 'DWELL'. 
   */ 
  action: GeofenceAction;
  /** 
   * <!-- doc-id: GeofenceEvent.location -->
   * Location where the geofence transition occurred. 
   */ 
  location: Location;
  /** 
   * <!-- doc-id: GeofenceEvent.extras -->
   * Optional extras originally configured on the Geofence. 
   */
  extras?: Record<string, any>;
  /** 
   * <!-- doc-id: GeofenceEvent.geofence -->
   * Geofence record which fired 
   */
  geofence?:Geofence;
}
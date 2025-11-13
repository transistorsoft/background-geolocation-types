/** 
 * A geofence definition persisted by the SDK and monitored natively. 
 * @category Data
 */
export interface Geofence {
  identifier: string;
  latitude: number;
  longitude: number;
  radius: number;
  notifyOnEntry?: boolean;
  notifyOnExit?: boolean;
  notifyOnDwell?: boolean;
  /** ms; used when notifyOnDwell is true */
  loiteringDelay?: number;
  extras?: Record<string, unknown>;
}


import type { Location } from '../data/Location';

/** 
 * <!-- doc-id: HeartbeatEvent -->
 * Emitted by {@link BackgroundGeolocation.onHeartbeat}.
 * 
 * @category Events
 */
export interface HeartbeatEvent {
  /**
   * <!-- doc-id: HeartbeatEvent.location -->
   * The last-known location.
   * Note: Heartbeat does not actively engage location-services.
   * Use getCurrentPosition for a fresh fix.
   */
  location: Location;
}
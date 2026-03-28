import type { Location } from '../data/Location';

/** 
 * Emitted by {@link BackgroundGeolocation.onHeartbeat}.
 * 
 * @category Events
 */
export interface HeartbeatEvent {
  /**
   * The last-known location.
   * Note: Heartbeat does not actively engage location-services.
   * Use getCurrentPosition for a fresh fix.
   */
  location: Location;
}
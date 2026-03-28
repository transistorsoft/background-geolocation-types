import type { Location } from '../data/Location';

/**
 * Periodic heartbeat delivered to {@link BackgroundGeolocation.onHeartbeat}.
 *
 * The SDK fires this event on a fixed interval while running in the background,
 * providing a regular opportunity to perform work even when no location events
 * are occurring. Configure the interval with {@link AppConfig.heartbeatInterval}.
 *
 * @example
 * ```ts
 * BackgroundGeolocation.onHeartbeat(async (event) => {
 *   console.log("[onHeartbeat]", event.location);
 *
 *   // Request a fresh location fix if needed.
 *   const location = await BackgroundGeolocation.getCurrentPosition({
 *     samples: 1
 *   });
 *   console.log("[onHeartbeat] fresh position:", location);
 * });
 * ```
 *
 * @category Events
 */
export interface HeartbeatEvent {
  /**
   * Most recent location recorded by the SDK.
   *
   * The heartbeat event does not actively request a fresh location fix. Call
   * {@link BackgroundGeolocation.getCurrentPosition} if an up-to-date reading
   * is required.
   */
  location: Location;
}

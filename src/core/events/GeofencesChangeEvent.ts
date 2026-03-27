import type { Geofence } from '../data/Geofence';

/**
 * <!-- doc-id: GeofencesChangeEvent -->
 * Geofence monitoring change delivered to {@link BackgroundGeolocation.onGeofencesChange}.
 *
 * The SDK can only monitor a finite number of geofences simultaneously. As the
 * device moves, it activates the geofences closest to the current position and
 * deactivates those that are too far away. This event fires whenever that set
 * changes — reporting which geofences just became active (`on`) and which were
 * just removed from active monitoring (`off`).
 *
 * @example
 * ```ts
 * BackgroundGeolocation.onGeofencesChange((event) => {
 *   for (const geofence of event.on) {
 *     console.log("[onGeofencesChange] Activated:", geofence.identifier);
 *   }
 *   for (const identifier of event.off) {
 *     console.log("[onGeofencesChange] Deactivated:", identifier);
 *   }
 * });
 * ```
 *
 * @category Events
 */
export interface GeofencesChangeEvent {
  /**
   * <!-- doc-id: GeofencesChangeEvent.on -->
   * Geofences that just became active and are now being monitored.
   */
  on: Geofence[];
  /**
   * <!-- doc-id: GeofencesChangeEvent.off -->
   * Identifiers of geofences that were just deactivated and are no longer
   * being monitored.
   */
  off: string[];
}

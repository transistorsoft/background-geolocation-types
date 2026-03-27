import type { Location } from '../data/Location';

/**
 * <!-- doc-id: MotionChangeEvent -->
 * Motion-state change delivered to {@link BackgroundGeolocation.onMotionChange}.
 *
 * The SDK fires this event each time it transitions between the **moving** and
 * **stationary** states. A location is always recorded at the moment of transition.
 *
 * @example
 * ```ts
 * BackgroundGeolocation.onMotionChange((event) => {
 *   if (event.isMoving) {
 *     console.log("[onMotionChange] Device is moving:", event.location);
 *   } else {
 *     console.log("[onMotionChange] Device is stationary:", event.location);
 *   }
 * });
 * ```
 *
 * @category Events
 */
export interface MotionChangeEvent {
  /**
   * <!-- doc-id: MotionChangeEvent.isMoving -->
   * `true` when the SDK has transitioned to the **moving** state; `false` when
   * it has transitioned to the **stationary** state.
   */
  isMoving: boolean;
  /**
   * <!-- doc-id: MotionChangeEvent.location -->
   * Location recorded at the moment the motion-state transition was detected.
   */
  location: Location;
}

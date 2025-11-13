import type { Location } from '../data/Location';

/** 
 * Emitted by {@link BackgroundGeolocation.onMotionChange}.
 * 
 * @category Events
 */
export interface MotionChangeEvent {
  /** True when moving; false when stationary. */
  isMoving: boolean;
  /** Location associated with the motionchange. */
  location: Location;
}
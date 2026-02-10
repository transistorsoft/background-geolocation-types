import type { Location } from '../data/Location';

/** 
 * <!-- doc-id: MotionChangeEvent -->
 * Emitted by {@link BackgroundGeolocation.onMotionChange}.
 * 
 * @category Events
 */
export interface MotionChangeEvent {
  /** 
   * <!-- doc-id: MotionChangeEvent.isMoving -->
   * True when moving; false when stationary. 
   */ 
  isMoving: boolean;
  /** 
   * <!-- doc-id: MotionChangeEvent.location -->
   * Location associated with the motionchange. 
   */
  location: Location;
}
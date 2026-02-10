import type { MotionActivityType } from '../../enums/MotionActivityType';

/**  
 * <!-- doc-id: MotionActivityEvent -->
 * Emitted by {@link BackgroundGeolocation.onActivityChange}.
 * 
 * @category Events
 */
export interface MotionActivityEvent {
  /** 
   * <!-- doc-id: MotionActivityEvent.activity -->
   * Reported device motion activity. 
   */
  activity: MotionActivityType;
  /** 
   * <!-- doc-id: MotionActivityEvent.confidence -->
   * Confidence of the reported activity in percent. 
   */
  confidence: number;
}
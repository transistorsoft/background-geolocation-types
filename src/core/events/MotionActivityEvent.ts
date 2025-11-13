import type { MotionActivityType } from '../../enums/MotionActivityType';

/**  
 * Emitted by {@link BackgroundGeolocation.onActivityChange}.
 * 
 * @category Events
 */
export interface MotionActivityEvent {
  /** Reported device motion activity. */
  activity: MotionActivityType;
  /** Confidence of the reported activity in percent. */
  confidence: number;
}
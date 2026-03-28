import type { Event } from '../../enums/Event';

/** 
 * Event for Android headless tasks registered via {@link BackgroundGeolocation.registerHeadlessTask}
 * 
 * @category Events
 */
export interface HeadlessEvent {
  /** 
   * BackgroundGeolocation event name (e.g., 'location', 'http', 'terminate'). 
   */
  name: Event;
  /** 
   * General event params according to the event context. 
   */
  params: Record<string, any>;
}
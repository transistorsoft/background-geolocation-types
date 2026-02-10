import type { Event } from '../../enums/Event';

/** 
 * <!-- doc-id: HeadlessEvent -->
 * Event for Android headless tasks registered via {@link BackgroundGeolocation.registerHeadlessTask}
 * 
 * @category Events
 */
export interface HeadlessEvent {
  /** 
   * <!-- doc-id: HeadlessEvent.name -->
   * BackgroundGeolocation event name (e.g., 'location', 'http', 'terminate'). 
   */
  name: Event;
  /** 
   * <!-- doc-id: HeadlessEvent.params -->
   * General event params according to the event context. 
   */
  params: Record<string, any>;
}
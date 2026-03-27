import type { Event } from '../../enums/Event';

/**
 * <!-- doc-id: HeadlessEvent -->
 * Event delivered to a headless task registered via
 * {@link BackgroundGeolocation.registerHeadlessTask}. [Android only]
 *
 * Headless tasks allow the app to handle SDK events while running in the
 * background without a UI — including after the app has been terminated by the
 * user. Each task invocation receives a `HeadlessEvent` describing which SDK
 * event occurred and carrying the associated payload.
 *
 * @example
 * ```ts
 * const headlessTask = async (event: HeadlessEvent) => {
 *   const { name, params } = event;
 *   console.log("[HeadlessTask]", name, params);
 *
 *   if (name === "location") {
 *     const location = params as Location;
 *     console.log("[HeadlessTask] location:", location);
 *   } else if (name === "http") {
 *     const httpEvent = params as HttpEvent;
 *     console.log("[HeadlessTask] http status:", httpEvent.status);
 *   }
 * };
 *
 * BackgroundGeolocation.registerHeadlessTask(headlessTask);
 * ```
 *
 * @category Events
 */
export interface HeadlessEvent {
  /**
   * <!-- doc-id: HeadlessEvent.name -->
   * The SDK event that triggered this headless task invocation (e.g.
   * `location`, `http`, `geofence`, `heartbeat`, `terminate`).
   */
  name: Event;
  /**
   * <!-- doc-id: HeadlessEvent.params -->
   * Event payload corresponding to `name`. Cast this to the appropriate event
   * type based on the value of `name` (e.g. {@link Location} for `location`,
   * {@link HttpEvent} for `http`).
   */
  params: Record<string, any>;
}

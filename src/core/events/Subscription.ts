/**
 * <!-- doc-id: Subscription -->
 * Handle returned by every `BackgroundGeolocation.on*` event-listener method.
 *
 * `Subscription` exposes a single {@link remove} method used to stop
 * listening to an event and free associated resources. Always call `remove()`
 * when a listener is no longer needed to prevent memory leaks.
 *
 * ### Removing an event-listener
 *
 * @example
 * ```ts
 * const subscription = BackgroundGeolocation.onLocation((location) => {
 *   console.log("[onLocation]", location);
 * });
 *
 * // Later, when the listener is no longer needed:
 * subscription.remove();
 * ```
 *
 * ### Managing multiple subscriptions
 *
 * Collect subscriptions in an array and remove them all at once — for example
 * when a view is destroyed.
 *
 * @example
 * ```ts
 * import BackgroundGeolocation, {
 *   Location,
 *   Subscription
 * } from "react-native-background-geolocation";
 *
 * const subscriptions: Subscription[] = [];
 *
 * function addListeners() {
 *   subscriptions.push(
 *     BackgroundGeolocation.onLocation((location: Location) => {
 *       console.log("[onLocation]", location);
 *     }),
 *     BackgroundGeolocation.onMotionChange((event) => {
 *       console.log("[onMotionChange]", event);
 *     }),
 *     BackgroundGeolocation.onEnabledChange((enabled: boolean) => {
 *       console.log("[onEnabledChange]", enabled);
 *     })
 *   );
 * }
 *
 * function removeListeners() {
 *   subscriptions.forEach((sub) => sub.remove());
 *   subscriptions.length = 0;
 * }
 * ```
 *
 * @category Events
 */
export interface Subscription {
  /**
   * <!-- doc-id: Subscription.remove -->
   * Removes the event-listener and frees its resources. Call this when the
   * listener is no longer needed to prevent memory leaks.
   */
  remove(): void;
}

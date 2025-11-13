/**
  * Object returned by BackgroundGeolocation event-listeners.  
  * 
  * `Subscription` contains just a single method {@link remove}, used for removing an event-listener.
  *
  * - {@link BackgroundGeolocation.onLocation}
  * - {@link BackgroundGeolocation.onMotionChange}
  * - {@link BackgroundGeolocation.onHttp}
  * - {@link BackgroundGeolocation.onHeartbeat}
  * - {@link BackgroundGeolocation.onProviderChange}
  * - {@link BackgroundGeolocation.onActivityChange}
  * - {@link BackgroundGeolocation.onGeofence}
  * - {@link BackgroundGeolocation.onGeofencesChange}
  * - {@link BackgroundGeolocation.onEnabledChange}
  * - {@link BackgroundGeolocation.onConnectivityChange}
  * - {@link BackgroundGeolocation.onSchedule}
  * - {@link BackgroundGeolocation.onPowerSaveChange}
  * - {@link BackgroundGeolocation.onNotificationAction}
  * - {@link BackgroundGeolocation.onAuthorization}
  *
  * __Removing an event-listener__:
  *
  * @example
  * ```typescript
  * // Event-listeners return a Subscription instance, containing a .remove() method.
  * const subscription = BackgroundGeolocation.onLocation(location => {
  *   console.log("[onLocation] ", location);
  * });
  * .
  * .
  * .
  * // Later, to remove the event-listener:
  * subscription.remove();
  * ```
  *
  * One might typically manage a collection of `Subscription` instances
  *
  * @example
  * ```typescript
  * import BackgroundGeolocation, {
  *   Location,
  *   Subscription
  * } from ...
  *
  * // Your custom Collection of Subscription instances.
  * const SUBSCRIPTIONS = [];
  *
  * // Your custom method to push a Subscription instance.
  * const subscribe = (subscription:Subscription) => {
  *   SUBSCRIPTIONS.push(subscription);
  * }
  *
  * // Your custom method to interate your SUBSCRIPTIONS and .remove each.
  * const unsubscribe = () => {
  *   SUBSCRIPTIONS.forEach((subscription:Subscription) => subscription.remove());
  * }
  *
  * const initBackgroundGeolocation = () {
  *   // Create event-listeners as usual, feeding the returned Subscription into
  *   // your custom  subscribe() method.
  *   subscribe(BackgroundGeolocation.onLocation((location:Location) => {
  *     console.log('[onLocation]', location);
  *   });
  *
  *   subscribe(BackgroundGeolocation.onMotionChange((location:Location) => {
  *     console.log('[onMotionChange]', location);
  *   });
  *
  *   subscribe(BackgroundGeolocation.onEnabledChange((enabled:boolean) => {
  *     console.log('[onEnabledChange]', enabled);
  *   });
  * }
  *
  * const onDestroyView = () => {
  *   // Call your custom unsubscribe method
  *   unsubscribe();
  * }
  *
  * ```
  * 
  * @category Events
  */
export interface Subscription {
  /** Remove the event-listener. */
  remove(): void;
}
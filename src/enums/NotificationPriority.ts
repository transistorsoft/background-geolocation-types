/**
 * <!-- doc-id: NotificationPriority -->
 * Defines the priority / visibility of the Android foreground-service notification.
 *
 * This affects how the notification appears in the status bar and how strongly
 * the OS ranks it among other notifications.
 *
 * Mirrors Flutter’s `NotificationPriority` enum.
 * 
 * @category Config
 */
export const NotificationPriority = {
  /**
   * <!-- doc-id: NotificationPriority.Default --> 
   * Default notification priority (normal weighting). 
   */ 
  Default: 0,

  /**
   * <!-- doc-id: NotificationPriority.High -->
   * Notification strongly weighted to top of list; icon strongly weighted to the left. 
   */
  High: 1,

  /**
   * <!-- doc-id: NotificationPriority.Low -->
   * Notification weighted to bottom of list; icon weighted to the right. 
   */
  Low: -1,

  /**
   * <!-- doc-id: NotificationPriority.Max -->
   * Same as {@link NotificationPriority.High}.
   */
  Max: 2,

  /**
   * <!-- doc-id: NotificationPriority.Min -->
   * Notification strongly weighted to bottom of list; icon hidden. 
   */
  Min: -2,
} as const;

/** @internal @hidden */
export type NotificationPriority =
  (typeof NotificationPriority)[keyof typeof NotificationPriority];
/**
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
   * Default notification priority (normal weighting).
   */ 
  Default: 0,

  /**
   * Notification strongly weighted to top of list; icon strongly weighted to the left.
   */
  High: 1,

  /**
   * Notification weighted to bottom of list; icon weighted to the right.
   */
  Low: -1,

  /**
   * Same as {@link NotificationPriority.High}.
   */
  Max: 2,

  /**
   * Notification strongly weighted to bottom of list; icon hidden.
   */
  Min: -2,
} as const;

/** @internal @hidden */
export type NotificationPriority =
  (typeof NotificationPriority)[keyof typeof NotificationPriority];
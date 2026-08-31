/**
 * iOS/Android location authorization status.
 *
 * | Name                | Value | Platform                |
 * |---------------------|:-----:|-------------------------|
 * | NotDetermined       |  0    | iOS only                |
 * | Restricted          |  1    | iOS only                |
 * | Denied              |  2    | iOS & Android           |
 * | Always              |  3    | iOS & Android           |
 * | WhenInUse           |  4    | iOS & Android 10+       |
 * | DeniedAlways        |  5    | Android only            |
 *
 * @category Events
 */
export const AuthorizationStatus = {
  /**
   * User has not yet made a choice regarding location permissions.
   */
  NotDetermined: 0,
  /**
   * Location permissions are restricted (e.g., parental controls).
   */
  Restricted: 1,
  /**
   * Location permissions denied by the user.
   */
  Denied: 2,
  /**
   * Location permissions authorized for always use.
   */
  Always: 3,
  /**
   * Location permissions authorized for when-in-use (Android 10+).
   */
  WhenInUse: 4,
  /**
   * Permanently denied — the OS silently ignores further permission requests and
   * only the device's app-settings screen can restore the permission. [Android only]
   *
   * Android promotes a permission to this state after two user denials. Reported by
   * {@link BackgroundGeolocation.requestPermission} for the motion permission; iOS
   * reports plain {@link Denied}, where denial is always permanent.
   */
  DeniedAlways: 5,
} as const;

/**
 * @hidden @internal
 */
export type AuthorizationStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];
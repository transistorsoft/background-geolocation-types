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
 * | DeniedAlways        |  5    | iOS & Android           |
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
   * Permanently denied — the OS will not show the permission dialog again and only
   * the device's Settings app can restore the permission.
   *
   * Reported by {@link BackgroundGeolocation.requestPermission} for the motion
   * permission on both platforms: Android promotes to this state after two user
   * denials; on iOS a single motion denial is already permanent (iOS never
   * re-prompts), so a denied motion request reports it immediately.
   */
  DeniedAlways: 5,
} as const;

/**
 * @hidden @internal
 */
export type AuthorizationStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];
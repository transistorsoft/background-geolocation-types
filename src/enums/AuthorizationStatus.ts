/**
 * <!-- doc-id: AuthorizationStatus -->
 * iOS/Android location authorization status.
 *
 * | Name                | Value | Platform                |
 * |---------------------|:-----:|-------------------------|
 * | NotDetermined       |  0    | iOS only                |
 * | Restricted          |  1    | iOS only                |
 * | Denied              |  2    | iOS & Android           |
 * | Always              |  3    | iOS & Android           |
 * | WhenInUse           |  4    | iOS & Android 10+       |
 * 
 * @category Events
 */
export const AuthorizationStatus = {
  /**
   * <!-- doc-id: AuthorizationStatus.NotDetermined -->
   * User has not yet made a choice regarding location permissions. 
   */
  NotDetermined: 0,
  /**
   * <!-- doc-id: AuthorizationStatus.Restricted -->
   * Location permissions are restricted (e.g., parental controls). 
   */
  Restricted: 1,
  /**
   * <!-- doc-id: AuthorizationStatus.Denied -->
   * Location permissions denied by the user. 
   */
  Denied: 2,
  /**
   * <!-- doc-id: AuthorizationStatus.Always -->
   * Location permissions authorized for always use. 
   */
  Always: 3,
  /**
   * <!-- doc-id: AuthorizationStatus.WhenInUse -->
   * Location permissions authorized for when-in-use (Android 10+). 
   */
  WhenInUse: 4,
} as const;

/**
 * @hidden @internal
 */
export type AuthorizationStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];
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
 * 
 * @category Events
 */
export const AuthorizationStatus = {
  NotDetermined: 0,
  Restricted: 1,
  Denied: 2,
  Always: 3,
  WhenInUse: 4,
} as const;

/**
 * @hidden @internal
 */
export type AuthorizationStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];
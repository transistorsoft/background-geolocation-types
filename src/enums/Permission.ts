/**
 * A specific permission to request via {@link BackgroundGeolocation.requestPermission}. (WO-007)
 *
 * | Name       | Value        | Description                                                |
 * |------------|--------------|------------------------------------------------------------|
 * | Location   | `"location"` | Location authorization per {@link GeoConfig.locationAuthorizationRequest} — motion untouched. |
 * | Motion     | `"motion"`   | Motion / activity-recognition permission alone.            |
 *
 * Omitting the argument to {@link BackgroundGeolocation.requestPermission} requests
 * everything the current configuration requires — location, then motion — exactly
 * like {@link BackgroundGeolocation.start}.
 *
 * @category Config
 */
export const Permission = {
  /**
   * Location authorization, per {@link GeoConfig.locationAuthorizationRequest}.
   * The motion permission is not requested.
   */
  Location: 'location',
  /**
   * The motion / activity-recognition permission alone — `ACTIVITY_RECOGNITION`
   * on Android 10+, Motion & Fitness on iOS.
   */
  Motion: 'motion',
} as const;

/**
 * @hidden @internal
 */
export type Permission = (typeof Permission)[keyof typeof Permission];

/**
 * Error codes returned when the native location API fails to fetch a location.
 *
 *
 * | Code | Error |
 * |------|--------|
 * | `0`   | Location unknown |
 * | `1`   | Location permission denied |
 * | `2`   | Network error |
 * | `3`   | Attempt to initiate location-services in background with WhenInUse authorization |
 * | `408` | Location timeout |
 * | `499` | Location request cancelled |
 *
 * @category Events
 */
export const LocationError = {
  /**
   * Location could not be determined at this time.
   */
  LocationUnknown: 0,
  /**
   * Location permission denied by the user.
   */
  PermissionDenied: 1,
  /**
   * Network error occurred while attempting to fetch location.
   */
  NetworkError: 2,
  /**
   * Attempt to initiate location-services in background with WhenInUse authorization.
   */
  BackgroundWhenInUse: 3,
  /**
   * Location request timed out.
   */
  Timeout: 408,
  /**
   * Location request was cancelled.
   */
  Cancelled: 499,
} as const;

/** 
 * Union type of possible location error codes. 
 * @internal @hidden
 */
export type LocationError = (typeof LocationError)[keyof typeof LocationError];
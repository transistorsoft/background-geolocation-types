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
  LocationUnknown: 0,
  PermissionDenied: 1,
  NetworkError: 2,
  BackgroundWhenInUse: 3,
  Timeout: 408,
  Cancelled: 499,
} as const;

/** 
 * Union type of possible location error codes. 
 * @internal @hidden
 */
export type LocationError = (typeof LocationError)[keyof typeof LocationError];
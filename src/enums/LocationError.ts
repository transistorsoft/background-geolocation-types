/**
 * <!-- doc-id: LocationError -->
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
   * <!-- doc-id: LocationError.LocationUnknown -->
   * Location could not be determined at this time.
   */
  LocationUnknown: 0,
  /**
   * <!-- doc-id: LocationError.PermissionDenied -->
   * Location permission denied by the user. 
   */
  PermissionDenied: 1,
  /**
   * <!-- doc-id: LocationError.NetworkError -->
   * Network error occurred while attempting to fetch location. 
   */
  NetworkError: 2,
  /**
   * <!-- doc-id: LocationError.BackgroundWhenInUse -->
   * Attempt to initiate location-services in background with WhenInUse authorization. 
   */
  BackgroundWhenInUse: 3,
  /**
   * <!-- doc-id: LocationError.Timeout -->
   * Location request timed out. 
   */
  Timeout: 408,
  /**
   * <!-- doc-id: LocationError.Cancelled -->
   * Location request was cancelled. 
   */
  Cancelled: 499,
} as const;

/** 
 * Union type of possible location error codes. 
 * @internal @hidden
 */
export type LocationError = (typeof LocationError)[keyof typeof LocationError];
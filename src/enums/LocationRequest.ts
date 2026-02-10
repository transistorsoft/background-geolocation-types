/**
 * <!-- doc-id: LocationRequest -->
 * Indicates what level of location authorization the SDK should request.
 *
 * | Name       | Value        | Description                                              |
 * |------------|--------------|----------------------------------------------------------|
 * | Always     | `"Always"`   | Request full background + foreground authorization.      |
 * | WhenInUse  | `"WhenInUse"`| Request foreground-only authorization.                   |
 * | Any        | `"Any"`      | Accept *either* Always or WhenInUse (no specific request). |
 *
 * Mirrors native iOS authorization request options and existing RN adapter keys.
 * 
 * See {@link GeoConfig.locationAuthorizationRequest}
 *
 * @category Config
 */
export const LocationRequest = {
  /**
   * <!-- doc-id: LocationRequest.Always -->
   * Request full background + foreground authorization. 
   */
  Always: 'Always',
  /**
   * <!-- doc-id: LocationRequest.WhenInUse -->
   * Request foreground-only authorization. 
   */
  WhenInUse: 'WhenInUse',
  /**
   * <!-- doc-id: LocationRequest.Any -->
   * Accept *either* Always or WhenInUse (no specific request). 
   */
  Any: 'Any',
} as const;

/**
 * Type union of all LocationRequest values.
 * @internal @hidden
 */
export type LocationRequest =
  (typeof LocationRequest)[keyof typeof LocationRequest];
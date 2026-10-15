/**
* How strongly the odometer smooths the path while the device moves slowly.
*
* `Aggressive` follows the fixes most, `Conservative` smooths most and cuts the
* most corners, `Default` sits between. At riding and driving speed the three
* agree; they differ at walking pace, between about 1 and 3 m/s, mostly with
* `distanceFilter: 0`. The profile applies only to the odometer.
*
* If no profile is provided, `Default` is applied.
 *
 * @category Config
 */
export const KalmanProfile = {
  /**
   * The SDK's default: between the other two, for most apps.
   */
  Default: 0,
  /**
   * Follows the fixes most closely: the least smoothing, the most of a slow path
   * kept, and the most GPS wander counted.
   */
  Aggressive: 1,
  /**
   * Smooths most: the steadiest total at riding and driving speed, the most
   * corners cut at walking pace, and 20 to 50 % short on short back-and-forth
   * paths.
   */
  Conservative: 2
} as const;

/** @internal @hidden */
export type KalmanProfile = (typeof KalmanProfile)[keyof typeof KalmanProfile];
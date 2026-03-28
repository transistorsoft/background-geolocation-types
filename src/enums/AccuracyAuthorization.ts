/**
 * Accuracy authorization granted by the user.
 *
 * | Name                | Value | Description                |
 * |---------------------|:-----:|-----------------------------|
 * | Full                |  0    | Full accuracy authorized.  |
 * | Reduced             |  1    | Reduced accuracy granted.  |
 *
 * Mirrors iOS `CLAccuracyAuthorization` and Android location accuracy permission levels.
 * 
 * @category Events
 */
export const AccuracyAuthorization = {
  /**
   * Full accuracy authorized. 
   */
  Full: 0,
  /**
   * Reduced accuracy granted.    
   */
  Reduced: 1,
} as const;

/** 
 * Type union of the AccuracyAuthorization values. 
 * @internal @hidden
 */
export type AccuracyAuthorization =
  (typeof AccuracyAuthorization)[keyof typeof AccuracyAuthorization];
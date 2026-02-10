/**
 * <!-- doc-id: ActivityType -->
 * iOS Activity Type used with {@link GeoConfig.activityType}.
 *
 * Corresponds to Apple's `CLActivityType` enum:
 * https://developer.apple.com/documentation/corelocation/clactivitytype
 *
 * | Name                   | Value | Description                           |
 * |------------------------|:-----:|---------------------------------------|
 * | Other                  |   1   | Default/unspecified activity.         |
 * | AutomotiveNavigation   |   2   | Automotive navigation mode.           |
 * | Fitness                |   3   | Fitness-related activity.             |
 * | OtherNavigation        |   4   | Non-automotive navigation mode.       |
 * | Airborne               |   5   | Airborne activity (iOS 15+).          |
 *
 * @category Config
 */
export const ActivityType = {  
  /**
   * <!-- doc-id: ActivityType.Other -->
   * Default/unspecified activity. 
   */
  Other: 1,
  /**
   * <!-- doc-id: ActivityType.AutomotiveNavigation -->
   * Automotive navigation mode. 
   */
  AutomotiveNavigation: 2,
  /**
   * <!-- doc-id: ActivityType.Fitness -->
   * Fitness-related activity. 
   */
  Fitness: 3,
  /**
   * <!-- doc-id: ActivityType.OtherNavigation -->
   * Non-automotive navigation mode. 
   */
  OtherNavigation: 4,
  /**
   * <!-- doc-id: ActivityType.Airborne -->
   * Airborne activity (iOS 15+). 
   */
  Airborne: 5,
} as const;

/**
 * Type union of the ActivityType values.
 * @internal @hidden
 */
export type ActivityType =
  (typeof ActivityType)[keyof typeof ActivityType];
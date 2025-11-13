/**
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
  /** Default/unspecified activity. */
  Other: 1,

  /** Automotive navigation activity. */
  AutomotiveNavigation: 2,

  /** Fitness (walking, running, etc). */
  Fitness: 3,

  /** Other navigation (non-automotive). */
  OtherNavigation: 4,

  /** Airborne activity (iOS 15+). */
  Airborne: 5,
} as const;

/**
 * Type union of the ActivityType values.
 * @internal @hidden
 */
export type ActivityType =
  (typeof ActivityType)[keyof typeof ActivityType];
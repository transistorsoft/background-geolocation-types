import type { MotionActivityType } from '../../enums/MotionActivityType';

/**
 * <!-- doc-id: MotionActivityEvent -->
 * Activity recognition result delivered to {@link BackgroundGeolocation.onActivityChange}.
 *
 * The SDK fires this event each time the device's motion-activity classifier
 * detects a change in the current activity type (e.g. from `still` to
 * `on_foot`). The event includes both the detected activity and the
 * classifier's confidence level.
 *
 * @example
 * ```ts
 * BackgroundGeolocation.onActivityChange((event) => {
 *   console.log("[onActivityChange]", event.activity, event.confidence);
 * });
 * ```
 *
 * @category Events
 */
export interface MotionActivityEvent {
  /**
   * <!-- doc-id: MotionActivityEvent.activity -->
   * Detected motion activity type (e.g. `still`, `on_foot`, `in_vehicle`).
   */
  activity: MotionActivityType;
  /**
   * <!-- doc-id: MotionActivityEvent.confidence -->
   * Confidence of the detected activity as a percentage (`0`–`100`).
   */
  confidence: number;
}

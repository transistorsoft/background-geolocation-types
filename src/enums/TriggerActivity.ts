/**
 * <!-- doc-id: TriggerActivity -->
 * Allowed motion activity names that can trigger motion detection.
 * Mirrors Flutter's TriggerActivity set.
 * 
 * @category Config
 */
export const TriggerActivity = {
  Walking: 'walking',
  OnFoot: 'on_foot',
  Running: 'running',
  OnBicycle: 'on_bicycle',
  InVehicle: 'in_vehicle'
} as const;

/** @internal @hidden */
export type TriggerActivity = (typeof TriggerActivity)[keyof typeof TriggerActivity];
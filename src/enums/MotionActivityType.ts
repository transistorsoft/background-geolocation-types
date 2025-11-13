/** 
 * Reported device motion activity names (legacy RN + native). 
 * 
 * @category Events
 */
export const MotionActivityType = {
  Still: 'still',
  Walking: 'walking',
  OnFoot: 'on_foot',
  Running: 'running',
  OnBicycle: 'on_bicycle',
  InVehicle: 'in_vehicle',
  Unknown: 'unknown'
} as const;

/** @internal @hidden */
export type MotionActivityType = typeof MotionActivityType[keyof typeof MotionActivityType];
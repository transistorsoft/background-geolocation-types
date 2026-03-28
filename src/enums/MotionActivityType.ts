/** 
 * Reported device motion activity names (legacy RN + native). 
 * 
 * @category Events
 */
export const MotionActivityType = {
  /**
   * Device is stationary. 
   */
  Still: 'still',   
  /**
   * Device is walking. 
   */
  Walking: 'walking',
  /**
   * Device is on foot (walking or running). 
   */
  OnFoot: 'on_foot',
  /**
   * Device is running. 
   */
  Running: 'running',
  /**
   * Device is on bicycle. 
   */
  OnBicycle: 'on_bicycle',
  /**
   * Device is in vehicle. 
   */
  InVehicle: 'in_vehicle',
  /**
   * Device activity is unknown. 
   */
  Unknown: 'unknown'
} as const;

/** @internal @hidden */
export type MotionActivityType = typeof MotionActivityType[keyof typeof MotionActivityType];
/** 
 * <!-- doc-id: MotionActivityType -->
 * Reported device motion activity names (legacy RN + native). 
 * 
 * @category Events
 */
export const MotionActivityType = {
  /**
   * <!-- doc-id: MotionActivityType.Still -->
   * Device is stationary. 
   */
  Still: 'still',   
  /**
   * <!-- doc-id: MotionActivityType.Walking -->
   * Device is walking. 
   */
  Walking: 'walking',
  /**
   * <!-- doc-id: MotionActivityType.OnFoot -->
   * Device is on foot (walking or running). 
   */
  OnFoot: 'on_foot',
  /**
   * <!-- doc-id: MotionActivityType.Running -->
   * Device is running. 
   */
  Running: 'running',
  /**
   * <!-- doc-id: MotionActivityType.OnBicycle -->
   * Device is on bicycle. 
   */
  OnBicycle: 'on_bicycle',
  /**
   * <!-- doc-id: MotionActivityType.InVehicle -->
   * Device is in vehicle. 
   */
  InVehicle: 'in_vehicle',
  /**
   * <!-- doc-id: MotionActivityType.Unknown -->
   * Device activity is unknown. 
   */
  Unknown: 'unknown'
} as const;

/** @internal @hidden */
export type MotionActivityType = typeof MotionActivityType[keyof typeof MotionActivityType];
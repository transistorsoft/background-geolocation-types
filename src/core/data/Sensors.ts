/**
* <!-- doc-id: Sensors -->
* Detected device sensors related to motion-detection.
* @category Data
*/
export interface Sensors {
  	/**
  	* <!-- doc-id: Sensors.platform -->
  	* `ios` | `android`
  	*/
    platform: string;
    /**
    * <!-- doc-id: Sensors.accelerometer -->
    * `true` when the device has an accelerometer.
    */
    accelerometer: boolean;
    /**
    * <!-- doc-id: Sensors.magnetometer -->
    * `true` when the device has a magnetometer (compass).
    */
    magnetometer: boolean;
    /**
    * <!-- doc-id: Sensors.gyroscope -->
    * `true` when the device has a gyroscope.
    */
    gyroscope: boolean;
    /**
    * <!-- doc-id: Sensors.significant_motion -->
    * __[Android only]__ `true` when the Android device has significant motion hardware.
    */
    significant_motion?: boolean;
    /**
    * <!-- doc-id: Sensors.motion_hardware -->
    * __[iOS only]__ `true` when the device has an __M7__ motion co-processor (iPhone 5S and up).
    */
    motion_hardware?: boolean;
}
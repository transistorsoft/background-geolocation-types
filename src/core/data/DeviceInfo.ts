/**
 * Simple device information, as returned by {@link BackgroundGeolocation.getDeviceInfo}.
 *
 * This provides basic model and platform info without needing external native dependencies.
 *
 * @example
 * ```ts
 * import BackgroundGeolocation from "react-native-background-geolocation";
 *
 * const info = await BackgroundGeolocation.getDeviceInfo();
 * console.log(`[DeviceInfo] ${info.manufacturer} ${info.model} (${info.platform})`);
 * ```
 *
 * @category Data
 */
export interface DeviceInfo {
  /**
   * Device model.
   * 
   * Examples:
   * - iPhone15,2
   * - Pixel 8 Pro
   */
  model: string;

  /**
   * Device manufacturer.
   * 
   * Examples:
   * - Apple
   * - Google
   * - Samsung
   */
  manufacturer: string;

  /**
   * OS Version (human readable string).
   *
   * Examples:
   * - "18.1"
   * - "14"
   * - "14.1.1"
   */
  version: string;

  /**
   * OS platform name.
   *
   * One of:
   * - `"iOS"`
   * - `"Android"`
   */
  platform: string;

  /**
   * Development framework hosting the SDK.
   *
   * For example:
   * - `"react-native"`
   * - `"capacitor"`
   * - `"cordova"`
   * - `"flutter"`
   */
  framework: string;  
}
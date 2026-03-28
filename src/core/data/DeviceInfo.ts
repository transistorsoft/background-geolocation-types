/**
 * Basic device hardware and OS information returned by
 * {@link BackgroundGeolocation.getDeviceInfo}.
 *
 * @example
 * ```ts
 * const info = await BackgroundGeolocation.getDeviceInfo();
 * console.log(`[DeviceInfo] ${info.manufacturer} ${info.model} (${info.platform})`);
 * ```
 *
 * @category Data
 */
export interface DeviceInfo {
  /**
   * Device model identifier.
   *
   * Examples: `"iPhone15,2"`, `"Pixel 8 Pro"`, `"SM-G991B"`
   */
  model: string;

  /**
   * Device manufacturer.
   *
   * Examples: `"Apple"`, `"Google"`, `"Samsung"`, `"Huawei"`
   */
  manufacturer: string;

  /**
   * OS version string.
   *
   * Examples: `"18.1"`, `"14"`, `"14.1.1"`
   */
  version: string;

  /**
   * OS platform name: `"iOS"` or `"Android"`.
   */
  platform: string;

  /**
   * Development framework hosting the SDK.
   *
   * Examples: `"react-native"`, `"capacitor"`, `"cordova"`, `"flutter"`
   */
  framework: string;
}

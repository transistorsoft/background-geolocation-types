/**
 * <!-- doc-id: DeviceInfo -->
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
   * <!-- doc-id: DeviceInfo.model -->
   * Device model identifier.
   *
   * Examples: `"iPhone15,2"`, `"Pixel 8 Pro"`, `"SM-G991B"`
   */
  model: string;

  /**
   * <!-- doc-id: DeviceInfo.manufacturer -->
   * Device manufacturer.
   *
   * Examples: `"Apple"`, `"Google"`, `"Samsung"`, `"Huawei"`
   */
  manufacturer: string;

  /**
   * <!-- doc-id: DeviceInfo.version -->
   * OS version string.
   *
   * Examples: `"18.1"`, `"14"`, `"14.1.1"`
   */
  version: string;

  /**
   * <!-- doc-id: DeviceInfo.platform -->
   * OS platform name: `"iOS"` or `"Android"`.
   */
  platform: string;

  /**
   * <!-- doc-id: DeviceInfo.framework -->
   * Development framework hosting the SDK.
   *
   * Examples: `"react-native"`, `"capacitor"`, `"cordova"`, `"flutter"`
   */
  framework: string;
}

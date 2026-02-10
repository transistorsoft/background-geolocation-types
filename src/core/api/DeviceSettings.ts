/**
 * <!-- doc-id: DeviceSettingsRequest -->
 * An object for redirecting a User to an Android device's settings screen from a {@link DeviceSettings} request.
 *
 * Contains meta-data about the device (`manufacturer`, `model`, `version`) and whether you’ve already shown this screen.
 * 
 * @category Device
 */
export interface DeviceSettingsRequest {
  /**
   * <!-- doc-id: DeviceSettingsRequest.manufacturer -->
   * Device manufacturer (e.g., "Huawei", "Samsung"). 
   */ 
  manufacturer: string;
  /** 
   * <!-- doc-id: DeviceSettingsRequest.model -->
   * Device model (e.g., "P40", "SM-G991B"). 
   */ 
  model: string;
  /** 
   * <!-- doc-id: DeviceSettingsRequest.version -->
   * OS version string. 
   */ 
  version: string;
  /** 
   * <!-- doc-id: DeviceSettingsRequest.seen -->
   * Whether this screen has previously been shown. */
  seen: boolean;
  /** 
   * <!-- doc-id: DeviceSettingsRequest.lastSeenAt -->
   * Timestamp of when this screen was last shown. */
  lastSeenAt: Date;
  /**
   * <!-- doc-id: DeviceSettingsRequest.action -->
   * The settings screen action to be shown.
   * ⚠️ Set automatically by the native layer.
   */
  action: string;
}

/**
 * <!-- doc-id: DeviceSettings -->
 * Device Settings API (types-only).
 *
 * Provides an API to show Android & vendor-specific Battery / Power Management settings screens that can
 * affect performance of the Background Geolocation SDK on various devices.
 *
 * See: https://dontkillmyapp.com/
 *
 * @example
 * ```ts
 * // Is Android device ignoring battery optimizations?
 * const isIgnoring = await BackgroundGeolocation.deviceSettings.isIgnoringBatteryOptimizations();
 * if (!isIgnoring) {
 *   const req = await BackgroundGeolocation.deviceSettings.showIgnoreBatteryOptimizations();
 *   if (!req.seen) {
 *     const confirmed = await showMyConfirmDialog({ title: 'Settings request', text: 'Please disable battery optimizations' });
 *     if (confirmed) {
 *       await BackgroundGeolocation.deviceSettings.show(req);
 *     }
 *   }
 * }
 * ```
 * @category Device
 */
export interface DeviceSettings {
  /**
   * <!-- doc-id: DeviceSettings.isIgnoringBatteryOptimizations -->
   * Returns `true` if device is ignoring battery optimizations for your app.
   *
   * In most cases, the SDK performs normally with battery optimizations enabled.
   */
  isIgnoringBatteryOptimizations(): Promise<boolean>;

  /**
   * <!-- doc-id: DeviceSettings.showIgnoreBatteryOptimizations -->
   * Prepare a request to show Android’s *Ignore Battery Optimizations* settings screen.
   *
   * Does **not** immediately redirect — returns a {@link DeviceSettingsRequest} first so you can
   * decide whether to prompt the user (eg: avoid annoying them if `seen === true`).
   *
   * ⚠️ On some devices/OS versions, this screen may not exist; callers should `catch` errors.
   */
  showIgnoreBatteryOptimizations(): Promise<DeviceSettingsRequest>;

  /**
   * <!-- doc-id: DeviceSettings.showPowerManager -->
   * Prepare a request to show a vendor-specific “Power Manager” screen (Huawei, Xiaomi, Vivo, etc).
   *
   * Does **not** immediately redirect — returns a {@link DeviceSettingsRequest} first.
   * Not all vendors/versions implement this screen; callers should `catch` errors.
   */
  showPowerManager(): Promise<DeviceSettingsRequest>;

  /**
   * <!-- doc-id: DeviceSettings.show -->
   * Execute a previously prepared {@link DeviceSettingsRequest} to actually show the screen.
   * Resolves `true` if the redirect was attempted.
   */
  show(request: DeviceSettingsRequest): Promise<boolean>;
}
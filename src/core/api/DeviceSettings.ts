/**
 * <!-- doc-id: DeviceSettingsRequest -->
 * Returned by a {@link DeviceSettings} request — describes which settings
 * screen to show and whether the user has already been prompted. [Android only]
 *
 * Contains device metadata (`manufacturer`, `model`, `version`) and a `seen`
 * flag so you can avoid showing the same screen repeatedly. Pass this object
 * to {@link DeviceSettings.show} to redirect the user.
 *
 * @category Device
 */
export interface DeviceSettingsRequest {
  /**
   * <!-- doc-id: DeviceSettingsRequest.manufacturer -->
   * Device manufacturer (e.g. `"Huawei"`, `"Samsung"`).
   */
  manufacturer: string;

  /**
   * <!-- doc-id: DeviceSettingsRequest.model -->
   * Device model name (e.g. `"P40"`, `"SM-G991B"`).
   */
  model: string;

  /**
   * <!-- doc-id: DeviceSettingsRequest.version -->
   * Android OS version string.
   */
  version: string;

  /**
   * <!-- doc-id: DeviceSettingsRequest.seen -->
   * `true` if this settings screen has already been shown to the user on this
   * device. Use this to avoid showing the same prompt repeatedly.
   */
  seen: boolean;

  /**
   * <!-- doc-id: DeviceSettingsRequest.lastSeenAt -->
   * Timestamp of the last time this screen was shown to the user.
   */
  lastSeenAt: Date;

  /**
   * <!-- doc-id: DeviceSettingsRequest.action -->
   * The Android Intent action used to open the target settings screen.
   *
   * ### ⚠️ Warning
   *
   * This field is set automatically by the native layer. Do not set it manually.
   */
  action: string;
}

/**
 * <!-- doc-id: DeviceSettings -->
 * API for directing users to Android device settings screens that can affect
 * background geolocation performance. [Android only]
 *
 * Many Android manufacturers apply aggressive battery optimizations that can
 * kill background services, including the geolocation SDK. This API surfaces
 * the relevant settings screens so users can whitelist your app.
 *
 * For a comprehensive list of affected devices and manufacturers, see
 * [dontkillmyapp.com](https://dontkillmyapp.com/).
 *
 * @example
 * ```ts
 * const isIgnoring = await BackgroundGeolocation.deviceSettings.isIgnoringBatteryOptimizations();
 * if (!isIgnoring) {
 *   const req = await BackgroundGeolocation.deviceSettings.showIgnoreBatteryOptimizations();
 *   if (!req.seen) {
 *     const confirmed = await showMyConfirmDialog({
 *       title: 'Settings request',
 *       text: 'Please disable battery optimizations for this app'
 *     });
 *     if (confirmed) {
 *       await BackgroundGeolocation.deviceSettings.show(req);
 *     }
 *   }
 * }
 * ```
 *
 * @category Device
 */
export interface DeviceSettings {
  /**
   * <!-- doc-id: DeviceSettings.isIgnoringBatteryOptimizations -->
   * Returns `true` if the OS is ignoring battery optimizations for your app.
   * [Android only]
   *
   * In most cases the SDK performs acceptably even when battery optimizations
   * are active, but aggressive manufacturer-specific restrictions may interfere
   * with background operation.
   */
  isIgnoringBatteryOptimizations(): Promise<boolean>;

  /**
   * <!-- doc-id: DeviceSettings.showIgnoreBatteryOptimizations -->
   * Prepare a request to show the Android *Ignore Battery Optimizations*
   * settings screen. [Android only]
   *
   * Returns a {@link DeviceSettingsRequest} rather than immediately redirecting,
   * so you can inspect {@link DeviceSettingsRequest.seen} and decide whether to
   * prompt the user.
   *
   * ### ⚠️ Warning
   *
   * On some devices and OS versions this screen may not be available. Always
   * wrap calls to {@link DeviceSettings.show} in a `try/catch`.
   *
   * **See also**
   * - {@link isIgnoringBatteryOptimizations}
   * - {@link show}
   */
  showIgnoreBatteryOptimizations(): Promise<DeviceSettingsRequest>;

  /**
   * <!-- doc-id: DeviceSettings.showPowerManager -->
   * Prepare a request to show a vendor-specific Power Manager settings screen
   * (Huawei, Xiaomi, Vivo, Oppo, etc.). [Android only]
   *
   * Returns a {@link DeviceSettingsRequest} rather than immediately redirecting.
   *
   * ### ⚠️ Warning
   *
   * Not all manufacturers or OS versions implement this screen. Always wrap
   * calls to {@link DeviceSettings.show} in a `try/catch`.
   *
   * **See also**
   * - {@link show}
   */
  showPowerManager(): Promise<DeviceSettingsRequest>;

  /**
   * <!-- doc-id: DeviceSettings.show -->
   * Execute a previously prepared {@link DeviceSettingsRequest} to open the
   * target settings screen. [Android only]
   *
   * Resolves `true` if the redirect was attempted.
   *
   * @example
   * ```ts
   * const req = await BackgroundGeolocation.deviceSettings.showPowerManager();
   * if (!req.seen) {
   *   await BackgroundGeolocation.deviceSettings.show(req);
   * }
   * ```
   */
  show(request: DeviceSettingsRequest): Promise<boolean>;
}

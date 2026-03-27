/**
 * <!-- doc-id: ConnectivityChangeEvent -->
 * Network connectivity change delivered to {@link BackgroundGeolocation.onConnectivityChange}.
 *
 * The SDK fires this event whenever the device transitions between an online
 * and offline state. When connectivity is restored, the SDK automatically
 * resumes uploading any locations queued in the SQLite database.
 *
 * @example
 * ```ts
 * BackgroundGeolocation.onConnectivityChange((event) => {
 *   console.log("[onConnectivityChange] connected:", event.connected);
 * });
 * ```
 *
 * @category Events
 */
export interface ConnectivityChangeEvent {
  /**
   * <!-- doc-id: ConnectivityChangeEvent.connected -->
   * `true` when the device has network connectivity; `false` when it is offline.
   */
  connected: boolean;
}

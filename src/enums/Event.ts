/**
 * Supported event names emitted by the SDK.
 *
 * @category Events
 */
export const Event = {
  /**
   * Emitted when the plugin boots.
   */
  Boot: 'boot',
  /**
   * Emitted when the plugin is terminated.
   */
  Terminate: 'terminate',
  /**
   * Emitted when a location is recorded.
   */
  Location: 'location',
  /**
   * Emitted when a motion-change is detected.
   */
  MotionChange: 'motionchange',
  /**
   * Emitted when a motion-activity change is detected.
   */
  ActivityChange: 'activitychange',
  /**
   * Emitted when a geofence transition occurs.
   */
  Geofence: 'geofence',
  /**
   * Emitted when geofences are added/removed/activated/deactivated.
   */
  GeofencesChange: 'geofenceschange',
  /**
   * Emitted when an HTTP request is sent to the configured `Config.http.url` endpoint.
   */
  Http: 'http',
  /**
   * Emitted at the configured `Config.heartbeatInterval` when the plugin is running.
   */
  Heartbeat: 'heartbeat',
  /**
   * Emitted when the device location-provider changes state.
   */
  ProviderChange: 'providerchange',
  /**
   * Emitted when a configured schedule is triggered.
   */
  Schedule: 'schedule',
  /**
   * Emitted when a user interacts with a plugin-generated notification.
   */
  Notification: 'notification',
  /**
   * Emitted when the plugin's authorization state changes.
   */
  Authorization: 'authorization',
  /**
   * Emitted when the device's network connectivity changes.
   */
  ConnectivityChange: 'connectivitychange',
  /**
   * Emitted when the plugin's enabled-state changes.
   */
  EnabledChange: 'enabledchange',
  /**
   * Emitted when the device enters or exits power-saving mode.
   */
  PowerSaveChange: 'powersavechange'    
} as const;

/** 
 * Event names emitted by the SDK. 
 * @hidden @internal
 */

export type Event = (typeof Event)[keyof typeof Event];
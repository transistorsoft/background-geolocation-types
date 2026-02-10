/**
 * <!-- doc-id: Event -->
 * Supported event names emitted by the SDK.
 * 
 * @category Events
 */
export const Event = {
  /** 
   * <!-- doc-id: Event.Boot -->
   * Emitted when the plugin boots. 
   */
  Boot: 'boot',
  /** 
   * <!-- doc-id: Event.Terminate -->
   * Emitted when the plugin is terminated. 
   */
  Terminate: 'terminate',
  /**
   * <!-- doc-id: Event.Location -->
   * Emitted when a location is recorded.    
   */
  Location: 'location',
  /** 
   * <!-- doc-id: Event.MotionChange -->
   * Emitted when a motion-change is detected. 
   */
  MotionChange: 'motionchange',
  /** 
   * <!-- doc-id: Event.ActivityChange -->
   * Emitted when a motion-activity change is detected. 
   */
  ActivityChange: 'activitychange',
  /**
   * <!-- doc-id: Event.Geofence -->
   * Emitted when a geofence transition occurs.    
   */
  Geofence: 'geofence',
  /**
   * <!-- doc-id: Event.GeofencesChange -->
   * Emitted when geofences are added/removed/activated/deactivated.
   */
  GeofencesChange: 'geofenceschange',
  /**
   * <!-- doc-id: Event.Http -->
   * Emitted when an HTTP request is sent to the configured `Config.http.url` endpoint.
   */
  Http: 'http',
  /**
   * <!-- doc-id: Event.Heartbeat -->
   * Emitted at the configured `Config.heartbeatInterval` when the plugin is running. 
   */
  Heartbeat: 'heartbeat',
  /**
   * <!-- doc-id: Event.ProviderChange -->
   * Emitted when the device location-provider changes state.
   */
  ProviderChange: 'providerchange',
  /**
   * <!-- doc-id: Event.Schedule -->
   * Emitted when a configured schedule is triggered. 
   */
  Schedule: 'schedule',
  /**
   * <!-- doc-id: Event.Notification -->
   * Emitted when a user interacts with a plugin-generated notification. 
   */
  Notification: 'notification',
  /**
   * <!-- doc-id: Event.Authorization -->
   * Emitted when the plugin's authorization state changes.   
   */
  Authorization: 'authorization',
  /**
   * <!-- doc-id: Event.ConnectivityChange -->
   * Emitted when the device's network connectivity changes. 
   */
  ConnectivityChange: 'connectivitychange',
  /**
   * <!-- doc-id: Event.EnabledChange -->
   * Emitted when the plugin's enabled-state changes. 
   */
  EnabledChange: 'enabledchange',
  /**
   * <!-- doc-id: Event.PowerSaveChange -->
   * Emitted when the device enters or exits power-saving mode. 
   */
  PowerSaveChange: 'powersavechange'    
} as const;

/** 
 * Event names emitted by the SDK. 
 * @hidden @internal
 */

export type Event = (typeof Event)[keyof typeof Event];
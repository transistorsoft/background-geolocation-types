/**
 * Supported event names emitted by the SDK.
 * 
 * @category Events
 */
export const Event = {
  Location: 'location',
  MotionChange: 'motionchange',
  ActivityChange: 'activitychange',
  Geofence: 'geofence',
  GeofencesChange: 'geofenceschange',
  Http: 'http',
  Heartbeat: 'heartbeat',
  ProviderChange: 'providerchange',
  Authorization: 'authorization',
  ConnectivityChange: 'connectivitychange',
  EnabledChange: 'enabledchange',
  PowerSaveChange: 'powersavechange',
  Schedule: 'schedule',
  Notification: 'notification'
} as const;

/** 
 * Event names emitted by the SDK. 
 * @hidden @internal
 */

export type Event = (typeof Event)[keyof typeof Event];
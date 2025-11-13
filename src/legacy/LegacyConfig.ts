/**
 * Historic, flat configuration surface.
 * 
 * @deprecated Use {@link Config} groups instead:
 * geolocation, http, persistence, activity, app, logger, authorization, notification.
 *
 * Full documentation intentionally preserved for hover/TypeDoc.
 * @example
 * ```ts
 * import { LegacyConfig } from 'background-geolocation-types';
 * const config: LegacyConfig = {
 *   desiredAccuracy: 10,
 *   distanceFilter: 50,
 *   stopOnTerminate: false,
 *   // ...etc
 * };
 * ```
 * @category Config
 */
export interface LegacyConfig {
  // … paste all the legacy Config doc + fields here …
  // Example:

  // {{doc geolocation.desiredAccuracy}}
  desiredAccuracy?: number;
  // {{doc geolocation.distanceFilter}}
  distanceFilter?: number;
  // @default true — continue tracking after app terminate.
  stopOnTerminate?: boolean;
  // …etc (carry ALL the docs over)
}
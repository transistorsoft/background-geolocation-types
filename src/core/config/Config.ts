import { LoggerConfig } from './LoggerConfig';
import { HttpConfig } from './HttpConfig';
import { GeoConfig } from './GeoConfig';
import { AppConfig } from './AppConfig';
import { PersistenceConfig } from './PersistenceConfig';
import { ActivityConfig } from './ActivityConfig';
import { AuthorizationConfig } from './AuthorizationConfig';
import { TransistorAuthorizationToken } from '../api/TransistorAuthorizationService';
/**
 * Root configuration object passed to {@link BackgroundGeolocation.ready} and
 * {@link BackgroundGeolocation.setConfig}.
 *
 * `Config` groups all SDK options into typed sub-interfaces. Each key maps to a
 * dedicated configuration area — set only the keys relevant to your use case.
 *
 * ## Contents
 * - [Overview](#overview)
 * - [Examples](#examples)
 *
 * ---
 *
 * ## Overview
 *
 * | Key | Type | Description |
 * |-----|------|-------------|
 * | {@link geolocation} | {@link GeoConfig} | Accuracy, sampling, elasticity, stop-detection, permissions, and geofencing. |
 * | {@link activity} | {@link ActivityConfig} | Motion recognition, stop-detection triggers, and motion-trigger delay. |
 * | {@link http} | {@link HttpConfig} | Upload URL, sync cadence, batching, headers, and params. |
 * | {@link persistence} | {@link PersistenceConfig} | SQLite storage, TTL, record limits, and custom extras. |
 * | {@link app} | {@link AppConfig} | App lifecycle — background operation, boot behaviour, headless mode, and foreground notification. |
 * | {@link logger} | {@link LoggerConfig} | Debug logging, log level, and log retention. |
 * | {@link authorization} | {@link AuthorizationConfig} | JWT and SAS token management with automatic refresh. |
 *
 * The SDK persists its configuration across app launches. Call
 * {@link BackgroundGeolocation.ready} once at startup — subsequent launches load
 * the persisted config automatically. Use {@link BackgroundGeolocation.setConfig}
 * to update individual keys at runtime without restarting.
 *
 * ---
 *
 * ## Examples
 *
 * @example Minimal configuration
 * ```ts
 * const state = await BackgroundGeolocation.ready({
 *   geolocation: {
 *     desiredAccuracy: DesiredAccuracy.High,
 *     distanceFilter: 20,
 *   },
 *   http: {
 *     url: 'https://my.server.com/api/locations',
 *     autoSync: true,
 *   },
 *   app: {
 *     stopOnTerminate: false,
 *     startOnBoot: true,
 *   },
 * });
 * ```
 *
 * @example Full configuration
 * ```ts
 * import BackgroundGeolocation, {
 *   Config,
 *   GeoConfig,
 *   ActivityConfig,
 *   HttpConfig,
 *   PersistenceConfig,
 *   DesiredAccuracy,
 *   PersistMode,
 *   LogLevel,
 *   AppConfig,
 *   LoggerConfig,
 *   State
 * } from '{{pluginName}}';
 *
 * const config: Config = {
 *   geolocation: {
 *     desiredAccuracy: DesiredAccuracy.High,
 *     distanceFilter: 20,
 *     stopTimeout: 5,
 *     stationaryRadius: 150,
 *   },
 *   activity: {
 *     disableStopDetection: false,
 *     motionTriggerDelay: 30000,
 *   },
 *   http: {
 *     url: 'https://my.server.com/api/locations',
 *     method: 'POST',
 *     autoSync: true,
 *     headers: { Authorization: 'Bearer secret-token' },
 *     params: { user_id: 123 },
 *   },
 *   persistence: {
 *     persistMode: PersistMode.All,
 *     maxDaysToPersist: 14,
 *     extras: { appVersion: '1.0.0' },
 *   },
 *   app: {
 *     stopOnTerminate: false,
 *     startOnBoot: true,
 *     enableHeadless: true,
 *   },
 *   logger: {
 *     debug: true,
 *     logLevel: LogLevel.Verbose,
 *     logMaxDays: 3,
 *   },
 * };
 *
 * const state: State = await BackgroundGeolocation.ready(config);
 * if (!state.enabled) {
 *   await BackgroundGeolocation.start();
 * }
 *
 * // Update a subset of config at runtime.
 * await BackgroundGeolocation.setConfig({
 *   http: { headers: { Authorization: 'Bearer new-token' } },
 *   logger: { logLevel: LogLevel.Info },
 * });
 * ```
 *
 * @category Primary API
 * @category Config
 */
export interface Config {
  /**
   * Controls whether the SDK resets to factory defaults before applying this
   * configuration. Defaults to `true`.
   *
   * When `true` (the default), every call to {@link BackgroundGeolocation.ready}
   * applies the supplied `Config` on top of fresh defaults. When `false`, the SDK
   * applies the supplied `Config` only on the first install. On subsequent launches
   * it ignores the `Config` argument entirely — the only way to change settings is
   * via {@link BackgroundGeolocation.setConfig}.
   *
   * ## ⚠️ Warning
   *
   * During development, always leave `reset: true` (or omit it). Setting `reset:
   * false` causes the SDK to ignore your `Config` after the first launch, so
   * configuration changes made between development builds will not take effect.
   */
  reset?: boolean;
  /**
   * Debug logging, log level, and log retention. See {@link LoggerConfig}.
   */
  logger?: LoggerConfig;
  /**
   * Accuracy, sampling, elasticity, stop-detection, permissions, and geofencing.
   * See {@link GeoConfig}.
   */
  geolocation?: GeoConfig;
  /**
   * Upload URL, HTTP method, sync cadence, batching, headers, and params.
   * See {@link HttpConfig}.
   */
  http?: HttpConfig;
  /**
   * App lifecycle — background operation, boot behaviour, headless mode, and
   * foreground notification. See {@link AppConfig}.
   */
  app?: AppConfig;
  /**
   * SQLite storage, TTL, record limits, and custom extras. See {@link PersistenceConfig}.
   */
  persistence?: PersistenceConfig;
  /**
   * Motion recognition, stop-detection triggers, and motion-trigger delay.
   * See {@link ActivityConfig}.
   */
  activity?: ActivityConfig;
  /**
   * JWT and SAS token management with automatic refresh. See {@link AuthorizationConfig}.
   */
  authorization?: AuthorizationConfig;
  /**
   * Convenience option that automatically configures the SDK to upload locations
   * to the Transistor Software demo server at tracker.transistorsoft.com, or a
   * local instance of [background-geolocation-console](https://github.com/transistorsoft/background-geolocation-console).
   *
   * Setting this option automatically sets {@link HttpConfig.url} and the required
   * {@link AuthorizationConfig} values. See {@link TransistorAuthorizationService}
   * for how to obtain a token.
   *
   * @example
   * ```ts
   * const token = await BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(
   *   "my-company-name",
   *   "my-username"
   * );
   *
   * BackgroundGeolocation.ready({
   *   transistorAuthorizationToken: token
   * });
   * ```
   */
  transistorAuthorizationToken?: TransistorAuthorizationToken;

}

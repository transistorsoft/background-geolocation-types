import { LoggerConfig } from './LoggerConfig';
import { HttpConfig } from './HttpConfig';
import { GeoConfig } from './GeoConfig';
import { AppConfig } from './AppConfig';
import { PersistenceConfig } from './PersistenceConfig';
import { ActivityConfig } from './ActivityConfig';
import { AuthorizationConfig } from './AuthorizationConfig';
import { TransistorAuthorizationToken } from '../api/TransistorAuthorizationService';
/**
 * Configuration API.
 *
 * The `Config` class defines all SDK options, grouped into compound
 * configuration objects:
 *
 * - {@link GeoConfig} — Geolocation and filtering options
 * - {@link AppConfig} — Application lifecycle options
 * - {@link HttpConfig} — Networking and HTTP sync options
 * - {@link PersistenceConfig} — Data persistence and database options
 * - {@link LoggerConfig} — Logging and debugging options
 * - {@link ActivityConfig} — Motion and activity-recognition options
 *
 * Instances of `Config` are consumed by {@link BackgroundGeolocation.ready}
 * and {@link BackgroundGeolocation.setConfig}.
 *
 * @example
 *
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
 * async function main() {
 *   // Configure the SDK with compound configuration objects.
 *   const config: Config = {
 *     geolocation: {
 *       desiredAccuracy: DesiredAccuracy.High,
 *       distanceFilter: 20,
 *       stopTimeout: 5,
 *       stationaryRadius: 150,
 *     },
 *     activity: {
 *       disableStopDetection: false,
 *       motionTriggerDelay: 30000,
 *     },
 *     http: {
 *       url: 'https://my.server.com/api/locations',
 *       method: 'POST',
 *       autoSync: true,
 *       headers: {
 *         Authorization: 'Bearer secret-token',
 *       },
 *       params: {
 *         user_id: 123,
 *       },
 *     },
 *     persistence: {
 *       persistMode: PersistMode.All,
 *       maxDaysToPersist: 14,
 *       extras: { appVersion: '1.0.0' },
 *     },
 *     app: {
 *       stopOnTerminate: false,
 *       startOnBoot: true,
 *       enableHeadless: true
 *     },
 *     logger: {
 *       debug: true,
 *       logLevel: LogLevel.Verbose,
 *       logMaxDays: 3,
 *     },
 *   };
 *
 *   // Apply the configuration.
 *   const state: State = await BackgroundGeolocation.ready(config);
 *   console.log('[ready] BackgroundGeolocation is configured and ready to use');
 *
 *   if (!state.enabled) {
 *     await BackgroundGeolocation.start();
 *   }
 *
 *   // To modify configuration after initialization, use setConfig.
 *   const updated: State = await BackgroundGeolocation.setConfig({
 *     http: {
 *       headers: {
 *         Authorization: 'Bearer new-token',
 *       },
 *     },
 *     logger: {
 *       logLevel: LogLevel.Info
 *     },
 *   });
 *
 *   await BackgroundGeolocation.sync();
 * }
 *
 * ```
 * @category Primary API
 * @category Config
 */
export interface Config {
  /**
   * Reset the plugin to its initial state before applying this configuration.  This is probably what you want.
   *   
   * Defaults to `true`
   * 
   * If you set this to `false`, the SDK will consume your `Config` only at the first install of your app.  Thereafter, the only way
   * to change your configuration will be to call {@link BackgroundGeolocation.setConfig},
   * 
   * You will certainly **NOT** want to use `reset: false` during development, as it will prevent your configuration changes from taking effect on subsequent app launches.
   */
  reset?: boolean;
  /**
   * Logger configuration.
   */
  logger?: LoggerConfig;
  /**
   * Geolocation configuration.
   */
  geolocation?: GeoConfig;
  /**
   * HTTP configuration.
   */
  http?: HttpConfig;
  /**
   * App configuration.
   */
  app?: AppConfig;
  /**
   * Persistence configuration.
   */
  persistence?: PersistenceConfig;
  /**
   * Motion Activity configuration.
   */
  activity?: ActivityConfig;
  /**
   * Authorization configuration.
   */
  authorization?: AuthorizationConfig;
  /**
    * *Convenience* option to automatically configures the SDK to upload locations to the Transistor Software demo server 
    * at http://tracker.transistorsoft.com (or your own local instance of [background-geolocation-console](https://github.com/transistorsoft/background-geolocation-console))
    *
    * See {@link TransistorAuthorizationService}.  This option will **automatically configure** the {@link HttpConfig.url} 
    * to point at the Demo server as well as well as the required {@link AuthorizationConfig} configuration.
    *
    * @example
    * ```typescript
    * const token = await
    *   BackgroundGeolocation.findOrCreateTransistorAuthorizationToken("my-company-name", "my-username");
    *
    * BackgroundGeolocation.ready({
    *   transistorAuthorizationToken: token
    * });
    * ```
    *
    * This *convenience* option merely performs the following [[Authorization]] configuration *automatically* for you:
    *
    * @example
    * ```typescript
    * // Base url to Transistor Demo Server.
    * const url = "http://tracker.transistorsoft.com";
    *
    * // Register for an authorization token from server.
    * const token = await
    *   BackgroundGeolocation.findOrCreateTransistorAuthorizationToken("my-company-name", "my-username");
    *
    * BackgroundGeolocation.ready({
    *   url: url + "/api/locations",
    *   authorization: {
    *     strategy: "JWT",
    *     accessToken: token.accessToken,
    *     refreshToken: token.refreshToken,
    *     refreshUrl: url + "/v2/refresh_token",
    *     refreshPayload: {
    *       refresh_token: "{refreshToken}"
    *     },
    *     expires: token.expires
    *   }
    * });
    * ```
    *
    */
  transistorAuthorization?: TransistorAuthorizationToken;

}
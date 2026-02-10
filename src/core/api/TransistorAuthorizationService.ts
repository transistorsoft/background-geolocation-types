// src/core/api/TransistorAuthorizationToken.ts
import type { Config } from '../config/Config';

/**
 * <!-- doc-id: TransistorAuthorizationToken -->
 * Represents an authorization token issued by a Transistorsoft Tracking Server.
 *
 * Returned from {@link TransistorAuthorizationService.findOrCreate} and consumed by
 * `Config.authorization` / `transistorAuthorizationToken` flows.
 *
 * @category Demo / Debug Server
 */
export interface TransistorAuthorizationToken {
  /** 
   * <!-- doc-id: TransistorAuthorizationToken.accessToken -->
   * JWT access token used for `Authorization: Bearer <token>`. 
   */ 
  accessToken: string;

  /** 
   * <!-- doc-id: TransistorAuthorizationToken.refreshToken -->
   * JWT refresh token used at the `refreshUrl` endpoint.    
   */
  refreshToken: string;

  /**
   * <!-- doc-id: TransistorAuthorizationToken.expires -->
   * Expiry time of the access token (epoch milliseconds).
   * Typically used to drive {@link AuthorizationConfig.expires}.
   */
  expires: number;

  /** 
   * <!-- doc-id: TransistorAuthorizationToken.url -->
   * Base tracker server URL that issued this token. 
   */ 
  url: string;
}

/**
 * <!-- doc-id: TransistorAuthorizationService -->
 * Transistor Software hosts a demo server at [tracker.transistorsoft.com](http://tracker.transistorsoft.com) which is 
 * designed to consume location data from devices running the Background Geolocation SDK.
 *
 * You may also run your own instance of Demo Server locally.  See [background-geolocation-console](https://github.com/transistorsoft/background-geolocation-console)
 *
 * The test server is a great way to debug location problems or evalute the SDK's behaviour, since the results can easily 
 * be shared with *Transistor Software* when requesting support.
 *
 * ![](https://dl.dropboxusercontent.com/s/3abuyyhioyypk8c/screenshot-tracker-transistorsoft.png?dl=1)
 *
 *
 * @example
 * ```typescript
 * // Url to demo server.
 * const url = "http://tracker.transistorsoft.com";
 * const orgname = "my-company-name";
 * const username = "my-username";
 *
 * // Fetch an authoriztion token from server.  The SDK will cache the received token.
 * const token = await
 *   BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(orgname, username, url);
 *
 * BackgroundGeolocation.ready({
 *   transistorAuthorizationToken: token
 * })
 * ```
 *
 * __Viewing Your Tracking Results__
 *
 * To *view* your tracking results in the browser, use your configured "Organization Name" and visit:
 *
 * http://tracker.transistorsoft.com/my-organization-name
 *
 * @category Demo / Debug Server
 */
export interface TransistorAuthorizationService {
  /**
   * <!-- doc-id: TransistorAuthorizationService.findOrCreate -->
   * Find or create a token for the given organization and username.
   *
   * @param orgName - Organization / company identifier.
   * @param username - Username or device label.
   * @param url - Optional tracker base URL. Defaults to the SDK's built‑in value.
   *
   * @returns A Promise resolving with a {@link TransistorAuthorizationToken} instance.
   *
   * @example
   * ```typescript
   * // Url to demo server.
   * const url = "http://tracker.transistorsoft.com";
   * const orgname = "my-company-name";
   * const username = "my-username";
   *
   * // Fetch an authoriztion token from server.  The SDK will cache the received token.
   * const token = await
   *   BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(orgname, username, url);
   *
   * BackgroundGeolocation.ready({
   *   transistorAuthorizationToken: token
   * })
   * ```
   */
  findOrCreate(
    orgName: string,
    username: string,
    url?: string
  ): Promise<TransistorAuthorizationToken>;

  /**
   * <!-- doc-id: TransistorAuthorizationService.destroy -->
   * Destroy the token associated with the given tracker base URL.
   *
   * @param url - Tracker base URL. Defaults to the SDK's built‑in value.
   */
  destroy(url?: string): Promise<void>;

  /**
   * Mutates a {@link Config} to apply the given Transistor token if present.
   *
   * The JS implementation typically:
   * - Reads `config.transistorAuthorizationToken`
   * - Deletes that property
   * - Sets `config.http.url` or `config.url` to `"<token.url>/api/locations"`
   * - Sets `config.authorization = { strategy: "jwt", ... }`
   *
   * If no `transistorAuthorizationToken` is found, the `config` is returned unchanged.
   *
   * @param config - A config that may contain a `transistorAuthorizationToken` field.
   * @returns A {@link Config} with HTTP + authorization wired to the token, if present.
   *
   * @example
   * ```ts
   * async function applyDemoToken(
   *   service: TransistorAuthorizationService,
   *   config: Config
   * ): Promise<Config> {
   *   const token = await service.findOrCreate('my-org', 'user@example.com');
   *
   *   return service.applyIf({
   *     ...config,
   *     transistorAuthorizationToken: token
   *   });
   * }
   * ```
   */
  applyIf<T extends Config & {
    transistorAuthorizationToken?: TransistorAuthorizationToken;
  }>(config: T): Config;
}
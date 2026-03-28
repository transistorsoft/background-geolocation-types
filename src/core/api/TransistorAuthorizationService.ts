// src/core/api/TransistorAuthorizationToken.ts
import type { Config } from '../config/Config';

/**
 * Authorization token issued by a Transistor Software tracking server.
 *
 * Returned from {@link TransistorAuthorizationService.findOrCreate} and used
 * to configure the SDK's HTTP and authorization settings for the demo tracker.
 *
 * @category Demo / Debug Server
 */
export interface TransistorAuthorizationToken {
  /**
   * JWT access token sent as `Authorization: Bearer <token>` on each upload.
   */
  accessToken: string;

  /**
   * JWT refresh token presented to the {@link AuthorizationConfig.refreshUrl}
   * endpoint when the access token expires.
   */
  refreshToken: string;

  /**
   * Expiry time of the access token (epoch milliseconds). Typically used to
   * populate {@link AuthorizationConfig.expires}.
   */
  expires: number;

  /**
   * Base URL of the tracker server that issued this token.
   */
  url: string;
}

/**
 * Client for the Transistor Software demo tracking server.
 *
 * Transistor Software hosts a public demo server at
 * [tracker.transistorsoft.com](http://tracker.transistorsoft.com) that
 * consumes location data from devices running the Background Geolocation SDK.
 * You can also run a local instance — see
 * [background-geolocation-console](https://github.com/transistorsoft/background-geolocation-console).
 *
 * The demo server is useful for evaluating the SDK or for sharing tracking
 * results with Transistor Support when debugging.
 *
 * ![](https://dl.dropboxusercontent.com/s/3abuyyhioyypk8c/screenshot-tracker-transistorsoft.png?dl=1)
 *
 * ## Viewing results
 *
 * To view tracking results in a browser, visit:
 *
 * `http://tracker.transistorsoft.com/<your-organization-name>`
 *
 * @example
 * ```ts
 * const url = "http://tracker.transistorsoft.com";
 * const orgname = "my-company-name";
 * const username = "my-username";
 *
 * // Fetch a token from the server (the SDK caches it automatically).
 * const token = await BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(
 *   orgname, username, url
 * );
 *
 * BackgroundGeolocation.ready({
 *   transistorAuthorizationToken: token
 * });
 * ```
 *
 * @category Demo / Debug Server
 */
export interface TransistorAuthorizationService {
  /**
   * Find or create an authorization token for the given organization and username.
   *
   * If a token already exists in the local cache for this `orgName` + `url`
   * combination, the cached token is returned. Otherwise a new token is
   * requested from the server and cached for future calls.
   *
   * @param orgName - Organization or company identifier.
   * @param username - Username or device label shown on the tracker map.
   * @param url - Optional tracker base URL. Defaults to `tracker.transistorsoft.com`.
   *
   * @returns A Promise resolving with a {@link TransistorAuthorizationToken}.
   *
   * @example
   * ```ts
   * const token = await BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(
   *   "my-company-name",
   *   "my-username",
   *   "http://tracker.transistorsoft.com"
   * );
   *
   * BackgroundGeolocation.ready({
   *   transistorAuthorizationToken: token
   * });
   * ```
   */
  findOrCreate(
    orgName: string,
    username: string,
    url?: string
  ): Promise<TransistorAuthorizationToken>;

  /**
   * Remove the cached token associated with the given tracker URL.
   *
   * @param url - Tracker base URL. Defaults to `tracker.transistorsoft.com`.
   */
  destroy(url?: string): Promise<void>;

  /**
   * Mutate a {@link Config} to apply a `transistorAuthorizationToken` if present.
   *
   * The implementation reads `config.transistorAuthorizationToken`, removes that
   * property, sets `config.http.url` to `"<token.url>/api/locations"`, and
   * injects `config.authorization` with a JWT strategy derived from the token.
   * If no `transistorAuthorizationToken` is found, the config is returned unchanged.
   *
   * @param config - A config that may contain a `transistorAuthorizationToken` field.
   * @returns A {@link Config} with HTTP and authorization wired to the token, if present.
   *
   * @example
   * ```ts
   * const token = await service.findOrCreate('my-org', 'user@example.com');
   *
   * const config = service.applyIf({
   *   ...myConfig,
   *   transistorAuthorizationToken: token
   * });
   *
   * BackgroundGeolocation.ready(config);
   * ```
   */
  applyIf<T extends Config & {
    transistorAuthorizationToken?: TransistorAuthorizationToken;
  }>(config: T): Config;
}

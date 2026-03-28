import { AuthorizationStrategy } from '../../enums/AuthorizationStrategy';

/**
 * <!-- doc-id: AuthorizationConfig -->
 * Token-based authorization configuration for the background geolocation SDK.
 *
 * `AuthorizationConfig` enables the SDK to authenticate HTTP uploads with an
 * {@link AuthorizationConfig.accessToken | access token} and to automatically
 * refresh that token when it expires or when the server returns
 * `401 Unauthorized`.
 *
 * When using {@link Config.authorization}, do not set `Authorization` manually
 * inside {@link HttpConfig.headers} — the SDK manages the authorization header
 * automatically.
 *
 * ### Contents
 * - [Overview](#overview)
 * - [Token refresh](#token-refresh)
 * - [Refresh payload](#refresh-payload)
 * - [Authorization events](#authorization-events)
 *
 * ---
 *
 * ### Overview
 *
 * The SDK attaches the configured access token to every HTTP upload request as
 * an `Authorization` header. If you supply {@link AuthorizationConfig.refreshUrl},
 * {@link AuthorizationConfig.refreshToken}, and
 * {@link AuthorizationConfig.refreshPayload}, the SDK can automatically refresh
 * expired tokens when a `401 Unauthorized` response is received.
 *
 * | Category | Properties | Notes |
 * |----------|------------|-------|
 * | **Token** | `strategy`, `accessToken`, `expires` | Token value and expiry. |
 * | **Refresh** | `refreshUrl`, `refreshToken`, `refreshPayload`, `refreshHeaders` | Auto-refresh on `401` or expiry. |
 *
 * @example
 * ```ts
 * const token = getMyToken(); // Your own token fetch method
 *
 * BackgroundGeolocation.onAuthorization((event) => {
 *   if (event.success) {
 *     console.log("[authorization] SUCCESS:", event.response);
 *   } else {
 *     console.log("[authorization] ERROR:", event.error);
 *   }
 * });
 *
 * BackgroundGeolocation.ready({
 *   http: {
 *     url: "https://app.your.server.com/users/locations",
 *     autoSync: true,
 *   },
 *   authorization: {
 *     strategy: "JWT",
 *     accessToken: token.accessToken,
 *     refreshToken: token.refreshToken,
 *     refreshUrl: "https://auth.your.server.com/tokens",
 *     refreshPayload: {
 *       the_refresh_token_field_name: "{refreshToken}"
 *     },
 *     expires: token.expiresAt,
 *   }
 * });
 * ```
 *
 * ---
 *
 * ### Token refresh
 *
 * When a `401 Unauthorized` response is received, or when `expires` is
 * reached, the SDK sends an `application/x-www-form-urlencoded` POST to
 * `refreshUrl` with the `refreshPayload` fields encoded in the body.
 *
 * On receiving the response, the SDK recursively iterates through the JSON
 * keys to locate:
 *
 * 1. A new access token
 * 2. A new refresh token (if present)
 * 3. An expiry time (if present)
 *
 * The SDK recognizes a wide variety of response shapes automatically. For
 * example, a nested response:
 *
 * ```json
 * {
 *   "token": {
 *     "access_token": "XXX.YYY.ZZZ",
 *     "expires_at": 3900
 *   },
 *   "refresh_token": "smTsfaspfgaadsfgqZerUt0wueflasdfkaxjdfeKIacb"
 * }
 * ```
 *
 * And a flat response:
 *
 * ```json
 * {
 *   "accessToken": "XXX.YYY.ZZZ",
 *   "refreshToken": "smTsfaspfgaadsfgqZerUt0wueflasdfkaxjdfeKIacb",
 *   "expiry": 3900
 * }
 * ```
 *
 * Both are handled automatically.
 *
 * ---
 *
 * ### Refresh payload
 *
 * `refreshPayload` is a key/value map sent as form fields in the refresh POST.
 * At least one field must use the template variable `"{refreshToken}"`, which
 * the SDK replaces with the current `refreshToken` value at request time.
 * Additional arbitrary fields required by your authorization server may also
 * be included.
 *
 * If `refreshHeaders` is not set, the SDK automatically injects
 * `Authorization: Bearer {accessToken}` into each refresh request. Pass an
 * empty object `{}` to send no headers with the refresh request.
 *
 * ---
 *
 * ### Authorization events
 *
 * Whenever the SDK receives a response from {@link refreshUrl}, it fires
 * {@link BackgroundGeolocation.onAuthorization} with an
 * {@link AuthorizationEvent}.
 *
 * - On **success**, {@link AuthorizationEvent.response} contains the parsed
 *   JSON from the refresh server.
 * - On **error**, {@link AuthorizationEvent.error} contains the error message.
 *
 * @example
 * ```ts
 * BackgroundGeolocation.onAuthorization((event) => {
 *   if (event.success) {
 *     console.log("[authorization] SUCCESS:", event.response);
 *   } else {
 *     console.log("[authorization] ERROR:", event.error);
 *   }
 * });
 * ```
 *
 * @category Config
 */
export interface AuthorizationConfig {
  /**
   * <!-- doc-id: AuthorizationConfig.strategy -->
   * Authorization strategy used when attaching the token to HTTP requests.
   * Defaults to `"JWT"`.
   *
   * - `"JWT"` — sends the token as `Authorization: Bearer <token>`.
   * - `"SAS"` — sends the token as `Authorization: <token>` (no `Bearer` prefix).
   */
  strategy: string;

  /**
   * <!-- doc-id: AuthorizationConfig.accessToken -->
   * The access token attached to each HTTP request as an `Authorization`
   * header.
   *
   * The SDK automatically applies the token to every upload request sent to
   * {@link HttpConfig.url}. Do not set `Authorization` manually in
   * {@link HttpConfig.headers}.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   authorization: {
   *     strategy: "JWT",
   *     accessToken: "XXX.YYY.ZZZ"
   *   }
   * });
   * ```
   */
  accessToken: string;

  /**
   * <!-- doc-id: AuthorizationConfig.refreshToken -->
   * The token sent to {@link refreshUrl} when a new {@link accessToken} is
   * needed after {@link expires} or when HTTP `401 Unauthorized` is received.
   *
   * The SDK encodes this value into the {@link refreshPayload} by substituting
   * the `"{refreshToken}"` template variable before sending the refresh
   * request.
   */
  refreshToken?: string;

  /**
   * <!-- doc-id: AuthorizationConfig.refreshUrl -->
   * The URL of the authorization server that provides a new {@link accessToken}
   * when the current token expires.
   *
   * The SDK POSTs to this URL using `application/x-www-form-urlencoded` when
   * the current token expires or when the location server returns
   * `401 Unauthorized`. The response is parsed automatically — see
   * [Token refresh](#token-refresh) for supported response formats.
   *
   * When the SDK receives a response from the server, it fires
   * {@link BackgroundGeolocation.onAuthorization} with an
   * {@link AuthorizationEvent}.
   */
  refreshUrl?: string;

  /**
   * <!-- doc-id: AuthorizationConfig.refreshPayload -->
   * Form fields sent in the `application/x-www-form-urlencoded` POST to
   * {@link refreshUrl} when requesting a new {@link accessToken} after
   * expiration.
   *
   * Include at least one field whose value is the template string
   * `"{refreshToken}"`. The SDK automatically replaces this with the
   * configured {@link refreshToken} value before sending the request.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   authorization: {
   *     strategy: "JWT",
   *     accessToken: "XXX.YYY.ZZZ",
   *     refreshUrl: "https://auth.your.server.com/tokens",
   *     refreshToken: "smTsfaspfgaadsfgqZerUt0wueflasdfkaxjdfeKIacb",
   *     refreshPayload: {
   *       my_refresh_token: "{refreshToken}",
   *       grant_type: "refresh_token",
   *       foo: "another arbitrary field"
   *     }
   *   }
   * });
   * ```
   *
   * The equivalent `curl` representation of the SDK's form POST:
   *
   * ```bash
   * $ curl -X POST \
   *   -F 'my_refresh_token=smTsfaspfgaadsfgqZerUt0wueflasdfkaxjdfeKIacb' \
   *   -F 'grant_type=refresh_token' \
   *   -F 'foo=another arbitrary field' \
   *   https://auth.your.server.com/tokens
   * ```
   */
  refreshPayload?: Record<string, string>;

  /**
   * <!-- doc-id: AuthorizationConfig.refreshHeaders -->
   * HTTP headers sent with each request to {@link refreshUrl}.
   *
   * If not set, the SDK automatically injects
   * `Authorization: Bearer {accessToken}` into refresh requests, where
   * `{accessToken}` is replaced with the current access token. To send no
   * headers with refresh requests, provide an empty object `{}`.
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   authorization: {
   *     accessToken: "XXX.YYY.ZZZ",
   *     refreshUrl: "https://auth.domain.com/tokens",
   *     refreshToken: "smTsfaspfgaadsfgqZerUt0wueflasdfkaxjdfeKIacb",
   *     refreshPayload: {
   *       my_refresh_token: "{refreshToken}",
   *       grant_type: "refresh_token",
   *       foo: "another arbitrary field"
   *     },
   *     refreshHeaders: {}
   *   }
   * });
   * ```
   */
  refreshHeaders?: Record<string, string>;

  /**
   * <!-- doc-id: AuthorizationConfig.expires -->
   * Token expiry time in seconds since epoch. Defaults to `-1` (not set).
   *
   * When set, the SDK proactively refreshes the token before expiry rather
   * than waiting for a `401 Unauthorized` response. When not set (default
   * `-1`), the SDK relies on a `401` response to trigger a refresh.
   */
  expires?: number;
}

import { AuthorizationStrategy } from '../../enums/AuthorizationStrategy';

/**
 * <!-- doc-id: AuthorizationConfig -->
 * Configure the SDK to authenticate with your server using an
 * {@link AuthorizationConfig.accessToken | access token} (e.g., a
 * [JSON Web Token](https://jwt.io/)), and automatically request new tokens when
 * the server returns **`401 Unauthorized`**.
 *
 * **Note:** Only [JSON Web Token](https://jwt.io/) (JWT) is currently supported.
 *
 * The SDK automatically attaches your token to each HTTP request:
 *
 * ```txt
 * Authorization: Bearer XXX.YYY.ZZZ
 * ```
 *
 * When using {@link Config.authorization}, **do not** manually define
 * `Authorization` inside {@link HttpConfig.headers}. The SDK manages all JWT
 * headers automatically.
 *
 * If you supply {@link AuthorizationConfig.refreshUrl},
 * {@link AuthorizationConfig.refreshToken}, and
 * {@link AuthorizationConfig.refreshPayload}, the SDK can automatically refresh
 * expired tokens when a `401 Unauthorized` response is received.
 *
 * **Configuration**
 *
 * @example
 * ```ts
 * const token = getMyToken(); // Your own JWT fetch method
 *
 * // Listen for authorization refresh results
 * BackgroundGeolocation.onAuthorization((event) => {
 *   if (event.success) {
 *     console.log("[authorization] SUCCESS:", event.response);
 *   } else {
 *     console.log("[authorization] ERROR:", event.error);
 *   }
 * });
 *
 * // Initialize with JWT authorization
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
 * **Receiving responses from** {@link AuthorizationConfig.refreshUrl}
 *
 * Whenever the SDK receives a response from your
 * {@link refreshUrl}, it fires
 * {@link BackgroundGeolocation.onAuthorization}. Your callback will receive an
 * {@link AuthorizationEvent}.
 *
 * - On **success**, {@link AuthorizationEvent.response} contains the parsed JSON.
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
 * @category Config
 */
export interface AuthorizationConfig {  
  /**
   * <!-- doc-id: AuthorizationConfig.strategy -->
   * Authorization strategy.  Only [JWT](https://jwt.io/) is supported.
   */
  strategy:string;
  /**
   * <!-- doc-id: AuthorizationConfig.accessToken -->
   * Authorization token (eg: [JWT](https://jwt.io/)) required for authorization by your server at {@link HttpConfig.url}.
   *
   * The SDK will automatically apply the configured `accessToken` to each HTTP request's `Authorization` header, eg:
   *
   * `"Authorization": "Bearer XXX.YYY.ZZZ"`
   *
   * You do **not** need to manually configure {@link HttpConfig.headers} with the `Authorization` parameter.  It is all **automatic**.
   */
  accessToken:string;
  /**
   * <!-- doc-id: AuthorizationConfig.refreshToken -->
   * The token to be POSTed to {@link refreshUrl}, encoded into the {@link refreshPayload}, when a new {@link accessToken} is required after {@link expires} or when HTTP `401 Unauthorized` is received.
   */
  refreshToken?:string;
  /**
   * <!-- doc-id: AuthorizationConfig.refreshUrl -->
   * The url to your authorization server that provides new {@link accessToken} when expired.
   *
   * When the SDK receives a response the server, it will decode the JSON and recursively iterate through the keys, performing regular expressions and other String-analysis *to "taste"* the data in search of the following 3 items:
   *
   * 1. "access token"
   * 2. "refresh token"
   * 3. "expiry time"
   *
   * The SDK is designed to operate with *any* response data-structure.  For example, one authorization server might return a complex response such as:
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
   * While another server might return a flat response, such as:
   *
   * ```json
   * {
   *  "accessToken": "XXX.YYY.ZZZ",
   *  "refreshToken": "smTsfaspfgaadsfgqZerUt0wueflasdfkaxjdfeKIacb",
   *  "expiry": 3900
   * }
   * ```
   *
   * When the response from the server is received, the event {@link BackgroundGeolocation.onAuthorization} will be fired, provided with the {@link AuthorizationEvent}.
   */
   refreshUrl?:string;
  /**
   * <!-- doc-id: AuthorizationConfig.refreshPayload -->
   * Refresh payload will be encoded into the FORM POST to the {@link refreshUrl} when requesting a new {@link accessToken} after expiration.
   *
   * You *must* provide one field-template which will represent your "refresh token" using the value: __`{refreshToken}`__.  The SDK will
   * _automatically_ replace this simple template with the configured {@link refreshToken}.
   *
   * @example
   * ```typescript
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
   * with the configuration above, a **`curl`** representation of the SDK's FORM POST, might look like this:
   * ```bash
   * $ curl -X POST \
   *   -F 'my_refresh_token=smTsfaspfgaadsfgqZerUt0wueflasdfkaxjdfeKIacb' \
   *   -F 'grant_type=refresh_token' \
   *   -F 'foo=another arbitrary field' \
   *   https://auth.your.server.com/tokens
   * ```
   *
   */
  refreshPayload?:Record<string,string>;
  /**
   * <!-- doc-id: AuthorizationConfig.refreshHeaders -->
   * Optional headers applied on requests to {@link refreshUrl}
   * Defaults to: `{"Authorization":  "Bearer {accessToken}"}`
   *
   * The template variable `{accessToken}` will automatically be replaced with your app's current auth token.
   *
   * If you do not want *any* headers applied on requests to {refreshUrl}, provide an empty `{}`.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.ready({
   *   authorization: {
   *     accessToken: "XXX.YYY.ZZZ",
   *     refreshUrl: "https://auth.domain.com/tokens",
   *     refreshToken: "smTsfaspfgaadsfgqZerUt0wueflasdfkaxjdfeKIacb",
   *     refreshPayload: {
   *       "my_refresh_token": "{refreshToken}", // <-- replaced with configured refreshToken above.
   *       "grant_type": "refresh_token",        // <-- arbitrary fields required by your auth server
   *       "foo": "another arbitrary field"
   *     },
   *     refreshHeaders: {}  // <-- Empty {} to provide no refreshHeaders.
   *   )
   * ));
   * ```
   *
   */
  refreshHeaders?:Record<string,string>;

  /**
   * <!-- doc-id: AuthorizationConfig.expires -->
   * Token expiry time in seconds.
   */
  expires?:number;
}


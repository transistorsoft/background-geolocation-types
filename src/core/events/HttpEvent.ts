/**
 * HTTP response payload delivered to {@link BackgroundGeolocation.onHttp}.
 *
 * The SDK fires this event after every upload attempt — whether the request
 * succeeded or failed. Use it to inspect the server response, handle errors,
 * or trigger follow-up logic in your app.
 *
 * @example
 * ```ts
 * BackgroundGeolocation.onHttp((event) => {
 *   if (event.success) {
 *     console.log("[onHttp] Upload succeeded:", event.status);
 *   } else {
 *     console.warn("[onHttp] Upload failed:", event.status, event.responseText);
 *   }
 * });
 * ```
 *
 * @category Events
 */
export interface HttpEvent {
  /**
   * `true` when the server returned a 2xx status code.
   */
  success: boolean;
  /**
   * HTTP status code returned by the server (e.g. `200`, `201`, `404`, `500`).
   */
  status: number;
  /**
   * Raw response body returned by the server.
   *
   * Parse this string to extract server-side data, error messages, or
   * remote-control commands embedded in the response.
   */
  responseText: string;
}

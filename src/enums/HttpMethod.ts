/**
 * Allowed HTTP methods for uploading data.
 * Mirrors Flutter's HttpConfig.method and native support.
 * 
 * @category Config
 */
export const HttpMethod = {
  Post: 'POST',
  Put: 'PUT',
  Patch: 'PATCH'
} as const;

/** @internal @hidden */
export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];
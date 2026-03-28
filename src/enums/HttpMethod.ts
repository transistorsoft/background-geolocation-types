/**
 * Allowed HTTP methods for uploading data.
 * Mirrors Flutter's HttpConfig.method and native support.
 * 
 * @category Config
 */
export const HttpMethod = {  
  /**
   * HTTP POST method. 
   */
  Post: 'POST',
  /**
   * HTTP PUT method. 
   */
  Put: 'PUT',
  /**
   * HTTP PATCH method. 
   */
  Patch: 'PATCH'
} as const;

/** @internal @hidden */
export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];
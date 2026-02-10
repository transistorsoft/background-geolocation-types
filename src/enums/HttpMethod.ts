/**
 * <!-- doc-id: HttpMethod -->
 * Allowed HTTP methods for uploading data.
 * Mirrors Flutter's HttpConfig.method and native support.
 * 
 * @category Config
 */
export const HttpMethod = {  
  /**
   * <!-- doc-id: HttpMethod.Post -->
   * HTTP POST method. 
   */
  Post: 'POST',
  /**
   * <!-- doc-id: HttpMethod.Put -->
   * HTTP PUT method. 
   */
  Put: 'PUT',
  /**
   * <!-- doc-id: HttpMethod.Patch -->
   * HTTP PATCH method. 
   */
  Patch: 'PATCH'
} as const;

/** @internal @hidden */
export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];
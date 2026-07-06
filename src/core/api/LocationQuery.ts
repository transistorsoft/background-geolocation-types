import { SQLQueryOrder } from "../../enums/SQLQueryOrder";

/**
 * Constrains a {@link BackgroundGeolocation.getLocations} query by page size,
 * starting offset, and sort order.
 *
 * A locations read is a paging operation: fetch a bounded slice of the SDK's
 * SQLite database so a large table can be drained incrementally rather than
 * materialised all at once. Pass this object to retrieve one page at a time,
 * sizing your paging with {@link BackgroundGeolocation.getCount}.
 *
 * @example
 * ```ts
 * // Newest 500 records
 * const page = await BackgroundGeolocation.getLocations({
 *   limit: 500,
 *   order: SQLQueryOrder.Desc
 * });
 *
 * // Drain the table one page at a time
 * const total = await BackgroundGeolocation.getCount();
 * for (let page = 0; page * 500 < total; page++) {
 *   const records = await BackgroundGeolocation.getLocations({ limit: 500, page });
 *   // ...process records
 * }
 * ```
 *
 * @category Data
 */
export interface LocationQuery {
  /**
   * Maximum number of records to return.
   *
   * Without a limit, every matching record is returned in a single call.
   */
  limit?: number;

  /**
   * Number of records to skip before returning results.
   *
   * Combine with {@link limit} for offset-based paging. An explicit offset takes
   * precedence over {@link page}.
   */
  offset?: number;

  /**
   * Zero-indexed page number — a convenience over {@link offset}.
   *
   * Resolves to `offset = page * limit`, so page `0` is the first page. Requires
   * {@link limit}; without one it has no effect.
   */
  page?: number;

  /**
   * Sort order for results: `SQLQueryOrder.Asc` (oldest first) or
   * `SQLQueryOrder.Desc` (newest first).
   *
   * Defaults to {@link PersistenceConfig.locationsOrderDirection}.
   */
  order?: SQLQueryOrder;
}

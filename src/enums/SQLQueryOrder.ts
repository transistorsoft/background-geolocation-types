/**
 * Sort order for {@link SQLQuery.order}.
 *
 * | Name          | Value |
 * |---------------|-------|
 * | Asc           | `1`   |
 * | Desc          | `-1`  |
 * 
 * @category Logger
 */
export const SQLQueryOrder = {
  /**
   * Ascending order (oldest to newest). 
   */
  Asc: 1,
  /**
   * Descending order (newest to oldest). 
   */
  Desc: -1,
} as const;

/** @hidden */
export type SQLQueryOrder =
  (typeof SQLQueryOrder)[keyof typeof SQLQueryOrder];

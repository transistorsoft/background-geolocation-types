/**
 * Sort order for [[SQLQuery.order]].
 *
 * | Name          | Value |
 * |---------------|-------|
 * | Asc           | `1`   |
 * | Desc          | `-1`  |
 * 
 * @category Logger
 */
export const SQLQueryOrder = {
  Asc: 1,
  Desc: -1,
} as const;

/** @hidden */
export type SQLQueryOrder =
  (typeof SQLQueryOrder)[keyof typeof SQLQueryOrder];

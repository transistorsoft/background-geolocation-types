/**
 * Log severity level used by {@link Logger.debug} {@link Logger.info}, etc.
 * @hidden
 * @internal
 */
export const LogLevelName = {
  Debug: "debug",
  Notice: "notice",
  Info: "info",
  Warn: "warn",
  Error: "error"
} as const;

/** @internal @hidden */
export type LogLevelName = typeof LogLevelName[keyof typeof LogLevelName];

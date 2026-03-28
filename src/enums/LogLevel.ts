/**
 * Controls the verbosity of plugin logging.
 *
 * | Level   | Value | Description                     |
 * |---------|:-----:|---------------------------------|
 * | Off     |   0   | Disable all logging.            |
 * | Error   |   1   | Log only critical failures.     |
 * | Warning |   2   | Log warnings + errors.          |
 * | Info    |   3   | Operational information.        |
 * | Debug   |   4   | Developer-level debug output.   |
 * | Verbose |   5   | Maximum detail.                 |
 *
 * Mirrors native logging constants on iOS & Android.
 *
 * @category Config
 */
export const LogLevel = {
  /**
   * Disable all logging.
   */
  Off: 0,
  /** 
   * Log only critical failures.
   */
  Error: 1,
  /** 
   * Log warnings + errors.
   */
  Warning: 2,
  /** 
   * Operational information.
   */
  Info: 3,
  /**
   * Developer-level debug output.
   */
  Debug: 4,
  /**
   * Maximum detail.
   */
  Verbose: 5,
} as const;

/**
 * Type union of all LogLevel values.
 * @internal @hidden
 */
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];
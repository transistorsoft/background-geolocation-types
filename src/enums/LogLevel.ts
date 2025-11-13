/** 
 * Controls the verbosity of plugin logging. 
 * 
 * @category Config
 */
export const LogLevel = {
  Off: 0,
  Error: 1,
  Warning: 2,
  Info: 3,
  Debug: 4,
  Verbose: 5
} as const;

/** @internal @hidden */
export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

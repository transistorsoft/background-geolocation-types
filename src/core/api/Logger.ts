import { SQLQueryOrder } from "../../enums/SQLQueryOrder";

/**
 * <!-- doc-id: SQLQuery -->
 * Constrains a log query by date range, sort order, and record count.
 *
 * Pass to {@link Logger.getLog}, {@link Logger.emailLog}, or
 * {@link Logger.uploadLog} to filter which log entries are included.
 *
 * @example
 * ```ts
 * const Logger = BackgroundGeolocation.logger;
 *
 * // Date range
 * const log = await Logger.getLog({
 *   start: Date.parse("2019-10-21 13:00"),
 *   end:   Date.parse("2019-10-22")
 * });
 *
 * // First 100 records ascending
 * await Logger.emailLog("foo@bar.com", {
 *   order: SQLQueryOrder.Asc,
 *   limit: 100
 * });
 *
 * // Upload a specific time window
 * await Logger.uploadLog("https://my.server.com/users/123/logs", {
 *   start: Date.parse("2019-10-20 09:00"),
 *   end:   Date.parse("2019-10-20 11:59")
 * });
 * ```
 *
 * @category Logger
 */
export interface SQLQuery {
  /**
   * <!-- doc-id: SQLQuery.start -->
   * Start of the query window (unix timestamp in **milliseconds**).
   */
  start?: number;

  /**
   * <!-- doc-id: SQLQuery.end -->
   * End of the query window (unix timestamp in **milliseconds**).
   */
  end?: number;

  /**
   * <!-- doc-id: SQLQuery.limit -->
   * Maximum number of records to return.
   */
  limit?: number;

  /**
   * <!-- doc-id: SQLQuery.offset -->
   * Number of matching records to skip before returning results (for paging).
   */
  offset?: number;

  /**
   * <!-- doc-id: SQLQuery.order -->
   * Sort order for results: `SQLQueryOrder.Asc` (oldest first) or
   * `SQLQueryOrder.Desc` (newest first).
   */
  order?: SQLQueryOrder;
}

/**
 * <!-- doc-id: Logger -->
 * SDK logging API — access via {@link BackgroundGeolocation.logger}.
 *
 * The SDK writes structured log entries to an internal SQLite database for
 * up to {@link LoggerConfig.logMaxDays} days (default `3`). Log volume is
 * controlled by {@link LoggerConfig.logLevel} (default `LogLevel.Off`). Logs
 * can be fetched as a string, emailed from the device, or uploaded to a URL.
 *
 * ### Contents
 * - [Overview](#overview)
 * - [Retrieving logs](#retrieving-logs)
 * - [Writing log entries](#writing-log-entries)
 * - [Examples](#examples)
 *
 * ---
 *
 * ### Overview
 *
 * | Method | Description |
 * |--------|-------------|
 * | {@link getLog} | Fetch all log entries as a string. |
 * | {@link emailLog} | Send logs via the device mail client. |
 * | {@link uploadLog} | Upload logs to a URL as a gzipped multipart file. |
 * | {@link destroyLog} | Clear the log database. |
 * | {@link debug}, {@link info}, {@link warn}, {@link error}, {@link notice} | Write custom log entries. |
 *
 * @example
 * ```ts
 * const Logger = BackgroundGeolocation.logger;
 * const log = await Logger.getLog();
 * ```
 *
 * ---
 *
 * ### Retrieving logs
 *
 * All three retrieval methods accept an optional {@link SQLQuery} to constrain
 * results by date range, sort order, and record count. Without a query, all
 * records up to {@link LoggerConfig.logMaxDays} days old are returned.
 *
 * @example
 * ```ts
 * const Logger = BackgroundGeolocation.logger;
 * const log = await Logger.getLog({
 *   start: Date.parse("2019-10-21 13:00"),
 *   end:   Date.parse("2019-10-22"),
 *   order: Logger.ORDER_ASC,
 *   limit: 100
 * });
 * ```
 *
 * Sample log output:
 *
 * ```
 * 09-19 11:12:18.716 ╔═════════════════════════════════════════════
 * 09-19 11:12:18.716 ║ BackgroundGeolocation Service started
 * 09-19 11:12:18.716 ╠═════════════════════════════════════════════
 * 09-19 11:12:18.723   ✅  Started in foreground
 * 09-19 11:12:18.737   🎾  Start activity updates: 10000
 * 09-19 11:12:21.405   ✅  INSERT: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
 * 09-19 11:12:21.454   🔵  HTTP POST: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
 * 09-19 11:12:22.083   🔵  Response: 200
 * 09-19 11:12:22.100   ✅  DESTROY: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
 * ```
 *
 * ---
 *
 * ### Writing log entries
 *
 * Insert custom messages into the SDK's log database at any severity level.
 * Custom entries appear inline with SDK entries, making it easy to correlate
 * your app's actions with location events.
 *
 * | Method | Level | Icon |
 * |--------|-------|------|
 * | {@link error} | `ERROR` | ❗️ |
 * | {@link warn} | `WARNING` | ⚠️ |
 * | {@link debug} | `DEBUG` | 🐞 |
 * | {@link info} | `INFO` | ℹ️ |
 * | {@link notice} | `INFO` | 🔵 |
 *
 * @example
 * ```ts
 * const Logger = BackgroundGeolocation.logger;
 * BackgroundGeolocation.onLocation((location) => {
 *   Logger.debug("Location received: " + location.uuid);
 * });
 * ```
 *
 * ---
 *
 * ### Examples
 *
 * @example Fetch and display the full log
 * ```ts
 * const Logger = BackgroundGeolocation.logger;
 * const log = await Logger.getLog();
 * console.log("[log]", log);
 * ```
 *
 * @example Upload log to your server
 * ```ts
 * await BackgroundGeolocation.logger.uploadLog(
 *   "https://my.server.com/users/123/logs"
 * );
 * ```
 *
 * @example Email log with a date range
 * ```ts
 * const Logger = BackgroundGeolocation.logger;
 * await Logger.emailLog("support@example.com", {
 *   start: Date.parse("2019-09-19"),
 *   end:   Date.parse("2019-09-20"),
 *   order: Logger.ORDER_ASC
 * });
 * ```
 *
 * @category Logger
 */
export interface Logger {
  /**
   * <!-- doc-id: Logger.ORDER_ASC -->
   * Sort-order constant for ascending log queries (oldest first).
   */
  readonly ORDER_ASC: 1;

  /**
   * <!-- doc-id: Logger.ORDER_DESC -->
   * Sort-order constant for descending log queries (newest first).
   */
  readonly ORDER_DESC: -1;

  /**
   * <!-- doc-id: Logger.debug -->
   * Insert a debug-level message into the SDK's log database.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.logger.debug("This is a debug message");
   * ```
   *
   * ```
   * D TSLocationManager: [c.t.l.logger.TSLog log] This is a debug message
   * ```
   */
  debug(message: string): void;

  /**
   * <!-- doc-id: Logger.error -->
   * Insert an error-level message into the SDK's log database.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.logger.error("Something BAD");
   * ```
   *
   * ```
   * E TSLocationManager: [c.t.l.logger.TSLog log]
   * E TSLocationManager: ‼ Something BAD
   * ```
   */
  error(message: string): void;

  /**
   * <!-- doc-id: Logger.warn -->
   * Insert a warning-level message into the SDK's log database.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.logger.warn("Something WEIRD");
   * ```
   *
   * ```
   * E TSLocationManager: [c.t.l.logger.TSLog log]
   * E TSLocationManager: ⚠️  Something WEIRD
   * ```
   */
  warn(message: string): void;

  /**
   * <!-- doc-id: Logger.info -->
   * Insert an info-level message into the SDK's log database.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.logger.info("Something informative");
   * ```
   *
   * ```
   * I TSLocationManager: [c.t.l.logger.TSLog log]
   * I TSLocationManager:   ℹ️  Something informative
   * ```
   */
  info(message: string): void;

  /**
   * <!-- doc-id: Logger.notice -->
   * Insert a notice-level message into the SDK's log database.
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.logger.notice("A Notice");
   * ```
   *
   * ```
   * I TSLocationManager: [c.t.l.logger.TSLog log]
   * I TSLocationManager:   🔵  A Notice
   * ```
   */
  notice(message: string): void;

  /**
   * <!-- doc-id: Logger.getLog -->
   * Fetch the SDK's log database as a string.
   *
   * Provide an optional {@link SQLQuery} to constrain results by date range,
   * sort order, and record count. Depending on {@link LoggerConfig.logLevel},
   * the result may be several megabytes.
   *
   * **See also**
   * - {@link LoggerConfig.logMaxDays}
   * - {@link LoggerConfig.logLevel}
   * - {@link emailLog}
   * - {@link uploadLog}
   * - 📘[Debugging Guide](github:wiki/Debugging)
   *
   * @example
   * ```typescript
   * // Fetch all logs
   * const log = await BackgroundGeolocation.logger.getLog();
   * console.log("[log]", log);
   *
   * // Constrain by date range
   * const Logger = BackgroundGeolocation.logger;
   * const log = await Logger.getLog({
   *   start: Date.parse("2019-09-19 11:12"),
   *   end:   Date.parse("2019-09-19 11:13"),
   *   order: Logger.ORDER_ASC,
   *   limit: 100
   * });
   * ```
   */
  getLog(query?: SQLQuery): Promise<string>;

  /**
   * <!-- doc-id: Logger.emailLog -->
   * Send the SDK's log database to an email address via the device mail client.
   *
   * Provide an optional {@link SQLQuery} to constrain which records are included.
   *
   * **See also**
   * - {@link LoggerConfig.logLevel}
   * - {@link getLog}
   * - {@link uploadLog}
   * - 📘[Debugging Guide](github:wiki/Debugging)
   *
   * @example
   * ```typescript
   * const Logger = BackgroundGeolocation.logger;
   * await Logger.emailLog("foo@bar.com");
   *
   * // Constrain by date range
   * await Logger.emailLog("foo@bar.com", {
   *   start: Date.parse("2019-09-19"),
   *   end:   Date.parse("2019-09-20"),
   *   order: Logger.ORDER_ASC,
   *   limit: 1000
   * });
   * ```
   */
  emailLog(email: string, query?: SQLQuery): Promise<void | boolean>;

  /**
   * <!-- doc-id: Logger.uploadLog -->
   * Upload the SDK's log database to a URL as a gzipped multipart file.
   *
   * Provide an optional {@link SQLQuery} to constrain which records are included.
   * The upload includes your configured {@link HttpConfig.headers} for
   * authentication.
   *
   * ### Multipart upload
   *
   * The log is posted as a gzipped multipart file — the same file produced by
   * {@link emailLog}. The request body also includes a form with the following
   * fields:
   *
   * | Key | Value |
   * |-----|-------|
   * | `state` | JSON-encoded result of `getState` |
   * | `model` | Device model |
   * | `manufacturer` | Device manufacturer |
   * | `platform` | `iOS` or `Android` |
   * | `version` | OS version |
   *
   * **See also**
   * - {@link LoggerConfig.logLevel}
   * - {@link getLog}
   * - {@link emailLog}
   * - {@link destroyLog}
   * - 📘[Debugging Guide](github:wiki/Debugging)
   *
   * @example
   * ```typescript
   * await BackgroundGeolocation.logger.uploadLog(
   *   "https://my.server.com/users/123/logs"
   * );
   *
   * // Constrain by date range
   * await BackgroundGeolocation.logger.uploadLog(
   *   "https://my.server.com/users/123/logs",
   *   { start: Date.parse("2019-10-20 09:00"), end: Date.parse("2019-10-20 11:59") }
   * );
   * ```
   */
  uploadLog(url: string, query?: SQLQuery): Promise<void | boolean>;

  /**
   * <!-- doc-id: Logger.destroyLog -->
   * Delete all records from the SDK's log database.
   *
   * **See also**
   * - {@link LoggerConfig.logLevel}
   * - {@link getLog}
   * - {@link emailLog}
   * - {@link uploadLog}
   * - 📘[Debugging Guide](github:wiki/Debugging)
   *
   * @example
   * ```typescript
   * await BackgroundGeolocation.logger.destroyLog();
   * ```
   */
  destroyLog(): Promise<void>;
}

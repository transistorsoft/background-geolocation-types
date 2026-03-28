import { LogLevel } from '../../enums/LogLevel';

/**
 * <!-- doc-id: LoggerConfig -->
 * Logging and diagnostics configuration for the background geolocation SDK.
 *
 * `LoggerConfig` controls how much the SDK writes to its internal log, how long
 * entries are retained on device, and whether developer debug aids such as
 * audible soundFX are active.
 *
 * ### Contents
 * - [Overview](#overview)
 * - [Log levels](#log-levels)
 * - [Debug mode](#debug-mode)
 * - [Retention](#retention)
 * - [Diagnostics](#diagnostics)
 * - [Migration](#migration)
 * - [Examples](#examples)
 *
 * ---
 *
 * ### Overview
 *
 * The SDK maintains a persistent, SQLite-backed log that survives app restarts.
 * Logging serves two purposes:
 *
 * 1. **Development & QA** — High-verbosity logs and optional audible soundFX
 *    make it easy to follow SDK behaviour without watching a console. You can
 *    hear when locations are recorded, when motion transitions occur, and when
 *    geofences fire.
 *
 * 2. **Production diagnostics** — Lower verbosity preserves essential
 *    operational traces without excessive storage use or privacy impact.
 *
 * | Category   | Properties | Notes |
 * |------------|------------|-------|
 * | Verbosity  | {@link logLevel} | `Off` → `Verbose` |
 * | Debug aids | {@link debug} | Audible soundFX and debug notifications |
 * | Retention  | {@link logMaxDays} | Rolling on-device TTL |
 *
 * @example
 * ```ts
 * BackgroundGeolocation.ready({
 *   logger: {
 *     debug: true,
 *     logLevel: BackgroundGeolocation.LogLevel.Verbose,
 *     logMaxDays: 7,
 *   }
 * });
 * ```
 *
 * ---
 *
 * ### Log levels
 *
 * Choose the level appropriate for your environment:
 *
 * | Level | Value | Description |
 * |-------|:-----:|-------------|
 * | {@link LogLevel.Off}     | 0 | Disable logging entirely |
 * | {@link LogLevel.Error}   | 1 | Failures and critical errors |
 * | {@link LogLevel.Warning} | 2 | Problems that may affect behaviour |
 * | {@link LogLevel.Info}    | 3 | Operational milestones (start/stop, HTTP, geofence state) |
 * | {@link LogLevel.Debug}   | 4 | Granular detail during integration |
 * | {@link LogLevel.Verbose} | 5 | Maximum detail; full introspection |
 *
 * Use `Verbose` during active development. Use `Info` or `Warning` in
 * production. Avoid `Off` unless required — logs are invaluable for field
 * diagnostics.
 *
 * ---
 *
 * ### Debug mode
 *
 * When {@link debug} is `true`, the SDK plays short, distinct soundFX as key
 * events occur — location recorded, motion change, geofence enter/exit/dwell,
 * HTTP upload — and may show transient developer notifications on Android to
 * visualize state transitions.
 *
 * ### ⚠️ Warning
 *
 * Never enable `debug` in a production build. Disable it before submitting
 * your app to the App Store or Google Play.
 *
 * ---
 *
 * ### Retention
 *
 * {@link logMaxDays} controls how long log entries remain on device. Entries
 * older than the configured limit are purged automatically on a rolling basis.
 *
 * Recommended values:
 * - Development: 5–7 days
 * - Production: 1–3 days
 *
 * ---
 *
 * ### Diagnostics
 *
 * Logs are your first resource when something unexpected happens. The SDK writes a
 * detailed trace of every lifecycle event — location recording, motion transitions,
 * HTTP uploads, geofence activity — to an internal SQLite database. When behaviour
 * is unclear, set `logLevel` to {@link LogLevel.Verbose} and fetch the log before
 * doing anything else:
 *
 * ```ts
 * await BackgroundGeolocation.setConfig({
 *   logger: { logLevel: BackgroundGeolocation.LogLevel.Verbose }
 * });
 * ```
 *
 * Use {@link Logger.emailLog} to send `logMaxDays` worth of logs as an email
 * attachment directly from the device:
 *
 * ```ts
 * await BackgroundGeolocation.logger.emailLog("you@example.com");
 * ```
 *
 * #### Android
 *
 * Stream live SDK output directly to your terminal with `adb`:
 *
 * ```bash
 * adb logcat *:S TSLocationManager:V
 * ```
 *
 * #### iOS
 *
 * Run the app from Xcode to stream SDK output to the console in real time. For
 * issues that only reproduce in the background, attach the device and monitor
 * the Xcode console while the app runs in the background.
 *
 * ---
 *
 * ### Migration
 *
 * Logging options previously lived at the root of `Config`. They are now grouped
 * under the `logger` key. Legacy flat keys remain available but are **deprecated**
 * and will be removed in a future major release.
 *
 * @example
 * ```ts
 * // Legacy (deprecated)
 * BackgroundGeolocation.ready({
 *   debug: true,
 *   logLevel: BackgroundGeolocation.LogLevel.Verbose,
 *   logMaxDays: 3,
 * });
 *
 * // Current
 * BackgroundGeolocation.ready({
 *   logger: {
 *     debug: true,
 *     logLevel: BackgroundGeolocation.LogLevel.Verbose,
 *     logMaxDays: 3,
 *   }
 * });
 * ```
 *
 * ---
 *
 * ### Examples
 *
 * @example Development profile
 * ```ts
 * BackgroundGeolocation.ready({
 *   logger: {
 *     debug: true,
 *     logLevel: BackgroundGeolocation.LogLevel.Verbose,
 *     logMaxDays: 7,
 *   }
 * });
 * ```
 *
 * @example Production profile
 * ```ts
 * BackgroundGeolocation.ready({
 *   logger: {
 *     debug: false,
 *     logLevel: BackgroundGeolocation.LogLevel.Info,
 *     logMaxDays: 3,
 *   }
 * });
 * ```
 *
 * @example Disable all logging
 * ```ts
 * BackgroundGeolocation.setConfig({
 *   logger: {
 *     logLevel: BackgroundGeolocation.LogLevel.Off,
 *   }
 * });
 * ```
 *
 * @category Config
 */
export interface LoggerConfig {
  /**
   * <!-- doc-id: LoggerConfig.debug -->
   * Enables audible soundFX and debug notifications during development.
   *
   * When `true`, the SDK plays a distinct sound for each key lifecycle event so
   * you can follow SDK activity without watching the console. It may also display
   * transient notifications on Android to visualize background state transitions.
   *
   * Defaults to `false`.
   *
   * #### iOS
   *
   * To hear debug sounds while the app is in the background, enable the
   * **Audio and AirPlay** background mode in Xcode under *Signing & Capabilities →
   * Background Modes*.
   *
   * #### Debug sound events
   *
   * | Event | iOS | Android |
   * |-------|-----|---------|
   * | `LOCATION_RECORDED` | <mediaplayer:https://dl.dropbox.com/s/yestzqdb6gzx7an/location-recorded.mp3?dl=0> | <mediaplayer:https://dl.dropboxusercontent.com/s/d3e821scn5fppq6/tslocationmanager_ooooiii3_full_vol.wav?dl=0> |
   * | `LOCATION_SAMPLE` | <mediaplayer:https://dl.dropbox.com/s/8gp2nkzza2hql4r/location-sample.mp3?dl=0> | <mediaplayer:https://dl.dropboxusercontent.com/s/8bgiyifowyf9c7n/tslocationmanager_click_tap_done_checkbox5_full_vol.wav?dl=0> |
   * | `LOCATION_ERROR` | <mediaplayer:https://dl.dropbox.com/s/l3rmf99rj3g5u6b/location-error.mp3?dl=0> | <mediaplayer:https://dl.dropboxusercontent.com/s/wadrz2x6elhc65l/tslocationmanager_digi_warn.mp3?dl=0> |
   * | `LOCATION_SERVICES_ON` | <mediaplayer:https://dl.dropbox.com/s/urbjiqn0f4g1jhi/location-services-on.mp3?dl=0> | n/a |
   * | `LOCATION_SERVICES_OFF` | <mediaplayer:https://dl.dropbox.com/s/0wb7qajfb0yy9w0/location-services-off.mp3?dl=0> | n/a |
   * | `STATIONARY_GEOFENCE_EXIT` | <mediaplayer:https://dl.dropbox.com/s/p8ee60qvfgx4vi5/motionchange-true.mp3?dl=0> | <mediaplayer:https://dl.dropboxusercontent.com/s/gjgv51pot3h2n3t/tslocationmanager_zap_fast.mp3?dl=0> |
   * | `MOTIONCHANGE_FALSE` | <mediaplayer:https://dl.dropbox.com/s/xk00hsfi87nrw3q/motionchange-false.mp3?dl=0> | <mediaplayer:https://dl.dropboxusercontent.com/s/fm4j2t8nqzd5856/tslocationmanager_marimba_drop.mp3?dl=0> |
   * | `MOTIONCHANGE_TRUE` | <mediaplayer:https://dl.dropbox.com/s/p8ee60qvfgx4vi5/motionchange-true.mp3?dl=0> | <mediaplayer:https://dl.dropboxusercontent.com/s/n5mn6tr7x994ivg/tslocationmanager_chime_short_chord_up.mp3?dl=0> |
   * | `MOTION_TRIGGER_DELAY_START` | n/a | <mediaplayer:https://dl.dropboxusercontent.com/s/cb3fa0zp0c4xjmt/tslocationmanager_dot_retry.wav?dl=0> |
   * | `MOTION_TRIGGER_DELAY_CANCEL` | n/a | <mediaplayer:https://dl.dropboxusercontent.com/s/4pg3r4xooi9pe0g/tslocationmanager_dot_stopaction2.wav?dl=0> |
   * | `STOP_DETECTION_DELAY_INITIATED` | <mediaplayer:https://dl.dropbox.com/s/y898zopjfolx42d/stopDetectionDelay.mp3?dl=0> | n/a |
   * | `STOP_TIMER_ON` | <mediaplayer:https://dl.dropbox.com/s/7mjcmnszhjo6ywj/stop-timeout-start.mp3?dl=0> | <mediaplayer:https://dl.dropboxusercontent.com/s/q4a9pf0vlztfafh/tslocationmanager_chime_bell_confirm.mp3?dl=0> |
   * | `STOP_TIMER_OFF` | <mediaplayer:https://dl.dropbox.com/s/qnsdu7b6vxic01i/stop-timeout-cancel.mp3?dl=0> | <mediaplayer:https://dl.dropboxusercontent.com/s/9o9v826was19lyi/tslocationmanager_bell_ding_pop.mp3?dl=0> |
   * | `HEARTBEAT` | <mediaplayer:https://dl.dropbox.com/s/90vyfo3woe52ijo/heartbeat.mp3?dl=0> | <mediaplayer:https://dl.dropboxusercontent.com/s/bsdtw21hscqqy67/tslocationmanager_peep_note1.wav?dl=0> |
   * | `GEOFENCE_ENTER` | <mediaplayer:https://dl.dropbox.com/s/h3047lybsggats7/geofence-enter.mp3?dl=0> | <mediaplayer:https://dl.dropboxusercontent.com/s/76up5ik215xwxh1/tslocationmanager_beep_trip_up_dry.mp3?dl=0> |
   * | `GEOFENCE_EXIT` | <mediaplayer:https://dl.dropbox.com/s/2e8bg22c6g9zwxr/geofence-exit.mp3?dl=0> | <mediaplayer:https://dl.dropboxusercontent.com/s/xuyyagffheyk8r7/tslocationmanager_beep_trip_dry.mp3?dl=0> |
   * | `GEOFENCE_DWELL_START` | <mediaplayer:https://dl.dropbox.com/s/7nysvyjxuxm9pms/geofence-dwell-start.mp3?dl=0> | n/a |
   * | `GEOFENCE_DWELL_CANCEL` | <mediaplayer:https://dl.dropbox.com/s/sk2hur6nxch1zvm/geofence-dwell-cancel.mp3?dl=0> | n/a |
   * | `GEOFENCE_DWELL` | `GEOFENCE_ENTER` after `GEOFENCE_DWELL_START` | <mediaplayer:https://dl.dropboxusercontent.com/s/uw5vjuatm3wnuid/tslocationmanager_beep_trip_up_echo.mp3?dl=0> |
   * | `ERROR` | <mediaplayer:https://dl.dropbox.com/s/h5b52m056pfc734/error.mp3?dl=0> | <mediaplayer:https://dl.dropboxusercontent.com/s/32e93c1t4kh69p1/tslocationmanager_music_timpani_error_01.mp3?dl=0> |
   * | `WARNING` | n/a | <mediaplayer:https://dl.dropboxusercontent.com/s/wadrz2x6elhc65l/tslocationmanager_digi_warn.mp3?dl=0> |
   * | `BACKGROUND_FETCH` | <mediaplayer:https://dl.dropbox.com/s/mcsjqye0xx2kapk/background-fetch.mp3?dl=0> | n/a |
   *
   * ### ⚠️ Warning
   *
   * Never enable `debug` in a production build.
   */
  debug?: boolean;

  /**
   * <!-- doc-id: LoggerConfig.logLevel -->
   * Controls the verbosity of the SDK's internal log.
   *
   * Defaults to {@link LogLevel.Off}. The log is stored in an internal SQLite
   * database and retained for {@link logMaxDays} days (default: `3`).
   *
   * | Level | Value | Description |
   * |-------|:-----:|-------------|
   * | {@link LogLevel.Off}     | 0 | Disable logging entirely |
   * | {@link LogLevel.Error}   | 1 | Failures and critical errors |
   * | {@link LogLevel.Warning} | 2 | Problems that may affect behaviour |
   * | {@link LogLevel.Info}    | 3 | Operational milestones (start/stop, HTTP, geofence state) |
   * | {@link LogLevel.Debug}   | 4 | Granular detail during integration |
   * | {@link LogLevel.Verbose} | 5 | Maximum detail; full introspection |
   *
   * Example log output:
   *
   * ```text
   * 09-19 11:12:18.716 ╔═════════════════════════════════════════════
   * 09-19 11:12:18.716 ║ BackgroundGeolocation Service started
   * 09-19 11:12:18.716 ╠═════════════════════════════════════════════
   * 09-19 11:12:18.723   ✅  Started in foreground
   * 09-19 11:12:18.737   🎾  Start activity updates: 10000
   * 09-19 11:12:18.778   🔵  setPace: null → false
   * 09-19 11:12:21.405   ✅  INSERT: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
   * 09-19 11:12:21.446   ✅  Locked 1 records
   * 09-19 11:12:21.454   🔵  HTTP POST: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
   * 09-19 11:12:22.083   🔵  Response: 200
   * 09-19 11:12:22.100   ✅  DESTROY: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
   * ```
   *
   * ### ⚠️ Warning
   *
   * Set `logLevel` to {@link LogLevel.Error} or lower before submitting to
   * production. At `Verbose`, logs can grow to several megabytes over
   * {@link logMaxDays} days.
   *
   * **See also**
   * - {@link logMaxDays}
   * - {@link Logger.getLog}
   * - {@link Logger.emailLog}
   * - {@link Logger.destroyLog}
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   logger: {
   *     logLevel: BackgroundGeolocation.LogLevel.Verbose
   *   },
   * });
   * ```
   */
  logLevel?: LogLevel;

  /**
   * <!-- doc-id: LoggerConfig.logMaxDays -->
   * Number of days to retain log entries in the internal SQLite database.
   *
   * Defaults to `3` days. Entries older than this limit are purged automatically
   * on a rolling basis.
   *
   * **See also**
   * - {@link logLevel}
   * - {@link Logger.emailLog}
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   logger: {
   *     logMaxDays: 3
   *   }
   * });
   * ```
   */
  logMaxDays?: number;
}

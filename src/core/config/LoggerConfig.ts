import { LogLevel } from '../../enums/LogLevel';

/**
 * Logging & diagnostics configuration.
 *
 * The **{@link LoggerConfig}** group controls diagnostic logging for the SDK.
 * Use it to adjust how much information is written to the internal log,
 * whether to enable developer-friendly debug aids (soundFX, notifications),
 * and how long logs are retained on the device.
 *
 * __Configure via:__ `config.logger`
 *
 * @example
 * ```ts
 * BackgroundGeolocation.ready({
 *   logger: {
 *     debug: true,
 *     logLevel: LogLevel.Verbose,
 *     logMaxDays: 7,
 *   }
 * });
 * ```
 *
 * __Overview__
 *
 * Logging serves two major purposes:
 *
 * 1. **Development & QA**  
 *    High-verbosity logs and optional audible soundFX make debugging intuitive.
 *    You can hear when locations are recorded, when motion changes occur, and
 *    when geofences trigger — without watching the console.
 *
 * 2. **Production diagnostics**  
 *    Lower verbosity preserves essential operational traces without excessive
 *    storage use or privacy impact.
 *
 * **See also:** {@link Config.logger}
 *
 * | Area        | Keys                                      | Notes |
 * |-------------|--------------------------------------------|-------|
 * | Verbosity   | {@link logLevel}              | off → verbose |
 * | Debug aids  | {@link debug}                 | Enables audible soundFX & debug indicators |
 * | Retention   | {@link logMaxDays}            | Rolling on-device TTL |
 *
 * __Log Levels__
 *
 * Choose the level appropriate for your environment:
 *
 * | Level       | Value | Description |
 * |-------------|:-----:|-------------|
 * | {@link LogLevel.Off}         |  0    | Disable logging entirely |
 * | {@link LogLevel.Error}       |  1    | Failures & critical errors |
 * | {@link LogLevel.Warning}     |  2    | Problems that may affect behavior |
 * | {@link LogLevel.Info}        |  3    | Operational milestones (start/stop, HTTP, geofence state) |
 * | {@link LogLevel.Debug}       |  4    | Granular detail during integration |
 * | {@link LogLevel.Verbose}     |  5    | Maximum detail; full introspection |
 *
 * SoundFX and debug indicators require {@link debug} = `true`.
 *
 * __Debug Behavior__
 *
 * When `debug: true`, the SDK plays short, distinct soundFX when key events occur:
 *
 * - Location recorded  
 * - Location error  
 * - `onMotionChange` transitions  
 * - Geofence enter / exit / dwell  
 *
 * It may also show temporary developer notifications (Android) to visualize state
 * transitions and background operation.
 *
 * ⚠️ **Never enable `debug` in production.**
 *
 * __Retention__
 *
 * Use {@link logMaxDays} to control how long logs remain on device.
 * Old entries are purged automatically on a rolling basis.
 *
 * Recommended:
 * - Development: 5–7 days  
 * - Production: 1–3 days  
 *
 * __Retrieving Logs__
 *
 * ```ts
 * // Retrieve full log as a string
 * const log = await BackgroundGeolocation.logger.getLog({});
 *
 * // Email the log as an attachment
 * await BackgroundGeolocation.logger.emailLog("support@yourcompany.com");
 * ```
 *
 * Logs include:
 * - SQLite-backed diagnostic history  
 * - Event traces  
 * - HTTP upload events  
 * - Configuration transitions  
 *
 * **See also:** {@link logMaxDays}, {@link logLevel}
 *
 * __Examples__
 *
 * @example Development profile (maximum visibility)
 * ```ts
 * BackgroundGeolocation.ready({
 *   logger: {
 *     debug: true,
 *     logLevel: LogLevel.Verbose,
 *     logMaxDays: 7,
 *   }
 * });
 * ```
 * 
 * @example Production profile (quiet & conservative)
 * ```ts
 * BackgroundGeolocation.ready({
 *   logger: {
 *     debug: false,
 *     logLevel: LogLevel.Info,
 *     logMaxDays: 3,
 *   }
 * });
 * ```
 *
 * @example Disable all logging
 * ```ts
 * BackgroundGeolocation.setConfig({
 *   logger: {
 *     logLevel: LogLevel.Off,
 *   }
 * });
 * ```
 *
 * __Migration from legacy flat Config__
 *
 * @example Legacy flat Config
 * ```ts
 * Config({
 *   debug: true,
 *   logLevel: LogLevel.Verbose,
 *   logMaxDays: 3,
 * });
 * ```
 *
 * @example New compound Config
 * ```ts
 * Config({
 *   logger: {
 *     debug: true,
 *     logLevel: LogLevel.Verbose,
 *     logMaxDays: 3,
 *   }
 * });
 * ```
 *
 * Legacy keys are still supported (deprecated), but the compound form is recommended.
 *
 * __Recommendations__
 *
 * - Use `Verbose` + `debug: true` during active development.  
 * - Use `Info` or `Warning` in production.  
 * - Do not set `Off` unless required — logs are invaluable for field diagnostics.
 *
 * @category Config
 */
export interface LoggerConfig {
  /**
  * Configure the plugin to emit sound effects and local-notifications during development.
  *
  * Defaults to **`false`**.  When set to **`true`**, the plugin will emit debugging sounds and notifications for life-cycle events of [[BackgroundGeolocation | BackgroundGeolocation]].
  *
  * ## iOS
  *
  * In you wish to hear debug sounds in the background, you must manually enable the background-mode:
  *
  * **`[x] Audio and Airplay`** background mode in *Background Capabilities* of XCode.
  *
  * ![](https://dl.dropboxusercontent.com/s/fl7exx3g8whot9f/enable-background-audio.png?dl=1)
  *
  * ## Event Debug Sound Effects
  *
  * | Event                      | iOS                     | Android                    |
  * |----------------------------|-------------------------|----------------------------|
  * | `LOCATION_RECORDED`        | <mediaplayer:https://dl.dropbox.com/s/yestzqdb6gzx7an/location-recorded.mp3?dl=0>        | <mediaplayer:https://dl.dropboxusercontent.com/s/d3e821scn5fppq6/tslocationmanager_ooooiii3_full_vol.wav?dl=0>      |
  * | `LOCATION_SAMPLE`          | <mediaplayer:https://dl.dropbox.com/s/8gp2nkzza2hql4r/location-sample.mp3?dl=0>          | <mediaplayer:https://dl.dropboxusercontent.com/s/8bgiyifowyf9c7n/tslocationmanager_click_tap_done_checkbox5_full_vol.wav?dl=0> |
  * | `LOCATION_ERROR`           | <mediaplayer:https://dl.dropbox.com/s/l3rmf99rj3g5u6b/location-error.mp3?dl=0>           | <mediaplayer:https://dl.dropboxusercontent.com/s/wadrz2x6elhc65l/tslocationmanager_digi_warn.mp3?dl=0>                         |
  * | `LOCATION_SERVICES_ON`     | <mediaplayer:https://dl.dropbox.com/s/urbjiqn0f4g1jhi/location-services-on.mp3?dl=0>     | n/a                                                                                                                 |
  * | `LOCATION_SERVICES_OFF`    | <mediaplayer:https://dl.dropbox.com/s/0wb7qajfb0yy9w0/location-services-off.mp3?dl=0>    | n/a                                                                                                                 |
  * | `STATIONARY_GEOFENCE_EXIT` | <mediaplayer:https://dl.dropbox.com/s/p8ee60qvfgx4vi5/motionchange-true.mp3?dl=0>        | <mediaplayer:https://dl.dropboxusercontent.com/s/gjgv51pot3h2n3t/tslocationmanager_zap_fast.mp3?dl=0>                          |
  * | `MOTIONCHANGE_FALSE`       | <mediaplayer:https://dl.dropbox.com/s/xk00hsfi87nrw3q/motionchange-false.mp3?dl=0>       | <mediaplayer:https://dl.dropboxusercontent.com/s/fm4j2t8nqzd5856/tslocationmanager_marimba_drop.mp3?dl=0>                      |
  * | `MOTIONCHANGE_TRUE`        | <mediaplayer:https://dl.dropbox.com/s/p8ee60qvfgx4vi5/motionchange-true.mp3?dl=0>        | <mediaplayer:https://dl.dropboxusercontent.com/s/n5mn6tr7x994ivg/tslocationmanager_chime_short_chord_up.mp3?dl=0>              |
  * | `MOTION_TRIGGER_DELAY_START` | n/a | <mediaplayer:https://dl.dropboxusercontent.com/s/cb3fa0zp0c4xjmt/tslocationmanager_dot_retry.wav?dl=0>                                                                                                            |
  * | `MOTION_TRIGGER_DELAY_CANCEL`| n/a | <mediaplayer:https://dl.dropboxusercontent.com/s/4pg3r4xooi9pe0g/tslocationmanager_dot_stopaction2.wav?dl=0>                                                                                                      |
  * | `STOP_DETECTION_DELAY_INITIATED` | <mediaplayer:https://dl.dropbox.com/s/y898zopjfolx42d/stopDetectionDelay.mp3?dl=0> | n/a                                                                                                                 |
  * | `STOP_TIMER_ON`            | <mediaplayer:https://dl.dropbox.com/s/7mjcmnszhjo6ywj/stop-timeout-start.mp3?dl=0>       | <mediaplayer:https://dl.dropboxusercontent.com/s/q4a9pf0vlztfafh/tslocationmanager_chime_bell_confirm.mp3?dl=0>                |
  * | `STOP_TIMER_OFF`           | <mediaplayer:https://dl.dropbox.com/s/qnsdu7b6vxic01i/stop-timeout-cancel.mp3?dl=0>      | <mediaplayer:https://dl.dropboxusercontent.com/s/9o9v826was19lyi/tslocationmanager_bell_ding_pop.mp3?dl=0>                     |
  * | `HEARTBEAT`                | <mediaplayer:https://dl.dropbox.com/s/90vyfo3woe52ijo/heartbeat.mp3?dl=0>                | <mediaplayer:https://dl.dropboxusercontent.com/s/bsdtw21hscqqy67/tslocationmanager_peep_note1.wav?dl=0>                        |
  * | `GEOFENCE_ENTER`           | <mediaplayer:https://dl.dropbox.com/s/h3047lybsggats7/geofence-enter.mp3?dl=0>           | <mediaplayer:https://dl.dropboxusercontent.com/s/76up5ik215xwxh1/tslocationmanager_beep_trip_up_dry.mp3?dl=0>                  |
  * | `GEOFENCE_EXIT`            | <mediaplayer:https://dl.dropbox.com/s/2e8bg22c6g9zwxr/geofence-exit.mp3?dl=0>            | <mediaplayer:https://dl.dropboxusercontent.com/s/xuyyagffheyk8r7/tslocationmanager_beep_trip_dry.mp3?dl=0>                     |
  * | `GEOFENCE_DWELL_START`     | <mediaplayer:https://dl.dropbox.com/s/7nysvyjxuxm9pms/geofence-dwell-start.mp3?dl=0>     | n/a                                                                                                                 |
  * | `GEOFENCE_DWELL_CANCEL`    | <mediaplayer:https://dl.dropbox.com/s/sk2hur6nxch1zvm/geofence-dwell-cancel.mp3?dl=0>    | n/a                                                                                                                 |
  * | `GEOFENCE_DWELL`           | `GEOFENCE_ENTER` after `GEOFENCE_DWELL_START`                                            | <mediaplayer:https://dl.dropboxusercontent.com/s/uw5vjuatm3wnuid/tslocationmanager_beep_trip_up_echo.mp3?dl=0>                 |
  * | `ERROR`                    | <mediaplayer:https://dl.dropbox.com/s/h5b52m056pfc734/error.mp3?dl=0>                    | <mediaplayer:https://dl.dropboxusercontent.com/s/32e93c1t4kh69p1/tslocationmanager_music_timpani_error_01.mp3?dl=0>            |
  * | `WARNING`                  | n/a                                                                                      | <mediaplayer:https://dl.dropboxusercontent.com/s/wadrz2x6elhc65l/tslocationmanager_digi_warn.mp3?dl=0>                         |
  * | `BACKGROUND_FETCH`         | <mediaplayer:https://dl.dropbox.com/s/mcsjqye0xx2kapk/background-fetch.mp3?dl=0>         | n/a                                                                                                                 |
  *
  */
  debug?: boolean;
  /**
   * Controls the volume of recorded events in the plugin's logging database.
   *
   * {@link BackgroundGeolocation} contains powerful logging features. By default,
   * the plugin starts with {@link LogLevel.Off},
   * storing {@link LoggerConfig.logMaxDays | logMaxDays} days worth of logs in its
   * internal SQLite database (default: `3`).
   *
   * The following log levels are defined as constants on {@link BackgroundGeolocation}:
   *
   * | Label                   | Value                              |
   * |-------------------------|------------------------------------|
   * | {@link LogLevel.Off}   | `0` |
   * | {@link LogLevel.Error} | `1` |
   * | {@link LogLevel.Warning} | `2` |
   * | {@link LogLevel.Info}  | `3` |
   * | {@link LogLevel.Debug} | `4` |
   * | {@link LogLevel.Verbose} | `5` |
   *
   * __Example log data__
   *
   * ```text
   * 09-19 11:12:18.716 ╔═════════════════════════════════════════════
   * 09-19 11:12:18.716 ║ BackgroundGeolocation Service started
   * 09-19 11:12:18.716 ╠═════════════════════════════════════════════
   * 09-19 11:12:18.723 [c.t.l.BackgroundGeolocationService d]
   * 09-19 11:12:18.723   ✅  Started in foreground
   * 09-19 11:12:18.737 [c.t.l.ActivityRecognitionService a]
   * 09-19 11:12:18.737   🎾  Start activity updates: 10000
   * 09-19 11:12:18.761 [c.t.l.BackgroundGeolocationService k]
   * 09-19 11:12:18.761   🔴  Stop heartbeat
   * 09-19 11:12:18.768 [c.t.l.BackgroundGeolocationService a]
   * 09-19 11:12:18.768   🎾  Start heartbeat (60)
   * 09-19 11:12:18.778 [c.t.l.BackgroundGeolocationService a]
   * 09-19 11:12:18.778   🔵  setPace: null → false
   * 09-19 11:12:18.781 [c.t.l.adapter.TSConfig c] ℹ️   Persist config
   * 09-19 11:12:18.794 [c.t.locationmanager.util.b a]
   * 09-19 11:12:18.794   ℹ️  LocationAuthorization: Permission granted
   * 09-19 11:12:18.842 [c.t.l.http.HttpService flush]
   * 09-19 11:12:18.842 ╔═════════════════════════════════════════════
   * 09-19 11:12:18.842 ║ HTTP Service
   * 09-19 11:12:18.842 ╠═════════════════════════════════════════════
   * 09-19 11:12:19.000 [c.t.l.BackgroundGeolocationService onActivityRecognitionResult] still (100%)
   * 09-19 11:12:21.314 [c.t.l.l.SingleLocationRequest$2 onLocationResult]
   * 09-19 11:12:21.314 ╔═════════════════════════════════════════════
   * 09-19 11:12:21.314 ║ SingleLocationRequest: 1
   * 09-19 11:12:21.314 ╠═════════════════════════════════════════════
   * 09-19 11:12:21.314 ╟─ 📍  Location[fused 45.519239,-73.617058 hAcc=15]999923706055 vAcc=2 sAcc=??? bAcc=???
   * 09-19 11:12:21.327 [c.t.l.l.TSLocationManager onSingleLocationResult]
   * 09-19 11:12:21.327   🔵  Acquired motionchange position, isMoving: false
   * 09-19 11:12:21.342 [c.t.l.l.TSLocationManager a] 15.243
   * 09-19 11:12:21.405 [c.t.locationmanager.data.a.c persist]
   * 09-19 11:12:21.405   ✅  INSERT: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
   * 09-19 11:12:21.423 [c.t.l.http.HttpService flush]
   * 09-19 11:12:21.423 ╔═════════════════════════════════════════════
   * 09-19 11:12:21.423 ║ HTTP Service
   * 09-19 11:12:21.423 ╠═════════════════════════════════════════════
   * 09-19 11:12:21.446 [c.t.locationmanager.data.a.c first]
   * 09-19 11:12:21.446   ✅  Locked 1 records
   * 09-19 11:12:21.454 [c.t.l.http.HttpService a]
   * 09-19 11:12:21.454   🔵  HTTP POST: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
   * 09-19 11:12:22.083 [c.t.l.http.HttpService$a onResponse]
   * 09-19 11:12:22.083   🔵  Response: 200
   * 09-19 11:12:22.100 [c.t.locationmanager.data.a.c destroy]
   * 09-19 11:12:22.100   ✅  DESTROY: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
   * 09-19 11:12:55.226 [c.t.l.BackgroundGeolocationService onActivityRecognitionResult] still (100%)
   * ```
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   logger: {
   *     logLevel: LogLevel.Verbose
   *   },
   * });
   * ```
   *
   * __See also__
   * - {@link logMaxDays}
   * - {@link Logger.getLog}
   * - {@link Logger.emailLog}
   * - {@link Logger.destroyLog}
   *
   * __⚠️ Warning__
   * When submitting your app to production, configure `logLevel` appropriately
   * (for example, {@link LogLevel.Error}),
   * since logs can grow to several megabytes over {@link LoggerConfig.logMaxDays | logMaxDays}.
   *
   */
  logLevel?: LogLevel;

  /**
   * Maximum number of days to persist a log-entry in database.
   *
   * Defaults to **`3`** days.
   * 
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   logger: {
   *     logMaxDays: 3
   *   }
   * });
   * ```
   *  **See also:**
   * - {@link logLevel}
   */
  logMaxDays?: number;
}
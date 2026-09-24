# CHANGELOG

## 5.3.4 &mdash; 2026-09-24
* [Fixed] Add `Event.NotificationAction` (`'notificationaction'`). React Native 5.0.0 and later subscribe `onNotificationAction()` through this key, and without it the call threw *"BackgroundGeolocation#on must be provided a {String} event as 1st argument."* This affects every React Native 5.x release, and each depends on this package with a caret range, so updating this package fixes an installed app without a React Native upgrade: `npm update @transistorsoft/background-geolocation-types`.
* [Fixed] `HeadlessEvent.name` includes `'locationerror'`, which Android delivers to a headless task. It also includes `'notificationaction'` through the key above. A `case` on either name in a strictly typed headless task failed to compile with *TS2678*.
* [Deprecated] `Event.Notification` (`'notification'`) — no SDK has ever emitted it. Use `Event.NotificationAction`.

## 5.3.3 &mdash; 2026-09-23
* [Fixed] `startSchedule()` and `stopSchedule()` declare `Promise<State>`, the value every SDK has always resolved — React Native, Capacitor and Flutter on both platforms, Cordova on iOS — and the one the `startSchedule` example three lines above the declaration already read. `Promise<void>` first appeared in 5.0.0 and matched no SDK. Nothing needs changing unless your code assigned the awaited value; the `stopSchedule` example now reads `state.enabled` from the resolution instead of a second `getState()`. (WO-036)
* [Fixed] `reset()` declares its `Config` optional, matching the documented example and every SDK — React Native, Cordova, Capacitor and Flutter all default it. TypeScript apps calling `BackgroundGeolocation.reset()` failed to compile with *"Expected 1 arguments, but got 0"*.
* [Fixed] `destroyLocations()` and `destroyLocation()` declare `Promise<boolean>` — they resolve `true`, as React Native and Flutter always have and as the four geofence mutators already declare. `Promise<void>` matched only Capacitor and Cordova, which resolved nothing; both now resolve `true` as well, so every mutator answers the same way on every SDK. Nothing needs changing in your code. (WO-028)
* [Changed] `setOdometer()` and `resetOdometer()` declare `Promise<Location>` — the location the SDK records at the moment the odometer is set, which is what every SDK has always resolved and what the documented examples always named `location`; only the TypeScript line said `number`. While tracking is disabled no fix is acquired and the resolved `Location` is synthetic: the new odometer value, a timestamp and a `uuid`, with zeroed `coords` (documented on both methods). (WO-035)
* [Deprecated] `resetOdometer()` — an alias for `setOdometer(0)` in every SDK that has it; the Dart API never had it. (WO-035)
* [Deprecated] `setLogLevel()` — removed from the documentation. The log level is a configuration value like any other: `setConfig({logger: {logLevel}})` or `ready()`. The declaration stays for the one SDK that implements it. (WO-035)

## 5.3.2 &mdash; 2026-09-04
* [Fixed] Declare the `Permission` enum static on the `BackgroundGeolocation` interface. `Permission` shipped in 5.3.0 as a named export, but the class-static access path — `BackgroundGeolocation.Permission.Location`, which the SDKs document and which mirrors the other 15 enum statics — was missing from the interface, so it failed to compile with `TS2339: Property 'Permission' does not exist on type 'BackgroundGeolocation'`. (WO-007)

## 5.3.1 &mdash; 2026-09-04
* [Docs] `AuthorizationStatus.DeniedAlways` is reported by **both** platforms (WO-014): iOS motion denial is one-shot and immediately permanent — `requestPermission(Permission.Motion)` rejects with `DeniedAlways`, never plain `Denied`. Previously documented as Android-only, with iOS said to reject `Denied`. Cross-platform `status === AuthorizationStatus.DeniedAlways` is now the single route-to-Settings test.
* [Docs] The iOS motion rejection can also carry `Restricted` (system-wide Fitness Tracking is off or the hardware is absent — deliberately not remapped; not recoverable from the app's own Settings page) or `NotDetermined` (no dialog could be shown, e.g. the app was backgrounded).
* [Docs] The no-argument `requestPermission()` skips the motion step when `ActivityConfig.disableMotionActivityUpdates` is `true` — and, on iOS, when `NSMotionUsageDescription` is absent from `Info.plist`.

## 5.3.0 &mdash; 2026-08-31
* Add `Permission` enum (`Permission.Location` / `Permission.Motion`) and an optional parameter to `requestPermission(permission?)` — request location and motion separately, each independently awaitable, instead of the all-at-once dialog storm. The no-argument form is unchanged (backward compatible). (WO-007)
* Add `AuthorizationStatus.DeniedAlways` (5) — the motion permission was permanently denied on Android (two user denials); only the device's app-settings screen can restore it. iOS reports plain `Denied`, where denial is always permanent. (WO-007)
* Rewrite the `requestPermission` documentation: the per-permission contract, the serialized-dialog guarantee, and the platform-specific denial semantics.

## 5.2.2 &mdash; 2026-07-23
* Document `insertLocation` and correct its contract. The method is now public (previously `@hidden`), accepts the new `LocationInput` type, and resolves with the inserted record's `uuid` — `Promise<string>` (previously `Promise<Location>`, which no platform ever returned). An explicit `insertLocation` always writes to the database, bypassing `PersistenceConfig.persistMode`.
* Add `LocationInput` type — the record accepted by `insertLocation`. Only `coords.latitude` and `coords.longitude` are required; `timestamp` and `uuid` are optional (a missing `timestamp` defaults to the current time), and any additional fields are stored verbatim.

## 5.2.1 &mdash; 2026-07-12
* Add `getLocations(query?: LocationQuery)` — pass an optional query to page through a large locations table by `limit` / `offset` / `page` (0-indexed sugar over `offset`) and sort `order`, instead of materialising every record in a single call. The no-arg `getLocations()` is unchanged (backward compatible).
* Add `LocationQuery` type (`limit`, `offset`, `page`, `order`) — distinct from the log-query `SQLQuery`.

## 5.2.0 &mdash; 2026-06-22
* Add `onLocationFilter` event — fires when the tracking location-filter **rejects** a location. Adds `LocationFilterEvent` (`location`, `reason`, `accuracy`, `trackingAccuracyThreshold`) and the `LocationFilterReason` enum (`low-accuracy` | `implied-speed` | `outlier-capped`); registered via `BackgroundGeolocation.onLocationFilter(callback)`.
* Document `LocationFilter` policy scope — which fields the `policy` governs versus the policy-independent fields (eg `trackingAccuracyThreshold` rejects under *every* policy, including `PassThrough`).
* Fix `LocationFilterPolicy` documented default — `Conservative` (was incorrectly `Adjust`).

## 5.1.2 &mdash; 2026-06-11
* Add `LocationFilter.odometerPolicy`

## 5.1.1 &mdash; 2026-04-10
* Widen `Location.timestamp` type to `string | number` to reflect `timestampFormat` setting.
* Add `Location.recorded_at` (`string | number`).

## 5.1.0 &mdash; 2026-04-09
* Add `PersistenceConfig.timestampFormat` [`iso` (default) | `epoch` (unix epoch)].

## 5.0.2 &mdash; 2026-02-10
* Fix bugs in example blocks.
* Annotate all example blocks with `@example` tag.

## 5.0.1 &mdash; 2026-01-19
* Add `playSound` method

## 5.0.0 &mdash; 2025-11-01
* Initial release


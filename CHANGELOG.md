# CHANGELOG

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


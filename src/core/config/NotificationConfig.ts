import { NotificationPriority } from '../../enums/NotificationPriority';

/**
 * <!-- doc-id: NotificationConfig -->
 * Foreground service notification configuration for the background geolocation SDK. [Android only]
 *
 * Android requires a persistent notification whenever the SDK runs its foreground
 * service. `NotificationConfig` controls that notification's content, appearance,
 * and behaviour while tracking is active.
 *
 * ![](https://dl.dropbox.com/s/acuhy5cu4p7uofr/android-foreground-service-default.png?dl=1)
 *
 * ### Contents
 * - [Overview](#overview)
 * - [Custom layout](#custom-layout)
 *
 * ---
 *
 * ### Overview
 *
 * Configure this via {@link NotificationConfig} on {@link AppConfig.notification}.
 *
 * | Area | Keys | Notes |
 * |------|------|-------|
 * | **Content** | `title`, `text`, `color` | Notification text and accent color. |
 * | **Icons** | `smallIcon`, `largeIcon` | Resource references in `type/name` format. |
 * | **Channel** | `channelName`, `channelId` | Android O+ notification channel settings. |
 * | **Behaviour** | `sticky`, `priority` | Persistence and ordering. |
 * | **Custom layout** | `layout`, `strings`, `actions` | Custom XML layout with text fields and buttons. |
 *
 * @example
 * ```ts
 * BackgroundGeolocation.ready({
 *   app: {
 *     notification: {
 *       title: "The Title",
 *       text: "The Text"
 *     }
 *   }
 * });
 *
 * // Update notification fields at runtime.
 * // Only changed keys must be provided; existing values persist.
 * BackgroundGeolocation.setConfig({
 *   app: {
 *     notification: {
 *       title: "The New Title",
 *     }
 *   }
 * });
 * ```
 *
 * ---
 *
 * ### Custom layout
 *
 * Supply a custom Android Layout XML file via {@link NotificationConfig.layout} for
 * complete control over the notification appearance.
 *
 * See the [Android Custom Notification Layout](github:wiki/Android-Custom-Notification-Layout)
 * guide for full setup instructions.
 *
 * @category Config
 */
export interface NotificationConfig {
  /**
   * <!-- doc-id: NotificationConfig.priority -->
   * Controls the position and visibility of the foreground notification in the system
   * shade. Defaults to `PRIORITY_LOW` (`-1`).
   *
   * `priority` affects both the ordering of the notification in the notification shade
   * and the position/visibility of the small status-bar icon.
   *
   * | Value | Description |
   * |-------|-------------|
   * | {@link NotificationPriority.Default} | Weighted toward the top; status-bar icon left-aligned. |
   * | {@link NotificationPriority.High} | Strongly weighted to the top; icon strongly left-aligned. |
   * | {@link NotificationPriority.Low} | Weighted toward the bottom; icon right-aligned. |
   * | {@link NotificationPriority.Max} | Equivalent to `NOTIFICATION_PRIORITY_HIGH`. |
   * | {@link NotificationPriority.Min} | Strongly weighted to the bottom; icon hidden. |
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       priority: NotificationPriority.High
   *     }
   *   }
   * });
   * ```
   */
  priority?: NotificationPriority;

  /**
   * <!-- doc-id: NotificationConfig.sticky -->
   * Keeps the foreground service notification visible at all times, regardless of
   * motion state. Defaults to `false`.
   *
   * By default the notification is shown only while the SDK detects the device is
   * moving. Set to `true` to show the notification continuously — for example, when
   * full transparency to users is a requirement.
   */
  sticky?: boolean;

  /**
   * <!-- doc-id: NotificationConfig.title -->
   * Title of the foreground service notification. Defaults to `"Background Geolocation"`.
   */
  title?: string;

  /**
   * <!-- doc-id: NotificationConfig.text -->
   * Body text of the foreground service notification. Defaults to `"Tracking location"`.
   */
  text?: string;

  /**
   * <!-- doc-id: NotificationConfig.color -->
   * Accent color of the notification icon. Not set by default.
   *
   * Applies to API level 21 and above. Supported formats:
   * - `#RRGGBB`
   * - `#AARRGGBB`
   */
  color?: string;

  /**
   * <!-- doc-id: NotificationConfig.smallIcon -->
   * Small status-bar icon for the foreground notification. Defaults to
   * `"mipmap/ic_launcher"` (the app launcher icon).
   *
   * ### ⚠️ Warning
   * - Specify the resource **type** (`drawable` or `mipmap`) followed by the icon
   *   name in the format `type/icon_name`.
   * - Do not include the file extension (e.g. `.png`).
   *
   * **See also**
   * - {@link largeIcon}
   *
   * @example
   * ```ts
   * // drawable resource
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       smallIcon: "drawable/my_notification_icon"
   *     }
   *   }
   * });
   *
   * // mipmap resource
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       smallIcon: "mipmap/my_notification_icon"
   *     }
   *   }
   * });
   * ```
   */
  smallIcon?: string;

  /**
   * <!-- doc-id: NotificationConfig.largeIcon -->
   * Large icon for the foreground notification. Not set by default.
   *
   * ### ⚠️ Warning
   * - Specify the resource **type** (`drawable` or `mipmap`) followed by the icon
   *   name in the format `type/icon_name`.
   * - Do not include the file extension (e.g. `.png`).
   *
   * **See also**
   * - {@link smallIcon}
   *
   * @example
   * ```ts
   * // drawable resource
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       largeIcon: "drawable/my_notification_large_icon"
   *     }
   *   }
   * });
   *
   * // mipmap resource
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       largeIcon: "mipmap/my_notification_large_icon"
   *     }
   *   }
   * });
   * ```
   */
  largeIcon?: string;

  /**
   * <!-- doc-id: NotificationConfig.layout -->
   * Name of a custom Android Layout XML file for the foreground notification.
   *
   * **See also**
   * - [Android Custom Notification Layout](github:wiki/Android-Custom-Notification-Layout)
   *
   * ![](https://dl.dropbox.com/s/whcb6q1gxxdk9t1/android-foreground-notification-transistor.png?dl=1)
   *
   * Custom layouts support `<TextView />`, `<ImageView />`, and `<Button />` elements.
   * All `android:id` values must be prefixed with `notification`
   * (e.g. `notificationText`, `notificationTitle`). The one exception is
   * `applicationName`, which the SDK populates with the app name automatically.
   *
   * #### Layout special elements
   *
   * When rendering a custom notification, the SDK searches for the following IDs and
   * populates them from the associated data source:
   *
   * | Layout element `android:id` | Data source |
   * |-----------------------------|-------------|
   * | `applicationName` | Application name from AndroidManifest |
   * | `notificationTitle` | {@link title} |
   * | `notificationText` | {@link text} |
   * | `notificationSmallIcon` | {@link smallIcon} |
   * | `notificationLargeIcon` | {@link largeIcon} |
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       layout: "my_notification_layout",
   *       title: "The Notification Title",
   *       text: "The Notification Text",
   *       smallIcon: "mipmap/my_small_icon",
   *       largeIcon: "mipmap/my_large_icon"
   *     }
   *   }
   * });
   * ```
   *
   * #### Custom `<TextView />` elements
   *
   * You may define your own custom text fields and populate them using
   * {@link strings}.
   *
   * @example
   * ```xml
   * <TextView
   *   android:id="@+id/myCustomElement"
   *   android:layout_width="match_parent"
   *   android:layout_height="wrap_content"
   *   android:text="notificationTitle" />
   * ```
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       strings: {
   *         myCustomElement: "My Custom Element Text"
   *       }
   *     }
   *   }
   * });
   * ```
   *
   * #### Custom `<Button />` elements
   *
   * Define your own buttons and register click listeners using
   * {@link actions}.
   *
   * @example
   * ```xml
   * <Button
   *   android:id="@+id/notificationButtonFoo"
   *   style="@style/Widget.AppCompat.Button.Small"
   *   android:layout_width="60dp"
   *   android:layout_height="40dp"
   *   android:text="Foo" />
   * ```
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       actions: [
   *         "notificationButtonFoo",
   *         "notificationButtonBar"
   *       ]
   *     }
   *   }
   * });
   *
   * BackgroundGeolocation.onNotificationAction((buttonId) => {
   *   console.log("[onNotificationAction]", buttonId);
   *   switch (buttonId) {
   *     case "notificationButtonFoo":
   *       break;
   *     case "notificationButtonBar":
   *       break;
   *   }
   * });
   * ```
   *
   * #### Sample layout
   *
   * ```xml
   * <?xml version="1.0" encoding="utf-8"?>
   * <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
   *     xmlns:tools="http://schemas.android.com/tools"
   *     android:layout_width="match_parent"
   *     android:layout_height="135dp"
   *     android:gravity="start"
   *     android:orientation="vertical"
   *     android:padding="15dp">
   *
   *     <LinearLayout
   *         android:layout_width="match_parent"
   *         android:layout_height="wrap_content"
   *         android:layout_marginBottom="15dp"
   *         android:gravity="center"
   *         android:orientation="horizontal">
   *
   *         <ImageView
   *             android:id="@+id/notificationSmallIcon"
   *             android:layout_width="16dp"
   *             android:layout_height="16dp"
   *             android:tint="@android:color/background_dark"
   *             tools:srcCompat="@tools:sample/avatars" />
   *
   *         <TextView
   *             android:id="@+id/applicationName"
   *             android:layout_width="match_parent"
   *             android:layout_height="match_parent"
   *             android:paddingLeft="10dp"
   *             android:text="applicationName"
   *             android:textAppearance="@style/TextAppearance.Compat.Notification.Title"
   *             android:textColor="#888888"
   *             android:textSize="12sp" />
   *     </LinearLayout>
   *
   *     <TextView
   *         android:id="@+id/notificationTitle"
   *         style="@style/TextAppearance.Compat.Notification.Title"
   *         android:layout_width="match_parent"
   *         android:layout_height="wrap_content"
   *         android:text="notificationTitle"
   *         android:textSize="14sp" />
   *
   *     <TextView
   *         android:id="@+id/notificationText"
   *         style="@style/TextAppearance.Compat.Notification.Line2"
   *         android:layout_width="match_parent"
   *         android:layout_height="wrap_content"
   *         android:text="notificationText"
   *         android:textSize="14sp" />
   *
   *     <LinearLayout
   *         android:layout_width="match_parent"
   *         android:layout_height="wrap_content"
   *         android:gravity="right"
   *         android:orientation="horizontal">
   *
   *         <Button
   *             android:id="@+id/notificationButtonFoo"
   *             style="@style/Widget.AppCompat.Button.Small"
   *             android:layout_width="60dp"
   *             android:layout_height="40dp"
   *             android:text="FooA" />
   *
   *         <Button
   *             android:id="@+id/notificationButtonBar"
   *             style="@style/Widget.AppCompat.Button.Small"
   *             android:layout_width="60dp"
   *             android:layout_height="40dp"
   *             android:text="Bar" />
   *     </LinearLayout>
   * </LinearLayout>
   * ```
   *
   * ![](https://dl.dropbox.com/s/k2l0oaqk86axfgu/android-custom-layout-elements.png?dl=1)
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       title: "The title",
   *       text: "The text",
   *       layout: "notification_layout",
   *       actions: [
   *         "notificationButtonFoo",
   *         "notificationButtonBar"
   *       ],
   *       strings: {
   *         myCustomTextBox1: "custom TextBox element"
   *       }
   *     }
   *   }
   * });
   *
   * BackgroundGeolocation.onNotificationAction((buttonId) => {
   *   console.log("[onNotificationAction]", buttonId);
   *   switch (buttonId) {
   *     case "notificationButtonFoo":
   *       break;
   *     case "notificationButtonBar":
   *       break;
   *   }
   * });
   * ```
   */
  layout?: string;

  /**
   * <!-- doc-id: NotificationConfig.strings -->
   * Custom strings to render into `<TextView />` elements of a custom notification {@link layout}.
   *
   * See [Android Custom Notification Layout](github:wiki/Android-Custom-Notification-Layout)
   * for setup instructions.
   *
   * Declare your own `<TextView />` elements in the layout XML and populate them by
   * supplying matching key/value pairs in {@link strings}, where the key matches the
   * `android:id` of the element.
   *
   * ```xml
   * <TextView
   *   android:id="@+id/myCustomElement"
   *   android:layout_width="match_parent"
   *   android:layout_height="wrap_content"
   *   android:text="notificationTitle" />
   * ```
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       strings: {
   *         myCustomElement: "My Custom Element Text"
   *       }
   *     }
   *   }
   * });
   * ```
   */
  strings?: Record<string, string>;

  /**
   * <!-- doc-id: NotificationConfig.actions -->
   * Declare click listeners for `<Button />` elements of a custom notification {@link layout}.
   *
   * ![](https://dl.dropbox.com/s/whcb6q1gxxdk9t1/android-foreground-notification-transistor.png?dl=1)
   *
   * See [Android Custom Notification Layout](github:wiki/Android-Custom-Notification-Layout)
   * for setup instructions.
   *
   * Declare `<Button />` elements in your layout XML, then list their `android:id` values
   * in the {@link actions} array to register click listeners.
   *
   * #### Custom `<Button />` element
   *
   * ```xml
   * <Button
   *   android:id="@+id/notificationButtonPause"
   *   style="@style/Widget.AppCompat.Button.Small"
   *   android:layout_width="60dp"
   *   android:layout_height="40dp"
   *   android:text="Foo" />
   * ```
   *
   * @example Register button listeners
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       actions: [
   *         "notificationButtonPause"   // <-- register button listeners
   *       ]
   *     }
   *   }
   * });
   *
   * // Listen to custom button clicks:
   * BackgroundGeolocation.onNotificationAction((buttonId) => {
   *   console.log("[onNotificationAction] - ", buttonId);
   *   switch (buttonId) {
   *     case "notificationButtonPause":
   *       BackgroundGeolocation.changePace(false);
   *       break;
   *     // ...
   *   }
   * });
   * ```
   */
  actions?: string[];

  /**
   * <!-- doc-id: NotificationConfig.channelName -->
   * Name of the Android notification channel used for the foreground service notification.
   * Defaults to `"BackgroundGeolocation"`.
   *
   * On Android O and above, foreground services require a notification channel. The channel
   * name is visible to users under:
   * > Settings → Apps & Notifications → Your App
   *
   * ![](https://dl.dropboxusercontent.com/s/zgcxau7lyjfuaw9/android-notificationChannelName.png?dl=1)
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       channelName: "Location Tracker"
   *     }
   *   }
   * });
   *
   * // Update at runtime
   * BackgroundGeolocation.setConfig({
   *   app: {
   *     notification: {
   *       channelName: "My new channel name"
   *     }
   *   }
   * });
   * ```
   */
  channelName?: string;

  /**
   * <!-- doc-id: NotificationConfig.channelId -->
   * Identifier of the Android notification channel used for the foreground service
   * notification. Defaults to `"bggeo"`.
   *
   * ### Note
   * Changing this is not typically required. A use case is sharing an existing
   * notification channel with another foreground service in the same app.
   */
  channelId?: string;

  // TODO: human review — the following properties exist in NotificationState.java
  // but are not currently exposed in the TypeScript interface:
  //   channelDescription  (default: "Location tracking")
  //   importance          (default: IMPORTANCE_LOW = 2)
  //   allowTap            (default: true)  — tapping notification launches app
  //   tapActivity         (default: "")    — fully-qualified Activity name to open on tap
}

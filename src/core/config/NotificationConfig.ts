import { NotificationPriority } from '../../enums/NotificationPriority';

/**
 * __Android foreground notification__
 *
 * Android requires a persistent notification whenever the SDK runs its
 * foreground service. This notification is shown in the system status bar
 * while tracking is active.
 *
 * ![](https://dl.dropbox.com/s/acuhy5cu4p7uofr/android-foreground-service-default.png?dl=1)
 *
 * Configure this via {@link NotificationConfig} on {@link AppConfig.notification}.
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
 * __Custom Notification Layouts__
 *
 * Supply a custom Android Layout XML file using {@link NotificationConfig.layout}.
 * This allows complete control over the appearance of the foreground notification.
 *
 * See the guide:  
 * **Android Custom Notification Layout** — (github:wiki/Android-Custom-Notification-Layout)
 *
 * @category Config
 */
export interface NotificationConfig {
  /**
   * __Android notification priority__
   *
   * Android requires a persistent foreground-service notification.  
   * The `priority` option controls both:
   *
   * - The **order** of the notification in the system shade.
   * - The **position/visibility** of the small status-bar icon.
   *
   * The following values are defined as static constants on
   * {@link BackgroundGeolocation}:
   *
   * | Value                                                     | Description                                                                                              |
   * |-----------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
   * | {@link NotificationPriority.Default} | Weighted toward the top of the notification list; status-bar icon left-aligned.                          |
   * | {@link NotificationPriority.High}    | Strongly weighted to the top; icon strongly left-aligned.                                                |
   * | {@link NotificationPriority.Low}     | Weighted toward the bottom; icon right-aligned.                                                          |
   * | {@link NotificationPriority.Max}     | Equivalent to `NOTIFICATION_PRIORITY_HIGH`.                                                              |
   * | {@link NotificationPriority.Min}     | Strongly weighted to the bottom; icon hidden.                                                             |
   *
   * @example
   * ```ts
   * BackgroundGeolocation.ready({
   *   app: {
   *     foregroundService: true,
   *     notification: {
   *       priority: NotificationPriority.High
   *     }
   *   }
   * });
   * ```
   * 
   */
  priority?: NotificationPriority;

  /**
   * Configure the Android Foreground Service icon and notification to be displayed __always__.  Defaults to `false`.
   *
   * The default behaviour is for the notification to be shown only while the SDK detects the device to be *moving*.  
   * Some developers desire to provide full-disclosure to their users when the SDK has been enabled.
   */
  sticky?: boolean;

  /**
   * Configure the *title* of the persistent notification in the Notification Bar.
   *
   * Defaults to the application name from `AndroidManifest`.  Android requires a persistent notification for foreground-services.  This will configure the **title** of that notification. 
   */
  title?: string;

  /**
   * Configure the *text* of the persistent notification in the Notification Bar.
   *
   * Defaults to *"Location service activated"*.  Android requires a persistent notification for foreground-services.  This will configure the **text** of that notification.
   */
  text?: string;

  /**
   * Configure the *color* of the persistent notification icon in the Notification Bar.
   *
   * Defaults to `null`.  Android requires a persistent notification for foreground-services.  This will configure the **color** of the notification **icon** (API >= 21).
   *
   * Supported formats are:
   * - `#RRGGBB`
   * - `#AARRGGBB`
   */
  color?: string;

  /**
   * Configure the *small icon* of the persistent notification in the Notification Bar.
   *
   * Android requires a persistent notification in the Notification Bar.  This allows you customize that icon.  Defaults to your application icon.
   *
   * __⚠️ Warning:__
   * - You must specify the **`type`** (`drawable|mipmap`) of resource you wish to use in the following format: `{type}/icon_name`
   * - Do not append the file-extension (eg: `.png`)
   *
   * @example
   * ```typescript
   * // 1. drawable
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       smallIcon: "drawable/my_custom_notification_small_icon"
   *     }
   *   }
   * });
   *
   * // 2. mipmap
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       smallIcon: "mipmap/my_custom_notification_small_icon"
   *     }
   *   }
   * });
   * ```
   *
   * __ℹ️ See also:__
   * - {@link largeIcon}
   */
  smallIcon?: string;

  /**
   * Configure the *large icon* of the persistent notification in the Notification Bar.
   *
   * Android requires a persistent notification in the Notification Bar.  This allows you customize that icon.  Defaults to your application icon.
   *
   * __⚠️ Warning:__
   * - You must specify the **`type`** (`drawable|mipmap`) of resource you wish to use in the following format: `{type}/icon_name`
   * - Do not append the file-extension (eg: `.png`)
   *
   * @example
   * ```typescript
   * // 1. drawable
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       smallIcon: "drawable/my_custom_notification_small_icon"
   *     }
   * });
   *
   * // 2. mipmap
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       smallIcon: "mipmap/my_custom_notification_small_icon"
   *     }
   *   }
   * });
   * ```
   *
   * __ℹ️ See also:__
   * - {@link smallIcon}
   */
  largeIcon?: string;

  /**
   * __Custom Android Notification Layout__
   *
   * Specifies the name of your custom Android Layout XML file.
   *
   * __ℹ️ See:__
   * - **[Android Custom Notification Layout](github:wiki/Android-Custom-Notification-Layout)** for full setup instructions.
   *
   * ![](https://dl.dropbox.com/s/whcb6q1gxxdk9t1/android-foreground-notification-transistor.png?dl=1)
   *
   * Even if you have no prior Android UI experience, custom layouts are very approachable.
   * You will typically add `<TextView />`, `<ImageView />`, and `<Button />` elements.
   *
   * **Important:** Your `android:id` values **must be prefixed** with `notification`  
   * (e.g., `notificationText`, `notificationTitle`).  
   * The only exception is `applicationName`, which the SDK will populate with your app name.
   *
   * __Layout Special Elements__
   *
   * When the SDK renders your custom notification, it searches for the following IDs and
   * sets their content from the associated data source:
   *
   * | Layout element `android:id`   | Data source                                |
   * |-------------------------------|---------------------------------------------|
   * | `applicationName`             | Application name from AndroidManifest       |
   * | `notificationTitle`           | {@link title}            |
   * | `notificationText`            | {@link text}             |
   * | `notificationSmallIcon`       | {@link smallIcon}        |
   * | `notificationLargeIcon`       | {@link largeIcon}        |
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
   * __Custom `<TextView />` Elements__
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
   * __Custom `<Button />` Elements__
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
   * __Sample Layout__
   *
   * As a starting point, copy this into your XML file:
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
   * __Using your custom layout__
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
   * Custom strings to render into `<TextView />` elements of a custom notification [[layout]].
   *
   * ℹ️ See [Android Custom Notification Layout](github:wiki/Android-Custom-Notification-Layout) for setup instructions.
   *  
   * You can declare your own custom `<TextView />` elements and render data into them using the `notification.strings` parameter.
   *
   * ```xml
   * <TextView
   *     android:id="@+id/myCustomElement"  // <-- myCustomElement
   *     android:layout_width="match_parent"
   *     android:layout_height="wrap_content"
   *     android:text="notificationTitle" />
   * ```
   *
   * You can provide data to your custom elements using the [[strings]] configuration parameter:
   *
   * @example
   * ```typescript
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
   * Declare click listeners for `<Button />` elements of a custom notification {@link layout}.
   *
   * ![](https://dl.dropbox.com/s/whcb6q1gxxdk9t1/android-foreground-notification-transistor.png?dl=1)
   *
   * ℹ️ See [Android Custom Notification Layout](github:wiki/Android-Custom-Notification-Layout) for setup instructions.
   *
   * You can declare custom Android `<Button />` elements in your layout XML and
   * register click listeners for them using the {@link actions} parameter.
   *
   * __Example: Custom `<Button />` element__
   *
   * ```xml
   * <Button
   *     android:id="@+id/notificationButtonPause"  <!-- notificationButtonPause -->
   *     style="@style/Widget.AppCompat.Button.Small"
   *     android:layout_width="60dp"
   *     android:layout_height="40dp"
   *     android:text="Foo" />
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
   * Configure the name of the plugin's notification-channel used to display the required, persistent foreground notification.
   *
   * On Android O+, the plugin's foreground-service needs to create a "Notification Channel".  The name of this channel can be seen in:
   * > `Settings->App & Notifications->Your App.`
   *
   * Defaults to your application's name from `AndroidManifest`.
   *
   * ![](https://dl.dropboxusercontent.com/s/zgcxau7lyjfuaw9/android-notificationChannelName.png?dl=1)\
   *
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.ready({
   *   app: {
   *     notification: {
   *       channelName: "Location Tracker"
   *     }
   *  }
   * });
   *
   * // or with #setConfig
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
   * Customize the notification channel ID.
   * 
   * Defaults to `your.package.name.TSLocationManager`
   *
   * __NOTE__:  It is not typically required to change this.  Typical use-cases are for users who use an existing Android foreground-service who wish the SDK to share an existing notification and channel.
   */
  channelId?: string;
  
}
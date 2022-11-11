# Capacitor - React Sample App

This is sample mobile app with integration of the Responsys SDK using Capacapity plugin. This project uses [React](https://reactjs.org/) as app development platform and [Capacitor CLI](https://capacitorjs.com/docs/cli), more information [here](https://capacitorjs.com/solution/react).

## Getting Started

Clone this repository:

```
git clone https://github.com/capacitor-pushiomanager/example/

```
Change to the root directory of the project:

```
cd example

```




## Setup
 
Install all dependencies:

```
npm i @capacitor/core
npm i -D @capacitor/cli
npm install
```

Sync your application to native project by running the following command.
```
npm run build
npx cap sync
```

For more information on [Capacitor CLI](https://capacitorjs.com/docs/cli)

## Capacitor-PushIOManager

### Setup

Before installing the plugin, you must setup your app to receive push notifications.

#### For Android
- [Get FCM Credentials](https://docs.oracle.com/en/cloud/saas/marketing/responsys-develop-mobile/android/gcm-credentials) 
- Log in to the [Responsys Mobile App Developer Console](https://docs.oracle.com/en/cloud/saas/marketing/responsys-develop-mobile/dev-console/login/) and enter your FCM credentials (Project ID and Server API Key) for your Android app.
- Get the `pushio_config.json` file generated from your credentials and place it in your project's `android/app/src/main/assets` folder. You might have to create the directory if it is not already present.


#### For iOS
- [Generate Auth Key](https://docs.oracle.com/en/cloud/saas/marketing/responsys-develop-mobile/ios/auth-key/) 
- Log in to the [Responsys Mobile App Developer Console](https://docs.oracle.com/en/cloud/saas/marketing/responsys-develop-mobile/dev-console/login/) and enter your Auth Key and other details for your iOS app.
- Download the `pushio_config.json` file generated from your credentials.
- Open the Xcode project workspace in your `ios` directory of Capacitor app. 
- Drag and Drop your `pushio_config.json` in Xcode project.
- Select the root project and Under Capabilites add the "Push Notifications" and "Background Modes". 
![Capabilty Image](.../img/ios_add_capability.png "Capabilty Image")
- Download `PushIOManager.xcframework` from [here](https://www.oracle.com/downloads/applications/cx/responsys-mobile-sdk.html) and copy to frameworks `PushIOManager.xcframework` from  and place it in the plugin `PATH_TO_pushiomanager-Capacitor-plugin_DIRECTORY/frameworks/` folder before adding plugin to project. 


### Installation

Download the plugin,
```shell
git clone https://github.com/oracle/Capacitor-plugin-pushiomanager
```

> For iOS - Copy `PushIOManager.xcframework`  and place it in the plugin  `PATH_TO_Capacitor-plugin-pushiomanager_DIRECTORY/frameworks/` folder before adding plugin to project. 


The plugin can be installed with the Capacitor CLI,

```shell
npm install PATH_TO_pushiomanager-Capacitor-plugin_DIRECTORY

npm cap sync
```

### Integration
 
#### For iOS

Add below code in `AppDelegate.swift`

```
func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
  		NotificationCenter.default.post(name: .capacitorDidRegisterForRemoteNotifications, object: deviceToken)
}
   
        
func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
	NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
}
  
  
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
  
    return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
  }
  
func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
   return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
  }
```
- Add `PIOMediaAttachmentExtension.xcframework` inside ios/App/NotificationServiceExtension
- Add `PIOContentExtension.xcframework` inside ios/App/NotificationContentExtension

### Build and Run

Prepare and launch the Android app:

```
npx cap sync android
npx cap run android
```


Prepare and launch the iOS app:

```
npx cap sync ios
npx cap run ios
```


## Support
If you have access to My Oracle Support, please raise a request here, otherwise open an issue in this repository.

## License
Copyright (c) 2022 Oracle and/or its affiliates and released under the Universal Permissive License (UPL), Version 1.0.
Oracle and Java are registered trademarks of Oracle and/or its affiliates. Other names may be trademarks of their respective owners.
a
import { PluginListenerHandle } from '@capacitor/core';
declare module '@capacitor/cli' {
    interface PluginsConfig {
        PushIOManager?: {
            interceptOpenURL: boolean;
        };
    }
}
/**
 * Log level; to be used with [setLogLevel()]{@link PushIOManager#setLogLevel}
 * @readonly
 * @enum {number}
 * @memberof PushIOManager
 */
export declare enum LogLevel {
    /** No logs will be printed. */
    NONE = 0,
    /** Logs will include only Errors level logs. */
    ERROR,
    /** Logs will include only Info level logs. */
    INFO,
    /** Logs will include Warning level logs. */
    WARN,
    /** Logs will include Debug level logs. */
    DEBUG,
    /** Logs will include Verbose level logs. */
    VERBOSE
}
/**
 * Engagement types to be used with [trackEngagement()]{@link PushIOManager#trackEngagement}
 * @readonly
 * @enum {number}
 * @memberof PushIOManager
 */
export declare enum EngagementType {
    /** Used by SDK to record app launch via push notification. Apps should avoid using this. */
    PUSHIO_ENGAGEMENT_METRIC_LAUNCH = 1,
    /** Used by SDK to record push receipt when app is in foreground. Apps should avoid using this. */
    PUSHIO_ENGAGEMENT_METRIC_ACTIVE_SESSION = 2,
    /** User did an In-App purchase. */
    PUSHIO_ENGAGEMENT_METRIC_INAPP_PURCHASE = 3,
    /** User accessed premium content in the app. */
    PUSHIO_ENGAGEMENT_METRIC_PREMIUM_CONTENT = 4,
    /** User did a social action, for example: share, like etc. */
    PUSHIO_ENGAGEMENT_METRIC_SOCIAL = 5,
    /** User did a commerce (or physical goods) purchase in the app */
    PUSHIO_ENGAGEMENT_METRIC_PURCHASE = 7,
    /** Any other user action that doesn't fit under other engagement-types */
    PUSHIO_ENGAGEMENT_METRIC_OTHER = 6
}
export declare type Success = {
    response: any | undefined;
};
export declare type Failure = {
    error: string;
};
export declare type Callback = {
    success: any | undefined;
    error: string;
};
export declare type Pubweb = {
    deeplinkURL: string;
    weblinkURL: string;
    requestURL: string;
    isPubwebURLType: boolean;
    error: string;
};
export declare type MessageCenterResult = {
    messageCenter: string;
    messages: MessageCenterMessage[];
    errorReason: string;
};
export declare type MCRichContentResult = {
    messageId: string;
    richContent: string;
    errorReason: string;
};
export declare type RegionResult = {
    regionID: string;
    regionType: string;
    error: string;
};
export declare type Preference = {
    key: string;
    label: string;
    type: string;
    value: string;
};
export declare type MessageCenterMessage = {
    messageID: string;
    subject: string;
    message: string;
    iconURL: string;
    messageCenterName: string;
    deeplinkURL: string;
    richMessageHTML: string;
    richMessageURL: string;
    sentTimestamp: string;
    expiryTimestamp: string;
    customKeyValuePairs: object;
};
export declare type InteractiveNotificationCategory = {
    orcl_category: string;
    orcl_btns: InteractiveNotificationButton[];
};
export declare type InteractiveNotificationButton = {
    id: string;
    action: string;
    label: string;
};
export declare type RemoteMessage = {
    to: string;
    collapseKey: string;
    messageId: string;
    messageType: string;
    ttl: string;
    data: object;
};
export declare type GeoRegion = {
    geofenceId: string;
    geofenceName: string;
    zoneName: string;
    zoneId: string;
    source: string;
    deviceBearing: number;
    deviceSpeed: number;
    dwellTime: number;
    extra: object;
};
export declare type BeaconRegion = {
    beaconId: string;
    beaconName: string;
    beaconTag: string;
    beaconProximity: string;
    iBeaconUUID: string;
    iBeaconMajor: number;
    iBeaconMinor: number;
    eddyStoneId1: string;
    eddyStoneId2: string;
    zoneName: string;
    zoneId: string;
    source: string;
    dwellTime: number;
    extra: object;
};
export interface ConversionEvent {
    orderId: string;
    orderTotal: number;
    orderQuantity: number;
    conversionType: number;
    customProperties: object;
}
export interface PushIOManagerPlugin {
    /**
     * Gets the API Key used by the device to register with Responsys.
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     * @memberof PushIOManager
     */
    getAPIKey(): Promise<Callback>;
    /**
     * Gets the Account Token used by the device to register with Responsys.
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     * @memberof PushIOManager
     */
    getAccountToken(): Promise<Callback>;
    /**
     * @param {string} apiKey
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     * android only API
     */
    overwriteApiKey(apiKey: string): Promise<Callback>;
    /**
    * @param {string} accountToken
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * android only API
    */
    overwriteAccountToken(accountToken: string): Promise<Callback>;
    /**
    * Sets the External Device Tracking ID. Useful if you have another ID for this device.
    * @param {string} trackingId External Device Tracking ID.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * @memberof PushIOManager
    */
    setExternalDeviceTrackingID(trackingId: String): Promise<Callback>;
    /**
    * Gets the External Device Tracking ID.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * @memberof PushIOManager
    */
    getExternalDeviceTrackingID(): Promise<Callback>;
    /**
    * Sets the Advertising ID.
    * @param {string} adid Advertising ID.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * @memberof PushIOManager
    */
    setAdvertisingID(adid: string): Promise<Callback>;
    /**
    * Gets the Advertising ID.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * @memberof PushIOManager
    */
    getAdvertisingID(): Promise<Callback>;
    /**
     * Gets the Responsys Device ID.
     *
     * @param {function} [success] Success callback with device ID value.
     * @param {function} [failure] Failure callback.
     */
    getDeviceID(): Promise<Callback>;
    /**
    * Gets the Responsys SDK version.
    *
    * @param {function} [success] Success callback with the SDK version value.
    * @param {function} [failure] Failure callback.
    */
    getLibVersion(): Promise<Callback>;
    /**
     * Associates this app installation with the provided userId in Responsys.
     * <br/>Generally used when the user logs in.
     *
     * @param {string} userId User ID
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     * @memberof PushIOManager
     */
    registerUserId(options: {
        userId: string;
    }): Promise<Callback>;
    /**
     * Gets the User ID set earlier using [registerUserId]{@link PushIOManager#registerUserId}.
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     * @memberof PushIOManager
     */
    getRegisteredUserId(): Promise<Callback>;
    /**
     * Removes association between this app installation and the User ID that
     * was set earlier using [registerUserId]{@link PushIOManager#registerUserId}.
     * <br/>Generally used when the user logs out.
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     * @memberof PushIOManager
     */
    unregisterUserId(): Promise<Callback>;
    /**
   * Sets the log level.
   *
   * @param {number} logLevel
   */
    setLogLevel(options: {
        logLevel: number;
    }): Promise<void>;
    /**
     * @param {boolean} isLoggingEnabled
     * @param {function} [success] Success callback with boolean value.
     * @param {function} [failure] Failure callback.
     */
    setLoggingEnabled(options: {
        isLoggingEnabled: boolean;
    }): Promise<Callback>;
    /**
     * Configures the SDK using the provided config file name.
     *
     * <br/><br/>For Android, the file should be placed in the android <i>src/main/assets</i> directory
     *
     * @param {string} fileName A valid filename.
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     */
    configure(options: {
        filename: string;
    }): Promise<Callback>;
    /**
     * Sets delay in registration.
     *
     * @param {boolean} delayRegistration
     */
    setDelayRegistration(options: {
        delayRegistration: boolean;
    }): Promise<Callback>;
    /**
    * This api provides the status, if `setDelayRegistration` is enabled of not.
    *
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    isDelayRegistration(): Promise<Callback>;
    /**
   * Registers this app installation with Responsys.
   *
   * @param {boolean} useLocation Whether to send location data along with the registration request. Passing `true` will show the default system location permission dialog prompt.
   * (User location is not available on iOS platform.)
   * @param {function} [success] Success callback.
   * @param {function} [failure] Failure callback.
   */
    registerApp(options: {
        useLocation: boolean;
    }): Promise<Callback>;
    /**
     * Asks user permissions for all push notifications types. i.e.: Sound/Badge/Alert types.
     *
     * Only available on iOS platform.
     *
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     */
    registerForAllRemoteNotificationTypes(): Promise<Callback>;
    /**
     * Asks user permissions for all push notifications types. i.e.: Sound/Badge/Alert types. You can pass the notification categories definitions to register.
     *
     * Only available on iOS platform.
     *
     * @param {InteractiveNotificationCategory[]} categories Contains the notification categories definitions.
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     */
    registerForAllRemoteNotificationTypesWithCategories(options: {
        categories: InteractiveNotificationCategory[];
    }): Promise<Callback>;
    /**
    * Asks user permissions for all push notifications types. i.e.: Sound/Badge/Alert types.
    *
    * If readyForRegistrationCompHandler is not set, then provided completionHandler is assigned to it, to let application have access when SDK receives deviceToken.
    *
    * Only available on iOS platform.
    *
    * @param {number} authOptions Notification auth types i.e.: Sound/Badge/Alert.
    * @param {InteractiveNotificationCategory[]} categories Contains the notification categories definitions.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    registerForNotificationAuthorizations(options: {
        authOptions: number;
        categories: InteractiveNotificationCategory[];
    }): Promise<Callback>;
    /**
    * Unregisters this app installation with Responsys. This will prevent the app from receiving push notifications.
    *
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    unregisterApp(): Promise<Callback>;
    /**
    * Declares a preference that will be used later with [set...Preference()]{@link PushIOManager#setStringPreference}
    *
    * @param {string} key Unique ID for this preference.
    * @param {string} label Human-Readable description of this preference.
    * @param {string} type Data type of this preference. Possible values: 'STRING', 'NUMBER', 'BOOLEAN'.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * @memberof PushIOManager
    */
    declarePreference(options: {
        key: string;
        label: string;
        type: string;
    }): Promise<void>;
    /**
    * Gets all preferences set earlier using [set...Preference()]{@link PushIOManager#setStringPreference}.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * @returns {Preference[]} Array of [Preference]{@link Preference} in success callback.
    * @memberof PushIOManager
    */
    getPreferences(): Promise<Preference[]>;
    /**
    * Gets a single preference for the provided key.
    * @param {string} key Unique ID for this preference.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * @returns {Preference} Single preference in success callback.
    * @memberof PushIOManager
    */
    getPreference(options: {
        key: string;
    }): Promise<Callback>;
    /**
    * Saves the key/value along with the label provided earlier in [declarePreference]{@link PushIOManager#declarePreference}
    *
    * @param {string} key Unique ID for this preference.
    * @param {string} value Value of type String.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * @memberof PushIOManager
    */
    setStringPreference(options: {
        key: string;
        value: string;
    }): Promise<Callback>;
    /**
    * Saves the key/value along with the label provided earlier in [declarePreference]{@link PushIOManager#declarePreference}
    *
    * @param {string} key Unique ID for this preference.
    * @param {number} value Value of type Number.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * @memberof PushIOManager
    */
    setNumberPreference(options: {
        key: string;
        value: number;
    }): Promise<Callback>;
    /**
    * Saves the key/value along with the label provided earlier in [declarePreference]{@link PushIOManager#declarePreference}
    *
    * @param {string} key Unique ID for this preference.
    * @param {boolean} value Value of type Boolean.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * @memberof PushIOManager
    */
    setBooleanPreference(options: {
        key: string;
        value: boolean;
    }): Promise<Callback>;
    /**
    * Removes preference data for the given key.
    *
    * @param {string} key Unique ID for this preference.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * @memberof PushIOManager
    */
    removePreference(options: {
        key: string;
    }): Promise<Callback>;
    /**
    * Removes all preference data.
    *
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * @memberof PushIOManager
    */
    clearAllPreferences(): Promise<Callback>;
    setNotificationsStacked(options: {
        isNotificationStacked: boolean;
    }): Promise<Callback>;
    getNotificationStacked(): Promise<Callback>;
    /**
     * Records pre-defined and custom events.<br/>You can set extra properties specific to this event via the properties parameter.
     *
     * @param {string} eventName
     * @param {object} properties Custom data.
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     * @memberof PushIOManager
     */
    trackEvent(options: {
        eventName: string;
        properties: object;
    }): Promise<Callback>;
    /**
     * Sends push engagement information to Responsys.
     *
     * @param {EngagementType} metric One of [engagementType]{@link PushIOManager#engagementType}
     * @param {object=} properties Custom data to be sent along with this request.
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     * @memberof PushIOManager
     */
    trackEngagement(options: {
        metric: EngagementType;
        properties: object;
    }): Promise<Callback>;
    /**
     * Fetches messages for the given message center.
     *
     * @param {string} messageCenter
     * @param {function(messageCenter, messages)} [success] Success callback.
     * @param {string} success.messageCenter
     * @param {MessageCenterMessage[]} success.messages
     * @param {function(messageCenter, errorReason)} [failure] Failure callback.
     * @param {string} failure.messageCenter
     * @param {string} failure.errorReason
     * @memberof PushIOManager
     */
    fetchMessagesForMessageCenter(options: {
        messageCenter: string;
    }): Promise<MessageCenterResult>;
    /**
     * @param {function} [success] Success callback with boolean value.
     * @param {function} [failure] Failure callback.
     */
    isMessageCenterEnabled(): Promise<Callback>;
    /**
    * @param {boolean} messageCenterEnabled
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    setMessageCenterEnabled(options: {
        messageCenterEnabled: boolean;
    }): Promise<Callback>;
    /**
    * Fetches rich content for the given message ID.
    *
    * @param {string} messageID
    * @param {function(messageId, richContent)} [success] Success callback.
    * @param {string} success.messageId
    * @param {string} success.richContent
    * @param {function(messageId, errorReason)} [failure] Failure callback.
    * @param {string} failure.messageId
    * @param {string} failure.errorReason
    */
    fetchRichContentForMessage(options: {
        messageID: string;
    }): Promise<MCRichContentResult>;
    /**
     * @param {boolean} messageCenterBadgingEnabled
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     * //android API
     */
    setMessageCenterBadgingEnabled(options: {
        messageCenterBadgingEnabled: boolean;
    }): Promise<Callback>;
    /**
     * Removes all Message Center messages from the SDK's cache.<br/><br/>This does not affect your local cache of the messages.
     *
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     */
    resetMessageCenter(): Promise<Callback>;
    /**
    * Informs the SDK that the Message Center view is visible.
    *
    * <br/><br/>This must be used along with [onMessageCenterViewFinish]{@link PushIOManager#onMessageCenterViewFinish} to track Message Center message displays.
    *
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    onMessageCenterViewVisible(): Promise<Callback>;
    /**
    * Informs the SDK that the Message Center view is no longer visible.
    *
    * <br/><br/>This must be used along with [onMessageCenterViewVisible]{@link PushIOManager#onMessageCenterViewVisible} to track Message Center message displays.
    *
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    onMessageCenterViewFinish(): Promise<Callback>;
    /**
   * Returns the list of message centers that have been fetched.
   *
   * @param {function} success
   * @param {function} failure Failure callback.
   */
    addListener(eventName: 'onMessageCenterUpdated', listenerFunc: (message: Callback) => void): Promise<PluginListenerHandle> & PluginListenerHandle;
    /**
    * Sends Message Center message engagement to Responsys.
    *
    * <br/><br/>This should be called when the message-detail view is visible to the user.
    *
    * @param {string} messageID
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    trackMessageCenterOpenEngagement(options: {
        messageID: string;
    }): Promise<Callback>;
    /**
    * Sends Message Center message engagement to Responsys.
    *
    * <br/><br/>This should be called when the message-list view is visible to the user.
    *
    * @param {string} messageID
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    trackMessageCenterDisplayEngagement(options: {
        messageID: string;
    }): Promise<Callback>;
    /**
     * @param {function} [success] Success callback as a string value.
     * @param {function} [failure] Failure callback.
     */
    getEngagementTimestamp(): Promise<Callback>;
    /**
     * @param {function} [success] Success callback as a number value.
     * @param {function} [failure] Failure callback.
     */
    getEngagementMaxAge(): Promise<Callback>;
    /**
     * Removes push engagement related data for a session.
     *
     * <br/><br/>This will prevent further engagements from being reported until the app is opened again via a push notification.
     *
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     */
    resetEngagementContext(): Promise<Callback>;
    /**
     * Sets the small icon used in notification display.
     *
     * @param {int} icon Resource ID of the icon.
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     * //android only API
     */
    setDefaultSmallIcon(options: {
        icon: number;
    }): Promise<Callback>;
    /**
    * Sets the large icon used in notification display.
    *
    * @param {int} icon Resource ID of the icon.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * //android only API
    */
    setDefaultLargeIcon(options: {
        icon: number;
    }): Promise<Callback>;
    /**
     * Sets the badge count on app icon for the no. of Message Center messages.
     *
     * @param {number} badgeCount
     * @param {boolean} forceSetBadge Force a server-sync for the newly set badge count.
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     */
    setBadgeCount(options: {
        badgeCount: number;
        forceSetBadge: boolean;
    }): Promise<Callback>;
    /**
    * Gets the current badge count for Message Center messages.
    *
    * @param {function} [success] Success callback as a number value.
    * @param {function} [failure] Failure callback.
    */
    getBadgeCount(): Promise<Callback>;
    /**
    * Resets the badge count for Message Center messages.<br/>This is equivalent to calling [setBadgeCount(0, true)]{@link PushIOManager#setsetBadgeCount}
    *
    * @param {boolean} forceSetBadge Force a server-sync for the newly set badge count.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    resetBadgeCount(options: {
        forceSetBadge: boolean;
    }): Promise<Callback>;
    /**
    * Removes all Message Center messages from the SDK's cache.<br/><br/>This does not affect your local cache of the messages.
    *
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    resetMessageCenter(): Promise<Callback>;
    /**
     * @param {boolean} inAppFetchEnabled
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     */
    setInAppFetchEnabled(options: {
        inAppFetchEnabled: boolean;
    }): Promise<Callback>;
    /**te
     * Removes all In-App messages from the SDK's cache.
     *
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     */
    clearInAppMessages(): Promise<Callback>;
    /**
    * @param {boolean} crashLoggingEnabled
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    setCrashLoggingEnabled(options: {
        crashLoggingEnabled: boolean;
    }): Promise<Callback>;
    /**
    * @param {function} [success] Success callback with boolean value.
    * @param {function} [failure] Failure callback.
    */
    isCrashLoggingEnabled(): Promise<Callback>;
    /**
    * @param {string} deviceToken
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * //Android only API
    */
    setDeviceToken(deviceToken: string): Promise<Callback>;
    /**
     * Removes all app-defined Interactive Notification categories from the SDK's cache.
     *
     * @param {function} [success] Success callback.
     * @param {function} [failure] Failure callback.
     */
    clearInteractiveNotificationCategories(): Promise<Callback>;
    /**
    * Removes app-defined Interactive Notification category.
    *
    * @param {string} categoryID
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    deleteInteractiveNotificationCategory(options: {
        categoryID: string;
    }): Promise<Callback>;
    /**
    * Gets a single Interactive Notification category for the given category ID.
    *
    * @param {string} categoryID
    * @param {function(orcl_category, orcl_btns)} [success] Success callback.
    * @param {string} success.orcl_category
    * @param {InteractiveNotificationButton[]} success.orcl_btns
    * @param {function} [failure] Failure callback.
    * // Android only API
    */
    getInteractiveNotificationCategory(options: {
        categoryID: string;
    }): Promise<Callback>;
    /**
    * Adds a new app-defined Interactive Notification category.
    *
    * @param {InteractiveNotificationCategory} notificationCategory
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * Android only API
    */
    addInteractiveNotificationCategory(options: {
        notificationCategory: InteractiveNotificationCategory;
    }): Promise<Callback>;
    /**
     * Returns `true` if the given push notification payload is from Responsys, `false` otherwise.
     *
     * @param {RemoteMessage} remoteMessage
     * @param {function} [success] Success callback as a boolean value.
     * @param {function} [failure] Failure callback.
     */
    isResponsysPush(options: {
        remoteMessage: RemoteMessage;
    }): Promise<Callback>;
    /**
    * Request the SDK to process the given push notification payload.
    *
    * @param {RemoteMessage} remoteMessage
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    * Android only API
    */
    handleMessage(options: {
        remoteMessage: RemoteMessage;
    }): Promise<Callback>;
    setExecuteRsysWebUrl(options: {
        flag: boolean;
    }): Promise<Pubweb>;
    getExecuteRsysWebUrl(): Promise<Callback>;
    /**
    * @param {function} [success] Success callback as a string value.
    * @param {function} [failure] Failure callback.
    */
    getConversionUrl(): Promise<Callback>;
    /**
    * @param {function} [success] Success callback as a number value.
    * @param {function} [failure] Failure callback.
    * Android only API
    */
    getRIAppId(): Promise<Callback>;
    /**
     * Informs the SDK that the user has entered a geofence.
     *
     * @param {GeoRegion} region
     * @param {function(regionID, regionType)} [success] Success callback.
     * @param {string} success.regionID
     * @param {string} success.regionType
     * @param {function} [failure] Failure callback.
     */
    onGeoRegionEntered(options: {
        region: GeoRegion;
    }): Promise<RegionResult>;
    /**
    * Informs the SDK that the user has exited a geofence.
    *
    * @param {GeoRegion} region
    * @param {function(regionID, regionType)} [success] Success callback.
    * @param {string} success.regionID
    * @param {string} success.regionType
    * @param {function} [failure] Failure callback.
    */
    onGeoRegionExited(options: {
        region: GeoRegion;
    }): Promise<RegionResult>;
    /**
    * Informs the SDK that the user has entered a beacon region.
    *
    * @param {BeaconRegion} region
    * @param {function(regionID, regionType)} [success] Success callback.
    * @param {string} success.regionID
    * @param {string} success.regionType
    * @param {function} [failure] Failure callback.
    */
    onBeaconRegionEntered(options: {
        region: BeaconRegion;
    }): Promise<RegionResult>;
    /**
    * Informs the SDK that the user has exited a beacon region.
    *
    * @param {BeaconRegion} region
    * @param {function(regionID, regionType)} [success] Success callback.
    * @param {string} success.regionID
    * @param {string} success.regionType
    * @param {function} [failure] Failure callback.
    */
    onBeaconRegionExited(options: {
        region: BeaconRegion;
    }): Promise<RegionResult>;
    /**
     * Gets the deeplink/weblink URL, if the app was opened via a Responsys deeplink.
     *
     * Only for Android. For iOS use the document listener.
     *
     * <br/><br/>This should be called everytime the app comes to the foreground.
     *
     * @param {function(deepLinkURL, webLinkURL)} [success] Success callback.
     * @param {string} success.deepLinkURL
     * @param {string} success.webLinkURL
     * @param {function} [failure] Failure callback.
     * Android only API
     */
    addListener(eventName: 'onDeepLinkReceived', listenerFunc: (URL: Pubweb) => void): Promise<PluginListenerHandle> & PluginListenerHandle;
    /**
    * Seting `true` this method will delay te rich push messages until `showRichPushMessage` API is called.
    *
    * Use this method when you are displaying intermediate screens like Login/Onboarding Screen.
    *
    * @param {boolean} enabled Value of type Boolean.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    setDelayRichPushDisplay(options: {
        enabled: boolean;
    }): Promise<Callback>;
    /**
    * Call this API to display rich push messages if they are being delayed with `setDelayRichPushDisplay`.
    *
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    showRichPushMessage(): Promise<Callback>;
    /**
    * This api provides the status, if `setDelayRichPushDisplay` is enabled of not.
    *
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    isRichPushDelaySet(): Promise<Callback>;
    /**
    * Call this API to intercept deep links/Open URLs sent by Responsys.
    * You can intercept the URLs sent by Respinsys Open URL and overide SDK default behaviour.
    *
    * @param {boolean} enabled Value of type Boolean.
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    setInterceptOpenURL(options: {
        enabled: boolean;
    }): Promise<Callback>;
    addListener(eventName: 'setInterceptOpenURL', listenerFunc: (message: Callback) => void): Promise<PluginListenerHandle> & PluginListenerHandle;
    /**
    * Tracks the conversions for PUSHIO_ENGAGEMENT_METRIC_INAPP_PURCHASE and PUSHIO_ENGAGEMENT_METRIC_PURCHASE events.
    *
    * @param {ConversionEvent} event
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    trackConversionEvent(options: {
        event: ConversionEvent;
    }): Promise<Callback>;
    setNotificationSmallIconColor(options: {
        color: string;
    }): Promise<Callback>;
    /**
    * Sets the given icon as the small icon in push notifications.
    *
    * @param {string} resourceName Name of the resource in drawable/mipmap folder, without the file extension.
    * Android only API
    */
    setNotificationSmallIcon(options: {
        resourceName: string;
    }): Promise<Callback>;
    /**
    * Sets the given icon as the large icon in push notifications.
    *
    * @param {string} resourceName Name of the resource in drawable/mipmap folder, without the file extension.
    * Android only API
    */
    setNotificationLargeIcon(options: {
        resourceName: string;
    }): Promise<Callback>;
    /** Sets the height of In-App banner message height.
    * <br> Banner height should be between 100 and 200 (inclusive) density-independent unit.
    *
    * @param {number} height
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    setInAppMessageBannerHeight(options: {
        height: number;
    }): Promise<Callback>;
    /**
    * Returns the height of In-App Banner message.
    *
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    getInAppMessageBannerHeight(): Promise<Callback>;
    /**
    * Sets the boolean to hide status bar of In-App Banner and Interstitial message
    * <br> true to hide status bar otherwise false
    *
    * @param {boolean} hideStatusBar
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    setStatusBarHiddenForIAMBannerInterstitial(options: {
        hideStatusBar: boolean;
    }): Promise<Callback>;
    /**
    * Returns the boolean value of status bar hidden for In-App Banner and Interstitial message.
    * <br> true if status bar hidden otherwise false
    *
    * @param {function} [success] Success callback.
    * @param {function} [failure] Failure callback.
    */
    isStatusBarHiddenForIAMBannerInterstitial(): Promise<Callback>;
}

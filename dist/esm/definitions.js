import { Capacitor } from '@capacitor/core';
/**
 * Log level; to be used with [setLogLevel()]{@link PushIOManager#setLogLevel}
 * @readonly
 * @enum {number}
 * @memberof PushIOManager
 */
export var LogLevel;
(function (LogLevel) {
    /** No logs will be printed. */
    LogLevel[LogLevel["NONE"] = 0] = "NONE";
    /** Logs will include only Errors level logs. */
    LogLevel[LogLevel["ERROR"] = Capacitor.getPlatform() === 'android' ? 6 : 1] = "ERROR";
    /** Logs will include only Info level logs. */
    LogLevel[LogLevel["INFO"] = Capacitor.getPlatform() === 'android' ? 4 : 2] = "INFO";
    /** Logs will include Warning level logs. */
    LogLevel[LogLevel["WARN"] = Capacitor.getPlatform() === 'android' ? 5 : 3] = "WARN";
    /** Logs will include Debug level logs. */
    LogLevel[LogLevel["DEBUG"] = Capacitor.getPlatform() === 'android' ? 3 : 4] = "DEBUG";
    /** Logs will include Verbose level logs. */
    LogLevel[LogLevel["VERBOSE"] = Capacitor.getPlatform() === 'android' ? 2 : 5] = "VERBOSE";
})(LogLevel || (LogLevel = {}));
;
/**
 * Engagement types to be used with [trackEngagement()]{@link PushIOManager#trackEngagement}
 * @readonly
 * @enum {number}
 * @memberof PushIOManager
 */
export var EngagementType;
(function (EngagementType) {
    /** Used by SDK to record app launch via push notification. Apps should avoid using this. */
    EngagementType[EngagementType["PUSHIO_ENGAGEMENT_METRIC_LAUNCH"] = 1] = "PUSHIO_ENGAGEMENT_METRIC_LAUNCH";
    /** Used by SDK to record push receipt when app is in foreground. Apps should avoid using this. */
    EngagementType[EngagementType["PUSHIO_ENGAGEMENT_METRIC_ACTIVE_SESSION"] = 2] = "PUSHIO_ENGAGEMENT_METRIC_ACTIVE_SESSION";
    /** User did an In-App purchase. */
    EngagementType[EngagementType["PUSHIO_ENGAGEMENT_METRIC_INAPP_PURCHASE"] = 3] = "PUSHIO_ENGAGEMENT_METRIC_INAPP_PURCHASE";
    /** User accessed premium content in the app. */
    EngagementType[EngagementType["PUSHIO_ENGAGEMENT_METRIC_PREMIUM_CONTENT"] = 4] = "PUSHIO_ENGAGEMENT_METRIC_PREMIUM_CONTENT";
    /** User did a social action, for example: share, like etc. */
    EngagementType[EngagementType["PUSHIO_ENGAGEMENT_METRIC_SOCIAL"] = 5] = "PUSHIO_ENGAGEMENT_METRIC_SOCIAL";
    /** User did a commerce (or physical goods) purchase in the app */
    EngagementType[EngagementType["PUSHIO_ENGAGEMENT_METRIC_PURCHASE"] = 7] = "PUSHIO_ENGAGEMENT_METRIC_PURCHASE";
    /** Any other user action that doesn't fit under other engagement-types */
    EngagementType[EngagementType["PUSHIO_ENGAGEMENT_METRIC_OTHER"] = 6] = "PUSHIO_ENGAGEMENT_METRIC_OTHER";
})(EngagementType || (EngagementType = {}));
;
;
//# sourceMappingURL=definitions.js.map
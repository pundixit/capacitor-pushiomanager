import Foundation
import Capacitor
import UserNotifications
import PushIOManager
import os.log

extension CAPPluginCall {

    
    func result(_ value:Any?,_ error:NSError? = nil){
        
        var result:[String:Any] = [:]
        
        if let error:NSError =  error {
            result["error"] = error.localizedDescription
        }
        
        if let value =  value {
            result["success"] = value
        }
        resolve(result)
        
    }
    
    func successCallback(_ value:Any?){
        
        if let value =  value {
            
            if let str =  value as? String {
                self.resolve(["success":NSString(string: str)])
            } else {
                self.resolve(["success":value])
            }
            
        } else {
            self.resolve(["success":NSNull()])
        }
    }
    
    func failureCallback(_ error:NSError?){
        if let message =  error?.localizedDescription {
            self.resolve(["error":message])
        } else {
            self.resolve([:])
        }
    }
}

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(PushIOManagerPlugin)
public class PushIOManagerPlugin: CAPPlugin {

    private var notifyMCAsyncCallbackId:String?
    private var deeplinkCallbackId:String?
    private var interceptCallbackId:String?
    
    private let pushIOHandler = PushIOHandler()
    
    override public func load() {
        
        self.bridge?.notificationRouter.pushNotificationHandler =  self.pushIOHandler as any NotificationHandlerProtocol
        

        NotificationCenter.default.addObserver(self,
                selector: #selector(onMessageCenterNotificationUpdate(notification: )),
                name: NSNotification.Name.PIOMessageCenterUpdate,
                object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(onDeepLinkReceivedNotification(notification:)), name: NSNotification.Name.PIORsysWebURLResolved, object: nil)
        
        let interceptOpenUrl:Bool = getConfig().getBoolean("interceptOpenURL", false)

        
        
        if #available(iOS 14.0, *) {
            os_log("[PushIOManager] [Capacitor] interceptOpenURL : \(interceptOpenUrl)")
        } else {
            // Fallback on earlier versions
        };
        
        if interceptOpenUrl == true {
            PushIOManager.sharedInstance().deeplinkDelegate =  self;
           
        }
    
    }
    
    
    @objc func getAPIKey(_ call: CAPPluginCall) {
        let apiKey  = pushIOHandler.getAPIKey();
        call.successCallback(apiKey)
    }
    
    @objc func getAccountToken(_ call: CAPPluginCall) {
        let accountToken = pushIOHandler.getAccountToken()
        call.successCallback(accountToken)
    }
    
    @objc func setExternalDeviceTrackingID(_ call: CAPPluginCall) {
        let trackingId =  call.getString("trackingId")
        pushIOHandler.setExternalDeviceTrackingID(trackingId: trackingId)
        call.successCallback(nil)
    }

    @objc func getExternalDeviceTrackingID(_ call: CAPPluginCall){
        let externalTrackingId = pushIOHandler.getExternalDeviceTrackingID();
        call.successCallback(externalTrackingId)
    }

    @objc func setAdvertisingID(_ call: CAPPluginCall){
        
        let adid =  call.getString("adid")
        pushIOHandler.setAdvertisingID(adid: adid)
        call.successCallback(nil)
            
    }
    
    @objc func getAdvertisingID(_ call: CAPPluginCall){
    
        let adid = pushIOHandler.getAdvertisingID()
        call.successCallback(adid)
    }
    
    @objc func getDeviceID(_ call: CAPPluginCall){
        
        let deviceId = pushIOHandler.getDeviceID();
        call.successCallback(deviceId)
    }
    
    @objc func getLibVersion(_ call: CAPPluginCall){
        
        let version = pushIOHandler.getLibVersion();
        call.successCallback(version)
    }
    
    @objc func frameworkVersion(_ call: CAPPluginCall){
        
        let version = pushIOHandler.getLibVersion();
        call.successCallback(version)
    }

    
    
    // MARK: Logging
    @objc func setLogLevel(_ call: CAPPluginCall) {
        
        if let value = call.getInt("logLevel") {
            let loglevel = PIOLogLevel(rawValue: value) ?? PIOLogLevel.info
            pushIOHandler.setLogLevel(loglevel)
            call.resolve([:])
        } else {
            call.resolve([:])
        }
        
    }
    
    @objc func setLoggingEnabled(_ call:CAPPluginCall){
        let value = call.getBool("isLoggingEnabled") ?? false
        pushIOHandler.setLoggingEnabled(value)
        call.resolve([:])
    }
    
    @objc func setCrashLoggingEnabled(_ call:CAPPluginCall){
        let value = call.getBool("isLoggingEnabled") ?? false
        pushIOHandler.setCrashLoggingEnabled(value)
        call.resolve([:])
    }
    
    @objc func isCrashLoggingEnabled(_ call:CAPPluginCall) {
        
        let enabled = pushIOHandler.isCrashLoggingEnabled()
        call.successCallback(enabled)
    }
    
    // MARK: Configure and Registration
    
    @objc func isSDKConfigured(_ call: CAPPluginCall) {
        let isConfigured = pushIOHandler.isSDKConfigured()
        call.result(isConfigured)
        
    }
    @objc func configure(_ call: CAPPluginCall) {
        do {
            let filename = call.getString("filename")
                
            try pushIOHandler.configure(filename) { error, message in
                call.result(message,error as NSError?)
            }
        
        } catch let error {
            call.reject(error.localizedDescription);
        }
        
    }
    
    func registerApplocally (closure:@escaping PIOCompletionHandler) {
        
        do {
            try pushIOHandler.registerApp(closure)
        
        } catch let error {
            closure(error,nil)
        }
        
    }
    
    @objc func registerApp(_ call: CAPPluginCall) {
        
        do {
            try pushIOHandler.registerApp { error, message in
                call.result(message, error as NSError?)
            }
        } catch let error {
            call.reject(error.localizedDescription)
        }
    }
    
    @objc func unregisterApp(_ call: CAPPluginCall) {
        
        do {
            try pushIOHandler.unregisterApp { error, message in
                call.result(message, error as NSError?)
            }
        } catch let error {
            call.reject(error.localizedDescription)
        }
    }
    
    @objc func registerForAllRemoteNotificationTypes(_ call: CAPPluginCall) {
    
        do {
            try pushIOHandler.registerForAllRemoteNotificationTypes { error, response in
                call.result(response, error as NSError?)
            }
        }catch let error {
            call.reject(error.localizedDescription)
        }
    }
    
    @objc func registerForAllRemoteNotificationTypesWithCategories(_ call: CAPPluginCall) {
        
        if let categories = call.getValue("categories") as? [NSDictionary] {
            
            let allCategories = categories.notificationCategoryArray()
            
            PushIOManager.sharedInstance().registerForAllRemoteNotificationTypes(withCategories: allCategories) { error, message in
                call.result(message, error as NSError?)
            }
        
        } else {
            call.resolve([:])
        }
    }
    
    @objc func registerForNotificationAuthorizations(_ call: CAPPluginCall){
        
        if let authOptions:Int = call.getInt("authOptions"),let categories:[NSDictionary] = call.getValue("categories") as? [NSDictionary]{
            
            let allCategories = categories.notificationCategoryArray()
            
            pushIOHandler.registerForNotificationAuthorizations(authOptions: authOptions, categories: allCategories) { error, message in
                call.result(message, error as NSError?)
            }
        } else {
            call.reject("authOptions or categories missing")
        }
    }
    
    @objc func registerUserId(_ call: CAPPluginCall){
        
        let userId =  call.getString("userId")
        pushIOHandler.registerUserId(userId: userId)
        call.resolve([:])
    }

    @objc func getRegisteredUserId(_ call: CAPPluginCall){
        
        let userId = pushIOHandler.getRegisteredUserId()
        call.resolve(["userId":userId])
    }

    @objc func unregisterUserId(_ call: CAPPluginCall){
        
        pushIOHandler.unregisterUserId()
        call.resolve([:])
    }
    
    @objc func setDelayRegistration(_ call:CAPPluginCall) {
        
        let delay = call.getBool("delayRegistration") ?? false
        pushIOHandler.setDelayRegistration(delay)
        call.resolve([:])
        
    }
    
    @objc func isDelayRegistration (_ call:CAPPluginCall) {
        let delay = pushIOHandler.isDelayRegistration()
        call.successCallback(delay);
    }

    // MARK: Preference
    @objc func declarePreference(_ call: CAPPluginCall) {

        if let key = call.getString("key"), let label = call.getString("label") {
            var type:PIOPreferenceType?
            
            if let inputType = call.getAny("type") {
                
                if let _ = inputType as? String {
                    type  = PIOPreferenceType.string;
                } else if let _ = inputType as? NSNumber {
                    type  = PIOPreferenceType.numeric
                } else if let _ = inputType as? Bool {
                    type  = PIOPreferenceType.boolean
                }
            }
            
            if let type =  type {
                pushIOHandler.declarePreference(key: key, label: label, type: type, error: nil)
                
                call.resolve([:]);
            } else {
                call.reject("Preference type can't be NULL. Should be \"STRING\" or \"NUMBER\" or \"BOOLEAN\"")
            }
        }else{
            call.reject("provide proper key label")
        }
    }

    @objc func getPreferences(_ call: CAPPluginCall) {

        if let preferences:[PIOPreference] = pushIOHandler.getPreferences(), let json = preferences.json() {
            call.resolve(["success": json])
        } else {
            call.resolve(["failure":"Preference is not available"])
        }
       
 
    }

    @objc func getPreference(_ call: CAPPluginCall) {

        if let key = call.getString("key"){
            if let preference = pushIOHandler.getPreference(key: key),let json = preference.dictionaryFromPreference()?.json(){
                    call.resolve(["success": json])
            } else {
                call.resolve(["failure":"preference is not available"])
            }
            
            
        } else {
            call.resolve(["failure":"provide preference key"])
        }
        
        
    }

    @objc func setStringPreference(_ call: CAPPluginCall) {

        if let key:String = call.getString("key"), let value:String = call.getString("value"){
            let isPrefSet =   pushIOHandler.setStringPreference(key: key, value: value)
            call.resolve(["success":isPrefSet])
         } else {
            call.reject("Preference value  Should be \"STRING\" ")
        }
            
    }

    @objc func setNumberPreference(_ call: CAPPluginCall) {

        
        if let key:String = call.getString("key"), let value = call.getInt("value"){
            let numValue = NSNumber(value: value)
            let isPrefSet =   pushIOHandler.setNumberPreference(key: key, value: numValue)
             call.resolve(["success":isPrefSet])
        } else {
            call.reject("Preference value  Should be \"NUMBER\" ")
        }
              
    }

    @objc func setBooleanPreference(_ call: CAPPluginCall) {

        if let key:String = call.getString("key"), let value:Bool = call.getValue("value") as? Bool{
            
            let isPrefSet =   pushIOHandler.setBooleanPreference(key: key, value: value)
            call.resolve(["success":isPrefSet])
            
        } else {
            call.reject("Preference value  Should be \"BOOLEAN\" ")
        }

    }

   @objc func removePreference(_ call: CAPPluginCall) {

       if let key:String = call.getString("key") {
            var error:NSError?
           pushIOHandler.removePreference(key: key, error: &error)
            if let error =  error {
                call.resolve(["failure":error.localizedDescription]);
            } else {
                call.resolve([:]);
            }
            
        } else {
            call.reject("failed to removePreference")
        }
    }

    @objc func clearAllPreferences(_ call: CAPPluginCall) {

        pushIOHandler.clearAllPreferences();
        call.resolve([:]);
    }
    
    @objc func setNotificationsStacked(_ call: CAPPluginCall) {
        call.unavailable("Not supported in iOS.")
    }
    
    @objc func getNotificationStacked(_ call: CAPPluginCall) {
        call.unavailable("Not supported in iOS.")
    }

    @objc func setNotificationSmallIconColor(_ call: CAPPluginCall) {
        call.unavailable("Not supported in iOS.")
    }

    @objc func setNotificationSmallIcon(_ call: CAPPluginCall) {
        call.unavailable("Not supported in iOS.")
    }

    @objc func setNotificationLargeIcon(_ call: CAPPluginCall) {
        call.unavailable("Not supported in iOS.")
    }
    
    //MARK: Tracking
    @objc func trackEvent(_ call: CAPPluginCall) {
        
        let properties:[String:Any]? = call.getAny("properties") as? [String:Any]
        
        if let eventName = call.getString("eventName") {
            
            pushIOHandler.trackEvent(eventName: eventName, properties: properties)
            call.resolve([:])
        }
        else {
            call.resolve(["failure":"Eventname can not be null"])
        }
    }
    
    @objc func trackEngagement(_ call: CAPPluginCall) {
        
        let properties:[String:Any]? = call.getAny("properties") as? [String:Any]
        var metricValue:Int?
        
        if let metric:String = call.getValue("metric") as? String, let metricvalue:Int = Int(metric) {
            metricValue = metricvalue
            
        } else if let metric:Int = call.getInt("metric") {

            metricValue = metric
        }
        
        if let metricValue =  metricValue {
            
            let value = ((metricValue < 6) ? (metricValue - 1) : metricValue);
            
            pushIOHandler.trackEngagement(metric: value, properties: properties) { error, response in
                
                call.result(response,error as NSError?)
                
            }
        }else {
            call.reject("metric is not avaialble")
        }
    }
    
    @objc func trackConversionEvent(_ call: CAPPluginCall) {
        
        if let eventDetails:[String:Any]  =  call.getValue("event") as? [String : Any],let event:PIOConversionEvent = eventDetails.conversionEvent()  {
            
            pushIOHandler.trackConversionEvent(event: event) { error, message in
                if let error =  error {
                    call.resolve(["error":error.localizedDescription])
                } else {
                    call.resolve(["success":message ?? ""])
                }
            }
        } else {
            call.reject("provide proper event details")
        }
    }

   //MARK: Message Center
    
    @objc func isMessageCenterEnabled(_ call: CAPPluginCall) {
        
        let enabled = pushIOHandler.isMessageCenterEnabled()
        call.successCallback(enabled == true ? "true" : false)
    }
    
    @objc func setMessageCenterEnabled(_ call: CAPPluginCall) {
        let enabled = call.getBool("messageCenterEnabled", false)
        pushIOHandler.setMessageCenterEnabled(enabled: enabled)
        call.resolve([:])
        
    }
    
    
    @objc func fetchMessagesForMessageCenter(_ call: CAPPluginCall) {
        
        if let messageCenter = call.getString("messageCenter") {
            pushIOHandler.fetchMessagesForMessageCenter(messageCenter: messageCenter) { error, messages in
                if let messages:[NSDictionary] =  (messages as? [PIOMCMessage])?.messageDictionary() {
                    call.resolve(["messageCenter":messageCenter,"messages":messages])
                } else if let error = error as? NSError{
                    call.resolve(["messageCenter":messageCenter,"errorReason":error.localizedDescription])
                } else {
                    call.resolve(["messageCenter":messageCenter,"messages":[]])
                }
            }
        } else {
            call.reject("Message center name is missing")
        }
            
        
    }
    
    @objc func fetchRichContentForMessage(_ call:CAPPluginCall) {
        
        if let messageId = call.getString("messageID") {
            
            pushIOHandler.fetchRichContentForMessage(messageId: messageId) { error, messageID, richContent in
                
                if let error =  error as? NSError {
                    call.resolve(["messageId":messageId,"errorReason":error.localizedDescription])
                } else {
                    var responseDictionary:[String:String] = [:];
                    responseDictionary["richContent"] = richContent;
                    responseDictionary["messageId"] = messageID;
                    call.resolve(responseDictionary)
                }
                
                
                
            }
        } else {
            call.reject("message id is reqquired to fetch rich content")
        }
    }
    
    @objc func resetMessageCenter(_ call:CAPPluginCall) {
        
        pushIOHandler.resetMessageCenter()
        call.resolve([:])
        
    }
    
    @objc func onMessageCenterViewVisible(_ call:CAPPluginCall) {
        
        pushIOHandler.onMessageCenterViewVisible()
        call.resolve(["success":""])
    }
    
    @objc func onMessageCenterViewFinish(_ call:CAPPluginCall) {
        
        pushIOHandler.onMessageCenterViewFinish()
        call.resolve(["success":""])
    }
    
    @objc func trackMessageCenterOpenEngagement(_ call:CAPPluginCall) {
        
        if let messageId = call.getString("messageID") {
            pushIOHandler.trackMessageCenterOpenEngagement(messageID: messageId)
            
        }
        
        call.result(nil)
    }

    @objc func trackMessageCenterDisplayEngagement(_ call:CAPPluginCall) {
        
        if let messageId = call.getString("messageID") {
            pushIOHandler.trackMessageCenterDisplayEngagement(messageID: messageId)
        }
    }

    
    @objc public func onMessageCenterNotificationUpdate(notification: NSNotification) {
        
        if let messageCenters:[String] = notification.object as? [String],messageCenters.count > 0 {
            
            let messagecentername  = messageCenters.joined(separator:",")
            
            self.notifyListeners("onMessageCenterUpdated", data: ["messages":messagecentername])
        }
   }

    
    @objc func onMessageCenterUpdated(_ call: CAPPluginCall) {

        self.notifyMCAsyncCallbackId = call.callbackId;
        call.keepAlive = true;
    }

    //MARK: iam-messages
    
    @objc func clearInAppMessages(_ call:CAPPluginCall) {
        pushIOHandler.clearInAppMessages();
        call.resolve([:])
        
    }
    
    @objc func setInAppFetchEnabled(_ call:CAPPluginCall) {
        let enabled = call.getBool("inAppFetchEnabled", false)
        pushIOHandler.setInAppFetchEnabled(enabled: enabled)
        call.result(enabled)
    }
    
    func isStatusBarHiddenForIAMBannerInterstitial(_ call: CAPPluginCall) {

      let status =  pushIOHandler.isStatusBarHiddenForIAMBannerInterstitial()
    call.resolve(["sucsess":status])
    }
    
    @objc func setStatusBarHiddenForIAMBannerInterstitial(_ call: CAPPluginCall) {
        
        if let status:Bool =  call.getBool("hideStatusBar") {
            pushIOHandler.setStatusBarHiddenForIAMBannerInterstitial(statusbar: status);
            call.resolve([:])
        } else {
            call.reject("hideStatusBar should be boolean")
        }
        
    }

    @objc func setInAppMessageBannerHeight(_ call: CAPPluginCall){
        if let height = call.getFloat("height") {
            pushIOHandler.setInAppMessageBannerHeight(height: height);
            call.resolve([:])
        }else {
            call.reject("provide height")
        }
    
    }

    @objc func getInAppMessageBannerHeight(_ call: CAPPluginCall) {
        let height = pushIOHandler.getInAppMessageBannerHeight();
        call.resolve(["success":NSNumber(value: height)]);
    }
    
    // MARK: Notifications
    @objc func setInterceptOpenURL(_ call: CAPPluginCall) {
        
        if let enable =  call.getBool("enabled"), enable == true{
            self.interceptCallbackId = call.callbackId;
            PushIOManager.sharedInstance().deeplinkDelegate =  self;
            call.keepAlive = true
            //call.resolve([:])
        } else {
            call.reject("failed to setInterceptOpenURL");
        }
    }
    
    // MARK: Badge
    
    @objc func getBadgeCount(_ call:CAPPluginCall) {

        DispatchQueue.main.async {
            let count = self.pushIOHandler.getBadgeCount()
            call.result(count)
        }
    }
    
    @objc func setBadgeCount(_ call:CAPPluginCall) {

        if let count = call.getInt("badgeCount") {
            pushIOHandler.setBadgeCount(count: count) { error, message in
                
                if let error =  error as? NSError {
                    call.failureCallback(error)
                } else {
                    call.resolve([:])
                }
            }
        } else {
            call.resolve(["error":"Badge Count can't be empty"])
            
        }
        
    }
    
    @objc func resetBadgeCount(_ call:CAPPluginCall) {
        
        pushIOHandler.resetBadgeCount { error, message in
            
            if let error =  error as? NSError {
                call.failureCallback(error)
            } else {
                call.resolve([:])
            }
        }
        
    }
    
    // MARK: Interactive Message
    
    @objc func clearInteractiveNotificationCategories(_ call:CAPPluginCall) {
    
        call.unavailable("Not supported in iOS.")
    }
    
    @objc func deleteInteractiveNotificationCategory(_ call:CAPPluginCall) {
    
        call.unavailable("Not supported in iOS.")
    }
    
    @objc func getInteractiveNotificationCategory(_ call:CAPPluginCall) {
    
        call.unavailable("Not supported in iOS.")
    }
    
    @objc func addInteractiveNotificationCategory(_ call:CAPPluginCall) {
    
        call.unavailable("Not supported in iOS.")
    }
    
    
    @objc func isResponsysPush(_ call:CAPPluginCall) {
        
        if let userInfo = call.getValue("remoteMessage") as? [AnyHashable:Any] {
           
           let payload =  pushIOHandler.isResponsysPush(userInfo: userInfo)
            call.successCallback(payload)
            
        } else {
            call.successCallback(false)
        }
    }
    
    @objc func handleMessage(_ call:CAPPluginCall) {
        call.unavailable()
    }
    
    // MARK: onGeoRegion

    @objc func onGeoRegionEntered(_ call:CAPPluginCall) {
        
        if let region = call.getValue("region") as? NSDictionary,let geoRegion:PIOGeoRegion = region.geoRegion() {
            
            pushIOHandler.onGeoRegionEntered(region: geoRegion) { error, response in
                var info:[String:String] = [:];
                info["regionType"] = "GEOFENCE_ENTRY";
                info["regionID"] = geoRegion.geofenceId;
                call.resolve(info)
            }
        } else {
            call.reject("region is missing")
        }

    }
    
    @objc func onGeoRegionExited(_ call:CAPPluginCall) {
    
        if let region:NSDictionary = call.getValue("region") as? NSDictionary,let geoRegion:PIOGeoRegion = region.geoRegion()  {
               
                pushIOHandler.onGeoRegionExited(region: geoRegion) { error, response in
                    var info:[String:String] = [:];
                    info["regionType"] = "GEOFENCE_EXIT";
                    info["regionID"] = geoRegion.geofenceId;
                    call.resolve(info)
                }

        } else {
            call.reject("region is missing")
        }
    
    }
    
    @objc func onBeaconRegionEntered(_ call:CAPPluginCall) {
        
        if let region = call.getValue("region") as? NSDictionary,let beacon:PIOBeaconRegion = region.beaconRegion()  {
            
            pushIOHandler.onBeaconRegionEntered(region: beacon) { error, response in
                var info:[String:String] = [:];
                info["regionType"] = "BEACON_ENTRY";
                info["regionID"] = beacon.beaconId;
                call.resolve(info)
            }
        } else {
            call.reject("region is missing")
        }
    }
    
    @objc func onBeaconRegionExited(_ call:CAPPluginCall) {
        
        if let region = call.getValue("region") as? NSDictionary,let beacon:PIOBeaconRegion = region.beaconRegion()  {
            
            pushIOHandler.onBeaconRegionExited(region: beacon) { error, response in
                var info:[String:String] = [:];
                info["regionType"] = "BEACON_EXIT";
                info["regionID"] = beacon.beaconId;
                call.resolve(info)
            }
        } else {
            call.reject("region is missing")
        }
    }
    
    @objc func setExecuteRsysWebUrl(_ call:CAPPluginCall) {
        let execute = call.getBool("flag", false)
        pushIOHandler.setExecuteRsysWebUrl(execute: execute)
        call.resolve([:])
    }
    
    @objc func getExecuteRsysWebUrl(_ call:CAPPluginCall) {
        
        let execute = pushIOHandler.getExecuteRsysWebUrl()
        call.successCallback(execute)
    }
    
    @objc func getConversionUrl(_ call:CAPPluginCall) {
        
        call.unavailable("Not supported in iOS.")
    }
    
    
    @objc func getRIAppId(_ call:CAPPluginCall) {
        
        call.unavailable("Not supported in iOS.")
    }
    
    @objc func getEngagementTimestamp(_ call:CAPPluginCall) {
        
        let timestamp = pushIOHandler.getEngagementTimestamp()
        call.successCallback(timestamp)
    }
    
    @objc func getEngagementMaxAge (_ call:CAPPluginCall) {
        
        let maxtime = pushIOHandler.getEngagementMaxAge()
        call.successCallback(maxtime)
    }
    
    @objc func resetEngagementContext (_ call:CAPPluginCall) {
        pushIOHandler.resetEngagementContext()
        call.resolve([:])
    }
    
    @objc func resetAllData (_ call:CAPPluginCall) {
        pushIOHandler.resetAllData()
        call.resolve([:])
    }
    
    @objc func onDeepLinkReceivedNotification(notification:NSNotification) {
        
        
        if let userInfo = notification.userInfo {
        
        var resolvedURLInfo:[String:String] = [:];
            
            resolvedURLInfo["deeplinkURL"] = userInfo[PIOResolvedDeeplinkURL] as? String;
            resolvedURLInfo["weblinkURL"] = userInfo[PIOResolvedWeblinkURL] as? String;
            resolvedURLInfo["requestURL"] = userInfo[PIORequestedWebURL] as? String;
            resolvedURLInfo["isPubwebURLType"] = userInfo[PIORequestedWebURLIsPubWebType] as? String;
            if let error:NSError = userInfo[PIOErrorResolveWebURL] as? NSError {
                resolvedURLInfo["error"] = error.description;
            }
            
            
            self.notifyListeners("onDeepLinkReceived", data: resolvedURLInfo)
            
      }
    }
    
    @objc func onDeepLinkReceived(_ call:CAPPluginCall) {
        self.deeplinkCallbackId = call.callbackId;
        call.keepAlive = true;
    }
    
    @objc func setDelayRichPushDisplay(_ call:CAPPluginCall) {
        
        let delay = call.getBool("enabled", false);
        pushIOHandler.setDelayRichPushDisplay(delay: delay)
        call.resolve([:])
    }
    
    @objc func showRichPushMessage(_ call:CAPPluginCall) {
        
        pushIOHandler.showRichPushMessage()
        call.resolve([:])
    }
    
    @objc func isRichPushDelaySet(_ call:CAPPluginCall) {
        
        let delay = pushIOHandler.isRichPushDelaySet()
        call.successCallback(delay)
    }    
    
}

extension PushIOManagerPlugin:PIODeepLinkDelegate {
    
    public func handleOpen(_ url: URL!) -> Bool {
        
        guard let url =  url else {
            return false
        }
        
        if #available(iOS 14.0, *) {
            os_log("[PushIOManager] [Capacitor] interceptOpenURL handleOpen : \(url)")
            if let eventlistern =  self.eventListeners {
                
                os_log("[PushIOManager] [Capacitor] interceptOpenURL handleOpen : \(eventlistern)")
            }
            
        } else {
            // Fallback on earlier versions
        };
        
        if (self.hasListeners("setInterceptOpenURL")) {
            self.notifyListeners("setInterceptOpenURL", data: ["url":url.absoluteString], retainUntilConsumed: true)
        } else {
            DispatchQueue.main.async {
                
                os_log("[PushIOManager] [Capacitor] interceptOpenURL handleOpen with main sync")
                self.notifyListeners("setInterceptOpenURL", data: ["url":url.absoluteString], retainUntilConsumed: true)
            }
        }
        
        
        return true
        
//        if let callbackId = self.interceptCallbackId, let call = self.bridge?.savedCall(withID: callbackId){
//            call.resolve(["success":url.absoluteString])
//            return true
//        } else {
//           return false
//        }
    }
    
}

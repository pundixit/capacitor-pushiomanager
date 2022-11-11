import Foundation
import Capacitor
import PushIOManager
import UserNotifications

let capacitor_pushio_errorDomain = "capacitor_pushiomanager"

@objc public class PushIOHandler: NSObject {
    
    override init() {
        
        super.init()
        
        PushIOManager.sharedInstance().notificationPresentationOptions = [.badge , .sound , .alert];
        
        NotificationCenter.default.addObserver(self, selector: #selector(openUrlHandler(notification:)), name: .capacitorOpenURL, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(universalUrlHandler(notification:)), name: .capacitorOpenUniversalLink, object: nil)
        
        NotificationCenter.default.addObserver(self,
                selector: #selector(didRegisterForRemoteNotificationsWithDeviceToken(notification:)),
                name: .capacitorDidRegisterForRemoteNotifications,
                object: nil)

        NotificationCenter.default.addObserver(self,
                selector: #selector(didFailToRegisterForRemoteNotificationsWithErro(notification:)),
                name: .capacitorDidFailToRegisterForRemoteNotifications,
                object: nil)
    }
    
    deinit {
       NotificationCenter.default.removeObserver(self)
    }
    
    @objc public func openUrlHandler(notification: NSNotification) {
        
        if let info =  notification.object as? [String:Any] {
            
            if let url:URL  = info["url"] as? URL {
                
                PushIOManager.sharedInstance().open(url, options: [:])
            }
        }
    }
    
    @objc public func universalUrlHandler(notification: NSNotification) {
        
        if let info =  notification.object as? [String:Any] {
            
            if let url:URL  = info["url"] as? URL {
              //  PushIOManager.sharedInstance().open(url, options: [:])
                
                let userActivity =  NSUserActivity(activityType: NSUserActivityTypeBrowsingWeb)
                userActivity.webpageURL = url;

                PushIOManager.sharedInstance().continue(userActivity, restorationHandler: nil);
                
                
            }
        }
    }
    
    @objc public func didRegisterForRemoteNotificationsWithDeviceToken(notification: NSNotification) {
        
        if let deviceToken = notification.object as? Data {
            PushIOManager.sharedInstance().didRegisterForRemoteNotifications(withDeviceToken: deviceToken)
        }
    
    }
    
    @objc public func didFailToRegisterForRemoteNotificationsWithErro(notification: NSNotification) {
        
        guard let error = notification.object as? Error else {
                    return
                }
        
        PushIOManager.sharedInstance().didFailToRegisterForRemoteNotificationsWithError(error)
    }
    
    @objc func getAPIKey()->String? {
        
        return PushIOManager.sharedInstance().getAPIKey()
    }
    
    @objc func getAccountToken()->String? {
        return PushIOManager.sharedInstance().getAccountToken()
    }
    
    @objc func setExternalDeviceTrackingID(trackingId:String?) {
        PushIOManager.sharedInstance().externalDeviceTrackingID = trackingId;
        
    }

    @objc func getExternalDeviceTrackingID()->String?{
        return PushIOManager.sharedInstance().externalDeviceTrackingID;
    }

    @objc func setAdvertisingID(adid:String?){
        
        PushIOManager.sharedInstance().advertisingIdentifier = adid;
    }
    
    @objc func getAdvertisingID()->String?{
        return PushIOManager.sharedInstance().advertisingIdentifier;
    }
    
    @objc func getDeviceID()->String?{
        return PushIOManager.sharedInstance().getDeviceID()
    }
    
    @objc func getLibVersion()->String?{
        return PushIOManager.sharedInstance().frameworkVersion()
    }
    
    @objc func registerUserId(userId:String?){
        
        PushIOManager.sharedInstance().registerUserID(userId)
    }

    @objc func getRegisteredUserId()->String?{
        return PushIOManager.sharedInstance().getUserID()
    }

    @objc func unregisterUserId(){
        
        PushIOManager.sharedInstance().registerUserID(nil)
    }
    
    @objc public func setLogLevel(_ level:PIOLogLevel) -> Void {
        
        PushIOManager.sharedInstance().setLogLevel(level);
    }
    
    @objc public func setLoggingEnabled(_ enabled:Bool) {
        
        PushIOManager.sharedInstance().setLoggingEnabled(enabled)
    }
    
    @objc public func setCrashLoggingEnabled(_ enabled:Bool) {
        
        PushIOManager.sharedInstance().setCrashLoggingEnabled(enabled)
    }
    
    @objc func isCrashLoggingEnabled()->Bool {
        return PushIOManager.sharedInstance().isCrashLoggingEnabled()
    }

    @objc func isSDKConfigured()->Bool {
        
        return PushIOManager.sharedInstance().isSDKConfigured()
    }
    @objc public func configure(_ filename:String?,closure:@escaping PIOCompletionHandler) throws -> Void {
        
        if let configFileName =  filename, (configFileName.count > 0 && configFileName != "") {
            
            PushIOManager.sharedInstance().configure(withFileName: filename, completionHandler: closure)
            
        } else {
            throw NSError(domain: capacitor_pushio_errorDomain, code: 100, userInfo: [NSLocalizedDescriptionKey:"Config file is invalid"])
        }
        
       
    }
    
    @objc func registerApp(_ closure:@escaping PIOCompletionHandler)throws ->Void {
        do{
            try PushIOManager.sharedInstance().registerApp(completionHandler: closure);
        } catch let error{
            throw error
        }        
    }
    
    @objc func unregisterApp(_ closure:@escaping PIOCompletionHandler) throws ->Void {
        do{
            try PushIOManager.sharedInstance().unregisterApp(completionHandler: closure)
        }catch let error{
            throw error
        }
    }
    
    @objc func registerForNotificationAuthorizations(authOptions:Int , categories:[PIONotificationCategory],_ closure:@escaping PIOCompletionHandler){
        
        PushIOManager.sharedInstance().register(forNotificationAuthorizations: UNAuthorizationOptions(rawValue: UInt(authOptions)), categories: categories, completionHandler: closure)
    }
    
    @objc func registerForAllRemoteNotificationTypes(_ closure:@escaping PIOCompletionHandler) throws ->Void {
        
        PushIOManager.sharedInstance().register(forAllRemoteNotificationTypes: closure)
        
    }

    @objc public func declarePreference(key:String, value:String, type:PIOPreferenceType, error:NSErrorPointer) -> Void  {
        
        PushIOManager.sharedInstance().declarePreference(key, label: value, type: type, error: error)

    }

    @objc public func getPreferences() -> [PIOPreference]?  {
        
        return PushIOManager.sharedInstance().getPreferences() as? [PIOPreference]
 
    }

    @objc public func getPreference(key:String) -> PIOPreference?  {
        
        return PushIOManager.sharedInstance().getPreference(key)
    }

    @objc public func setStringPreference(key:String, value:String) -> Bool  {
        
        PushIOManager.sharedInstance().setStringPreference(value, forKey: key)
    }

    @objc public func setNumberPreference(key:String, value:NSNumber) -> Bool  {

        PushIOManager.sharedInstance().setNumberPreference(value, forKey: key)
    }

    @objc public func setBooleanPreference(key:String,value:Bool) -> Bool  {

        PushIOManager.sharedInstance().setBoolPreference(value, forKey: key)
    }

    public func removePreference(key:String, error:inout NSError?) -> Void  {
        PushIOManager.sharedInstance().removePreference(key, error: &error)
    }

    @objc public func clearAllPreferences() -> Void  {

        PushIOManager.sharedInstance().clearAllPreferences()
    }
    
    @objc func trackEvent(eventName:String, properties:[String:Any]?) {
        
        PushIOManager.sharedInstance().trackEvent(eventName, properties: properties)
    }
    
    @objc func trackEngagement(metric:Int, properties:[String:Any]?,_ closure:@escaping PIOCompletionHandler) {
        
        let type:PushIOEngagementMetrics = PushIOEngagementMetrics(rawValue: UInt32(metric))
        PushIOManager.sharedInstance().trackEngagementMetric(type, withProperties: properties, completionHandler: closure)
        
    }
    
    @objc func trackConversionEvent(event:PIOConversionEvent,_ closure:@escaping PIOCompletionHandler) {
        
        PushIOManager.sharedInstance().trackConversionEvent(event, completionHandler: closure)
    }
    
    @objc func clearInAppMessages() {
        
        PushIOManager.sharedInstance().clearInAppMessages()
    }
    
    @objc func clearInteractiveNotificationCategories() {
    
    }
    
    @objc func setInAppFetchEnabled(enabled:Bool){
        
        PushIOManager.sharedInstance().setInAppMessageFetchEnabled(enabled)
    }

    @objc func isStatusBarHiddenForIAMBannerInterstitial()->Bool {

        return PushIOManager.sharedInstance().isStatusBarHiddenForIAMBannerInterstitial()

    }

    @objc func setStatusBarHiddenForIAMBannerInterstitial(statusbar:Bool) {

        PushIOManager.sharedInstance().setStatusBarHiddenForIAMBannerInterstitial(statusbar);
    }

    @objc func setInAppMessageBannerHeight(height:Float) {

        PushIOManager.sharedInstance().setInAppMessageBannerHeight(CGFloat(height))
    }

    @objc func getInAppMessageBannerHeight()->Float {
        return Float(PushIOManager.sharedInstance().getInAppMessageBannerHeight());
    }
    
    @objc func isMessageCenterEnabled()->Bool {
        return PushIOManager.sharedInstance().isMessageCenterEnabled()
    }
    
    @objc func setMessageCenterEnabled(enabled:Bool) {
        PushIOManager.sharedInstance().setMessageCenterEnabled(enabled)
    }
    
    // MARK: Badge
    @objc func getBadgeCount()->Int {
        return PushIOManager.sharedInstance().getBadgeCount()
    }
    
    @objc func setBadgeCount(count:Int,_ closure:@escaping PIOCompletionHandler) {
        
        PushIOManager.sharedInstance().setBadgeCount(count, completionHandler: closure)
    }
    
    @objc func resetBadgeCount(_ closure:@escaping PIOCompletionHandler) {
        
        PushIOManager.sharedInstance().resetBadgeCount(completionHandler: closure)
    }
    
    @objc func resetMessageCenter() {
        
        PushIOManager.sharedInstance().clearMessageCenterMessages()
    }
    
    @objc func onMessageCenterViewVisible() {
        
        PushIOManager.sharedInstance().messageCenterViewWillAppear()
    }
    
    @objc func onMessageCenterViewFinish() {
        
        PushIOManager.sharedInstance().messageCenterViewWillDisappear()
    }
    
    @objc func trackMessageCenterOpenEngagement(messageID:String) {
        
        PushIOManager.sharedInstance().trackMessageCenterOpenEngagement(messageID)
    }

    @objc func trackMessageCenterDisplayEngagement(messageID:String) {
        
        PushIOManager.sharedInstance().trackMessageCenterDisplayEngagement(messageID)
    }

    @objc func fetchMessagesForMessageCenter(messageCenter:String,_ closure:@escaping PIOMessageCenterCompletionHandler) {
        
        PushIOManager.sharedInstance().fetchMessages(forMessageCenter: messageCenter, completionHandler: closure)
    }
    
    @objc func fetchRichContentForMessage(messageId:String,_ closure:@escaping PIOMessageCenterRichcontentCompletionHandler) {
        
        PushIOManager.sharedInstance().fetchRichContent(forMessage: messageId, completionHandler: closure)
    }
    
    @objc func setDelayRegistration(_ delay:Bool) {
        
        PushIOManager.sharedInstance().delayRegistration = delay
    }
    
    @objc func isDelayRegistration()->Bool {
        
        return PushIOManager.sharedInstance().delayRegistration
    }
    
    @objc func isResponsysPush(userInfo:[AnyHashable:Any])->Bool {
        
        return PushIOManager.sharedInstance().isResponsysPayload(userInfo)
    }
    
    @objc func onGeoRegionEntered(region:PIOGeoRegion,closure:@escaping PIOCompletionHandler) {
        
        PushIOManager.sharedInstance().didEnter(region: region, closure)
    }
    
    @objc func onGeoRegionExited(region:PIOGeoRegion,closure:@escaping PIOCompletionHandler) {
        
        PushIOManager.sharedInstance().didExit(region: region, closure)
    }
    
    @objc func onBeaconRegionEntered(region:PIOBeaconRegion,closure:@escaping PIOCompletionHandler) {
        
        PushIOManager.sharedInstance().didEnter(region: region, closure)
    }
    
    @objc func onBeaconRegionExited(region:PIOBeaconRegion,closure:@escaping PIOCompletionHandler) {
        
        PushIOManager.sharedInstance().didExit(region: region, closure)
    }
    
    @objc func setExecuteRsysWebUrl(execute:Bool) {
        
        PushIOManager.sharedInstance().executeRsysWebURL =  true;
    }
    
    @objc func getExecuteRsysWebUrl()->Bool {
        
        return PushIOManager.sharedInstance().executeRsysWebURL
    }
    
    @objc func getConversionUrl() {
        
    }
    
    @objc func getRIAppId( ) {
        
    }
    
    @objc func getEngagementTimestamp()->String? {
        
       return  PushIOManager.sharedInstance().getEngagementTimeStamp()
    }
    
   func getEngagementMaxAge ()->Double {
        
        return PushIOManager.sharedInstance().getEngagementMaxAge()
    }
    
    @objc func resetEngagementContext ( ) {
        
        PushIOManager.sharedInstance().resetEngagementContext()
    }
    
    @objc func setDelayRichPushDisplay(delay:Bool) {
        
        PushIOManager.sharedInstance().setDelayRichPushDisplay(delay)
    }
    
    @objc func showRichPushMessage() {
        
        PushIOManager.sharedInstance().showRichPushMessage()
    }
    
    @objc func isRichPushDelaySet()->Bool {
    return PushIOManager.sharedInstance().isRichPushDelaySet()
    }
    
    @objc func resetAllData() {
        PushIOManager.sharedInstance().resetAllData()
    }
    
 }

extension PushIOHandler: NotificationHandlerProtocol {
    
    public func willPresent(notification: UNNotification) -> UNNotificationPresentationOptions {
        return PushIOManager.sharedInstance().notificationPresentationOptions;
    }
    
    public func didReceive(response: UNNotificationResponse) {
        
        let currentCenter =  UNUserNotificationCenter.current();
        PushIOManager.sharedInstance().userNotificationCenter(currentCenter, didReceive: response) {
        }
    }
    
}

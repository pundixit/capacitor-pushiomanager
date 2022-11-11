//
//  NotificationService.swift
//  NotificationServiceExtension
//
//  Created by Savitha on 09/11/22.
//

import UserNotifications
import PIOMediaAttachmentExtension

class NotificationService: PIOMediaAttachmentServiceExtension {

    var contentHandler: ((UNNotificationContent) -> Void)?
    var bestAttemptContent: UNMutableNotificationContent?

    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        super.didReceive(request, withContentHandler: contentHandler)
    }
    
    override func serviceExtensionTimeWillExpire() {
        // Called just before the extension will be terminated by the system.
        // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
        super.serviceExtensionTimeWillExpire()
    }

}

//
//  NotificationViewController.swift
//  NotificationContentExtension
//
//  Created by Savitha on 09/11/22.
//

import UIKit
import UserNotifications
import UserNotificationsUI
import PIOContentExtension

class NotificationViewController:  PIONotificationViewController {

    @IBOutlet var label: UILabel?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any required interface initialization here.
    }
    
    override func didReceive(_ notification: UNNotification) {
        super.didReceive(notification)
    }

}

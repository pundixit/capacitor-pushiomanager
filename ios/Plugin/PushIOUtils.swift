//
//  PushIOUtils.swift
//  OracleCapacitorPushiomanager
//
//  Created by Savitha on 14/09/22.
//

import Foundation
import PushIOManager
import Capacitor

extension NSDictionary {
    
    func geoRegion()->PIOGeoRegion? {
        
        if let geofenceId:String = self["geofenceId"] as? String,
            let geofenceName:String = self["geofenceName"] as? String,
           let zoneId:String = self["zoneId"] as? String,
           let zoneName:String = self["zoneName"] as? String,
           let source:String = self["source"] as? String,
           let dwellTime:Int = self["dwellTime"] as? Int
           
        {
            
            var speed:Double = 0;
            
            if let sp = self["speed"] as? Double  {
                speed = sp
            } else if let ds = self["deviceSpeed"] as? Double {
                speed = ds
            }
            
            var bearing:Double = 0
            
            if let bp = self["bearing"] as? Double  {
                bearing = bp
            } else if let db = self["deviceBearing"] as? Double {
                bearing = db
            }
            
            let extra:[AnyHashable : Any] = self["extra"] as? [AnyHashable : Any] ?? [:]
            
            let geoRegion = PIOGeoRegion(geofenceId: geofenceId, geofenceName: geofenceName, speed: speed, bearing: bearing, source: source, zoneId: zoneId, zoneName: zoneName, dwellTime: dwellTime, extra: extra)
            return geoRegion
        }
        return nil
    }
    
    func beaconRegion()->PIOBeaconRegion? {
        
        if let iBeaconUUID:String = self["iBeaconUUID"] as? String,
        let iBeaconMajor:Int = self["iBeaconMajor"] as? Int,
       let iBeaconMinor:Int = self["iBeaconMinor"] as? Int,
        let beaconId:String = self["beaconId"] as? String,
        let beaconName:String = self["beaconName"] as? String,
        let beaconTag:String = self["beaconTag"] as? String,
        let zoneId:String = self["zoneId"] as? String,
        let zoneName:String = self["zoneName"] as? String,
        let source:String = self["source"] as? String,
    let dwellTime:Int = self["dwellTime"] as? Int{
            
            var proximity:String = ""
            
            if let bp = self["proximity"] as? String  {
                proximity = bp
            } else if let db = self["beaconProximity"] as? String {
                proximity = db
            }
            
            let extra:[AnyHashable : Any] = self["extra"] as? [AnyHashable : Any] ?? [:]
            
            let eddyStoneId1:String? = self["eddyStoneId1"] as? String
            let eddyStoneId2:String? = self["eddyStoneId2"] as? String
            
        let beaconRegion:PIOBeaconRegion =
            PIOBeaconRegion(iBeaconUUID: iBeaconUUID, iBeaconMajor: iBeaconMajor, iBeaconMinor: iBeaconMinor, beaconId: beaconId, beaconName: beaconName, beaconTag: beaconTag, proximity: proximity, source: source, zoneId: zoneId, zoneName: zoneName, dwellTime: dwellTime, extra: extra)
            
            beaconRegion.eddyStoneId1 = eddyStoneId1;
            beaconRegion.eddyStoneId2 = eddyStoneId2;
            return beaconRegion;
        }
        return nil
    }

}
extension Dictionary where Key == String, Value:Any {
    
    
    func geoRegion()->PIOGeoRegion? {
        
        if let geofenceId:String = self["geofenceId"] as? String,
            let geofenceName:String = self["geofenceName"] as? String,
           let speed:Double = self["speed"] as? Double,
           let bearing:Double = self["bearing"] as? Double,
           let zoneId:String = self["zoneId"] as? String,
           let zoneName:String = self["zoneName"] as? String,
           let source:String = self["source"] as? String,
           let dwellTime:Int = self["dwellTime"] as? Int,
           let extra:[AnyHashable : Any] = self["extra"] as? [AnyHashable : Any]
        {
            
            
            let geoRegion = PIOGeoRegion(geofenceId: geofenceId, geofenceName: geofenceName, speed: speed, bearing: bearing, source: source, zoneId: zoneId, zoneName: zoneName, dwellTime: dwellTime, extra: extra)
            return geoRegion
        }
        return nil
    }
    
    func conversionEvent()->PIOConversionEvent? {
        
        if let orderId:String = self["orderId"] as? String,
           let orderTotal:Double = (self["orderTotal"] as? NSString)?.doubleValue,
           let orderQuantity:Int = (self["orderQuantity"] as? NSString)?.integerValue,
           let conversionType:Int = self["conversionType"] as? Int {
            
            let metric = PushIOEngagementMetrics(rawValue: UInt32(conversionType))
            let customProperties:[String:Any] = self["customProperties"] as? [String : Any] ?? [:]
            
            let event  = PIOConversionEvent(orderId: orderId, orderTotal: orderTotal, orderQuantity: orderQuantity, conversionType: metric, customProperties: customProperties)
            return event;
        }
        return nil;
        
    }
    
    func dictionaryFromPreference(preference:PIOPreference)->[String:Any]?  {
        
        guard let key = preference.key, let value:Any = preference.value, let label = preference.label else {
            
            return  nil
        }
        
        var dictionary:[String:Any] = ["key":key,"value":value,"label":label]
        
        switch preference.type {
        case PIOPreferenceType.string:
                dictionary["type"] = "STRING";
        case PIOPreferenceType.boolean:
                dictionary["type"] = "BOOLEAN";
        case PIOPreferenceType.numeric:
                dictionary["type"] = "NUMBER";
        default:
             dictionary["type"] = "STRING";
        }
        return dictionary;
    }
    
    func json()->String? {
        guard let jsonData = try? JSONSerialization.data(withJSONObject: self,
                    options: [.prettyPrinted]) else {
            return nil
        }
        return String(data: jsonData, encoding: .utf8)
    }
    
    func notificationCategory()->PIONotificationCategory? {
        
        if let identifier = self["orcl_category"] as? String, let allButtons  = self["orcl_btns"] as? [NSDictionary] {
            let oracleButtons:[NSDictionary] = allButtons;
            var actions:[PIONotificationAction] = [];
            
            for oActions in oracleButtons {
                
                if let aIdentifier:String = oActions["id"] as? String, let aTitle = oActions["label"] as? String,let aaction:String = oActions["action"] as? String {
                    if let newAction = PIONotificationAction(identifier: aIdentifier, title: aTitle, isDestructive: aaction == "DE", isForeground: aaction == "FG", isAuthenticationRequired: aaction == "AR") {
                        actions.append(newAction)
                    }
                }
            }
            
            return PIONotificationCategory(identifier: identifier, actions: actions)
        }
        
        return nil
    }
}

extension PIOPreference {
    
    func dictionaryFromPreference()->[String:Any]?  {
        
        guard let key = self.key, let value:Any = self.value, let label = self.label else {
            
            return  nil
        }
        
        var dictionary:[String:Any] = ["key":key,"value":value,"label":label]

        switch self.type {
        case PIOPreferenceType.string:
                dictionary["type"] = "STRING";
        case PIOPreferenceType.boolean:
                dictionary["type"] = "BOOLEAN";
        case PIOPreferenceType.numeric:
                dictionary["type"] = "NUMBER";
        default:
             dictionary["type"] = "STRING";
        }
        return dictionary;
    }
}

extension Sequence where Iterator.Element == NSDictionary {
    
    func notificationCategoryArray()->[PIONotificationCategory]{
      var categories:[PIONotificationCategory] = [];
    
        for categoryObj in self {
            
            if let nc:PIONotificationCategory = (categoryObj as? [String:Any])?.notificationCategory() {
                
                categories.append(nc);
            }
        }
      return categories;
    }
}

extension Sequence where Iterator.Element == PIOMCMessage {
    
    func messageDictionary()->[NSDictionary] {
        var list:[NSDictionary] = [];
        
        for message:PIOMCMessage in self {
            let messageInfo:NSMutableDictionary = NSMutableDictionary()
            
            messageInfo["messageID"] = message.messageID;
            messageInfo["subject"] = message.subject;
            messageInfo["message"] = message.message;
            messageInfo["iconURL"] = message.iconURL;
            messageInfo["messageCenterName"] = message.messageCenterName;
            messageInfo["deeplinkURL"] = message.deeplinkURL;
            messageInfo["richMessageHTML"] = message.richMessageHTML;
            messageInfo["richMessageURL"] = message.richMessageURL;
            if let sentTimestamp = message.sentTimestamp {
            messageInfo["sentTimestamp"] = self.dateToString(date:sentTimestamp)
            }
            if let expiryTimestamp = message.expiryTimestamp {
                messageInfo["expiryTimestamp"] = self.dateToString(date:expiryTimestamp)
            }
           
            messageInfo["customKeyValuePairs"] = message.customKeyValuePairs;

            
            list.append(messageInfo)
        }
        
        return list
    }
    
    func dateToString(date:Date)->String {
        
        let dateFormatter = DateFormatter()
        let enUSPOSIXLocale = Locale(identifier: "en_US_POSIX")
        dateFormatter.locale = enUSPOSIXLocale;
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
        dateFormatter.calendar = Calendar(identifier: Calendar.Identifier.gregorian)

        return dateFormatter.string(from: date)
    }
}

extension Sequence where Iterator.Element == PIOPreference {
    
    func toList()->[[String:Any]]{
      var list:[[String:Any]] = [];
        
        for preference:PIOPreference in self {
            
            if let preferenceDict = preference.dictionaryFromPreference() {
                list.append(preferenceDict)
            }
        }
        
        return list
    }
}



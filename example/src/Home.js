
import logo from './logo.svg';
import './App.css';
import React, { Component,useState,useEffect } from 'react';
import { PushIOManager,LogLevel, EngagementType,Preference} from '@oracle/capacitor-pushiomanager';
import { Capacitor } from '@capacitor/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import Messagecenter  from './Messagecenter/Messagecenter.js' ;
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { BrowserRouter as Router, Routes, Route, Link,useNavigate} from "react-router-dom";

const Container = styled.div`
background: #ffffff;
display: flex;
justify-content: center; // 1
flex-flow: column wrap; // 2
width: 100%;
height: 100%;
`;
const List = styled.div`
display: flex;
justify-content: center; // 3
flex-flow: row wrap; // 4
`;

const Card = styled.div`
margin: 20px;
background: #ffffff;
height: auto;
width: 90%;
border-radius: 20px;
border-color: #000000;
box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
display: flex;
flex-flow: column; // 5 
justify-content: center;
align-items: center;
padding: 5px 5px 5px 5px;
`;

const Header = styled.div` // 1
height: 70px;
width: 100%;
background: #fffff;
display: flex; // 2
justify-content: center; 
font-size: 14px;
margin: 10px 0px;
`;

const Info = styled.div` // 1
height: 70px;
width: 100%;
background: #fffff;
display: flex; // 2
justify-content: center; 
font-size: 14px;
padding: 10px 10px 10px 10px
`;

const CardInfo = styled.p` 
background: #fffff;
font-size: 14px;
margin: 10px 0px;
`;

const Button = styled.button`
background-color: #AB4237;
color: white;
font-size: 14px;
padding: 10px 10px;
border-radius: 5px;
margin: 10px 0px;
cursor: pointer;
width: 60%;
height: 50px;
text-align: center;
`;

const TextInput = styled.input`
height: 40;
margin: 12;
borderWidth: 1;
padding: 10;
`;



function Home () {

    const navigation =  useNavigate();

  const [userId, setuserId] = useState();
  const [badgeCount, setbadgeCount]=  useState(0);


useEffect(() => {

  PushIOManager.setLoggingEnabled({isLoggingEnabled:true});
  PushIOManager.setLogLevel({ logLevel: LogLevel.VERBOSE });
  PushIOManager.getRegisteredUserId().then( response => {
    if(response.success) {
      setuserId(response.success);
    }

  });

});


const configureApp = () => {
  const filename = "pushio_config.json";
  PushIOManager.configure({filename:filename}).then(success => {
    console.log("configure",success);
    if(success){
      toast("SDK configured successfully");
    } else {
      toast("SDK failed to configure");
    }
  }).catch(error => {
    console.log("configure error",error);
  });
};

const registerApp = () => {
if (Capacitor.getPlatform() == 'ios') {

  PushIOManager.registerForAllRemoteNotificationTypes().then( success => {
    console.log("registerForAllRemoteNotificationTypes",success);
    if(success){
       registerPushIOApp()
    } else {
      toast("SDK failed to configure");
    }
  }).catch(error => {
    console.log("App Registration failed:" + error);
  });
} else {
   registerPushIOApp()

}
};

const registerPushIOApp = () => {

PushIOManager.registerApp({useLocation:false}).then( success => {
  console.log("registerApp",success);
  if(success){
    toast("App Registration Successful");
  }  else {
    toast("App Registration failed");
  }
}).catch(error => {
  console.log('App Registration failed', error);
});

}

const handleUserIDInputChange = (e) =>
{
 setuserId(e.target.value)
}

const handleBadgeInputChange = (e) =>
{
console.log("badge count" + e.target.value);
//badgeCount =  (Number(e.target.value));

setbadgeCount(Number(e.target.value))
}

const registerUserID = () => {

 //setuserId("challa.jaisu2018@gmail.com")

if(userId) {
  PushIOManager.registerUserId({userId:userId}).then(sucess => {
    console.log("User Id Registered successfully");
},error => {
    console.log("Register UserId failed:: " + error);
}).catch(error => {
  console.log('Register UserIdt  error', error);
});
} else {
  toast("Enter UserID");
}
}



const unregisterUserID = () => {

  PushIOManager.unregisterApp();

}

const trackConversionEngagement = () => {

var props = {
  "sampleProductId": "121",
  "sampleItemCount": "5"
};

PushIOManager.trackEngagement({metric:EngagementType.PUSHIO_ENGAGEMENT_METRIC_INAPP_PURCHASE,properties:props}).then( response => {

  if (response.error) {
    toast("Engagement not reported " + response.error);
  } else {
    toast("Engagement Reported Successfully");
  }

}).catch(error => {
  toast("Engagement failed to  reported " + error);

});

}

const trackCustomEventForIAM = () => {
var eventName  = "SHOW IN-APP MSG";

PushIOManager.trackEvent({eventName:eventName, properties:null}).then( response => {

  if (response.error) {
    alert("Event not recorded: " + response.error);
  } else {
    alert(eventName + " - Event recorded successfully ");
  }
}).catch(error => {
  alert("Event not recorded: " + error);

});
}



const fetchMessages = () => {

PushIOManager.setMessageCenterEnabled({messageCenterEnabled:true});

PushIOManager.fetchMessagesForMessageCenter({messageCenter:""}).then( response => {

  if (response.messages && response.messages.length > 0) {

    navigation('/Messagecenter',{ state:{messages:response.messages}});

  } else {
    toast("No messages");
  }

}).catch(error => {
  toast("Failed to fetch messages " + error);
});
}

const trackEvent = (eventName) => {

console.log(eventName);

var props = {"Pid" : "1", "Pc": "sampleProduct"};

  PushIOManager.trackEvent({eventName:eventName, properties:props}).then(response => {

    if (response.error) {
      alert("Event not recorded:" + response.error);
    } else {
      alert(eventName + " - Event recorded successfully ");
    }
  }).catch(error => {
    alert("Event not recorded: " + error);
  });
}

const trackGeoFenceEntry = () => {

var geoRegion = {
  "geofenceId": "id1",
  'geofenceName': 'geofence1',
  'zoneName': 'zone1',
  'zoneId': 'zoneId1',
  'source': 'testsource',
  'deviceBearing': 20.0,
  'deviceSpeed': 55.5,
  'dwellTime': 25,
  'extra': {}

};

  PushIOManager.onGeoRegionEntered({region:geoRegion}).then(response => {

    if (response.error) {
      alert("Unable to report GEOFENCE_ENTRY event:" + response.error);
    } else {
      alert(response.regionType + " with -" + response.regionID + " successfully reported");
    }
  }).catch(error => {
    alert("Unable to report GEOFENCE_ENTRY event:" + error);
  });
}

const trackGeoFenceExit = () => {

var geoRegion = {
  "geofenceId": "id1",
  'geofenceName': 'geofence1',
  'zoneName': 'zone1',
  'zoneId': 'zoneId1',
  'source': 'testsource',
  'deviceBearing': 20.0,
  'deviceSpeed': 55.5,
  'dwellTime': 25,
  'extra': {}

};

  PushIOManager.onGeoRegionExited({region:geoRegion}).then(response => {

    if (response.error) {
      alert("Unable to report GEOFENCE_EXIT event:" + response.error);
    } else {
      alert(response.regionType + " with -" + response.regionID + " successfully reported");
    }
  }).catch(error => {
    alert("Unable to report GEOFENCE_EXIT event:" + error);
  });
}

const trackBeaconEntry = () => {

var beaconRegion = {
  "beaconId": "testId",
  "beaconName": "testbeaconName",
  "beaconTag": "testbeaconTag",
  "beaconProximity": "testbeaconProximity",
  "iBeaconUUID": "testiBeaconUUID",
  "iBeaconMajor": 1,
  "iBeaconMinor": 10,
  "eddyStoneId1": "testeddyStoneId1",
  "eddyStoneId2": "testeddyStoneId2",
  "zoneName": "testzoneName",
  "zoneId": "testizoneId",
  "source": "testsource",
  "dwellTime": 25,
  'extra': {}

}

  PushIOManager.onBeaconRegionEntered({region:beaconRegion}).then(response => {

    if (response.error) {
      alert("Unable to report BEACON_ENTRY event:" + response.error);
    } else {
      alert(response.regionType + " with  -" + response.regionID + " successfully reported");
    }
  }).catch(error => {
    alert("Unable to report BEACON_ENTRY event:" + error);
  });
}

const trackBeaconExit = () => {

var beaconRegion = {
  "beaconId": "testId",
  "beaconName": "testbeaconName",
  "beaconTag": "testbeaconTag",
  "beaconProximity": "testbeaconProximity",
  "iBeaconUUID": "testiBeaconUUID",
  "iBeaconMajor": 1,
  "iBeaconMinor": 10,
  "eddyStoneId1": "testeddyStoneId1",
  "eddyStoneId2": "testeddyStoneId2",
  "zoneName": "testzoneName",
  "zoneId": "testizoneId",
  "source": "testsource",
  "dwellTime": 25,
  'extra': {}

}

  PushIOManager.onBeaconRegionExited({region:beaconRegion}).then(response => {

    if (response.error) {
      alert("Unable to report BEACON_EXIT event:" + response.error);
    } else {
      alert(response.regionType + " with -" + response.regionID + " successfully reported");
    }
  }).catch(error => {
    alert("Unable to report BEACON_EXIT event:" + error);
  });
}

const setPreference = (preferenceType) => {

  const key = "sampleKey";

  PushIOManager.declarePreference({key: key,label: "Label to show in UI",type: preferenceType}).then( response => {

    if(response.error) {
      this.showToast("Preference not set:" + response.error);
    } else {

      if (preferenceType === 'Str') {
        
        onsetStringPreference(key, "Test Value");

      } else if (preferenceType === 'Num') {

        onSetNumberPreference(key, 1);
      }
      else if (preferenceType === 'Bool') {

        onSetBooleanPreference(key, 1);
      }
    }
  }).catch(error => {
    this.showToast("declarePreference failed " + error);
  });


}

const onsetStringPreference = (key, value) => {

  PushIOManager.setStringPreference({key:key, value:value}).then( response => {

    if(response.error) {
      this.showToast("Preference Not Set: " + response.error);
    } else {
      this.showToast("Preference Set Successfully");
    }
  }).catch(error => {
    this.showToast("Preference Not Set: " + error);
  });


}

const onSetNumberPreference = (key, value) => {

  PushIOManager.setNumberPreference({key:key, value:value}).then(response =>{
    if(response.error) {
      this.showToast("Preference Not Set: " + response.error);
    } else {
      this.showToast("Preference Set Successfully");
    }
   }).catch(error => {
          this.showToast("Preference Not Set: " + error);
   });
  
}


const onSetBooleanPreference = (key, value) => {

  PushIOManager.setBooleanPreference({key:key, value:value}).then(response =>{
    if(response.error) {
      this.showToast("Preference Not Set: " + response.error);
    } else {
      this.showToast("Preference Set Successfully");
    }
   }).catch(error => {
    this.showToast("Preference Not Set: " + error);
   });

}

const updateBadgeCount = () => {

PushIOManager.setBadgeCount({badgeCount:badgeCount, forceSetBadge:true}).then( response => {

  if (response.error) {
    toast("Unable to set badge count" + response.error);
  } else {
    toast("Badge count updated successfully");
  }

}).catch(error => {
  toast("Unable to set badge count" + error);
})

}

const clearInAppMessages = () => {
PushIOManager.clearInAppMessages();
}

const clearUserId = () => {
PushIOManager.unregisterUserId();
}

const clearPreference = () => {
PushIOManager.clearAllPreferences();
}

const clearMsgCenter = () => {
PushIOManager.resetMessageCenter();
}

const clearIntNotifCategories = () => {
PushIOManager.clearIntNotifCategories();
}


return (
<Container>
    {/* <Header> 
      <h1>Capacitor Sample App</h1>
    </Header> */}
    <List>
      <Info>Before proceeding, make sure you have downloaded and added the pushio_config.json file in this sample app.</Info>
    <Card>
    Setup
    <CardInfo>Set up the Responsys SDK using configure( ). Once the SDK is configured, call registerApp( ) to register your app with Responsys.</CardInfo>
    <Button onClick={ configureApp}>CONFIGURE</Button>
    <Button onClick={ registerApp}>REGISTER</Button>
    </Card>
    <Card>User Identification
      <CardInfo>Use registerUserId( ) to associate this app installation with a user (usually after login). And use unregisterUserId( ) on log out.</CardInfo>
      <TextInput value={userId} onChangeText={handleUserIDInputChange} placeholder="Enter user ID"/>
    <Button onClick={ registerUserID}>REGISTER USER ID</Button>
    <Button onClick={ unregisterUserID}>UN-REGISTER USER ID</Button>
    </Card>
    <Card>Engagements And Conversion
      <CardInfo>User actions can be attributed to a push notification using trackEngagement( )
        <br/>PushIOManager.EngagementType lists the different actions that can be attributed.</CardInfo>
      <Button onClick={ trackConversionEngagement}>TRACK CONVERSION</Button>
    </Card>
    <Card>In-App Messages
      <CardInfo>In-App Message (IAM) can be displayed via system-defined events like \$ExplicitAppOpen or custom events. IAM that use system-defined triggers are displayed automatically.
          <br/><br/>IAM can also be displayed on-demand using custom events.
          <br/><br/>Your marketing team defines a custom event in Responsys system and shares the event name with you.
          <br/><br/>The IAM is delivered to the device via push or pull mechanism (depending on your Responsys Account settings)
          <br/><br/>When you wish to display the IAM popup, call trackEvent( custom-event )</CardInfo>
      {/* <TextInput onChange={ registerApp} placeholder="Enter Custom Event Trigger"/> */}
      <Button onClick={ trackCustomEventForIAM}>SHOW IN-APP MSG</Button>
    </Card>
    <Card>Message Center
    <CardInfo>Get the Message Center message list using fetchMessagesForMessageCenter( ).
      <br/><br/>If any message has rich-content(HTML) then call fetchRichContentForMessage( ).
      <br/><br/>Remember to store these messages, since the SDK cache is purgeable.</CardInfo>
      <Button onClick={fetchMessages}>GET MESSAGES</Button>
    </Card>
    <Card>Rapid Retargeter Events
    <CardInfo>Responsys SDK supports tracking of system-defined and custom events using trackEvent( ).
      <br/><br/>For tracking custom events, you will need your Oracle CX - Infinity account to be setup for processing the incoming custom events.
      <br/><br/>Your marketing team should work with your Oracle CX contact to get his done.
      <br/><br/>The list of these events is available in the developer documentation.</CardInfo>
    <Button onClick={event => trackEvent("Browsed")}>TRACK EVENT - BROWSED</Button>
    <Button onClick={event => trackEvent("AddedItemToCart")}>TRACK EVENT - ADD TO CART</Button>
    </Card>
    <Card>Geofences And Beacons
    <CardInfo>Record Geofence and Beacon entry/exit events using these APIs.</CardInfo>
    <Button onClick={ trackGeoFenceEntry}>TRACK GEOFENCE ENTRY</Button>
    <Button onClick={ trackGeoFenceExit}>TRACK GEOFENCE EXIT</Button>
    <Button onClick={ trackBeaconEntry}>TRACK BEACON ENTRY</Button>
    <Button onClick={ trackBeaconExit}>TRACK BEACON EXIT</Button>
    </Card>
    <Card>Notification Preferences
    <CardInfo>Preferences are used to record user-choices for push notifications.
      <br/><br/>The preferences should be pre-defined in Responsys system before being used in your app.
      <br/><br/>Do not use this as a key/value store as this data is purgeable.</CardInfo>
    <Button onClick={event => setPreference("STRING")}>SET STRING PREFERENCE</Button>
    <Button onClick={event => setPreference("NUMBER")}>SET NUMBER PREFERENCE</Button>
    <Button onClick={event => setPreference("BOOLEAN")}>SET BOOLEAN PREFERENCE</Button>
    </Card>
    <Card>Set Badge Count
    <CardInfo>Use this API to set the app's icon badge count to the no. of messages in the Message Center.</CardInfo>
    <TextInput onChange={ handleBadgeInputChange} value={badgeCount} placeholder="Enter Badge Count"/>
    <Button onClick={ updateBadgeCount}>SET BADGE COUNT</Button>
    </Card>
        <Info>&#169; 2023 Oracle and/or its affiliates. All rights reserved.</Info>
    </List>
    <ToastContainer position="bottom-center" hideProgressBar={true}/>
  </Container>


);
}

export default Home;
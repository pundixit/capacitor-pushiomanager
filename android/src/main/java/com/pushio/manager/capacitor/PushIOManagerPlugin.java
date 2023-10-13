/**
 * Copyright © 2023, Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

package com.pushio.manager.capacitor;

import android.content.Context;
import android.graphics.Color;
import android.text.TextUtils;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.JSArray;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.pushio.manager.PIOBadgeSyncListener;
import com.pushio.manager.PIOBeaconRegion;
import com.pushio.manager.PIOConfigurationListener;
import com.pushio.manager.PIOConversionEvent;
import com.pushio.manager.PIOConversionListener;
import com.pushio.manager.PIOGeoRegion;
import com.pushio.manager.PIOInteractiveNotificationCategory;
import com.pushio.manager.PIOMCMessage;
import com.pushio.manager.PIOMCMessageError;
import com.pushio.manager.PIOMCMessageListener;
import com.pushio.manager.PIOMCRichContentListener;
import com.pushio.manager.PIOMessageCenterUpdateListener;
import com.pushio.manager.PIORegionCompletionListener;
import com.pushio.manager.PIORegionEventType;
import com.pushio.manager.PIORegionException;
import com.pushio.manager.PIORsysIAMHyperlinkListener;
import com.pushio.manager.PushIOManager;
import com.pushio.manager.exception.PIOMCMessageException;
import com.pushio.manager.exception.PIOMCRichContentException;
import com.pushio.manager.exception.ValidationException;
import com.pushio.manager.preferences.PushIOPreference;
import com.pushio.manager.tasks.PushIOEngagementListener;
import com.pushio.manager.tasks.PushIOListener;
import com.pushio.manager.PIODeepLinkListener;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.List;
import java.util.Map;

@CapacitorPlugin(name = "PushIOManager")
public class PushIOManagerPlugin extends Plugin {
    private static final String TAG = "pushio-capacitor";

    private PushIOManager mPushIOManager;

    @Override
    public void load() {
        mPushIOManager = PushIOManager.getInstance(getActivity().getApplicationContext());
    }

    @PluginMethod
    public void getAPIKey(PluginCall call) {
        String value = mPushIOManager.getAPIKey();
        JSObject ret = new JSObject();
        ret.put("value", value);
        call.resolve(ret);
    }

    @PluginMethod
    public void getAccountToken(PluginCall call) {
        String value = mPushIOManager.getAccountToken();
        JSObject ret = new JSObject();
        ret.put("value", value);
        call.resolve(ret);
    }

    @PluginMethod
    public void setExternalDeviceTrackingID(PluginCall call) {
        try {
            String edti = call.getString("trackingId");

            if (!TextUtils.isEmpty(edti)) {
                mPushIOManager.setExternalDeviceTrackingID(edti);
                call.resolve();
            } else {
                mPushIOManager.setExternalDeviceTrackingID(null);
                call.resolve();
            }
        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void getExternalDeviceTrackingID(PluginCall call) {
        String value = mPushIOManager.getExternalDeviceTrackingID();
        JSObject ret = new JSObject();
        ret.put("value", value);
        call.resolve(ret);
    }

    @PluginMethod
    public void setAdvertisingID(PluginCall call) {
        try {
            String adid = call.getString("adid");

            if (!TextUtils.isEmpty(adid)) {
                mPushIOManager.setAdvertisingID(adid);
                call.resolve();
            } else {
                mPushIOManager.setAdvertisingID(null);
                call.resolve();
            }
        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void overwriteApiKey(PluginCall call) {

        String apiKey = call.getString("apiKey");

        if (!TextUtils.isEmpty(apiKey)) {
            mPushIOManager.overwriteApiKey(apiKey);
            call.resolve();
        } else {
            call.reject("Error reading parameters");
        }
    }

    @PluginMethod
    public void overwriteAccountToken(PluginCall call) {
        String accountToken = call.getString("accountToken");

        if (!TextUtils.isEmpty(accountToken)) {
            mPushIOManager.overwriteAccountToken(accountToken);
            call.resolve();
        } else {
            call.reject("Error reading parameters");
        }

    }



    @PluginMethod
    public void getAdvertisingID(PluginCall call) {
        String value = mPushIOManager.getAdvertisingID();
        JSObject ret = new JSObject();
        ret.put("value", value);
        call.resolve(ret);
    }

    @PluginMethod
    public void getDeviceID(PluginCall call) {
        String value = mPushIOManager.getDeviceId();
        JSObject ret = new JSObject();
        ret.put("value", value);
        call.resolve(ret);
    }

    @PluginMethod
    public void registerUserId(PluginCall call) {
        try {
            String userId = call.getString("userId");
            if (!TextUtils.isEmpty(userId)) {
                mPushIOManager.registerUserId(userId);
                call.resolve();
            } else {
                JSObject ret = new JSObject();
                ret.put("failure","Error reading parameter");
                call.resolve(ret);
            }
        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void getRegisteredUserId(PluginCall call) {
        String value = mPushIOManager.getRegisteredUserId();
        JSObject ret = new JSObject();
        ret.put("value",value);
        call.resolve(ret);
    }

    @PluginMethod
    public void unregisterUserId(PluginCall call) {
        mPushIOManager.unregisterUserId();
        call.resolve();
    }


    @PluginMethod
    public void configure(PluginCall call) {
        String fileName = call.getString("filename");
        if (!TextUtils.isEmpty(fileName)) {
            mPushIOManager.configure(fileName, new PIOConfigurationListener() {
                @Override
                public void onSDKConfigured(Exception e) {
                    if (e == null){
                        JSObject ret = new JSObject();
                        ret.put("value","success");
                        call.resolve(ret);
                    }else{
                        call.reject(e.getMessage());
                    }
                }
            });
        } else {
            call.reject("Error reading parameters");
        }
    }

    @PluginMethod
    public void registerApp(PluginCall call) {
        Boolean isUseLocation = call.getBoolean("useLocation");
        mPushIOManager.registerPushIOListener(new PushIOListener() {
            @Override
            public void onPushIOSuccess() {
                JSObject ret = new JSObject();
                ret.put("value","success");
                call.resolve(ret);
            }

            @Override
            public void onPushIOError(String s) {
                JSObject ret = new JSObject();
                ret.put("failure",s);
                call.resolve(ret);
            }
        });
        mPushIOManager.registerApp(isUseLocation);
    }

    @PluginMethod
    public void unregisterApp(PluginCall call) {
        mPushIOManager.unregisterApp();
        call.resolve();
    }

    @PluginMethod
    public void declarePreference(PluginCall call){
        try {
            final String key = call.getString("key");
            final String label = call.getString("value");
            final String type = call.getString("type");
            if (!TextUtils.isEmpty(key) && !TextUtils.isEmpty(type)) {
                PushIOPreference.Type preferenceType = PushIOPreference.Type.valueOf(type);

                mPushIOManager.declarePreference(key, label, preferenceType);
                call.resolve();
            } else {
                JSObject ret = new JSObject();
                ret.put("failure", "Error reading parameter");
                call.resolve(ret);
            }
        } catch (ValidationException e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void getPreferences(PluginCall call) {
        List<PushIOPreference> preferences = mPushIOManager.getPreferences();
        JSObject ret = new JSObject();
        ret.put("value", PushIOManagerPluginUtils.preferencesAsJsArray(preferences));
        call.resolve(ret);
    }

    @PluginMethod
    public void getPreference(PluginCall call) {
        String key = call.getString("key");
        PushIOPreference value = mPushIOManager.getPreference(key);

        if (value != null) {
            JSObject jsonObject = new JSObject();
            try {
                jsonObject.put("key", value.getKey());
                jsonObject.put("value", value.getValue());
                jsonObject.put("label", value.getLabel());
                jsonObject.put("type", value.getKey());
                call.resolve(jsonObject);
            } catch (Exception e) {
                Log.v(TAG, "Exception: " + e.getMessage());
                call.reject(e.getMessage());
            }
        } else {
            call.reject("Preference Not found");
        }
    }

    @PluginMethod
    public void setStringPreference(PluginCall call) {

        try {
            final String key = call.getString("key");
            final String value = call.getString("value");

            if (!TextUtils.isEmpty(key)) {
                mPushIOManager.setPreference(key, value);
                call.resolve();
            } else {
                JSObject ret = new JSObject();
                ret.put("failure","Error reading parameter");
                call.resolve(ret);
            }
        } catch (ValidationException e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void setNumberPreference(PluginCall call) {
        try {
            final String key = call.getString("key");
            final Double value = call.getDouble("value");

            if (!TextUtils.isEmpty(key)) {
                mPushIOManager.setPreference(key, value);
                call.resolve();
            } else {
                JSObject ret = new JSObject();
                ret.put("failure","Error reading parameter");
                call.resolve(ret);
            }
        } catch (ValidationException e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
        
    }

    @PluginMethod
    public void setBooleanPreference(PluginCall call) {
        try {
            final String key = call.getString("key");
            final boolean value = call.getBoolean("value");

            if (!TextUtils.isEmpty(key)) {
                mPushIOManager.setPreference(key, value);
                call.resolve();
            } else {
                JSObject ret = new JSObject();
                ret.put("failure","Error reading parameter");
                call.resolve(ret);
            }
        } catch (ValidationException e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void removePreference(PluginCall call) {
        try {
            String preference = call.getString("key");

            if (!TextUtils.isEmpty(preference)) {
                mPushIOManager.removePreference(preference);
                call.resolve();
            } else {
                JSObject ret = new JSObject();
                ret.put("failure","Error reading parameter");
                call.resolve(ret);
            }
        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }


    @PluginMethod
    public void clearAllPreferences(PluginCall call) {
        mPushIOManager.clearAllPreferences();
        call.resolve();
    }

    @PluginMethod
    public void setNotificationsStacked(PluginCall call) {
        try {
            boolean bool = call.getBoolean("isNotificationStacked");
            mPushIOManager.setNotificationsStacked(bool);
            call.resolve();

        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void getNotificationStacked(PluginCall call) {
        boolean result = mPushIOManager.getNotificationStacked();
        JSObject ret = new JSObject();
        ret.put("value",result);
        call.resolve(ret);
    }

    @PluginMethod
    public void trackEvent(PluginCall call) {

        try {
            final String eventType = call.getString("eventName");
            if (!TextUtils.isEmpty(eventType)) {
                Map<String, Object> properties = null;
                final JSObject propertiesObject = call.getObject("properties");
                if (propertiesObject != null) {
                    properties = PushIOManagerPluginUtils.toMap(propertiesObject);
                }
                mPushIOManager.trackEvent(eventType, properties);
                JSObject ret = new JSObject();
                ret.put("value","success");
                call.resolve(ret);
            } else {
                JSObject ret = new JSObject();
                ret.put("failure","event value is required");
                call.resolve(ret);
            }
        } catch (JSONException e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void onMessageCenterUpdated (PluginCall call) {
        if(call != null){
            mPushIOManager.addMessageCenterUpdateListener(new PIOMessageCenterUpdateListener() {
                @Override
                public void onUpdate(List<String> messageCenters) {
                    JSObject ret = new JSObject();
                    ret.put("messageCenters", JSArray.from(messageCenters));
                    call.resolve(ret);
                }
            });
        }
    }

    @PluginMethod
    public void trackConversionEvent(PluginCall call) {

        try {          
            JSObject propertiesObject = call.getObject("event");

            PIOConversionEvent conversionEvent = new PIOConversionEvent();
            conversionEvent.setConversionType(Integer.parseInt(propertiesObject.getString("conversionType")));
            conversionEvent.setOrderId(propertiesObject.getString("orderId"));
            conversionEvent.setOrderAmount(propertiesObject.getDouble("orderTotal"));
            conversionEvent.setOrderQuantity(propertiesObject.getInt("orderQuantity"));

            if(propertiesObject.has("customProperties")){
                JSObject customPropertiesObject = propertiesObject.getJSObject("customProperties");
    
                if(customPropertiesObject != null){
                    conversionEvent.setProperties(PushIOManagerPluginUtils.toMapStr(customPropertiesObject));
                }
            }

            mPushIOManager.trackConversionEvent(conversionEvent, new PIOConversionListener() {
                @Override
                public void onSuccess() {
                    call.resolve();
                }

                @Override
                public void onFailure(Exception e) {
                    call.reject(e.getMessage());
                }
            });
        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }

    }

    @PluginMethod
    public void fetchMessagesForMessageCenter(PluginCall call) {
        try {
            String msgCenterName = call.getString("messageCenter");
            mPushIOManager.fetchMessagesForMessageCenter(msgCenterName, new PIOMCMessageListener() {
                @Override
                public void onSuccess(String messageCenter, List<PIOMCMessage> messages) {
                    JSArray messagesAsJson = PushIOManagerPluginUtils.messageCenterMessagesAsJSONArray(messages);
                    try {
                        JSObject ret = new JSObject();
                        ret.put("messageCenter", messageCenter);
                        ret.put("messages", messagesAsJson);
                        call.resolve(ret);
                    } catch (Exception e) {
                        Log.v(TAG, "Exception: " + e.getMessage());
                        call.reject(e.getMessage());
                    }
                }

                @Override
                public void onFailure(String messageCenter, PIOMCMessageError error) {
                    try {
                        JSObject ret = new JSObject();
                        ret.put("messageCenter", messageCenter);
                        ret.put("errorReason", error.getErrorMessage());
                        call.resolve(ret);
                    } catch (Exception e) {
                        Log.v(TAG, "Exception: " + e.getMessage());
                        call.reject(e.getMessage());
                    }
                }
            });
        } catch (PIOMCMessageException e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }


    @PluginMethod
    public void trackEngagement(PluginCall call){

        try {
            int metric = call.getInt("metric");
            JSObject propertiesObject = call.getObject("properties");
            Map<String, String> properties = null;
            if (propertiesObject != null) {
                properties = PushIOManagerPluginUtils.toMapStr(propertiesObject);
            }

            mPushIOManager.trackEngagement(metric, null, properties, new PushIOEngagementListener() {
                @Override
                public void onEngagementSuccess() {
                    JSObject ret = new JSObject();
                    ret.put("value","success");
                    call.resolve(ret);
                }

                @Override
                public void onEngagementError(String s) {
                    JSObject ret = new JSObject();
                    ret.put("failure",s);
                    call.resolve(ret);
                }
            });
        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
        
    }

    @PluginMethod
    public void setLogLevel(PluginCall call){

        try {

            int logLevel = call.getInt("logLevel");
            mPushIOManager.setLogLevel(logLevel);
            call.resolve();

        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
        
    }
    
    @PluginMethod
    public void setLoggingEnabled(PluginCall call){

        try {

            boolean isLoggingEnabled = call.getBoolean("isLoggingEnabled");
            mPushIOManager.setLoggingEnabled(isLoggingEnabled);
            call.resolve();

        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
        
    }
    
    @PluginMethod
    public void setCrashLoggingEnabled(PluginCall call){

        try {

            boolean isLoggingEnabled = call.getBoolean("isLoggingEnabled");

            mPushIOManager.setCrashLoggingEnabled(isLoggingEnabled);
            call.resolve();

        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
        
    } 

    @PluginMethod
    public void setInAppMessageBannerHeight(PluginCall call){
        try{
            int height = call.getInt("height");
            mPushIOManager.setInAppMessageBannerHeight(height);
        }catch(Exception e){ 
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void getInAppMessageBannerHeight(PluginCall call) {
        int  height = mPushIOManager.getInAppMessageBannerHeight();
        JSObject ret = new JSObject();
        ret.put("value",height);
        call.resolve(ret);
    }

    @PluginMethod
    public void setStatusBarHiddenForIAMBannerInterstitial(PluginCall call){
        try{
            boolean statusBarHidden = call.getBoolean("hideStatusBar");
            mPushIOManager.setStatusBarHiddenForIAMBannerInterstitial(statusBarHidden);
        }catch(Exception e){
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void isStatusBarHiddenForIAMBannerInterstitial(PluginCall call) {
        boolean  result = mPushIOManager.isStatusBarHiddenForIAMBannerInterstitial();
        JSObject ret = new JSObject();
        ret.put("value",result);
        call.resolve(ret);
    }


    @PluginMethod
    public void setNotificationSmallIconColor(PluginCall call) {
        try{
            String colorHex = call.getString("color");
            if (!TextUtils.isEmpty(colorHex)) {
                final int color = Color.parseColor(colorHex);
                mPushIOManager.setNotificationSmallIconColor(color);
            }
        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void setNotificationSmallIcon(PluginCall call) {
        try{
            String resourceName = call.getString("resourceName");
            if (!TextUtils.isEmpty(resourceName)) {

                Context context = getActivity().getApplicationContext();
                int resourceId = context.getResources().getIdentifier(
                        resourceName, "drawable", context.getPackageName());

                if (resourceId <= 0) {
                    resourceId = context.getResources().getIdentifier(
                            resourceName, "mipmap", context.getPackageName());
                }

                if (resourceId > 0) {
                    mPushIOManager.setDefaultSmallIcon(resourceId);
                }
            }

        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void setNotificationLargeIcon(PluginCall call) {

        try{
            String resourceName = call.getString("resourceName");
            if (!TextUtils.isEmpty(resourceName)) {

                Context context = getActivity().getApplicationContext();
                int resourceId = context.getResources().getIdentifier(
                        resourceName, "drawable", context.getPackageName());

                if (resourceId <= 0) {
                    resourceId = context.getResources().getIdentifier(
                            resourceName, "mipmap", context.getPackageName());
                }

                if (resourceId > 0) {
                    mPushIOManager.setDefaultLargeIcon(resourceId);
                }
            }
        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void setDefaultLargeIcon(PluginCall call) {
        try {
            int icon = call.getInt("icon");
            mPushIOManager.setDefaultLargeIcon(icon);
        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void setDefaultSmallIcon(PluginCall call) {
        try {
            int icon = call.getInt("icon");
            mPushIOManager.setDefaultSmallIcon(icon);
        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void setMessageCenterEnabled(PluginCall call) {
        try {
            boolean flag = call.getBoolean("messageCenterEnabled");
            mPushIOManager.setMessageCenterEnabled(flag);
            call.resolve();

        } catch (Exception e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void resetMessageCenter(PluginCall call) {
        mPushIOManager.resetMessageCenter();
        call.resolve();
    }

    @PluginMethod
    public void onMessageCenterViewVisible(PluginCall call) {
        try {
            mPushIOManager.onMessageCenterViewVisible();
            call.resolve();

        } catch (PIOMCMessageException e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }

    }

    @PluginMethod
    public void onMessageCenterViewFinish(PluginCall call) {
        try {
            mPushIOManager.onMessageCenterViewFinish();
            call.resolve();

        } catch (PIOMCMessageException e) {
            Log.v(TAG, "Exception: " + e.getMessage());
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void trackMessageCenterOpenEngagement(PluginCall call) {
        String messageId = call.getString("messageID");
        mPushIOManager.trackMessageCenterOpenEngagement(messageId);
        call.resolve();
    }

    @PluginMethod
    public void trackMessageCenterDisplayEngagement(PluginCall call) {
        String messageId = call.getString("messageID");
        mPushIOManager.trackMessageCenterDisplayEngagement(messageId);
        call.resolve();
    }

    @PluginMethod
    public void clearInAppMessages(PluginCall call) {
        mPushIOManager.clearInAppMessages();
        call.resolve();
    }

    @PluginMethod
    public void onGeoRegionEntered(PluginCall call) {
        PIOGeoRegion geoRegion = PushIOManagerPluginUtils.geoRegionFromJSObject(call.getObject("region"),
                PIORegionEventType.GEOFENCE_ENTRY);
        if (geoRegion != null) {
            mPushIOManager.onGeoRegionEntered(geoRegion, new PIORegionCompletionListener() {
                @Override
                public void onRegionReported(String regionId, PIORegionEventType pioRegionEventType,
                        PIORegionException e) {
                    if (e == null) {
                        JSObject ret = new JSObject();
                        ret.put("regionID", regionId);
                        ret.put("regionType", pioRegionEventType);
                        call.resolve(ret);
                    } else {
                        call.reject(e.getErrorMessage());
                    }

                }
            });
        } else {
            call.reject("Error reading geoRegion jsonArray");
        }

    }

    @PluginMethod
    public void onGeoRegionExited(PluginCall call) {
        PIOGeoRegion geoRegion = PushIOManagerPluginUtils.geoRegionFromJSObject(call.getObject("region"),
                PIORegionEventType.GEOFENCE_EXIT);
        if (geoRegion != null) {
            mPushIOManager.onGeoRegionExited(geoRegion, new PIORegionCompletionListener() {
                @Override
                public void onRegionReported(String regionId, PIORegionEventType pioRegionEventType,
                        PIORegionException e) {
                    if (e == null) {
                        JSObject ret = new JSObject();
                        ret.put("regionID", regionId);
                        ret.put("regionType", pioRegionEventType);
                        call.resolve(ret);
                    } else {
                        call.reject(e.getErrorMessage());
                    }

                }
            });
        } else {
            call.reject("Error reading geoRegion jsonArray");
        }

    }

    @PluginMethod
    public void onBeaconRegionEntered(PluginCall call) {
        PIOBeaconRegion beaconRegion = PushIOManagerPluginUtils.beaconRegionFromJSObject(call.getObject("region"),
                PIORegionEventType.BEACON_ENTRY);
        if (beaconRegion != null) {
            mPushIOManager.onBeaconRegionEntered(beaconRegion, new PIORegionCompletionListener() {
                @Override
                public void onRegionReported(String regionId, PIORegionEventType pioRegionEventType,
                        PIORegionException e) {
                    if (e == null) {
                        JSObject ret = new JSObject();
                        ret.put("regionID", regionId);
                        ret.put("regionType", pioRegionEventType);
                        call.resolve(ret);
                    } else {
                        call.reject(e.getErrorMessage());
                    }

                }
            });
        } else {
            call.reject("Error reading geoRegion jsonArray");
        }

    }

    @PluginMethod
    public void onBeaconRegionExited(PluginCall call) {
        PIOBeaconRegion beaconRegion = PushIOManagerPluginUtils.beaconRegionFromJSObject(call.getObject("region"),
                PIORegionEventType.BEACON_EXIT);
        if (beaconRegion != null) {
            mPushIOManager.onBeaconRegionExited(beaconRegion, new PIORegionCompletionListener() {
                @Override
                public void onRegionReported(String regionId, PIORegionEventType pioRegionEventType,
                        PIORegionException e) {
                    if (e == null) {
                        JSObject ret = new JSObject();
                        ret.put("regionID", regionId);
                        ret.put("regionType", pioRegionEventType);
                        call.resolve(ret);
                    } else {
                        call.reject(e.getErrorMessage());
                    }

                }
            });
        } else {
            call.reject("Error reading beaconRegion jsonArray");
        }

    }

    @PluginMethod
    public void setBadgeCount(PluginCall call) {
        int badgeCount = call.getInt("badgeCount");
        boolean forceSetBadge = call.getBoolean("forceSetBadge");
        mPushIOManager.setBadgeCount(badgeCount, forceSetBadge, new PIOBadgeSyncListener() {
            @Override
            public void onBadgeSyncedSuccess(String s) {
                JSObject ret = new JSObject();
                ret.put("success", s);
                call.resolve(ret);
            }

            @Override
            public void onBadgeSyncedFailure(String s) {
                JSObject ret = new JSObject();
                ret.put("failure", s);
                call.resolve(ret);
            }
        });
    }

    @PluginMethod
    public void getBadgeCount(PluginCall call) {
        int count = mPushIOManager.getBadgeCount();
        JSObject ret = new JSObject();
        ret.put("badgeCount", count);
        call.resolve(ret);
    }

    @PluginMethod
    public void resetBadgeCount(PluginCall call) {
        boolean forceSetBadge = call.getBoolean("forceSetBadge");
        mPushIOManager.resetBadgeCount(forceSetBadge, new PIOBadgeSyncListener() {
            @Override
            public void onBadgeSyncedSuccess(String s) {
                JSObject ret = new JSObject();
                ret.put("success", s);
                call.resolve(ret);
            }

            @Override
            public void onBadgeSyncedFailure(String s) {
                JSObject ret = new JSObject();
                ret.put("failure", s);
                call.resolve(ret);
            }
        });
    }
}

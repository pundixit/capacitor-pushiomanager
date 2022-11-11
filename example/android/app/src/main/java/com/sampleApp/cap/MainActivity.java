package com.sampleApp.cap;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.pushio.manager.capacitor.PushIOManagerPlugin;

public class MainActivity extends BridgeActivity {

    @Override
     public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PushIOManagerPlugin.class);
        super.onCreate(savedInstanceState);
     }
}

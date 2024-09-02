/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/
package org.apache.cordova.inappbrowser;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;

import org.json.JSONException;
import org.json.JSONObject;

// 2023-12-28 yoon: Volume Up/Down 이벤트 기능 추가중에  Key Event 정보를 구하기 위한 클래스선언
import android.view.KeyEvent;
import org.apache.cordova.LOG;
// 2023-12-28 yoon: Volume Up/Down 이벤트 기능 추가중에  Key Event 정보를 구하기 위한 클래스선언

/**
 * Created by Oliver on 22/11/2013.
 */
public class InAppBrowserDialog extends Dialog {
    Context context;
    InAppBrowser inAppBrowser = null;

    // 2023-12-28 yoon: volume 이벤트 전파 방지를 위한 플래그
    private boolean preventVolumeKeyEvent = false; // 볼륨 이벤트 전파 방지 여부
    // 2023-12-28 yoon: volume 이벤트 전파 방지를 위한 플래그 --- END

    // 2024-09-02 yoon: 인앱 멀티로 실행 하기 위한 인스턴스 키 정보    
    private String instanceKey;
    

    // 2024-09-02 yoon: InAppBrowserDialog 컨스트럭터에 instanceKey 추가
    public InAppBrowserDialog(Context context, int theme, String instanceKey) {
        super(context, theme);
        this.context = context;
   
        this.instanceKey = instanceKey;

    }

    public InAppBrowserDialog(Context context, int theme) {
        super(context, theme);
        this.context = context;
    }

    public void setInAppBroswer(InAppBrowser browser) {
        this.inAppBrowser = browser;
    }

    public void onBackPressed () {
        if (this.inAppBrowser == null) {
            this.dismiss();
        } else {
            // better to go through the in inAppBrowser
            // because it does a clean up
            // if (this.inAppBrowser.hardwareBack() && this.inAppBrowser.canGoBack()) {
            //     this.inAppBrowser.goBack();
            // }  else {
            //     this.inAppBrowser.closeDialog();
            // }

            // 2023-09-19 yoon: inapp backbutton event            
            this.inAppBrowser.backbutton();
            // 2023-09-19 yoon: inapp backbutton event --- END
        }
    }

    /**
     * 2023-12-28 yoon: InappBrowser 상에서 Volume Up/Down 이벤트를 수신하기 위한 이벤트 감지 추가
     */    
    public boolean onKeyDown(int keyCode, KeyEvent event) {        

        // 인앱에서 볼륨키 선택 시, 원래 볼륨키 기능을 수행 하지 않도록 이벤트 전파를 막는다.
        switch(keyCode){

            case KeyEvent.KEYCODE_VOLUME_UP:
            case KeyEvent.KEYCODE_VOLUME_DOWN:                
                
                // volume Key 이벤트를 걸었을 경우
                // 해당 이벤트만 수행하기 위해 원래의 소리 줄이고 키우는 기능을 막는다.
                if(this.preventVolumeKeyEvent == true){
                    return this.inAppBrowser.onKeyDown(keyCode, event);
                }  
                
        }

        return super.onKeyDown(keyCode, event);
        
    }
    /**
     * 2023-12-28 yoon: InappBrowser 상에서 Volume Up/Down 이벤트를 수신하기 위한 이벤트 감지 추가 --- END
     */

    public void setPreventVolumeKeyEvent(Boolean bIsPrevent){

        this.preventVolumeKeyEvent = bIsPrevent;

    }
}

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

#import <Cordova/CDVPlugin.h>
#import <Cordova/CDVInvokedUrlCommand.h>
#import <Cordova/CDVScreenOrientationDelegate.h>
#import "CDVWKInAppBrowserUIDelegate.h"
#import "CDVInAppBrowserOptions.h"
#import "CDVInAppBrowserNavigationController.h"

@class CDVWKInAppBrowserViewController;

@interface CDVWKInAppBrowser : CDVPlugin {
    UIWindow * tmpWindow;

    @private
    NSString* _beforeload;
    BOOL _waitForBeforeload;
}

@property (nonatomic, retain) CDVWKInAppBrowser* instance;
@property (nonatomic, retain) CDVWKInAppBrowserViewController* inAppBrowserViewController;
@property (nonatomic, copy) NSString* callbackId;
@property (nonatomic, copy) NSRegularExpression *callbackIdPattern;

// 2024-08-18 yoon: 인앱의 뷰컨트롤러를 여러개 저장하기 위한 변수
@property (nonatomic, readwrite, strong) NSMutableDictionary* viewControllers;

// 2024-08-27 yoon: 인앱별 콜백 ID를 저장하기 위한 변수
@property (nonatomic, readwrite, strong) NSMutableDictionary* callbackIds;

// 2024-08-27 yoon: 현재 실행 중인 뷰의 인스턴스 키
@property (nonatomic, readwrite, strong) NSString* currentInstanceKey;

+ (id) getInstance;
- (void)open:(CDVInvokedUrlCommand*)command;
- (void)close:(CDVInvokedUrlCommand*)command;
- (void)injectScriptCode:(CDVInvokedUrlCommand*)command;
- (void)show:(CDVInvokedUrlCommand*)command;
- (void)hide:(CDVInvokedUrlCommand*)command;
- (void)loadAfterBeforeload:(CDVInvokedUrlCommand*)command;

// 2024-08-29 yoon: 인앱 이벤트 핸들러에서 backbutton을 호출 하기 위한 메소드
- (void)inappBrowserBackbutton;

@end

@interface CDVWKInAppBrowserViewController : UIViewController <CDVScreenOrientationDelegate,WKNavigationDelegate,WKUIDelegate,WKScriptMessageHandler,UIAdaptivePresentationControllerDelegate>{
    @private
    CDVInAppBrowserOptions *_browserOptions;
    NSDictionary *_settings;
}

@property (nonatomic, strong) IBOutlet WKWebView* webView;
@property (nonatomic, strong) IBOutlet WKWebViewConfiguration* configuration;
@property (nonatomic, strong) IBOutlet UIBarButtonItem* closeButton;
@property (nonatomic, strong) IBOutlet UILabel* addressLabel;
@property (nonatomic, strong) IBOutlet UIBarButtonItem* backButton;
@property (nonatomic, strong) IBOutlet UIBarButtonItem* forwardButton;
@property (nonatomic, strong) IBOutlet UIActivityIndicatorView* spinner;
@property (nonatomic, strong) IBOutlet UIToolbar* toolbar;
@property (nonatomic, strong) IBOutlet CDVWKInAppBrowserUIDelegate* webViewUIDelegate;

@property (nonatomic, weak) id <CDVScreenOrientationDelegate> orientationDelegate;
@property (nonatomic, weak) CDVWKInAppBrowser* navigationDelegate;
@property (nonatomic) NSURL* currentURL;

// 2024-08-18 yoon: 뷰 컨트롤러에 부여할 인스턴스 키
@property (nonatomic) NSString* instanceKey;

// 2024-08-29 yoon: 인앱 실행 후 닫기 버튼 선택시 호출 할 hide 메소드
- (void)hide;

// 2024-08-29 yoon: 인앱의 이벤트 핸들러 중, backbutton 이벤트를 호출하기 위한 메소드
- (void)inappBrowserBackbutton;

- (void)close;
- (void)navigateTo:(NSURL*)url;
- (void)showLocationBar:(BOOL)show;
- (void)showToolBar:(BOOL)show : (NSString *) toolbarPosition;
- (void)setCloseButtonTitle:(NSString*)title : (NSString*) colorString : (int) buttonIndex;

// 2024-08-18 yoon: 뷰 컨트롤러 초기 생성시 인스턴스키 파라미터 추가
- (id)initWithBrowserOptions: (CDVInAppBrowserOptions*) browserOptions andSettings:(NSDictionary*) settings instanceKey:(NSString*)instanceKey;

@end

cordova.define("cordova-plugin-inappbrowser.inappbrowser", function(require, exports, module) {
    /*
     *
     * Licensed to the Apache Software Foundation (ASF) under one
     * or more contributor license agreements.  See the NOTICE file
     * distributed with this work for additional information
     * regarding copyright ownership.  The ASF licenses this file
     * to you under the Apache License, Version 2.0 (the
     * "License"); you may not use this file except in compliance
     * with the License.  You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing,
     * software distributed under the License is distributed on an
     * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     * KIND, either express or implied.  See the License for the
     * specific language governing permissions and limitations
     * under the License.
     *
     */
    
    (function () {
        const exec = require('cordova/exec');
        const channel = require('cordova/channel');
        const modulemapper = require('cordova/modulemapper');
        const urlutil = require('cordova/urlutil');
    
        // 자리수 만큼 랜덤
        function getRandomKey(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
            }
            return result;
        }
    
        function InAppBrowser () {
            this.channels = {
                beforeload: channel.create('beforeload'),
                loadstart: channel.create('loadstart'),
                loadstop: channel.create('loadstop'),
                loaderror: channel.create('loaderror'),
                exit: channel.create('exit'),
                customscheme: channel.create('customscheme'),
                message: channel.create('message'),
                download: channel.create('download'),
    
                // 2023-09-19 yoon: backbutton event 추가            
                backbutton: channel.create('backbutton'),
                
                // 2023-12-28 yoon: volume up/down event 추가
                volumeupbutton: channel.create('volumeupbutton'),
                volumedownbutton: channel.create('volumedownbutton')
                // 2023-12-28 yoon: volume up/down event 추가 --- END
            };
    
            // 2024-08-18 yoon: 내부 인스턴스 키
            this.instanceKey = getRandomKey(30);
        }
    
        InAppBrowser.prototype = {
            _eventHandler: function (event) {
                if (event && event.type in this.channels) {
                    if (event.type === 'beforeload') {
                        this.channels[event.type].fire(event, this._loadAfterBeforeload);
                    } else {
                        this.channels[event.type].fire(event);
                    }
                }
            },
            _loadAfterBeforeload: function (strUrl) {
                strUrl = urlutil.makeAbsolute(strUrl);
                exec(null, null, 'InAppBrowser', 'loadAfterBeforeload', [strUrl]);
            },
            close: function (eventname) {
    
                // 2024-08-18 yoon: close 할 때, 내부 인스턴스 키를 던진다.
                let sInstanceKey = this.instanceKey;
    
                exec(null, null, 'InAppBrowser', 'close', [sInstanceKey]);
            },
            show: function (eventname) {
                
                // 2024-08-18 yoon: show 할 때, 내부 인스턴스 키를 던진다.
                let sInstanceKey = this.instanceKey;
    
                exec(null, null, 'InAppBrowser', 'show', [sInstanceKey]);
    
            },
            hide: function (eventname) {
    
                // 2024-08-18 yoon: hide 할 때, 내부 인스턴스 키를 던진다.
                let sInstanceKey = this.instanceKey;
    
                exec(null, null, 'InAppBrowser', 'hide', [sInstanceKey]);
            },
            addEventListener: function (eventname, f) {
                if (eventname in this.channels) {
                    this.channels[eventname].subscribe(f);
                }
            },
            removeEventListener: function (eventname, f) {
                if (eventname in this.channels) {
                    this.channels[eventname].unsubscribe(f);
                }
            },
    
            executeScript: function (injectDetails, cb) {
                if (injectDetails.code) {
                    exec(cb, null, 'InAppBrowser', 'injectScriptCode', [injectDetails.code, !!cb]);
                } else if (injectDetails.file) {
                    exec(cb, null, 'InAppBrowser', 'injectScriptFile', [injectDetails.file, !!cb]);
                } else {
                    throw new Error('executeScript requires exactly one of code or file to be specified');
                }
            },
    
            insertCSS: function (injectDetails, cb) {
                if (injectDetails.code) {
                    exec(cb, null, 'InAppBrowser', 'injectStyleCode', [injectDetails.code, !!cb]);
                } else if (injectDetails.file) {
                    exec(cb, null, 'InAppBrowser', 'injectStyleFile', [injectDetails.file, !!cb]);
                } else {
                    throw new Error('insertCSS requires exactly one of code or file to be specified');
                }
            },
    
            addDownloadListener: function (success, error) {
                exec(success, error, 'InAppBrowser', 'downloadListener');
            },
    
            getInstanceKey : function(){
                return this.instanceKey;    
            }
        };
    
        module.exports = function (strUrl, strWindowName, strWindowFeatures, callbacks) {
            // Don't catch calls that write to existing frames (e.g. named iframes).
            if (window.frames && window.frames[strWindowName]) {
                const origOpenFunc = modulemapper.getOriginalSymbol(window, 'open');
                return origOpenFunc.apply(window, arguments);
            }
    
            strUrl = urlutil.makeAbsolute(strUrl);
            const iab = new InAppBrowser();
    
            callbacks = callbacks || {};
            for (const callbackName in callbacks) {
                iab.addEventListener(callbackName, callbacks[callbackName]);
            }
    
            const cb = function (eventname) {
                iab._eventHandler(eventname);
            };
    
            strWindowFeatures = strWindowFeatures || '';
    
            // exec(cb, cb, 'InAppBrowser', 'open', [strUrl, strWindowName, strWindowFeatures]);
    
            // 2024-08-18 yoon: open 시 내부 인스턴스 키를 던진다.
            exec(cb, cb, 'InAppBrowser', 'open', [strUrl, strWindowName, strWindowFeatures, iab.instanceKey]);
            
            return iab;
        };
    })();
    
});    
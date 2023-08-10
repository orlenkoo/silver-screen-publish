var SilverScreen;
(function (SilverScreen) {
    class Theoplayer {
        constructor() {
            this.watchUrl = $("#watchUrl").val();
            this.isLiveEvent = $("#projectIsLiveEvent").val() == "1";
            this.projectTitle = $("#projectTitle").val();
            this.youboraAccountCode = $("#youboraAccountCode").val();
            this.crossOriginSetting = $("#crossOriginSetting").val();
            this.backgroundPoster = $("#backgroundPoster").val();
            this.nativePlayback = $("#nativePlayback").val() == "true";
            this.DRMEnabled = $("#DRMEnabled").val() == "true";
            this.HLSLicenseAcquisitionURL = $("#HLSLicenseAcquisitionURL").val();
            this.HLSCertificateURL = $("#HLSCertificateURL").val();
            this.DASHWidevineLicenseAcquisitionURL = $("#DASHWidevineLicenseAcquisitionURL").val();
            this.DASHPlayreadyLicenseAcquisitionURL = $("#DASHPlayreadyLicenseAcquisitionURL").val();
            this.DASHStreamUrl = $("#DASHStreamUrl").val();
            this.enableAnalytics = $("#youboraDisabled").val() != "true";
            this.element = document.querySelector(".theoplayer-container");
            this.PlayerKey = $("#PlayerKey").val();
        }
        get isPlaying() {
            if (this.player && this.player.readyState > 0)
                return true;
            else
                return false;
        }
        initialize() {
            this.player = new THEOplayer.Player(this.element, {
                libraryLocation: "https://cdn.myth.theoplayer.com/" + this.PlayerKey,
                license: "sZP7IYe6T6Pg3KBoIleoTOke3D0_FSai3SB-CS3l0OkK0LAe0L313K0t3Da6FOPlUY3zWokgbgjNIOf9flCz3lfzIuI6FSgg0l0-3uRcTOz_IuBiFS5rCKxKCSeL3DCt3mfVfK4_bQgZCYxNWoryIQXzImf90SCt0Sb_TSCi0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lCrTS5k3lCz3u0kFOPeWok1dDrLYtA1Ioh6TgV6CKgzWDjodD_-Co3zIY3zFG0LFK4kFD3gWGxZCDi-0mr1WDX9Wor1Ut0pCoj-f6i6CoX-CoXLUOreImfVfK3-Ct3zFKxgf6i6It4gbtxVdY3zFKcNUKh6FOPVWo31WQ1qbta6FOPVU6reWo37CDXLFKrVf6i6WYCpIQk7FKxgf6i6bogVUK4ZFY3lbK4gW6reImfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikfgzVfG3gWKxydDkibK4LbogqW6f9UwPkIYz"
            });
            var source = {
                sources: [{
                        "src": this.watchUrl,
                        "type": "application/x-mpegurl",
                        "lowLatency": false,
                        "crossOrigin": this.crossOriginSetting
                    }]
            };
            if (this.nativePlayback && navigator.userAgent.indexOf("Safari") != -1 && navigator.vendor.indexOf("Apple") > -1) {
                source.sources[0].useNativePlayback = true;
            }
            if (this.enableAnalytics) {
                source.analytics = [{
                        "integration": "youbora",
                        "accountCode": this.youboraAccountCode,
                        "enableAnalytics": this.enableAnalytics,
                        "username": "THEO",
                        "content.title": this.projectTitle,
                        "content.isLive": this.isLiveEvent
                    }];
            }
            if (this.DRMEnabled) {
                if (this.isIOS()) {
                    source.sources[0].contentProtection = {
                        "integration": "ezdrm",
                        "fairplay": {
                            "licenseAcquisitionURL": this.HLSLicenseAcquisitionURL,
                            "certificateURL": this.HLSCertificateURL
                        }
                    };
                }
                else {
                    source.sources[0].src = this.DASHStreamUrl;
                    source.sources[0].type = "application/dash+xml";
                    source.sources[0].contentProtection = {
                        "integration": "ezdrm",
                        "playready": {
                            "licenseAcquisitionURL": this.DASHPlayreadyLicenseAcquisitionURL
                        },
                        "widevine": {
                            "licenseAcquisitionURL": this.DASHWidevineLicenseAcquisitionURL
                        }
                    };
                }
            }
            if (this.backgroundPoster) {
                source.poster = this.backgroundPoster;
            }
            this.player.source = source;
        }
        stop() {
            this.player.stop();
        }
        isIOS() {
            var appleDevices = [
                'iPad Simulator',
                'iPhone Simulator',
                'iPod Simulator',
                'iPad',
                'iPhone',
                'iPod',
                'Safari',
                'Mac'
            ];
            var platform = navigator.platform;
            for (var i = 0, len = appleDevices.length; i < len; i++) {
                if (platform.indexOf(appleDevices[i]) > -1)
                    return true;
            }
            if (navigator.userAgent.includes("Mac") && "ontouchend" in document)
                return true;
            return false;
        }
    }
    SilverScreen.Theoplayer = Theoplayer;
})(SilverScreen || (SilverScreen = {}));
window["silver-screen-player"] = new SilverScreen.Theoplayer();
//# sourceMappingURL=theoplayer.js.map
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
        initialize() {
            this.player = new THEOplayer.Player(this.element, {
                libraryLocation: "https://cdn.myth.theoplayer.com/" + this.PlayerKey,
                license: "sZP7IYe6T6P6TSx63Kar36k10lg1FSxe3oa-CK0_CZzZIQBkCKazClerTQ06FOPlUY3zWokgbgjNIOf9fl0kIlbtIKP1FSgeISC-3Qfr3mz_0LP6FS4eIlIKIKai0uBc0mfVfK4_bQgZCYxNWoryIQXzImf90SCZ3u0k3l5i0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lBr0uR_TuRL3LRLFOPeWok1dDrLYtA1Ioh6TgV6UQ1gWtAVCYggb6rlWoz6FOPVWo31WQ1qbta6FOfJf6i6bogVUK4ZFY3lbK4gW6reImPUFOPeWok1dDrLYt3qUYPlImf9DZPzdQ4qbQc1sD4ZFK3qWmfVfKcqCoXVdQjLUOfVf6E6FOPLdDcoIYf-bo3ZID4pFKxgfgzVfG3edt06TgV6dwx-Wuh6Ymi6bo4pIXjNWYAZIY3LdDjpflNzbG4gya"
            });
            var source = {
                sources: [{
                        "src": this.watchUrl,
                        "type": "application/x-mpegurl",
                        "crossOrigin": this.crossOriginSetting
                    }]
            };
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
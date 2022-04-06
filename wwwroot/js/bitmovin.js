var SilverScreen;
(function (SilverScreen) {
    class BitmovinPlayer {
        constructor() {
            this.watchUrl = $("#watchUrl").val();
            this.isLiveEvent = $("#projectIsLiveEvent").val() == "1";
            this.projectKey = $("#projectKey").val();
            this.projectTitle = $("#projectTitle").val();
            this.crossOriginSetting = $("#crossOriginSetting").val();
            this.backgroundPoster = $("#backgroundPoster").val();
            this.DRMEnabled = $("#DRMEnabled").val() == "true";
            this.HLSLicenseAcquisitionURL = $("#HLSLicenseAcquisitionURL").val();
            this.HLSCertificateURL = $("#HLSCertificateURL").val();
            this.DASHWidevineLicenseAcquisitionURL = $("#DASHWidevineLicenseAcquisitionURL").val();
            this.DASHPlayreadyLicenseAcquisitionURL = $("#DASHPlayreadyLicenseAcquisitionURL").val();
            this.DASHStreamUrl = $("#DASHStreamUrl").val();
            this.element = document.querySelector(".theoplayer-container");
            this.PlayerKey = $("#PlayerKey").val();
        }
        initialize() {
            var playerConfig = {
                "key": this.PlayerKey,
                "playback": {
                    "autoplay": false
                },
                "analytics": {
                    "key": "09E1151E-22F9-42E9-BABA-4A697367850F",
                    "videoId": this.projectKey,
                    "title": this.projectTitle
                },
            };
            this.player = new bitmovin.player.Player(this.element, playerConfig);
            this.player.on("playing", () => {
                $(".video-js").addClass("vjs-has-started");
                $(".video-js").removeClass("vjs-paused");
            });
            this.player.on("paused", () => {
                $(".video-js").addClass("vjs-paused");
            });
            const sourceConfig = {
                //"title": "Default Demo Source Config",
                //"description": "Select another example in \"Step 4 - Load a Source\" to test it here",
                //"dash": "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
                "hls": this.watchUrl,
                //"smooth": "https://test.playready.microsoft.com/smoothstreaming/SSWSS720H264/SuperSpeedway_720.ism/manifest",
                //"progressive": "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/MI201109210084_mpeg-4_hd_high_1080p25_10mbits.mp4",
                "poster": this.backgroundPoster
            };
            this.player.load(sourceConfig);
        }
        stop() {
            this.player.unload();
        }
    }
    SilverScreen.BitmovinPlayer = BitmovinPlayer;
})(SilverScreen || (SilverScreen = {}));
window["silver-screen-player"] = new SilverScreen.BitmovinPlayer();
//# sourceMappingURL=bitmovin.js.map
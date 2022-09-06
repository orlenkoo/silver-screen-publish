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
            this.youboraDisabled = $("#youboraDisabled").val();
        }
        get isPlaying() {
            if (this.player && this.player.isPlaying())
                return true;
            else
                return false;
        }
        initialize() {
            if (this.youboraDisabled == "true") {
                var playerConfig = {
                    "key": this.PlayerKey,
                    "playback": {
                        "autoplay": false
                    },
                    "analytics": {},
                };
            } else {
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
            }
            this.player = new bitmovin.player.Player(this.element, playerConfig);
            this.uiManager = new bitmovin.playerui.UIManager(this.player, this.createUIContainer());

            this.player.on("playing", () => {
                $(".video-js").addClass("vjs-has-started");
                $(".video-js").removeClass("vjs-paused");
            });
            this.player.on("paused", () => {
                $(".video-js").addClass("vjs-paused");
            });
            let sourceConfig = {
                "hls": this.watchUrl,
                "poster": this.backgroundPoster,
            };
            if (this.DRMEnabled) {
                sourceConfig.dash = this.DASHStreamUrl;
                sourceConfig.drm = {
                    widevine: {
                        LA_URL: this.DASHWidevineLicenseAcquisitionURL
                    },
                    playready: {
                        LA_URL: this.DASHPlayreadyLicenseAcquisitionURL
                    },
                    fairplay: {
                        LA_URL: this.HLSLicenseAcquisitionURL,
                        certificateURL: this.HLSCertificateURL,
                        prepareContentId: function (contentId) {
                            var uri = contentId;
                            var uriParts = uri.split('://', 1);
                            var protocol = uriParts[0].slice(-3);
                            uriParts = uri.split(';', 2);
                            contentId = uriParts.length > 1 ? uriParts[1] : '';
                            return protocol.toLowerCase() == 'skd' ? contentId : '';
                        },
                        prepareLicenseAsync: function (ckc) {
                            return new Promise(function (resolve, reject) {
                                var reader = new FileReader();
                                reader.addEventListener('loadend', function () {
                                    var array = new Uint8Array(reader.result);
                                    resolve(array);
                                });
                                reader.addEventListener('error', function () {
                                    reject(reader.error);
                                });
                                reader.readAsArrayBuffer(ckc);
                            });
                        },
                        prepareMessage: function (event, session) {
                            return new Blob([event.message], { type: 'application/octet-binary' });
                        },
                        headers: [{
                                name: 'content-type',
                                value: 'application/octet-stream'
                            }],
                        useUint16InitData: true,
                        licenseResponseType: 'blob'
                    }
                };
            }
            this.player.load(sourceConfig);
        }
        stop() {
            this.player.unload();
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
        createUIContainer() {
            let subtitleOverlay = new bitmovin.playerui.SubtitleOverlay();

            let settingsPanel = new bitmovin.playerui.SettingsPanel({
                components: [
                    new bitmovin.playerui.SettingsPanelPage({
                        components: [
                            new bitmovin.playerui.SettingsPanelItem('Video Quality', new bitmovin.playerui.VideoQualitySelectBox()),
                            new bitmovin.playerui.SettingsPanelItem('Speed', new bitmovin.playerui.PlaybackSpeedSelectBox()),
                            new bitmovin.playerui.SettingsPanelItem('Audio Quality', new bitmovin.playerui.AudioQualitySelectBox()),
                        ],
                    }),
                ],
                hidden: true,
            });

            let subtitleListBox = new bitmovin.playerui.SubtitleListBox();

            let subtitleListBoxSettingsPanelPage = new bitmovin.playerui.SettingsPanelPage({
                components: [
                    new bitmovin.playerui.SettingsPanelItem(null, subtitleListBox),
                ],
            });

            let subtitleSettingsPanel = new bitmovin.playerui.SettingsPanel({
                components: [
                    subtitleListBoxSettingsPanelPage,
                ],
                hidden: true,
                pageTransitionAnimation: false,
            });

            let subtitleSettingsPanelPage = new bitmovin.playerui.SubtitleSettingsPanelPage({
                settingsPanel: subtitleSettingsPanel,
                overlay: subtitleOverlay,
            });

            let subtitleSettingsOpenButton = new bitmovin.playerui.SettingsPanelPageOpenButton({
                targetPage: subtitleSettingsPanelPage,
                container: subtitleSettingsPanel,
                text: 'Settings',
                cssClasses: ['customization-open-button']
            });

            subtitleListBoxSettingsPanelPage.addComponent(
                new bitmovin.playerui.SettingsPanelItem(null, subtitleSettingsOpenButton, {
                    cssClasses: ['subtitle-customization-settings-panel-item']
                })
            );
            subtitleSettingsPanel.addComponent(subtitleSettingsPanelPage);

            let audioTrackListBox = new bitmovin.playerui.AudioTrackListBox();
            let audioTrackSettingsPanel = new bitmovin.playerui.SettingsPanel({
                components: [
                    new bitmovin.playerui.SettingsPanelPage({
                        components: [
                            new bitmovin.playerui.SettingsPanelItem(null, audioTrackListBox),
                        ],
                    }),
                ],
                hidden: true,
            });

            let controlBar = new bitmovin.playerui.ControlBar({
                components: [
                    audioTrackSettingsPanel,
                    subtitleSettingsPanel,
                    settingsPanel,
                    new bitmovin.playerui.Container({
                        components: [
                            new bitmovin.playerui.PlaybackTimeLabel({ timeLabelMode: bitmovin.playerui.PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
                            new bitmovin.playerui.SeekBar({ label: new bitmovin.playerui.SeekBarLabel() }),
                            new bitmovin.playerui.PlaybackTimeLabel({ timeLabelMode: bitmovin.playerui.PlaybackTimeLabelMode.TotalTime, cssClasses: ['text-right'] }),
                        ],
                        cssClasses: ['controlbar-top'],
                    }),
                    new bitmovin.playerui.Container({
                        components: [
                            new bitmovin.playerui.PlaybackToggleButton(),
                            new bitmovin.playerui.VolumeToggleButton(),
                            new bitmovin.playerui.VolumeSlider(),
                            new bitmovin.playerui.Spacer(),
                            new bitmovin.playerui.PictureInPictureToggleButton(),
                            new bitmovin.playerui.AirPlayToggleButton(),
                            new bitmovin.playerui.CastToggleButton(),
                            new bitmovin.playerui.VRToggleButton(),
                            new bitmovin.playerui.SettingsToggleButton({
                                settingsPanel: audioTrackSettingsPanel,
                                cssClass: 'ui-audiotracksettingstogglebutton',
                            }),
                            new bitmovin.playerui.SettingsToggleButton({
                                settingsPanel: subtitleSettingsPanel,
                                cssClass: 'ui-subtitlesettingstogglebutton',
                            }),
                            new bitmovin.playerui.SettingsToggleButton({ settingsPanel: settingsPanel }),
                            new bitmovin.playerui.FullscreenToggleButton(),
                        ],
                        cssClasses: ['controlbar-bottom'],
                    }),
                ],
            });

            return new bitmovin.playerui.UIContainer({
                components: [
                    subtitleOverlay,
                    new bitmovin.playerui.BufferingOverlay(),
                    new bitmovin.playerui.PlaybackToggleOverlay(),
                    new bitmovin.playerui.CastStatusOverlay(),
                    controlBar,
                    new bitmovin.playerui.TitleBar(),
                    new bitmovin.playerui.RecommendationOverlay(),
                    new bitmovin.playerui.Watermark(),
                    new bitmovin.playerui.ErrorMessageOverlay(),
                ],
            });
        }
    }
    SilverScreen.BitmovinPlayer = BitmovinPlayer;
})(SilverScreen || (SilverScreen = {}));
window["silver-screen-player"] = new SilverScreen.BitmovinPlayer();
//# sourceMappingURL=bitmovin.js.map
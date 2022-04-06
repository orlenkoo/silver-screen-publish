var HLS_STREAM_URL = "https://ingest10.cmcst.de/drmtest/ngrp:stream_drmtest/playlist.m3u8";
var LICENSE_KEY_URL_FAIRPLAY = "https://fps.ezdrm.com/demo/play.asp";
var CERTIFICATE_URL = "https://cc-drm.s3.eu-west-2.amazonaws.com/fairplay.cer";
var DASH_STREAM_URL = "https://ingest10.cmcst.de/drmtest/ngrp:stream_drmtest/manifest.mpd";
var LICENSE_KEY_URL_PLAYREADY = "https://playready.ezdrm.com/cency/preauth.aspx?pX=76D593";
var LICENSE_KEY_URL_WIDEVINE = "https://widevine-dash.ezdrm.com/proxy?pX=76D593";
var player;

setValues();
testPlayer();

function testPlayer() {
    $("#btnUpdate").off('click').on('click', function () { updateSettings(); });

    const element = document.querySelector(".theoplayer-container");

    player = new THEOplayer.Player(element, {
        libraryLocation: "https://cdn.myth.theoplayer.com/ace1f596-e2d4-4b2e-8b94-abf9e706ca7d",
        license: "sZP7IYe6T6P6TSx63Kar36k10lg1FSxe3oa-CK0_CZzZIQBkCKazClerTQ06FOPlUY3zWokgbgjNIOf9fl0kIlbtIKP1FSgeISC-3Qfr3mz_0LP6FS4eIlIKIKai0uBc0mfVfK4_bQgZCYxNWoryIQXzImf90SCZ3u0k3l5i0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lBr0uR_TuRL3LRLFOPeWok1dDrLYtA1Ioh6TgV6UQ1gWtAVCYggb6rlWoz6FOPVWo31WQ1qbta6FOfJf6i6bogVUK4ZFY3lbK4gW6reImPUFOPeWok1dDrLYt3qUYPlImf9DZPzdQ4qbQc1sD4ZFK3qWmfVfKcqCoXVdQjLUOfVf6E6FOPLdDcoIYf-bo3ZID4pFKxgfgzVfG3edt06TgV6dwx-Wuh6Ymi6bo4pIXjNWYAZIY3LdDjpflNzbG4gya"
    });

    if (isIOS()) {
        console.log("Using HLS");
        $("#playerUsing").text("HLS");

        let drmConfiguration = {
            "integration": "ezdrm",
            "fairplay": {
                "licenseAcquisitionURL": LICENSE_KEY_URL_FAIRPLAY,
                "certificateURL": CERTIFICATE_URL
            }
        };
        player.source = {
            "sources": {
                "src": HLS_STREAM_URL,
                "type": "application/x-mpegurl",
                "contentProtection": drmConfiguration
            }
        }
    } else {
        console.log("Using DASH");
        $("#playerUsing").text("DASH");

        let drmConfiguration = {
            "integration": "ezdrm",
            "playready": {
                "licenseAcquisitionURL": LICENSE_KEY_URL_PLAYREADY
            },
            "widevine": {
                "licenseAcquisitionURL": LICENSE_KEY_URL_WIDEVINE
            }
        };
        player.source = {
            "sources": {
                "src": DASH_STREAM_URL,
                "type": "application/dash+xml",
                "contentProtection": drmConfiguration
            }
        }

    }
    console.log(JSON.stringify(player));
    console.log(player.source);

    function isIOS() {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].indexOf(navigator.platform) > -1
            // iPad on iOS 13 detection
            || (navigator.userAgent.indexOf("Mac") > -1 && "ontouchend" in document)
    }
}

function setValues() {
    $("#HLS_STREAM_URL").val(HLS_STREAM_URL);
    $("#LICENSE_KEY_URL_FAIRPLAY").val(LICENSE_KEY_URL_FAIRPLAY);
    $("#CERTIFICATE_URL").val(CERTIFICATE_URL);
    $("#DASH_STREAM_URL").val(DASH_STREAM_URL);
    $("#LICENSE_KEY_URL_PLAYREADY").val(LICENSE_KEY_URL_PLAYREADY);
    $("#LICENSE_KEY_URL_WIDEVINE").val(LICENSE_KEY_URL_WIDEVINE);
}

function updateSettings() {
    HLS_STREAM_URL = $("#HLS_STREAM_URL").val();
    LICENSE_KEY_URL_FAIRPLAY = $("#LICENSE_KEY_URL_FAIRPLAY").val();
    CERTIFICATE_URL = $("#CERTIFICATE_URL").val();
    DASH_STREAM_URL = $("#DASH_STREAM_URL").val();
    LICENSE_KEY_URL_PLAYREADY = $("#LICENSE_KEY_URL_PLAYREADY").val();
    LICENSE_KEY_URL_WIDEVINE = $("#LICENSE_KEY_URL_WIDEVINE").val();

    testPlayer();
}
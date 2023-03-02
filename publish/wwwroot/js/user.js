var userKey;
var projectKey;
var userChatKey;
var chatMode;
var nickNameMode;
var eventBriteKey;
var player = window["silver-screen-player"];
var clientHosted;
var heartBeatInterval;
var hbInterval;
var viewCookieKey;
var interval = 0;

$(function () {
    userKey = $("#userKey").val();
    projectKey = $("#projectKey").val();
    userChatKey = $("#userChatKey").val();
    chatMode = $("#chatMode").val();
    nickNameMode = $("#nickNameMode").val();
    eventBriteKey = $("#eventBriteKey").val();
    clientHosted = $("#clientHosted").val() == "true";
    heartBeatInterval = $("#heartBeatInterval").val();
    viewCookieKey = $("#viewCookieKey").val();

    if ($(".has-countdown").length > 0) {
        startCountdown();
    } else {
        if (!clientHosted)
            player.initialize();

        prepareChat();
    }

    startDynamicEventHub();
});

function bindNickNameChooser() {
    $(".js-pick-nickname-click").on("click", chooseNickname);

    function chooseNickname(e) {
        e.preventDefault();

        var nick = $("#nickname").val();
        if (!nick)
            return;

        $.ajax({
            type: "POST",
            url: "/pick-nickname/" + projectKey,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                name: nick
            }),
            success: function (response) {
                $("#userKey").val(response.key);
                $("#chatkey").val(response.chatKey);
                userKey = response.key;
                userChatKey = response.chatKey;
                if (response.messages && response.messages.length > 0) {
                    for (var i = 0; i < response.messages.length; i++) {
                        var replyHtml = getMessageHtml(response.messages[i]);
                        $(".questions").append(replyHtml);
                    }
                }

                $(".pick-nickname-form").hide();
                $(".nick-name-chooser").removeClass("nick-name-chooser");
                $(".ask-question-form").show();

                startHub(true);
            },
            error: function (response) {
                let error = "An error occurred";
                if (response.responseJSON && response.responseJSON.error)
                    error = response.responseJSON.error;

                $(".pick-nickname-form input").addClass("is-invalid");
                $(".pick-nickname-form form-label").addClass("text-danger");
                $(".nickname-error").text(error);
            }
        });
    }
}


function getMessageHtml(reply) {
    var replyHtml = $("<div class='message reply " + (reply.fromModerator ? "from-moderator" : "") +"' data-id='" + reply.questionId + "'>" + reply.content + "<span class='replier'>" + reply.fullName + "</span></div>");
    return replyHtml;
}

function prepareChat() {
    if (typeof (SilverScreen) === "undefined" || typeof (SilverScreen.Chat) === "undefined")
        return;

    if (userChatKey)
    {
        startHub();
    }
    else if (nickNameMode == SilverScreen.NickNameMode.SamePage) 
    {
        bindNickNameChooser();
    }
    else if (nickNameMode == SilverScreen.NickNameMode.HiddenNick) 
    {
        if (chatMode == SilverScreen.ChatMode.PrivateChat) {
            console.log('ask nickname')
            joinChatHiddenNickname(true);
        } else {
            joinChatHiddenNickname(false);
        }
    }
}

function joinChatHiddenNickname(triggerSend) {
    $.ajax({
        type: "POST",
        url: "/pick-nickname/" + projectKey,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            name: ""
        }),
        success: function (response) {
            $("#userKey").val(response.key);
            $("#userChatKey").val(response.chatKey);
            userKey = response.key;
            userChatKey = response.chatKey;
            if (response.messages && response.messages.length > 0) {
                for (var i = 0; i < response.messages.length; i++) {
                    var replyHtml = getMessageHtml(response.messages[i]);
                    $(".questions").append(replyHtml);
                }
            }

            //signal a message needs sending
            startHub(triggerSend);
        },
        error: function (response) {
            //TODO: Need to show this in the chat error?
            let error = "An error occurred";
            if (response.responseJSON && response.responseJSON.error)
                error = response.responseJSON.error;
        }
    });
}

function startDynamicEventHub() {
    if (typeof (SilverScreen) === "undefined" || typeof (SilverScreen.DynamicEvent) === "undefined")
        return;

    var dynamicEvent = new SilverScreen.DynamicEvent();

    dynamicEvent.onEventUpdate = function (dynamicEvent) {
        $(".end-of-event-wrapper svg").attr("style", dynamicEvent.endOfEventBackground);
        $(".technical-difficulties-wrapper svg").attr("style", dynamicEvent.technicalDifficultiesBackground);
        $(".stream-countdown-wrapper svg").attr("style", dynamicEvent.countdownBackground);
        $("#countDown").val(dynamicEvent.countdownWebTimeString);

        $("body").removeClass("end-of-event");
        $("body").removeClass("technical-difficulties");
        $("body").removeClass("has-countdown");

        if (dynamicEvent.hasCountdown) {
            $("body").addClass("has-countdown");
            startCountdown();
        } else if (dynamicEvent.isEndOfEventEnabled) {
            $("body").addClass("end-of-event");
        } else if (dynamicEvent.isTechnicalDifficultiesEnabled) {
            $("body").addClass("technical-difficulties");
        } else {
            if (!clientHosted)
                player.initialize();

            //prepareChat();
        }
    };

    dynamicEvent.onAlternateLogin = function () {
        if (player) {
            try {
                player.stop();
            } catch { }
        }

        $(".theoplayer-container").remove();
        $(".stream-countdown-wrapper").remove();
        $(".alternate-login-wrapper").show();
    }

    dynamicEvent.onConnected = () => {
        if (heartBeatInterval && !hbInterval) {
            const cookieId = getCookie(viewCookieKey);
            hbInterval = setInterval(() => {
                if (player.isPlaying) {
                    dynamicEvent.sendHeartBeat(userKey, cookieId);
                }
            }, heartBeatInterval * 60 * 1000);
        }
    }

    dynamicEvent.startHub(projectKey, eventBriteKey);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function startHub(triggerSend) {
    if (typeof (SilverScreen) === "undefined" || typeof (SilverScreen.Chat) === "undefined")
        return;

    //Disable send button until connection is established
    $(".js-ask-click").addClass("disabled");

    var chat = new SilverScreen.Chat();

    chat.onReconnecting = function (error) {
        $(".js-ask-click").addClass("disabled");
    };

    chat.onConnected = function () {
        $(".js-ask-click").removeClass("disabled");
        if (triggerSend) {
            triggerSend = false;
            sendMessage();
        }
    }

    chat.onMessageRecieved = function (reply) {
        if (reply.userKey == userKey)
            return;

        var replyHtml = getMessageHtml(reply);

        var replyToEle = $(".question[data-id='" + reply.responseToId + "']");

        if (replyToEle.length) {
            replyToEle.after(replyHtml);
        } else {
            $(".questions").append(replyHtml)
            $(".question-list").animate({ scrollTop: $(".questions").height() }, 2000);

        }
    }

    chat.onRemoveMessages = function (msgIds) {
        for (var i = 0; i < msgIds.length; i++) {
            var $ele = $(".message[data-id='" + msgIds[i] + "']");
            $ele.fadeOut(500, function () { $(this).remove(); });
        }
    }

    chat.startHub(projectKey, userKey, userChatKey);

    setRemove();

    $(".js-ask-click").off("click").on("click", function (e) {
        e.preventDefault();

        sendMessage();
    });

    $(".js-umg-ask").off("keydown").on("keydown", function (e) {
        let keyPressed = event.keyCode || event.which;
        if (keyPressed === 13) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        var str = "";

        if ($(".js-text.js-umg-ask").length)
            str = $(".js-text").text();
        else
            str = $(".js-text").val();

        if (!str)
            return;

        chat.sendMessage(str, null, function (data) {
            str = $("<div>").text(str).html();
            var question = $("<div class='message question " + (data.fromModerator ? "from-moderator" : "") + "' data-id='" + data.id + "'><span class='controls'><span class='fas fa-times js-remove-question'></span></span>" + str + "</div>");

            if (chatMode == SilverScreen.ChatMode.PrivateChat)
                $(".questions").prepend(question);
            else {
                $(".questions").append(question);
                //$(".question-list").animate({ scrollTop: $(".questions").height() }, 2000);
                $(".question-list").scrollTop($(".questions").height());
            }

            if ($(".js-text.js-umg-ask").length)
                $(".js-text").text("");
            else
                str = $(".js-text").val("");

            setRemove();
        });
    }

    function setRemove() {
        $(".js-remove-question").off("click").on("click", function (e) {
            var $ele = $(e.currentTarget).parents(".message");
            var id = $ele.data("id");

            chat.sendRemoveMessage(parseInt(id));

            $ele.fadeOut(500, function () { $(this).remove(); });
        });
    }
}

function startCountdown() {
    var countDown = $("#countDown").val();
    if (interval != 0) clearInterval(interval);
    if (!countDown)
        return;

    var date = new Date(countDown).getTime();
    interval = setInterval(function () {
        var now = new Date().getTime();
        var t = date - now;
        if (t < 0) {
            if(!clientHosted)
                player.initialize();

            prepareChat();
            clearInterval(interval);
            $(".has-countdown").removeClass("has-countdown");
            return;
        }

        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((t % (1000 * 60)) / 1000);
        var text = twoDigits(days) + ":" + twoDigits(hours) + ":" + twoDigits(minutes) + ":" + twoDigits(seconds);

        $(".stream-countdown").text(text);

    }, 1000);

    function twoDigits(n) {
        return (n < 10 ? '0' : '') + n;
    }
}
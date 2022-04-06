const projectKey = $("#projectKey").val();
const userKey = $("#userKey").val();
var userChatKey = $("#userChatKey").val();
var chatMode = $("#chatMode").val();
var player = window["silver-screen-player"];

$(function () {
    player.initialize();
    startHub();
});

function startHub() {
    if (!SilverScreen || !SilverScreen.Chat)
        return;

    //Disable send button until connection is established
    $(".js-reply-submit-click").attr("disabled", true);

    var chat = new SilverScreen.Chat(projectKey, userKey);

    chat.onReconnecting = function (error) {
        $(".js-reply-submit-click").attr("disabled", true);
    };

    chat.onConnected = function () {
        $(".js-reply-submit-click").attr("disabled", false);
    }

    chat.onMessageRecieved = function (question) {
        if (question.userKey == userKey)
            return;

        if (chatMode == SilverScreen.ChatMode.GroupChat) {
            var messageHtml = $("<div class='message reply' data-id='" + question.questionId + "' data-user-key='" + question.userKey + "'><span class='controls'><i class='fas fa-volume-mute js-toggle-mute-user'></i> <i class='fas fa-times js-remove-question'></i></span>" + question.content + "<span class='replier'>" + question.fullName + "</span></div>")
            var messageList = $(".questions");
            messageList.append(messageHtml)
        } else {
            //another moderator reply
            if (question.responseToId) {
                var $ele = $(".reply-box[data-question-id='" + question.responseToId + "']");
                var reply = $("<div class='message reply' data-id='" + question.questionId + "' data-response-to-id='" + question.responseToId + "'>" + question.content + "<span class='replier'>" + question.fullName + "</span></div>");
                $ele.before(reply);
                var userThread = $ele.parents(".user-thread");
                userThread.find(".reply-count").text(userThread.find(".reply:not(.hidden)").length);
            //new message
            } else {
                var userThread = $(".user-thread[data-user-key='" + question.userKey + "']");

                if (!userThread.length) {
                    userThread = $("<div class='user-thread hide-questions' data-user-key='" + question.userKey + "'><div class='user-thread-title'><span>" + question.fullName + " </span><i class='fas fa-caret-square-up fa-rotate-180 user-thread-collapse float-right'></i></div><div class='user-thread-counts'><span class='question-count'>0</span> <i class='far fa-comment-dots'></i> <span class='reply-count'>0</span> <i class='fas fa-comment-dots'></i></div></div>");
                }

                //always move to the top
                $(".questions").prepend(userThread)

                var questionHtml = $("<div class='message question' data-id='" + question.questionId + "'><span class='controls'><i class='fas fa-reply js-reply-click'></i> <i class='fas fa-times js-remove-question'></i></span>" + question.content + "</div><div data-question-id='" + question.questionId + "' class='reply-box hide'><form class='reply-form clearfix'><textarea cols='60' rows='5' class='js-reply-text mr-2' style='max-width:100%'></textarea><input type='submit' class='btn btn-primary align-top js-reply-submit-click' value='Reply' /></form></div>");
                userThread.find(".user-thread-counts").after(questionHtml)
                userThread.find(".question-count").text(userThread.find(".question:not(.hidden)").length);
                userThread.find(".user-thread-counts").addClass("flash");

                setReply();
                setCollapse();
            }
        }

        setMute();
        setRemove();
    }

    chat.onRemoveMessages = function (msgIds) {
        for (var i = 0; i < msgIds.length; i++) {
            var $ele = $(".message[data-id='" + msgIds[i] + "']");
            $ele.fadeOut(500, function () { $(this).remove(); });
            $(".reply-box[data-question-id='" + msgIds[i] + "']").remove();
        }
    }

    chat.onUserMuted = function (userKey) {
        $(".message[data-user-key='" + userKey + "']").addClass("is-muted");
    }

    chat.onUserUnMuted = function (userKey) {
        $(".message[data-user-key='" + userKey + "']").removeClass("is-muted");
    }

    chat.startHub(projectKey, userKey, userChatKey);

    setReply();
    setMute();
    setRemove();
    setCollapse();

    function setMute() {
        $(".js-toggle-mute-user").off("click").on("click", function (e) {
            e.preventDefault();
            var $ele = $(e.currentTarget).parents(".message");
            if ($ele.hasClass("is-muted"))
                chat.sendUnMuteUser($ele.data("user-key"));
            else
                chat.sendMuteUser($ele.data("user-key"));
        });
    }

    function setReply() {
        $(".js-reply-click").off("click").on("click", function (e) {
            e.preventDefault();
            var $ele = $(this);
            var id = $ele.parents(".message").data("id");
            var replyBox = $(".reply-box[data-question-id='" + id + "']");
            replyBox.toggleClass("hide");

            var textBox = replyBox.find(".js-reply-text");
            textBox.focus();
            $ele.parents(".user-thread").find(".user-thread-counts").removeClass("flash");
        });

        //public chat
        $(".js-ask-click").off("click").on("click", function (e) {
            e.preventDefault();
            var str = $(".js-text").val();
            if (!str)
                return;

            chat.sendMessage(str, null, function (data) {
                str = $("<div>").text(str).html();
                var question = $("<div class='message question' data-id='" + data.id + "'><span class='controls'><span class='fas fa-times js-remove-question'></span></span>" + str + "</div>");
                $(".questions").append(question);

                $(".js-text").val("");
                setRemove();
            });
        });

        //private chat replies
        $(".js-reply-submit-click").off("click").on("click", function (e) {
            e.preventDefault();
            var $ele = $(this).parents(".reply-box");
            var questionId = parseInt($ele.data("question-id"));
            var textBox = $ele.find(".js-reply-text");
            var str = textBox.val();
            if (!str)
                return;

            chat.sendMessage(str, questionId, function (data) {
                str = $("<div>").text(str).html();
                var reply = $("<div class='message reply' data-id='" + data.id + "' data-response-to-id='" + questionId + "'>" + str + "</div>");
                $ele.before(reply);
                textBox.val("");
                $ele.toggleClass("hide");
                var userThread = $ele.parents(".user-thread");
                userThread.find(".reply-count").text(userThread.find(".reply:not(.hidden)").length);
            });
        });
    }

    function setCollapse() {
        $(".user-thread-collapse").off("click").on("click", function (e) {
            e.preventDefault();
            var userThread = $(e.currentTarget).parents(".user-thread");
            userThread.toggleClass("hide-questions");
            userThread.find(".user-thread-counts").removeClass("flash");
            if ($(e.currentTarget).hasClass("fa-rotate-180")) {
                $(e.currentTarget).removeClass("fa-rotate-180")
                $(e.currentTarget).removeClass("fas")
                $(e.currentTarget).addClass("far")
            } else {
                $(e.currentTarget).removeClass("far")
                $(e.currentTarget).addClass("fa-rotate-180")
                $(e.currentTarget).addClass("fas")
            }
        });
    }

    function setRemove() {
        $(".js-remove-question").off("click").on("click", function (e) {
            var $ele = $(e.currentTarget).parents(".message");
            chat.sendRemoveMessage(parseInt($ele.data("id")));
        });
    }
}
var SilverScreen;
(function (SilverScreen) {
    let ErrorType;
    (function (ErrorType) {
        ErrorType[ErrorType["Info"] = 1] = "Info";
        ErrorType[ErrorType["Warning"] = 2] = "Warning";
        ErrorType[ErrorType["Error"] = 3] = "Error";
    })(ErrorType = SilverScreen.ErrorType || (SilverScreen.ErrorType = {}));
    let ChatMode;
    (function (ChatMode) {
        ChatMode["None"] = "None";
        ChatMode["PrivateChat"] = "PrivateChat";
        ChatMode["GroupChat"] = "GroupChat";
    })(ChatMode = SilverScreen.ChatMode || (SilverScreen.ChatMode = {}));
    let NickNameMode;
    (function (NickNameMode) {
        NickNameMode["Default"] = "Default";
        NickNameMode["SamePage"] = "SamePage";
        NickNameMode["HiddenNick"] = "HiddenNick";
    })(NickNameMode = SilverScreen.NickNameMode || (SilverScreen.NickNameMode = {}));
    class Chat {
        constructor() {
            this.onConnectedInternal = (connectionId) => {
                if (!connectionId)
                    connectionId = this.questionHub.connectionId;
                this.log(`Connected to chat on ${connectionId}`);
                this.hideError();
                this.joinRoom();
            };
            this.joinRoom = () => {
                this.questionHub
                    .invoke("JoinRoom", this.projectKey, this.userChatKey)
                    .then((data) => {
                    if (data.error) {
                        this.showError(ErrorType.Error, data.error);
                    }
                    else if (this.onConnected)
                        this.onConnected();
                })
                    .catch(this.onHubError);
            };
            this.sendMessage = (msg, responseToId, callback) => {
                this.questionHub
                    .invoke("SendMessage", this.projectKey, this.userChatKey, responseToId, msg)
                    .then((data) => {
                    if (data.error) {
                        this.showError(ErrorType.Error, data.error);
                    }
                    else if (callback)
                        callback(data);
                })
                    .catch(this.onHubError);
            };
            this.sendRemoveMessage = (id, callback) => {
                this.questionHub
                    .invoke("SendRemoveMessage", this.projectKey, this.userChatKey, id)
                    .then((data) => {
                    if (data.error) {
                        this.showError(ErrorType.Error, data.error);
                    }
                    else if (callback)
                        callback(data);
                })
                    .catch(this.onHubError);
            };
            this.removeMessages = (msgIds) => {
                if (this.onRemoveMessages)
                    this.onRemoveMessages(msgIds);
            };
            this.messageReceived = (msg) => {
                if (this.onMessageRecieved)
                    this.onMessageRecieved(msg);
            };
            this.sendMuteUser = (userKey) => {
                this.questionHub
                    .invoke("MuteUser", this.projectKey, userKey);
            };
            this.sendUnMuteUser = (userKey) => {
                this.questionHub
                    .invoke("UnMuteUser", this.projectKey, userKey);
            };
            this.userMuted = (userKey) => {
                if (this.onUserMuted)
                    this.onUserMuted(userKey);
            };
            this.userUnMuted = (userKey) => {
                if (this.onUserUnMuted)
                    this.onUserUnMuted(userKey);
            };
            this.onHubError = (err) => {
                console.log(err);
                //TODO: Translation
                if (!err)
                    err = "An error occured";
                this.showError(ErrorType.Error, err);
            };
            this.showError = (type, message) => {
                $("#chat-error")
                    .removeClass("d-none")
                    .removeClass("bg-warning")
                    .removeClass("bg-danger")
                    .removeClass("bg-info");
                if (type == ErrorType.Warning)
                    $("#chat-error").addClass("bg-warning");
                else if (type == ErrorType.Error)
                    $("#chat-error").addClass("bg-danger");
                else
                    $("#chat-error").addClass("bg-info");
                $("#chat-error-message").text(message);
            };
            this.hideError = () => {
                $("#chat-error").addClass("d-none");
            };
        }
        //TODO: This should be a promise but we need to support IE11 for now
        startHub(projectKey, userKey, userChatKey) {
            this.projectKey = projectKey;
            this.userKey = userKey;
            this.userChatKey = userChatKey;
            this.questionHub = new signalR.HubConnectionBuilder()
                .withUrl("/question-hub")
                .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
                .build();
            this.questionHub.on("MessageReceived", this.messageReceived);
            this.questionHub.on("RemoveMessages", this.removeMessages);
            this.questionHub.on("UserMuted", this.userMuted);
            this.questionHub.on("UserUnMuted", this.userUnMuted);
            this.questionHub.onreconnecting((error) => {
                this.log(`Reconnecting to chat, error: ${error}`);
                //this.showError(SilverScreen.ErrorType.Warning, "Connection lost. Reconnecting...");
                if (this.onReconnecting)
                    this.onReconnecting(error);
            });
            this.questionHub.onreconnected(this.onConnectedInternal);
            this.questionHub
                .start()
                .then(this.onConnectedInternal)
                .catch(this.onHubError);
        }
        log(msg) {
            if (typeof (console) !== "undefined" && typeof (console.log) !== "undefined")
                console.log(msg);
        }
    }
    SilverScreen.Chat = Chat;
})(SilverScreen || (SilverScreen = {}));
//# sourceMappingURL=chat.js.map
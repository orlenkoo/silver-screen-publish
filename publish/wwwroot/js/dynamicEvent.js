var SilverScreen;
(function (SilverScreen) {
    class DynamicEvent {
        constructor() {
            this.onConnectedInternal = (connectionId) => {
                if (!connectionId)
                    connectionId = this.eventHub.connectionId;
                this.log(`Connected to event on ${connectionId}`);
                this.hideError();
                this.joinEvent();
            };
            this.joinEvent = () => {
                this.eventHub
                    .invoke("JoinEvent", this.projectKey, this.eventBriteKey)
                    .then((data) => {
                    if (data.error) {
                        this.showError(SilverScreen.ErrorType.Error, data.error);
                    }
                    else if (this.onConnected)
                        this.onConnected();
                })
                    .catch(this.onHubError);
            };
            this.sendHeartBeat = (userKey, cookieId) => {
                this.eventHub.invoke("SendHeartBeat", this.projectKey, userKey, cookieId);
            };
            this.onHubError = (err) => {
                console.log(err);
                //TODO: Translation
                if (!err)
                    err = "An error occured";
                this.showError(SilverScreen.ErrorType.Error, err);
            };
            this.showError = (type, message) => {
                $("#chat-error")
                    .removeClass("d-none")
                    .removeClass("bg-warning")
                    .removeClass("bg-danger")
                    .removeClass("bg-info");
                if (type == SilverScreen.ErrorType.Warning)
                    $("#chat-error").addClass("bg-warning");
                else if (type == SilverScreen.ErrorType.Error)
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
        startHub(projectKey, eventBriteKey) {
            this.projectKey = projectKey;
            this.eventBriteKey = eventBriteKey;
            this.eventHub = new signalR.HubConnectionBuilder()
                .withUrl("/dynamic-event-hub")
                .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
                .build();
            this.eventHub.on("EventUpdate", this.onEventUpdate);
            this.eventHub.on("AlternateLogin", () => {
                if (this.onAlternateLogin) {
                    this.onAlternateLogin();
                }
            });
            this.eventHub.onreconnecting((error) => {
                if (error != undefined) {
                    this.log(`Reconnecting to event, error: ${error}`);
                    this.showError(SilverScreen.ErrorType.Warning, "Connection lost. Reconnecting...");
                }
                if (this.onReconnecting)
                    this.onReconnecting(error);
            });
            this.eventHub.onreconnected(this.onConnectedInternal);
            this.eventHub
                .start()
                .then(this.onConnectedInternal)
                .catch(this.onHubError);
        }
        log(msg) {
            if (typeof (console) !== "undefined" && typeof (console.log) !== "undefined")
                console.log(msg);
        }
    }
    SilverScreen.DynamicEvent = DynamicEvent;
})(SilverScreen || (SilverScreen = {}));
//# sourceMappingURL=dynamicEvent.js.map
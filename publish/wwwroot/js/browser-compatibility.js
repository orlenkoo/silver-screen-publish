function detectBrowser() {
	var browserName = (function (agent) {
		switch (true) {
			case agent.indexOf("edge") > -1: return "MS Edge";
			case agent.indexOf("edg/") > -1: return "Edge ( chromium based)";
			case agent.indexOf("opr") > -1 && !!window.opr: return "Opera";
			case agent.indexOf("chrome") > -1 && !!window.chrome: return "Chrome";
			case agent.indexOf("trident") > -1: return "MS IE";
			case agent.indexOf("firefox") > -1: return "Mozilla Firefox";
			case agent.indexOf("safari") > -1: return "Safari";
			default: return "other";
		}
	})(window.navigator.userAgent.toLowerCase());
	if (browserName == "MS IE") {
		const alertWarning = document.createElement("div");

		const closeButton = document.createElement("button");
		closeButton.innerHTML = "X";

		alertWarning.appendChild(document.createTextNode(browser_warning));
		alertWarning.style.background = "#ffcc00";
		alertWarning.style.padding = "10px";
		alertWarning.style.paddingRight = "30px";
		alertWarning.style.position = "relative";
		alertWarning.style.width = "100%";

		closeButton.style.position = "absolute";
		closeButton.style.right = "10px";
		closeButton.style.top = "20px";
		alertWarning.appendChild(closeButton);

		document.body.insertBefore(alertWarning, document.body.firstChild);

		closeButton.onclick = function () {
			document.body.removeChild(alertWarning);
		}
	}
}
detectBrowser();
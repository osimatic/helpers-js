class Browser {
	static isOpera() {
		return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	}
	static isFirefox() {
		return typeof InstallTrigger !== 'undefined';
	}
	static isSafari() {
		return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
	}
	static isChrome() {
		return !!window.chrome && !!window.chrome.webstore;
	}
	static isIE() {
		return /*@cc_on!@*/false || !!document.documentMode;
	}
	static isEdge() {
		return !isIE && !!window.StyleMedia;
	}
}

module.exports = { Browser };
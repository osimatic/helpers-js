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
		//return window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
		return /*@cc_on!@*/false || !!document.documentMode;
	}
	static isEdge() {
		return !isIE && !!window.StyleMedia;
	}
}

class UserAgent {
	static getOsDisplay(osName) {
		let str = '';
		if (osName === 'Windows') {
			str += '<i class="fab fa-windows"></i>';
		}
		if (osName === 'Linux') {
			str += '<i class="fab fa-linux"></i>';
		}
		if (osName === 'macOS' || osName === 'iOS') {
			str += '<i class="fab fa-apple"></i>';
		}
		if (osName === 'Android') {
			str += '<i class="fab fa-android"></i>';
		}
		str += ' '+osName;
		return str.trim();
	}
	
	static getBrowserDisplay(browserName) {
		let str = '';
		if (browserName === 'Chrome') {
			str += '<i class="fab fa-chrome"></i>';
		}
		if (browserName === 'Firefox') {
			str += '<i class="fab fa-firefox"></i>';
		}
		if (browserName === 'Edge') {
			str += '<i class="fab fa-edge"></i>';
		}
		if (browserName === 'Safari') {
			str += '<i class="fab fa-safari"></i>';
		}
		if (browserName === 'Opera') {
			str += '<i class="fab fa-opera"></i>';
		}
		str += ' '+browserName;
		return str.trim();
	}

	static getDeviceDisplay(device) {
		let str = '';
		if (device['type'] === 'desktop') {
			str += '<i class="fas fa-desktop"></i> Ordinateur';
		}
		else {
			if (device['is_mobile']) {
				str += '<i class="fas fa-mobile-alt"></i> '+(null == device['manufacturer'] && null == device['model'] ? 'Mobile' : '');
			}
			str += device['manufacturer']+' '+device['model'];
		}
		return str.trim();
	}
}

module.exports = { Browser, UserAgent };
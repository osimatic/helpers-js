
class HTTPRequest {
	static setRefreshTokenUrl(url) {
		this.refreshTokenUrl = url;
	}
	static setRefreshTokenCallback(callback) {
		this.refreshTokenCallback = callback;
	}

	static setHeader(key, value) {
		if (typeof this.headers == 'undefined') {
			this.headers = {};
		}
		this.headers[key] = value;
	}

	static getHeaders(asObject) {
		//if (typeof httpHeaders != 'undefined') {
		//	return httpHeaders;
		//}

		if (typeof this.headers == 'undefined') {
			this.headers = {};
		}

		if (typeof asObject != 'undefined' && asObject) {
			return this.headers;
		}

		let httpHeaders = new Headers();
		Object.entries(this.headers).forEach(([key, value]) => {
			httpHeaders.append(key, value);
		});
		return httpHeaders;
	}

	static formatQueryString(data) {
		if (data == null) {
			return '';
		}
		if (typeof data == 'object') {
			data = UrlAndQueryString.buildQuery(data);
		}
		if (data !== '' && data.substring(0, 1) !== '&') {
			data = '&' + data;
		}
		return data;
	}

	static formatFormData(data) {
		if (!(data instanceof FormData)) {
			let formData = new FormData();
			Object.entries(data).forEach(([key, value]) => formData.append(key, value));
			return formData;
		}
		return data;
	}

	static logRequestFailure(response, json) {
		console.error('Request failure. Status: '+response.statusText+' ; HTTP Code : '+response.status, json);
	}

	static logJqueryRequestFailure(jqxhr, status, errorThrown) {
		console.error('Request failure. Status: '+status+' ; HTTP Code: '+jqxhr.responseJSON.code+(null!=errorThrown && ''!==errorThrown ? ' ; Error message: '+errorThrown : ''), jqxhr.responseJSON);
	}

	static async get(url, data, successCallback, errorCallback) {
		url += (!url.includes('?') ? '?' : '') + this.formatQueryString(data);
		data = null;

		if (window.fetch) {
			const response = await fetch(url, {
				method: 'GET',
				headers: HTTPRequest.getHeaders(),
				mode: 'cors',
				cache: 'no-cache'
			});

			let jsonData = {};
			try {
				jsonData = await response.json();
				//console.log(url, jsonData);
				//console.log(response.status, response.statusText, jsonData['error']);

				if (response.status == 401 && (response.statusText === 'Expired JWT Token' || typeof jsonData['error'] != 'undefined' && jsonData['error'] === 'expired_token')) {
					HTTPRequest.refreshToken(() => HTTPRequest.get(url, data, successCallback, errorCallback));
					return;
				}

				if (response.ok) {
					successCallback(jsonData, response);
					return;
				}
			}
			catch (e) {
				console.error(e);
				if (typeof errorCallback != 'undefined' && errorCallback != null) {
					errorCallback(response);
				}
				return;
			}

			HTTPRequest.logRequestFailure(response, jsonData);
			if (typeof errorCallback != 'undefined' && errorCallback != null) {
				errorCallback(response, jsonData);
			}
			return;
		}

		//l'api fetch n'est pas dispo pour ce navigateur => normalement ce cas ne devrait pas arriver car le polyfill est chargé
		console.error('fetch\'s polyfill used');
		$.ajax({
			type: 'GET',
			url: url,
			headers: HTTPRequest.getHeaders(true),
			dataType: 'json',
			cache: false,
			success: (data, status, jqxhr) => {
				if (typeof successCallback != 'undefined' && successCallback != null) {
					successCallback(data, jqxhr);
				}
			},
			error: (jqxhr, status, errorThrown) => {
				if (jqxhr.status == 401 && (jqxhr.statusText === 'Expired JWT Token'  || (typeof jqxhr.responseJSON['message'] != 'undefined' && jqxhr.responseJSON['message'] === 'Expired JWT Token') || (typeof jqxhr.responseJSON['error'] != 'undefined' && jqxhr.responseJSON['error'] === 'expired_token' ))) {
					HTTPRequest.refreshToken(() => HTTPRequest.get(url, data, successCallback, errorCallback));
					return;
				}

				HTTPRequest.logJqueryRequestFailure(jqxhr, status, errorThrown);
				if (typeof errorCallback != 'undefined' && errorCallback != null) {
					errorCallback(jqxhr, jqxhr.responseJSON);
				}
			}
		});
	}

	static async download(url, data, errorCallback, completeCallback, method) {
		method = typeof method == 'undefined' || null == method ? 'GET' : method;

		if ('POST' !== method) {
			url += (!url.includes('?') ? '?' : '') + this.formatQueryString(data);
			data = null;
		}

		if (window.fetch) {
			let requestInit = {
				method: 'GET',
				headers: HTTPRequest.getHeaders(),
				mode: 'cors',
				cache: 'no-cache'
			}

			if ('POST' === method) {
				requestInit['method'] = 'POST';
				requestInit['body'] = this.formatFormData(data);
			}

			const response = await fetch(url, requestInit);
			try {
				const blobData = await response.blob();
				/*console.log(url);
				console.log(blobData);*/

				if (response.status == 401 && response.statusText === 'Expired JWT Token') {
					HTTPRequest.refreshToken(() => HTTPRequest.download(url, data, errorCallback, completeCallback, method));
					return;
				}

				if (response.ok) {
					File.download(blobData, response.headers.get('content-type'), response.headers.get('content-disposition'));
				}
				else {
					HTTPRequest.logRequestFailure(response, null);
					if (typeof errorCallback != 'undefined' && errorCallback != null) {
						errorCallback(response);
					}
				}
			}
			catch (e) {
				console.error(e);
				if (typeof errorCallback != 'undefined' && errorCallback != null) {
					errorCallback(response);
				}
			}
			if (typeof completeCallback != 'undefined' && completeCallback != null) {
				completeCallback(response);
			}
			return;
		}

		//l'api fetch n'est pas dispo pour ce navigateur => normalement ce cas ne devrait pas arriver car le polyfill est chargé
		console.error('fetch\'s polyfill used');

		let ajaxOptions = {
			type: 'GET',
			url: url,
			headers: HTTPRequest.getHeaders(true),
			cache: false,
			xhrFields: {
				responseType: 'blob'
			},
		};
		if ('POST' === method) {
			ajaxOptions['type'] = 'POST';
			ajaxOptions['data'] = this.formatFormData(data);
			ajaxOptions['contentType'] = false;
			ajaxOptions['processData'] = false;
		}

		$.ajax(Object.assign({...ajaxOptions}, {
			success: (data, status, jqxhr) => File.download(data, jqxhr.getResponseHeader('Content-Type'), jqxhr.getResponseHeader('Content-Disposition')),
			error: (jqxhr, status, errorThrown) => {
				if (jqxhr.status == 401 && (jqxhr.statusText === 'Expired JWT Token' || (typeof jqxhr.responseJSON['message'] != 'undefined' && jqxhr.responseJSON['message'] === 'Expired JWT Token') || (typeof jqxhr.responseJSON['error'] != 'undefined' && jqxhr.responseJSON['error'] === 'expired_token' ))) {
					HTTPRequest.refreshToken(() => HTTPRequest.download(url, data, errorCallback, completeCallback, method));
					return;
				}

				HTTPRequest.logJqueryRequestFailure(jqxhr, status, errorThrown);
				if (typeof errorCallback != 'undefined' && errorCallback != null) {
					errorCallback(jqxhr);
				}
			},
			complete: (jqxhr) => {
				if (typeof completeCallback != 'undefined' && completeCallback != null) {
					completeCallback(jqxhr);
				}
			}
		}));
	}

	static async post(url, formData, successCallback, errorCallback, formErrorCallback) {
		formData = this.formatFormData(formData);

		if (window.fetch) {
			const response = await fetch(url, {
				method: 'POST',
				body: formData,
				headers: HTTPRequest.getHeaders(),
				mode: 'cors',
				cache: 'no-cache'
			});

			let jsonData = {};
			try {
				if (response.statusText !== 'No Content') {
					jsonData = await response.json();
				}
				//console.log(url, jsonData);

				if (response.status == 401 && url !== HTTPRequest.refreshTokenUrl && (response.statusText === 'Expired JWT Token' || (typeof jsonData['error'] != 'undefined' && jsonData['error'] === 'expired_token'))) {
					HTTPRequest.refreshToken(() => HTTPRequest.post(url, formData, successCallback, errorCallback, formErrorCallback));
					return;
				}

				if (response.ok) {
					if (typeof successCallback != 'undefined' && successCallback != null) {
						successCallback(jsonData, response);
					}
					return;
				}

				if (response.status == 400 && typeof formErrorCallback != 'undefined' && formErrorCallback != null) {
					formErrorCallback(jsonData, response);
					return;
				}
			}
			catch (e) {
				console.error(e);
				if (typeof errorCallback != 'undefined' && errorCallback != null) {
					errorCallback(response);
				}
				return;
			}

			HTTPRequest.logRequestFailure(response, jsonData);
			if (typeof errorCallback != 'undefined' && errorCallback != null) {
				errorCallback(response, jsonData);
			}
			return;
		}

		//l'api fetch n'est pas dispo pour ce navigateur => normalement ce cas ne devrait pas arriver car le polyfill est chargé
		console.error('fetch\'s polyfill used');
		$.ajax({
			type: 'POST',
			url: url,
			headers: HTTPRequest.getHeaders(true),
			dataType: 'json', // 22/09/2020 : à voir si cette ligne pose pb (utilisé pour requete import et peut être d'autres
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: (data, status, jqxhr) => {
				if (typeof successCallback != 'undefined' && successCallback != null) {
					successCallback(data, jqxhr);
				}
			},
			error: (jqxhr, status, errorThrown) => {
				if (url !== HTTPRequest.refreshTokenUrl && jqxhr.status == 401 && (jqxhr.statusText === 'Expired JWT Token' || (typeof jqxhr.responseJSON['message'] != 'undefined' && jqxhr.responseJSON['message'] === 'Expired JWT Token') || (typeof jqxhr.responseJSON['error'] != 'undefined' && jqxhr.responseJSON['error'] === 'expired_token' ))) {
					HTTPRequest.refreshToken(() => HTTPRequest.post(url, formData, successCallback, errorCallback, formErrorCallback));
					return;
				}
				if (jqxhr.status == 400 && typeof formErrorCallback != 'undefined' && formErrorCallback != null) {
					formErrorCallback(jqxhr.responseJSON, jqxhr);
					return;
				}

				HTTPRequest.logJqueryRequestFailure(jqxhr, status, errorThrown);
				if (typeof errorCallback != 'undefined' && errorCallback != null) {
					errorCallback(jqxhr, jqxhr.responseJSON);
				}
			}
		});
	}

	static refreshToken(onCompleteCallback) {
		if (typeof this.refreshTokenCallback == 'function') {
			this.refreshTokenCallback(onCompleteCallback);
			return;
		}

		if (typeof this.refreshTokenUrl == 'undefined') {
			console.error('URL refresh token non définie. Appeler HTTPRequest.setRefreshTokenUrl(url)');
			return;
		}

		let payload = new FormData();
		payload.append('refresh_token', JwtSession.getRefreshToken());

		HTTPRequest.post(this.refreshTokenUrl, payload,
			(data) => {
				JwtSession.setToken(data.token);
				JwtSession.setRefreshToken(data.refresh_token);
				onCompleteCallback();
			}, 
			() => {
				JwtSession.logout();
			}
		);
	}

	static doRequest(url, strParam, methode, formatRetour, callback) {
		var xhr = null;

		if (window.XMLHttpRequest || window.ActiveXObject) {
			if (window.ActiveXObject) {
				try {
					xhr = new ActiveXObject('Msxml2.XMLHTTP');
				} catch (e) {
					xhr = new ActiveXObject('Microsoft.XMLHTTP');
				}
			} else {
				xhr = new XMLHttpRequest();
			}
		} else {
			// Votre navigateur ne supporte pas l'objet XMLHTTPRequest!
			return null;
		}

		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
				let data;
				if (formatRetour == 'xml') {
					data = xhr.responseXML;
				}
				else {
					data = eval('(' + xhr.responseText + ')');
				}
				callback(data);
			}
		};

		if (methode === 'POST') {
			xhr.open('POST', url, true);
			xhr.send();
		}
		else {
			xhr.open('GET', url + '?' + strParam, true);
			xhr.send(null);
		}
		return false;
	}
}

class Cookie {
	static set(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	static get(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return null;
	}

	static erase(name) {
		Cookie.set(name, "", -1);
	}
}

class UrlAndQueryString {
	static getPath(url) {
		if (typeof url == 'undefined') {
			return window.location.origin + window.location.pathname;
		}
		let strpos = url.indexOf('?');
		// Si on ne trouve pas de queryString on retourne une chaine vide
		if (strpos === -1) {
			return url;
		}
		return url.substr(0, strpos);
	}

	static getQueryString(url) {
		if (typeof url == 'undefined') {
			return window.location.search;
		}
		let urlObj = new URL(url);
		return urlObj.search;
	}

	static getParam(key, url) {
		var searchParams = new URLSearchParams(UrlAndQueryString.getQueryString(url));
		return searchParams.get(key);
	}

	static setParam(queryString, name, value) {
		// cette solution ne fonctionne pas avec les tableau
		//let params = new URLSearchParams(queryString);
		//params.set(name, value);
		//return params.toString();

		let params = UrlAndQueryString.parseQuery(queryString);
		//console.log(params);
		params[name] = value;
		return decodeURI($.param(params));
	}
	static setParamOfUrl(name, value, url) {
		let queryString = UrlAndQueryString.setParam(UrlAndQueryString.getQueryString(url), name, value);
		return UrlAndQueryString.getPath(url) + '?' + queryString;
	}

	static deleteParam(queryString, name) {
		let params = new URLSearchParams(queryString);
		params.delete(name);
		return decodeURI(params.toString());

		//let params = UrlAndQueryString.parseQuery(queryString);
		//params[name] = null;
		//return $.param(params);
	}
	static deleteParamOfUrl(name, url) {
		let queryString = UrlAndQueryString.deleteParam(UrlAndQueryString.getQueryString(url), name);
		return UrlAndQueryString.getPath(url) + '?' + queryString;
	}

	static parseQuery(queryString) {
		var params = {};

		function buildParamFromString(param) {
			var p = decodeURIComponent(param);
			var strpos = p.indexOf('=');
			// Si on trouve pas de signe =, on met la valeur ''
			if (strpos === -1) {
				params[p] = '';
				//params.length++;
				return true;
			}
			var name = p.substr(0, strpos);
			var value = p.substr(strpos + 1, p.length);
			var openBracket = name.indexOf('[');
			var closeBracket = name.indexOf(']');
			// On traite les paramètre qui ne sont pas sous forme de tableau
			if (openBracket === -1 || closeBracket === -1) {
				if (!(openBracket === -1 && closeBracket === -1)) {
					name = name.replace(new RegExp('[\\[\\]]'), '_');
				}
				params[name] = value;
				return true;
			}
			var matches = name.match(new RegExp('\\[.*?\\]', 'g'));
			name = name.substr(0, openBracket);
			p = 'params';
			var key = name;
			for (let i in matches) {
				if (typeof (matches[i]) == 'function') {
					continue;
				}

				p += '[\'' + key + '\']';
				if (eval(p) == undefined || typeof (eval(p)) != 'object') {
					eval(p + '= new Array();');
				}
				key = matches[i].substr(1, matches[i].length - 2);
				// si la clé est null on met la longueur du tableau
				if (key == '') {
					key = eval(p).length;
				}

				/*
				p += '[\''+key+'\']';
				if(eval(p) == undefined || typeof(eval(p)) != 'object') {
					eval(p +'= new Array();');
				}
				if (typeof(matches[i]) != 'function') {
					key = matches[i].substr(1,matches[i].length-2);
					// si la clé est null on met la longueur du tableau
					if (key == '') {
						key = eval(p).length;
					}
				}
				else {
					key = eval(p).length;
				}
				*/
			}
			p += '[\'' + key + '\']';
			eval(p + '= \'' + value + '\';');
		}

		var str = queryString;
		if (str.includes('?')) {
			str = str.substring(1);
		}
		if (str === '') {
			return {};
		}
		str = str.replace(new RegExp('&'), '&');
		//params.length = 0;
		str = str.split('&');
		//var p = '';
		//var startPos = -1;
		//var endPos = -1;
		//var arrayName = '';
		//var arrayKey = '';
		for (let i = 0; i < str.length; i++) {
			buildParamFromString(str[i]);
		}
		// return JSON.parse(JSON.stringify(this.params));
		return params;
	}

	static buildQuery(object) {
		var params = [];

		function buildStringFromParam(object, prefix) {
			var p = '';
			var value = '';
			if (prefix !== undefined) {
				p = prefix;
			}
			if (typeof (object) == 'object') {
				for (var name in object) {
					value = object[name];
					// 14/01/2020 : les tableaux avec param[0], param[1] en query string fonctionne pas, il faut mettre param[]=x&param[]=y
					//name = p == '' ? name : '['+name+']';
					name = p == '' ? name : '[]';
					if (typeof (value) == 'object') {
						buildStringFromParam(value, p + name);
					}
					else if (typeof (value) != 'function' && name != '') {
						// 27/01/2020 : correction bug boolean affiché en string true/false
						if (typeof (value) == 'boolean') {
							value = (value ? 1 : 0);
						}
						params[params.length] = p + name + '=' + value;
					}
				}
			}
		}

		buildStringFromParam(object);
		return params.join('&');
	}



















	// deprecated

	/** @deprecated **/
	static parseQueryString(string) {
		if (string === "" || string == null) return {};
		if (string.charAt(0) === "?") string = string.slice(1);
		var entries = string.split("&"), counters = {}, data0 = {};
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i].split("=");
			var key5 = decodeURIComponent(entry[0]);
			var value2 = entry.length === 2 ? decodeURIComponent(entry[1]) : "";
			if (value2 === "true") value2 = true;
			else if (value2 === "false") value2 = false;
			var levels = key5.split(/\]\[?|\[/);
			var cursor = data0;
			if (key5.indexOf("[") > -1) levels.pop();
			for (var j0 = 0; j0 < levels.length; j0++) {
				var level = levels[j0], nextLevel = levels[j0 + 1];
				var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10));
				if (level === "") {
					var key5 = levels.slice(0, j0).join();
					if (counters[key5] == null) {
						counters[key5] = Array.isArray(cursor) ? cursor.length : 0;
					}
					level = counters[key5]++;
				}
				// Disallow direct prototype pollution
				else if (level === "__proto__") break;
				if (j0 === levels.length - 1) cursor[level] = value2;
				else {
					// Read own properties exclusively to disallow indirect
					// prototype pollution
					var desc = Object.getOwnPropertyDescriptor(cursor, level);
					if (desc != null) desc = desc.value;
					if (desc == null) cursor[level] = desc = isNumber ? [] : {};
					cursor = desc;
				}
			}
		}
		return data0;
	}

	/** @deprecated **/
	static getQuery(url) {
		var str = url;
		var strpos = str.indexOf('?');
		// Si on ne trouve pas de queryString on retourne une chaine vide
		if (strpos === -1) {
			return '';
		}
		str = str.substr(strpos + 1, str.length);
		// Maintenant on verifie si on a une anchor ou pas (#) et si c'est le cas on arrete la querystring avant
		strpos = str.indexOf('#');
		if (strpos === -1) {
			return str;
		}
		return str.substr(0, strpos);
	}

}

module.exports = { HTTPRequest, Cookie, UrlAndQueryString };

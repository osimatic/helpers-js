
class HTTPRequest {
	static getHttpHeaders() {
		if (!JwtSession.isAnonymous()) { //on ne définit pas ce header si on ne trouve pas d'access_token
			httpHeaders['Authorization'] = 'Bearer ' + JwtSession.getToken();
		}

		return httpHeaders;
	}
	
	static get(url, data, successCallback, errorCallback) {
		if (data == null) {
			data = '';
		}
		else if (typeof data == 'object') {
			data = UrlAndQueryString.buildQuery(data);
		}
		if (data !== '' && data.substring(0, 1) !== '&') {
			data = '&'+data;
		}
		$.ajax({
			type: 'GET',
			url : url+(!url.includes('?')?'?':'')+data,
			headers: HTTPRequest.getHttpHeaders(),
			dataType: 'json',
			cache: false,
			success: (data) => successCallback(data),
			error: (jqxhr, status, exception) => {
				if (typeof jqxhr.responseJSON != 'undefined' && jqxhr.responseJSON.code == 401 && jqxhr.responseJSON.message == "Expired JWT Token") {
					HTTPRequest.refreshToken(URL_REFRESH, () => HTTPRequest.get(url, data, successCallback, errorCallback), errorCallback);
				} else if (jqxhr.status == 400 && typeof formErrorCallback != 'undefined' && formErrorCallback != null) {
					formErrorCallback(jqxhr, status, exception);
				} else {
					errorCallback(jqxhr, status, exception);
				}
			}
		});
	}

	static download(url, data, errorCallback, completeCallback) {
		if (data == null) {
			data = '';
		}
		else if (typeof data == 'object') {
			data = UrlAndQueryString.buildQuery(data);
		}
		if (data !== '' && data.substring(0, 1) !== '&') {
			data = '&'+data;
		}
		$.ajax({
			type: 'GET',
			url : url+(!url.includes('?')?'?':'')+data,
			headers: HTTPRequest.getHttpHeaders(),
			cache: false,
			xhrFields: {
				responseType: 'blob'
			},
			success: (data, status, jqxhr) => File.download(data, jqxhr.getResponseHeader('Content-Type'), jqxhr.getResponseHeader('Content-Disposition')),
			error: (jqxhr, status, exception) => {
				if (typeof jqxhr.responseJSON != 'undefined' && jqxhr.responseJSON.code == 401 && jqxhr.responseJSON.message == "Expired JWT Token") {
					HTTPRequest.refreshToken(URL_REFRESH, () => HTTPRequest.download(url, data, errorCallback, completeCallback), errorCallback);
				} else if (typeof errorCallback != 'undefined' && errorCallback != null) {
					errorCallback(jqxhr, status, exception);
				}
			},
			complete: (jqxhr, status) => {
				if (typeof completeCallback != 'undefined' && completeCallback != null) {
					completeCallback(jqxhr, status);
				}
			}
		});
	}

	static post(url, formData, successCallback, errorCallback, formErrorCallback) {
		$.ajax({
			type: 'POST',
			url : url,
			headers: HTTPRequest.getHttpHeaders(),
			dataType: 'json',
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: (data) => successCallback(data),
			error: (jqxhr, status, exception) => {
				if (typeof jqxhr.responseJSON != 'undefined' && jqxhr.responseJSON.code == 401 && jqxhr.responseJSON.message == "Expired JWT Token") {
					HTTPRequest.refreshToken(URL_REFRESH, () => HTTPRequest.post(url, formData, successCallback, errorCallback, formErrorCallback), errorCallback);	
				} else if (jqxhr.status == 400 && typeof formErrorCallback != 'undefined' && formErrorCallback != null) {
					formErrorCallback(jqxhr, status, exception);
				} else {
					errorCallback(jqxhr, status, exception);
				}
			}
		});
	}
	
	static refreshToken(url, onCompleteCallback, onErrorCallback) {
		let payload = new FormData();
		payload.append('refresh_token', JwtSession.getRefreshToken());
		
		//pas d'utilisation de la méthode post car on pourrait avoir un header Auth contenant un bearer expiré ce qui ferait échouer le refresh
		$.ajax({
			type: 'POST',
			url : url,
			dataType: 'json',
			data: payload,
			cache: false,
			contentType: false,
			processData: false,
			success: (data) => {
				JwtSession.setToken(data.token);
				JwtSession.setRefreshToken(data.refresh_token);
				onCompleteCallback();
			}, error: (jqxhr, status, exception) => {
				JwtSession.logout();
				onErrorCallback(jqxhr, status, exception);
			}
		});
	}

	static doRequest(url, strParam, methode, formatRetour, callback) {
		var xhr = null;

		if (window.XMLHttpRequest || window.ActiveXObject) {
			if (window.ActiveXObject) {
				try {
					xhr = new ActiveXObject('Msxml2.XMLHTTP');
				} catch(e) {
					xhr = new ActiveXObject('Microsoft.XMLHTTP');
				}
			} else {
				xhr = new XMLHttpRequest();
			}
		} else {
			// Votre navigateur ne supporte pas l'objet XMLHTTPRequest!
			return null;
		}

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
				if (formatRetour == 'xml') {
					var data = xhr.responseXML;
				}
				else {
					var data = eval('('+xhr.responseText+')');
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
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	static get(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
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
		Cookie.set(name,"",-1);
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
			if (strpos === -1 ) {
				params[p] = '';
				//params.length++;
				return true;
			}
			var name = p.substr(0, strpos);
			var value = p.substr(strpos+1, p.length);
			var openBracket = name.indexOf('[');
			var closeBracket = name.indexOf(']');
			// On traite les paramètre qui ne sont pas sous forme de tableau
			if (openBracket === -1 || closeBracket === -1) {
				if (!(openBracket === -1 && closeBracket === -1)) {
					name = name.replace(new RegExp('[\\[\\]]'),'_');
				}
				params[name] = value;
				return true;
			}
			var matches = name.match(new RegExp('\\[.*?\\]','g'));
			name = name.substr(0,openBracket);
			p = 'params';
			var key = name;
			for (let i in matches) {
				if (typeof(matches[i]) == 'function') {
					continue;
				}

				p += '[\''+key+'\']';
				if (eval(p) == undefined || typeof(eval(p)) != 'object') {
					eval(p +'= new Array();');
				}
				key = matches[i].substr(1,matches[i].length-2);
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
			p += '[\''+key+'\']';
			eval(p +'= \''+value+'\';');
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
			var value ='';
			if (prefix !== undefined) {
				p = prefix;
			}
			if (typeof(object) == 'object') {
				for (var name in object) {
					value = object[name];
					// 14/01/2020 : les tableaux avec param[0], param[1] en query string fonctionne pas, il faut mettre param[]=x&param[]=y
					//name = p == '' ? name : '['+name+']';
					name = p == '' ? name : '[]';
					if (typeof(value) == 'object') {
						buildStringFromParam(value,p+name);
					}
					else if (typeof(value) != 'function' && name != '') {
						// 27/01/2020 : correction bug boolean affiché en string true/false
						if (typeof(value) == 'boolean') {
							value = (value?1:0);
						}
						params[params.length] = p+name+'='+value;
					}
				}
			}
		}

		buildStringFromParam(object);
		return params.join('&');
	}
}
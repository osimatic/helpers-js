class JwtToken {
	static parseJwt (token) {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));

		return JSON.parse(jsonPayload);
	}

	static hasRole(token, role) {
		if (token == null) {
			return false;
		}

		let payload = JwtToken.parseJwt(token);
		return payload.roles.indexOf(role) !== -1;
	}
}

class JwtSession {
	static denyAccessUnlessGranted(roles) {
		let hasRole = false;
		
		roles.forEach(role => {
			if (JwtSession.isGranted(role)) {
				hasRole = true;
			}
		});

		return hasRole;
	}

	static setToken(token) {
		localStorage.setItem('access_token', token);
	}

	static getToken() {
		return localStorage.getItem('access_token');
	}

	static setRefreshToken(token) {
		localStorage.setItem('refresh_token', token);
	}

	static getRefreshToken() {
		return localStorage.getItem('refresh_token');
	}

	static isSimulationConnexion() {
		return localStorage.getItem('admin_refresh_token') != null && localStorage.getItem('admin_access_token') != null;
	}

	static cancelSimulationConnexion() {
		localStorage.setItem('refresh_token', localStorage.getItem('admin_refresh_token'));
		localStorage.setItem('access_token', localStorage.getItem('admin_access_token'));

		localStorage.removeItem('admin_refresh_token');
		localStorage.removeItem('admin_access_token');
	}

	static logout() {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
	}

	static getData(key) {
		let token = JwtSession.getToken();
		if (token == null) {
			return null;
		}

		let payload = JwtToken.parseJwt(token);
		if (typeof payload[key] != 'undefined') {
			return payload[key];
		}
		return null;
	}

	static isAnonymous() {
		return localStorage.getItem('access_token') == null;
	}

	static isGranted(role) {
		let token = localStorage.getItem('access_token');
		if (token == null) {
			return false;
		}

		let payload = JwtToken.parseJwt(token);
		return payload.roles.indexOf(role) !== -1;
	}
}

class ApiTokenSession {
	static denyAccessUnlessGranted(roles) {
		let hasRole = false;

		roles.forEach(role => {
			if (ApiTokenSession.isGranted(role)) {
				hasRole = true;
			}
		});

		return hasRole;
	}

	static getToken() {
		return localStorage.getItem('api_token');
	}
	static setToken(token) {
		localStorage.setItem('api_token', token);
	}

	static getTokenData() {
		let tokenData = localStorage.getItem('token_data');
		if (null == tokenData) {
			return null;
		}
		return JSON.parse(tokenData);
	}
	static setTokenData(data) {
		localStorage.setItem('token_data', JSON.stringify(data));
	}

	static logout() {
		localStorage.removeItem('api_token');
		localStorage.removeItem('token_data');
	}

	static getData(key) {
		let tokenData = ApiTokenSession.getTokenData();
		if (tokenData == null) {
			return null;
		}

		if (typeof tokenData[key] != 'undefined') {
			return tokenData[key];
		}
		return null;
	}

	static isAnonymous() {
		return ApiTokenSession.getToken() == null;
	}

	static isGranted(role) {
		if (ApiTokenSession.getToken() == null) {
			return false;
		}

		let roles = [];
		if (null !== ApiTokenSession.getData('role')) {
			roles = ApiTokenSession.getData('role');
		}
		if (null !== ApiTokenSession.getData('roles')) {
			roles = ApiTokenSession.getData('roles');
		}
		roles = Array.isArray(roles) ? roles : [roles];

		return roles.indexOf(role) !== -1;
	}
}

module.exports = { JwtToken, JwtSession, ApiTokenSession };
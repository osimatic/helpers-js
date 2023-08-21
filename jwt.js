class JwtToken {
	static parseJwt (token) {
		let base64Url = token.split('.')[1];
		let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));

		return JSON.parse(jsonPayload);
	}

	static getData(token, key) {
		if (token == null) {
			return null;
		}

		let payload = JwtToken.parseJwt(token);
		if (typeof payload[key] != 'undefined') {
			return payload[key];
		}
		return null;
	}

	static hasRole(token, role) {
		if (token == null) {
			return false;
		}

		let payload = JwtToken.parseJwt(token);
		return typeof payload['roles'] != 'undefined' && payload['roles'].indexOf(role) !== -1;
	}
}

class JwtSession {
	static setOnLoginCallback(callback) {
		JwtSession.onLoginCallback = callback;
	}
	static setOnLogoutCallback(callback) {
		JwtSession.onLogoutCallback = callback;
	}
	static setOnNewTokenCallback(callback) {
		JwtSession.onNewTokenCallback = callback;
	}
	static setOnSessionExpireCallback(callback) {
		JwtSession.onSessionExpireCallback = callback;
	}

	static getToken() {
		return localStorage.getItem('access_token');
	}
	static setToken(token) {
		localStorage.setItem('access_token', token);
	}

	static getRefreshToken() {
		return localStorage.getItem('refresh_token');
	}
	static setRefreshToken(token) {
		localStorage.setItem('refresh_token', token);
	}

	static login(data, redirectUrl, onComplete) {
		console.log('JwtSession.login()');
		JwtSession.setToken(data['access_token'] || data['token']);
		JwtSession.setRefreshToken(data['refresh_token']);

		localStorage.removeItem('real_users');

		if (typeof JwtSession.onLoginCallback == 'function') {
			JwtSession.onLoginCallback();
		}
		if (typeof onComplete == 'function') {
			onComplete();
		}

		if (typeof redirectUrl != 'undefined' && null != redirectUrl) {
			window.location.href = redirectUrl;
		}
	}

	static updateToken(accessToken, refreshToken, onComplete) {
		console.log('JwtSession.updateToken()');
		JwtSession.setToken(accessToken);

		if (typeof refreshToken != 'undefined' && null != refreshToken) {
			JwtSession.setRefreshToken(refreshToken);
		}

		if (typeof JwtSession.onNewTokenCallback == 'function') {
			JwtSession.onNewTokenCallback();
		}
		if (typeof onComplete == 'function') {
			onComplete();
		}
	}

	static logout(redirectUrl, onComplete) {
		console.log('JwtSession.logout()');
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');

		localStorage.removeItem('real_users');

		if (typeof JwtSession.onLogoutCallback == 'function') {
			JwtSession.onLogoutCallback();
		}
		if (typeof onComplete == 'function') {
			onComplete();
		}

		if (typeof redirectUrl != 'undefined' && null != redirectUrl) {
			window.location.href = redirectUrl;
		}
	}

	static expireSession(redirectUrl, onComplete) {
		console.log('JwtSession.expireSession()');
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');

		localStorage.removeItem('real_users');

		if (typeof JwtSession.onSessionExpireCallback == 'function') {
			JwtSession.onSessionExpireCallback();
		}
		if (typeof onComplete == 'function') {
			onComplete();
		}

		if (typeof redirectUrl != 'undefined' && null != redirectUrl) {
			window.location.href = redirectUrl;
		}
	}

	static getData(key) {
		return JwtToken.getData(JwtSession.getToken(), key);
	}

	static isAnonymous() {
		return localStorage.getItem('access_token') == null;
	}

	static isGranted(role) {
		return JwtToken.hasRole(JwtSession.getToken(), role);
	}

	static denyAccessUnlessGranted(roles) {
		let hasRole = false;

		roles.forEach(role => {
			if (JwtSession.isGranted(role)) {
				hasRole = true;
			}
		});

		return hasRole;
	}


	static getRealLoggedUsers() {
		let realUsers = [];
		if (localStorage.getItem('real_users') != null) {
			realUsers = JSON.parse(localStorage.getItem('real_users'));
		}
		return realUsers;
	}

	static simulateLogin(loginData, redirectUrl, onComplete) {
		console.log('JwtSession.simulateLogin');

		// on sauvegarde les tokens de l'utilisateur réellement connecté
		let realUsers = JwtSession.getRealLoggedUsers();
		realUsers.push({
			access_token: JwtSession.getToken(),
			refresh_token: JwtSession.getRefreshToken(),
		});
		localStorage.setItem('real_users', JSON.stringify(realUsers));

		// on enregistre la session de l'utilisateur simulé
		JwtSession.setToken(loginData['access_token'] || loginData['token']);
		JwtSession.setRefreshToken(loginData['refresh_token']);

		if (typeof onComplete == 'function') {
			onComplete();
		}

		if (typeof redirectUrl != 'undefined' && null != redirectUrl) {
			window.location.href = redirectUrl;
		}
	}

	static cancelSimulatedLogin(redirectUrl, onComplete) {
		console.log('JwtSession.cancelSimulatedLogin');

		// on récupère les tokens de l'utilisateur réellement connecté
		let realUsers = JwtSession.getRealLoggedUsers();
		let loginData = realUsers.pop();

		if (typeof loginData == 'undefined' || null == loginData) {
			return;
		}

		localStorage.setItem('real_users', JSON.stringify(realUsers));

		JwtSession.setToken(loginData['access_token'] || loginData['token']);
		JwtSession.setRefreshToken(loginData['refresh_token']);

		if (typeof onComplete == 'function') {
			onComplete();
		}

		if (typeof redirectUrl != 'undefined' && null != redirectUrl) {
			window.location.href = redirectUrl;
		}
	}

}

class ApiTokenSession {
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

	static denyAccessUnlessGranted(roles) {
		let hasRole = false;

		roles.forEach(role => {
			if (ApiTokenSession.isGranted(role)) {
				hasRole = true;
			}
		});

		return hasRole;
	}
}

module.exports = { JwtToken, JwtSession, ApiTokenSession };
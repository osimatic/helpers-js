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

module.exports = { JwtToken, JwtSession };
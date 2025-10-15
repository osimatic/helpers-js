class Password {
	static getPasswordStrength(password) {
		let score = 0;

		if (password.length >= 8) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[a-z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;

		if (password.length > 12 && score >= 4) score++; // Bonus pour long mot de passe

		return score;
	}

	static updatePasswordStrengthUI(div, password) {
		const score = Password.getPasswordStrength(password);

		const strengthBar = div.find('.password_strength_bar');
		const strengthText = div.find('.password_strength_text');

		let width = (score / 6) * 100;
		let color = 'bg-danger';
		let text = 'Très faible';

		if (score >= 2) { color = 'bg-warning'; text = 'Faible'; }
		if (score >= 4) { color = 'bg-info'; text = 'Moyen'; }
		if (score >= 5) { color = 'bg-success'; text = 'Fort'; }

		strengthBar.className = `progress-bar ${color}`;
		strengthBar.style.width = `${width}%`;
		strengthText.textContent = text;
	}
}

module.exports = { Password };
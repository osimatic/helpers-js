class IBAN {
	static format(iban) {
		return iban.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
	}
}

class BankCard {
	static formatCardNumber(cardNumber) {
		if (cardNumber.length === 16) {
			cardNumber = cardNumber.substring(0, 4)+'-'+cardNumber.substring(4, 8)+'-'+cardNumber.substring(8, 12)+'-'+cardNumber.substring(12, 16);
			cardNumber = cardNumber.replace(/(\*)/gi, 'X');
		}
		return cardNumber;
	}

	static formatExpirationDate(expirationDate) {
		let locale = typeof locale != 'undefined' ? locale : 'fr-FR';
		return SqlDateTime.getMonthName(expirationDate, locale)+' '+SqlDateTime.getYear(expirationDate);
	}
}

module.exports = { IBAN, BankCard };
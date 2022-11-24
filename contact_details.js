
class PersonName {

	static format(firstName, lastName) {
		let str = '';
		if (firstName != null && firstName != '') {
			str += ' '+firstName;
		}
		if (lastName != null && lastName != '') {
			str += ' '+lastName;
		}
		return str.trim();
	}

	static checkFirstName(firstName) {
		if (firstName.length < 2 || firstName.length > 64) {
			return false;
		}

		let regEx = /^([a-zA-Z'àâäéèêëìîïòôöùûüçÀÂÄÉÈÊËÌÎÏÒÔÖÙÛÜÇ\s-]+)$/;
		return regEx.exec(firstName) != null;
	}

	static checkLastName(lastName) {
		if (lastName.length < 2 || lastName.length > 64) {
			return false;
		}

		let regEx = /^([a-zA-Z'àâäéèêëìîïòôöùûüçÀÂÄÉÈÊËÌÎÏÒÔÖÙÛÜÇ\s-]+)$/;
		return regEx.exec(lastName) != null;
	}
}

class Email {
	static validateEmail(email) {
		let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	static checkEmail(email) {
		let regExEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,5}$/;
		return regExEmail.exec(email) != null;
	}

	static getMailToLink(email) {
		return '<a href="mailto:'+email+'">'+email+'</a>';
	}
}

class TelephoneNumber {
	//this class works with libphonenumber-max.min.js

	static setIntlTelInputUtilsPath(path) {
		TelephoneNumber.intlTelInputUtilsPath = path;
	}

	static getCountryIsoCode(phoneNumber, localCountryIsoCode) {
		localCountryIsoCode = (typeof localCountryIsoCode != 'undefined' ? localCountryIsoCode.toUpperCase() : serviceCountry);
		return libphonenumber.parsePhoneNumber(phoneNumber, localCountryIsoCode).country || '';
	}
	static getCountryName(phoneNumber, localCountryIsoCode) {
		return Country.getCountryName(this.getCountryIsoCode(phoneNumber, localCountryIsoCode));
	}
	static getFlagImg(phoneNumber, localCountryIsoCode) {
		return Country.getFlagImg(this.getCountryIsoCode(phoneNumber, localCountryIsoCode));
	}
	static formatNational(phoneNumber, localCountryIsoCode) {
		localCountryIsoCode = (typeof localCountryIsoCode != 'undefined' ? localCountryIsoCode.toUpperCase() : serviceCountry);
		return libphonenumber.parsePhoneNumber(phoneNumber, localCountryIsoCode).formatNational();
	}
	static formatInternational(phoneNumber, localCountryIsoCode) {
		localCountryIsoCode = (typeof localCountryIsoCode != 'undefined' ? localCountryIsoCode.toUpperCase() : serviceCountry);
		return libphonenumber.parsePhoneNumber(phoneNumber, localCountryIsoCode).formatInternational();
	}
	static formatInternationalWithTelLink(phoneNumber, localCountryIsoCode) {
		return '<a href="tel:'+phoneNumber+'">'+TelephoneNumber.formatInternational(phoneNumber, localCountryIsoCode)+'</a>';
	}
	static formatNationalWithFlagImg(phoneNumber, localCountryIsoCode) {
		return TelephoneNumber.getFlagImg(phoneNumber, localCountryIsoCode)+'&nbsp;'+TelephoneNumber.formatNational(phoneNumber, localCountryIsoCode);
	}
	static formatNationalWithFlagImgAndTelLink(phoneNumber, localCountryIsoCode) {
		return TelephoneNumber.getFlagImg(phoneNumber, localCountryIsoCode)+'&nbsp;<a href="tel:'+phoneNumber+'">'+TelephoneNumber.formatNational(phoneNumber, localCountryIsoCode)+'</a>';
	}

	static parse(phoneNumber, localCountryIsoCode) {
		localCountryIsoCode = (typeof localCountryIsoCode != 'undefined' ? localCountryIsoCode.toUpperCase() : serviceCountry);
		try {
			const number = libphonenumber.parsePhoneNumber(phoneNumber, localCountryIsoCode);
			return number != null ? number.formatInternational() : null;
		} catch (error) {
			console.error(error);
		}
		return '';
	}

	static check(phoneNumber, localCountryIsoCode) {
		localCountryIsoCode = (typeof localCountryIsoCode != 'undefined' ? localCountryIsoCode.toUpperCase() : serviceCountry);
		const number = libphonenumber.parsePhoneNumber(phoneNumber, localCountryIsoCode);
		return number != null ? number.isValid() : false;
		//var numberObject = libphonenumber.parse(phoneNumber, localCountryIsoCode);
		//return (typeof numberObject.country !== 'undefined');
	}

	static checkSyntaxe(phoneNumber) {
		let verifPhoneFr = /^(0)[1-9]{1}[ \.\-]?[0-9]{2}[ \.\-]?[0-9]{2}[ \.\-]?[0-9]{2}[ \.\-]?[0-9]{2}$/;
		let verifPhoneInt = /^((\+)|(00))[1-9]{1}[0-9]{0,3}([ \.\-\/]?[0-9]{1}){4,20}$/;
		if (verifPhoneFr.exec(phoneNumber) != null) {
			return true;
		}
		return verifPhoneInt.exec(phoneNumber) != null;
	}
	
	static getType(phoneNumber, localCountryIsoCode) {
		localCountryIsoCode = (typeof localCountryIsoCode != 'undefined' ? localCountryIsoCode.toUpperCase() : serviceCountry);

		if (phoneNumber == null || phoneNumber.length === 0) {
			return 'MASKED';
		}
		
		let number = libphonenumber.parsePhoneNumber(phoneNumber, localCountryIsoCode);
		return number != null ? number.getType() : null;
	}

	static getTypeLabelList() {
		return {
			FIXED_LINE: 'Fixe',
			MOBILE: 'Mobile',
			FIXED_LINE_OR_MOBILE: 'Fixe ou Mobile',
			TOLL_FREE: 'Vert',
			PREMIUM_RATE: 'Surtaxé',
			SHARED_COST: 'Coût partagé',
			VOIP: 'VOIP',
			PERSONAL_NUMBER: 'Personnel',
			PAGER: 'Pager',
			UAN: 'UAN',
			UNKNOWN: 'Inconnu',
			MASKED: 'Masqué',
		};
	}

	static getTypeLabel(phoneNumberType) {
		return TelephoneNumber.getTypeLabelList()[phoneNumberType] || 'Inconnu';
	}

	static setIntlTelInput(input, placeholderNumberType) {
		return window.intlTelInput(input[0], {
			initialCountry: serviceCountry,
			placeholderNumberType: placeholderNumberType || 'FIXED_LINE_OR_MOBILE',
			utilsScript: typeof TelephoneNumber.intlTelInputUtilsPath != 'undefined' ? TelephoneNumber.intlTelInputUtilsPath : null
		});
	}

	static getEnteredNumberInInternationalFormat(intlTelInput) {
		return intlTelInput.getNumber(intlTelInputUtils.numberFormat.E164);
	}

	static formatNumberFromIntlTelInput(intlTelInput) {
		let number = intlTelInput.getNumber();
		if (number != '' && number.substr(0, 1) !== '+') {
			number = '+' + intlTelInput.getSelectedCountryData().dialCode + number;
		}
		return number;
	}
}

module.exports = { PersonName, Email, TelephoneNumber };
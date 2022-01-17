
class PersonName {

	static format(firstName, lastName) {
		var str = '';
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

		var regEx = /^([a-zA-Z'àâäéèêëìîïòôöùûüçÀÂÄÉÈÊËÌÎÏÒÔÖÙÛÜÇ\s-]+)$/;
		if (regEx.exec(firstName) == null) {
			return false;
		}

		return true;
	}

	static checkLastName(lastName) {
		if (lastName.length < 2 || lastName.length > 64) {
			return false;
		}

		var regEx = /^([a-zA-Z'àâäéèêëìîïòôöùûüçÀÂÄÉÈÊËÌÎÏÒÔÖÙÛÜÇ\s-]+)$/;
		if (regEx.exec(lastName) == null) {
			return false;
		}

		return true;
	}
}

class Email {
	static validateEmail(email) {
		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	static checkEmail(email) {
		var regExEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,5}$/;
		return (regExEmail.exec(email) != null);
	}
}

class TelephoneNumber {

	static getCountryIsoCode(phoneNumber, localCountryIsoCode) {
		localCountryIsoCode = (typeof localCountryIsoCode != 'undefined' ? localCountryIsoCode.toUpperCase() : serviceCountry);
		return libphonenumber.parse(phoneNumber, localCountryIsoCode).country || '';
	}
	static getCountryName(phoneNumber, localCountryIsoCode) {
		return Country.getCountryName(this.getCountryIsoCode(phoneNumber, localCountryIsoCode));
	}
	static getFlagImg(phoneNumber, localCountryIsoCode) {
		return Country.getFlagImg(this.getCountryIsoCode(phoneNumber, localCountryIsoCode));
	}
	static formatNational(phoneNumber, localCountryIsoCode) {
		localCountryIsoCode = (typeof localCountryIsoCode != 'undefined' ? localCountryIsoCode.toUpperCase() : serviceCountry);
		return libphonenumber.format(phoneNumber, this.getCountryIsoCode(phoneNumber, localCountryIsoCode), 'National');
	}
	static formatInternational(phoneNumber, localCountryIsoCode) {
		localCountryIsoCode = (typeof localCountryIsoCode != 'undefined' ? localCountryIsoCode.toUpperCase() : serviceCountry);
		return libphonenumber.format(phoneNumber, this.getCountryIsoCode(phoneNumber, localCountryIsoCode), 'International');
	}
	static formatNationalWithFlagImg(phoneNumber, localCountryIsoCode) {
		return TelephoneNumber.getFlagImg(phoneNumber, localCountryIsoCode)+'&nbsp;'+TelephoneNumber.formatNational(phoneNumber);
	}
	static formatNationalWithFlagImgAndTelLink(phoneNumber, localCountryIsoCode) {
		return TelephoneNumber.getFlagImg(phoneNumber, localCountryIsoCode)+'&nbsp;<a href="tel:'+phoneNumber+'">'+TelephoneNumber.formatNational(phoneNumber)+'</a>';
	}

	static parse(phoneNumber, localCountryIsoCode) {
		localCountryIsoCode = (typeof localCountryIsoCode != 'undefined' ? localCountryIsoCode.toUpperCase() : serviceCountry);
		try {
			var numberObject = libphonenumber.parse(phoneNumber, localCountryIsoCode);
			return libphonenumber.format(numberObject.phone, numberObject.country, 'E.164');
		}
		catch (error) {
		}
		return '';
	}

	static check(phoneNumber, localCountryIsoCode) {
		localCountryIsoCode = (typeof localCountryIsoCode != 'undefined' ? localCountryIsoCode.toUpperCase() : serviceCountry);
		return libphonenumber.isValidNumber(phoneNumber, localCountryIsoCode);
		//var numberObject = libphonenumber.parse(phoneNumber, localCountryIsoCode);
		//return (typeof numberObject.country !== 'undefined');
	}

	static checkSyntaxe(phoneNumber) {
		var verifPhoneFr = /^(0)[1-9]{1}[ \.\-]?[0-9]{2}[ \.\-]?[0-9]{2}[ \.\-]?[0-9]{2}[ \.\-]?[0-9]{2}$/;
		var verifPhoneInt = /^((\+)|(00))[1-9]{1}[0-9]{0,3}([ \.\-\/]?[0-9]{1}){4,20}$/;
		// var verifPhoneInt = /^((\+)|(00))([ \.\-\/]?[0-9]{1}){6-20}$/;
		//var verifPhone = /^[0-9+() .-]{6,32}$/;
		if (verifPhoneFr.exec(phoneNumber) != null) {
			return true;
		}
		if (verifPhoneInt.exec(phoneNumber) != null) {
			return true;
		}
		//console.log(verifPhoneInt);
		// console.log('"'+phoneNumber+'" not valid');
		return false;
	}

	static setIntlTelInput(input, placeholderNumberType) {
		return window.intlTelInput(input[0], {
			initialCountry: serviceCountry,
			placeholderNumberType: placeholderNumberType || 'FIXED_LINE_OR_MOBILE',
			utilsScript: intlTelInputUtilsPath
		});
	}

	static getEnteredNumberInInternationalFormat(intlTelInput) {
		return intlTelInput.getNumber(intlTelInputUtils.numberFormat.E164);
	}

	static formatNumberFromIntlTelInput(intlTelInput) {
		var number = intlTelInput.getNumber();
		if (number != '' && number.substr(0, 1) !== '+') {
			number = '+' + intlTelInput.getSelectedCountryData().dialCode + number;
		}
		return number;
	}
}
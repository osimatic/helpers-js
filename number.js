
class NumberValue {
	static isNumeric(sText) {
		var ValidChars = "0123456789.";
		var IsNumber=true;
		var Char;
		for (i = 0; i < sText.length && IsNumber == true; i++){
			Char = sText.charAt(i);
			if (ValidChars.indexOf(Char) == -1){
				IsNumber = false;
			}
		}
		return IsNumber;
	}

	static format(number, nbDecimal, locale) {
		nbDecimal = (typeof nbDecimal != 'undefined'?nbDecimal:2);
		return new Intl.NumberFormat(locale, {
			minimumFractionDigits: nbDecimal,
			maximumFractionDigits: nbDecimal
		}).format(number);
	}

	static formatCurrency(montant, currency, nbDecimal, locale) {
		nbDecimal = (typeof nbDecimal != 'undefined'?nbDecimal:2);
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: nbDecimal,
			maximumFractionDigits: nbDecimal
		}).format(montant);
	}

	static formatPercent(number, nbDecimal, locale) {
		nbDecimal = (typeof nbDecimal != 'undefined'?nbDecimal:2);
		return new Intl.NumberFormat(locale, {
			style: 'percent',
			minimumFractionDigits: nbDecimal,
			maximumFractionDigits: nbDecimal
		}).format(number);
	}

	static random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static padLeft2(n) {
		return n > 9 ? "" + n: "0" + n;
	}

	static roundDecimal(nombre, precision) {
		precision = precision || 2;
		var tmp = Math.pow(10, precision);
		return Math.round(nombre*tmp) / tmp;
	}
}

/**
 * Number.prototype.format(n, x, s, c)
 * 
 * @param integer n: length of decimal
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 * @param integer x: length of sections
 */
Number.prototype.formatForDisplay = function(n, s, c, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

Number.prototype.formatAsString = function(locale, minimumFractionDigits) {
	minimumFractionDigits = (typeof minimumFractionDigits != 'undefined'?minimumFractionDigits:0);
	return new Intl.NumberFormat(locale, {minimumFractionDigits: minimumFractionDigits}).format(this);
};

Number.prototype.formatAsCurrency = function(locale, currency, nbFractionDigits) {
	nbFractionDigits = (typeof nbFractionDigits != 'undefined'?nbFractionDigits:2);
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: nbFractionDigits,
		maximumFractionDigits: nbFractionDigits
	}).format(this);
};

Number.prototype.formatAsPercent = function(locale, minimumFractionDigits) {
	minimumFractionDigits = (typeof minimumFractionDigits != 'undefined'?minimumFractionDigits:0);
	return new Intl.NumberFormat(locale, {style: 'percent', minimumFractionDigits:minimumFractionDigits}).format(this);
};

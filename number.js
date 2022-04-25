
/** @deprecated */
class NumberValue {
	/** @deprecated */
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

	/** @deprecated */
	static format(number, nbDecimal, locale) {
		nbDecimal = (typeof nbDecimal != 'undefined'?nbDecimal:2);
		return new Intl.NumberFormat(locale, {
			minimumFractionDigits: nbDecimal,
			maximumFractionDigits: nbDecimal
		}).format(number);
	}

	/** @deprecated */
	static formatCurrency(montant, currency, nbDecimal, locale) {
		nbDecimal = (typeof nbDecimal != 'undefined'?nbDecimal:2);
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: nbDecimal,
			maximumFractionDigits: nbDecimal
		}).format(montant);
	}

	/** @deprecated */
	static formatPercent(number, nbDecimal, locale) {
		nbDecimal = (typeof nbDecimal != 'undefined'?nbDecimal:2);
		return new Intl.NumberFormat(locale, {
			style: 'percent',
			minimumFractionDigits: nbDecimal,
			maximumFractionDigits: nbDecimal
		}).format(number);
	}

	/** @deprecated */
	static random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/** @deprecated */
	static padLeft2(n) {
		return n > 9 ? "" + n: "0" + n;
	}

	/** @deprecated */
	static roundDecimal(nombre, precision) {
		precision = precision || 2;
		var tmp = Math.pow(10, precision);
		return Math.round(nombre*tmp) / tmp;
	}
}

Number.prototype.format = Number.prototype.format || function(nbDecimal, locale) {
	nbDecimal = (typeof nbDecimal != 'undefined'?nbDecimal:2);
	return new Intl.NumberFormat(locale, {
		minimumFractionDigits: nbDecimal,
		maximumFractionDigits: nbDecimal
	}).format(this);
}

if (!Number.format) {
	Number.format = function(number, nbDecimal, locale) {
		nbDecimal = (typeof nbDecimal != 'undefined'?nbDecimal:2);
		return new Intl.NumberFormat(locale, {
			minimumFractionDigits: nbDecimal,
			maximumFractionDigits: nbDecimal
		}).format(number);
	};
}

/**
 * Number.prototype.format(n, x, s, c)
 *
 * @param integer n: length of decimal
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 * @param integer x: length of sections
 */
Number.prototype.formatForDisplay = Number.prototype.formatForDisplay || function(n, s, c, x) {
	var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
		num = this.toFixed(Math.max(0, ~~n));
	return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

Number.prototype.formatCurrency = Number.prototype.formatCurrency || function(currency, nbDecimal, locale) {
	nbDecimal = (typeof nbDecimal != 'undefined'?nbDecimal:2);
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: nbDecimal,
		maximumFractionDigits: nbDecimal
	}).format(this);
}

Number.prototype.formatPercent = Number.prototype.formatPercent || function(nbDecimal, locale) {
	nbDecimal = (typeof nbDecimal != 'undefined'?nbDecimal:2);
	return new Intl.NumberFormat(locale, {
		style: 'percent',
		minimumFractionDigits: nbDecimal,
		maximumFractionDigits: nbDecimal
	}).format(this);
}

Number.prototype.padLeft2 = Number.prototype.padLeft2 || function(n) {
	return this > 9 ? "" + this : "0" + this;
}

Number.prototype.roundDecimal = Number.prototype.roundDecimal || function(precision) {
	precision = precision || 2;
	var tmp = Math.pow(10, precision);
	return Math.round(this*tmp) / tmp;
}

if (!Number.random) {
	Number.random = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
}

/** @deprecated */
Number.prototype.formatAsString = function(locale, minimumFractionDigits) {
	minimumFractionDigits = (typeof minimumFractionDigits != 'undefined'?minimumFractionDigits:0);
	return new Intl.NumberFormat(locale, {minimumFractionDigits: minimumFractionDigits}).format(this);
};
/** @deprecated */
Number.prototype.formatAsCurrency = function(locale, currency, nbFractionDigits) {
	nbFractionDigits = (typeof nbFractionDigits != 'undefined'?nbFractionDigits:2);
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: nbFractionDigits,
		maximumFractionDigits: nbFractionDigits
	}).format(this);
};
/** @deprecated */
Number.prototype.formatAsPercent = function(locale, minimumFractionDigits) {
	minimumFractionDigits = (typeof minimumFractionDigits != 'undefined'?minimumFractionDigits:0);
	return new Intl.NumberFormat(locale, {style: 'percent', minimumFractionDigits:minimumFractionDigits}).format(this);
};

module.exports = { NumberValue };
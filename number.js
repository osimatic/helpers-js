class NumberFormatter {
	static getDecimalFormatter(locale, digits = 2) {
		this.decimalFormatter = this.decimalFormatter || {};
		if (typeof this.decimalFormatter[locale+digits] == 'undefined') {
			this.decimalFormatter[locale+digits] = new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
		}
	
		return this.decimalFormatter[locale+digits];
	}

	static getCurrencyFormatter(locale, currency, digits = 2) {
		this.currencyFormatter = this.currencyFormatter || {};
		if (typeof this.currencyFormatter[locale+currency+digits] == 'undefined') {
			this.currencyFormatter[locale+currency+digits] = new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits, style: 'currency', currency });
		}
	
		return this.currencyFormatter[locale+currency+digits];
	}

	static getPercentFormatter(locale, digits = 2) {
		this.percentFormatter = this.percentFormatter || {};
		if (typeof this.percentFormatter[locale+digits] == 'undefined') {
			this.percentFormatter[locale+digits] = new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits, style: 'percent' });
		}
	
		return this.percentFormatter[locale+digits];
	}
}

Number.prototype.format = Number.prototype.format || function(nbDecimal=2, locale='fr-FR') {
	return Number.format(this, nbDecimal, locale);
}

if (!Number.format) {
	Number.format = function(number, nbDecimal=2, locale='fr-FR') {
		return NumberFormatter.getDecimalFormatter(locale, nbDecimal).format(number);
	};
}

Number.prototype.formatCurrency = Number.prototype.formatCurrency || function(currency, nbDecimal=2, locale='fr-FR') {
	return Number.formatCurrency(this, currency, nbDecimal, locale);
}

Number.formatCurrency = Number.formatCurrency || function(number, currency, nbDecimal=2, locale='fr-FR') {
	return NumberFormatter.getCurrencyFormatter(locale, currency, nbDecimal).format(number);
}

Number.prototype.formatPercent = Number.prototype.formatPercent || function(nbDecimal=2, locale='fr-FR') {
	return Number.formatPercent(this, nbDecimal, locale);
}

Number.formatPercent = Number.formatPercent || function(number, nbDecimal=2, locale='fr-FR') {
	return NumberFormatter.getPercentFormatter(locale, nbDecimal).format(number);
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
	let re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
		num = this.toFixed(Math.max(0, ~~n));
	return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

Number.prototype.truncate = Number.prototype.truncate || function() {
	return this < 0 ? Math.ceil(this) : Math.floor(this);
}

Number.prototype.padLeft2 = Number.prototype.padLeft2 || function() {
	return Number.padLeft2(this);
}
Number.padLeft2 = Number.padLeft2 || function(n) {
	return n > 9 ? "" + n : "0" + n;
}

Number.prototype.roundDecimal = Number.prototype.roundDecimal || function(precision) {
	return Number.roundDecimal(this, precision);
}
Number.roundDecimal = Number.roundDecimal || function(number, precision) {
	precision = precision || 2;
	let tmp = Math.pow(10, precision);
	return Math.round(number*tmp) / tmp;
}

Math.getDecimals = Math.getDecimals || function(number) {
	return parseInt((number+"").split(".")[1] || 0);
}

if (!Number.random) {
	Number.random = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
}

module.exports = { NumberFormatter };
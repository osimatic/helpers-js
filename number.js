class NumberFormatter {
	static getDecimalFormatter(locale, digits = 2) {
		this.decimalFormatter = this.decimalFormatter || {};
		if (typeof this.decimalFormatter[locale] == 'undefined') {
			this.decimalFormatter[locale] = new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
		}
	
		return this.decimalFormatter[locale];
	}

	static getCurrencyFormatter(locale, currency, digits = 2) {
		this.currencyFormatter = this.currencyFormatter || {};
		if (typeof this.currencyFormatter[currency+locale] == 'undefined') {
			this.currencyFormatter[currency+locale] = new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits, style: 'currency', currency });
		}
	
		return this.currencyFormatter[currency+locale];
	}

	static getPercentFormatter(locale, digits = 2) {
		this.percentFormatter = this.percentFormatter || {};
		if (typeof this.percentFormatter[locale] == 'undefined') {
			this.percentFormatter[locale] = new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits, style: 'percent' });
		}
	
		return this.percentFormatter[locale];
	}
}

Number.prototype.format = Number.prototype.format || function(nbDecimal, locale) {
	return Number.format(this, nbDecimal, locale);
}

if (!Number.format) {
	Number.format = function(number, nbDecimal, locale) {
		return NumberFormatter.getDecimalFormatter(locale, (typeof nbDecimal != 'undefined' ? nbDecimal : 2)).format(number);
	};
}

Number.prototype.formatCurrency = Number.prototype.formatCurrency || function(currency, nbDecimal, locale) {
	return Number.formatCurrency(this, currency, nbDecimal, locale);
}

Number.formatCurrency = Number.formatCurrency || function(number, currency, nbDecimal, locale) {
	return NumberFormatter.getCurrencyFormatter(locale, currency, (typeof nbDecimal != 'undefined' ? nbDecimal : 2)).format(number);
}

Number.prototype.formatPercent = Number.prototype.formatPercent || function(nbDecimal, locale) {
	return Number.formatPercent(this, nbDecimal, locale);
}

Number.formatPercent = Number.formatPercent || function(number, nbDecimal, locale) {
	return NumberFormatter.getPercentFormatter(locale, (typeof nbDecimal != 'undefined'?nbDecimal:2)).format(number);
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

if (!Number.random) {
	Number.random = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
}

module.exports = { NumberFormatter };
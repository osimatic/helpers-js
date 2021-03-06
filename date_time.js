
class DateTime {

	static getSqlDate(jsDate, timeZone="Europe/Paris") {
		let pad = function(num) { return ('00'+num).slice(-2) };
		// return jsDate.getUTCFullYear() + '-' + pad(jsDate.getUTCMonth() + 1) + '-' + pad(jsDate.getUTCDate());
		//return jsDate.getFullYear() + '-' + pad(jsDate.getMonth() + 1) + '-' + pad(jsDate.getDate());
		return jsDate.toLocaleDateString('fr-FR', {year: 'numeric', timeZone: timeZone})+'-'+jsDate.toLocaleDateString('fr-FR', {month: '2-digit', timeZone: timeZone})+'-'+jsDate.toLocaleDateString('fr-FR', {day: '2-digit', timeZone: timeZone});
	}

	static getSqlTime(jsDate, timeZone="Europe/Paris") {
		let pad = function(num) { return ('00'+num).slice(-2) };
		// return pad(jsDate.getUTCHours()) + ':' + pad(jsDate.getUTCMinutes()) + ':' + pad(jsDate.getUTCSeconds());
		//return pad(jsDate.getHours()) + ':' + pad(jsDate.getMinutes()) + ':' + pad(jsDate.getSeconds());
		return pad(jsDate.toLocaleTimeString('en-GB', {hour: 'numeric', timeZone: timeZone}))+':'+pad(jsDate.toLocaleTimeString('en-GB', {minute: 'numeric', timeZone: timeZone}))+':'+pad(jsDate.toLocaleTimeString('en-GB', {second: 'numeric', timeZone: timeZone}));
	}

	static getSqlDateTime(jsDate) {
		return this.getSqlDate(jsDate)+' '+this.getSqlTime(jsDate);
	}

	static getTimestamp(jsDate) {
		return jsDate.getTime();
	}

	static getDateDigitalDisplay(jsDate, locale="fr-FR", timeZone="Europe/Paris") {
		return jsDate.toLocaleDateString(locale, {year: 'numeric', month: 'numeric', day: 'numeric', timeZone: timeZone});
	}
	static getDateTextDisplay(jsDate, locale="fr-FR", timeZone="Europe/Paris") {
		return jsDate.toLocaleDateString(locale, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: timeZone});
	}

	static getTimeDisplay(jsDate, locale="fr-FR", timeZone="Europe/Paris") {
		return jsDate.toLocaleTimeString(locale, {hour: 'numeric', minute: 'numeric', timeZone: timeZone});
	}
	static getTimeDigitalDisplay(jsDate, locale="fr-FR", timeZone="Europe/Paris") {
		return jsDate.toLocaleTimeString(locale, {hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone});
	}
	static getTimeDisplayWithNbDays(jsDate, jsPreviousDate, locale="fr-FR", timeZone="Europe/Paris") {
		let str = this.getTimeDisplay(jsDate, locale, timeZone);
		if (jsPreviousDate != 0 && jsPreviousDate != null) {
			let nbDaysDiff = this.getNbDayBetweenTwo(jsPreviousDate, jsDate, false);
			if (nbDaysDiff > 0) {
				str += ' (J+'+nbDaysDiff+')';
			}
		}
		return str;
	}

	static getDateTimeDigitalDisplay(jsDate, locale="fr-FR", timeZone="Europe/Paris") {
		return jsDate.toLocaleDateString(locale, {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: timeZone});
	}

	static getYear(jsDate) {
		return jsDate.getUTCFullYear();
	}
	static getMonth(jsDate) {
		return jsDate.getUTCMonth()+1;
	}
	static getMonthName(jsDate, locale="fr-FR", isShort=false) {
		return jsDate.toLocaleDateString(locale, {month: (isShort?'short':'long')});
	}
	static getDay(jsDate) {
		return jsDate.getUTCDate();
	}
	
	static getDayOfMonth(jsDate) {
		return jsDate.getUTCDate();
	}
	
	static getDayOfWeek(jsDate) {
		return jsDate.getUTCDay();
	}
	
	static getDayName(jsDate, locale="fr-FR", isShort=false) {
		return jsDate.toLocaleDateString(locale, {weekday: (isShort?'short':'long')});
	}

	static getNbDaysInMonth(year, month) {
		return new Date(year, month, 0).getDate();
	}

	static getMonthNameByMonth(month, locale="fr-FR", isShort=false) {
		let d = new Date();
		d.setDate(1);
		d.setMonth(month-1);
		return this.getMonthName(d, locale, isShort);
	}
	static getDayNameByDayOfWeek(dayOfWeek, locale="fr-FR", isShort=false) {
		let d = new Date();
		// d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
		d.setDate(d.getDate() + (dayOfWeek - d.getDay()) % 7);
		return this.getDayName(d, locale, isShort);
	}


	static getFirstDayOfWeek(date) {
		let firstDayOfWeek = new Date(date);
		firstDayOfWeek.setDate(date.getDate() - date.getDay() + 1); // First day is the day of the month - the day of the week
		return firstDayOfWeek;
	}

	static getLastDayOfWeek(date) {
		let lastDayOfWeek = this.getFirstDayOfWeek(date);
		lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6); // last day is the first day + 6
		return lastDayOfWeek;
	}

	static getFirstDayOfMonth(date) {
		return this.getFirstDayOfMonthAndYear(date.getFullYear(), date.getMonth()+1);
	}

	static getLastDayOfMonth(date) {
		return this.getLastDayOfMonthAndYear(date.getFullYear(), date.getMonth()+1);
	}

	static getFirstDayOfYear(date) {
		date.setDate(1);
		date.setMonth(0);
		return new Date(date);
	}

	static getLastDayOfYear(date) {
		date.setDate(31);
		date.setMonth(11);
		return new Date(date);
	}

	static getFirstDayOfWeekAndYear(year, week) {
		let simple = new Date(year, 0, 1 + (week - 1) * 7);
		let dow = simple.getDay();
		let ISOweekStart = simple;
		if (dow <= 4) {
			ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
		}
		else {
			ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
		}
		return ISOweekStart;
	}
	static getLastDayOfWeekAndYear(year, week) {
		let firstDayOfWeek = this.getFirstDayOfWeekAndYear(year, week);
		firstDayOfWeek.setDate(firstDayOfWeek.getDate()+6);
		return firstDayOfWeek;
	}

	static getFirstDayOfMonthAndYear(year, month) {
		return new Date(year, month-1, 1);
	}

	static getLastDayOfMonthAndYear(year, month) {
		return new Date(year, month, 0);
	}

	static isDateEqual(jsDate1, jsDate2) {
		return (jsDate1.getFullYear() == jsDate2.getFullYear() && jsDate1.getMonth() == jsDate2.getMonth() && jsDate1.getDate() == jsDate2.getDate());
	}

	static isDateInTheFuture(jsDate) {
		jsDate.setHours(0);
		jsDate.setMinutes(0);
		jsDate.setSeconds(0);
		let today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		return jsDate.getTime() > today.getTime();
	}

	static isDateTimeInTheFuture(jsDateTime) {
		let today = new Date();
		return jsDateTime > today;
	}

	static getNbDayBetweenTwo(jsDate1, jsDate2, asPeriod, timeZone="Europe/Paris") {
		//jsDate1.set
		if (jsDate1 == null || jsDate2 == null) {
			return 0;
		}

		let timestamp1 = jsDate1.getTime() / 1000;
		let timestamp2 = jsDate2.getTime() / 1000;

		if (!asPeriod) {
			let jsMidnightDate1 = new Date(jsDate1.toLocaleDateString('en-US', {timeZone: timeZone})+' 00:00:00');
			let jsMidnightDate2 = new Date(jsDate2.toLocaleDateString('en-US', {timeZone: timeZone})+' 00:00:00');
			timestamp1 = jsMidnightDate1.getTime() / 1000;
			timestamp2 = jsMidnightDate2.getTime() / 1000;
			//jsDate1.setHours(0, 0, 0);
			//jsDate2.setHours(0, 0, 0);
			//jsDate1.setUTCHours(0, 0, 0);
			//jsDate2.setUTCHours(0, 0, 0);
		}
		return parseInt(Math.round((timestamp2-timestamp1)/86400));
	}
}

class TimestampUnix {
	static parse(timestamp) {
		if (timestamp == null) {
			return null;
		}
		return new Date(parseInt(timestamp+'000'));
	}

	static getCurrent() {
		let today = new Date();
		return parseInt(today.getTime() / 1000);
	}

	static getDateDigitalDisplay(timestamp, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTime.getDateDigitalDisplay(this.parse(timestamp), locale, timeZone);
	}
	static getDateTextDisplay(timestamp, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTime.getDateTextDisplay(this.parse(timestamp), locale, timeZone);
	}

	static getTimeDisplay(timestamp, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTime.getTimeDisplay(this.parse(timestamp), locale, timeZone);
	}
	static getTimeDisplayWithNbDays(timestamp, previousTimestamp, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTime.getTimeDisplayWithNbDays(this.parse(timestamp), this.parse(previousTimestamp), locale, timeZone);
	}
	static getTimeDigitalDisplay(timestamp, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTime.getTimeDigitalDisplay(this.parse(timestamp), locale, timeZone);
	}

	static getYear(timestamp, timeZone="Europe/Paris") {
		return this.parse(timestamp).toLocaleDateString('fr-FR', {year: 'numeric', timeZone: timeZone});
	}
	static getMonth(timestamp, timeZone="Europe/Paris") {
		return this.parse(timestamp).toLocaleDateString('fr-FR', {month: 'numeric', timeZone: timeZone});
	}
	static getDayOfMonth(timestamp, timeZone="Europe/Paris") {
		return this.parse(timestamp).toLocaleDateString('fr-FR', {day: 'numeric', timeZone: timeZone});
	}

	static getHour(timestamp, timeZone="Europe/Paris") {
		return this.parse(timestamp).toLocaleTimeString('en-GB', {hour: 'numeric', timeZone: timeZone});
	}
	static getMinute(timestamp, timeZone="Europe/Paris") {
		return this.parse(timestamp).toLocaleTimeString('en-GB', {minute: 'numeric', timeZone: timeZone});
	}
	static getSecond(timestamp, timeZone="Europe/Paris") {
		return this.parse(timestamp).toLocaleTimeString('en-GB', {second: 'numeric', timeZone: timeZone});
	}

	static getSqlDateTime(timestamp, timeZone="Europe/Paris") {
		return this.getSqlDate(timestamp, timeZone)+' '+this.getSqlTime(timestamp, timeZone);
	}
	static getSqlDate(timestamp, timeZone="Europe/Paris") {
		return DateTime.getSqlDate(this.parse(timestamp), timeZone);
	}
	static getSqlTime(timestamp, timeZone="Europe/Paris") {
		return DateTime.getSqlTime(this.parse(timestamp), timeZone);
	}

	static isDateEqual(timestamp1, timestamp2) {
		return DateTime.isDateEqual(this.parse(timestamp1), this.parse(timestamp2));
	}

	static getNbDayBetweenTwo(timestamp1, timestamp2, asPeriod, timeZone="Europe/Paris") {
		return DateTime.getNbDayBetweenTwo(this.parse(timestamp1), this.parse(timestamp2), asPeriod, timeZone);
	}

	static isDateInTheFuture(timestamp) {
		return DateTime.isDateInTheFuture(this.parse(timestamp));
	}
	static isDateTimeInTheFuture(timestamp) {
		return DateTime.isDateTimeInTheFuture(this.parse(timestamp));
	}

}

class SqlDate {
	static parse(sqlDate) {
		if (sqlDate == null) {
			return null;
		}
		return new Date(sqlDate.substring(0, 4), sqlDate.substring(5, 7)-1, sqlDate.substring(8, 10), 0, 0, 0);
	}

	static getCurrentSqlDate() {
		return DateTime.getSqlDate(new Date());
	}

	static getDateDigitalDisplay(sqlDate, locale="fr-FR") {
		return SqlDateTime.getDateDigitalDisplay(sqlDate+" 00:00:00", locale);
	}
	static getDateTextDisplay(sqlDate, locale="fr-FR") {
		return SqlDateTime.getDateTextDisplay(sqlDate+" 00:00:00", locale);
	}

	static getYear(sqlDate) {
		return SqlDateTime.getYear(sqlDate+" 00:00:00");
	}
	static getMonth(sqlDate) {
		return SqlDateTime.getMonth(sqlDate+" 00:00:00");
	}
	static getMonthName(sqlDate, locale="fr-FR", isShort=false) {
		return SqlDateTime.getMonthName(sqlDate+" 00:00:00", locale, isShort);
	}
	static getDay(sqlDate) {
		return SqlDateTime.getDay(sqlDate+" 00:00:00");
	}

	static isDateInTheFuture(sqlDate) {
		return DateTime.isDateInTheFuture(SqlDateTime.parse(sqlDate + " 00:00:00"));
	}

}

class SqlTime {
	static parse(sqlTime) {
		if (sqlTime == null) {
			return null;
		}
		
		if ((sqlTime.match(/\:/g) || []).length == 1) {
			sqlTime += ':00';
		}
		let jsDate = new Date();
		let arrayTime = sqlTime.split(':');
		jsDate.setHours(arrayTime[0], arrayTime[1], arrayTime[2], 0);
		return jsDate;
	}

	static getCurrentSqlTime() {
		return DateTime.getSqlTime(new Date());
	}

	static getTimeDisplay(sqlTime, locale="fr-FR") {
		return SqlDateTime.getTimeDisplay('1970-01-01 '+sqlTime, locale);
	}
	static getTimeDigitalDisplay(sqlTime, locale="fr-FR") {
		return SqlDateTime.getTimeDigitalDisplay('1970-01-01 '+sqlTime, locale);
	}
	static getTimeDisplayWithNbDays(sqlTime, previousSqlTime) {
		return SqlDateTime.getTimeDisplayWithNbDays('1970-01-01 '+sqlTime, '1970-01-01 '+previousSqlTime, locale);
	}
}

class SqlDateTime {
	static getCurrentSqlDateTime() {
		return DateTime.getSqlDateTime(new Date());
	}

	static getSqlDate(sqlDateTime) {
		if (sqlDateTime == null) {
			return null;
		}
		return DateTime.getSqlDate(this.parse(sqlDateTime));
	}

	static getSqlTime(sqlDateTime) {
		if (sqlDateTime == null) {
			return null;
		}
		return DateTime.getSqlTime(this.parse(sqlDateTime));
	}

	static parse(sqlDateTime) {
		if (sqlDateTime == null) {
			return null;
		}
		return new Date(sqlDateTime.substring(0, 4), sqlDateTime.substring(5, 7)-1, sqlDateTime.substring(8, 10), sqlDateTime.substring(11, 13), sqlDateTime.substring(14, 16), sqlDateTime.substring(17, 19));
	}

	static getDateDigitalDisplay(sqlDateTime, locale="fr-FR") {
		return DateTime.getDateDigitalDisplay(this.parse(sqlDateTime), locale);
	}
	static getDateTextDisplay(sqlDateTime, locale="fr-FR") {
		return DateTime.getDateTextDisplay(this.parse(sqlDateTime), locale);
	}

	static getTimeDisplay(sqlDateTime, locale="fr-FR") {
		return DateTime.getTimeDisplay(this.parse(sqlDateTime), locale);
	}
	static getTimeDisplayWithNbDays(sqlDateTime, previousSqlDateTime) {
		return DateTime.getTimeDisplayWithNbDays(this.parse(sqlDateTime), this.parse(previousSqlDateTime), locale);
	}
	static getTimeDigitalDisplay(sqlDateTime, locale="fr-FR") {
		return DateTime.getTimeDigitalDisplay(this.parse(sqlDateTime), locale);
	}

	static getDateTimeDigitalDisplay(sqlDateTime, locale="fr-FR") {
		return DateTime.getDateTimeDigitalDisplay(this.parse(sqlDateTime), locale);
	}

	static getYear(sqlDateTime) {
		return DateTime.getYear(this.parse(sqlDateTime));
	}
	static getMonth(sqlDateTime) {
		return DateTime.getMonth(this.parse(sqlDateTime));
	}
	static getMonthName(sqlDateTime, locale="fr-FR", isShort=false) {
		return DateTime.getMonthName(this.parse(sqlDateTime), locale);
	}
	static getDay(sqlDateTime) {
		return DateTime.getDay(this.parse(sqlDateTime));
	}

	static getTimestamp(sqlDateTime) {
		return DateTime.getTimestamp(this.parse(sqlDateTime));
	}

	static isDateInTheFuture(sqlDateTime) {
		return DateTime.isDateInTheFuture(this.parse(sqlDateTime));
	}

	static isDateTimeInTheFuture(sqlDateTime) {
		return DateTime.isDateTimeInTheFuture(this.parse(sqlDateTime));
	}

	static getNbDayBetweenTwo(sqlDateTime1, sqlDateTime2, asPeriod) {
		return DateTime.getNbDayBetweenTwo(this.parse(sqlDateTime1), this.parse(sqlDateTime2), asPeriod);
	}

}


module.exports = { DateTime, TimestampUnix, SqlDate, SqlTime, SqlDateTime };
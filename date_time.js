
class DateTimeFormatter {
	static getDateDigitalFormatter(locale, timeZone) {
		this.dateDigitalFormatter = this.dateDigitalFormatter || {};
		if (typeof this.dateDigitalFormatter[timeZone+locale] == 'undefined') {
			this.dateDigitalFormatter[timeZone+locale] = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: timeZone });
		}

		return this.dateDigitalFormatter[timeZone+locale];
	}

	static getDateTextFormatter(locale, timeZone) {
		this.dateTextFormatter = this.dateTextFormatter || {};
		if (typeof this.dateTextFormatter[timeZone+locale] == 'undefined') {
			this.dateTextFormatter[timeZone+locale] = new Intl.DateTimeFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: timeZone });
		}

		return this.dateTextFormatter[timeZone+locale];
	}

	static getDateTimeFormatter(locale, timeZone) {
		this.dateTimeFormatter = this.dateTimeFormatter || {};
		if (typeof this.dateTimeFormatter[timeZone+locale] == 'undefined') {
			this.dateTimeFormatter[timeZone+locale] = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: timeZone });
		}

		return this.dateTimeFormatter[timeZone+locale];
	}

	static getDateSqlFormatter(timeZone) {
		this.dateSqlFormatter = this.dateSqlFormatter || {};
		if (typeof this.dateSqlFormatter[timeZone] == 'undefined') {
			this.dateSqlFormatter[timeZone] = new Intl.DateTimeFormat('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: timeZone });
		}

		return this.dateSqlFormatter[timeZone];
	}

	static getTimeSqlFormatter(timeZone) {
		this.timeSqlFormatter = this.timeSqlFormatter || {};
		if (typeof this.timeSqlFormatter[timeZone] == 'undefined') {
			//console.log('init getTimeSqlFormatter avec timezone', timeZone);
			this.timeSqlFormatter[timeZone] = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false, timeZone: timeZone }); //hour12: false = 24h format
		}

		return this.timeSqlFormatter[timeZone];
	}

	static getTimeFormatter(locale, timeZone) {
		this.timeFormatter = this.timeFormatter || {};
		if (typeof this.timeFormatter[timeZone+locale] == 'undefined') {
			this.timeFormatter[timeZone+locale] = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric', timeZone: timeZone });
		}

		return this.timeFormatter[timeZone+locale];
	}

	static getTimeDigitalFormatter(locale, timeZone) {
		this.timeDigitalFormatter = this.timeDigitalFormatter || {};
		if (typeof this.timeDigitalFormatter[timeZone+locale] == 'undefined') {
			this.timeDigitalFormatter[timeZone+locale] = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone });
		}

		return this.timeDigitalFormatter[timeZone+locale];
	}
} 

class DateTime {
	static getSqlDate(jsDate, timeZone="Europe/Paris") {
		return DateTimeFormatter.getDateSqlFormatter(timeZone).format(jsDate).replace(/\//g,'-').replace(',','');
		/*let pad = function(num) { return ('00'+num).slice(-2) };
		// return jsDate.getUTCFullYear() + '-' + pad(jsDate.getUTCMonth() + 1) + '-' + pad(jsDate.getUTCDate());
		//return jsDate.getFullYear() + '-' + pad(jsDate.getMonth() + 1) + '-' + pad(jsDate.getDate());
		return jsDate.toLocaleDateString('fr-FR', {year: 'numeric', timeZone: timeZone})+'-'+jsDate.toLocaleDateString('fr-FR', {month: '2-digit', timeZone: timeZone})+'-'+jsDate.toLocaleDateString('fr-FR', {day: '2-digit', timeZone: timeZone});
		*/
	}

	static getSqlTime(jsDate, timeZone="Europe/Paris") {
		return DateTimeFormatter.getTimeSqlFormatter(timeZone).format(jsDate);
		/*let pad = function(num) { return ('00'+num).slice(-2) };
		// return pad(jsDate.getUTCHours()) + ':' + pad(jsDate.getUTCMinutes()) + ':' + pad(jsDate.getUTCSeconds());
		//return pad(jsDate.getHours()) + ':' + pad(jsDate.getMinutes()) + ':' + pad(jsDate.getSeconds());
		return pad(jsDate.toLocaleTimeString('en-GB', {hour: 'numeric', timeZone: timeZone}))+':'+pad(jsDate.toLocaleTimeString('en-GB', {minute: 'numeric', timeZone: timeZone}))+':'+pad(jsDate.toLocaleTimeString('en-GB', {second: 'numeric', timeZone: timeZone}));
		*/
	}

	static getSqlDateTime(jsDate, timeZone="Europe/Paris") {
		return this.getSqlDate(jsDate, timeZone)+' '+this.getSqlTime(jsDate, timeZone);
	}

	static getDateForInputDate(jsDate, timeZone="Europe/Paris") {
		return this.getSqlDate(jsDate, timeZone);
	}
	static getTimeForInputTime(jsDate, timeZone="Europe/Paris", withSeconds=false) {
		return jsDate.toLocaleTimeString('en-GB', {hour: 'numeric', timeZone: timeZone, hour12: false}).padStart(2, '0')+':'+jsDate.toLocaleTimeString('en-GB', {minute: 'numeric', timeZone: timeZone, hour12: false}).padStart(2, '0')+(withSeconds?':'+jsDate.toLocaleTimeString('en-GB', {second: 'numeric', timeZone: timeZone, hour12: false}).padStart(2, '0'):'');
	}

	static getTimestamp(jsDate) {
		return jsDate.getTime()/1000;
	}

	static getDateDigitalDisplay(jsDate, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTimeFormatter.getDateDigitalFormatter(locale, timeZone).format(jsDate);
		//return jsDate.toLocaleDateString(locale, {year: 'numeric', month: 'numeric', day: 'numeric', timeZone: timeZone}); 
	}

	static getDateTextDisplay(jsDate, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTimeFormatter.getDateTextFormatter(locale, timeZone).format(jsDate);
		//return jsDate.toLocaleDateString(locale, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: timeZone});  
	}

	static getTimeDisplay(jsDate, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTimeFormatter.getTimeFormatter(locale, timeZone).format(jsDate);
		//return jsDate.toLocaleTimeString(locale, {hour: 'numeric', minute: 'numeric', timeZone: timeZone}); 
	}

	static getTimeDigitalDisplay(jsDate, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTimeFormatter.getTimeDigitalFormatter(locale, timeZone).format(jsDate);
		//return jsDate.toLocaleTimeString(locale, {hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone}); 
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
		return DateTimeFormatter.getDateTimeFormatter(locale, timeZone).format(jsDate);
		//return jsDate.toLocaleDateString(locale, {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: timeZone}); 
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

	static isDateInThePast(jsDate) {
		jsDate.setHours(0);
		jsDate.setMinutes(0);
		jsDate.setSeconds(0);
		jsDate.setMilliseconds(0);
		let today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		today.setMilliseconds(0);
		return jsDate.getTime() < today.getTime();
	}

	static isDateInTheFuture(jsDate) {
		jsDate.setHours(0);
		jsDate.setMinutes(0);
		jsDate.setSeconds(0);
		jsDate.setMilliseconds(0);
		let today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		today.setMilliseconds(0);
		return jsDate.getTime() > today.getTime();
	}

	static isDateTimeInThePast(jsDateTime) {
		let today = new Date();
		return jsDateTime < today;
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

	static getDateForInputDate(timestamp, timeZone="Europe/Paris") {
		return DateTime.getDateForInputDate(this.parse(timestamp), timeZone);
	}
	static getTimeForInputTime(timestamp, timeZone="Europe/Paris", withSeconds=false) {
		return DateTime.getTimeForInputTime(this.parse(timestamp), timeZone, withSeconds);
	}

	static isDateEqual(timestamp1, timestamp2) {
		return DateTime.isDateEqual(this.parse(timestamp1), this.parse(timestamp2));
	}

	static getNbDayBetweenTwo(timestamp1, timestamp2, asPeriod, timeZone="Europe/Paris") {
		return DateTime.getNbDayBetweenTwo(this.parse(timestamp1), this.parse(timestamp2), asPeriod, timeZone);
	}

	static isDateInThePast(timestamp) {
		return DateTime.isDateInThePast(this.parse(timestamp));
	}
	static isDateTimeInThePast(timestamp) {
		return DateTime.isDateTimeInThePast(this.parse(timestamp));
	}

	static isDateInTheFuture(timestamp) {
		return DateTime.isDateInTheFuture(this.parse(timestamp));
	}
	static isDateTimeInTheFuture(timestamp) {
		return DateTime.isDateTimeInTheFuture(this.parse(timestamp));
	}

}

/**
 * Les dates SQL fournies en paramètre doivent être en UTC.
 */
class SqlDate {
	static parse(sqlDate) {
		if (sqlDate == null) {
			return null;
		}
		return new Date(Date.UTC(sqlDate.substring(0, 4), sqlDate.substring(5, 7)-1, sqlDate.substring(8, 10), 0, 0, 0));
	}

	static getCurrentSqlDate() {
		return DateTime.getSqlDate(new Date());
	}

	static getDateDigitalDisplay(sqlDate, locale="fr-FR", timeZone="Europe/Paris") {
		return SqlDateTime.getDateDigitalDisplay(sqlDate+" 00:00:00", locale, timeZone);
	}
	static getDateTextDisplay(sqlDate, locale="fr-FR", timeZone="Europe/Paris") {
		return SqlDateTime.getDateTextDisplay(sqlDate+" 00:00:00", locale, timeZone);
	}

	static getDateForInputDate(sqlDate, timeZone="Europe/Paris") {
		return SqlDateTime.getDateForInputDate(sqlDate+" 00:00:00", timeZone);
	}

	static getTimestamp(sqlDate) {
		return SqlDateTime.getTimestamp(sqlDate+" 00:00:00");
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

/**
 * Les heures SQL fournies en paramètre doivent être en UTC.
 */
class SqlTime {
	static parse(sqlTime) {
		if (sqlTime == null) {
			return null;
		}
		
		if ((sqlTime.match(/\:/g) || []).length == 1) {
			sqlTime += ':00';
		}

		let arrayTime = sqlTime.split(':');
		return new Date(Date.UTC(1970, 0, 1, arrayTime[0], arrayTime[1], arrayTime[2]));

		/*let jsDate = new Date();
		jsDate.setUTCFullYear(1970, 0, 1);
		jsDate.setUTCHours(arrayTime[0], arrayTime[1], arrayTime[2], 0);
		return jsDate;*/
	}

	static getCurrentSqlTime() {
		return DateTime.getSqlTime(new Date());
	}

	static getTimeDisplay(sqlTime, locale="fr-FR", timeZone="Europe/Paris") {
		return SqlDateTime.getTimeDisplay('1970-01-01 '+sqlTime, locale, timeZone);
	}
	static getTimeDigitalDisplay(sqlTime, locale="fr-FR", timeZone="Europe/Paris") {
		return SqlDateTime.getTimeDigitalDisplay('1970-01-01 '+sqlTime, locale, timeZone);
	}
	static getTimeDisplayWithNbDays(sqlTime, previousSqlTime, locale="fr-FR", timeZone="Europe/Paris") {
		return SqlDateTime.getTimeDisplayWithNbDays('1970-01-01 '+sqlTime, '1970-01-01 '+previousSqlTime, locale, timeZone);
	}

	static getTimeForInputTime(sqlTime, timeZone="Europe/Paris", withSeconds=false) {
		return SqlDateTime.getTimeForInputTime('1970-01-01 '+sqlTime, timeZone, withSeconds);
	}

	static getTimestamp(sqlTime) {
		return SqlDateTime.getTimestamp('1970-01-01 '+sqlTime);
	}

}

/**
 * Les dates/heures SQL fournies en paramètre doivent être en UTC.
 */
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
		//return new Date(sqlDateTime.substring(0, 4), sqlDateTime.substring(5, 7)-1, sqlDateTime.substring(8, 10), sqlDateTime.substring(11, 13), sqlDateTime.substring(14, 16), sqlDateTime.substring(17, 19));
		return new Date(Date.UTC(sqlDateTime.substring(0, 4), sqlDateTime.substring(5, 7)-1, sqlDateTime.substring(8, 10), sqlDateTime.substring(11, 13), sqlDateTime.substring(14, 16), sqlDateTime.substring(17, 19)));
	}

	static getDateDigitalDisplay(sqlDateTime, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTime.getDateDigitalDisplay(this.parse(sqlDateTime), locale, timeZone);
	}
	static getDateTextDisplay(sqlDateTime, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTime.getDateTextDisplay(this.parse(sqlDateTime), locale, timeZone);
	}

	static getTimeDisplay(sqlDateTime, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTime.getTimeDisplay(this.parse(sqlDateTime), locale, timeZone);
	}
	static getTimeDisplayWithNbDays(sqlDateTime, previousSqlDateTime, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTime.getTimeDisplayWithNbDays(this.parse(sqlDateTime), this.parse(previousSqlDateTime), locale, timeZone);
	}
	static getTimeDigitalDisplay(sqlDateTime, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTime.getTimeDigitalDisplay(this.parse(sqlDateTime), locale, timeZone);
	}

	static getDateTimeDigitalDisplay(sqlDateTime, locale="fr-FR", timeZone="Europe/Paris") {
		return DateTime.getDateTimeDigitalDisplay(this.parse(sqlDateTime), locale, timeZone);
	}

	static getDateForInputDate(sqlDateTime, timeZone="Europe/Paris") {
		return DateTime.getDateForInputDate(this.parse(sqlDateTime), timeZone);
	}
	static getTimeForInputTime(sqlDateTime, timeZone="Europe/Paris", withSeconds=false) {
		return DateTime.getTimeForInputTime(this.parse(sqlDateTime), timeZone, withSeconds);
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
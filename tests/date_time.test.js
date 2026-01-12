const { DateTime, DatePeriod, TimestampUnix, SqlDate, SqlTime, SqlDateTime } = require('../date_time');

describe('DateTime', () => {
	describe('getSqlDate', () => {
		test('should format date to SQL format', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			const result = DateTime.getSqlDate(date, 'UTC');
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		});

		test('should use default timezone Europe/Paris', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			const result = DateTime.getSqlDate(date);
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		});
	});

	describe('getSqlTime', () => {
		test('should format time to SQL format', () => {
			const date = new Date('2024-01-15T10:30:45Z');
			const result = DateTime.getSqlTime(date, 'UTC');
			expect(result).toBe('10:30:45');
		});
	});

	describe('getSqlDateTime', () => {
		test('should format datetime to SQL format', () => {
			const date = new Date('2024-01-15T10:30:45Z');
			const result = DateTime.getSqlDateTime(date, 'UTC');
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
		});
	});

	describe('getTimestamp', () => {
		test('should return Unix timestamp', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			const result = DateTime.getTimestamp(date);
			expect(result).toBe(Math.trunc(date.getTime() / 1000));
		});
	});

	describe('getDateDigitalDisplay', () => {
		test('should format date in digital format', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			const result = DateTime.getDateDigitalDisplay(date, 'fr-FR', 'UTC');
			expect(result).toContain('15');
			expect(result).toContain('01');
			expect(result).toContain('2024');
		});
	});

	describe('getYear', () => {
		test('should return year', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			expect(DateTime.getYear(date)).toBe(2024);
		});
	});

	describe('getMonth', () => {
		test('should return month (1-based)', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			expect(DateTime.getMonth(date)).toBe(1);
		});

		test('should return 12 for December', () => {
			const date = new Date('2024-12-15T10:30:00Z');
			expect(DateTime.getMonth(date)).toBe(12);
		});
	});

	describe('getMonthName', () => {
		test('should return month name in French', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			expect(DateTime.getMonthName(date, 'fr-FR')).toBe('janvier');
		});

		test('should return short month name', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			const result = DateTime.getMonthName(date, 'fr-FR', true);
			expect(result).toContain('janv');
		});
	});

	describe('getDay', () => {
		test('should return day of month', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			expect(DateTime.getDay(date)).toBe(15);
		});
	});

	describe('getDayOfWeek', () => {
		test('should return day of week (0-6)', () => {
			const date = new Date('2024-01-15T10:30:00Z'); // Monday
			const result = DateTime.getDayOfWeek(date);
			expect(result).toBeGreaterThanOrEqual(0);
			expect(result).toBeLessThanOrEqual(6);
		});
	});

	describe('getDayName', () => {
		test('should return day name in French', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			const result = DateTime.getDayName(date, 'fr-FR');
			expect(typeof result).toBe('string');
			expect(result.length).toBeGreaterThan(0);
		});

		test('should return short day name', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			const result = DateTime.getDayName(date, 'fr-FR', true);
			expect(typeof result).toBe('string');
		});
	});

	describe('getNbDaysInMonth', () => {
		test('should return 31 for January', () => {
			expect(DateTime.getNbDaysInMonth(2024, 1)).toBe(31);
		});

		test('should return 29 for February in leap year', () => {
			expect(DateTime.getNbDaysInMonth(2024, 2)).toBe(29);
		});

		test('should return 28 for February in non-leap year', () => {
			expect(DateTime.getNbDaysInMonth(2023, 2)).toBe(28);
		});

		test('should return 30 for April', () => {
			expect(DateTime.getNbDaysInMonth(2024, 4)).toBe(30);
		});
	});

	describe('getFirstDayOfWeek', () => {
		test('should return Monday of the week', () => {
			const date = new Date(Date.UTC(2024, 0, 17)); // Wednesday
			const result = DateTime.getFirstDayOfWeek(date);
			expect(result.getUTCDay()).toBe(1); // Monday
		});
	});

	describe('getLastDayOfWeek', () => {
		test('should return Sunday of the week', () => {
			const date = new Date(Date.UTC(2024, 0, 17)); // Wednesday
			const result = DateTime.getLastDayOfWeek(date);
			expect(result.getUTCDay()).toBe(0); // Sunday
		});
	});

	describe('getFirstDayOfMonth', () => {
		test('should return first day of month', () => {
			const date = new Date(Date.UTC(2024, 0, 15));
			const result = DateTime.getFirstDayOfMonth(date);
			expect(result.getUTCDate()).toBe(1);
			expect(result.getUTCMonth()).toBe(0);
		});
	});

	describe('getLastDayOfMonth', () => {
		test('should return last day of January', () => {
			const date = new Date(Date.UTC(2024, 0, 15));
			const result = DateTime.getLastDayOfMonth(date);
			expect(result.getUTCDate()).toBe(31);
		});

		test('should return last day of February in leap year', () => {
			const date = new Date(Date.UTC(2024, 1, 15));
			const result = DateTime.getLastDayOfMonth(date);
			expect(result.getUTCDate()).toBe(29);
		});
	});

	describe('isDateEqual', () => {
		test('should return true for same dates', () => {
			const date1 = new Date(2024, 0, 15, 10, 30);
			const date2 = new Date(2024, 0, 15, 14, 45);
			expect(DateTime.isDateEqual(date1, date2)).toBe(true);
		});

		test('should return false for different dates', () => {
			const date1 = new Date(2024, 0, 15);
			const date2 = new Date(2024, 0, 16);
			expect(DateTime.isDateEqual(date1, date2)).toBe(false);
		});
	});

	describe('addDays', () => {
		test('should add days to date', () => {
			const date = new Date(Date.UTC(2024, 0, 15));
			const result = DateTime.addDays(date, 5);
			expect(result.getUTCDate()).toBe(20);
		});

		test('should subtract days with negative value', () => {
			const date = new Date(Date.UTC(2024, 0, 15));
			const result = DateTime.addDays(date, -5);
			expect(result.getUTCDate()).toBe(10);
		});
	});

	describe('addMonths', () => {
		test('should add months to date', () => {
			const date = new Date(2024, 0, 15);
			const result = DateTime.addMonths(date, 3);
			expect(result.getMonth()).toBe(3);
		});

		test('should handle month overflow', () => {
			const date = new Date(2024, 0, 31);
			const result = DateTime.addMonths(date, 1);
			// February doesn't have 31 days, should adjust
			expect(result.getMonth()).toBe(1);
		});
	});
});

describe('DatePeriod', () => {
	describe('isSameDay', () => {
		test('should return true for same day', () => {
			const date1 = new Date(2024, 0, 15, 10, 30);
			const date2 = new Date(2024, 0, 15, 14, 45);
			expect(DatePeriod.isSameDay(date1, date2)).toBe(true);
		});

		test('should return false for different days', () => {
			const date1 = new Date(2024, 0, 15);
			const date2 = new Date(2024, 0, 16);
			expect(DatePeriod.isSameDay(date1, date2)).toBe(false);
		});
	});

	describe('isHalfDay', () => {
		test('should return true for MORNING', () => {
			expect(DatePeriod.isHalfDay(DatePeriod.PART_OF_DAY_MORNING)).toBe(true);
		});

		test('should return true for AFTERNOON', () => {
			expect(DatePeriod.isHalfDay(DatePeriod.PART_OF_DAY_AFTERNOON)).toBe(true);
		});

		test('should return false for other values', () => {
			expect(DatePeriod.isHalfDay('FULL_DAY')).toBe(false);
		});
	});

	describe('getNbDayBetweenTwo', () => {
		test('should return 0 for same day', () => {
			const date1 = new Date(2024, 0, 15, 10, 30);
			const date2 = new Date(2024, 0, 15, 14, 45);
			expect(DatePeriod.getNbDayBetweenTwo(date1, date2, false, 'UTC')).toBe(0);
		});

		test('should return positive difference', () => {
			const date1 = new Date(Date.UTC(2024, 0, 15, 0, 0, 0));
			const date2 = new Date(Date.UTC(2024, 0, 20, 0, 0, 0));
			expect(DatePeriod.getNbDayBetweenTwo(date1, date2, true, 'UTC')).toBe(5);
		});

		test('should return negative difference when date2 is before date1', () => {
			const date1 = new Date(Date.UTC(2024, 0, 20, 0, 0, 0));
			const date2 = new Date(Date.UTC(2024, 0, 15, 0, 0, 0));
			expect(DatePeriod.getNbDayBetweenTwo(date1, date2, true, 'UTC')).toBe(-5);
		});

		test('should return 0 when one date is null', () => {
			const date = new Date(2024, 0, 15);
			expect(DatePeriod.getNbDayBetweenTwo(null, date)).toBe(0);
			expect(DatePeriod.getNbDayBetweenTwo(date, null)).toBe(0);
		});
	});
});

describe('TimestampUnix', () => {
	describe('parse', () => {
		test('should parse Unix timestamp to Date', () => {
			const timestamp = 1705315800; // 2024-01-15 10:30:00 UTC
			const result = TimestampUnix.parse(timestamp);
			expect(result instanceof Date).toBe(true);
		});

		test('should return null for null input', () => {
			expect(TimestampUnix.parse(null)).toBeNull();
		});
	});

	describe('getCurrent', () => {
		test('should return current Unix timestamp', () => {
			const result = TimestampUnix.getCurrent();
			const now = Math.trunc(Date.now() / 1000);
			expect(result).toBeCloseTo(now, 0);
		});
	});

	describe('getYear', () => {
		test('should return year from timestamp', () => {
			const timestamp = 1705315800;
			const result = TimestampUnix.getYear(timestamp, 'UTC');
			expect(result).toBe('2024');
		});
	});

	describe('getSqlDate', () => {
		test('should convert timestamp to SQL date', () => {
			const timestamp = 1705315800;
			const result = TimestampUnix.getSqlDate(timestamp, 'UTC');
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		});
	});

	describe('getSqlTime', () => {
		test('should convert timestamp to SQL time', () => {
			const timestamp = 1705315800;
			const result = TimestampUnix.getSqlTime(timestamp, 'UTC');
			expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
		});
	});

	describe('getSqlDateTime', () => {
		test('should convert timestamp to SQL datetime', () => {
			const timestamp = 1705315800;
			const result = TimestampUnix.getSqlDateTime(timestamp, 'UTC');
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
		});
	});
});

describe('SqlDate', () => {
	describe('parse', () => {
		test('should parse SQL date to Date object', () => {
			const sqlDate = '2024-01-15';
			const result = SqlDate.parse(sqlDate);
			expect(result instanceof Date).toBe(true);
			expect(result.getUTCFullYear()).toBe(2024);
			expect(result.getUTCMonth()).toBe(0);
			expect(result.getUTCDate()).toBe(15);
		});

		test('should return null for null input', () => {
			expect(SqlDate.parse(null)).toBeNull();
		});
	});

	describe('getCurrentSqlDate', () => {
		test('should return current date in SQL format', () => {
			const result = SqlDate.getCurrentSqlDate();
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		});
	});

	describe('getYear', () => {
		test('should return year from SQL date', () => {
			const sqlDate = '2024-01-15';
			expect(SqlDate.getYear(sqlDate)).toBe(2024);
		});
	});

	describe('getMonth', () => {
		test('should return month from SQL date', () => {
			const sqlDate = '2024-01-15';
			expect(SqlDate.getMonth(sqlDate)).toBe(1);
		});
	});

	describe('getDay', () => {
		test('should return day from SQL date', () => {
			const sqlDate = '2024-01-15';
			expect(SqlDate.getDay(sqlDate)).toBe(15);
		});
	});

	describe('getMonthName', () => {
		test('should return month name', () => {
			const sqlDate = '2024-01-15';
			expect(SqlDate.getMonthName(sqlDate, 'fr-FR')).toBe('janvier');
		});
	});

	describe('getNbDayBetweenTwo', () => {
		test('should calculate days between two SQL dates', () => {
			const sqlDate1 = '2024-01-15';
			const sqlDate2 = '2024-01-20';
			expect(SqlDate.getNbDayBetweenTwo(sqlDate1, sqlDate2, true)).toBe(5);
		});
	});
});

describe('SqlTime', () => {
	describe('parse', () => {
		test('should parse SQL time to Date object', () => {
			const sqlTime = '10:30:45';
			const result = SqlTime.parse(sqlTime);
			expect(result instanceof Date).toBe(true);
		});

		test('should handle time without seconds', () => {
			const sqlTime = '10:30';
			const result = SqlTime.parse(sqlTime);
			expect(result instanceof Date).toBe(true);
		});

		test('should return null for null input', () => {
			expect(SqlTime.parse(null)).toBeNull();
		});
	});

	describe('getCurrentSqlTime', () => {
		test('should return current time in SQL format', () => {
			const result = SqlTime.getCurrentSqlTime();
			expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
		});
	});
});

describe('SqlDateTime', () => {
	describe('parse', () => {
		test('should parse SQL datetime to Date object', () => {
			const sqlDateTime = '2024-01-15 10:30:45';
			const result = SqlDateTime.parse(sqlDateTime);
			expect(result instanceof Date).toBe(true);
			expect(result.getUTCFullYear()).toBe(2024);
			expect(result.getUTCMonth()).toBe(0);
			expect(result.getUTCDate()).toBe(15);
			expect(result.getUTCHours()).toBe(10);
			expect(result.getUTCMinutes()).toBe(30);
			expect(result.getUTCSeconds()).toBe(45);
		});

		test('should return null for null input', () => {
			expect(SqlDateTime.parse(null)).toBeNull();
		});
	});

	describe('getCurrentSqlDateTime', () => {
		test('should return current datetime in SQL format', () => {
			const result = SqlDateTime.getCurrentSqlDateTime();
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
		});
	});

	describe('getSqlDate', () => {
		test('should extract date from SQL datetime', () => {
			const sqlDateTime = '2024-01-15 10:30:45';
			const result = SqlDateTime.getSqlDate(sqlDateTime);
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		});

		test('should return null for null input', () => {
			expect(SqlDateTime.getSqlDate(null)).toBeNull();
		});
	});

	describe('getSqlTime', () => {
		test('should extract time from SQL datetime', () => {
			const sqlDateTime = '2024-01-15 10:30:45';
			const result = SqlDateTime.getSqlTime(sqlDateTime);
			expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
		});

		test('should return null for null input', () => {
			expect(SqlDateTime.getSqlTime(null)).toBeNull();
		});
	});

	describe('getYear', () => {
		test('should return year from SQL datetime', () => {
			const sqlDateTime = '2024-01-15 10:30:45';
			expect(SqlDateTime.getYear(sqlDateTime)).toBe(2024);
		});
	});

	describe('getMonth', () => {
		test('should return month from SQL datetime', () => {
			const sqlDateTime = '2024-01-15 10:30:45';
			expect(SqlDateTime.getMonth(sqlDateTime)).toBe(1);
		});
	});

	describe('getDay', () => {
		test('should return day from SQL datetime', () => {
			const sqlDateTime = '2024-01-15 10:30:45';
			expect(SqlDateTime.getDay(sqlDateTime)).toBe(15);
		});
	});

	describe('getTimestamp', () => {
		test('should convert SQL datetime to Unix timestamp', () => {
			const sqlDateTime = '2024-01-15 10:30:00';
			const result = SqlDateTime.getTimestamp(sqlDateTime);
			expect(typeof result).toBe('number');
			expect(result).toBeGreaterThan(0);
		});
	});

	describe('getNbDayBetweenTwo', () => {
		test('should calculate days between two SQL datetimes', () => {
			const sqlDateTime1 = '2024-01-15 10:30:00';
			const sqlDateTime2 = '2024-01-20 14:45:00';
			expect(SqlDateTime.getNbDayBetweenTwo(sqlDateTime1, sqlDateTime2, true)).toBe(5);
		});
	});
});
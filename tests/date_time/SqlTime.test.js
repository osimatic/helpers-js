const { SqlTime } = require('../../date_time');

describe('SqlTime', () => {
	describe('parse', () => {
		test('should parse SQL time with seconds to Date object', () => {
			const sqlTime = '10:30:45';
			const result = SqlTime.parse(sqlTime);
			expect(result instanceof Date).toBe(true);
			expect(result.getUTCHours()).toBe(10);
			expect(result.getUTCMinutes()).toBe(30);
			expect(result.getUTCSeconds()).toBe(45);
		});

		test('should parse SQL time without seconds', () => {
			const sqlTime = '10:30';
			const result = SqlTime.parse(sqlTime);
			expect(result instanceof Date).toBe(true);
			expect(result.getUTCHours()).toBe(10);
			expect(result.getUTCMinutes()).toBe(30);
			expect(result.getUTCSeconds()).toBe(0);
		});

		test('should return null for null input', () => {
			expect(SqlTime.parse(null)).toBeNull();
		});

		test('should parse midnight', () => {
			const sqlTime = '00:00:00';
			const result = SqlTime.parse(sqlTime);
			expect(result.getUTCHours()).toBe(0);
			expect(result.getUTCMinutes()).toBe(0);
			expect(result.getUTCSeconds()).toBe(0);
		});

		test('should parse noon', () => {
			const sqlTime = '12:00:00';
			const result = SqlTime.parse(sqlTime);
			expect(result.getUTCHours()).toBe(12);
		});

		test('should parse end of day', () => {
			const sqlTime = '23:59:59';
			const result = SqlTime.parse(sqlTime);
			expect(result.getUTCHours()).toBe(23);
			expect(result.getUTCMinutes()).toBe(59);
			expect(result.getUTCSeconds()).toBe(59);
		});
	});

	describe('getCurrentSqlTime', () => {
		test('should return current time in SQL format', () => {
			const result = SqlTime.getCurrentSqlTime();
			expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
		});

		test('should return time within valid range', () => {
			const result = SqlTime.getCurrentSqlTime();
			const parts = result.split(':');
			const hours = parseInt(parts[0]);
			const minutes = parseInt(parts[1]);
			const seconds = parseInt(parts[2]);

			expect(hours).toBeGreaterThanOrEqual(0);
			expect(hours).toBeLessThanOrEqual(23);
			expect(minutes).toBeGreaterThanOrEqual(0);
			expect(minutes).toBeLessThanOrEqual(59);
			expect(seconds).toBeGreaterThanOrEqual(0);
			expect(seconds).toBeLessThanOrEqual(59);
		});
	});

	describe('getTimeDisplay', () => {
		test('should format SQL time for display', () => {
			const sqlTime = '10:30:45';
			const result = SqlTime.getTimeDisplay(sqlTime, 'fr-FR', 'UTC');
			expect(result).toContain('10');
			expect(result).toContain('30');
		});

		test('should format midnight', () => {
			const sqlTime = '00:00:00';
			const result = SqlTime.getTimeDisplay(sqlTime, 'fr-FR', 'UTC');
			expect(result).toContain('00');
		});
	});

	describe('getTimeDigitalDisplay', () => {
		test('should format SQL time in digital format', () => {
			const sqlTime = '10:30:45';
			const result = SqlTime.getTimeDigitalDisplay(sqlTime, 'fr-FR', 'UTC');
			expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
		});

		test('should format time without seconds', () => {
			const sqlTime = '10:30';
			const result = SqlTime.getTimeDigitalDisplay(sqlTime, 'fr-FR', 'UTC');
			expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
		});
	});

	describe('getTimeDisplayWithNbDays', () => {
		test('should display time without days difference', () => {
			const sqlTime = '10:30:00';
			const result = SqlTime.getTimeDisplayWithNbDays(sqlTime, '10:30:00', 'fr-FR', 'UTC');
			expect(result).toContain('10');
			expect(result).toContain('30');
		});

		test('should not show days for same time', () => {
			const sqlTime = '10:30:00';
			const result = SqlTime.getTimeDisplayWithNbDays(sqlTime, '10:30:00', 'fr-FR', 'UTC');
			expect(result).not.toContain('J+');
		});
	});

	describe('getTimeForInputTime', () => {
		test('should return time for input field without seconds', () => {
			const sqlTime = '10:30:45';
			const result = SqlTime.getTimeForInputTime(sqlTime, 'UTC', false);
			expect(result).toMatch(/^\d{2}:\d{2}$/);
		});

		test('should return time for input field with seconds', () => {
			const sqlTime = '10:30:45';
			const result = SqlTime.getTimeForInputTime(sqlTime, 'UTC', true);
			expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
		});

		test('should handle time without seconds', () => {
			const sqlTime = '10:30';
			const result = SqlTime.getTimeForInputTime(sqlTime, 'UTC', true);
			expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
		});
	});

	describe('getTimestamp', () => {
		test('should convert SQL time to timestamp', () => {
			const sqlTime = '10:30:45';
			const result = SqlTime.getTimestamp(sqlTime);
			expect(typeof result).toBe('number');
		});

		test('should return consistent timestamp', () => {
			const sqlTime = '10:30:45';
			const result1 = SqlTime.getTimestamp(sqlTime);
			const result2 = SqlTime.getTimestamp(sqlTime);
			expect(result1).toBe(result2);
		});

		test('should handle midnight', () => {
			const sqlTime = '00:00:00';
			const result = SqlTime.getTimestamp(sqlTime);
			expect(typeof result).toBe('number');
		});

		test('should handle time without seconds', () => {
			const sqlTime = '10:30';
			const result = SqlTime.getTimestamp(sqlTime);
			expect(typeof result).toBe('number');
		});
	});
});

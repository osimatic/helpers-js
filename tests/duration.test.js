const { Duration } = require('../duration');
require('../number'); // Pour Math.getDecimals et Number.roundDecimal

describe('Duration', () => {
	describe('formatNbDays', () => {
		test('should format number of days with 2 decimal places', () => {
			expect(Duration.formatNbDays(5)).toBe('5,00');
			expect(Duration.formatNbDays(5.5)).toBe('5,50');
			expect(Duration.formatNbDays(5.123)).toBe('5,12');
			expect(Duration.formatNbDays(0)).toBe('0,00');
		});

		test('should handle negative numbers', () => {
			expect(Duration.formatNbDays(-3.75)).toBe('-3,75');
		});

		test('should work with en-US locale', () => {
			expect(Duration.formatNbDays(5.5, 'en-US')).toBe('5.50');
		});
	});

	describe('formatNbDaysIfPositive', () => {
		test('should return formatted number for positive values', () => {
			expect(Duration.formatNbDaysIfPositive(5.5)).toBe('5,50');
			expect(Duration.formatNbDaysIfPositive(0)).toBe('0,00');
		});

		test('should return "-" for negative values', () => {
			expect(Duration.formatNbDaysIfPositive(-3.75)).toBe('-');
		});
	});

	describe('formatNbDaysWithColor', () => {
		test('should return HTML with success class for positive values', () => {
			expect(Duration.formatNbDaysWithColor(5.5)).toBe('<span class="text-success">5,50</span>');
			expect(Duration.formatNbDaysWithColor(0)).toBe('<span class="text-success">0,00</span>');
		});

		test('should return HTML with danger class for negative values', () => {
			expect(Duration.formatNbDaysWithColor(-3.75)).toBe('<span class="text-danger">-3,75</span>');
		});
	});

	describe('convertInputTimeValueToDuration', () => {
		test('should convert HH:MM:SS to seconds', () => {
			expect(Duration.convertInputTimeValueToDuration('01:30:45')).toBe(5445); // 1*3600 + 30*60 + 45
			expect(Duration.convertInputTimeValueToDuration('02:00:00')).toBe(7200);
			expect(Duration.convertInputTimeValueToDuration('00:05:30')).toBe(330);
		});

		test('should convert HH:MM to seconds', () => {
			expect(Duration.convertInputTimeValueToDuration('01:30')).toBe(5400); // 1*3600 + 30*60
		});

		test('should handle edge cases', () => {
			expect(Duration.convertInputTimeValueToDuration('00:00:00')).toBe(0);
			expect(Duration.convertInputTimeValueToDuration('10:00:00')).toBe(36000);
		});

		test('should return 0 for null input', () => {
			expect(Duration.convertInputTimeValueToDuration(null)).toBe(0);
		});

		test('should return 0 for invalid format', () => {
			expect(Duration.convertInputTimeValueToDuration('invalid')).toBe(0);
			expect(Duration.convertInputTimeValueToDuration('123')).toBe(0);
		});

		test('should handle missing parts', () => {
			expect(Duration.convertInputTimeValueToDuration('01::')).toBe(3600);
		});
	});

	describe('convertToDurationAsInputTimeValue', () => {
		test('should convert seconds to HH:MM:SS format', () => {
			expect(Duration.convertToDurationAsInputTimeValue(5445)).toBe('01:30:45');
			expect(Duration.convertToDurationAsInputTimeValue(7200)).toBe('02:00:00');
			expect(Duration.convertToDurationAsInputTimeValue(330)).toBe('00:05:30');
		});

		test('should handle negative values as positive', () => {
			expect(Duration.convertToDurationAsInputTimeValue(-5445)).toBe('01:30:45');
		});

		test('should handle zero', () => {
			expect(Duration.convertToDurationAsInputTimeValue(0)).toBe('00:00:00');
		});
	});

	describe('convertToDurationInHourChronoDisplay', () => {
		test('should convert to chrono format (HH:MM.SS) by default', () => {
			expect(Duration.convertToDurationInHourChronoDisplay(5445)).toBe('01:30.45'); // 1h 30m 45s
			expect(Duration.convertToDurationInHourChronoDisplay(7200)).toBe('02:00.00');
			expect(Duration.convertToDurationInHourChronoDisplay(330)).toBe('00:05.30');
		});

		test('should convert to input_time format (HH:MM:SS)', () => {
			expect(Duration.convertToDurationInHourChronoDisplay(5445, 'input_time')).toBe('01:30:45');
			expect(Duration.convertToDurationInHourChronoDisplay(7200, 'input_time')).toBe('02:00:00');
		});

		test('should handle negative values', () => {
			expect(Duration.convertToDurationInHourChronoDisplay(-5445)).toBe('- 01:30.45');
			expect(Duration.convertToDurationInHourChronoDisplay(-7200, 'input_time')).toBe('- 02:00:00');
		});

		test('should handle zero', () => {
			expect(Duration.convertToDurationInHourChronoDisplay(0)).toBe('00:00.00');
		});

		test('should round decimals', () => {
			expect(Duration.convertToDurationInHourChronoDisplay(5445.7)).toBe('01:30.46');
		});

		test('should handle large durations', () => {
			expect(Duration.convertToDurationInHourChronoDisplay(86400)).toBe('24:00.00'); // 24 hours
		});
	});

	describe('convertToDurationInHourStringDisplay', () => {
		test('should convert with default options (all components)', () => {
			const result = Duration.convertToDurationInHourStringDisplay(5445); // 1h 30m 45s
			expect(result).toBe('1h 30min 45s');
		});

		test('should convert without seconds', () => {
			const result = Duration.convertToDurationInHourStringDisplay(5445, false);
			expect(result).toBe('1h 30min');
		});

		test('should convert without minutes', () => {
			const result = Duration.convertToDurationInHourStringDisplay(5445, true, false);
			expect(result).toBe('1h 45s');
		});

		test('should convert without minute label', () => {
			const result = Duration.convertToDurationInHourStringDisplay(5445, true, true, false);
			expect(result).toBe('1h 30 45s');
		});

		test('should convert with full labels', () => {
			const result = Duration.convertToDurationInHourStringDisplay(5445, true, true, true, true);
			expect(result).toBe('1 heure 30 minutes 45 secondes');
		});

		test('should handle plural labels correctly', () => {
			const result1 = Duration.convertToDurationInHourStringDisplay(7201, true, true, true, true); // 2h 0m 1s
			expect(result1).toBe('2 heures 0 minute 1 seconde'); // 0 est singulier en français
		});

		test('should hide hour if zero when requested', () => {
			const result = Duration.convertToDurationInHourStringDisplay(330, true, true, true, false, true); // 0h 5m 30s
			expect(result).toBe('05min 30s');
		});

		test('should show hour if zero when not hiding', () => {
			const result = Duration.convertToDurationInHourStringDisplay(330, true, true, true, false, false);
			expect(result).toBe('0h 05min 30s');
		});

		test('should pad minutes and seconds with zero', () => {
			const result = Duration.convertToDurationInHourStringDisplay(3605); // 1h 0m 5s
			expect(result).toBe('1h 00min 05s');
		});

		test('should handle zero duration', () => {
			const result = Duration.convertToDurationInHourStringDisplay(0);
			expect(result).toBe('0h 00min 00s');
		});
	});

	describe('roundNbSeconds', () => {
		test('should not round when precision is 0', () => {
			expect(Duration.roundNbSeconds(5445, 0)).toBe(5445);
			expect(Duration.roundNbSeconds(5478, 0)).toBe(5478);
		});

		test('should round to nearest 15 minutes', () => {
			expect(Duration.roundNbSeconds(3600 + 7*60, 15, 'close')).toBe(3600); // 1h 7m -> 1h 0m
			expect(Duration.roundNbSeconds(3600 + 8*60, 15, 'close')).toBe(3600 + 15*60); // 1h 8m -> 1h 15m
			expect(Duration.roundNbSeconds(3600 + 22*60, 15, 'close')).toBe(3600 + 15*60); // 1h 22m -> 1h 15m
			expect(Duration.roundNbSeconds(3600 + 23*60, 15, 'close')).toBe(3600 + 30*60); // 1h 23m -> 1h 30m
		});

		test('should round up when mode is "up"', () => {
			expect(Duration.roundNbSeconds(3600 + 1, 15, 'up')).toBe(3600 + 15*60); // 1h 0m 1s -> 1h 15m
			expect(Duration.roundNbSeconds(3600 + 7*60, 15, 'up')).toBe(3600 + 15*60); // 1h 7m -> 1h 15m
		});

		test('should round down when mode is not "up" and below half', () => {
			expect(Duration.roundNbSeconds(3600 + 7*60, 15, 'down')).toBe(3600); // 1h 7m -> 1h 0m
		});

		test('should handle rounding that crosses hour boundary', () => {
			expect(Duration.roundNbSeconds(3600 + 55*60, 15, 'up')).toBe(7200); // 1h 55m -> 2h 0m
		});

		test('should remove seconds when rounding', () => {
			const result = Duration.roundNbSeconds(3600 + 30*60 + 45, 15);
			expect(result).toBe(3600 + 30*60); // Seconds should be 0
		});

		test('should handle exact precision values', () => {
			expect(Duration.roundNbSeconds(3600 + 15*60, 15, 'close')).toBe(3600 + 15*60);
			expect(Duration.roundNbSeconds(3600 + 30*60, 15, 'close')).toBe(3600 + 30*60);
		});
	});

	describe('getNbDaysOfDurationInSeconds', () => {
		test('should return number of complete days', () => {
			expect(Duration.getNbDaysOfDurationInSeconds(86400)).toBe(1); // 1 day
			expect(Duration.getNbDaysOfDurationInSeconds(172800)).toBe(2); // 2 days
			expect(Duration.getNbDaysOfDurationInSeconds(259200)).toBe(3); // 3 days
		});

		test('should return 0 for less than a day', () => {
			expect(Duration.getNbDaysOfDurationInSeconds(3600)).toBe(0);
			expect(Duration.getNbDaysOfDurationInSeconds(86399)).toBe(0);
		});

		test('should floor the result', () => {
			expect(Duration.getNbDaysOfDurationInSeconds(86400 + 3600)).toBe(1); // 1 day 1 hour
		});
	});

	describe('getNbHoursOfDurationInSeconds', () => {
		test('should return total number of hours', () => {
			expect(Duration.getNbHoursOfDurationInSeconds(3600)).toBe(1);
			expect(Duration.getNbHoursOfDurationInSeconds(7200)).toBe(2);
			expect(Duration.getNbHoursOfDurationInSeconds(86400)).toBe(24); // 1 day
		});

		test('should return 0 for less than an hour', () => {
			expect(Duration.getNbHoursOfDurationInSeconds(3599)).toBe(0);
		});

		test('should floor the result', () => {
			expect(Duration.getNbHoursOfDurationInSeconds(3600 + 1800)).toBe(1); // 1h 30m
		});
	});

	describe('getNbMinutesOfDurationInSeconds', () => {
		test('should return total number of minutes', () => {
			expect(Duration.getNbMinutesOfDurationInSeconds(60)).toBe(1);
			expect(Duration.getNbMinutesOfDurationInSeconds(120)).toBe(2);
			expect(Duration.getNbMinutesOfDurationInSeconds(3600)).toBe(60);
		});

		test('should return 0 for less than a minute', () => {
			expect(Duration.getNbMinutesOfDurationInSeconds(59)).toBe(0);
		});

		test('should floor the result', () => {
			expect(Duration.getNbMinutesOfDurationInSeconds(90)).toBe(1); // 1m 30s
		});
	});

	describe('getNbHoursRemainingOfDurationInSeconds', () => {
		test('should return hours remaining after removing complete days', () => {
			expect(Duration.getNbHoursRemainingOfDurationInSeconds(86400 + 3600)).toBe(1); // 1 day 1 hour
			expect(Duration.getNbHoursRemainingOfDurationInSeconds(86400 + 7200)).toBe(2); // 1 day 2 hours
		});

		test('should return total hours if less than a day', () => {
			expect(Duration.getNbHoursRemainingOfDurationInSeconds(3600)).toBe(1);
			expect(Duration.getNbHoursRemainingOfDurationInSeconds(7200)).toBe(2);
		});

		test('should return 0 for exact days', () => {
			expect(Duration.getNbHoursRemainingOfDurationInSeconds(86400)).toBe(0);
		});
	});

	describe('getNbMinutesRemainingOfDurationInSeconds', () => {
		test('should return minutes remaining after removing complete hours', () => {
			expect(Duration.getNbMinutesRemainingOfDurationInSeconds(3600 + 60)).toBe(1); // 1h 1m
			expect(Duration.getNbMinutesRemainingOfDurationInSeconds(3600 + 120)).toBe(2); // 1h 2m
			expect(Duration.getNbMinutesRemainingOfDurationInSeconds(3600 + 1800)).toBe(30); // 1h 30m
		});

		test('should return total minutes if less than an hour', () => {
			expect(Duration.getNbMinutesRemainingOfDurationInSeconds(60)).toBe(1);
			expect(Duration.getNbMinutesRemainingOfDurationInSeconds(1800)).toBe(30);
		});

		test('should return 0 for exact hours', () => {
			expect(Duration.getNbMinutesRemainingOfDurationInSeconds(3600)).toBe(0);
		});
	});

	describe('getNbSecondsRemainingOfDurationInSeconds', () => {
		test('should return seconds remaining after removing complete minutes', () => {
			expect(Duration.getNbSecondsRemainingOfDurationInSeconds(61)).toBe(1);
			expect(Duration.getNbSecondsRemainingOfDurationInSeconds(90)).toBe(30);
			expect(Duration.getNbSecondsRemainingOfDurationInSeconds(3661)).toBe(1); // 1h 1m 1s
		});

		test('should return total seconds if less than a minute', () => {
			expect(Duration.getNbSecondsRemainingOfDurationInSeconds(30)).toBe(30);
			expect(Duration.getNbSecondsRemainingOfDurationInSeconds(59)).toBe(59);
		});

		test('should return 0 for exact minutes', () => {
			expect(Duration.getNbSecondsRemainingOfDurationInSeconds(60)).toBe(0);
			expect(Duration.getNbSecondsRemainingOfDurationInSeconds(3600)).toBe(0);
		});
	});

	describe('convertToDurationAsHundredthOfAnHour', () => {
		test('should convert seconds to hundredth of an hour', () => {
			expect(Duration.convertToDurationAsHundredthOfAnHour(3600)).toBe(1); // 1 hour
			expect(Duration.convertToDurationAsHundredthOfAnHour(7200)).toBe(2); // 2 hours
		});

		test('should convert minutes to hundredths', () => {
			expect(Duration.convertToDurationAsHundredthOfAnHour(3600 + 1800)).toBeCloseTo(1.5, 2); // 1h 30m = 1.5h
			expect(Duration.convertToDurationAsHundredthOfAnHour(3600 + 900)).toBeCloseTo(1.25, 2); // 1h 15m = 1.25h
		});

		test('should handle zero', () => {
			expect(Duration.convertToDurationAsHundredthOfAnHour(0)).toBe(0);
		});

		test('should round minutes to nearest hundredth', () => {
			expect(Duration.convertToDurationAsHundredthOfAnHour(3600 + 360)).toBeCloseTo(1.1, 1); // 1h 6m
		});
	});

	describe('getNbHoursOfHundredthOfAnHour', () => {
		test('should return integer hours from hundredth format', () => {
			expect(Duration.getNbHoursOfHundredthOfAnHour(1.5)).toBe(1);
			expect(Duration.getNbHoursOfHundredthOfAnHour(2.75)).toBe(2);
			expect(Duration.getNbHoursOfHundredthOfAnHour(10.99)).toBe(10);
		});

		test('should return 0 for less than an hour', () => {
			expect(Duration.getNbHoursOfHundredthOfAnHour(0.5)).toBe(0);
			expect(Duration.getNbHoursOfHundredthOfAnHour(0.99)).toBe(0);
		});

		test('should handle exact hours', () => {
			expect(Duration.getNbHoursOfHundredthOfAnHour(1)).toBe(1);
			expect(Duration.getNbHoursOfHundredthOfAnHour(5)).toBe(5);
		});
	});

	describe('getNbMinutesOfHundredthOfAnHour', () => {
		test('should return minutes from hundredth format', () => {
			expect(Duration.getNbMinutesOfHundredthOfAnHour(1.5)).toBe(30); // 0.5 * 60 = 30
			expect(Duration.getNbMinutesOfHundredthOfAnHour(1.25)).toBe(15); // 0.25 * 60 = 15
			expect(Duration.getNbMinutesOfHundredthOfAnHour(1.75)).toBe(45); // 0.75 * 60 = 45
		});

		test('should return 0 for exact hours', () => {
			expect(Duration.getNbMinutesOfHundredthOfAnHour(1)).toBe(0);
			expect(Duration.getNbMinutesOfHundredthOfAnHour(2)).toBe(0);
		});

		test('should handle less than an hour', () => {
			expect(Duration.getNbMinutesOfHundredthOfAnHour(0.5)).toBe(30); // 0.5 * 60 = 30
			expect(Duration.getNbMinutesOfHundredthOfAnHour(0.25)).toBe(15); // 0.25 * 60 = 15
			expect(Duration.getNbMinutesOfHundredthOfAnHour(0.75)).toBe(45); // 0.75 * 60 = 45
		});
	});
});
const { FormDate, InputPeriod } = require('../form_date');

describe('FormDate', () => {
	describe('getPeriodList', () => {
		let periodList;

		beforeEach(() => {
			periodList = FormDate.getPeriodList();
		});

		test('should return an object', () => {
			expect(typeof periodList).toBe('object');
			expect(periodList).not.toBeNull();
		});

		test('should contain other category', () => {
			expect(periodList).toHaveProperty('other');
			expect(periodList.other).toHaveProperty('label', 'Autre');
			expect(periodList.other).toHaveProperty('list');
			expect(periodList.other.list).toHaveProperty('perso', 'Personnalisé');
		});

		test('should contain 1d (one day) category', () => {
			expect(periodList).toHaveProperty('1d');
			expect(periodList['1d']).toHaveProperty('label', 'Un jour');
			expect(periodList['1d']).toHaveProperty('list');
			expect(periodList['1d'].list).toHaveProperty('ajd', "Aujourd’hui");
			expect(periodList['1d'].list).toHaveProperty('hier', 'Hier');
			expect(periodList['1d'].list).toHaveProperty('jourMoins2', 'Avant-hier');
		});

		test('should contain 1w (one week) category', () => {
			expect(periodList).toHaveProperty('1w');
			expect(periodList['1w']).toHaveProperty('label', 'Une semaine');
			expect(periodList['1w'].list).toHaveProperty('curr_week', 'Cette semaine');
			expect(periodList['1w'].list).toHaveProperty('last_week', 'La semaine dernière');
		});

		test('should contain 7d (7 days) category', () => {
			expect(periodList).toHaveProperty('7d');
			expect(periodList['7d']).toHaveProperty('label', '7 jours');
			expect(periodList['7d'].list).toHaveProperty('last_7_days', 'Les 7 derniers jours');
		});

		test('should contain 14d (14 days) category', () => {
			expect(periodList).toHaveProperty('14d');
			expect(periodList['14d']).toHaveProperty('label', '14 jours');
			expect(periodList['14d'].list).toHaveProperty('last_14_days', 'Les 14 derniers jours');
		});

		test('should contain 30d (30 days) category', () => {
			expect(periodList).toHaveProperty('30d');
			expect(periodList['30d']).toHaveProperty('label', '30 jours');
			expect(periodList['30d'].list).toHaveProperty('last_30_days', 'Les 30 derniers jours');
		});

		test('should contain 60d (60 days) category', () => {
			expect(periodList).toHaveProperty('60d');
			expect(periodList['60d']).toHaveProperty('label', '60 jours');
			expect(periodList['60d'].list).toHaveProperty('last_60_days', 'Les 60 derniers jours');
		});

		test('should contain 1m (one month) category', () => {
			expect(periodList).toHaveProperty('1m');
			expect(periodList['1m']).toHaveProperty('label', 'Un mois');
			expect(periodList['1m'].list).toHaveProperty('curr_month', 'Ce mois-ci');
			expect(periodList['1m'].list).toHaveProperty('last_month', 'Le mois dernier');
		});

		test('should contain 3m (3 months) category', () => {
			expect(periodList).toHaveProperty('3m');
			expect(periodList['3m']).toHaveProperty('label', '3 mois');
			expect(periodList['3m'].list).toHaveProperty('last_3_month', 'Les 3 derniers mois');
		});

		test('should contain 6m (6 months) category', () => {
			expect(periodList).toHaveProperty('6m');
			expect(periodList['6m']).toHaveProperty('label', '6 mois');
			expect(periodList['6m'].list).toHaveProperty('last_6_month', 'Les 6 derniers mois');
		});

		test('should contain 12m (12 months) category', () => {
			expect(periodList).toHaveProperty('12m');
			expect(periodList['12m']).toHaveProperty('label', '12 mois');
			expect(periodList['12m'].list).toHaveProperty('last_12_month', 'Les 12 derniers mois');
		});

		test('should contain 24m (24 months) category', () => {
			expect(periodList).toHaveProperty('24m');
			expect(periodList['24m']).toHaveProperty('label', '24 mois');
			expect(periodList['24m'].list).toHaveProperty('last_24_month', 'Les 24 derniers mois');
		});

		test('should contain 1y (one year) category', () => {
			expect(periodList).toHaveProperty('1y');
			expect(periodList['1y']).toHaveProperty('label', 'Une année');
			expect(periodList['1y'].list).toHaveProperty('curr_year', 'Cette année');
			expect(periodList['1y'].list).toHaveProperty('last_year', 'L’année dernière');
		});

		test('should have all expected day options in 1d category', () => {
			expect(periodList['1d'].list).toEqual({
				'ajd': 'Aujourd’hui',
				'hier': 'Hier',
				'jourMoins2': 'Avant-hier',
				'jourMoins3': 'J-3',
				'jourMoins7': 'J-7',
				'jourMoins8': 'J-8',
				'same_day_last_year': 'Même jour l’année dernière',
				'same_day_least_2_years': 'Même jour l’année A-2',
				'same_day_as_yesterday_last_year': 'Même jour qu’hier l’année dernière',
				'same_day_as_yesterday_least_2_years': 'Même jour qu’hier l’année A-2'
			});
		});

		test('should have all expected week options in 1w category', () => {
			expect(periodList['1w'].list).toEqual({
				'curr_week': 'Cette semaine',
				'last_week': 'La semaine dernière',
				'weekMoins2': 'Semaine S-2',
				'weekMoins3': 'Semaine S-3',
				'weekMoins4': 'Semaine S-4',
			});
		});

		test('should have all expected month options in 1m category', () => {
			expect(periodList['1m'].list).toEqual({
				'curr_month': 'Ce mois-ci',
				'last_month': 'Le mois dernier',
				'monthMoins2': 'Mois M-2',
				'monthMoins3': 'Mois M-3',
				'monthMoins4': 'Mois M-4',
				'monthMoins5': 'Mois M-5',
				'monthMoins6': 'Mois M-6',
				'same_month_last_year': 'Même mois l’année dernière',
				'same_month_least_2_years': 'Même mois l’année A-2',
			});
		});

		test('should have all expected year options in 1y category', () => {
			expect(periodList['1y'].list).toEqual({
				'curr_year': 'Cette année',
				'last_year': 'L’année dernière',
				'yearMoins2': 'Année A-2',
				'yearMoins3': 'Année A-3',
				'yearMoins4': 'Année A-4',
			});
		});

		test('should have same_day_last_year in 1d category', () => {
			expect(periodList['1d'].list).toHaveProperty('same_day_last_year', 'Même jour l’année dernière');
		});

		test('should have last_7_days_least_1_year in 7d category', () => {
			expect(periodList['7d'].list).toHaveProperty('last_7_days_least_1_year', 'Les mêmes 7 jours l’année dernière');
		});

		test('should return consistent structure on multiple calls', () => {
			const list1 = FormDate.getPeriodList();
			const list2 = FormDate.getPeriodList();

			expect(list1).toEqual(list2);
		});

		test('should have all 13 categories', () => {
			const keys = Object.keys(periodList);
			expect(keys).toHaveLength(13);
			expect(keys).toEqual([
				'other', '1d', '1w', '7d', '14d', '30d', '60d',
				'1m', '3m', '6m', '12m', '24m', '1y'
			]);
		});
	});

	describe('fillYearSelect with jQuery mock', () => {
		let mockSelect;

		beforeEach(() => {
			mockSelect = {
				append: jest.fn()
			};
		});

		test('should fill select with years from 5 years before to current year', () => {
			FormDate.fillYearSelect(mockSelect);

			const currentYear = new Date().getUTCFullYear();

			// Should be called 6 times (current year + 5 years before)
			expect(mockSelect.append).toHaveBeenCalledTimes(6);

			// Check first year
			expect(mockSelect.append).toHaveBeenCalledWith(
				`<option value="${currentYear - 5}">${currentYear - 5}</option>`
			);

			// Check last year (current year)
			expect(mockSelect.append).toHaveBeenCalledWith(
				`<option value="${currentYear}">${currentYear}</option>`
			);
		});

		test('should fill select with custom range', () => {
			FormDate.fillYearSelect(mockSelect, 3, 2);

			const currentYear = new Date().getUTCFullYear();

			// Should be called 6 times (3 before + current + 2 after)
			expect(mockSelect.append).toHaveBeenCalledTimes(6);

			// Check first year
			expect(mockSelect.append).toHaveBeenCalledWith(
				`<option value="${currentYear - 3}">${currentYear - 3}</option>`
			);

			// Check last year
			expect(mockSelect.append).toHaveBeenCalledWith(
				`<option value="${currentYear + 2}">${currentYear + 2}</option>`
			);
		});

		test('should handle only future years', () => {
			FormDate.fillYearSelect(mockSelect, 0, 5);

			const currentYear = new Date().getUTCFullYear();

			// Should be called 6 times (current + 5 after)
			expect(mockSelect.append).toHaveBeenCalledTimes(6);
		});

		test('should handle only one year (current)', () => {
			FormDate.fillYearSelect(mockSelect, 0, 0);

			const currentYear = new Date().getUTCFullYear();

			// Should be called 1 time (only current year)
			expect(mockSelect.append).toHaveBeenCalledTimes(1);
			expect(mockSelect.append).toHaveBeenCalledWith(
				`<option value="${currentYear}">${currentYear}</option>`
			);
		});
	});

	describe('fillMonthSelect with jQuery mock', () => {
		let mockSelect;

		beforeEach(() => {
			mockSelect = {
				append: jest.fn()
			};

			// Mock String.prototype.capitalize for this test
			if (!String.prototype.capitalize) {
				String.prototype.capitalize = function() {
					return this.charAt(0).toUpperCase() + this.slice(1);
				};
			}
		});

		test('should fill select with 12 months', () => {
			// Mock DateTime.getMonthNameByMonth
			global.DateTime = {
				getMonthNameByMonth: jest.fn((month, locale) => {
					const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
									'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
					return months[month - 1];
				})
			};

			FormDate.fillMonthSelect(mockSelect, 'fr');

			expect(mockSelect.append).toHaveBeenCalledTimes(12);
			expect(mockSelect.append).toHaveBeenCalledWith('<option value="1">Janvier</option>');
			expect(mockSelect.append).toHaveBeenCalledWith('<option value="12">Décembre</option>');

			delete global.DateTime;
		});
	});

	describe('fillDayOfWeekSelect with jQuery mock', () => {
		let mockSelect;

		beforeEach(() => {
			mockSelect = {
				append: jest.fn()
			};

			if (!String.prototype.capitalize) {
				String.prototype.capitalize = function() {
					return this.charAt(0).toUpperCase() + this.slice(1);
				};
			}
		});

		test('should fill select with 7 days of week', () => {
			// Mock DateTime.getDayNameByDayOfWeek
			global.DateTime = {
				getDayNameByDayOfWeek: jest.fn((dayOfWeek, locale) => {
					const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
					return days[dayOfWeek - 1];
				})
			};

			FormDate.fillDayOfWeekSelect(mockSelect, 'fr');

			expect(mockSelect.append).toHaveBeenCalledTimes(7);
			expect(mockSelect.append).toHaveBeenCalledWith('<option value="1">Lundi</option>');
			expect(mockSelect.append).toHaveBeenCalledWith('<option value="7">Dimanche</option>');

			delete global.DateTime;
		});
	});

	describe('getSelectedDate with jQuery mock', () => {
		test('should return date from select values', () => {
			const mockFormGroup = {
				find: jest.fn((selector) => {
					if (selector === 'select.day') {
						return { val: () => '15' };
					} else if (selector === 'select.month') {
						return { val: () => '6' };
					} else if (selector === 'select.year') {
						return { val: () => '2023' };
					}
				})
			};

			const result = FormDate.getSelectedDate(mockFormGroup);

			expect(result).toBeInstanceOf(Date);
			expect(result.getDate()).toBe(15);
			expect(result.getMonth()).toBe(5); // June (0-indexed)
			expect(result.getFullYear()).toBe(2023);
		});

		test('should return current date when selects return null', () => {
			const mockFormGroup = {
				find: jest.fn(() => {
					return { val: () => null };
				})
			};

			const result = FormDate.getSelectedDate(mockFormGroup);
			const now = new Date();

			expect(result).toBeInstanceOf(Date);
			// Just check it's approximately now (within 1 second)
			expect(Math.abs(result.getTime() - now.getTime())).toBeLessThan(1000);
		});
	});

	describe('setSelectedDate with jQuery mock', () => {
		test('should set values on selects', () => {
			const mockDaySelect = { val: jest.fn() };
			const mockMonthSelect = { val: jest.fn() };
			const mockYearSelect = { val: jest.fn() };

			const mockFormGroup = {
				find: jest.fn((selector) => {
					if (selector === 'select.day') return mockDaySelect;
					if (selector === 'select.month') return mockMonthSelect;
					if (selector === 'select.year') return mockYearSelect;
				})
			};

			FormDate.setSelectedDate(mockFormGroup, 25, 12, 2024);

			expect(mockDaySelect.val).toHaveBeenCalledWith(25);
			expect(mockMonthSelect.val).toHaveBeenCalledWith(12);
			expect(mockYearSelect.val).toHaveBeenCalledWith(2024);
		});

		test('should handle -1 values (for not setting day/month)', () => {
			const mockDaySelect = { val: jest.fn() };
			const mockMonthSelect = { val: jest.fn() };
			const mockYearSelect = { val: jest.fn() };

			const mockFormGroup = {
				find: jest.fn((selector) => {
					if (selector === 'select.day') return mockDaySelect;
					if (selector === 'select.month') return mockMonthSelect;
					if (selector === 'select.year') return mockYearSelect;
				})
			};

			FormDate.setSelectedDate(mockFormGroup, -1, -1, 2024);

			expect(mockDaySelect.val).toHaveBeenCalledWith(-1);
			expect(mockMonthSelect.val).toHaveBeenCalledWith(-1);
			expect(mockYearSelect.val).toHaveBeenCalledWith(2024);
		});
	});
});

describe('InputPeriod', () => {
	test('should be a class', () => {
		expect(typeof InputPeriod).toBe('function');
	});

	test('should have static methods', () => {
		expect(typeof InputPeriod.addLinks).toBe('function');
		expect(typeof InputPeriod.init).toBe('function');
		expect(typeof InputPeriod.selectToday).toBe('function');
		expect(typeof InputPeriod.selectPreviousDay).toBe('function');
		expect(typeof InputPeriod.selectFollowingDay).toBe('function');
		expect(typeof InputPeriod.selectCurrentWeek).toBe('function');
		expect(typeof InputPeriod.selectPreviousWeek).toBe('function');
		expect(typeof InputPeriod.selectFollowingWeek).toBe('function');
		expect(typeof InputPeriod.selectCurrentMonth).toBe('function');
		expect(typeof InputPeriod.selectPreviousMonth).toBe('function');
		expect(typeof InputPeriod.selectFollowingMonth).toBe('function');
		expect(typeof InputPeriod.selectCurrentYear).toBe('function');
		expect(typeof InputPeriod.selectPreviousYear).toBe('function');
		expect(typeof InputPeriod.selectFollowingYear).toBe('function');
		expect(typeof InputPeriod.selectPeriod).toBe('function');
	});
});
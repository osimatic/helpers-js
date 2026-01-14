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

	describe('setTodaySelected with jQuery mock', () => {
		test('should set today as selected date', () => {
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

			const today = new Date();
			FormDate.setTodaySelected(mockFormGroup);

			expect(mockDaySelect.val).toHaveBeenCalledWith(today.getDate());
			expect(mockMonthSelect.val).toHaveBeenCalledWith(today.getMonth() + 1);
			expect(mockYearSelect.val).toHaveBeenCalledWith(today.getFullYear());
		});
	});

	describe('setCurrentMonthSelected with jQuery mock', () => {
		test('should set current month and year', () => {
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

			const today = new Date();
			FormDate.setCurrentMonthSelected(mockFormGroup);

			expect(mockDaySelect.val).toHaveBeenCalledWith(-1);
			expect(mockMonthSelect.val).toHaveBeenCalledWith(today.getMonth() + 1);
			expect(mockYearSelect.val).toHaveBeenCalledWith(today.getFullYear());
		});
	});

	describe('setCurrentYearSelected with jQuery mock', () => {
		test('should set current year only', () => {
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

			const today = new Date();
			FormDate.setCurrentYearSelected(mockFormGroup);

			expect(mockDaySelect.val).toHaveBeenCalledWith(-1);
			expect(mockMonthSelect.val).toHaveBeenCalledWith(-1);
			expect(mockYearSelect.val).toHaveBeenCalledWith(today.getFullYear());
		});
	});

	describe('addNbDaysToToday with jQuery mock', () => {
		test('should add 5 days to today', () => {
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

			FormDate.addNbDaysToToday(mockFormGroup, 5);

			const expectedDate = new Date();
			expectedDate.setDate(expectedDate.getDate() + 5);

			expect(mockDaySelect.val).toHaveBeenCalledWith(expectedDate.getDate());
			expect(mockMonthSelect.val).toHaveBeenCalledWith(expectedDate.getMonth() + 1);
			expect(mockYearSelect.val).toHaveBeenCalledWith(expectedDate.getFullYear());
		});

		test('should subtract 3 days from today', () => {
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

			FormDate.addNbDaysToToday(mockFormGroup, -3);

			const expectedDate = new Date();
			expectedDate.setDate(expectedDate.getDate() - 3);

			expect(mockDaySelect.val).toHaveBeenCalledWith(expectedDate.getDate());
		});
	});

	describe('addNbMonthsToToday with jQuery mock', () => {
		test('should add 2 months to today', () => {
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

			FormDate.addNbMonthsToToday(mockFormGroup, 2);

			const expectedDate = new Date();
			expectedDate.setDate(1);
			expectedDate.setMonth(expectedDate.getMonth() - 2);

			expect(mockDaySelect.val).toHaveBeenCalledWith(-1);
			expect(mockMonthSelect.val).toHaveBeenCalledWith(expectedDate.getMonth() + 1);
		});
	});

	describe('addNbYearsToToday with jQuery mock', () => {
		test('should subtract 1 year from today', () => {
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

			FormDate.addNbYearsToToday(mockFormGroup, -1);

			const expectedDate = new Date();

			expect(mockDaySelect.val).toHaveBeenCalledWith(-1);
			expect(mockMonthSelect.val).toHaveBeenCalledWith(-1);
			expect(mockYearSelect.val).toHaveBeenCalledWith(expectedDate.getFullYear() + 1);
		});
	});

	describe('addNbDaysToSelectedDate with jQuery mock', () => {
		test('should add days to selected date', () => {
			const mockDaySelect = { val: jest.fn() };
			const mockMonthSelect = { val: jest.fn() };
			const mockYearSelect = { val: jest.fn() };

			const mockFormGroup = {
				find: jest.fn((selector) => {
					if (selector === 'select.day') {
						return { val: () => '15' };
					} else if (selector === 'select.month') {
						return { val: () => '6' };
					} else if (selector === 'select.year') {
						return { val: () => '2023' };
					}

					// For setting values
					if (selector === 'select.day') return mockDaySelect;
					if (selector === 'select.month') return mockMonthSelect;
					if (selector === 'select.year') return mockYearSelect;
				})
			};

			// Mock for reading
			let callCount = 0;
			mockFormGroup.find = jest.fn((selector) => {
				if (selector === 'select.day') {
					callCount++;
					return callCount <= 1 ? { val: () => '15' } : mockDaySelect;
				} else if (selector === 'select.month') {
					callCount++;
					return callCount <= 2 ? { val: () => '6' } : mockMonthSelect;
				} else if (selector === 'select.year') {
					callCount++;
					return callCount <= 3 ? { val: () => '2023' } : mockYearSelect;
				}
			});

			FormDate.addNbDaysToSelectedDate(mockFormGroup, 7);

			const expectedDate = new Date(2023, 5, 15);
			expectedDate.setDate(expectedDate.getDate() + 7);

			expect(mockDaySelect.val).toHaveBeenCalledWith(expectedDate.getDate());
		});

		test('should add days to today when fromSelectedDate is false', () => {
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

			FormDate.addNbDaysToSelectedDate(mockFormGroup, 5, false);

			const expectedDate = new Date();
			expectedDate.setDate(expectedDate.getDate() + 5);

			expect(mockDaySelect.val).toHaveBeenCalledWith(expectedDate.getDate());
		});
	});

	describe('addNbMonthsToSelectedDate with jQuery mock', () => {
		test('should subtract months from selected date', () => {
			const mockDaySelect = { val: jest.fn() };
			const mockMonthSelect = { val: jest.fn() };
			const mockYearSelect = { val: jest.fn() };

			let callCount = 0;
			const mockFormGroup = {
				find: jest.fn((selector) => {
					if (selector === 'select.day') {
						callCount++;
						return callCount <= 1 ? { val: () => '15' } : mockDaySelect;
					} else if (selector === 'select.month') {
						callCount++;
						return callCount <= 2 ? { val: () => '8' } : mockMonthSelect;
					} else if (selector === 'select.year') {
						callCount++;
						return callCount <= 3 ? { val: () => '2023' } : mockYearSelect;
					}
				})
			};

			FormDate.addNbMonthsToSelectedDate(mockFormGroup, -2);

			const expectedDate = new Date(2023, 7, 15);
			expectedDate.setDate(1);
			expectedDate.setMonth(expectedDate.getMonth() + 2);

			expect(mockDaySelect.val).toHaveBeenCalledWith(-1);
			expect(mockMonthSelect.val).toHaveBeenCalledWith(expectedDate.getMonth() + 1);
		});
	});

	describe('addNbYearsToSelectedDate with jQuery mock', () => {
		test('should subtract years from selected date', () => {
			const mockDaySelect = { val: jest.fn() };
			const mockMonthSelect = { val: jest.fn() };
			const mockYearSelect = { val: jest.fn() };

			let callCount = 0;
			const mockFormGroup = {
				find: jest.fn((selector) => {
					if (selector === 'select.day') {
						callCount++;
						return callCount <= 1 ? { val: () => '20' } : mockDaySelect;
					} else if (selector === 'select.month') {
						callCount++;
						return callCount <= 2 ? { val: () => '3' } : mockMonthSelect;
					} else if (selector === 'select.year') {
						callCount++;
						return callCount <= 3 ? { val: () => '2023' } : mockYearSelect;
					}
				})
			};

			FormDate.addNbYearsToSelectedDate(mockFormGroup, -2);

			expect(mockDaySelect.val).toHaveBeenCalledWith(-1);
			expect(mockMonthSelect.val).toHaveBeenCalledWith(-1);
			expect(mockYearSelect.val).toHaveBeenCalledWith(2025);
		});
	});

	describe('initForm with jQuery mock', () => {
		let mockForm;
		let capturedCallbacks;

		beforeEach(() => {
			capturedCallbacks = {};

			mockForm = {
				find: jest.fn((selector) => {
					// Return empty for most selectors initially
					const result = {
						length: 0,
						change: jest.fn(function(callback) {
							capturedCallbacks[selector + '_change'] = callback;
							return this;
						}),
						click: jest.fn(function(callback) {
							capturedCallbacks[selector + '_click'] = callback;
							return this;
						}),
						after: jest.fn(),
						append: jest.fn(),
						closest: jest.fn(() => mockForm),
						val: jest.fn(() => 'perso'),
						data: jest.fn(() => null),
						attr: jest.fn()
					};
					return result;
				})
			};

			// Mock String.prototype.capitalize
			if (!String.prototype.capitalize) {
				String.prototype.capitalize = function() {
					return this.charAt(0).toUpperCase() + this.slice(1);
				};
			}

			// Mock DateTime
			global.DateTime = {
				getMonthNameByMonth: jest.fn((month) => {
					const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
									'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
					return months[month - 1];
				}),
				getDayNameByDayOfWeek: jest.fn((day) => {
					const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
					return days[day - 1];
				})
			};
		});

		afterEach(() => {
			delete global.DateTime;
		});

		test('should initialize without errors when no selects present', () => {
			expect(() => {
				FormDate.initForm(mockForm);
			}).not.toThrow();
		});

		test('should fill period select when select.periode is present', () => {
			const mockPeriodSelect = {
				length: 1,
				append: jest.fn(),
				data: jest.fn(() => null),
				val: jest.fn(() => 'ajd'),
				change: jest.fn(function(callback) {
					capturedCallbacks['periode_change'] = callback;
					return this;
				}),
				closest: jest.fn(() => ({
					next: jest.fn(() => ({
						addClass: jest.fn(),
						removeClass: jest.fn()
					}))
				}))
			};

			mockForm.find = jest.fn((selector) => {
				if (selector === 'select.periode') {
					return mockPeriodSelect;
				}
				if (selector === 'select.periodeCompare') {
					return { length: 0 };
				}
				return { length: 0 };
			});

			FormDate.initForm(mockForm);

			// Should append optgroups for all period categories
			expect(mockPeriodSelect.append.mock.calls.length).toBeGreaterThan(0);
			expect(mockPeriodSelect.change).toHaveBeenCalled();
		});

		test('should add quick select links for day/month/year selects', () => {
			const mockYearSelect = {
				length: 1,
				after: jest.fn()
			};

			mockForm.find = jest.fn((selector) => {
				if (selector === 'select.day' || selector === 'select.month') {
					return { length: 1 };
				}
				if (selector === 'select.year') {
					return mockYearSelect;
				}
				return { length: 0 };
			});

			FormDate.initForm(mockForm);

			expect(mockYearSelect.after).toHaveBeenCalled();
			const addedHtml = mockYearSelect.after.mock.calls[0][0];
			expect(addedHtml).toContain('lien_form_today');
			expect(addedHtml).toContain('lien_form_yesterday');
			expect(addedHtml).toContain('lien_form_current_month');
		});

		test('should add click handlers for today link', () => {
			const mockLink = {
				length: 1,
				click: jest.fn(function(callback) {
					capturedCallbacks['today_click'] = callback;
					return this;
				})
			};

			mockForm.find = jest.fn((selector) => {
				if (selector === 'a.lien_form_today') {
					return mockLink;
				}
				return { length: 0 };
			});

			FormDate.initForm(mockForm);

			expect(mockLink.click).toHaveBeenCalled();
		});

		test('should handle period comparison select', () => {
			const mockPeriodSelect = {
				length: 1,
				append: jest.fn(),
				data: jest.fn(() => null),
				val: jest.fn(() => 'ajd'),
				change: jest.fn(),
				find: jest.fn(() => ({
					attr: jest.fn(),
					parent: jest.fn(() => ({
						children: jest.fn(() => ({
							attr: jest.fn()
						}))
					}))
				})),
				closest: jest.fn(() => ({
					next: jest.fn(() => ({
						addClass: jest.fn(),
						removeClass: jest.fn()
					}))
				}))
			};

			const mockCompareSelect = {
				length: 1,
				append: jest.fn(),
				data: jest.fn(() => null),
				val: jest.fn(() => 'hier'),
				change: jest.fn(),
				find: jest.fn(() => ({
					attr: jest.fn(),
					parent: jest.fn(() => ({
						children: jest.fn(() => ({
							attr: jest.fn()
						}))
					}))
				})),
				closest: jest.fn(() => ({
					next: jest.fn(() => ({
						addClass: jest.fn(),
						removeClass: jest.fn()
					}))
				}))
			};

			mockForm.find = jest.fn((selector) => {
				if (selector === 'select.periode') {
					return mockPeriodSelect;
				}
				if (selector === 'select.periodeCompare') {
					return mockCompareSelect;
				}
				return { length: 0 };
			});

			FormDate.initForm(mockForm);

			expect(mockPeriodSelect.append.mock.calls.length).toBeGreaterThan(0);
			expect(mockCompareSelect.append.mock.calls.length).toBeGreaterThan(0);
		});
	});
});

describe('InputPeriod', () => {
	let mockForm;
	let capturedCallbacks;

	beforeEach(() => {
		capturedCallbacks = {};

		// Mock DateTime
		global.DateTime = {
			getDateForInputDate: jest.fn((date) => {
				const year = date.getUTCFullYear();
				const month = String(date.getUTCMonth() + 1).padStart(2, '0');
				const day = String(date.getUTCDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			}),
			getFirstDayOfWeek: jest.fn((date) => {
				const d = new Date(date);
				const day = d.getUTCDay();
				const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
				return new Date(d.setUTCDate(diff));
			}),
			getLastDayOfWeek: jest.fn((date) => {
				const d = new Date(date);
				const day = d.getUTCDay();
				const diff = d.getUTCDate() + (day === 0 ? 0 : 7 - day);
				return new Date(d.setUTCDate(diff));
			}),
			getFirstDayOfMonth: jest.fn((date) => {
				return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
			}),
			getLastDayOfMonth: jest.fn((date) => {
				return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
			}),
			getFirstDayOfYear: jest.fn((date) => {
				return new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
			}),
			getLastDayOfYear: jest.fn((date) => {
				return new Date(Date.UTC(date.getUTCFullYear(), 11, 31));
			})
		};
	});

	afterEach(() => {
		delete global.DateTime;
		delete global.$;
	});

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

	describe('addLinks', () => {
		test('should add period selection links after input-group parent', () => {
			const mockParent = {
				hasClass: jest.fn(() => true),
				parent: jest.fn(function() {
					return {
						append: jest.fn()
					};
				})
			};

			const mockInput = {
				parent: jest.fn(() => mockParent)
			};

			mockForm = {
				find: jest.fn((selector) => {
					if (selector === 'input[type="date"][data-add_period_select_links]') {
						return mockInput;
					}
					return { length: 0 };
				})
			};

			// Mock $ for init call
			global.$ = jest.fn();

			InputPeriod.addLinks(mockForm);

			expect(mockParent.hasClass).toHaveBeenCalledWith('input-group');
			expect(mockParent.parent).toHaveBeenCalled();
		});

		test('should add links directly to parent when not input-group', () => {
			const mockParent = {
				hasClass: jest.fn(() => false),
				append: jest.fn()
			};

			const mockInput = {
				parent: jest.fn(() => mockParent)
			};

			mockForm = {
				find: jest.fn((selector) => {
					if (selector === 'input[type="date"][data-add_period_select_links]') {
						return mockInput;
					}
					return { length: 0 };
				})
			};

			// Mock $ for init call
			global.$ = jest.fn();

			InputPeriod.addLinks(mockForm);

			expect(mockParent.append).toHaveBeenCalled();
			const addedHtml = mockParent.append.mock.calls[0][0];
			expect(addedHtml).toContain('period_select_yesterday');
			expect(addedHtml).toContain('period_select_current_week');
			expect(addedHtml).toContain('period_select_last_month');
		});
	});

	describe('init', () => {
		test('should set up click handlers for all period links', () => {
			const mockLinks = {};
			const linkSelectors = [
				'a.period_select_today',
				'a.period_select_yesterday',
				'a.period_select_tomorrow',
				'a.period_select_current_week',
				'a.period_select_last_week',
				'a.period_select_current_month',
				'a.period_select_last_month',
				'a.period_select_current_year',
				'a.period_select_last_year'
			];

			linkSelectors.forEach(selector => {
				mockLinks[selector] = {
					length: 1,
					click: jest.fn(function(callback) {
						capturedCallbacks[selector] = callback;
						return this;
					})
				};
			});

			mockForm = {
				find: jest.fn((selector) => {
					return mockLinks[selector] || { length: 0 };
				})
			};

			InputPeriod.init(mockForm);

			linkSelectors.forEach(selector => {
				expect(mockLinks[selector].click).toHaveBeenCalled();
			});
		});

		test('should handle missing links gracefully', () => {
			mockForm = {
				find: jest.fn(() => ({ length: 0 }))
			};

			expect(() => {
				InputPeriod.init(mockForm);
			}).not.toThrow();
		});
	});

	describe('selectToday', () => {
		test('should select today date in period inputs', () => {
			const mockStartInput = { val: jest.fn() };
			const mockEndInput = { val: jest.fn() };

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn((selector) => {
							if (selector === 'input[type="date"]') {
								return {
									filter: jest.fn((filterSelector) => {
										if (filterSelector.includes('start')) {
											return mockStartInput;
										}
										return mockEndInput;
									}),
									length: 2
								};
							}
							return { length: 0 };
						})
					}))
				}))
			};

			// Need to set length on mockStartInput and mockEndInput
			mockStartInput.length = 1;
			mockEndInput.length = 1;

			InputPeriod.selectToday(mockLink);

			expect(mockStartInput.val).toHaveBeenCalled();
			expect(mockEndInput.val).toHaveBeenCalled();
			expect(global.DateTime.getDateForInputDate).toHaveBeenCalled();
		});
	});

	describe('selectPreviousDay', () => {
		test('should select yesterday', () => {
			const mockStartInput = { val: jest.fn(), length: 1 };
			const mockEndInput = { val: jest.fn(), length: 1 };

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn((selector) => {
							if (selector === 'input[type="date"]') {
								return {
									filter: jest.fn((filterSelector) => {
										if (filterSelector.includes('start')) {
											return mockStartInput;
										}
										return mockEndInput;
									}),
									length: 2
								};
							}
							return { length: 0 };
						})
					}))
				}))
			};

			InputPeriod.selectPreviousDay(mockLink, 1);

			expect(mockStartInput.val).toHaveBeenCalled();
			expect(mockEndInput.val).toHaveBeenCalled();
		});
	});

	describe('selectFollowingDay', () => {
		test('should select tomorrow', () => {
			const mockStartInput = { val: jest.fn(), length: 1 };
			const mockEndInput = { val: jest.fn(), length: 1 };

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn((selector) => {
							if (selector === 'input[type="date"]') {
								return {
									filter: jest.fn((filterSelector) => {
										if (filterSelector.includes('start')) {
											return mockStartInput;
										}
										return mockEndInput;
									}),
									length: 2
								};
							}
							return { length: 0 };
						})
					}))
				}))
			};

			InputPeriod.selectFollowingDay(mockLink, 1);

			expect(mockStartInput.val).toHaveBeenCalled();
			expect(mockEndInput.val).toHaveBeenCalled();
		});
	});

	describe('selectCurrentWeek', () => {
		test('should select current week period', () => {
			const mockStartInput = { val: jest.fn(), length: 1 };
			const mockEndInput = { val: jest.fn(), length: 1 };

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn((selector) => {
							if (selector === 'input[type="date"]') {
								return {
									filter: jest.fn((filterSelector) => {
										if (filterSelector.includes('start')) {
											return mockStartInput;
										}
										return mockEndInput;
									}),
									length: 2
								};
							}
							return { length: 0 };
						})
					}))
				}))
			};

			InputPeriod.selectCurrentWeek(mockLink);

			expect(global.DateTime.getFirstDayOfWeek).toHaveBeenCalled();
			expect(global.DateTime.getLastDayOfWeek).toHaveBeenCalled();
			expect(mockStartInput.val).toHaveBeenCalled();
			expect(mockEndInput.val).toHaveBeenCalled();
		});
	});

	describe('selectPreviousWeek', () => {
		test('should select previous week', () => {
			const mockStartInput = { val: jest.fn(), length: 1 };
			const mockEndInput = { val: jest.fn(), length: 1 };

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn((selector) => {
							if (selector === 'input[type="date"]') {
								return {
									filter: jest.fn((filterSelector) => {
										if (filterSelector.includes('start')) {
											return mockStartInput;
										}
										return mockEndInput;
									}),
									length: 2
								};
							}
							return { length: 0 };
						})
					}))
				}))
			};

			InputPeriod.selectPreviousWeek(mockLink, 1);

			expect(mockStartInput.val).toHaveBeenCalled();
			expect(mockEndInput.val).toHaveBeenCalled();
		});
	});

	describe('selectFollowingWeek', () => {
		test('should select following week', () => {
			const mockStartInput = { val: jest.fn(), length: 1 };
			const mockEndInput = { val: jest.fn(), length: 1 };

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn((selector) => {
							if (selector === 'input[type="date"]') {
								return {
									filter: jest.fn((filterSelector) => {
										if (filterSelector.includes('start')) {
											return mockStartInput;
										}
										return mockEndInput;
									}),
									length: 2
								};
							}
							return { length: 0 };
						})
					}))
				}))
			};

			InputPeriod.selectFollowingWeek(mockLink, 2);

			expect(mockStartInput.val).toHaveBeenCalled();
			expect(mockEndInput.val).toHaveBeenCalled();
		});
	});

	describe('selectCurrentMonth', () => {
		test('should select current month period', () => {
			const mockStartInput = { val: jest.fn(), length: 1 };
			const mockEndInput = { val: jest.fn(), length: 1 };

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn((selector) => {
							if (selector === 'input[type="date"]') {
								return {
									filter: jest.fn((filterSelector) => {
										if (filterSelector.includes('start')) {
											return mockStartInput;
										}
										return mockEndInput;
									}),
									length: 2
								};
							}
							return { length: 0 };
						})
					}))
				}))
			};

			InputPeriod.selectCurrentMonth(mockLink);

			expect(global.DateTime.getFirstDayOfMonth).toHaveBeenCalled();
			expect(global.DateTime.getLastDayOfMonth).toHaveBeenCalled();
			expect(mockStartInput.val).toHaveBeenCalled();
			expect(mockEndInput.val).toHaveBeenCalled();
		});
	});

	describe('selectPreviousMonth', () => {
		test('should select previous month', () => {
			const mockStartInput = { val: jest.fn(), length: 1 };
			const mockEndInput = { val: jest.fn(), length: 1 };

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn((selector) => {
							if (selector === 'input[type="date"]') {
								return {
									filter: jest.fn((filterSelector) => {
										if (filterSelector.includes('start')) {
											return mockStartInput;
										}
										return mockEndInput;
									}),
									length: 2
								};
							}
							return { length: 0 };
						})
					}))
				}))
			};

			InputPeriod.selectPreviousMonth(mockLink, 1);

			expect(mockStartInput.val).toHaveBeenCalled();
			expect(mockEndInput.val).toHaveBeenCalled();
		});
	});

	describe('selectFollowingMonth', () => {
		test('should select following month', () => {
			const mockStartInput = { val: jest.fn(), length: 1 };
			const mockEndInput = { val: jest.fn(), length: 1 };

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn((selector) => {
							if (selector === 'input[type="date"]') {
								return {
									filter: jest.fn((filterSelector) => {
										if (filterSelector.includes('start')) {
											return mockStartInput;
										}
										return mockEndInput;
									}),
									length: 2
								};
							}
							return { length: 0 };
						})
					}))
				}))
			};

			InputPeriod.selectFollowingMonth(mockLink, 3);

			expect(mockStartInput.val).toHaveBeenCalled();
			expect(mockEndInput.val).toHaveBeenCalled();
		});
	});

	describe('selectCurrentYear', () => {
		test('should select current year period', () => {
			const mockStartInput = { val: jest.fn(), length: 1 };
			const mockEndInput = { val: jest.fn(), length: 1 };

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn((selector) => {
							if (selector === 'input[type="date"]') {
								return {
									filter: jest.fn((filterSelector) => {
										if (filterSelector.includes('start')) {
											return mockStartInput;
										}
										return mockEndInput;
									}),
									length: 2
								};
							}
							return { length: 0 };
						})
					}))
				}))
			};

			InputPeriod.selectCurrentYear(mockLink);

			expect(global.DateTime.getFirstDayOfYear).toHaveBeenCalled();
			expect(global.DateTime.getLastDayOfYear).toHaveBeenCalled();
			expect(mockStartInput.val).toHaveBeenCalled();
			expect(mockEndInput.val).toHaveBeenCalled();
		});
	});

	describe('selectPreviousYear', () => {
		test('should select previous year', () => {
			const mockStartInput = { val: jest.fn(), length: 1 };
			const mockEndInput = { val: jest.fn(), length: 1 };

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn((selector) => {
							if (selector === 'input[type="date"]') {
								return {
									filter: jest.fn((filterSelector) => {
										if (filterSelector.includes('start')) {
											return mockStartInput;
										}
										return mockEndInput;
									}),
									length: 2
								};
							}
							return { length: 0 };
						})
					}))
				}))
			};

			InputPeriod.selectPreviousYear(mockLink, 1);

			expect(mockStartInput.val).toHaveBeenCalled();
			expect(mockEndInput.val).toHaveBeenCalled();
		});
	});

	describe('selectFollowingYear', () => {
		test('should select following year', () => {
			const mockStartInput = { val: jest.fn(), length: 1 };
			const mockEndInput = { val: jest.fn(), length: 1 };

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn((selector) => {
							if (selector === 'input[type="date"]') {
								return {
									filter: jest.fn((filterSelector) => {
										if (filterSelector.includes('start')) {
											return mockStartInput;
										}
										return mockEndInput;
									}),
									length: 2
								};
							}
							return { length: 0 };
						})
					}))
				}))
			};

			InputPeriod.selectFollowingYear(mockLink, 2);

			expect(mockStartInput.val).toHaveBeenCalled();
			expect(mockEndInput.val).toHaveBeenCalled();
		});
	});

	describe('selectPeriod', () => {
		test('should return early when no start input found', () => {
			const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn(() => ({
							filter: jest.fn(() => ({ length: 0 }))
						}))
					}))
				}))
			};

			InputPeriod.selectPeriod(mockLink, new Date(), new Date());

			expect(consoleLogSpy).toHaveBeenCalledWith('no period input found');
			consoleLogSpy.mockRestore();
		});

		test('should return early when no end input found', () => {
			const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn(() => ({
							filter: jest.fn((filterSelector) => {
								if (filterSelector.includes('start')) {
									return { length: 1, val: jest.fn() };
								}
								return { length: 0 };
							})
						}))
					}))
				}))
			};

			InputPeriod.selectPeriod(mockLink, new Date(), new Date());

			expect(consoleLogSpy).toHaveBeenCalledWith('no period input found');
			consoleLogSpy.mockRestore();
		});

		test('should set values on both inputs when found', () => {
			const mockStartInput = { val: jest.fn(), length: 1 };
			const mockEndInput = { val: jest.fn(), length: 1 };

			const mockLink = {
				parent: jest.fn(() => ({
					parent: jest.fn(() => ({
						find: jest.fn(() => ({
							filter: jest.fn((filterSelector) => {
								if (filterSelector.includes('start')) {
									return mockStartInput;
								}
								return mockEndInput;
							})
						}))
					}))
				}))
			};

			const startDate = new Date(2023, 5, 1);
			const endDate = new Date(2023, 5, 30);

			InputPeriod.selectPeriod(mockLink, startDate, endDate);

			expect(mockStartInput.val).toHaveBeenCalled();
			expect(mockEndInput.val).toHaveBeenCalled();
			expect(global.DateTime.getDateForInputDate).toHaveBeenCalledWith(startDate);
			expect(global.DateTime.getDateForInputDate).toHaveBeenCalledWith(endDate);
		});
	});
});
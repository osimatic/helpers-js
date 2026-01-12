const { Chartjs } = require('../chartjs');

describe('Chartjs', () => {
	describe('groupByPeriod', () => {
		test('should group data by day (default)', () => {
			const data = {
				'2024-01-15': { views: 10, clicks: 5 },
				'2024-01-16': { views: 20, clicks: 8 },
				'2024-01-17': { views: 15, clicks: 6 }
			};
			const metrics = ['views', 'clicks'];

			const result = Chartjs.groupByPeriod(data, 'day', metrics);

			expect(result).toHaveLength(3);
			expect(result[0]).toEqual({ label: '2024-01-15', views: 10, clicks: 5 });
			expect(result[1]).toEqual({ label: '2024-01-16', views: 20, clicks: 8 });
			expect(result[2]).toEqual({ label: '2024-01-17', views: 15, clicks: 6 });
		});

		test('should group data by month', () => {
			const data = {
				'2024-01-15': { views: 10, clicks: 5 },
				'2024-01-20': { views: 20, clicks: 8 },
				'2024-02-05': { views: 15, clicks: 6 }
			};
			const metrics = ['views', 'clicks'];

			const result = Chartjs.groupByPeriod(data, 'month', metrics);

			expect(result).toHaveLength(2);
			expect(result[0].label).toBe('2024-01');
			expect(result[0].views).toBe(15); // Average of 10 and 20
			expect(result[0].clicks).toBe(6.5); // Average of 5 and 8
			expect(result[1].label).toBe('2024-02');
			expect(result[1].views).toBe(15);
			expect(result[1].clicks).toBe(6);
		});

		test('should group data by week', () => {
			const data = {
				'2024-01-01': { views: 10 },
				'2024-01-02': { views: 20 },
				'2024-01-08': { views: 15 },
				'2024-01-09': { views: 25 }
			};
			const metrics = ['views'];

			const result = Chartjs.groupByPeriod(data, 'week', metrics);

			// Results should be grouped by weeks
			expect(result.length).toBeGreaterThan(0);
			// Check that labels contain week format (YYYY-SX)
			result.forEach(item => {
				expect(item.label).toMatch(/^\d{4}-S\d+$/);
			});
		});

		test('should handle single metric', () => {
			const data = {
				'2024-01-15': { views: 10 },
				'2024-01-16': { views: 20 }
			};
			const metrics = ['views'];

			const result = Chartjs.groupByPeriod(data, 'day', metrics);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({ label: '2024-01-15', views: 10 });
			expect(result[1]).toEqual({ label: '2024-01-16', views: 20 });
		});

		test('should handle multiple metrics', () => {
			const data = {
				'2024-01-15': { views: 10, clicks: 5, conversions: 2 }
			};
			const metrics = ['views', 'clicks', 'conversions'];

			const result = Chartjs.groupByPeriod(data, 'day', metrics);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				label: '2024-01-15',
				views: 10,
				clicks: 5,
				conversions: 2
			});
		});

		test('should handle empty data', () => {
			const data = {};
			const metrics = ['views'];

			const result = Chartjs.groupByPeriod(data, 'day', metrics);

			expect(result).toEqual([]);
		});

		test('should average values when grouping by month', () => {
			const data = {
				'2024-01-10': { score: 100 },
				'2024-01-15': { score: 200 },
				'2024-01-20': { score: 300 }
			};
			const metrics = ['score'];

			const result = Chartjs.groupByPeriod(data, 'month', metrics);

			expect(result).toHaveLength(1);
			expect(result[0].label).toBe('2024-01');
			expect(result[0].score).toBe(200); // Average of 100, 200, 300
		});

		test('should handle missing metric values', () => {
			const data = {
				'2024-01-15': { views: 10 },
				'2024-01-16': { views: 20, clicks: 5 }
			};
			const metrics = ['views', 'clicks'];

			const result = Chartjs.groupByPeriod(data, 'day', metrics);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({ label: '2024-01-15', views: 10, clicks: NaN });
			expect(result[1]).toEqual({ label: '2024-01-16', views: 20, clicks: 5 });
		});

		test('should handle dates across different years', () => {
			const data = {
				'2023-12-30': { count: 5 },
				'2024-01-02': { count: 10 }
			};
			const metrics = ['count'];

			const result = Chartjs.groupByPeriod(data, 'month', metrics);

			expect(result).toHaveLength(2);
			expect(result[0].label).toBe('2023-12');
			expect(result[1].label).toBe('2024-01');
		});
	});

	describe('getAutoGranularity', () => {
		test('should return day_of_month for data spanning 30 days or less', () => {
			const data = {
				'2024-01-01': {},
				'2024-01-15': {},
				'2024-01-30': {}
			};

			const result = Chartjs.getAutoGranularity(data);

			expect(result).toBe('day_of_month');
		});

		test('should return week for data spanning 31-90 days', () => {
			const data = {
				'2024-01-01': {},
				'2024-03-15': {} // 74 days
			};

			const result = Chartjs.getAutoGranularity(data);

			expect(result).toBe('week');
		});

		test('should return month for data spanning more than 90 days', () => {
			const data = {
				'2024-01-01': {},
				'2024-05-01': {} // 121 days
			};

			const result = Chartjs.getAutoGranularity(data);

			expect(result).toBe('month');
		});

		test('should return day_of_month for single day', () => {
			const data = {
				'2024-01-01': {}
			};

			const result = Chartjs.getAutoGranularity(data);

			expect(result).toBe('day_of_month');
		});

		test('should return day_of_month for 2 days', () => {
			const data = {
				'2024-01-01': {},
				'2024-01-02': {}
			};

			const result = Chartjs.getAutoGranularity(data);

			expect(result).toBe('day_of_month');
		});

		test('should return week for exactly 31 days', () => {
			const data = {
				'2024-01-01': {},
				'2024-02-01': {} // 31 days
			};

			const result = Chartjs.getAutoGranularity(data);

			expect(result).toBe('week');
		});

		test('should return week for exactly 90 days', () => {
			const data = {
				'2024-01-01': {},
				'2024-03-31': {} // 90 days
			};

			const result = Chartjs.getAutoGranularity(data);

			expect(result).toBe('week');
		});

		test('should return month for exactly 91 days', () => {
			const data = {
				'2024-01-01': {},
				'2024-04-01': {} // 91 days
			};

			const result = Chartjs.getAutoGranularity(data);

			expect(result).toBe('month');
		});

		test('should handle dates in random order', () => {
			const data = {
				'2024-03-01': {},
				'2024-01-01': {},
				'2024-02-01': {}
			};

			const result = Chartjs.getAutoGranularity(data);

			// Should calculate from first to last date (Jan 1 to Mar 1 = ~59 days)
			expect(result).toBe('week');
		});

		test('should return month for data spanning a full year', () => {
			const data = {
				'2024-01-01': {},
				'2024-12-31': {} // 365 days
			};

			const result = Chartjs.getAutoGranularity(data);

			expect(result).toBe('month');
		});
	});

	describe('Chartjs class structure', () => {
		test('should be a class', () => {
			expect(typeof Chartjs).toBe('function');
		});

		test('should have all expected static methods', () => {
			expect(typeof Chartjs.init).toBe('function');
			expect(typeof Chartjs.createStackedChart).toBe('function');
			expect(typeof Chartjs.createBarChart).toBe('function');
			expect(typeof Chartjs.createLineChart).toBe('function');
			expect(typeof Chartjs.createDoughnutChart).toBe('function');
			expect(typeof Chartjs.groupByPeriod).toBe('function');
			expect(typeof Chartjs.getPeriodLabels).toBe('function');
			expect(typeof Chartjs.getAutoGranularity).toBe('function');
		});
	});
});
/**
 * @jest-environment jsdom
 */
const { Chartjs } = require('../chartjs');

// ─── chart creation helpers ──────────────────────────────────────────────────

let mockChartInstance;

beforeEach(() => {
	mockChartInstance = { data: null, config: null };
	global.Chart = jest.fn((ctx, config) => {
		mockChartInstance.config = config;
		return mockChartInstance;
	});
	HTMLCanvasElement.prototype.getContext = jest.fn(() => ({}));
});

afterEach(() => {
	delete global.Chart;
	document.body.innerHTML = '';
	jest.restoreAllMocks();
});

function makeCanvas() {
	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	return canvas;
}

// ─── groupByPeriod ───────────────────────────────────────────────────────────

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
			expect(result[0].views).toBe(15);
			expect(result[0].clicks).toBe(6.5);
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

			expect(result.length).toBeGreaterThan(0);
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
			expect(result[0]).toEqual({ label: '2024-01-15', views: 10, clicks: 5, conversions: 2 });
		});

		test('should handle empty data', () => {
			const result = Chartjs.groupByPeriod({}, 'day', ['views']);
			expect(result).toEqual([]);
		});

		test('should average values when grouping by month', () => {
			const data = {
				'2024-01-10': { score: 100 },
				'2024-01-15': { score: 200 },
				'2024-01-20': { score: 300 }
			};
			const result = Chartjs.groupByPeriod(data, 'month', ['score']);

			expect(result).toHaveLength(1);
			expect(result[0].label).toBe('2024-01');
			expect(result[0].score).toBe(200);
		});

		test('should handle missing metric values', () => {
			const data = {
				'2024-01-15': { views: 10 },
				'2024-01-16': { views: 20, clicks: 5 }
			};
			const result = Chartjs.groupByPeriod(data, 'day', ['views', 'clicks']);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({ label: '2024-01-15', views: 10, clicks: NaN });
			expect(result[1]).toEqual({ label: '2024-01-16', views: 20, clicks: 5 });
		});

		test('should handle dates across different years', () => {
			const data = {
				'2023-12-30': { count: 5 },
				'2024-01-02': { count: 10 }
			};
			const result = Chartjs.groupByPeriod(data, 'month', ['count']);

			expect(result).toHaveLength(2);
			expect(result[0].label).toBe('2023-12');
			expect(result[1].label).toBe('2024-01');
		});
	});

	describe('getAutoGranularity', () => {
		test('should return day_of_month for data spanning 30 days or less', () => {
			expect(Chartjs.getAutoGranularity({ '2024-01-01': {}, '2024-01-15': {}, '2024-01-30': {} })).toBe('day_of_month');
		});

		test('should return week for data spanning 31-90 days', () => {
			expect(Chartjs.getAutoGranularity({ '2024-01-01': {}, '2024-03-15': {} })).toBe('week');
		});

		test('should return month for data spanning more than 90 days', () => {
			expect(Chartjs.getAutoGranularity({ '2024-01-01': {}, '2024-05-01': {} })).toBe('month');
		});

		test('should return day_of_month for single day', () => {
			expect(Chartjs.getAutoGranularity({ '2024-01-01': {} })).toBe('day_of_month');
		});

		test('should return week for exactly 31 days', () => {
			expect(Chartjs.getAutoGranularity({ '2024-01-01': {}, '2024-02-01': {} })).toBe('week');
		});

		test('should return week for exactly 90 days', () => {
			expect(Chartjs.getAutoGranularity({ '2024-01-01': {}, '2024-03-31': {} })).toBe('week');
		});

		test('should return month for exactly 91 days', () => {
			expect(Chartjs.getAutoGranularity({ '2024-01-01': {}, '2024-04-01': {} })).toBe('month');
		});

		test('should handle dates in random order', () => {
			expect(Chartjs.getAutoGranularity({ '2024-03-01': {}, '2024-01-01': {}, '2024-02-01': {} })).toBe('week');
		});

		test('should return month for data spanning a full year', () => {
			expect(Chartjs.getAutoGranularity({ '2024-01-01': {}, '2024-12-31': {} })).toBe('month');
		});
	});

	describe('chart creation', () => {
		const chartData = { labels: ['A', 'B'], datasets: [{ label: 'X', data: [1, 2] }] };

		test('createStackedChart clears div and calls Chart constructor', () => {
			const canvas = makeCanvas();
			canvas.innerHTML = '<span>old</span>';

			Chartjs.createStackedChart(canvas, chartData);

			expect(canvas.innerHTML).toBe('');
			expect(global.Chart).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ type: 'bar' }));
		});

		test('createStackedChart merges user options', () => {
			Chartjs.createStackedChart(makeCanvas(), chartData, null, { options: { responsive: false } });

			expect(mockChartInstance.config.options.responsive).toBe(false);
		});

		test('createBarChart clears div and calls Chart constructor', () => {
			const canvas = makeCanvas();
			canvas.innerHTML = '<span>old</span>';

			Chartjs.createBarChart(canvas, chartData);

			expect(canvas.innerHTML).toBe('');
			expect(global.Chart).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ type: 'bar' }));
		});

		test('createBarChart sets title when provided', () => {
			Chartjs.createBarChart(makeCanvas(), chartData, 'My Title');

			expect(mockChartInstance.config.options.plugins.title.display).toBe(true);
			expect(mockChartInstance.config.options.plugins.title.text).toBe('My Title');
		});

		test('createLineChart clears div and calls Chart constructor', () => {
			const canvas = makeCanvas();
			Chartjs.createLineChart(canvas, chartData);

			expect(canvas.innerHTML).toBe('');
			expect(global.Chart).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ type: 'line' }));
		});

		test('createDoughnutChart clears div and calls Chart constructor', () => {
			const canvas = makeCanvas();
			Chartjs.createDoughnutChart(canvas, { labels: ['A'], values: [1], colors: ['#f00'] });

			expect(canvas.innerHTML).toBe('');
			expect(global.Chart).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ type: 'doughnut' }));
		});

		test('createDoughnutChart uses chartData.values as dataset data', () => {
			Chartjs.createDoughnutChart(makeCanvas(), { labels: ['A', 'B'], values: [30, 70], colors: ['#f00', '#00f'] });

			expect(mockChartInstance.config.data.datasets[0].data).toEqual([30, 70]);
		});

		test('title not displayed when null', () => {
			Chartjs.createBarChart(makeCanvas(), chartData, null);

			expect(mockChartInstance.config.options.plugins.title.display).toBe(false);
		});

		describe('jQuery compatibility (toEl)', () => {
			test('createStackedChart accepts jQuery-like object', () => {
				const canvas = makeCanvas();
				const jq = { jquery: '3.6.0', 0: canvas, length: 1 };

				expect(() => Chartjs.createStackedChart(jq, chartData)).not.toThrow();
				expect(global.Chart).toHaveBeenCalled();
			});

			test('createBarChart accepts jQuery-like object', () => {
				const canvas = makeCanvas();
				const jq = { jquery: '3.6.0', 0: canvas, length: 1 };

				expect(() => Chartjs.createBarChart(jq, chartData)).not.toThrow();
				expect(global.Chart).toHaveBeenCalled();
			});
		});
	});

	describe('class structure', () => {
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
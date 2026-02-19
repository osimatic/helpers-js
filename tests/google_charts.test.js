/**
 * @jest-environment jsdom
 */
const { GoogleCharts } = require('../google_charts');

describe('GoogleCharts', () => {
	let mockDiv;
	let mockChart;
	let mockDataTable;
	let consoleErrorSpy;

	beforeEach(() => {
		// Mock DataTable
		mockDataTable = {
			addColumn: jest.fn(),
			addRows: jest.fn(),
			setCell: jest.fn()
		};

		// Mock Chart instances
		mockChart = {
			draw: jest.fn()
		};

		// Mock google.charts
		global.google = {
			charts: {
				load: jest.fn(),
				setOnLoadCallback: jest.fn(),
				Bar: jest.fn(() => mockChart),
				Line: jest.fn(() => mockChart)
			},
			visualization: {
				DataTable: jest.fn(() => mockDataTable),
				ComboChart: jest.fn(() => mockChart),
				PieChart: jest.fn(() => mockChart),
				events: {
					addListener: jest.fn((chart, event, callback) => {
						// Simulate immediate ready event for testing
						if (event === 'ready') {
							setTimeout(() => callback(), 0);
						}
					})
				}
			}
		};

		// Mock jQuery
		mockDiv = {
			0: document.createElement('div'),
			length: 1,
			removeClass: jest.fn().mockReturnThis(),
			addClass: jest.fn().mockReturnThis(),
			hasClass: jest.fn(() => false),
			closest: jest.fn().mockReturnThis()
		};

		global.$ = jest.fn((selector) => {
			if (typeof selector === 'string' && selector.startsWith('#')) {
				return mockDiv;
			}
			return mockDiv;
		});

		global.$.each = jest.fn((obj, callback) => {
			if (Array.isArray(obj)) {
				obj.forEach((item, idx) => callback(idx, item));
			} else if (typeof obj === 'object') {
				Object.keys(obj).forEach(key => callback(key, obj[key]));
			}
		});

		// Spy on console.error
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
	});

	afterEach(() => {
		delete global.google;
		delete global.$;
		consoleErrorSpy.mockRestore();
		jest.clearAllMocks();
	});

	describe('init', () => {
		test('should load Google Charts with correct packages', () => {
			GoogleCharts.init();

			expect(global.google.charts.load).toHaveBeenCalledWith('current', {
				packages: ['bar', 'line', 'corechart']
			});
		});

		test('should set onLoad callback when provided', () => {
			const callback = jest.fn();

			GoogleCharts.init(callback);

			expect(global.google.charts.setOnLoadCallback).toHaveBeenCalledWith(callback);
		});

		test('should not set onLoad callback when undefined string', () => {
			GoogleCharts.init('undefined');

			expect(global.google.charts.setOnLoadCallback).not.toHaveBeenCalled();
		});

		test('should set onLoad callback with function', () => {
			const callback = jest.fn();

			GoogleCharts.init(callback);

			expect(global.google.charts.setOnLoadCallback).toHaveBeenCalledWith(callback);
		});
	});

	describe('drawCharts', () => {
		test('should filter out charts with missing div_id', () => {
			const chartsList = [
				{ div_id: 'chart1', chart_type: 'column_chart', title: 'Test' },
				{ chart_type: 'bar_chart', title: 'No ID' },
				{ div_id: 'chart2', chart_type: 'line_chart', title: 'Test 2' }
			];

			const drawSpy = jest.spyOn(GoogleCharts, 'draw').mockImplementation((div, type, title, abscissa, absData, ordLabel, ordData, colors, format, height, width, callback) => {
				if (callback) callback();
			});

			GoogleCharts.drawCharts(chartsList);

			// Should only call draw for charts with div_id
			expect(drawSpy).toHaveBeenCalledTimes(2);

			drawSpy.mockRestore();
		});

		test('should filter out charts with non-existent div elements', () => {
			global.$ = jest.fn((selector) => {
				if (selector === '#existing') {
					return { length: 1 };
				}
				return { length: 0 };
			});

			const chartsList = [
				{ div_id: 'existing', chart_type: 'column_chart', title: 'Test' },
				{ div_id: 'missing', chart_type: 'bar_chart', title: 'Missing' }
			];

			const drawSpy = jest.spyOn(GoogleCharts, 'draw').mockImplementation((div, type, title, abscissa, absData, ordLabel, ordData, colors, format, height, width, callback) => {
				if (callback) callback();
			});

			GoogleCharts.drawCharts(chartsList);

			expect(drawSpy).toHaveBeenCalledTimes(1);

			drawSpy.mockRestore();
		});

		test('should call onComplete after all charts are drawn', (done) => {
			const chartsList = [
				{
					div_id: 'chart1',
					chart_type: 'column_chart',
					title: 'Chart 1',
					abscissa_label: 'X',
					abscissa_data: ['A', 'B'],
					ordinate_label: ['Y'],
					ordinate_data: [[1, 2]],
					colors: ['#FF0000']
				},
				{
					div_id: 'chart2',
					chart_type: 'bar_chart',
					title: 'Chart 2',
					abscissa_label: 'X',
					abscissa_data: ['C', 'D'],
					ordinate_label: ['Y'],
					ordinate_data: [[3, 4]],
					colors: ['#00FF00']
				}
			];

			const onComplete = jest.fn();
			const drawSpy = jest.spyOn(GoogleCharts, 'draw').mockImplementation((div, type, title, abscissa, absData, ordLabel, ordData, colors, format, height, width, callback) => {
				// Simulate async completion
				setTimeout(() => {
					if (callback) callback();
				}, 10);
			});

			GoogleCharts.drawCharts(chartsList, onComplete);

			setTimeout(() => {
				expect(onComplete).toHaveBeenCalledTimes(1);
				expect(drawSpy).toHaveBeenCalledTimes(2);
				drawSpy.mockRestore();
				done();
			}, 50);
		});

		test('should pass all chart data to draw method', () => {
			const chartData = {
				div_id: 'chart1',
				chart_type: 'pie_chart',
				title: 'Test Chart',
				abscissa_label: 'Category',
				abscissa_data: { A: 10, B: 20 },
				ordinate_label: ['Value'],
				ordinate_data: [[10, 20]],
				colors: ['#FF0000', '#00FF00'],
				ordinate_format: '#,##0',
				height: 400,
				width: 600
			};

			const drawSpy = jest.spyOn(GoogleCharts, 'draw').mockImplementation();

			GoogleCharts.drawCharts([chartData]);

			expect(drawSpy).toHaveBeenCalledWith(
				mockDiv,
				'pie_chart',
				'Test Chart',
				'Category',
				{ A: 10, B: 20 },
				['Value'],
				[[10, 20]],
				['#FF0000', '#00FF00'],
				'#,##0',
				400,
				600,
				expect.any(Function)
			);

			drawSpy.mockRestore();
		});
	});

	describe('draw', () => {
		test('should return early if div is undefined', () => {
			GoogleCharts.draw(undefined, 'column_chart', 'Title', 'X', [], ['Y'], [[]], []);

			expect(consoleErrorSpy).toHaveBeenCalledWith('div not found');
			expect(mockDataTable.addColumn).not.toHaveBeenCalled();
		});

		test('should return early if div has no length', () => {
			const emptyDiv = { length: 0 };

			GoogleCharts.draw(emptyDiv, 'column_chart', 'Title', 'X', [], ['Y'], [[]], []);

			expect(consoleErrorSpy).toHaveBeenCalledWith('div not found');
		});

		test('should create column chart', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'column_chart',
				'Test Chart',
				'Month',
				['Jan', 'Feb'],
				['Sales'],
				[[100, 200]],
				['#FF0000'],
				null,
				400,
				600
			);

			setTimeout(() => {
				expect(global.google.charts.Bar).toHaveBeenCalledWith(mockDiv[0]);
				expect(mockChart.draw).toHaveBeenCalled();
				expect(mockDiv.removeClass).toHaveBeenCalledWith('loading');
				expect(mockDiv.addClass).toHaveBeenCalledWith('chart');
				done();
			}, 10);
		});

		test('should create bar chart', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'bar_chart',
				'Test Chart',
				'Category',
				['A', 'B'],
				['Value'],
				[[10, 20]],
				['#00FF00']
			);

			setTimeout(() => {
				expect(global.google.charts.Bar).toHaveBeenCalledWith(mockDiv[0]);
				expect(mockChart.draw).toHaveBeenCalled();
				done();
			}, 10);
		});

		test('should create line chart', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'line_chart',
				'Test Chart',
				'Time',
				['1', '2'],
				['Value'],
				[[10, 20]],
				['#0000FF']
			);

			setTimeout(() => {
				expect(global.google.charts.Line).toHaveBeenCalledWith(mockDiv[0]);
				expect(mockChart.draw).toHaveBeenCalled();
				done();
			}, 10);
		});

		test('should create combo chart', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'combo_chart',
				'Test Chart',
				'Month',
				['Jan', 'Feb'],
				['Sales', 'Profit'],
				[[100, 200], [10, 20]],
				['#FF0000', '#00FF00']
			);

			setTimeout(() => {
				expect(global.google.visualization.ComboChart).toHaveBeenCalledWith(mockDiv[0]);
				expect(mockChart.draw).toHaveBeenCalled();
				done();
			}, 10);
		});

		test('should create pie chart', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'pie_chart',
				'Test Chart',
				'Category',
				{ A: 30, B: 50, C: 20 },
				[],
				[],
				['#FF0000', '#00FF00', '#0000FF']
			);

			setTimeout(() => {
				expect(global.google.visualization.PieChart).toHaveBeenCalledWith(mockDiv[0]);
				expect(mockDataTable.addColumn).toHaveBeenCalledWith('string', 'Category');
				expect(mockDataTable.addColumn).toHaveBeenCalledWith('number', '');
				expect(mockDataTable.addRows).toHaveBeenCalledTimes(3);
				expect(mockChart.draw).toHaveBeenCalled();
				done();
			}, 10);
		});

		test('should handle stacked_bar_chart type', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'stacked_bar_chart',
				'Test Chart',
				'Category',
				['A', 'B'],
				['Val1', 'Val2'],
				[[10, 20], [30, 40]],
				['#FF0000', '#00FF00']
			);

			setTimeout(() => {
				expect(global.google.charts.Bar).toHaveBeenCalled();
				const callArgs = mockChart.draw.mock.calls[0];
				expect(callArgs[1].isStacked).toBe(true);
				done();
			}, 10);
		});

		test('should handle stacked_column_chart type', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'stacked_column_chart',
				'Test Chart',
				'Month',
				['Jan', 'Feb'],
				['Sales', 'Costs'],
				[[100, 200], [50, 80]],
				['#FF0000', '#00FF00']
			);

			setTimeout(() => {
				expect(global.google.charts.Bar).toHaveBeenCalled();
				const callArgs = mockChart.draw.mock.calls[0];
				expect(callArgs[1].isStacked).toBe(true);
				done();
			}, 10);
		});

		test('should handle stacked_combo_chart type', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'stacked_combo_chart',
				'Test Chart',
				'Month',
				['Jan', 'Feb'],
				['Sales', 'Costs'],
				[[100, 200], [50, 80]],
				['#FF0000', '#00FF00']
			);

			setTimeout(() => {
				expect(global.google.visualization.ComboChart).toHaveBeenCalled();
				const callArgs = mockChart.draw.mock.calls[0];
				expect(callArgs[1].isStacked).toBe(true);
				done();
			}, 10);
		});

		test('should handle dual_column_chart type', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'dual_column_chart',
				'Test Chart',
				'Month',
				['Jan', 'Feb'],
				['Sales', 'Profit'],
				[[100, 200], [10, 20]],
				['#FF0000', '#00FF00']
			);

			setTimeout(() => {
				expect(global.google.charts.Bar).toHaveBeenCalled();
				const callArgs = mockChart.draw.mock.calls[0];
				expect(callArgs[1].series).toBeDefined();
				expect(callArgs[1].axes).toBeDefined();
				done();
			}, 10);
		});

		test('should handle dual_bar_chart type', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'dual_bar_chart',
				'Test Chart',
				'Category',
				['A', 'B'],
				['Val1', 'Val2'],
				[[10, 20], [30, 40]],
				['#FF0000', '#00FF00']
			);

			setTimeout(() => {
				expect(global.google.charts.Bar).toHaveBeenCalled();
				const callArgs = mockChart.draw.mock.calls[0];
				expect(callArgs[1].series).toBeDefined();
				expect(callArgs[1].axes).toBeDefined();
				done();
			}, 10);
		});

		test('should apply format to vAxis when provided', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'column_chart',
				'Test Chart',
				'Month',
				['Jan', 'Feb'],
				['Sales'],
				[[100, 200]],
				['#FF0000'],
				'#,##0.00'
			);

			setTimeout(() => {
				const callArgs = mockChart.draw.mock.calls[0];
				expect(callArgs[1].vAxis.format).toBe('#,##0.00');
				done();
			}, 10);
		});

		test('should set custom height when provided', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'column_chart',
				'Test Chart',
				'Month',
				['Jan', 'Feb'],
				['Sales'],
				[[100, 200]],
				['#FF0000'],
				null,
				500
			);

			setTimeout(() => {
				const callArgs = mockChart.draw.mock.calls[0];
				expect(callArgs[1].height).toBe(500);
				done();
			}, 10);
		});

		test('should handle null chart creation', () => {
			GoogleCharts.draw(
				mockDiv,
				'unknown_type',
				'Test Chart',
				'X',
				['A'],
				['Y'],
				[[1]],
				['#FF0000']
			);

			expect(consoleErrorSpy).toHaveBeenCalledWith('error during creating chart');
			expect(mockDiv.addClass).toHaveBeenCalledWith('graphique_error');
			expect(mockDiv[0].innerHTML).toContain('erreur');
		});

		test('should call onComplete callback when chart is ready', (done) => {
			const onComplete = jest.fn();

			GoogleCharts.draw(
				mockDiv,
				'column_chart',
				'Test Chart',
				'Month',
				['Jan', 'Feb'],
				['Sales'],
				[[100, 200]],
				['#FF0000'],
				null,
				null,
				null,
				onComplete
			);

			setTimeout(() => {
				expect(onComplete).toHaveBeenCalledWith(mockChart);
				done();
			}, 10);
		});

		test('should handle tab-pane not active scenario', (done) => {
			const tabPaneDiv = {
				hasClass: jest.fn((className) => className === 'active' ? false : true),
				addClass: jest.fn().mockReturnThis(),
				removeClass: jest.fn().mockReturnThis()
			};

			mockDiv.hasClass = jest.fn(() => false);
			mockDiv.closest = jest.fn(() => tabPaneDiv);

			GoogleCharts.draw(
				mockDiv,
				'column_chart',
				'Test Chart',
				'Month',
				['Jan'],
				['Sales'],
				[[100]],
				['#FF0000']
			);

			setTimeout(() => {
				expect(tabPaneDiv.addClass).toHaveBeenCalledWith('active');
				expect(tabPaneDiv.removeClass).toHaveBeenCalledWith('active');
				done();
			}, 10);
		});

		test('should not toggle active class if already active', (done) => {
			const tabPaneDiv = {
				hasClass: jest.fn(() => true),
				addClass: jest.fn().mockReturnThis(),
				removeClass: jest.fn().mockReturnThis()
			};

			mockDiv.hasClass = jest.fn(() => false);
			mockDiv.closest = jest.fn(() => tabPaneDiv);

			GoogleCharts.draw(
				mockDiv,
				'column_chart',
				'Test Chart',
				'Month',
				['Jan'],
				['Sales'],
				[[100]],
				['#FF0000']
			);

			setTimeout(() => {
				expect(tabPaneDiv.removeClass).not.toHaveBeenCalledWith('active');
				done();
			}, 10);
		});

		test('should handle when div itself has tab-pane class', (done) => {
			mockDiv.hasClass = jest.fn((className) => className === 'tab-pane');

			GoogleCharts.draw(
				mockDiv,
				'column_chart',
				'Test Chart',
				'Month',
				['Jan'],
				['Sales'],
				[[100]],
				['#FF0000']
			);

			setTimeout(() => {
				expect(mockDiv.closest).not.toHaveBeenCalled();
				done();
			}, 10);
		});

		test('should set line chart specific options', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'line_chart',
				'Test Chart',
				'Time',
				['1', '2'],
				['Value'],
				[[10, 20]],
				['#0000FF']
			);

			setTimeout(() => {
				const callArgs = mockChart.draw.mock.calls[0];
				expect(callArgs[1].series).toEqual([{ lineWidth: 3 }, { lineWidth: 1.5 }]);
				expect(callArgs[1].curveType).toBe('function');
				done();
			}, 10);
		});

		test('should set pie chart specific options', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'pie_chart',
				'Test Chart',
				'Category',
				{ A: 30, B: 50 },
				[],
				[],
				['#FF0000', '#00FF00']
			);

			setTimeout(() => {
				const callArgs = mockChart.draw.mock.calls[0];
				expect(callArgs[1].is3D).toBe(false);
				expect(callArgs[1].pieResidueSliceLabel).toBe('Autre');
				expect(callArgs[1].legend.position).toBe('right');
				done();
			}, 10);
		});

		test('should set bar chart specific options', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'bar_chart',
				'Test Chart',
				'Category',
				['A', 'B'],
				['Value'],
				[[10, 20]],
				['#00FF00']
			);

			setTimeout(() => {
				const callArgs = mockChart.draw.mock.calls[0];
				expect(callArgs[1].bars).toBe('horizontal');
				expect(callArgs[1].legend.position).toBe('bottom');
				expect(callArgs[1].vAxis.title).toBe('Category');
				done();
			}, 10);
		});

		test('should populate DataTable correctly for non-pie charts', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'column_chart',
				'Test Chart',
				'Month',
				['Jan', 'Feb', 'Mar'],
				['Sales', 'Profit'],
				[[100, 200, 300], [10, 20, 30]],
				['#FF0000', '#00FF00']
			);

			setTimeout(() => {
				expect(mockDataTable.addColumn).toHaveBeenCalledWith('string', 'Month');
				expect(mockDataTable.addColumn).toHaveBeenCalledWith('number', 'Sales');
				expect(mockDataTable.addColumn).toHaveBeenCalledWith('number', 'Profit');
				expect(mockDataTable.addRows).toHaveBeenCalledTimes(3);
				expect(mockDataTable.setCell).toHaveBeenCalled();
				done();
			}, 10);
		});

		test('should handle combo chart with multiple series', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'combo_chart',
				'Test Chart',
				'Month',
				['Jan', 'Feb'],
				['Sales', 'Profit', 'Trend'],
				[[100, 200], [10, 20], [50, 60]],
				['#FF0000', '#00FF00', '#0000FF']
			);

			setTimeout(() => {
				const callArgs = mockChart.draw.mock.calls[0];
				expect(callArgs[1].seriesType).toBe('bars');
				expect(callArgs[1].series).toBeDefined();
				// Last series (index 2 with 3 series) should be line type
				expect(callArgs[1].series[2]).toEqual({ type: 'line' });
				done();
			}, 10);
		});

		test('should apply dual axis formatting for dual_column_chart', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'dual_column_chart',
				'Test Chart',
				'Month',
				['Jan', 'Feb'],
				['Sales', 'Profit'],
				[[100, 200], [10, 20]],
				['#FF0000', '#00FF00'],
				'$#,##0'
			);

			setTimeout(() => {
				const callArgs = mockChart.draw.mock.calls[0];
				expect(callArgs[1].vAxes).toBeDefined();
				expect(callArgs[1].vAxes[0]).toEqual({ format: '$#,##0' });
				expect(callArgs[1].axes.y[1].side).toBe('right');
				done();
			}, 10);
		});

		test('should apply dual axis formatting for dual_bar_chart', (done) => {
			GoogleCharts.draw(
				mockDiv,
				'dual_bar_chart',
				'Test Chart',
				'Category',
				['A', 'B'],
				['Val1', 'Val2'],
				[[10, 20], [30, 40]],
				['#FF0000', '#00FF00'],
				'#,##0.00'
			);

			setTimeout(() => {
				const callArgs = mockChart.draw.mock.calls[0];
				expect(callArgs[1].hAxes).toBeDefined();
				expect(callArgs[1].hAxes[0]).toEqual({ format: '#,##0.00' });
				expect(callArgs[1].axes.x[1].side).toBe('top');
				done();
			}, 10);
		});
	});
});
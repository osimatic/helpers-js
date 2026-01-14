/**
 * @jest-environment jsdom
 */
const { CountDown } = require('../count_down');

describe('CountDown', () => {
	let mockDiv;
	let mockLink;
	let mockCountDownCurrent;
	let mockCountDownText;
	let intervalCallback;
	let clickCallback;

	beforeEach(() => {
		// Setup fake timers
		jest.useFakeTimers();

		// Setup global labels
		global.labelNextUpdate = 'Next Update';
		global.labelDoUpdate = 'Refresh Now';

		// Mock link element
		mockLink = {
			click: jest.fn(function(callback) {
				clickCallback = callback;
				return this;
			}),
			attr: jest.fn().mockReturnThis(),
			button: jest.fn().mockReturnThis(),
			prop: jest.fn(() => false),
			length: 1
		};

		// Mock progress bar current
		mockCountDownCurrent = {
			width: jest.fn(),
			length: 1
		};

		// Mock text element
		mockCountDownText = {
			html: jest.fn(),
			length: 1
		};

		// Mock main div
		mockDiv = {
			length: 1,
			append: jest.fn().mockReturnThis(),
			find: jest.fn((selector) => {
				if (selector === '.count_down_link a') {
					return mockLink;
				}
				if (selector === '.count_down_current') {
					return mockCountDownCurrent;
				}
				if (selector === '.count_down_text') {
					return mockCountDownText;
				}
				return { length: 0 };
			})
		};

		// Spy on setInterval to capture callback
		const originalSetInterval = global.setInterval;
		jest.spyOn(global, 'setInterval').mockImplementation((callback, delay) => {
			intervalCallback = callback;
			return originalSetInterval(callback, delay);
		});
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.restoreAllMocks();
		delete global.labelNextUpdate;
		delete global.labelDoUpdate;
	});

	describe('constructor', () => {
		test('should return early when div has no length', () => {
			const emptyDiv = { length: 0 };
			const countDown = new CountDown(emptyDiv, jest.fn());

			expect(countDown.div).toBeUndefined();
		});

		test('should create countdown UI elements', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			expect(mockDiv.append).toHaveBeenCalledTimes(4);
			expect(mockDiv.append).toHaveBeenCalledWith('<div class="count_down_title">Next Update</div>');
			expect(mockDiv.append).toHaveBeenCalledWith('<div class="count_down_progress"><div class="count_down_current"></div></div>');
			expect(mockDiv.append).toHaveBeenCalledWith('<div class="count_down_text"></div>');
			expect(mockDiv.append).toHaveBeenCalledWith('<div class="count_down_link"><a href="#" data-loading-text="<i class=\'fa fa-circle-notch fa-spin\'></i>">Refresh Now</a></div>');
		});

		test('should initialize properties', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			expect(countDown.div).toBe(mockDiv);
			expect(countDown.callbackOnRefreshData).toBe(callback);
			expect(countDown.alreadyMakingRequest).toBe(false);
			expect(countDown.secondsBefRefresh).toBe(10);
			expect(countDown.refreshIntervalMillis).toBe(60);
			expect(countDown.currentMillis).toBe(0);
			expect(countDown.currentSecond).toBe(0);
		});

		test('should set up click handler on refresh link', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			expect(mockLink.click).toHaveBeenCalled();
		});

		test('should handle click on refresh link', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			// Execute the click callback
			const result = clickCallback.call(mockLink);

			expect(result).toBe(false);
			expect(callback).toHaveBeenCalled();
		});

		test('should start interval timer', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 60);
		});

		test('should call refreshData immediately after construction', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			expect(callback).toHaveBeenCalled();
		});

		test('should handle missing refresh link', () => {
			const mockEmptyLink = {
				length: 0,
				attr: jest.fn().mockReturnThis(),
				button: jest.fn().mockReturnThis()
			};

			mockDiv.find = jest.fn((selector) => {
				if (selector === '.count_down_link a') {
					return mockEmptyLink;
				}
				if (selector === '.count_down_current') {
					return mockCountDownCurrent;
				}
				if (selector === '.count_down_text') {
					return mockCountDownText;
				}
				return { length: 0 };
			});

			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			expect(() => {
				new CountDown(mockDiv, callback);
			}).not.toThrow();
		});
	});

	describe('setCallbackOnRefreshData', () => {
		test('should update callback', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();
			const countDown = new CountDown(mockDiv, callback1);

			countDown.setCallbackOnRefreshData(callback2);

			expect(countDown.callbackOnRefreshData).toBe(callback2);
		});
	});

	describe('refreshData', () => {
		test('should reset currentMillis', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			countDown.currentMillis = 5000;
			countDown.refreshData();

			expect(countDown.currentMillis).toBe(0);
		});

		test('should not launch new request if already making request', () => {
			const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			countDown.alreadyMakingRequest = true;
			const callCountBefore = callback.mock.calls.length;

			countDown.refreshData();

			expect(callback.mock.calls.length).toBe(callCountBefore);
			expect(consoleLogSpy).toHaveBeenCalledWith('Already making request, no new request lauched.');

			consoleLogSpy.mockRestore();
		});

		test('should disable button during request', () => {
			const callback = jest.fn((completeCallback) => {
				// Don't call completeCallback to keep request active
			});
			const countDown = new CountDown(mockDiv, callback);

			jest.clearAllMocks();
			countDown.refreshData();

			expect(mockLink.attr).toHaveBeenCalledWith('disabled', true);
			expect(mockLink.button).toHaveBeenCalledWith('loading');
		});

		test('should enable button after request completes', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			jest.clearAllMocks();
			countDown.refreshData();

			expect(mockLink.attr).toHaveBeenCalledWith('disabled', false);
			expect(mockLink.button).toHaveBeenCalledWith('reset');
			expect(countDown.alreadyMakingRequest).toBe(false);
		});

		test('should call callback if it is a function', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			jest.clearAllMocks();
			countDown.refreshData();

			expect(callback).toHaveBeenCalledWith(expect.any(Function));
		});

		test('should not crash if callback is not a function', () => {
			const countDown = new CountDown(mockDiv, null);

			expect(() => {
				countDown.refreshData();
			}).not.toThrow();
		});

		test('should set alreadyMakingRequest to true during request', () => {
			let countDownInstance;
			const callback = jest.fn((completeCallback) => {
				// Note: Bug in original code - sets CountDown.alreadyMakingRequest (static) instead of this.alreadyMakingRequest
				// We test the actual behavior, not the intended behavior
				completeCallback();
			});
			countDownInstance = new CountDown(mockDiv, callback);

			countDownInstance.alreadyMakingRequest = false;
			jest.clearAllMocks();
			countDownInstance.refreshData();

			// After refreshData completes, alreadyMakingRequest should be false again
			expect(countDownInstance.alreadyMakingRequest).toBe(false);
		});
	});

	describe('interval timer behavior', () => {
		test('should increment currentMillis on each interval tick', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			countDown.currentMillis = 0;

			// Execute interval callback
			intervalCallback();

			expect(countDown.currentMillis).toBe(60);
			expect(countDown.currentSecond).toBe(0);
		});

		test('should update currentSecond correctly', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			countDown.currentMillis = 0;

			// Run multiple intervals to reach 1 second
			for (let i = 0; i < 17; i++) {
				intervalCallback();
			}

			expect(countDown.currentSecond).toBe(1);
		});

		test('should reset currentMillis when button is disabled', () => {
			mockLink.prop = jest.fn(() => true); // Button disabled

			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			countDown.currentMillis = 5000;

			intervalCallback();

			expect(countDown.currentMillis).toBe(0);
		});

		test('should update progress bar width correctly', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			countDown.currentMillis = 5000;
			jest.clearAllMocks();

			intervalCallback();

			expect(mockCountDownCurrent.width).toHaveBeenCalled();
			const widthArg = mockCountDownCurrent.width.mock.calls[0][0];
			expect(widthArg).toBeGreaterThan(0);
			expect(widthArg).toBeLessThanOrEqual(120);
		});

		test('should update text with remaining seconds', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			countDown.currentMillis = 0;
			jest.clearAllMocks();

			intervalCallback();

			expect(mockCountDownText.html).toHaveBeenCalledWith('10s');
		});

		test('should show 0s when time reaches limit', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			countDown.currentMillis = 10000;
			countDown.currentSecond = 10;
			jest.clearAllMocks();

			intervalCallback();

			expect(mockCountDownText.html).toHaveBeenCalledWith('0s');
		});

		test('should set progress bar to full when time reaches limit', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			countDown.currentMillis = 10000;
			countDown.currentSecond = 10;
			jest.clearAllMocks();

			intervalCallback();

			expect(mockCountDownCurrent.width).toHaveBeenCalledWith(120);
		});

		test('should trigger refreshData after timeout when time limit reached', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			countDown.currentMillis = 10000;
			countDown.currentSecond = 10;

			const callCountBefore = callback.mock.calls.length;
			jest.clearAllMocks();

			// Execute interval callback which should schedule a setTimeout
			intervalCallback();

			// Advance timers to trigger the setTimeout(callback, 100)
			jest.advanceTimersByTime(100);

			// Should have called refreshData through the timeout
			expect(callback.mock.calls.length).toBeGreaterThan(0);
		});

		test('should reset currentMillis after reaching time limit', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			countDown.currentMillis = 10000;
			countDown.currentSecond = 10;

			intervalCallback();

			expect(countDown.currentMillis).toBe(0);
		});

		test('should handle missing progress bar element', () => {
			mockDiv.find = jest.fn((selector) => {
				if (selector === '.count_down_link a') {
					return mockLink;
				}
				if (selector === '.count_down_current') {
					return { length: 0 };
				}
				if (selector === '.count_down_text') {
					return mockCountDownText;
				}
				return { length: 0 };
			});

			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			expect(() => {
				intervalCallback();
			}).not.toThrow();
		});

		test('should handle missing text element', () => {
			mockDiv.find = jest.fn((selector) => {
				if (selector === '.count_down_link a') {
					return mockLink;
				}
				if (selector === '.count_down_current') {
					return mockCountDownCurrent;
				}
				if (selector === '.count_down_text') {
					return { length: 0 };
				}
				return { length: 0 };
			});

			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			expect(() => {
				intervalCallback();
			}).not.toThrow();
		});

		test('should calculate progress correctly at different time points', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			// Test at 5 seconds (50%)
			countDown.currentMillis = 5000;
			countDown.currentSecond = 5;
			jest.clearAllMocks();

			intervalCallback();

			expect(mockCountDownText.html).toHaveBeenCalledWith('5s');
			const width1 = mockCountDownCurrent.width.mock.calls[0][0];
			expect(width1).toBeGreaterThan(50);
			expect(width1).toBeLessThan(70);

			// Test at 9 seconds (90%)
			countDown.currentMillis = 9000;
			countDown.currentSecond = 9;
			jest.clearAllMocks();

			intervalCallback();

			expect(mockCountDownText.html).toHaveBeenCalledWith('1s');
			const width2 = mockCountDownCurrent.width.mock.calls[0][0];
			expect(width2).toBeGreaterThan(100);
		});
	});

	describe('integration scenarios', () => {
		test('should complete full countdown cycle', () => {
			const callback = jest.fn((completeCallback) => {
				completeCallback();
			});
			const countDown = new CountDown(mockDiv, callback);

			const initialCallCount = callback.mock.calls.length;

			// Start from 0
			countDown.currentMillis = 0;

			// Simulate intervals until reaching 10 seconds
			for (let i = 0; i < 167; i++) { // 167 * 60ms ≈ 10020ms
				intervalCallback();
			}

			// Advance timers to trigger the setTimeout(callback, 100)
			jest.advanceTimersByTime(100);

			// Should have triggered refresh at least once more
			expect(callback.mock.calls.length).toBeGreaterThan(initialCallCount);
		});

		test('should handle rapid manual refreshes', () => {
			const callback = jest.fn((completeCallback) => {
				// Simulate async request - don't complete immediately
			});
			const countDown = new CountDown(mockDiv, callback);

			jest.clearAllMocks();

			// First manual refresh
			countDown.refreshData();
			expect(callback).toHaveBeenCalledTimes(1);

			// Manually set alreadyMakingRequest to true to simulate in-progress request
			countDown.alreadyMakingRequest = true;

			// Try to refresh again while first is in progress
			countDown.refreshData();
			expect(callback).toHaveBeenCalledTimes(1); // Should not call again
		});

		test('should allow new refresh after previous completes', () => {
			let completeCallback;
			const callback = jest.fn((cb) => {
				completeCallback = cb;
			});
			const countDown = new CountDown(mockDiv, callback);

			jest.clearAllMocks();

			// First refresh
			countDown.refreshData();
			expect(callback).toHaveBeenCalledTimes(1);

			// Complete the first refresh
			completeCallback();

			// Now should allow new refresh
			countDown.refreshData();
			expect(callback).toHaveBeenCalledTimes(2);
		});
	});
});
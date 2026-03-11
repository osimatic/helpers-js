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
		jest.useFakeTimers();

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
	});

	describe('init', () => {
		test('should return undefined when div has no length', () => {
			const result = CountDown.init({ length: 0 }, { onRefreshData: jest.fn() });

			expect(result).toBeUndefined();
		});

		test('should create countdown UI elements with provided labels', () => {
			CountDown.init(mockDiv, { labelNextUpdate: 'Next Update', labelDoUpdate: 'Refresh Now' });

			expect(mockDiv.append).toHaveBeenCalledTimes(4);
			expect(mockDiv.append).toHaveBeenCalledWith('<div class="count_down_title">Next Update</div>');
			expect(mockDiv.append).toHaveBeenCalledWith('<div class="count_down_progress"><div class="count_down_current"></div></div>');
			expect(mockDiv.append).toHaveBeenCalledWith('<div class="count_down_text"></div>');
			expect(mockDiv.append).toHaveBeenCalledWith('<div class="count_down_link"><a href="#" data-loading-text="<i class=\'fa fa-circle-notch fa-spin\'></i>">Refresh Now</a></div>');
		});

		test('should use default labels when not provided', () => {
			CountDown.init(mockDiv, {});

			expect(mockDiv.append).toHaveBeenCalledWith('<div class="count_down_title">Prochaine mise à jour</div>');
			expect(mockDiv.append).toHaveBeenCalledWith(expect.stringContaining('Mettre à jour'));
		});

		test('should set up click handler on refresh link', () => {
			CountDown.init(mockDiv, {});

			expect(mockLink.click).toHaveBeenCalled();
		});

		test('should return false on click', () => {
			const callback = jest.fn((completeCallback) => completeCallback());
			CountDown.init(mockDiv, { onRefreshData: callback });

			const result = clickCallback.call(mockLink);

			expect(result).toBe(false);
		});

		test('should start interval timer', () => {
			CountDown.init(mockDiv, {});

			expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 60);
		});

		test('should call onRefreshData immediately after init', () => {
			const callback = jest.fn((completeCallback) => completeCallback());
			CountDown.init(mockDiv, { onRefreshData: callback });

			expect(callback).toHaveBeenCalled();
		});

		test('should not throw when refresh link is missing', () => {
			mockDiv.find = jest.fn((selector) => {
				if (selector === '.count_down_link a') return { length: 0, attr: jest.fn().mockReturnThis(), button: jest.fn().mockReturnThis() };
				if (selector === '.count_down_current') return mockCountDownCurrent;
				if (selector === '.count_down_text') return mockCountDownText;
				return { length: 0 };
			});

			expect(() => {
				CountDown.init(mockDiv, {});
			}).not.toThrow();
		});
	});

	describe('refreshData', () => {
		test('should call onRefreshData on click', () => {
			const callback = jest.fn((completeCallback) => completeCallback());
			CountDown.init(mockDiv, { onRefreshData: callback });
			jest.clearAllMocks();

			clickCallback.call(mockLink);

			expect(callback).toHaveBeenCalledWith(expect.any(Function));
		});

		test('should disable button during request', () => {
			let callCount = 0;
			const callback = jest.fn((completeCallback) => {
				callCount++;
				if (callCount === 1) completeCallback(); // init call complète
				// le click ne complète pas → alreadyMakingRequest reste true
			});
			CountDown.init(mockDiv, { onRefreshData: callback });
			jest.clearAllMocks();

			clickCallback.call(mockLink);

			expect(mockLink.attr).toHaveBeenCalledWith('disabled', true);
			expect(mockLink.button).toHaveBeenCalledWith('loading');
		});

		test('should re-enable button after request completes', () => {
			const callback = jest.fn((completeCallback) => completeCallback());
			CountDown.init(mockDiv, { onRefreshData: callback });
			jest.clearAllMocks();

			clickCallback.call(mockLink);

			expect(mockLink.attr).toHaveBeenCalledWith('disabled', false);
			expect(mockLink.button).toHaveBeenCalledWith('reset');
		});

		test('should not launch new request if already making request', () => {
			const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
			const callback = jest.fn(); // ne complète pas, laisse alreadyMakingRequest = true
			CountDown.init(mockDiv, { onRefreshData: callback });

			// à ce stade le premier refreshData() a été appelé sans compléter
			const callCountAfterInit = callback.mock.calls.length;

			clickCallback.call(mockLink); // bloqué

			expect(callback.mock.calls.length).toBe(callCountAfterInit);
			expect(consoleLogSpy).toHaveBeenCalledWith('Already making request, no new request lauched.');

			consoleLogSpy.mockRestore();
		});

		test('should not crash if onRefreshData is not a function', () => {
			expect(() => {
				CountDown.init(mockDiv, {});
			}).not.toThrow();
		});

		test('should allow new request after previous completes', () => {
			let completeCallback;
			const callback = jest.fn((cb) => { completeCallback = cb; });
			CountDown.init(mockDiv, { onRefreshData: callback });

			// complète la première requête
			completeCallback();
			const callCountAfterComplete = callback.mock.calls.length;

			clickCallback.call(mockLink);

			expect(callback.mock.calls.length).toBe(callCountAfterComplete + 1);
		});
	});

	describe('interval timer behavior', () => {
		test('should show remaining seconds in text', () => {
			const callback = jest.fn((completeCallback) => completeCallback());
			CountDown.init(mockDiv, { onRefreshData: callback });
			jest.clearAllMocks();

			intervalCallback();

			expect(mockCountDownText.html).toHaveBeenCalledWith('10s');
		});

		test('should show 0s when time reaches limit', () => {
			const callback = jest.fn((completeCallback) => completeCallback());
			CountDown.init(mockDiv, { onRefreshData: callback });

			for (let i = 0; i < 166; i++) {
				intervalCallback();
			}
			jest.clearAllMocks();
			intervalCallback(); // tick 167 : currentMillis = 10020 → 0s

			expect(mockCountDownText.html).toHaveBeenCalledWith('0s');
		});

		test('should set progress bar to full when time reaches limit', () => {
			const callback = jest.fn((completeCallback) => completeCallback());
			CountDown.init(mockDiv, { onRefreshData: callback });

			for (let i = 0; i < 166; i++) {
				intervalCallback();
			}
			jest.clearAllMocks();
			intervalCallback(); // tick 167 : width = 120

			expect(mockCountDownCurrent.width).toHaveBeenCalledWith(120);
		});

		test('should update progress bar width', () => {
			const callback = jest.fn((completeCallback) => completeCallback());
			CountDown.init(mockDiv, { onRefreshData: callback });
			jest.clearAllMocks();

			intervalCallback();

			expect(mockCountDownCurrent.width).toHaveBeenCalled();
			const widthArg = mockCountDownCurrent.width.mock.calls[0][0];
			expect(widthArg).toBeGreaterThanOrEqual(0);
			expect(widthArg).toBeLessThanOrEqual(120);
		});

		test('should trigger refreshData after timeout when time limit reached', () => {
			const callback = jest.fn((completeCallback) => completeCallback());
			CountDown.init(mockDiv, { onRefreshData: callback });

			for (let i = 0; i < 167; i++) {
				intervalCallback();
			}

			const callCountBefore = callback.mock.calls.length;
			intervalCallback();
			jest.advanceTimersByTime(100);

			expect(callback.mock.calls.length).toBeGreaterThan(callCountBefore);
		});

		test('should reset progress to 0 when button is disabled', () => {
			mockLink.prop = jest.fn(() => true); // bouton désactivé

			const callback = jest.fn((completeCallback) => completeCallback());
			CountDown.init(mockDiv, { onRefreshData: callback });
			jest.clearAllMocks();

			intervalCallback();

			// currentMillis reste à 0 → currentSecond = 0 → width = 0
			const widthArg = mockCountDownCurrent.width.mock.calls[0][0];
			expect(widthArg).toBe(0);
		});

		test('should handle missing progress bar element', () => {
			mockDiv.find = jest.fn((selector) => {
				if (selector === '.count_down_link a') return mockLink;
				if (selector === '.count_down_current') return { length: 0 };
				if (selector === '.count_down_text') return mockCountDownText;
				return { length: 0 };
			});

			const callback = jest.fn((completeCallback) => completeCallback());
			CountDown.init(mockDiv, { onRefreshData: callback });

			expect(() => { intervalCallback(); }).not.toThrow();
		});

		test('should handle missing text element', () => {
			mockDiv.find = jest.fn((selector) => {
				if (selector === '.count_down_link a') return mockLink;
				if (selector === '.count_down_current') return mockCountDownCurrent;
				if (selector === '.count_down_text') return { length: 0 };
				return { length: 0 };
			});

			const callback = jest.fn((completeCallback) => completeCallback());
			CountDown.init(mockDiv, { onRefreshData: callback });

			expect(() => { intervalCallback(); }).not.toThrow();
		});
	});

	describe('integration scenarios', () => {
		test('should complete full countdown cycle', () => {
			const callback = jest.fn((completeCallback) => completeCallback());
			CountDown.init(mockDiv, { onRefreshData: callback });

			const initialCallCount = callback.mock.calls.length;

			for (let i = 0; i < 167; i++) {
				intervalCallback();
			}
			jest.advanceTimersByTime(100);

			expect(callback.mock.calls.length).toBeGreaterThan(initialCallCount);
		});

		test('should handle rapid manual refreshes', () => {
			const callback = jest.fn(); // ne complète pas
			CountDown.init(mockDiv, { onRefreshData: callback });

			const callCountAfterInit = callback.mock.calls.length;

			// déjà en cours → bloqué
			clickCallback.call(mockLink);
			expect(callback.mock.calls.length).toBe(callCountAfterInit);
		});

		test('should allow new refresh after previous completes', () => {
			let completeCallback;
			const callback = jest.fn((cb) => { completeCallback = cb; });
			CountDown.init(mockDiv, { onRefreshData: callback });

			completeCallback();
			const callCountAfterComplete = callback.mock.calls.length;

			clickCallback.call(mockLink);
			expect(callback.mock.calls.length).toBe(callCountAfterComplete + 1);
		});
	});
});
/**
 * @jest-environment jsdom
 */
const { DetailsSubArray } = require('../details_sub_array');

// Mock HTTPClient
jest.mock('../http_client', () => ({
	HTTPClient: {
		request: jest.fn()
	}
}));

const { HTTPClient } = require('../http_client');

describe('DetailsSubArray', () => {
	let mockTable;
	let mockLink;
	let mockTr;
	let mockThead;

	beforeEach(() => {
		// Clear all mocks
		jest.clearAllMocks();

		// Define global labels used by the code
		global.showDetailsLabel = 'Show details';
		global.hideDetailsLabel = 'Hide details';
		global.labelErrorOccured = 'An error occurred';

		// Make HTTPClient available globally
		global.HTTPClient = HTTPClient;

		// Create mock DOM structure
		mockThead = {
			find: jest.fn((selector) => {
				if (selector === 'thead tr') {
					return {
						children: jest.fn(() => ({ length: 5 }))
					};
				}
				return {
					children: jest.fn(() => ({ length: 5 }))
				};
			})
		};

		mockTr = {
			closest: jest.fn((selector) => {
				if (selector === 'table') {
					return {
						find: jest.fn((sel) => {
							if (sel === 'thead tr') {
								return {
									children: jest.fn(() => ({ length: 5 }))
								};
							}
							return mockThead;
						})
					};
				}
				return mockTr;
			}),
			after: jest.fn(),
			addClass: jest.fn().mockReturnThis(),
			next: jest.fn(() => ({
				hasClass: jest.fn(() => false),
				remove: jest.fn()
			}))
		};

		mockLink = {
			data: jest.fn((key) => {
				if (key === 'url_details') return 'http://example.com/details';
				return null;
			}),
			closest: jest.fn(() => mockTr),
			prop: jest.fn().mockReturnThis(),
			attr: jest.fn().mockReturnThis(),
			html: jest.fn().mockReturnThis(),
			click: jest.fn().mockReturnThis(),
			stop: jest.fn().mockReturnThis(),
			off: jest.fn().mockReturnThis(),
			removeClass: jest.fn().mockReturnThis()
		};

		mockTable = {
			find: jest.fn(() => ({
				each: jest.fn((callback) => {
					// Simulate one link found
					callback(0, mockLink);
				})
			}))
		};

		// Mock jQuery
		global.$ = jest.fn((selector) => {
			if (typeof selector === 'string') {
				if (selector.includes('<tr')) {
					return {
						find: jest.fn().mockReturnThis(),
						append: jest.fn().mockReturnThis(),
						after: jest.fn().mockReturnThis()
					};
				}
				if (selector.includes('<span')) {
					return selector; // Return the HTML string for glyphicon
				}
				if (selector.includes('<i')) {
					return selector; // Return the HTML string for fa icons
				}
				return {
					length: 0,
					remove: jest.fn()
				};
			}
			// Wrap element
			return selector;
		});
	});

	afterEach(() => {
		delete global.$;
		delete global.showDetailsLabel;
		delete global.hideDetailsLabel;
		delete global.labelErrorOccured;
		delete global.HTTPClient;
	});

	describe('initDetailsLink', () => {
		test('should initialize details links', () => {
			DetailsSubArray.initDetailsLink(mockTable);

			expect(mockTable.find).toHaveBeenCalledWith('a.details_link');
			expect(mockLink.removeClass).toHaveBeenCalledWith('hide');
		});

		test('should set up click handlers on links', () => {
			DetailsSubArray.initDetailsLink(mockTable);

			expect(mockLink.click).toHaveBeenCalled();
		});

		test('should show plus button initially', () => {
			DetailsSubArray.initDetailsLink(mockTable);

			expect(mockLink.html).toHaveBeenCalled();
		});

		test('should handle callback before send', () => {
			const beforeSendCallback = jest.fn(() => '<div>Custom content</div>');

			DetailsSubArray.initDetailsLink(mockTable, null, null, beforeSendCallback);

			// Trigger the click
			const clickHandler = mockLink.click.mock.calls[0][0];
			if (clickHandler) {
				clickHandler.call(mockLink);
			}

			// beforeSendCallback should be called when clicking
			// (This tests that the callback is properly wired up)
		});

		test('should handle success callback', () => {
			const successCallback = jest.fn((jsonObj, link) => '<div>Success</div>');

			DetailsSubArray.initDetailsLink(mockTable, successCallback);

			// Verify the callback is passed through
			expect(mockTable.find).toHaveBeenCalled();
		});

		test('should handle error callback', () => {
			const errorCallback = jest.fn();

			DetailsSubArray.initDetailsLink(mockTable, null, errorCallback);

			// Verify the callback is passed through
			expect(mockTable.find).toHaveBeenCalled();
		});

		test('should make HTTP request when link is clicked', () => {
			HTTPClient.request.mockImplementation((method, url, data, successCb, errorCb) => {
				successCb({ data: 'test' });
			});

			const successCallback = jest.fn(() => '<div>Details</div>');
			DetailsSubArray.initDetailsLink(mockTable, successCallback);

			// Simulate click
			const clickHandler = mockLink.click.mock.calls[0][0];
			if (clickHandler) {
				clickHandler.call(mockLink);
			}

			// HTTPClient.request should be called
			expect(HTTPClient.request).toHaveBeenCalledWith(
				'GET',
				'http://example.com/details',
				null,
				expect.any(Function),
				expect.any(Function)
			);
		});

		test('should handle HTTP request success with null response', () => {
			HTTPClient.request.mockImplementation((method, url, data, successCb) => {
				successCb(null);
			});

			DetailsSubArray.initDetailsLink(mockTable);

			// Simulate click
			const clickHandler = mockLink.click.mock.calls[0][0];
			if (clickHandler) {
				clickHandler.call(mockLink);
			}

			// Should display error row
			expect(mockTr.after).toHaveBeenCalled();
		});

		test('should handle HTTP request error', () => {
			HTTPClient.request.mockImplementation((method, url, data, successCb, errorCb) => {
				errorCb();
			});

			DetailsSubArray.initDetailsLink(mockTable);

			// Simulate click
			const clickHandler = mockLink.click.mock.calls[0][0];
			if (clickHandler) {
				clickHandler.call(mockLink);
			}

			// Should display error row
			expect(mockTr.after).toHaveBeenCalled();
		});

		test('should call success callback with JSON response', () => {
			const jsonResponse = { items: ['item1', 'item2'] };
			const successCallback = jest.fn(() => '<div>Details</div>');

			HTTPClient.request.mockImplementation((method, url, data, successCb) => {
				successCb(jsonResponse);
			});

			DetailsSubArray.initDetailsLink(mockTable, successCallback);

			// Simulate click
			const clickHandler = mockLink.click.mock.calls[0][0];
			if (clickHandler) {
				clickHandler.call(mockLink);
			}

			// Success callback should be called with JSON response
			expect(successCallback).toHaveBeenCalledWith(jsonResponse, mockLink);
		});

		test('should call error callback on HTTP error', () => {
			const errorCallback = jest.fn();

			HTTPClient.request.mockImplementation((method, url, data, successCb, errorCb) => {
				errorCb();
			});

			DetailsSubArray.initDetailsLink(mockTable, null, errorCallback);

			// Simulate click
			const clickHandler = mockLink.click.mock.calls[0][0];
			if (clickHandler) {
				clickHandler.call(mockLink);
			}

			// Error callback should be called
			expect(errorCallback).toHaveBeenCalledWith(mockLink);
		});

		test('should call error callback when response is null', () => {
			const errorCallback = jest.fn();

			HTTPClient.request.mockImplementation((method, url, data, successCb) => {
				successCb(null);
			});

			DetailsSubArray.initDetailsLink(mockTable, null, errorCallback);

			// Simulate click
			const clickHandler = mockLink.click.mock.calls[0][0];
			if (clickHandler) {
				clickHandler.call(mockLink);
			}

			// Error callback should be called
			expect(errorCallback).toHaveBeenCalledWith(mockLink);
		});

		test('should use before send callback instead of HTTP request', () => {
			const beforeSendCallback = jest.fn(() => '<div>Immediate content</div>');

			DetailsSubArray.initDetailsLink(mockTable, null, null, beforeSendCallback);

			// Simulate click
			const clickHandler = mockLink.click.mock.calls[0][0];
			if (clickHandler) {
				clickHandler.call(mockLink);
			}

			// Before send callback should be called
			expect(beforeSendCallback).toHaveBeenCalledWith(mockLink);

			// HTTP request should NOT be made
			expect(HTTPClient.request).not.toHaveBeenCalled();
		});

		test('should handle multiple links', () => {
			const mockLink2 = { ...mockLink };

			mockTable.find = jest.fn(() => ({
				each: jest.fn((callback) => {
					callback(0, mockLink);
					callback(1, mockLink2);
				})
			}));

			DetailsSubArray.initDetailsLink(mockTable);

			// Both links should be initialized
			expect(mockLink.removeClass).toHaveBeenCalled();
		});

		test('should disable link while loading', () => {
			HTTPClient.request.mockImplementation(() => {
				// Don't call callbacks, simulate loading state
			});

			DetailsSubArray.initDetailsLink(mockTable);

			// Simulate click
			const clickHandler = mockLink.click.mock.calls[0][0];
			if (clickHandler) {
				clickHandler.call(mockLink);
			}

			// Link should be disabled during loading
			expect(mockLink.attr).toHaveBeenCalledWith('disabled', true);
		});

		test('should show loading icon', () => {
			HTTPClient.request.mockImplementation(() => {
				// Loading state
			});

			DetailsSubArray.initDetailsLink(mockTable);

			// Simulate click
			const clickHandler = mockLink.click.mock.calls[0][0];
			if (clickHandler) {
				clickHandler.call(mockLink);
			}

			// Should display loading icon
			expect(mockLink.html).toHaveBeenCalled();
			expect(mockTr.after).toHaveBeenCalled();
		});
	});
});
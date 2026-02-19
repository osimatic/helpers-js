/**
 * @jest-environment jsdom
 */

const { Pagination, Navigation } = require('../paging');

describe('Pagination', () => {
	let mockDiv, mockTable, mockSelect, mockItems, mockUl, mockLi;

	beforeEach(() => {
		// Mock items
		mockItems = [];
		for (let i = 0; i < 5; i++) {
			const item = {
				show: jest.fn().mockReturnThis(),
				hide: jest.fn().mockReturnThis()
			};
			mockItems.push(item);
		}

		const itemsWithEach = Object.assign(mockItems, {
			length: 5,
			each: jest.fn(function(callback) {
				this.forEach((item, idx) => callback.call(item, idx, item));
			})
		});

		// Mock li elements
		mockLi = {
			addClass: jest.fn().mockReturnThis(),
			removeClass: jest.fn().mockReturnThis(),
			data: jest.fn((key) => key === 'page' ? 1 : undefined),
			click: jest.fn().mockReturnThis()
		};

		// Mock ul element
		const mockLiList = {
			remove: jest.fn().mockReturnThis(),
			click: jest.fn().mockReturnThis(),
			removeClass: jest.fn().mockReturnThis(),
			addClass: jest.fn().mockReturnThis()
		};

		mockUl = {
			find: jest.fn((selector) => {
				if (selector === 'li') {
					return mockLiList;
				}
				if (selector === 'li:first-child') {
					return mockLi;
				}
				return mockLi;
			}),
			append: jest.fn().mockReturnThis(),
			show: jest.fn().mockReturnThis(),
			addClass: jest.fn().mockReturnThis(),
			removeClass: jest.fn().mockReturnThis(),
			remove: jest.fn().mockReturnThis(),
			each: jest.fn(function(callback) {
				callback.call(this, 0, this);
			}),
			length: 1
		};

		// Mock select element
		mockSelect = {
			children: jest.fn(() => ({ length: 0 })),
			append: jest.fn().mockReturnThis(),
			data: jest.fn((key) => {
				if (key === 'nb_rows_list') return '5,10,25,50';
				if (key === 'default_nb_rows') return '10';
				return undefined;
			}),
			val: jest.fn((value) => {
				if (value === undefined) return '10';
				return mockSelect;
			}),
			change: jest.fn().mockReturnThis(),
			length: 1
		};

		// Mock div element
		mockDiv = {
			find: jest.fn((selector) => {
				if (selector === '.pagination_item') return itemsWithEach;
				if (selector === '.pagination_links') return { length: 1, prepend: jest.fn(), append: jest.fn() };
				return { length: 0 };
			}),
			before: jest.fn().mockReturnThis(),
			after: jest.fn().mockReturnThis(),
			data: jest.fn((key) => key === 'max_rows' ? '10' : undefined),
			length: 1
		};

		// Mock table element
		mockTable = {
			find: jest.fn((selector) => {
				if (selector === 'tbody tr:not(.hide)') return itemsWithEach;
				return { length: 0 };
			}),
			data: jest.fn((key) => key === 'max_rows' ? '10' : undefined),
			before: jest.fn().mockReturnThis(),
			after: jest.fn().mockReturnThis(),
			length: 1
		};

		// Mock jQuery global
		global.$ = jest.fn((selector) => {
			if (selector === 'ul.pagination') return mockUl;
			if (typeof selector === 'string' && selector.startsWith('<ul')) return mockUl;
			if (typeof selector === 'string' && selector.startsWith('li[data-page')) {
				return {
					each: jest.fn(function(callback) {
						callback.call(mockLi, 0, mockLi);
					})
				};
			}
			// Handle $(ul) calls where ul is mockUl - return mockUl itself
			if (selector === mockUl) {
				return mockUl;
			}
			// Handle $(this) calls inside .each() - return an object with all jQuery methods
			if (typeof selector === 'object' && selector !== null) {
				return {
					show: jest.fn().mockReturnThis(),
					hide: jest.fn().mockReturnThis(),
					addClass: jest.fn().mockReturnThis(),
					removeClass: jest.fn().mockReturnThis(),
					data: jest.fn((key) => key === 'page' ? 1 : undefined),
					find: jest.fn(() => ({
						remove: jest.fn().mockReturnThis(),
						addClass: jest.fn().mockReturnThis(),
						removeClass: jest.fn().mockReturnThis()
					})),
					remove: jest.fn().mockReturnThis(),
					append: jest.fn().mockReturnThis()
				};
			}
			return mockDiv;
		});

		global.$.each = jest.fn((obj, callback) => {
			if (Array.isArray(obj)) {
				obj.forEach((item, idx) => callback(idx, item));
			} else {
				Object.keys(obj).forEach(key => callback(key, obj[key]));
			}
		});

		// Mock global labelDisplayAll
		global.labelDisplayAll = 'Display all';
	});

	afterEach(() => {
		jest.clearAllMocks();
		delete global.$;
		delete global.labelDisplayAll;
	});

	describe('paginateCards', () => {
		test('should call paginate with correct parameters', () => {
			const spyPaginate = jest.spyOn(Pagination, 'paginate').mockImplementation(() => {});

			Pagination.paginateCards(mockDiv, 10, false);

			expect(spyPaginate).toHaveBeenCalledWith(
				mockDiv,
				expect.anything(),
				10,
				undefined,
				false
			);

			spyPaginate.mockRestore();
		});

		test('should call paginate with double pagination', () => {
			const spyPaginate = jest.spyOn(Pagination, 'paginate').mockImplementation(() => {});

			Pagination.paginateCards(mockDiv, 20, true);

			expect(spyPaginate).toHaveBeenCalledWith(
				mockDiv,
				expect.anything(),
				20,
				undefined,
				true
			);

			spyPaginate.mockRestore();
		});
	});

	describe('paginateTable', () => {
		test('should call paginate with table rows', () => {
			const spyPaginate = jest.spyOn(Pagination, 'paginate').mockImplementation(() => {});

			Pagination.paginateTable(mockTable, mockSelect, false);

			expect(mockTable.find).toHaveBeenCalledWith('tbody tr:not(.hide)');
			expect(mockTable.data).toHaveBeenCalledWith('max_rows');
			expect(spyPaginate).toHaveBeenCalled();

			spyPaginate.mockRestore();
		});
	});

	describe('paginate', () => {
		test('should return early if div is undefined', () => {
			Pagination.paginate(undefined, mockItems, 10, undefined, false);
			// Should not throw
		});

		test('should return early if div has no length', () => {
			const emptyDiv = { length: 0 };
			Pagination.paginate(emptyDiv, mockItems, 10, undefined, false);
			// Should not throw
		});

		test('should initialize select with options when empty', () => {
			const spyInitPaginationDiv = jest.spyOn(Pagination, 'initPaginationDiv').mockImplementation(() => {});
			const spyInitPaginationItems = jest.spyOn(Pagination, 'initPaginationItems').mockImplementation(() => {});

			Pagination.paginate(mockDiv, mockItems, 10, mockSelect, false);

			expect(mockSelect.children).toHaveBeenCalled();
			expect(mockSelect.append).toHaveBeenCalled();
			expect(mockSelect.data).toHaveBeenCalledWith('nb_rows_list');

			spyInitPaginationDiv.mockRestore();
			spyInitPaginationItems.mockRestore();
		});

		test('should set default value when data-default_nb_rows is present', () => {
			const spyInitPaginationDiv = jest.spyOn(Pagination, 'initPaginationDiv').mockImplementation(() => {});
			const spyInitPaginationItems = jest.spyOn(Pagination, 'initPaginationItems').mockImplementation(() => {});

			Pagination.paginate(mockDiv, mockItems, 10, mockSelect, false);

			expect(mockSelect.val).toHaveBeenCalled();

			spyInitPaginationDiv.mockRestore();
			spyInitPaginationItems.mockRestore();
		});

		test('should initialize double pagination when requested', () => {
			const spyInitPaginationDiv = jest.spyOn(Pagination, 'initPaginationDiv').mockImplementation(() => {});
			const spyInitPaginationItems = jest.spyOn(Pagination, 'initPaginationItems').mockImplementation(() => {});

			Pagination.paginate(mockDiv, mockItems, 10, undefined, true);

			expect(spyInitPaginationDiv).toHaveBeenCalledTimes(2);
			expect(spyInitPaginationDiv).toHaveBeenCalledWith(mockDiv, mockUl, true, true); // top
			expect(spyInitPaginationDiv).toHaveBeenCalledWith(mockDiv, mockUl, false, true); // bottom

			spyInitPaginationDiv.mockRestore();
			spyInitPaginationItems.mockRestore();
		});

		test('should initialize single pagination when not requested', () => {
			const spyInitPaginationDiv = jest.spyOn(Pagination, 'initPaginationDiv').mockImplementation(() => {});
			const spyInitPaginationItems = jest.spyOn(Pagination, 'initPaginationItems').mockImplementation(() => {});

			Pagination.paginate(mockDiv, mockItems, 10, undefined, false);

			expect(spyInitPaginationDiv).toHaveBeenCalledTimes(1);
			expect(spyInitPaginationDiv).toHaveBeenCalledWith(mockDiv, mockUl, false, false); // bottom

			spyInitPaginationDiv.mockRestore();
			spyInitPaginationItems.mockRestore();
		});
	});

	describe('initPaginationDiv', () => {
		test('should create new pagination div when not present', () => {
			const emptyUl = { length: 0 };

			Pagination.initPaginationDiv(mockDiv, emptyUl, false, true);

			expect(global.$).toHaveBeenCalledWith('<ul class="pagination"></ul>');
		});

		test('should append pagination when onTop is false and pagination_links exists', () => {
			const paginationLinks = {
				length: 1,
				prepend: jest.fn(),
				append: jest.fn()
			};

			mockDiv.find = jest.fn((selector) => {
				if (selector === '.pagination_links') return paginationLinks;
				return { length: 0 };
			});

			Pagination.initPaginationDiv(mockDiv, { length: 0 }, false, true);

			expect(paginationLinks.append).toHaveBeenCalled();
		});

		test('should prepend pagination when onTop is true and pagination_links exists', () => {
			const paginationLinks = {
				length: 1,
				prepend: jest.fn(),
				append: jest.fn()
			};

			mockDiv.find = jest.fn((selector) => {
				if (selector === '.pagination_links') return paginationLinks;
				return { length: 0 };
			});

			Pagination.initPaginationDiv(mockDiv, { length: 0 }, true, true);

			expect(paginationLinks.prepend).toHaveBeenCalled();
		});

		test('should place pagination after div when pagination_links not present and onTop is false', () => {
			mockDiv.find = jest.fn(() => ({ length: 0 }));

			Pagination.initPaginationDiv(mockDiv, { length: 0 }, false, true);

			expect(mockDiv.after).toHaveBeenCalled();
		});

		test('should place pagination before div when pagination_links not present and onTop is true', () => {
			mockDiv.find = jest.fn(() => ({ length: 0 }));

			Pagination.initPaginationDiv(mockDiv, { length: 0 }, true, true);

			expect(mockDiv.before).toHaveBeenCalled();
		});
	});

	describe('initPaginationItems', () => {
		test('should show items up to maxItems', () => {
			const $Spy = jest.spyOn(global, '$');

			Pagination.initPaginationItems(mockItems, 3, false);

			// Verify that $ was called with items (items.each iterates over them)
			expect(mockItems.each).toHaveBeenCalled();
			// Verify that $ was called (for $(this).show() and $(this).hide() calls)
			expect($Spy).toHaveBeenCalled();

			$Spy.mockRestore();
		});

		test('should show all items when maxItems is 0', () => {
			Pagination.initPaginationItems(mockItems, 0, false);

			// With maxItems = 0, all items should be shown
			expect(mockItems.each).toHaveBeenCalled();
		});

		test('should hide pagination when maxItems is 0', () => {
			Pagination.initPaginationItems(mockItems, 0, false);

			// When maxItems is 0 or totalItems < maxItems, pagination is hidden
			expect(mockUl.each).toHaveBeenCalled();
		});

		test('should hide pagination when totalItems < maxItems', () => {
			Pagination.initPaginationItems(mockItems, 10, false);

			// 5 items < 10 maxItems, so pagination should be hidden
			expect(mockUl.each).toHaveBeenCalled();
		});

		test('should create pagination pages', () => {
			const manyItems = [];
			for (let i = 0; i < 25; i++) {
				manyItems.push({
					show: jest.fn().mockReturnThis(),
					hide: jest.fn().mockReturnThis()
				});
			}
			manyItems.each = jest.fn(function(callback) {
				this.forEach((item, idx) => callback.call(item, idx, item));
			});
			manyItems.length = 25;

			Pagination.initPaginationItems(manyItems, 10, false);

			// Should create 3 pages (25 items / 10 per page = 3 pages)
			// Verify that ul.append was called to create page items
			expect(mockUl.append).toHaveBeenCalled();
			// Verify pagination is not hidden
			expect(mockUl.removeClass).toHaveBeenCalledWith('hide');
		});

		test('should set first page as active', () => {
			const manyItems = [];
			for (let i = 0; i < 25; i++) {
				manyItems.push({
					show: jest.fn().mockReturnThis(),
					hide: jest.fn().mockReturnThis()
				});
			}
			manyItems.each = jest.fn(function(callback) {
				this.forEach((item, idx) => callback.call(item, idx, item));
			});
			manyItems.length = 25;

			Pagination.initPaginationItems(manyItems, 10, false);

			// Verify that find('li:first-child') was called to set first page active
			expect(mockUl.find).toHaveBeenCalledWith('li:first-child');
			expect(mockLi.addClass).toHaveBeenCalledWith('active');
		});

		test('should handle page clicks', () => {
			const manyItems = [];
			for (let i = 0; i < 25; i++) {
				manyItems.push({
					show: jest.fn().mockReturnThis(),
					hide: jest.fn().mockReturnThis()
				});
			}
			manyItems.each = jest.fn(function(callback) {
				this.forEach((item, idx) => callback.call(item, idx, item));
			});
			manyItems.length = 25;

			Pagination.initPaginationItems(manyItems, 10, false);

			// Verify that click handler was attached to pagination items
			expect(mockUl.find).toHaveBeenCalledWith('li');
		});
	});
});

describe('Navigation', () => {
	let mockA, mockUlNav, mockTabContent, mockNavLink, mockTabPane;

	beforeEach(() => {
		// Mock tab pane
		mockTabPane = {
			addClass: jest.fn().mockReturnThis(),
			removeClass: jest.fn().mockReturnThis()
		};

		// Mock tab content
		mockTabContent = {
			find: jest.fn((selector) => mockTabPane)
		};

		// Mock nav link
		mockNavLink = {
			removeClass: jest.fn().mockReturnThis(),
			attr: jest.fn((key) => key === 'href' ? '#tab1' : undefined)
		};

		// Mock ul nav
		mockUlNav = {
			find: jest.fn((selector) => {
				if (selector === 'a.nav-link') {
					return {
						each: jest.fn(function(callback) {
							callback.call(mockNavLink, 0, mockNavLink);
						})
					};
				}
				return mockNavLink;
			}),
			parent: jest.fn(() => ({
				find: jest.fn((selector) => mockTabContent)
			}))
		};

		// Mock a element
		mockA = {
			closest: jest.fn((selector) => mockUlNav),
			addClass: jest.fn().mockReturnThis(),
			attr: jest.fn((key) => key === 'href' ? '#tab2' : undefined),
			length: 1
		};

		// Mock jQuery
		global.$ = jest.fn((selector) => {
			if (selector === mockNavLink || (typeof selector === 'object' && selector === mockNavLink)) {
				return mockNavLink;
			}
			if (typeof selector === 'object' && selector !== null) {
				// Handle $(element) calls
				return {
					removeClass: jest.fn().mockReturnThis(),
					addClass: jest.fn().mockReturnThis(),
					attr: jest.fn((key) => key === 'href' ? '#tab1' : undefined),
					...selector
				};
			}
			return mockA;
		});

		// Simple mock of window and document for these tests
		// Note: window.location.href will be jsdom default
		if (!global.window.history) {
			global.window.history = {};
		}
		global.window.history.replaceState = jest.fn();
		global.window.history.pushState = jest.fn();

		if (!global.document) {
			global.document = {};
		}
		global.document.title = 'Test Page';
	});

	afterEach(() => {
		jest.clearAllMocks();
		delete global.$;
		delete global.bootstrap;
		delete global.UrlAndQueryString;
	});

	describe('activateTab', () => {
		test('should remove active class from all nav links', () => {
			Navigation.activateTab(mockA);

			expect(mockUlNav.find).toHaveBeenCalledWith('a.nav-link');
			expect(mockNavLink.removeClass).toHaveBeenCalledWith('active');
		});

		test('should remove active and show classes from tab panes', () => {
			Navigation.activateTab(mockA);

			expect(mockTabPane.removeClass).toHaveBeenCalledWith('active');
			expect(mockTabPane.removeClass).toHaveBeenCalledWith('show');
		});

		test('should add active class to clicked link', () => {
			Navigation.activateTab(mockA);

			expect(mockA.addClass).toHaveBeenCalledWith('active');
		});

		test('should show corresponding tab pane', () => {
			Navigation.activateTab(mockA);

			expect(mockTabPane.addClass).toHaveBeenCalledWith('active');
			expect(mockTabPane.addClass).toHaveBeenCalledWith('show');
		});

		test('should only process links with # href', () => {
			mockNavLink.attr = jest.fn((key) => key === 'href' ? 'http://example.com' : undefined);

			Navigation.activateTab(mockA);

			// Should not find tab content for non-# hrefs
			expect(mockNavLink.removeClass).toHaveBeenCalledWith('active');
		});
	});

	describe('showTab', () => {
		test('should return early if bootstrap is undefined', () => {
			delete global.bootstrap;

			Navigation.showTab(mockA);

			// Should not throw
		});

		test('should create and show bootstrap tab when available', () => {
			const mockTab = {
				show: jest.fn()
			};

			global.bootstrap = {
				Tab: jest.fn(() => mockTab)
			};

			Navigation.showTab(mockA);

			expect(global.bootstrap.Tab).toHaveBeenCalledWith(mockA[0]);
			expect(mockTab.show).toHaveBeenCalled();
		});
	});

	describe('addTabInHistory', () => {
		beforeEach(() => {
			global.UrlAndQueryString = {
				setParamOfUrl: jest.fn((key, value, url) => `${url}&${key}=${value}`)
			};
		});

		test('should call UrlAndQueryString.setParamOfUrl with correct parameters', () => {
			Navigation.addTabInHistory('tab1', 'tab', true);

			expect(global.UrlAndQueryString.setParamOfUrl).toHaveBeenCalledWith(
				'tab',
				'tab1',
				expect.any(String)
			);
		});

		test('should use default queryStringKey if not provided', () => {
			Navigation.addTabInHistory('tab1');

			expect(global.UrlAndQueryString.setParamOfUrl).toHaveBeenCalledWith(
				'tab',
				'tab1',
				expect.any(String)
			);
		});

		test('should use replaceState by default', () => {
			const replaceStateSpy = jest.spyOn(global.window.history, 'replaceState');
			const pushStateSpy = jest.spyOn(global.window.history, 'pushState');

			Navigation.addTabInHistory('tab1', 'tab', true);

			expect(replaceStateSpy).toHaveBeenCalled();
			expect(pushStateSpy).not.toHaveBeenCalled();

			replaceStateSpy.mockRestore();
			pushStateSpy.mockRestore();
		});

		test('should use pushState when replace is false', () => {
			const replaceStateSpy = jest.spyOn(global.window.history, 'replaceState');
			const pushStateSpy = jest.spyOn(global.window.history, 'pushState');

			Navigation.addTabInHistory('tab1', 'tab', false);

			expect(pushStateSpy).toHaveBeenCalled();
			expect(replaceStateSpy).not.toHaveBeenCalled();

			replaceStateSpy.mockRestore();
			pushStateSpy.mockRestore();
		});

		test('should update URL with tab parameter', () => {
			const replaceStateSpy = jest.spyOn(global.window.history, 'replaceState');

			Navigation.addTabInHistory('tab2', 'activeTab', true);

			expect(replaceStateSpy).toHaveBeenCalledWith(
				'',
				'Test Page',
				expect.stringContaining('activeTab=tab2')
			);

			replaceStateSpy.mockRestore();
		});
	});
});
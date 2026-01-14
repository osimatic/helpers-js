const { SortableList } = require('../sortable_list');

describe('SortableList', () => {
	let mockSortableList;
	let mockItems;
	let eventHandlers;
	let itemEventHandlers;

	beforeEach(() => {
		// Reset event handlers storage
		eventHandlers = {
			dragover: null,
			dragenter: null
		};

		itemEventHandlers = [];

		// Mock items (draggable elements)
		mockItems = [
			{
				offsetTop: 0,
				offsetHeight: 50,
				classList: {
					add: jest.fn(),
					remove: jest.fn()
				}
			},
			{
				offsetTop: 50,
				offsetHeight: 50,
				classList: {
					add: jest.fn(),
					remove: jest.fn()
				}
			},
			{
				offsetTop: 100,
				offsetHeight: 50,
				classList: {
					add: jest.fn(),
					remove: jest.fn()
				}
			}
		];

		// Create jQuery-like objects for each item
		const jQueryItems = mockItems.map((item, index) => {
			const handlers = {
				dragstart: null,
				dragend: null
			};
			itemEventHandlers[index] = handlers;

			return {
				on: jest.fn((event, handler) => {
					handlers[event] = handler;
					return jQueryItems[index];
				}),
				addClass: jest.fn(function(className) {
					item.classList.add(className);
					return this;
				}),
				removeClass: jest.fn(function(className) {
					item.classList.remove(className);
					return this;
				}),
				get: jest.fn(() => [item]),
				_rawElement: item
			};
		});

		// Mock sortable list container
		const mockContainer = {
			insertBefore: jest.fn()
		};

		mockSortableList = {
			find: jest.fn((selector) => {
				if (selector === '[draggable="true"]') {
					return {
						get: jest.fn(() => mockItems)
					};
				}
				if (selector === '.dragging') {
					// Find the item with dragging class
					const draggingIndex = mockItems.findIndex(item =>
						item.classList.add.mock.calls.some(call => call[0] === 'dragging')
					);
					if (draggingIndex !== -1) {
						return jQueryItems[draggingIndex];
					}
					return { get: jest.fn(() => [null]) };
				}
				if (selector === '[draggable="true"]:not(.dragging)') {
					// Return items without dragging class
					const nonDraggingItems = mockItems.filter((item, index) => {
						const hasBeenMarkedDragging = item.classList.add.mock.calls.some(
							call => call[0] === 'dragging'
						);
						const hasBeenUnmarkedDragging = item.classList.remove.mock.calls.some(
							call => call[0] === 'dragging'
						);
						// If it was marked dragging and not unmarked, it's dragging
						return !(hasBeenMarkedDragging && !hasBeenUnmarkedDragging);
					});
					return {
						get: jest.fn(() => nonDraggingItems)
					};
				}
				return { get: jest.fn(() => []) };
			}),
			on: jest.fn((event, handler) => {
				eventHandlers[event] = handler;
				return mockSortableList;
			}),
			get: jest.fn(() => [mockContainer])
		};

		// Mock jQuery $ function
		global.$ = jest.fn((selector) => {
			// If selector is an element, wrap it
			if (selector && typeof selector === 'object' && selector._rawElement) {
				return selector;
			}
			const itemIndex = mockItems.indexOf(selector);
			if (itemIndex !== -1) {
				return jQueryItems[itemIndex];
			}
			return {
				on: jest.fn().mockReturnThis(),
				addClass: jest.fn().mockReturnThis(),
				removeClass: jest.fn().mockReturnThis(),
				get: jest.fn(() => [selector])
			};
		});

		// Mock setTimeout
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('init', () => {
		test('should initialize sortable list with draggable items', () => {
			SortableList.init(mockSortableList);

			expect(mockSortableList.find).toHaveBeenCalledWith('[draggable="true"]');
		});

		test('should add dragstart event listeners to all items', () => {
			SortableList.init(mockSortableList);

			// Verify $ was called for each item to wrap them (twice per item: dragstart + dragend)
			expect(global.$).toHaveBeenCalledTimes(mockItems.length * 2);
			mockItems.forEach(item => {
				expect(global.$).toHaveBeenCalledWith(item);
			});
		});

		test('should add dragend event listeners to all items', () => {
			SortableList.init(mockSortableList);

			itemEventHandlers.forEach(handlers => {
				expect(handlers.dragend).toBeDefined();
			});
		});

		test('should add dragover event listener to sortable list', () => {
			SortableList.init(mockSortableList);

			expect(mockSortableList.on).toHaveBeenCalledWith('dragover', expect.any(Function));
			expect(eventHandlers.dragover).toBeDefined();
		});

		test('should add dragenter event listener to sortable list', () => {
			SortableList.init(mockSortableList);

			expect(mockSortableList.on).toHaveBeenCalledWith('dragenter', expect.any(Function));
			expect(eventHandlers.dragenter).toBeDefined();
		});

		test('should initialize with custom clientYOffset', () => {
			SortableList.init(mockSortableList, 100);

			// Should not throw error
			expect(mockSortableList.find).toHaveBeenCalled();
		});

		test('should initialize with default clientYOffset of 0', () => {
			SortableList.init(mockSortableList);

			// Should not throw error
			expect(mockSortableList.find).toHaveBeenCalled();
		});
	});

	describe('drag and drop functionality', () => {
		beforeEach(() => {
			SortableList.init(mockSortableList);
		});

		test('should add dragging class on dragstart after timeout', () => {
			const handlers = itemEventHandlers[0];

			handlers.dragstart();

			// Initially no class added
			expect(mockItems[0].classList.add).not.toHaveBeenCalled();

			// After timeout
			jest.runAllTimers();

			expect(global.$).toHaveBeenCalledWith(mockItems[0]);
			expect(mockItems[0].classList.add).toHaveBeenCalledWith('dragging');
		});

		test('should remove dragging class on dragend', () => {
			const handlers = itemEventHandlers[1];

			handlers.dragend();

			expect(global.$).toHaveBeenCalledWith(mockItems[1]);
			expect(mockItems[1].classList.remove).toHaveBeenCalledWith('dragging');
		});

		test('should add and remove dragging class in sequence', () => {
			const handlers = itemEventHandlers[2];

			// Start dragging
			handlers.dragstart();
			jest.runAllTimers();
			expect(mockItems[2].classList.add).toHaveBeenCalledWith('dragging');

			// Stop dragging
			handlers.dragend();
			expect(mockItems[2].classList.remove).toHaveBeenCalledWith('dragging');
		});

		test('should handle multiple items being dragged in sequence', () => {
			// Drag first item
			itemEventHandlers[0].dragstart();
			jest.runAllTimers();
			expect(mockItems[0].classList.add).toHaveBeenCalledWith('dragging');
			itemEventHandlers[0].dragend();
			expect(mockItems[0].classList.remove).toHaveBeenCalledWith('dragging');

			// Drag second item
			itemEventHandlers[1].dragstart();
			jest.runAllTimers();
			expect(mockItems[1].classList.add).toHaveBeenCalledWith('dragging');
			itemEventHandlers[1].dragend();
			expect(mockItems[1].classList.remove).toHaveBeenCalledWith('dragging');
		});
	});

	describe('dragenter event', () => {
		beforeEach(() => {
			SortableList.init(mockSortableList);
		});

		test('should prevent default on dragenter', () => {
			const mockEvent = {
				preventDefault: jest.fn()
			};

			eventHandlers.dragenter(mockEvent);

			expect(mockEvent.preventDefault).toHaveBeenCalled();
		});

		test('should handle dragenter without error', () => {
			const mockEvent = {
				preventDefault: jest.fn()
			};

			expect(() => {
				eventHandlers.dragenter(mockEvent);
			}).not.toThrow();
		});
	});

	describe('dragover and item reordering', () => {
		let mockContainer;
		let draggingItem;

		beforeEach(() => {
			SortableList.init(mockSortableList);
			mockContainer = mockSortableList.get()[0];

			// Setup: mark first item as dragging
			itemEventHandlers[0].dragstart();
			jest.runAllTimers();

			draggingItem = mockItems[0];
		});

		test('should prevent default on dragover', () => {
			const mockEvent = {
				preventDefault: jest.fn(),
				clientY: 75
			};

			eventHandlers.dragover(mockEvent);

			expect(mockEvent.preventDefault).toHaveBeenCalled();
		});

		test('should find dragging item on dragover', () => {
			const mockEvent = {
				preventDefault: jest.fn(),
				clientY: 75
			};

			mockSortableList.find.mockClear();
			eventHandlers.dragover(mockEvent);

			expect(mockSortableList.find).toHaveBeenCalledWith('.dragging');
		});

		test('should find siblings (non-dragging items) on dragover', () => {
			const mockEvent = {
				preventDefault: jest.fn(),
				clientY: 75
			};

			mockSortableList.find.mockClear();
			eventHandlers.dragover(mockEvent);

			expect(mockSortableList.find).toHaveBeenCalledWith('[draggable="true"]:not(.dragging)');
		});

		test('should insert item before next sibling when dragging down', () => {
			// Drag first item (offsetTop 0) to position between second and third items
			const mockEvent = {
				preventDefault: jest.fn(),
				clientY: 75 // Between item 2 (50-100) and item 3 (100-150)
			};

			const findSpy = jest.spyOn(mockSortableList, 'find');

			// Mock the return for .dragging
			findSpy.mockImplementation((selector) => {
				if (selector === '.dragging') {
					return {
						get: jest.fn(() => [draggingItem])
					};
				}
				if (selector === '[draggable="true"]:not(.dragging)') {
					// Return items 2 and 3 (not dragging)
					return {
						get: jest.fn(() => [mockItems[1], mockItems[2]])
					};
				}
				return { get: jest.fn(() => mockItems) };
			});

			eventHandlers.dragover(mockEvent);

			expect(mockContainer.insertBefore).toHaveBeenCalledWith(
				draggingItem,
				mockItems[1] // Should insert before item 2
			);
		});

		test('should calculate position with clientYOffset', () => {
			SortableList.init(mockSortableList, 20);

			// Mark first item as dragging again
			itemEventHandlers[0].dragstart();
			jest.runAllTimers();

			const mockEvent = {
				preventDefault: jest.fn(),
				clientY: 55 // With offset of 20, effective position is 75
			};

			const findSpy = jest.spyOn(mockSortableList, 'find');
			findSpy.mockImplementation((selector) => {
				if (selector === '.dragging') {
					return { get: jest.fn(() => [draggingItem]) };
				}
				if (selector === '[draggable="true"]:not(.dragging)') {
					return { get: jest.fn(() => [mockItems[1], mockItems[2]]) };
				}
				return { get: jest.fn(() => mockItems) };
			});

			eventHandlers.dragover(mockEvent);

			expect(mockContainer.insertBefore).toHaveBeenCalled();
		});

		test('should handle dragover at top of list', () => {
			const mockEvent = {
				preventDefault: jest.fn(),
				clientY: 10 // Very top
			};

			const findSpy = jest.spyOn(mockSortableList, 'find');
			findSpy.mockImplementation((selector) => {
				if (selector === '.dragging') {
					return { get: jest.fn(() => [draggingItem]) };
				}
				if (selector === '[draggable="true"]:not(.dragging)') {
					return { get: jest.fn(() => [mockItems[1], mockItems[2]]) };
				}
				return { get: jest.fn(() => mockItems) };
			});

			eventHandlers.dragover(mockEvent);

			// Should insert before the first sibling
			expect(mockContainer.insertBefore).toHaveBeenCalledWith(
				draggingItem,
				mockItems[1]
			);
		});

		test('should handle dragover at bottom of list', () => {
			const mockEvent = {
				preventDefault: jest.fn(),
				clientY: 200 // Past all items
			};

			const findSpy = jest.spyOn(mockSortableList, 'find');
			findSpy.mockImplementation((selector) => {
				if (selector === '.dragging') {
					return { get: jest.fn(() => [draggingItem]) };
				}
				if (selector === '[draggable="true"]:not(.dragging)') {
					return { get: jest.fn(() => [mockItems[1], mockItems[2]]) };
				}
				return { get: jest.fn(() => mockItems) };
			});

			eventHandlers.dragover(mockEvent);

			// When no sibling found, nextSibling is undefined
			expect(mockContainer.insertBefore).toHaveBeenCalledWith(
				draggingItem,
				undefined
			);
		});

		test('should insert at exact midpoint of sibling', () => {
			// Test at exact midpoint: item at offsetTop 50, height 50, midpoint is 75
			const mockEvent = {
				preventDefault: jest.fn(),
				clientY: 75
			};

			const findSpy = jest.spyOn(mockSortableList, 'find');
			findSpy.mockImplementation((selector) => {
				if (selector === '.dragging') {
					return { get: jest.fn(() => [draggingItem]) };
				}
				if (selector === '[draggable="true"]:not(.dragging)') {
					return { get: jest.fn(() => [mockItems[1], mockItems[2]]) };
				}
				return { get: jest.fn(() => mockItems) };
			});

			eventHandlers.dragover(mockEvent);

			expect(mockContainer.insertBefore).toHaveBeenCalledWith(
				draggingItem,
				mockItems[1]
			);
		});
	});

	describe('edge cases', () => {
		test('should handle empty draggable items list', () => {
			mockSortableList.find = jest.fn((selector) => {
				if (selector === '[draggable="true"]') {
					return { get: jest.fn(() => []) };
				}
				return { get: jest.fn(() => []) };
			});

			expect(() => {
				SortableList.init(mockSortableList);
			}).not.toThrow();
		});

		test('should handle sortable list with single item', () => {
			mockSortableList.find = jest.fn((selector) => {
				if (selector === '[draggable="true"]') {
					return { get: jest.fn(() => [mockItems[0]]) };
				}
				if (selector === '.dragging') {
					return { get: jest.fn(() => [mockItems[0]]) };
				}
				if (selector === '[draggable="true"]:not(.dragging)') {
					return { get: jest.fn(() => []) };
				}
				return { get: jest.fn(() => []) };
			});

			SortableList.init(mockSortableList);

			// Should initialize without error
			expect(mockSortableList.on).toHaveBeenCalledWith('dragover', expect.any(Function));
		});

		test('should handle negative clientYOffset', () => {
			SortableList.init(mockSortableList, -50);

			itemEventHandlers[0].dragstart();
			jest.runAllTimers();

			const mockEvent = {
				preventDefault: jest.fn(),
				clientY: 100
			};

			const findSpy = jest.spyOn(mockSortableList, 'find');
			findSpy.mockImplementation((selector) => {
				if (selector === '.dragging') {
					return { get: jest.fn(() => [mockItems[0]]) };
				}
				if (selector === '[draggable="true"]:not(.dragging)') {
					return { get: jest.fn(() => [mockItems[1], mockItems[2]]) };
				}
				return { get: jest.fn(() => mockItems) };
			});

			// Should work with negative offset: 100 + (-50) = 50
			eventHandlers.dragover(mockEvent);

			expect(mockEvent.preventDefault).toHaveBeenCalled();
		});

		test('should handle very large clientYOffset', () => {
			SortableList.init(mockSortableList, 10000);

			expect(mockSortableList.on).toHaveBeenCalled();
		});

		test('should handle zero height items', () => {
			mockItems[1].offsetHeight = 0;

			SortableList.init(mockSortableList);

			itemEventHandlers[0].dragstart();
			jest.runAllTimers();

			const mockEvent = {
				preventDefault: jest.fn(),
				clientY: 50
			};

			const findSpy = jest.spyOn(mockSortableList, 'find');
			findSpy.mockImplementation((selector) => {
				if (selector === '.dragging') {
					return { get: jest.fn(() => [mockItems[0]]) };
				}
				if (selector === '[draggable="true"]:not(.dragging)') {
					return { get: jest.fn(() => [mockItems[1], mockItems[2]]) };
				}
				return { get: jest.fn(() => mockItems) };
			});

			expect(() => {
				eventHandlers.dragover(mockEvent);
			}).not.toThrow();
		});

		test('should handle items with varying heights', () => {
			mockItems[0].offsetHeight = 30;
			mockItems[1].offsetHeight = 70;
			mockItems[2].offsetHeight = 100;

			SortableList.init(mockSortableList);

			itemEventHandlers[0].dragstart();
			jest.runAllTimers();

			const mockEvent = {
				preventDefault: jest.fn(),
				clientY: 50
			};

			const findSpy = jest.spyOn(mockSortableList, 'find');
			findSpy.mockImplementation((selector) => {
				if (selector === '.dragging') {
					return { get: jest.fn(() => [mockItems[0]]) };
				}
				if (selector === '[draggable="true"]:not(.dragging)') {
					return { get: jest.fn(() => [mockItems[1], mockItems[2]]) };
				}
				return { get: jest.fn(() => mockItems) };
			});

			expect(() => {
				eventHandlers.dragover(mockEvent);
			}).not.toThrow();
		});
	});
});
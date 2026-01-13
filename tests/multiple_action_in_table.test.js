/**
 * @jest-environment jsdom
 */
const { MultipleActionInTable, MultipleActionInDivList } = require('../multiple_action_in_table');

describe('MultipleActionInTable', () => {
	let mockTable;

	beforeEach(() => {
		// Mock jQuery
		global.$ = jest.fn((selector) => {
			if (typeof selector === 'string') {
				if (selector.includes('<th') || selector.includes('<td') || selector.includes('<p>') || selector.includes('<img') || selector.includes('<span') || selector.includes('<div')) {
					// Creating new element
					return {
						addClass: jest.fn().mockReturnThis(),
						removeClass: jest.fn().mockReturnThis(),
						hasClass: jest.fn(() => false),
						find: jest.fn(() => ({ length: 0 })),
						prepend: jest.fn().mockReturnThis(),
						append: jest.fn().mockReturnThis(),
						after: jest.fn().mockReturnThis(),
						remove: jest.fn().mockReturnThis()
					};
				}
				return {
					find: jest.fn(() => ({ length: 0 })),
					hasClass: jest.fn(() => false),
					addClass: jest.fn().mockReturnThis(),
					removeClass: jest.fn().mockReturnThis()
				};
			}
			// Handle element wrapping
			return {
				find: jest.fn(() => ({ length: 0 })),
				hasClass: jest.fn(() => false),
				closest: jest.fn(() => mockTable),
				addClass: jest.fn().mockReturnThis(),
				removeClass: jest.fn().mockReturnThis(),
				data: jest.fn()
			};
		});

		// Mock ROOT_PATH and DOSSIER_IMAGES
		global.ROOT_PATH = '/';
		global.DOSSIER_IMAGES = 'images/';
	});

	afterEach(() => {
		jest.clearAllMocks();
		delete global.$;
		delete global.ROOT_PATH;
		delete global.DOSSIER_IMAGES;
	});

	describe('getDivBtn', () => {
		test('should return button div when found as next sibling', () => {
			const mockButtonDiv = {
				hasClass: jest.fn((className) => className === 'action_multiple_buttons')
			};
			mockTable = {
				parent: jest.fn(() => ({
					next: jest.fn(() => mockButtonDiv)
				}))
			};

			const result = MultipleActionInTable.getDivBtn(mockTable);

			expect(result).toBe(mockButtonDiv);
			expect(mockButtonDiv.hasClass).toHaveBeenCalledWith('action_multiple_buttons');
		});

		test('should return button div when found in nested structure', () => {
			const mockButtonDiv = {
				hasClass: jest.fn((className) => className === 'action_multiple_buttons')
			};
			const notButtonDiv = {
				hasClass: jest.fn(() => false)
			};
			mockTable = {
				parent: jest.fn(() => ({
					next: jest.fn(() => notButtonDiv),
					parent: jest.fn(() => ({
						parent: jest.fn(() => ({
							parent: jest.fn(() => ({
								next: jest.fn(() => mockButtonDiv)
							}))
						}))
					}))
				}))
			};

			const result = MultipleActionInTable.getDivBtn(mockTable);

			expect(result).toBe(mockButtonDiv);
		});

		test('should return null when button div not found', () => {
			const notButtonDiv = {
				hasClass: jest.fn(() => false)
			};
			mockTable = {
				parent: jest.fn(() => ({
					next: jest.fn(() => notButtonDiv),
					parent: jest.fn(() => ({
						parent: jest.fn(() => ({
							parent: jest.fn(() => ({
								next: jest.fn(() => notButtonDiv)
							}))
						}))
					}))
				}))
			};

			const result = MultipleActionInTable.getDivBtn(mockTable);

			expect(result).toBeNull();
		});
	});

	describe('updateCheckbox', () => {
		test('should hide select-all checkbox when no checkboxes exist', () => {
			const mockCheckboxSelectAll = {
				addClass: jest.fn(),
				removeClass: jest.fn()
			};
			const mockButtonDiv = {
				hasClass: jest.fn(() => false)
			};
			mockTable = {
				find: jest.fn((selector) => {
					if (selector === 'input.action_multiple_checkbox') {
						return { length: 0 };
					}
					if (selector === 'input.action_multiple_checkbox:checked') {
						return { length: 0 };
					}
					if (selector === 'thead tr th input.action_multiple_check_all') {
						return mockCheckboxSelectAll;
					}
					return { length: 0 };
				}),
				parent: jest.fn(() => ({
					next: jest.fn(() => mockButtonDiv),
					parent: jest.fn(() => ({
						parent: jest.fn(() => ({
							parent: jest.fn(() => ({
								next: jest.fn(() => mockButtonDiv)
							}))
						}))
					}))
				}))
			};

			MultipleActionInTable.updateCheckbox(mockTable);

			expect(mockCheckboxSelectAll.addClass).toHaveBeenCalledWith('hide');
		});

		test('should check select-all checkbox when all checkboxes are checked', () => {
			const mockCheckboxSelectAll = {
				addClass: jest.fn(),
				removeClass: jest.fn(),
				prop: jest.fn()
			};
			const mockButtonDiv = {
				hasClass: jest.fn(() => false)
			};
			mockTable = {
				find: jest.fn((selector) => {
					if (selector === 'input.action_multiple_checkbox') {
						return { length: 3 };
					}
					if (selector === 'input.action_multiple_checkbox:checked') {
						return { length: 3 };
					}
					if (selector === 'thead tr th input.action_multiple_check_all') {
						return mockCheckboxSelectAll;
					}
					return { length: 0 };
				}),
				parent: jest.fn(() => ({
					next: jest.fn(() => mockButtonDiv),
					parent: jest.fn(() => ({
						parent: jest.fn(() => ({
							parent: jest.fn(() => ({
								next: jest.fn(() => mockButtonDiv)
							}))
						}))
					}))
				}))
			};

			MultipleActionInTable.updateCheckbox(mockTable);

			expect(mockCheckboxSelectAll.removeClass).toHaveBeenCalledWith('hide');
			expect(mockCheckboxSelectAll.prop).toHaveBeenCalledWith('checked', true);
		});

		test('should uncheck select-all checkbox when not all checkboxes are checked', () => {
			const mockCheckboxSelectAll = {
				addClass: jest.fn(),
				removeClass: jest.fn(),
				prop: jest.fn()
			};
			const mockButtonDiv = {
				hasClass: jest.fn(() => false)
			};
			mockTable = {
				find: jest.fn((selector) => {
					if (selector === 'input.action_multiple_checkbox') {
						return { length: 5 };
					}
					if (selector === 'input.action_multiple_checkbox:checked') {
						return { length: 2 };
					}
					if (selector === 'thead tr th input.action_multiple_check_all') {
						return mockCheckboxSelectAll;
					}
					return { length: 0 };
				}),
				parent: jest.fn(() => ({
					next: jest.fn(() => mockButtonDiv),
					parent: jest.fn(() => ({
						parent: jest.fn(() => ({
							parent: jest.fn(() => ({
								next: jest.fn(() => mockButtonDiv)
							}))
						}))
					}))
				}))
			};

			MultipleActionInTable.updateCheckbox(mockTable);

			expect(mockCheckboxSelectAll.removeClass).toHaveBeenCalledWith('hide');
			expect(mockCheckboxSelectAll.prop).toHaveBeenCalledWith('checked', false);
		});
	});

	describe('showButtonsAction', () => {
		test('should return early when button div is null', () => {
			mockTable = {
				parent: jest.fn(() => ({
					next: jest.fn(() => ({ hasClass: jest.fn(() => false) })),
					parent: jest.fn(() => ({
						parent: jest.fn(() => ({
							parent: jest.fn(() => ({
								next: jest.fn(() => ({ hasClass: jest.fn(() => false) }))
							}))
						}))
					}))
				})),
				find: jest.fn(() => ({ length: 0 }))
			};

			expect(() => {
				MultipleActionInTable.showButtonsAction(mockTable);
			}).not.toThrow();
		});

		test('should show button div when items are checked', () => {
			const mockButtonDiv = {
				hasClass: jest.fn(() => true),
				is: jest.fn((selector) => selector === ':hidden'),
				removeClass: jest.fn(),
				addClass: jest.fn(),
				find: jest.fn(() => ({
					length: 1,
					remove: jest.fn(),
					after: jest.fn()
				}))
			};
			mockTable = {
				parent: jest.fn(() => ({
					next: jest.fn(() => mockButtonDiv)
				})),
				find: jest.fn((selector) => {
					if (selector === 'input.action_multiple_checkbox:checked') {
						return { length: 2 };
					}
					return { length: 0 };
				}),
				is: jest.fn(() => false)
			};

			MultipleActionInTable.showButtonsAction(mockTable);

			expect(mockButtonDiv.removeClass).toHaveBeenCalledWith('hide');
		});

		test('should hide button div when no items are checked', () => {
			const mockButtonDiv = {
				hasClass: jest.fn(() => true),
				is: jest.fn((selector) => selector === ':visible'),
				removeClass: jest.fn(),
				addClass: jest.fn(),
				find: jest.fn((selector) => {
					if (selector === 'span.no_button') {
						return { remove: jest.fn() };
					}
					if (selector === 'button:visible, a:visible') {
						return { length: 0 };
					}
					if (selector === 'img') {
						return { after: jest.fn() };
					}
					return {
						length: 0,
						remove: jest.fn()
					};
				})
			};
			mockTable = {
				parent: jest.fn(() => ({
					next: jest.fn(() => mockButtonDiv)
				})),
				find: jest.fn(() => ({ length: 0 })),
				is: jest.fn(() => false)
			};

			MultipleActionInTable.showButtonsAction(mockTable);

			expect(mockButtonDiv.addClass).toHaveBeenCalledWith('hide');
		});
	});
});

describe('MultipleActionInDivList', () => {
	let mockContentDiv;

	beforeEach(() => {
		// Mock jQuery
		global.$ = jest.fn((selector) => {
			if (typeof selector === 'string' && (selector.includes('<') || selector.includes('img'))) {
				return {
					addClass: jest.fn().mockReturnThis(),
					removeClass: jest.fn().mockReturnThis(),
					prepend: jest.fn().mockReturnThis(),
					append: jest.fn().mockReturnThis()
				};
			}
			return {
				find: jest.fn(() => ({ length: 0 })),
				hasClass: jest.fn(() => false)
			};
		});

		global.ROOT_PATH = '/';
		global.DOSSIER_IMAGES = 'images/';
	});

	afterEach(() => {
		jest.clearAllMocks();
		delete global.$;
		delete global.ROOT_PATH;
		delete global.DOSSIER_IMAGES;
	});

	describe('getButtonsDiv', () => {
		test('should return buttons div when found', () => {
			const mockButtonsDiv = {
				hasClass: jest.fn(() => true)
			};
			mockContentDiv = {
				next: jest.fn(() => mockButtonsDiv)
			};

			const result = MultipleActionInDivList.getButtonsDiv(mockContentDiv);

			expect(result).toBe(mockButtonsDiv);
			expect(mockButtonsDiv.hasClass).toHaveBeenCalledWith('action_multiple_buttons');
		});

		test('should return null when buttons div not found', () => {
			const notButtonsDiv = {
				hasClass: jest.fn(() => false)
			};
			mockContentDiv = {
				next: jest.fn(() => notButtonsDiv)
			};

			const result = MultipleActionInDivList.getButtonsDiv(mockContentDiv);

			expect(result).toBeNull();
		});
	});

	describe('updateCheckbox', () => {
		test('should hide select-all checkbox when no checkboxes exist', () => {
			const mockCheckboxSelectAll = {
				addClass: jest.fn(),
				removeClass: jest.fn()
			};
			const mockButtonsDiv = {
				hasClass: jest.fn(() => false)
			};
			mockContentDiv = {
				find: jest.fn((selector) => {
					if (selector === 'input.action_multiple_checkbox') {
						return { length: 0 };
					}
					if (selector === 'input.action_multiple_check_all') {
						return mockCheckboxSelectAll;
					}
					return { length: 0 };
				}),
				next: jest.fn(() => mockButtonsDiv)
			};

			MultipleActionInDivList.updateCheckbox(mockContentDiv);

			expect(mockCheckboxSelectAll.addClass).toHaveBeenCalledWith('hide');
		});

		test('should check select-all checkbox when all checkboxes are checked', () => {
			const mockCheckboxSelectAll = {
				addClass: jest.fn(),
				removeClass: jest.fn(),
				prop: jest.fn()
			};
			const mockButtonsDiv = {
				hasClass: jest.fn(() => false)
			};
			mockContentDiv = {
				find: jest.fn((selector) => {
					if (selector === 'input.action_multiple_checkbox') {
						return { length: 4 };
					}
					if (selector === 'input.action_multiple_checkbox:checked') {
						return { length: 4 };
					}
					if (selector === 'input.action_multiple_check_all') {
						return mockCheckboxSelectAll;
					}
					return { length: 0 };
				}),
				next: jest.fn(() => mockButtonsDiv)
			};

			MultipleActionInDivList.updateCheckbox(mockContentDiv);

			expect(mockCheckboxSelectAll.removeClass).toHaveBeenCalledWith('hide');
			expect(mockCheckboxSelectAll.prop).toHaveBeenCalledWith('checked', true);
		});

		test('should uncheck select-all checkbox when not all checkboxes are checked', () => {
			const mockCheckboxSelectAll = {
				addClass: jest.fn(),
				removeClass: jest.fn(),
				prop: jest.fn()
			};
			const mockButtonsDiv = {
				hasClass: jest.fn(() => false)
			};
			mockContentDiv = {
				find: jest.fn((selector) => {
					if (selector === 'input.action_multiple_checkbox') {
						return { length: 4 };
					}
					if (selector === 'input.action_multiple_checkbox:checked') {
						return { length: 1 };
					}
					if (selector === 'input.action_multiple_check_all') {
						return mockCheckboxSelectAll;
					}
					return { length: 0 };
				}),
				next: jest.fn(() => mockButtonsDiv)
			};

			MultipleActionInDivList.updateCheckbox(mockContentDiv);

			expect(mockCheckboxSelectAll.prop).toHaveBeenCalledWith('checked', false);
		});
	});
});
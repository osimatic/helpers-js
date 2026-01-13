/**
 * @jest-environment jsdom
 */
const { SelectAll } = require('../select_all');

describe('SelectAll', () => {
	let mockFormGroup;
	let mockTable;
	let mockDiv;

	beforeEach(() => {
		// Mock jQuery
		global.$ = jest.fn((selector) => {
			// Handle string selectors
			if (typeof selector === 'string') {
				return {
					find: jest.fn(() => ({
						length: 0,
						find: jest.fn(() => ({ length: 0 })),
						text: jest.fn(),
						prop: jest.fn(),
						off: jest.fn().mockReturnThis(),
						click: jest.fn().mockReturnThis(),
						change: jest.fn().mockReturnThis(),
						each: jest.fn(),
						get: jest.fn(() => [])
					})),
					closest: jest.fn(() => mockFormGroup || mockDiv),
					off: jest.fn().mockReturnThis(),
					click: jest.fn().mockReturnThis(),
					change: jest.fn().mockReturnThis(),
					on: jest.fn()
				};
			}

			// Handle element wrapping (when passed an element)
			if (selector && typeof selector === 'object') {
				return {
					find: jest.fn(() => ({
						length: 0,
						find: jest.fn(() => ({ length: 0 })),
						text: jest.fn(),
						prop: jest.fn(),
						off: jest.fn().mockReturnThis(),
						click: jest.fn().mockReturnThis(),
						change: jest.fn().mockReturnThis()
					})),
					closest: jest.fn(() => mockFormGroup || mockDiv),
					addClass: jest.fn().mockReturnThis(),
					removeClass: jest.fn().mockReturnThis(),
					off: jest.fn().mockReturnThis(),
					click: jest.fn().mockReturnThis(),
					on: jest.fn()
				};
			}

			return {
				find: jest.fn(() => ({ length: 0 })),
				closest: jest.fn(() => mockFormGroup)
			};
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
		delete global.$;
	});

	describe('updateFormGroup', () => {
		test('should set text to "Tout désélectionner" when all checkboxes are checked', () => {
			const mockLink = { text: jest.fn() };
			mockFormGroup = {
				find: jest.fn((selector) => {
					if (selector === 'input[type="checkbox"]:not(.check_all)') {
						return { length: 3 }; // 3 total checkboxes
					}
					if (selector === 'input[type="checkbox"]:not(.check_all):checked') {
						return { length: 3 }; // 3 checked
					}
					if (selector === 'a.check_all') {
						return mockLink;
					}
					return { length: 0 };
				})
			};

			SelectAll.updateFormGroup(mockFormGroup);

			expect(mockLink.text).toHaveBeenCalledWith('Tout désélectionner');
		});

		test('should set text to "Tout sélectionner" when not all checkboxes are checked', () => {
			const mockLink = { text: jest.fn() };
			mockFormGroup = {
				find: jest.fn((selector) => {
					if (selector === 'input[type="checkbox"]:not(.check_all)') {
						return { length: 3 }; // 3 total checkboxes
					}
					if (selector === 'input[type="checkbox"]:not(.check_all):checked') {
						return { length: 1 }; // Only 1 checked
					}
					if (selector === 'a.check_all') {
						return mockLink;
					}
					return { length: 0 };
				})
			};

			SelectAll.updateFormGroup(mockFormGroup);

			expect(mockLink.text).toHaveBeenCalledWith('Tout sélectionner');
		});

		test('should set text to "Tout sélectionner" when no checkboxes are checked', () => {
			const mockLink = { text: jest.fn() };
			mockFormGroup = {
				find: jest.fn((selector) => {
					if (selector === 'input[type="checkbox"]:not(.check_all)') {
						return { length: 3 }; // 3 total checkboxes
					}
					if (selector === 'input[type="checkbox"]:not(.check_all):checked') {
						return { length: 0 }; // None checked
					}
					if (selector === 'a.check_all') {
						return mockLink;
					}
					return { length: 0 };
				})
			};

			SelectAll.updateFormGroup(mockFormGroup);

			expect(mockLink.text).toHaveBeenCalledWith('Tout sélectionner');
		});
	});

	describe('updateTable', () => {
		test('should check the select-all checkbox when all checkboxes are checked', () => {
			const mockCheckboxSelectAll = { prop: jest.fn() };
			mockTable = {
				find: jest.fn((selector) => {
					if (selector === 'tbody input[type="checkbox"]') {
						return { length: 5 }; // 5 total checkboxes
					}
					if (selector === 'tbody input[type="checkbox"]:checked') {
						return { length: 5 }; // 5 checked
					}
					if (selector === 'thead input.check_all') {
						return mockCheckboxSelectAll;
					}
					return { length: 0 };
				})
			};

			SelectAll.updateTable(mockTable);

			expect(mockCheckboxSelectAll.prop).toHaveBeenCalledWith('checked', true);
		});

		test('should uncheck the select-all checkbox when not all checkboxes are checked', () => {
			const mockCheckboxSelectAll = { prop: jest.fn() };
			mockTable = {
				find: jest.fn((selector) => {
					if (selector === 'tbody input[type="checkbox"]') {
						return { length: 5 }; // 5 total checkboxes
					}
					if (selector === 'tbody input[type="checkbox"]:checked') {
						return { length: 3 }; // Only 3 checked
					}
					if (selector === 'thead input.check_all') {
						return mockCheckboxSelectAll;
					}
					return { length: 0 };
				})
			};

			SelectAll.updateTable(mockTable);

			expect(mockCheckboxSelectAll.prop).toHaveBeenCalledWith('checked', false);
		});

		test('should uncheck the select-all checkbox when no checkboxes are checked', () => {
			const mockCheckboxSelectAll = { prop: jest.fn() };
			mockTable = {
				find: jest.fn((selector) => {
					if (selector === 'tbody input[type="checkbox"]') {
						return { length: 5 }; // 5 total checkboxes
					}
					if (selector === 'tbody input[type="checkbox"]:checked') {
						return { length: 0 }; // None checked
					}
					if (selector === 'thead input.check_all') {
						return mockCheckboxSelectAll;
					}
					return { length: 0 };
				})
			};

			SelectAll.updateTable(mockTable);

			expect(mockCheckboxSelectAll.prop).toHaveBeenCalledWith('checked', false);
		});
	});

	describe('updateDiv', () => {
		test('should check the select-all checkbox when all checkboxes are checked', () => {
			const mockCheckboxSelectAll = { prop: jest.fn() };
			const mockCheckboxContainer = {
				find: jest.fn((selector) => {
					if (selector === 'input[type="checkbox"]:not(.check_all)') {
						return { length: 4 }; // 4 total checkboxes
					}
					if (selector === 'input[type="checkbox"]:not(.check_all):checked') {
						return { length: 4 }; // 4 checked
					}
					return { length: 0 };
				})
			};
			mockDiv = {
				find: jest.fn((selector) => {
					if (selector === 'div.checkbox, div.form-check') {
						return mockCheckboxContainer;
					}
					if (selector === 'input.check_all') {
						return mockCheckboxSelectAll;
					}
					return { length: 0 };
				})
			};

			SelectAll.updateDiv(mockDiv);

			expect(mockCheckboxSelectAll.prop).toHaveBeenCalledWith('checked', true);
		});

		test('should uncheck the select-all checkbox when not all checkboxes are checked', () => {
			const mockCheckboxSelectAll = { prop: jest.fn() };
			const mockCheckboxContainer = {
				find: jest.fn((selector) => {
					if (selector === 'input[type="checkbox"]:not(.check_all)') {
						return { length: 4 }; // 4 total checkboxes
					}
					if (selector === 'input[type="checkbox"]:not(.check_all):checked') {
						return { length: 2 }; // Only 2 checked
					}
					return { length: 0 };
				})
			};
			mockDiv = {
				find: jest.fn((selector) => {
					if (selector === 'div.checkbox, div.form-check') {
						return mockCheckboxContainer;
					}
					if (selector === 'input.check_all') {
						return mockCheckboxSelectAll;
					}
					return { length: 0 };
				})
			};

			SelectAll.updateDiv(mockDiv);

			expect(mockCheckboxSelectAll.prop).toHaveBeenCalledWith('checked', false);
		});

		test('should uncheck the select-all checkbox when no checkboxes are checked', () => {
			const mockCheckboxSelectAll = { prop: jest.fn() };
			const mockCheckboxContainer = {
				find: jest.fn((selector) => {
					if (selector === 'input[type="checkbox"]:not(.check_all)') {
						return { length: 4 }; // 4 total checkboxes
					}
					if (selector === 'input[type="checkbox"]:not(.check_all):checked') {
						return { length: 0 }; // None checked
					}
					return { length: 0 };
				})
			};
			mockDiv = {
				find: jest.fn((selector) => {
					if (selector === 'div.checkbox, div.form-check') {
						return mockCheckboxContainer;
					}
					if (selector === 'input.check_all') {
						return mockCheckboxSelectAll;
					}
					return { length: 0 };
				})
			};

			SelectAll.updateDiv(mockDiv);

			expect(mockCheckboxSelectAll.prop).toHaveBeenCalledWith('checked', false);
		});
	});

	describe('initLinkInFormGroup', () => {
		test('should initialize without errors', () => {
			const mockLinkText = { text: jest.fn() };
			const mockFormGroup = {
				find: jest.fn((selector) => {
					if (selector === 'input[type="checkbox"]:not(.check_all)') {
						return { length: 2 };
					}
					if (selector === 'input[type="checkbox"]:not(.check_all):checked') {
						return { length: 1 };
					}
					if (selector === 'a.check_all') {
						return mockLinkText;
					}
					if (selector === 'input[type="checkbox"]') {
						return {
							change: jest.fn()
						};
					}
					return { length: 0 };
				})
			};

			const mockLink = {
				off: jest.fn().mockReturnThis(),
				click: jest.fn().mockReturnThis(),
				closest: jest.fn(() => mockFormGroup)
			};

			expect(() => {
				SelectAll.initLinkInFormGroup(mockLink);
			}).not.toThrow();

			expect(mockLink.off).toHaveBeenCalledWith('click');
			expect(mockLinkText.text).toHaveBeenCalledWith('Tout sélectionner');
		});
	});

	describe('initInTable', () => {
		test('should return early when no check_all input found', () => {
			mockTable = {
				find: jest.fn(() => ({ length: 0 }))
			};

			expect(() => {
				SelectAll.initInTable(mockTable);
			}).not.toThrow();
		});
	});

	describe('initDiv', () => {
		test('should initialize without errors when no checkboxes found', () => {
			const mockContentDiv = {
				find: jest.fn(() => ({
					each: jest.fn()
				}))
			};

			expect(() => {
				SelectAll.initDiv(mockContentDiv);
			}).not.toThrow();
		});
	});
});
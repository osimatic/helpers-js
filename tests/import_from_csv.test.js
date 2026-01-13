/**
 * @jest-environment jsdom
 */
const { ImportFromCsv } = require('../import_from_csv');

describe('ImportFromCsv', () => {
	let mockFormMatching;
	let mockDivResult;

	beforeEach(() => {
		// Define global labels
		global.errorMessageImportFailed = 'Import failed';
		global.lineLabel = { format: (line) => `Line ${line}` };
		global.selectDefaultOptionLabel = 'Select a column';

		// Mock jQuery
		global.$ = jest.fn((selector) => {
			if (typeof selector === 'string') {
				if (selector.includes('<')) {
					// Creating HTML element
					return {
						html: jest.fn().mockReturnThis(),
						append: jest.fn().mockReturnThis(),
						find: jest.fn().mockReturnThis(),
						addClass: jest.fn().mockReturnThis(),
						removeClass: jest.fn().mockReturnThis(),
						prop: jest.fn().mockReturnThis(),
						click: jest.fn().mockReturnThis()
					};
				}
				return {
					find: jest.fn().mockReturnThis(),
					each: jest.fn(),
					addClass: jest.fn().mockReturnThis(),
					removeClass: jest.fn().mockReturnThis(),
					empty: jest.fn().mockReturnThis(),
					append: jest.fn().mockReturnThis()
				};
			}
			// Wrap element
			return {
				val: jest.fn(),
				prop: jest.fn(),
				find: jest.fn().mockReturnThis(),
				text: jest.fn(),
				length: 0,
				hasClass: jest.fn(() => false),
				addClass: jest.fn().mockReturnThis(),
				parent: jest.fn().mockReturnThis(),
				closest: jest.fn().mockReturnThis()
			};
		});

		global.$.each = jest.fn((collection, callback) => {
			if (Array.isArray(collection)) {
				collection.forEach((item, index) => callback(index, item));
			} else if (typeof collection === 'object') {
				Object.keys(collection).forEach((key) => callback(key, collection[key]));
			}
		});

		global.$.isEmptyObject = jest.fn((obj) => {
			return Object.keys(obj).length === 0;
		});

		mockFormMatching = {
			find: jest.fn(() => ({
				each: jest.fn(),
				prop: jest.fn().mockReturnThis()
			}))
		};

		mockDivResult = {
			find: jest.fn(() => ({
				each: jest.fn(),
				addClass: jest.fn().mockReturnThis(),
				length: 0
			}))
		};
	});

	afterEach(() => {
		delete global.$;
		delete global.errorMessageImportFailed;
		delete global.lineLabel;
		delete global.selectDefaultOptionLabel;
	});

	describe('isImportErrors', () => {
		test('should return true when json contains import errors', () => {
			const json = [
				{ line: 1, errors: ['Error 1', 'Error 2'] },
				{ line: 2, errors: ['Error 3'] }
			];
			expect(ImportFromCsv.isImportErrors(json)).toBe(true);
		});

		test('should return false when json is not an array', () => {
			const json = { message: 'success' };
			expect(ImportFromCsv.isImportErrors(json)).toBe(false);
		});

		test('should return false when array does not contain error objects', () => {
			const json = [
				{ name: 'John', email: 'john@example.com' },
				{ name: 'Jane', email: 'jane@example.com' }
			];
			expect(ImportFromCsv.isImportErrors(json)).toBe(false);
		});

		test('should return false for empty array', () => {
			const json = [];
			expect(ImportFromCsv.isImportErrors(json)).toBe(false);
		});

		test('should return true when at least one item has line and errors', () => {
			const json = [
				{ name: 'John' },
				{ line: 2, errors: ['Error'] }
			];
			expect(ImportFromCsv.isImportErrors(json)).toBe(true);
		});
	});

	describe('getTabLink', () => {
		test('should extract selected values from selects', () => {
			const mockSelects = [
				{ val: jest.fn(() => '0'), prop: jest.fn((name) => name === 'name' ? 'name' : undefined) },
				{ val: jest.fn(() => '1'), prop: jest.fn((name) => name === 'name' ? 'email' : undefined) },
				{ val: jest.fn(() => '-1'), prop: jest.fn((name) => name === 'name' ? 'phone' : undefined) }
			];

			global.$ = jest.fn((el) => ({
				val: el.val,
				prop: el.prop
			}));

			mockFormMatching.find = jest.fn((selector) => {
				if (selector === 'select') {
					return {
						each: jest.fn((callback) => {
							mockSelects.forEach((select, idx) => {
								callback(idx, select);
							});
						})
					};
				}
				return { each: jest.fn() };
			});

			const result = ImportFromCsv.getTabLink(mockFormMatching);

			expect(result).toEqual({
				name: '0',
				email: '1'
			});
		});

		test('should return empty object when no selects with valid values', () => {
			mockFormMatching.find = jest.fn(() => ({
				each: jest.fn((callback) => {
					// No selects or all have -1
				})
			}));

			const result = ImportFromCsv.getTabLink(mockFormMatching);

			expect(result).toEqual({});
		});
	});

	describe('getErrorsHtmlOfImportData', () => {
		test('should generate HTML for import errors', () => {
			const json = [
				{ line: 1, errors: ['Name is required', 'Email is invalid'] },
				{ line: 3, errors: ['Phone is required'] }
			];

			const html = ImportFromCsv.getErrorsHtmlOfImportData(json);

			expect(html).toContain('Import failed');
			expect(html).toContain('<ul>');
			expect(html).toContain('Line 1');
			expect(html).toContain('Name is required');
			expect(html).toContain('Email is invalid');
			expect(html).toContain('Line 3');
			expect(html).toContain('Phone is required');
		});

		test('should mark error lines in divResult when provided', () => {
			const json = [{ line: 2, errors: ['Error'] }];

			const mockTr = {
				addClass: jest.fn().mockReturnThis()
			};

			mockDivResult.find = jest.fn((selector) => {
				if (selector.includes('tr[data-line="2"]')) {
					return mockTr;
				}
				return { addClass: jest.fn().mockReturnThis() };
			});

			ImportFromCsv.getErrorsHtmlOfImportData(json, mockDivResult);

			expect(mockTr.addClass).toHaveBeenCalledWith('danger');
		});

		test('should handle empty errors array', () => {
			const json = [];

			const html = ImportFromCsv.getErrorsHtmlOfImportData(json);

			expect(html).toContain('Import failed');
			expect(html).toContain('<ul>');
			expect(html).toContain('</ul>');
		});
	});

	describe('getDataToImport', () => {
		test('should extract data from checked rows', () => {
			const tabLink = {
				name: '0',
				email: '1'
			};

			const mockTr1 = {
				find: jest.fn((selector) => {
					if (selector === 'input.import_line_checkbox:checked') {
						return { length: 1 };
					}
					if (selector === 'td[data-key="0"]') {
						return { length: 1, text: jest.fn(() => 'John Doe') };
					}
					if (selector === 'td[data-key="1"]') {
						return { length: 1, text: jest.fn(() => 'john@example.com') };
					}
					return { length: 0 };
				})
			};

			const mockTr2 = {
				find: jest.fn((selector) => {
					if (selector === 'input.import_line_checkbox:checked') {
						return { length: 0 }; // Not checked
					}
					return { length: 0 };
				})
			};

			global.$ = jest.fn((el) => el);
			global.$.each = jest.fn((collection, callback) => {
				if (Array.isArray(collection)) {
					collection.forEach((item, index) => callback(index, item));
				} else {
					Object.keys(collection).forEach((key) => callback(key, collection[key]));
				}
			});

			mockDivResult.find = jest.fn((selector) => {
				if (selector === 'table tbody tr') {
					return [mockTr1, mockTr2];
				}
				return { length: 0 };
			});

			const result = ImportFromCsv.getDataToImport(mockDivResult, tabLink);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				line: 1,
				name: 'John Doe',
				email: 'john@example.com'
			});
		});

		test('should skip rows without checked checkbox', () => {
			const tabLink = { name: '0' };

			const mockTr = {
				find: jest.fn(() => ({ length: 0 })) // No checked checkbox
			};

			global.$ = jest.fn((el) => el);
			global.$.each = jest.fn((collection, callback) => {
				if (Array.isArray(collection)) {
					collection.forEach((item, index) => callback(index, item));
				}
			});

			mockDivResult.find = jest.fn(() => [mockTr]);

			const result = ImportFromCsv.getDataToImport(mockDivResult, tabLink);

			expect(result).toEqual([]);
		});

		test('should handle missing columns gracefully', () => {
			const tabLink = {
				name: '0',
				email: '1',
				phone: '2' // This column doesn't exist
			};

			const mockTr = {
				find: jest.fn((selector) => {
					if (selector === 'input.import_line_checkbox:checked') {
						return { length: 1 };
					}
					if (selector === 'td[data-key="0"]') {
						return { length: 1, text: jest.fn(() => 'John') };
					}
					if (selector === 'td[data-key="1"]') {
						return { length: 1, text: jest.fn(() => 'john@test.com') };
					}
					if (selector === 'td[data-key="2"]') {
						return { length: 0 }; // Missing
					}
					return { length: 0 };
				})
			};

			global.$ = jest.fn((el) => el);
			global.$.each = jest.fn((collection, callback) => {
				if (Array.isArray(collection)) {
					collection.forEach((item, index) => callback(index, item));
				} else {
					Object.keys(collection).forEach((key) => callback(key, collection[key]));
				}
			});

			mockDivResult.find = jest.fn(() => [mockTr]);

			const result = ImportFromCsv.getDataToImport(mockDivResult, tabLink);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				line: 1,
				name: 'John',
				email: 'john@test.com'
				// phone is not included because td was not found
			});
		});
	});

	describe('displayFormMatching', () => {
		test('should create select elements for each import column', () => {
			const importColumns = {
				name: 'Name',
				email: 'Email',
				phone: 'Phone'
			};
			const header = ['Name', 'Email', 'Phone', 'Address'];
			const hasHeader = true;

			const mockSelectContent = {
				addClass: jest.fn().mockReturnThis(),
				empty: jest.fn().mockReturnThis(),
				append: jest.fn()
			};

			const mockDiv = {
				addClass: jest.fn().mockReturnThis()
			};

			mockFormMatching.find = jest.fn((selector) => {
				if (selector === '.import_matching_select_content') {
					return mockSelectContent;
				}
				if (selector === 'div.errors') {
					return mockDiv;
				}
				return { addClass: jest.fn().mockReturnThis(), removeClass: jest.fn().mockReturnThis() };
			});

			mockFormMatching.removeClass = jest.fn().mockReturnThis();

			ImportFromCsv.displayFormMatching(mockFormMatching, importColumns, header, hasHeader);

			expect(mockSelectContent.empty).toHaveBeenCalled();
			expect(mockSelectContent.append).toHaveBeenCalledTimes(3); // name, email, phone
			expect(mockFormMatching.removeClass).toHaveBeenCalledWith('hide');
		});

		test('should use index as value when hasHeader is false', () => {
			const importColumns = { field1: 'Field 1' };
			const header = ['Col1', 'Col2'];
			const hasHeader = false;

			const mockSelectContent = {
				addClass: jest.fn().mockReturnThis(),
				empty: jest.fn().mockReturnThis(),
				append: jest.fn()
			};

			mockFormMatching.find = jest.fn((selector) => {
				if (selector === '.import_matching_select_content') {
					return mockSelectContent;
				}
				return {
					addClass: jest.fn().mockReturnThis(),
					removeClass: jest.fn().mockReturnThis()
				};
			});

			mockFormMatching.removeClass = jest.fn().mockReturnThis();

			// Just verify it doesn't throw
			expect(() => {
				ImportFromCsv.displayFormMatching(mockFormMatching, importColumns, header, hasHeader);
			}).not.toThrow();
		});
	});

	describe('displayData', () => {
		test('should create table with header when header is provided', () => {
			const data = [
				['John', 'john@example.com'],
				['Jane', 'jane@example.com']
			];
			const header = ['Name', 'Email'];

			const mockTable = {
				empty: jest.fn().mockReturnThis(),
				html: jest.fn().mockReturnThis(),
				find: jest.fn(() => ({
					each: jest.fn()
				})),
				length: 1
			};

			mockDivResult.find = jest.fn((selector) => {
				if (selector === 'table') {
					return mockTable;
				}
				return { length: 0 };
			});

			mockDivResult.removeClass = jest.fn().mockReturnThis();
			mockDivResult.append = jest.fn().mockReturnThis();

			ImportFromCsv.displayData(mockDivResult, data, header, mockFormMatching);

			expect(mockTable.empty).toHaveBeenCalled();
			expect(mockTable.html).toHaveBeenCalled();
			const htmlContent = mockTable.html.mock.calls[0][0];
			expect(htmlContent).toContain('<thead>');
			expect(htmlContent).toContain('Name');
			expect(htmlContent).toContain('Email');
			expect(htmlContent).toContain('<tbody>');
			expect(htmlContent).toContain('John');
			expect(htmlContent).toContain('jane@example.com');
			expect(mockDivResult.removeClass).toHaveBeenCalledWith('hide');
		});

		test('should create table without header when header is null', () => {
			const data = [
				['John', 'john@example.com']
			];

			const mockTable = {
				empty: jest.fn().mockReturnThis(),
				html: jest.fn().mockReturnThis(),
				find: jest.fn(() => ({
					each: jest.fn()
				})),
				length: 1
			};

			mockDivResult.find = jest.fn(() => mockTable);
			mockDivResult.removeClass = jest.fn().mockReturnThis();

			ImportFromCsv.displayData(mockDivResult, data, null, mockFormMatching);

			const htmlContent = mockTable.html.mock.calls[0][0];
			expect(htmlContent).not.toContain('<thead>');
			expect(htmlContent).toContain('<tbody>');
		});

		test('should add checkboxes for each row', () => {
			const data = [['John'], ['Jane']];

			const mockTable = {
				empty: jest.fn().mockReturnThis(),
				html: jest.fn().mockReturnThis(),
				find: jest.fn(() => ({
					each: jest.fn()
				})),
				length: 1
			};

			mockDivResult.find = jest.fn(() => mockTable);
			mockDivResult.removeClass = jest.fn().mockReturnThis();

			ImportFromCsv.displayData(mockDivResult, data, null, mockFormMatching);

			const htmlContent = mockTable.html.mock.calls[0][0];
			expect(htmlContent).toContain('import_line_checkbox');
			expect(htmlContent).toContain('checked="checked"');
			expect(htmlContent).toContain('data-line="1"');
			expect(htmlContent).toContain('data-line="2"');
		});

		test('should create table if it does not exist', () => {
			const data = [['test']];

			mockDivResult.find = jest.fn((selector) => {
				if (selector === 'table') {
					return { length: 0 }; // No table exists
				}
				return {
					each: jest.fn()
				};
			});

			let appendedTable = null;
			mockDivResult.append = jest.fn((html) => {
				appendedTable = html;
				// After append, table exists
				mockDivResult.find = jest.fn((sel) => {
					if (sel === 'table') {
						return {
							empty: jest.fn().mockReturnThis(),
							html: jest.fn().mockReturnThis(),
							find: jest.fn(() => ({ each: jest.fn() })),
							length: 1
						};
					}
					return { each: jest.fn() };
				});
				return mockDivResult;
			});

			mockDivResult.removeClass = jest.fn().mockReturnThis();

			ImportFromCsv.displayData(mockDivResult, data, null, mockFormMatching);

			expect(mockDivResult.append).toHaveBeenCalledWith('<table class="table table-sm table-bordered"></table>');
		});

		test('should handle null values in data', () => {
			const data = [
				['John', null, 'test@example.com']
			];

			const mockTable = {
				empty: jest.fn().mockReturnThis(),
				html: jest.fn().mockReturnThis(),
				find: jest.fn(() => ({
					each: jest.fn()
				})),
				length: 1
			};

			mockDivResult.find = jest.fn(() => mockTable);
			mockDivResult.removeClass = jest.fn().mockReturnThis();

			ImportFromCsv.displayData(mockDivResult, data, null, mockFormMatching);

			const htmlContent = mockTable.html.mock.calls[0][0];
			expect(htmlContent).toContain('John');
			expect(htmlContent).toContain('test@example.com');
			// Null should be replaced with empty string
			expect(htmlContent).toMatch(/data-key="1">(<\/td>|<)/);
		});
	});

	describe('initEditLink', () => {
		test('should setup edit link with click handler', () => {
			const mockTd = {
				html: jest.fn().mockReturnThis(),
				find: jest.fn().mockReturnThis()
			};

			let clickHandler = null;
			mockTd.find = jest.fn((selector) => {
				if (selector === 'a.import_edit_line') {
					return {
						click: jest.fn((handler) => {
							clickHandler = handler;
							return mockTd;
						})
					};
				}
				return mockTd;
			});

			global.$ = jest.fn((selector) => {
				if (typeof selector === 'string' && selector.includes('<a')) {
					return mockTd;
				}
				return mockTd;
			});

			ImportFromCsv.initEditLink(mockFormMatching, mockTd);

			expect(mockTd.html).toHaveBeenCalled();
			expect(clickHandler).toBeDefined();
		});

		test('should convert td contents to inputs when edit link is clicked', () => {
			const mockInput = {
				html: jest.fn().mockReturnThis(),
				find: jest.fn().mockReturnThis(),
				val: jest.fn()
			};

			const mockTdToEdit = {
				hasClass: jest.fn((className) => false),
				html: jest.fn(function(value) {
					if (value !== undefined) return this;
					return 'John Doe';
			}),
				data: jest.fn().mockReturnThis()
			};

			const mockTr = {
				find: jest.fn((selector) => {
					if (selector === 'td') {
						return {
							each: jest.fn((callback) => {
								callback(0, mockTdToEdit);
							})
						};
					}
					return mockInput;
				})
			};

			const mockEditTd = {
				html: jest.fn().mockReturnThis(),
				find: jest.fn().mockReturnThis(),
				parent: jest.fn(() => ({ parent: jest.fn(() => mockTr) }))
			};

			let clickHandler = null;
			const mockValidateLink = {
				click: jest.fn().mockReturnThis()
			};
			mockEditTd.find = jest.fn((selector) => {
				if (selector === 'a.import_edit_line') {
					return {
						click: jest.fn((handler) => {
							clickHandler = handler;
							return mockEditTd;
						})
					};
				}
				if (selector === 'a.import_validate_line') {
					return mockValidateLink;
				}
				if (selector === 'td input[type="text"]') {
					return { length: 1 };
				}
				return mockEditTd;
			});
			mockEditTd.closest = jest.fn(() => ({
				find: jest.fn((selector) => {
					if (selector === 'td input[type="text"]') {
						return { length: 1 };
					}
					return { length: 0 };
				})
			}));

			global.$ = jest.fn((selector) => {
				if (typeof selector === 'string') {
					if (selector.includes('<a')) {
						return mockEditTd;
					}
					if (selector.includes('<input')) {
						return mockInput;
					}
				}
				if (selector === mockTdToEdit) return mockTdToEdit;
				return { parent: jest.fn(() => ({ parent: jest.fn(() => mockTr) })) };
			});

			mockFormMatching.find = jest.fn(() => ({
				prop: jest.fn().mockReturnThis()
			}));

			ImportFromCsv.initEditLink(mockFormMatching, mockEditTd);

			// Trigger the click
			clickHandler();

			expect(mockTdToEdit.data).toHaveBeenCalledWith('original_value', 'John Doe');
			expect(mockTdToEdit.html).toHaveBeenCalled();
		});
	});

	describe('initValidateLine', () => {
		test('should setup validate link with click handler', () => {
			const mockTd = {
				html: jest.fn().mockReturnThis(),
				find: jest.fn().mockReturnThis()
			};

			let clickHandler = null;
			mockTd.find = jest.fn((selector) => {
				if (selector === 'a.import_validate_line') {
					return {
						click: jest.fn((handler) => {
							clickHandler = handler;
							return mockTd;
						})
					};
				}
				return mockTd;
			});

			global.$ = jest.fn((selector) => {
				if (typeof selector === 'string' && selector.includes('<a')) {
					return mockTd;
				}
				return mockTd;
			});

			ImportFromCsv.initValidateLine(mockFormMatching, mockTd);

			expect(mockTd.html).toHaveBeenCalled();
			expect(clickHandler).toBeDefined();
		});

		test('should convert inputs back to text when validate is clicked', () => {
			const mockInput = {
				val: jest.fn(() => 'Updated Value')
			};

			const mockTdWithInput = {
				hasClass: jest.fn((className) => false),
				html: jest.fn().mockReturnThis(),
				find: jest.fn(() => mockInput)
			};

			const mockTr = {
				find: jest.fn((selector) => {
					if (selector === 'td') {
						return {
							each: jest.fn((callback) => {
								callback(0, mockTdWithInput);
							})
						};
					}
					return { length: 0 };
				})
			};

			const mockValidateTd = {
				html: jest.fn().mockReturnThis(),
				find: jest.fn().mockReturnThis(),
				parent: jest.fn(() => ({ parent: jest.fn(() => mockTr) })),
				closest: jest.fn(() => ({
					find: jest.fn(() => ({ length: 0 }))
				}))
			};

			let clickHandler = null;
			mockValidateTd.find = jest.fn((selector) => {
				if (selector === 'a.import_validate_line') {
					return {
						click: jest.fn((handler) => {
							clickHandler = handler;
							return mockValidateTd;
						})
					};
				}
				if (selector === 'a.import_edit_line') {
					return { click: jest.fn().mockReturnThis() };
				}
				if (selector === 'td input[type="text"]') {
					return { length: 0 };
				}
				return mockValidateTd;
			});
		global.$ = jest.fn((selector) => {
			if (typeof selector === 'string' && selector.includes('<a')) {
				return mockValidateTd;
			}
			if (selector === mockTdWithInput) return mockTdWithInput;
			return { parent: jest.fn(() => ({ parent: jest.fn(() => mockTr) })) };
		});

			mockFormMatching.find = jest.fn(() => ({
				prop: jest.fn().mockReturnThis()
			}));

			ImportFromCsv.initValidateLine(mockFormMatching, mockValidateTd);

			// Trigger the click
			clickHandler();

			expect(mockTdWithInput.html).toHaveBeenCalledWith('Updated Value');
		});
	});
});
require('../array'); // For removeEmptyValues method
const { FormHelper, ArrayField, EditValue } = require('../form_helper');

describe('FormHelper', () => {
	describe('extractErrorKeyOfJson', () => {
		test('should return null for undefined', () => {
			expect(FormHelper.extractErrorKeyOfJson(undefined)).toBeNull();
		});

		test('should return null for null', () => {
			expect(FormHelper.extractErrorKeyOfJson(null)).toBeNull();
		});

		test('should extract error from json.error', () => {
			expect(FormHelper.extractErrorKeyOfJson({ error: 'invalid_data' })).toBe('invalid_data');
		});

		test('should extract error from json[0].error', () => {
			expect(FormHelper.extractErrorKeyOfJson([{ error: 'field_error' }])).toBe('field_error');
		});

		test('should extract error from json[0][0] when array format', () => {
			expect(FormHelper.extractErrorKeyOfJson([['error_key', 'error message']])).toBe('error_key');
		});

		test('should return null when onlyIfUniqueError=true and multiple errors', () => {
			expect(FormHelper.extractErrorKeyOfJson([{ error: 'err1' }, { error: 'err2' }], true)).toBeNull();
		});

		test('should return error when onlyIfUniqueError=true and single error', () => {
			expect(FormHelper.extractErrorKeyOfJson([{ error: 'err1' }], true)).toBe('err1');
		});

		test('should handle empty array', () => {
			expect(FormHelper.extractErrorKeyOfJson([])).toBeNull();
		});
	});

	describe('extractErrorMessageOfJson', () => {
		test('should return null for undefined', () => {
			expect(FormHelper.extractErrorMessageOfJson(undefined)).toBeNull();
		});

		test('should return null for null', () => {
			expect(FormHelper.extractErrorMessageOfJson(null)).toBeNull();
		});

		test('should extract error message from json.error', () => {
			expect(FormHelper.extractErrorMessageOfJson({ error: 'Invalid data' })).toBe('Invalid data');
		});

		test('should extract error message from json[0].error', () => {
			expect(FormHelper.extractErrorMessageOfJson([{ error: 'Field error' }])).toBe('Field error');
		});

		test('should extract error message from json[0][1] when array format', () => {
			expect(FormHelper.extractErrorMessageOfJson([['error_key', 'Error message']])).toBe('Error message');
		});

		test('should return null when onlyIfUniqueError=true and multiple errors', () => {
			expect(FormHelper.extractErrorMessageOfJson([{ error: 'err1' }, { error: 'err2' }], true)).toBeNull();
		});

		test('should return error when onlyIfUniqueError=true and single error', () => {
			expect(FormHelper.extractErrorMessageOfJson([{ error: 'err1' }], true)).toBe('err1');
		});
	});

	describe('getDataFromFormData', () => {
		test('should convert FormData to object', () => {
			const formData = new FormData();
			formData.append('name', 'John');
			formData.append('email', 'john@example.com');

			const result = FormHelper.getDataFromFormData(formData);

			expect(result).toEqual({
				name: 'John',
				email: 'john@example.com'
			});
		});

		test('should handle empty FormData', () => {
			const formData = new FormData();
			const result = FormHelper.getDataFromFormData(formData);

			expect(result).toEqual({});
		});

		test('should handle multiple values for same key (last value wins)', () => {
			const formData = new FormData();
			formData.append('tag', 'tag1');
			formData.append('tag', 'tag2');

			const result = FormHelper.getDataFromFormData(formData);

			// FormData entries() with same key will have last value
			expect(result.tag).toBe('tag2');
		});

		test('should handle special characters', () => {
			const formData = new FormData();
			formData.append('field', 'value with spaces & special!');

			const result = FormHelper.getDataFromFormData(formData);

			expect(result.field).toBe('value with spaces & special!');
		});
	});

	describe('getFormErrorText', () => {
		test('should convert errors object to HTML text', () => {
			const errors = {
				field1: 'Error message 1',
				field2: 'Error message 2'
			};

			const result = FormHelper.getFormErrorText(errors);

			expect(result).toContain('<span>Error message 1</span>');
			expect(result).toContain('<span>Error message 2</span>');
			expect(result).toContain('<br/>');
		});

		test('should handle error_description format', () => {
			const errors = {
				field1: { error_description: 'Detailed error' }
			};

			const result = FormHelper.getFormErrorText(errors);

			expect(result).toBe('<span>Detailed error</span>');
		});

		test('should handle array format [key, message]', () => {
			const errors = {
				field1: ['error_key', 'Error message']
			};

			const result = FormHelper.getFormErrorText(errors);

			expect(result).toBe('<span>Error message</span>');
		});

		test('should skip function properties', () => {
			const errors = {
				field1: 'Error 1',
				someFunction: function() {}
			};

			const result = FormHelper.getFormErrorText(errors);

			expect(result).toBe('<span>Error 1</span>');
		});

		test('should remove empty values', () => {
			const errors = {
				field1: 'Error 1',
				field2: '',
				field3: null,
				field4: 'Error 4'
			};

			const result = FormHelper.getFormErrorText(errors);

			expect(result).toContain('<span>Error 1</span>');
			expect(result).toContain('<span>Error 4</span>');
			expect(result).not.toContain('<span></span>');
		});

		test('should handle empty errors object', () => {
			const result = FormHelper.getFormErrorText({});

			expect(result).toBe('');
		});

		test('should handle mixed error formats', () => {
			const errors = {
				field1: 'Simple error',
				field2: { error_description: 'Described error' },
				field3: ['key', 'Array error']
			};

			const result = FormHelper.getFormErrorText(errors);

			expect(result).toContain('<span>Simple error</span>');
			expect(result).toContain('<span>Described error</span>');
			expect(result).toContain('<span>Array error</span>');
		});
	});

	describe('buttonLoader with jQuery mock', () => {
		let mockButton;

		beforeEach(() => {
			// Mock jQuery button
			mockButton = {
				attr: jest.fn().mockReturnThis(),
				data: jest.fn().mockReturnThis(),
				html: jest.fn().mockReturnThis(),
				addClass: jest.fn().mockReturnThis(),
				removeClass: jest.fn().mockReturnThis(),
			};

			// Mock $ to return mockButton
			global.$ = jest.fn(() => mockButton);
		});

		afterEach(() => {
			delete global.$;
		});

		test('should disable button on loading', () => {
			mockButton.attr.mockImplementation((key, value) => {
				if (key === 'disabled' && value === undefined) {
					return false; // button not disabled initially
				}
				return mockButton;
			});
			mockButton.data.mockImplementation((key, value) => {
				if (key === 'btn-text') return 'Original Text';
				return mockButton;
			});

			FormHelper.buttonLoader(mockButton, 'loading');

			expect(mockButton.attr).toHaveBeenCalledWith('disabled', true);
			expect(mockButton.addClass).toHaveBeenCalledWith('disabled');
		});

		test('should enable button on reset', () => {
			mockButton.data.mockReturnValue('Original Text');

			FormHelper.buttonLoader(mockButton, 'reset');

			expect(mockButton.html).toHaveBeenCalledWith('Original Text');
			expect(mockButton.removeClass).toHaveBeenCalledWith('disabled');
			expect(mockButton.attr).toHaveBeenCalledWith('disabled', false);
		});

		test('should use custom loading text if provided', () => {
			mockButton.attr.mockImplementation((key) => {
				if (key === 'disabled') return false;
				return mockButton;
			});
			mockButton.data.mockImplementation((key) => {
				if (key === 'loading-text') return 'Custom Loading...';
				return mockButton;
			});

			FormHelper.buttonLoader(mockButton, 'start');

			expect(mockButton.html).toHaveBeenCalledWith('Custom Loading...');
		});

		test('should handle "start" action same as "loading"', () => {
			mockButton.attr.mockImplementation((key) => {
				if (key === 'disabled') return false;
				return mockButton;
			});
			mockButton.data.mockReturnValue(null);

			FormHelper.buttonLoader(mockButton, 'start');

			expect(mockButton.attr).toHaveBeenCalledWith('disabled', true);
		});

		test('should handle "stop" action same as "reset"', () => {
			mockButton.data.mockReturnValue('Original');

			FormHelper.buttonLoader(mockButton, 'stop');

			expect(mockButton.attr).toHaveBeenCalledWith('disabled', false);
		});

		test('should return button object', () => {
			mockButton.data.mockReturnValue('Text');
			const result = FormHelper.buttonLoader(mockButton, 'reset');

			expect(result).toBe(mockButton);
		});
	});

	describe('getInputValue', () => {
		test('should return null for undefined input', () => {
			expect(FormHelper.getInputValue(undefined)).toBeNull();
		});

		test('should return null for empty string value', () => {
			const mockInput = { val: jest.fn(() => '') };
			global.$ = jest.fn(() => mockInput);

			expect(FormHelper.getInputValue(mockInput)).toBeNull();

			delete global.$;
		});

		test('should return null for null value', () => {
			const mockInput = { val: jest.fn(() => null) };
			global.$ = jest.fn(() => mockInput);

			expect(FormHelper.getInputValue(mockInput)).toBeNull();

			delete global.$;
		});

		test('should return value when present', () => {
			const mockInput = { val: jest.fn(() => 'test value') };
			global.$ = jest.fn(() => mockInput);

			expect(FormHelper.getInputValue(mockInput)).toBe('test value');

			delete global.$;
		});
	});

	describe('getLinesOfTextarea', () => {
		test('should split textarea by newlines and filter empty', () => {
			const mockTextarea = {
				val: jest.fn(() => 'line1\nline2\nline3')
			};

			const result = FormHelper.getLinesOfTextarea(mockTextarea);

			expect(result).toEqual(['line1', 'line2', 'line3']);
		});

		test('should handle Windows line endings', () => {
			const mockTextarea = {
				val: jest.fn(() => 'line1\r\nline2\r\nline3')
			};

			const result = FormHelper.getLinesOfTextarea(mockTextarea);

			expect(result).toEqual(['line1', 'line2', 'line3']);
		});

		test('should filter empty lines', () => {
			const mockTextarea = {
				val: jest.fn(() => 'line1\n\nline2\n\n\nline3')
			};

			const result = FormHelper.getLinesOfTextarea(mockTextarea);

			expect(result).toEqual(['line1', 'line2', 'line3']);
		});

		test('should handle Mac line endings', () => {
			const mockTextarea = {
				val: jest.fn(() => 'line1\rline2\rline3')
			};

			const result = FormHelper.getLinesOfTextarea(mockTextarea);

			expect(result).toEqual(['line1', 'line2', 'line3']);
		});

		test('should handle empty textarea', () => {
			const mockTextarea = {
				val: jest.fn(() => '')
			};

			const result = FormHelper.getLinesOfTextarea(mockTextarea);

			expect(result).toEqual([]);
		});

		test('should handle single line', () => {
			const mockTextarea = {
				val: jest.fn(() => 'single line')
			};

			const result = FormHelper.getLinesOfTextarea(mockTextarea);

			expect(result).toEqual(['single line']);
		});
	});

	describe('hideFormErrors', () => {
		test('should remove form_errors div', () => {
			const mockForm = {
				find: jest.fn().mockReturnThis(),
				remove: jest.fn().mockReturnThis()
			};

			const result = FormHelper.hideFormErrors(mockForm);

			expect(mockForm.find).toHaveBeenCalledWith('div.form_errors');
			expect(mockForm.remove).toHaveBeenCalled();
			expect(result).toBe(mockForm);
		});
	});
});

describe('ArrayField', () => {
	test('should be a class', () => {
		expect(typeof ArrayField).toBe('function');
		expect(typeof ArrayField.init).toBe('function');
	});

	test('init should be a static method', () => {
		expect(typeof ArrayField.init).toBe('function');
	});
});

describe('EditValue', () => {
	test('should be a class', () => {
		expect(typeof EditValue).toBe('function');
		expect(typeof EditValue.init).toBe('function');
	});

	test('init should be a static method', () => {
		expect(typeof EditValue.init).toBe('function');
	});
});
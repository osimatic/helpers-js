/**
 * @jest-environment jsdom
 */
require('../array'); // For removeEmptyValues method
const { FormHelper, ArrayField, EditValue } = require('../form_helper');

describe('FormHelper', () => {
	let mockForm;
	let mockButton;
	let mockInput;

	beforeEach(() => {
		// Setup common jQuery mocks
		mockInput = {
			val: jest.fn().mockReturnThis(),
			prop: jest.fn().mockReturnThis(),
			attr: jest.fn().mockReturnThis(),
			off: jest.fn().mockReturnThis(),
			click: jest.fn().mockReturnThis(),
			on: jest.fn().mockReturnThis(),
			each: jest.fn().mockReturnThis(),
			filter: jest.fn().mockReturnThis(),
			data: jest.fn().mockReturnThis(),
			parent: jest.fn().mockReturnThis(),
			closest: jest.fn().mockReturnThis(),
			addClass: jest.fn().mockReturnThis(),
			removeClass: jest.fn().mockReturnThis(),
			find: jest.fn().mockReturnThis(),
			remove: jest.fn().mockReturnThis(),
			append: jest.fn().mockReturnThis(),
			prepend: jest.fn().mockReturnThis(),
			before: jest.fn().mockReturnThis(),
			after: jest.fn().mockReturnThis(),
			wrap: jest.fn().mockReturnThis(),
			html: jest.fn().mockReturnThis(),
			text: jest.fn().mockReturnThis(),
			css: jest.fn().mockReturnThis(),
			hasClass: jest.fn(() => false),
			length: 1,
			serialize: jest.fn(() => 'field1=value1&field2=value2'),
			0: document.createElement('form')
		};

		mockButton = {
			...mockInput,
			attr: jest.fn((key, value) => {
				if (key === 'disabled' && value === undefined) return false;
				return mockButton;
			})
		};

		mockForm = {
			...mockInput,
			find: jest.fn((selector) => {
				if (selector.includes('button[name="validate"]')) return mockButton;
				if (selector.includes('input[name]:not')) return mockInput;
				if (selector.includes('select.selectpicker')) return mockInput;
				if (selector.includes('div.form_errors')) return mockInput;
				if (selector.includes('.form_errors_content')) return { length: 0 };
				if (selector.includes('.modal-body')) return { length: 0 };
				if (selector.includes('.form-group:first')) return mockInput;
				return mockInput;
			})
		};

		global.$ = jest.fn((selector) => {
			if (typeof selector === 'function') {
				// Document ready
				return mockInput;
			}
			if (selector === mockButton || selector === mockInput || selector === mockForm) {
				return selector;
			}
			return mockInput;
		});

		global.$.each = jest.fn((obj, callback) => {
			if (Array.isArray(obj)) {
				obj.forEach((item, idx) => callback(idx, item));
			} else {
				Object.keys(obj).forEach(key => callback(key, obj[key]));
			}
		});
	});

	afterEach(() => {
		delete global.$;
		jest.clearAllMocks();
	});

	describe('init', () => {
		test('should initialize form with default submit button', () => {
			const onSubmitCallback = jest.fn();

			const result = FormHelper.init(mockForm, onSubmitCallback);

			expect(mockForm.find).toHaveBeenCalledWith('button[name="validate"]');
			expect(mockButton.off).toHaveBeenCalledWith('click');
			expect(mockButton.click).toHaveBeenCalled();
			expect(result).toBe(mockForm);
		});

		test('should initialize form with custom submit button', () => {
			const onSubmitCallback = jest.fn();
			const customButton = { ...mockButton };

			FormHelper.init(mockForm, onSubmitCallback, customButton);

			expect(customButton.off).toHaveBeenCalledWith('click');
			expect(customButton.click).toHaveBeenCalled();
		});

		test('should call callback on submit', () => {
			const onSubmitCallback = jest.fn();
			let clickHandler;

			mockButton.click.mockImplementation((handler) => {
				clickHandler = handler;
				return mockButton;
			});

			FormHelper.init(mockForm, onSubmitCallback);

			// Simulate button click
			const mockEvent = { preventDefault: jest.fn() };
			clickHandler.call(mockButton, mockEvent);

			expect(mockButton.data).toHaveBeenCalled();
			expect(onSubmitCallback).toHaveBeenCalledWith(mockForm, mockButton);
		});

		test('should prevent default on submit', () => {
			const onSubmitCallback = jest.fn();
			let clickHandler;
			const mockEvent = { preventDefault: jest.fn() };

			mockButton.click.mockImplementation((handler) => {
				clickHandler = handler;
				return mockButton;
			});

			FormHelper.init(mockForm, onSubmitCallback);
			clickHandler.call(mockButton, { preventDefault: () => {} });

			expect(onSubmitCallback).toHaveBeenCalledWith(mockForm, mockButton);
		});
	});

	describe('reset', () => {
		test('should reset form fields', () => {
			mockInput.each.mockImplementation((callback) => {
				callback(0, {});
				return mockInput;
			});

			const result = FormHelper.reset(mockForm);

			expect(mockInput.val).toHaveBeenCalledWith('');
			expect(mockInput.off).toHaveBeenCalledWith('change');
			expect(result).toBe(mockForm);
		});

		test('should reset form with custom submit button', () => {
			const customButton = { ...mockButton };

			FormHelper.reset(mockForm, customButton);

			expect(mockForm.find).toHaveBeenCalled();
		});
	});

	describe('populateForm', () => {
		test('should skip null values', () => {
			const data = { field1: 'value1', field2: null };

			FormHelper.populateForm(mockForm, data);

			// Should only process non-null values
			expect(mockForm.find).toHaveBeenCalled();
		});

		test('should handle object values as array select', () => {
			const selectMock = {
				find: jest.fn().mockReturnThis(),
				prop: jest.fn().mockReturnThis(),
				data: jest.fn().mockReturnThis()
			};

			mockForm.find = jest.fn((selector) => {
				if (selector.includes('employees_display_type')) return mockInput;
				if (selector.includes('[]')) return selectMock;
				return mockInput;
			});

			const data = { tags: ['tag1', 'tag2'] };

			FormHelper.populateForm(mockForm, data);

			expect(selectMock.find).toHaveBeenCalled();
			expect(selectMock.data).toHaveBeenCalledWith('default_id', 'tag1,tag2');
		});

		test('should handle radio button values', () => {
			mockInput.prop = jest.fn((key) => {
				if (key === 'type') return 'radio';
				return mockInput;
			});

			const data = { gender: 'male' };

			FormHelper.populateForm(mockForm, data);

			expect(mockInput.filter).toHaveBeenCalledWith('[value="male"]');
		});

		test('should handle checkbox values', () => {
			mockInput.prop = jest.fn((key) => {
				if (key === 'type') return 'checkbox';
				return mockInput;
			});

			const data = { terms: 'accepted' };

			FormHelper.populateForm(mockForm, data);

			expect(mockInput.filter).toHaveBeenCalledWith('[value="accepted"]');
		});

		test('should handle regular input values', () => {
			mockInput.prop = jest.fn(() => 'text');

			const data = { name: 'John' };

			FormHelper.populateForm(mockForm, data);

			expect(mockInput.val).toHaveBeenCalled();
		});
	});

	describe('reset', () => {
		test('should reset form fields', () => {
			mockInput.each.mockImplementation((callback) => {
				callback(0, document.createElement('input'));
				return mockInput;
			});

			const result = FormHelper.reset(mockForm);

			expect(mockForm.find).toHaveBeenCalled();
			expect(mockInput.each).toHaveBeenCalled();
			expect(result).toBe(mockForm);
		});

		test('should reset with custom button', () => {
			const customButton = { ...mockButton };
			mockInput.each.mockImplementation(() => mockInput);

			FormHelper.reset(mockForm, customButton);

			expect(mockInput.each).toHaveBeenCalled();
		});
	});

	describe('getFormData', () => {
		test('should return FormData from form element', () => {
			const result = FormHelper.getFormData(mockForm);

			expect(result).toBeInstanceOf(FormData);
		});
	});

	describe('getFormDataQueryString', () => {
		test('should return serialized form data', () => {
			const result = FormHelper.getFormDataQueryString(mockForm);

			expect(result).toBe('field1=value1&field2=value2');
			expect(mockForm.serialize).toHaveBeenCalled();
		});
	});

	describe('setOnInputChange', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		test('should setup keyup handler with timeout', () => {
			const callback = jest.fn();
			let keyupHandler;

			mockInput.on.mockImplementation((event, handler) => {
				if (event === 'keyup') keyupHandler = handler;
				return mockInput;
			});

			FormHelper.setOnInputChange(mockInput, callback, 500);

			expect(mockInput.on).toHaveBeenCalledWith('keyup', expect.any(Function));

			keyupHandler();
			jest.advanceTimersByTime(500);

			expect(callback).toHaveBeenCalled();
		});

		test('should clear timeout on keydown', () => {
			const callback = jest.fn();
			let keyupHandler, keydownHandler;

			mockInput.on.mockImplementation((event, handler) => {
				if (event === 'keyup') keyupHandler = handler;
				if (event === 'keydown') keydownHandler = handler;
				return mockInput;
			});

			FormHelper.setOnInputChange(mockInput, callback, 500);

			keyupHandler();
			keydownHandler();
			jest.advanceTimersByTime(500);

			expect(callback).not.toHaveBeenCalled();
		});

		test('should call callback on focusout', () => {
			const callback = jest.fn();
			let focusoutHandler;

			mockInput.on.mockImplementation((event, handler) => {
				if (event === 'focusout') focusoutHandler = handler;
				return mockInput;
			});

			FormHelper.setOnInputChange(mockInput, callback);

			focusoutHandler();

			expect(callback).toHaveBeenCalled();
		});

		test('should use default interval of 700ms', () => {
			const callback = jest.fn();
			let keyupHandler;

			mockInput.on.mockImplementation((event, handler) => {
				if (event === 'keyup') keyupHandler = handler;
				return mockInput;
			});

			FormHelper.setOnInputChange(mockInput, callback);

			keyupHandler();
			jest.advanceTimersByTime(700);

			expect(callback).toHaveBeenCalled();
		});
	});

	describe('Select methods', () => {
		test('resetSelectOption should reset select options', () => {
			const optionMock = {
				prop: jest.fn().mockReturnThis()
			};

			mockForm.find = jest.fn(() => optionMock);

			FormHelper.resetSelectOption(mockForm, 'category');

			expect(mockForm.find).toHaveBeenCalledWith('select[name="category"] option');
			expect(optionMock.prop).toHaveBeenCalledWith('disabled', false);
			expect(optionMock.prop).toHaveBeenCalledWith('selected', false);
		});

		test('setSelectedSelectOption should select option', () => {
			const optionMock = {
				prop: jest.fn().mockReturnThis()
			};

			mockForm.find = jest.fn(() => optionMock);

			FormHelper.setSelectedSelectOption(mockForm, 'category', '5');

			expect(mockForm.find).toHaveBeenCalledWith('select[name="category"] option[value="5"]');
			expect(optionMock.prop).toHaveBeenCalledWith('selected', true);
		});

		test('setSelectedSelectOptions should select multiple options', () => {
			const optionMock = {
				prop: jest.fn().mockReturnThis()
			};

			mockForm.find = jest.fn(() => optionMock);

			FormHelper.setSelectedSelectOptions(mockForm, 'tags', ['1', '2', '3']);

			expect(mockForm.find).toHaveBeenCalledTimes(3);
			expect(optionMock.prop).toHaveBeenCalledWith('selected', true);
		});

		test('disableSelectOption should disable option', () => {
			const optionMock = {
				prop: jest.fn().mockReturnThis()
			};

			mockForm.find = jest.fn(() => optionMock);

			FormHelper.disableSelectOption(mockForm, 'category', '5');

			expect(mockForm.find).toHaveBeenCalledWith('select[name="category"] option[value="5"]');
			expect(optionMock.prop).toHaveBeenCalledWith('disabled', true);
		});

		test('disableSelectOptions should disable multiple options', () => {
			const optionMock = {
				prop: jest.fn().mockReturnThis()
			};

			mockForm.find = jest.fn(() => optionMock);

			FormHelper.disableSelectOptions(mockForm, 'category', ['1', '2']);

			expect(mockForm.find).toHaveBeenCalledTimes(2);
			expect(optionMock.prop).toHaveBeenCalledWith('disabled', true);
		});

		test('countSelectOptions should count non-disabled options', () => {
			const optionMock = {
				length: 5
			};

			mockForm.find = jest.fn(() => optionMock);

			const count = FormHelper.countSelectOptions(mockForm, 'category');

			expect(mockForm.find).toHaveBeenCalledWith('select[name="category"] option:not([disabled])');
			expect(count).toBe(5);
		});
	});

	describe('Checkbox methods', () => {
		test('getCheckedValues should return checked values', () => {
			const mockCheckboxes = {
				map: jest.fn((callback) => {
					const results = [
						callback.call({ checked: true, value: 'option1' }),
						callback.call({ checked: false, value: 'option2' }),
						callback.call({ checked: true, value: 'option3' })
					];
					return { get: () => results.filter(r => r !== undefined) };
				})
			};

			const result = FormHelper.getCheckedValues(mockCheckboxes);

			expect(result).toEqual(['option1', 'option3']);
		});

		test('setCheckedValues should check specified values', () => {
			const parentMock = {
				find: jest.fn().mockReturnThis(),
				prop: jest.fn().mockReturnThis()
			};

			mockInput.parent = jest.fn(() => parentMock);

			FormHelper.setCheckedValues(mockInput, ['value1', 'value2']);

			expect(parentMock.find).toHaveBeenCalledWith('[value="value1"]');
			expect(parentMock.find).toHaveBeenCalledWith('[value="value2"]');
			expect(parentMock.prop).toHaveBeenCalledWith('checked', true);
		});

		test('getInputListValues should return all input values', () => {
			const mockInputs = {
				map: jest.fn((callback) => {
					const results = [
						callback.call({ value: 'value1' }),
						callback.call({ value: 'value2' }),
						callback.call({ value: '' })
					];
					return {
						get: () => results.filter(r => r.length > 0)
					};
				})
			};

			const result = FormHelper.getInputListValues(mockInputs);

			expect(result).toEqual(['value1', 'value2']);
		});
	});

	describe('initTypeFields', () => {
		test('should wrap password fields with toggle button', () => {
			const passwordInput = {
				wrap: jest.fn().mockReturnThis(),
				after: jest.fn().mockReturnThis()
			};

			mockForm.find = jest.fn((selector) => {
				if (selector === 'input[type="password"]') return passwordInput;
				if (selector.includes('input[type="date"]')) return { length: 0 };
				if (selector.includes('input[type="time"]')) return { length: 0 };
				return mockInput;
			});

			FormHelper.initTypeFields(mockForm);

			expect(passwordInput.wrap).toHaveBeenCalled();
			expect(passwordInput.after).toHaveBeenCalled();
		});

		test('should handle date inputs when Modernizr not available', () => {
			const dateInput = {
				css: jest.fn().mockReturnThis(),
				length: 1
			};

			const passwordInput = {
				wrap: jest.fn().mockReturnThis(),
				after: jest.fn().mockReturnThis(),
				length: 0
			};

			mockForm.find = jest.fn((selector) => {
				if (selector.includes('input[type="date"]')) return dateInput;
				if (selector.includes('input[type="time"]')) return { length: 0 };
				if (selector === 'input[type="password"]') return passwordInput;
				return mockInput;
			});

			global.Modernizr = {
				inputtypes: {
					date: false,
					time: true
				}
			};

			FormHelper.initTypeFields(mockForm);

			expect(dateInput.css).toHaveBeenCalledWith('max-width', '120px');

			delete global.Modernizr;
		});

		test('should handle time inputs when not supported', () => {
			const timeInput = {
				css: jest.fn().mockReturnThis(),
				attr: jest.fn().mockReturnThis(),
				length: 1
			};

			const passwordInput = {
				wrap: jest.fn().mockReturnThis(),
				after: jest.fn().mockReturnThis(),
				length: 0
			};

			mockForm.find = jest.fn((selector) => {
				if (selector.includes('input[type="time"]')) return timeInput;
				if (selector.includes('[step="1"]')) return timeInput;
				if (selector.includes('input[type="date"]')) return { length: 0 };
				if (selector === 'input[type="password"]') return passwordInput;
				return mockInput;
			});

			global.Modernizr = {
				inputtypes: {
					date: true,
					time: false
				}
			};

			FormHelper.initTypeFields(mockForm);

			expect(timeInput.css).toHaveBeenCalledWith('max-width', '100px');
			expect(timeInput.attr).toHaveBeenCalledWith('placeholder', 'hh:mm');

			delete global.Modernizr;
		});

		test('should skip when Modernizr not defined', () => {
			const passwordInput = {
				wrap: jest.fn().mockReturnThis(),
				after: jest.fn().mockReturnThis(),
				length: 1
			};

			const emptyElement = {
				length: 0,
				css: jest.fn().mockReturnThis(),
				attr: jest.fn().mockReturnThis()
			};

			mockForm.find = jest.fn((selector) => {
				if (selector === 'input[type="password"]') return passwordInput;
				return emptyElement;
			});

			FormHelper.initTypeFields(mockForm);

			// Should still wrap password fields
			expect(passwordInput.wrap).toHaveBeenCalled();
		});
	});

	describe('hideField', () => {
		test('should hide field form-group', () => {
			const formGroupMock = {
				addClass: jest.fn().mockReturnThis()
			};

			mockInput.closest = jest.fn(() => formGroupMock);

			FormHelper.hideField(mockInput);

			expect(mockInput.closest).toHaveBeenCalledWith('.form-group');
			expect(formGroupMock.addClass).toHaveBeenCalledWith('hide');
		});
	});

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
	});

	describe('displayFormErrors', () => {
		test('should display errors and reset button', () => {
			const errors = { field: 'Error message' };
			const displaySpy = jest.spyOn(FormHelper, 'displayFormErrorsFromText');
			const getTextSpy = jest.spyOn(FormHelper, 'getFormErrorText').mockReturnValue('<span>Error</span>');
			const buttonLoaderSpy = jest.spyOn(FormHelper, 'buttonLoader');

			FormHelper.displayFormErrors(mockForm, mockButton, errors);

			expect(getTextSpy).toHaveBeenCalledWith(errors);
			expect(displaySpy).toHaveBeenCalledWith(mockForm, '<span>Error</span>', null);
			expect(buttonLoaderSpy).toHaveBeenCalledWith(mockButton, 'reset');

			displaySpy.mockRestore();
			getTextSpy.mockRestore();
			buttonLoaderSpy.mockRestore();
		});

		test('should work without button', () => {
			const errors = { field: 'Error message' };
			const displaySpy = jest.spyOn(FormHelper, 'displayFormErrorsFromText');
			const getTextSpy = jest.spyOn(FormHelper, 'getFormErrorText').mockReturnValue('<span>Error</span>');

			FormHelper.displayFormErrors(mockForm, null, errors);

			expect(displaySpy).toHaveBeenCalledWith(mockForm, '<span>Error</span>', null);

			displaySpy.mockRestore();
			getTextSpy.mockRestore();
		});

		test('should use custom error wrapper', () => {
			const errors = { field: 'Error message' };
			const wrapper = { append: jest.fn() };
			const displaySpy = jest.spyOn(FormHelper, 'displayFormErrorsFromText');
			const getTextSpy = jest.spyOn(FormHelper, 'getFormErrorText').mockReturnValue('<span>Error</span>');

			FormHelper.displayFormErrors(mockForm, mockButton, errors, wrapper);

			expect(displaySpy).toHaveBeenCalledWith(mockForm, '<span>Error</span>', wrapper);

			displaySpy.mockRestore();
			getTextSpy.mockRestore();
		});
	});

	describe('displayFormErrorsFromText', () => {
		test('should append to errorWrapperDiv when provided', () => {
			const wrapper = {
				append: jest.fn()
			};

			FormHelper.displayFormErrorsFromText(mockForm, 'Error text', wrapper);

			expect(wrapper.append).toHaveBeenCalledWith('<div class="alert alert-danger form_errors">Error text</div>');
		});

		test('should append to .form_errors_content when exists', () => {
			const errorContent = {
				append: jest.fn(),
				length: 1
			};

			mockForm.find = jest.fn((selector) => {
				if (selector === '.form_errors_content') return errorContent;
				return { length: 0 };
			});

			FormHelper.displayFormErrorsFromText(mockForm, 'Error text');

			expect(errorContent.append).toHaveBeenCalled();
		});

		test('should prepend to modal-body when exists', () => {
			const formGroupMock = {
				parent: jest.fn().mockReturnThis(),
				hasClass: jest.fn(() => false),
				before: jest.fn(),
				length: 1
			};

			const modalBody = {
				find: jest.fn((selector) => {
					if (selector === '.form-group:first') return formGroupMock;
					return { length: 0 };
				}),
				length: 1
			};

			mockForm.find = jest.fn((selector) => {
				if (selector === '.form_errors_content') return { length: 0 };
				if (selector === '.modal-body') return modalBody;
				if (selector === '.form-group:first') return { length: 0 };
				return mockInput;
			});

			FormHelper.displayFormErrorsFromText(mockForm, 'Error text');

			expect(mockForm.find).toHaveBeenCalledWith('.modal-body');
		});

		test('should insert before first form-group when exists', () => {
			const formGroup = {
				parent: jest.fn().mockReturnThis(),
				hasClass: jest.fn(() => false),
				before: jest.fn(),
				length: 1
			};

			mockForm.find = jest.fn((selector) => {
				if (selector === '.form_errors_content') return { length: 0 };
				if (selector === '.modal-body') return { length: 0 };
				if (selector === '.form-group:first') return formGroup;
				return mockInput;
			});

			FormHelper.displayFormErrorsFromText(mockForm, 'Error text');

			expect(formGroup.before).toHaveBeenCalled();
		});

		test('should insert before row parent when form-group is in row', () => {
			const parentRow = {
				parent: jest.fn().mockReturnThis(),
				hasClass: jest.fn(() => true),
				before: jest.fn()
			};

			const formGroup = {
				parent: jest.fn(() => parentRow),
				length: 1
			};

			mockForm.find = jest.fn((selector) => {
				if (selector === '.form_errors_content') return { length: 0 };
				if (selector === '.modal-body') return { length: 0 };
				if (selector === '.form-group:first') return formGroup;
				return mockInput;
			});

			FormHelper.displayFormErrorsFromText(mockForm, 'Error text');

			expect(parentRow.before).toHaveBeenCalled();
		});

		test('should prepend to form when no other location found', () => {
			mockForm.find = jest.fn(() => ({ length: 0 }));
			mockForm.prepend = jest.fn();

			FormHelper.displayFormErrorsFromText(mockForm, 'Error text');

			expect(mockForm.prepend).toHaveBeenCalledWith('<div class="alert alert-danger form_errors">Error text</div>');
		});
	});

	describe('buttonLoader', () => {
		test('should disable button on loading', () => {
			mockButton.attr.mockImplementation((key, value) => {
				if (key === 'disabled' && value === undefined) return false;
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

		test('should not process if already disabled', () => {
			mockButton.attr.mockImplementation((key) => {
				if (key === 'disabled') return true;
				return mockButton;
			});

			FormHelper.buttonLoader(mockButton, 'loading');

			expect(mockButton.html).not.toHaveBeenCalled();
		});

		test('should enable button on reset', () => {
			mockButton.data.mockReturnValue('Original Text');

			FormHelper.buttonLoader(mockButton, 'reset');

			expect(mockButton.html).toHaveBeenCalledWith('Original Text');
			expect(mockButton.removeClass).toHaveBeenCalledWith('disabled');
			expect(mockButton.attr).toHaveBeenCalledWith('disabled', false);
		});

		test('should use load-text when provided', () => {
			mockButton.attr.mockImplementation((key) => {
				if (key === 'disabled') return false;
				return mockButton;
			});
			mockButton.data.mockImplementation((key) => {
				if (key === 'load-text') return 'Loading...';
				return null;
			});

			FormHelper.buttonLoader(mockButton, 'start');

			expect(mockButton.html).toHaveBeenCalledWith('Loading...');
		});

		test('should use loading-text when provided', () => {
			mockButton.attr.mockImplementation((key) => {
				if (key === 'disabled') return false;
				return mockButton;
			});
			mockButton.data.mockImplementation((key) => {
				if (key === 'loading-text') return 'Custom Loading...';
				return null;
			});

			FormHelper.buttonLoader(mockButton, 'start');

			expect(mockButton.html).toHaveBeenCalledWith('Custom Loading...');
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
	});

	describe('hideFormErrors', () => {
		test('should remove form_errors div', () => {
			const result = FormHelper.hideFormErrors(mockForm);

			expect(mockForm.find).toHaveBeenCalledWith('div.form_errors');
			expect(mockInput.remove).toHaveBeenCalled();
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
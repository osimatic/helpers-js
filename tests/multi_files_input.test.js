const { MultiFilesInput } = require('../multi_files_input');
const { Str } = require('../string'); // Importer pour que escapeHtml soit disponible

// Mock global FlashMessage
global.FlashMessage = {
	displayError: jest.fn()
};

// Mock FileReader
class MockFileReader {
	constructor() {
		this.readAsDataURL = jest.fn(function(file) {
			setTimeout(() => {
				if (file.type.startsWith('image/')) {
					this.result = 'data:image/png;base64,iVBORw0KGgoAAAANS';
				}
				if (this.onload) {
					this.onload({ target: this });
				}
			}, 0);
		});
	}
}

global.FileReader = MockFileReader;

// Mock Math.random for consistent IDs
let mockRandomCounter = 0;
const originalMathRandom = Math.random;

describe('MultiFilesInput', () => {
	let mockFileInput;
	let mockFormGroup;
	let mockDropzone;
	let mockFilesPreview;
	let mockParent;
	let setFilesListSpy;
	let eventHandlers;
	let mockPreviewThumb;
	let mockBtnClose;
	let mockWrap;

	beforeEach(() => {
		// Reset counter for consistent IDs
		mockRandomCounter = 0;
		Math.random = jest.fn(() => {
			mockRandomCounter++;
			return 0.123456789 + mockRandomCounter * 0.001;
		});

		// Reset FlashMessage mock
		global.FlashMessage.displayError.mockClear();

		// Setup event handlers storage
		eventHandlers = {
			click: null,
			dragover: null,
			dragleave: null,
			drop: null,
			change: null
		};

		// Setup preview mocks that will be reused
		mockPreviewThumb = {
			html: jest.fn().mockReturnThis()
		};

		mockBtnClose = {
			off: jest.fn().mockReturnThis(),
			on: jest.fn().mockReturnThis(),
			closest: jest.fn(() => ({
				index: jest.fn(() => 0),
				remove: jest.fn()
			}))
		};

		mockWrap = {
			find: jest.fn((selector) => {
				if (selector === '.preview-thumb') {
					return mockPreviewThumb;
				}
				if (selector === '.btn-close') {
					return mockBtnClose;
				}
				return {};
			}),
			closest: jest.fn(() => ({
				index: jest.fn(() => 0),
				remove: jest.fn()
			}))
		};

		// Mock jQuery elements
		mockFilesPreview = {
			append: jest.fn().mockReturnThis(),
			empty: jest.fn().mockReturnThis(),
			addClass: jest.fn().mockReturnThis(),
			removeClass: jest.fn().mockReturnThis(),
			length: 1
		};

		mockDropzone = {
			off: jest.fn().mockReturnThis(),
			on: jest.fn(function(event, handler) {
				eventHandlers[event] = handler;
				return this;
			}),
			addClass: jest.fn().mockReturnThis(),
			removeClass: jest.fn().mockReturnThis(),
			length: 0
		};

		mockParent = {
			find: jest.fn((selector) => {
				if (selector === '.multi_files_input_dropzone') {
					return mockDropzone;
				}
				if (selector === '.multi_files_input_files_preview') {
					return mockFilesPreview;
				}
				return { length: 0 };
			})
		};

		mockFormGroup = {
			find: jest.fn((selector) => {
				if (selector === '.multi_files_input_dropzone') {
					return { length: 0 };
				}
				if (selector === '.multi_files_input_files_preview') {
					return { length: 0 };
				}
				return { length: 0 };
			}),
			append: jest.fn()
		};

		mockFileInput = {
			closest: jest.fn(() => mockFormGroup),
			after: jest.fn(),
			parent: jest.fn(() => mockParent),
			addClass: jest.fn().mockReturnThis(),
			off: jest.fn().mockReturnThis(),
			on: jest.fn(function(event, handler) {
				eventHandlers[event] = handler;
				return this;
			}),
			trigger: jest.fn(),
			val: jest.fn().mockReturnThis()
		};

		// Mock jQuery $ function globally for all tests
		global.$ = jest.fn((selector) => {
			// Handle string selectors (element creation)
			if (typeof selector === 'string') {
				if (selector.includes('data-file-id')) {
					return mockWrap;
				}
				// Return a generic jQuery-like object for other selectors
				return {
					addClass: jest.fn().mockReturnThis(),
					removeClass: jest.fn().mockReturnThis()
				};
			}
			// Handle object selectors (wrapping existing elements like $(this))
			if (selector && typeof selector === 'object') {
				// If it's an element being wrapped, return jQuery-like object
				return {
					addClass: jest.fn().mockReturnThis(),
					removeClass: jest.fn().mockReturnThis(),
					closest: jest.fn(() => ({
						index: jest.fn(() => 0),
						remove: jest.fn()
					}))
				};
			}
			return {};
		});

		setFilesListSpy = jest.fn();
	});

	afterEach(() => {
		Math.random = originalMathRandom;
		jest.clearAllTimers();
	});

	describe('init', () => {
		test('should create dropzone when it does not exist', () => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 5, 1024 * 1024);

			expect(mockFileInput.after).toHaveBeenCalledWith(expect.stringContaining('multi_files_input_dropzone'));
			expect(mockFileInput.after).toHaveBeenCalledWith(expect.stringContaining('Glissez-déposez vos fichiers ici'));
		});

		test('should not create dropzone when it already exists', () => {
			mockFormGroup.find = jest.fn((selector) => {
				if (selector === '.multi_files_input_dropzone') {
					return { length: 1 };
				}
				return { length: 0 };
			});

			MultiFilesInput.init(mockFileInput, setFilesListSpy, 5, 1024 * 1024);

			expect(mockFileInput.after).not.toHaveBeenCalled();
		});

		test('should create files preview container when it does not exist', () => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 5, 1024 * 1024);

			expect(mockFormGroup.append).toHaveBeenCalledWith(expect.stringContaining('multi_files_input_files_preview'));
		});

		test('should not create preview container when it already exists', () => {
			mockFormGroup.find = jest.fn((selector) => {
				if (selector === '.multi_files_input_files_preview') {
					return { length: 1 };
				}
				return { length: 0 };
			});

			MultiFilesInput.init(mockFileInput, setFilesListSpy, 5, 1024 * 1024);

			// Should only be called once for checking dropzone
			expect(mockFormGroup.find).toHaveBeenCalledTimes(2);
		});

		test('should hide file input element', () => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 5, 1024 * 1024);

			expect(mockFileInput.addClass).toHaveBeenCalledWith('hide');
		});

		test('should empty files preview container on init', () => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 5, 1024 * 1024);

			expect(mockFilesPreview.empty).toHaveBeenCalled();
		});

		test('should setup click handler on dropzone', () => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 5, 1024 * 1024);

			expect(mockDropzone.off).toHaveBeenCalledWith('click');
			expect(mockDropzone.on).toHaveBeenCalledWith('click', expect.any(Function));
		});

		test('should setup dragover handler on dropzone', () => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 5, 1024 * 1024);

			expect(mockDropzone.off).toHaveBeenCalledWith('dragover');
			expect(mockDropzone.on).toHaveBeenCalledWith('dragover', expect.any(Function));
		});

		test('should setup dragleave handler on dropzone', () => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 5, 1024 * 1024);

			expect(mockDropzone.off).toHaveBeenCalledWith('dragleave');
			expect(mockDropzone.on).toHaveBeenCalledWith('dragleave', expect.any(Function));
		});

		test('should setup drop handler on dropzone', () => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 5, 1024 * 1024);

			expect(mockDropzone.off).toHaveBeenCalledWith('drop');
			expect(mockDropzone.on).toHaveBeenCalledWith('drop', expect.any(Function));
		});

		test('should setup change handler on file input', () => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 5, 1024 * 1024);

			expect(mockFileInput.off).toHaveBeenCalledWith('change');
			expect(mockFileInput.on).toHaveBeenCalledWith('change', expect.any(Function));
		});
	});

	describe('dropzone interactions', () => {
		beforeEach(() => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 5, 1024 * 1024);
		});

		test('should trigger file input click when dropzone is clicked', () => {
			const mockEvent = {
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			};

			eventHandlers.click.call(mockDropzone, mockEvent);

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(mockEvent.stopPropagation).toHaveBeenCalled();
			expect(mockFileInput.trigger).toHaveBeenCalledWith('click');
		});

		test('should add border-primary class on dragover', () => {
			const mockEvent = {
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			};

			// Use a proper jQuery-like context
			const contextWithAddClass = {
				addClass: jest.fn().mockReturnThis()
			};

			// Create a bound function that uses $ to return contextWithAddClass
			const handler = eventHandlers.dragover;
			const mockJQuery = jest.fn(() => contextWithAddClass);
			global.$ = mockJQuery;

			handler.call(contextWithAddClass, mockEvent);

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(mockEvent.stopPropagation).toHaveBeenCalled();
			expect(contextWithAddClass.addClass).toHaveBeenCalledWith('border-primary');
		});

		test('should remove border-primary class on dragleave', () => {
			const mockEvent = {
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			};

			const contextWithRemoveClass = {
				removeClass: jest.fn().mockReturnThis()
			};

			const handler = eventHandlers.dragleave;
			const mockJQuery = jest.fn(() => contextWithRemoveClass);
			global.$ = mockJQuery;

			handler.call(contextWithRemoveClass, mockEvent);

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(mockEvent.stopPropagation).toHaveBeenCalled();
			expect(contextWithRemoveClass.removeClass).toHaveBeenCalledWith('border-primary');
		});

		test('should handle file drop', () => {
			const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });

			const mockEvent = {
				preventDefault: jest.fn(),
				stopPropagation: jest.fn(),
				originalEvent: {
					dataTransfer: {
						files: [mockFile]
					}
				}
			};

			const contextElement = { id: 'dropzone-element' };
			const handler = eventHandlers.drop;

			// Réinitialiser le spy $
			global.$.mockClear();

			handler.call(contextElement, mockEvent);

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(mockEvent.stopPropagation).toHaveBeenCalled();
			// Vérifie que $(this) a été appelé pour envelopper l'élément
			expect(global.$).toHaveBeenCalledWith(contextElement);
			// Le fichier devrait être ajouté à la liste
			expect(setFilesListSpy).toHaveBeenCalledWith([mockFile]);
		});

		test('should handle drop with no files', () => {
			const mockEvent = {
				preventDefault: jest.fn(),
				stopPropagation: jest.fn(),
				originalEvent: {}
			};

			const contextWithRemoveClass = {
				removeClass: jest.fn().mockReturnThis()
			};

			const handler = eventHandlers.drop;
			const mockJQuery = jest.fn(() => contextWithRemoveClass);
			global.$ = mockJQuery;

			// Should not throw error
			expect(() => {
				handler.call(contextWithRemoveClass, mockEvent);
			}).not.toThrow();

			expect(setFilesListSpy).not.toHaveBeenCalled();
		});
	});

	describe('file handling', () => {
		beforeEach(() => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 3, 1024 * 1024);
		});

		test('should add valid file to files list', () => {
			const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			expect(setFilesListSpy).toHaveBeenCalledWith([mockFile]);
			expect(mockFileInput.val).toHaveBeenCalledWith('');
		});

		test('should not exceed maximum number of files', () => {
			const mockFile1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
			const mockFile2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });
			const mockFile3 = new File(['content3'], 'test3.txt', { type: 'text/plain' });
			const mockFile4 = new File(['content4'], 'test4.txt', { type: 'text/plain' });

			Object.defineProperty(mockFile1, 'size', { value: 500 });
			Object.defineProperty(mockFile2, 'size', { value: 500 });
			Object.defineProperty(mockFile3, 'size', { value: 500 });
			Object.defineProperty(mockFile4, 'size', { value: 500 });

			const mockEvent = {
				target: {
					files: [mockFile1, mockFile2, mockFile3, mockFile4]
				}
			};

			eventHandlers.change(mockEvent);

			// Should only add 3 files (nbMaxFiles = 3)
			expect(setFilesListSpy).toHaveBeenCalledTimes(3);
			expect(global.FlashMessage.displayError).toHaveBeenCalledWith('Maximum 3 fichiers autorisés.');
		});

		test('should reject file exceeding max size', () => {
			const mockFile = new File(['content'], 'large.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 2 * 1024 * 1024 }); // 2MB
			Object.defineProperty(mockFile, 'name', { value: 'large.txt' });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			expect(global.FlashMessage.displayError).toHaveBeenCalledWith('Le fichier large.txt dépasse la taille maximale.');
			expect(setFilesListSpy).not.toHaveBeenCalled();
		});

		test('should handle multiple valid files', () => {
			const mockFile1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
			const mockFile2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

			Object.defineProperty(mockFile1, 'size', { value: 500 });
			Object.defineProperty(mockFile2, 'size', { value: 600 });

			const mockEvent = {
				target: {
					files: [mockFile1, mockFile2]
				}
			};

			eventHandlers.change(mockEvent);

			// setFilesList est appelé avec la même référence d'array (comportement voulu)
			expect(setFilesListSpy).toHaveBeenCalledTimes(2);
			// À chaque appel, l'array contient tous les fichiers ajoutés jusqu'à présent
			const call1 = setFilesListSpy.mock.calls[0][0];
			const call2 = setFilesListSpy.mock.calls[1][0];
			expect(call1).toEqual(call2); // Même référence, contient les 2 fichiers
			expect(call2).toHaveLength(2);
			expect(call2).toContain(mockFile1);
			expect(call2).toContain(mockFile2);
		});

		test('should skip oversized file and continue with valid files', () => {
			const mockFile1 = new File(['content1'], 'small.txt', { type: 'text/plain' });
			const mockFile2 = new File(['content2'], 'large.txt', { type: 'text/plain' });
			const mockFile3 = new File(['content3'], 'small2.txt', { type: 'text/plain' });

			Object.defineProperty(mockFile1, 'size', { value: 500 });
			Object.defineProperty(mockFile2, 'size', { value: 2 * 1024 * 1024 });
			Object.defineProperty(mockFile2, 'name', { value: 'large.txt' });
			Object.defineProperty(mockFile3, 'size', { value: 600 });

			const mockEvent = {
				target: {
					files: [mockFile1, mockFile2, mockFile3]
				}
			};

			eventHandlers.change(mockEvent);

			// setFilesList est appelé avec la même référence d'array (comportement voulu)
			expect(setFilesListSpy).toHaveBeenCalledTimes(2);
			const lastCall = setFilesListSpy.mock.calls[1][0];
			expect(lastCall).toHaveLength(2);
			expect(lastCall).toContain(mockFile1);
			expect(lastCall).toContain(mockFile3);
			expect(lastCall).not.toContain(mockFile2); // Le fichier trop gros n'est pas ajouté
			expect(global.FlashMessage.displayError).toHaveBeenCalledWith('Le fichier large.txt dépasse la taille maximale.');
		});
	});

	describe('file preview rendering', () => {
		beforeEach(() => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 3, 1024 * 1024);
		});

		test('should render preview for non-image file', () => {
			const mockFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });
			Object.defineProperty(mockFile, 'size', { value: 500 });
			Object.defineProperty(mockFile, 'name', { value: 'document.pdf' });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			expect(mockFilesPreview.append).toHaveBeenCalledWith(mockWrap);
			expect(mockFilesPreview.removeClass).toHaveBeenCalledWith('hide');
			expect(mockPreviewThumb.html).toHaveBeenCalledWith('<i class="fas fa-file fa-2x text-muted"></i>');
		});

		test('should render preview with image thumbnail for image file', (done) => {
			const mockFile = new File(['content'], 'photo.png', { type: 'image/png' });
			Object.defineProperty(mockFile, 'size', { value: 500 });
			Object.defineProperty(mockFile, 'name', { value: 'photo.png' });
			Object.defineProperty(mockFile, 'type', { value: 'image/png' });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			// Wait for FileReader to process
			setTimeout(() => {
				expect(mockPreviewThumb.html).toHaveBeenCalledWith(
					expect.stringContaining('<img src="data:image/png;base64,')
				);
				done();
			}, 10);
		});

		test('should generate unique file ID', () => {
			const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			// Check that $ was called with a string containing data-file-id
			expect(global.$).toHaveBeenCalledWith(expect.stringContaining('data-file-id="f_'));
		});

		test('should setup close button handler', () => {
			const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			expect(mockBtnClose.off).toHaveBeenCalledWith('click');
			expect(mockBtnClose.on).toHaveBeenCalledWith('click', expect.any(Function));
		});
	});

	describe('file removal', () => {
		let mockClosest;
		let removeButtonHandler;

		beforeEach(() => {
			mockClosest = {
				index: jest.fn(() => 0),
				remove: jest.fn()
			};

			// Reconfigure mockBtnClose to capture the remove handler
			mockBtnClose.on = jest.fn(function(event, handler) {
				if (event === 'click') {
					removeButtonHandler = handler;
				}
				return this;
			});
			mockBtnClose.closest = jest.fn(() => mockClosest);

			// Reconfigure mockWrap.closest to return our mockClosest
			mockWrap.closest = jest.fn(() => mockClosest);

			// Update global.$ to return proper closest
			global.$ = jest.fn((selector) => {
				if (typeof selector === 'string') {
					if (selector.includes('data-file-id')) {
						return mockWrap;
					}
					return {
						addClass: jest.fn().mockReturnThis(),
						removeClass: jest.fn().mockReturnThis()
					};
				}
				if (selector === mockBtnClose) {
					return {
						closest: jest.fn(() => mockClosest)
					};
				}
				return {};
			});

			MultiFilesInput.init(mockFileInput, setFilesListSpy, 3, 1024 * 1024);
		});

		test('should remove file from list when close button clicked', () => {
			const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });
			Object.defineProperty(mockFile, 'name', { value: 'test.txt' });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			// Add file
			eventHandlers.change(mockEvent);

			// Click remove button
			removeButtonHandler.call(mockBtnClose);

			// Should call setFilesList with empty array
			expect(setFilesListSpy).toHaveBeenLastCalledWith([]);
			expect(mockClosest.remove).toHaveBeenCalled();
		});

		test('should hide preview container when last file is removed', () => {
			const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });
			Object.defineProperty(mockFile, 'name', { value: 'test.txt' });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			// Reset mock calls
			mockFilesPreview.addClass.mockClear();

			// Click remove button
			removeButtonHandler.call(mockBtnClose);

			expect(mockFilesPreview.addClass).toHaveBeenCalledWith('hide');
		});

		test('should not hide preview container when files remain', () => {
			const mockFile1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
			const mockFile2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

			Object.defineProperty(mockFile1, 'size', { value: 500 });
			Object.defineProperty(mockFile1, 'name', { value: 'test1.txt' });
			Object.defineProperty(mockFile2, 'size', { value: 600 });
			Object.defineProperty(mockFile2, 'name', { value: 'test2.txt' });

			const mockEvent = {
				target: {
					files: [mockFile1, mockFile2]
				}
			};

			eventHandlers.change(mockEvent);

			// Reset mock calls
			mockFilesPreview.addClass.mockClear();
			setFilesListSpy.mockClear();

			// Click remove button for first file
			removeButtonHandler.call(mockBtnClose);

			// Should still have one file
			expect(setFilesListSpy).toHaveBeenLastCalledWith([mockFile2]);
			expect(mockFilesPreview.addClass).not.toHaveBeenCalledWith('hide');
		});

		test('should remove file by name and size reference', () => {
			const mockFile1 = new File(['content1'], 'test.txt', { type: 'text/plain' });
			const mockFile2 = new File(['content2'], 'test.txt', { type: 'text/plain' }); // Same name
			const mockFile3 = new File(['content3'], 'other.txt', { type: 'text/plain' });

			Object.defineProperty(mockFile1, 'size', { value: 500 });
			Object.defineProperty(mockFile1, 'name', { value: 'test.txt' });
			Object.defineProperty(mockFile2, 'size', { value: 600 }); // Different size
			Object.defineProperty(mockFile2, 'name', { value: 'test.txt' });
			Object.defineProperty(mockFile3, 'size', { value: 700 });
			Object.defineProperty(mockFile3, 'name', { value: 'other.txt' });

			const mockEvent = {
				target: {
					files: [mockFile1, mockFile2, mockFile3]
				}
			};

			eventHandlers.change(mockEvent);

			// The files list should now contain all 3 files
			// When we remove, it should match by name AND size
			setFilesListSpy.mockClear();

			removeButtonHandler.call(mockBtnClose);

			// Should remove only the file with matching name and size
			// Since mockClosest.index returns 0, it will try to remove mockFile1
			const lastCall = setFilesListSpy.mock.calls[setFilesListSpy.mock.calls.length - 1];
			expect(lastCall[0].length).toBe(2); // Should have 2 files remaining
		});
	});

	describe('XSS protection', () => {
		beforeEach(() => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 3, 1024 * 1024);
		});

		test('should escape HTML tags in filename', () => {
			const mockFile = new File(['content'], '<script>alert("xss")</script>.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });
			Object.defineProperty(mockFile, 'name', { value: '<script>alert("xss")</script>.txt' });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			// Vérifie que les balises HTML sont échappées
			expect(global.$).toHaveBeenCalledWith(expect.stringContaining('&lt;script&gt;'));
			expect(global.$).toHaveBeenCalledWith(expect.stringContaining('&lt;&#x2F;script&gt;'));
			expect(global.$).not.toHaveBeenCalledWith(expect.stringContaining('<script>'));
		});

		test('should escape quotes in filename', () => {
			const mockFile = new File(['content'], 'file"with\'quotes.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });
			Object.defineProperty(mockFile, 'name', { value: 'file"with\'quotes.txt' });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			// Vérifie que les guillemets sont échappés
			expect(global.$).toHaveBeenCalledWith(expect.stringContaining('&quot;'));
			expect(global.$).toHaveBeenCalledWith(expect.stringContaining('&#39;'));
		});

		test('should escape ampersand in filename', () => {
			const mockFile = new File(['content'], 'file&name.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });
			Object.defineProperty(mockFile, 'name', { value: 'file&name.txt' });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			// Vérifie que & est échappé en &amp;
			expect(global.$).toHaveBeenCalledWith(expect.stringContaining('file&amp;name.txt'));
			expect(global.$).not.toHaveBeenCalledWith(expect.stringMatching(/file&name\.txt/));
		});

		test('should handle filename with all dangerous characters', () => {
			const mockFile = new File(['content'], '<>"&\'/test.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });
			Object.defineProperty(mockFile, 'name', { value: '<>"&\'/test.txt' });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			// Vérifie que tous les caractères dangereux sont échappés
			const calls = global.$.mock.calls;
			const htmlCall = calls.find(call => typeof call[0] === 'string' && call[0].includes('data-file-id'));
			expect(htmlCall).toBeDefined();
			expect(htmlCall[0]).toContain('&lt;');
			expect(htmlCall[0]).toContain('&gt;');
			expect(htmlCall[0]).toContain('&quot;');
			expect(htmlCall[0]).toContain('&amp;');
			expect(htmlCall[0]).toContain('&#39;');
			expect(htmlCall[0]).toContain('&#x2F;');
		});
	});

	describe('edge cases', () => {
		beforeEach(() => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 3, 1024 * 1024);
		});

		test('should handle empty file selection', () => {
			const mockEvent = {
				target: {
					files: []
				}
			};

			eventHandlers.change(mockEvent);

			expect(setFilesListSpy).not.toHaveBeenCalled();
			expect(mockFileInput.val).toHaveBeenCalledWith('');
		});

		test('should handle file with zero size', () => {
			const mockFile = new File([''], 'empty.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 0 });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			// File with size 0 should still be accepted
			expect(setFilesListSpy).toHaveBeenCalledWith([mockFile]);
		});

		test('should handle file at exact max size', () => {
			const mockFile = new File(['content'], 'exact.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 1024 * 1024 }); // Exactly 1MB

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			// File at exact max size should be accepted
			expect(setFilesListSpy).toHaveBeenCalledWith([mockFile]);
			expect(global.FlashMessage.displayError).not.toHaveBeenCalled();
		});

		test('should handle file one byte over max size', () => {
			const mockFile = new File(['content'], 'oversize.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 1024 * 1024 + 1 }); // 1MB + 1 byte
			Object.defineProperty(mockFile, 'name', { value: 'oversize.txt' });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			expect(global.FlashMessage.displayError).toHaveBeenCalledWith('Le fichier oversize.txt dépasse la taille maximale.');
			expect(setFilesListSpy).not.toHaveBeenCalled();
		});

		test('should handle special characters in filename', () => {
			const mockFile = new File(['content'], 'file with spaces & special#chars.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });
			Object.defineProperty(mockFile, 'name', { value: 'file with spaces & special#chars.txt' });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			expect(setFilesListSpy).toHaveBeenCalledWith([mockFile]);
			// Vérifie que le caractère & est échappé en &amp; pour éviter les failles XSS
			expect(global.$).toHaveBeenCalledWith(expect.stringContaining('file with spaces &amp; special#chars.txt'));
		});

		test('should handle various image types', () => {
			const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

			imageTypes.forEach((type, index) => {
				// Réinitialiser pour chaque test d'image
				if (index > 0) {
					MultiFilesInput.init(mockFileInput, setFilesListSpy, 3, 1024 * 1024);
				}
				setFilesListSpy.mockClear();

				const mockFile = new File(['content'], `photo.${type.split('/')[1]}`, { type });
				Object.defineProperty(mockFile, 'size', { value: 500 });
				Object.defineProperty(mockFile, 'type', { value: type });

				const mockEvent = {
					target: {
						files: [mockFile]
					}
				};

				eventHandlers.change(mockEvent);

				expect(setFilesListSpy).toHaveBeenCalled();
			});
		});

		test('should handle max files limit of 0', () => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 0, 1024 * 1024);

			const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			expect(global.FlashMessage.displayError).toHaveBeenCalledWith('Maximum 0 fichiers autorisés.');
			expect(setFilesListSpy).not.toHaveBeenCalled();
		});

		test('should handle max files limit of 1', () => {
			MultiFilesInput.init(mockFileInput, setFilesListSpy, 1, 1024 * 1024);

			const mockFile1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
			const mockFile2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

			Object.defineProperty(mockFile1, 'size', { value: 500 });
			Object.defineProperty(mockFile2, 'size', { value: 600 });

			const mockEvent = {
				target: {
					files: [mockFile1, mockFile2]
				}
			};

			eventHandlers.change(mockEvent);

			expect(setFilesListSpy).toHaveBeenCalledTimes(1);
			expect(setFilesListSpy).toHaveBeenCalledWith([mockFile1]);
			expect(global.FlashMessage.displayError).toHaveBeenCalledWith('Maximum 1 fichiers autorisés.');
		});

		test('should handle file with null name', () => {
			const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });
			Object.defineProperty(mockFile, 'name', { value: null });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			// Le fichier devrait être ajouté même avec un nom null
			expect(setFilesListSpy).toHaveBeenCalledWith([mockFile]);
			// Vérifie que le nom est traité comme une chaîne vide
			expect(global.$).toHaveBeenCalledWith(expect.stringContaining('max-width:160px;"></div>'));
		});

		test('should handle file with undefined name', () => {
			const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
			Object.defineProperty(mockFile, 'size', { value: 500 });
			Object.defineProperty(mockFile, 'name', { value: undefined });

			const mockEvent = {
				target: {
					files: [mockFile]
				}
			};

			eventHandlers.change(mockEvent);

			// Le fichier devrait être ajouté même avec un nom undefined
			expect(setFilesListSpy).toHaveBeenCalledWith([mockFile]);
			// Vérifie que le nom est traité comme une chaîne vide
			expect(global.$).toHaveBeenCalledWith(expect.stringContaining('max-width:160px;"></div>'));
		});
	});
});
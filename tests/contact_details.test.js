const { PersonName, Email, TelephoneNumber } = require('../contact_details');

describe('PersonName', () => {
	describe('format', () => {
		test('should format full name with firstName and lastName', () => {
			expect(PersonName.format('John', 'Doe')).toBe('John Doe');
		});

		test('should format with only firstName', () => {
			expect(PersonName.format('John', null)).toBe('John');
			expect(PersonName.format('John', '')).toBe('John');
		});

		test('should format with only lastName', () => {
			expect(PersonName.format(null, 'Doe')).toBe('Doe');
			expect(PersonName.format('', 'Doe')).toBe('Doe');
		});

		test('should return empty string when both are null', () => {
			expect(PersonName.format(null, null)).toBe('');
			expect(PersonName.format('', '')).toBe('');
		});

		test('should trim extra spaces', () => {
			expect(PersonName.format('  John  ', '  Doe  ')).toBe('John Doe');
		});

		test('should handle names with special characters', () => {
			expect(PersonName.format('Jean-Paul', 'O\'Brien')).toBe('Jean-Paul O\'Brien');
		});
	});

	describe('checkFirstName', () => {
		test('should accept valid first names', () => {
			expect(PersonName.checkFirstName('John')).toBe(true);
			expect(PersonName.checkFirstName('Jean-Paul')).toBe(true);
			expect(PersonName.checkFirstName('O\'Brien')).toBe(true);
			expect(PersonName.checkFirstName('José')).toBe(true);
			expect(PersonName.checkFirstName('François')).toBe(true);
		});

		test('should reject first names shorter than 2 characters', () => {
			expect(PersonName.checkFirstName('J')).toBe(false);
			expect(PersonName.checkFirstName('')).toBe(false);
		});

		test('should reject first names longer than 64 characters', () => {
			const longName = 'A'.repeat(65);
			expect(PersonName.checkFirstName(longName)).toBe(false);
		});

		test('should reject first names with numbers', () => {
			expect(PersonName.checkFirstName('John123')).toBe(false);
		});

		test('should reject first names with special characters', () => {
			expect(PersonName.checkFirstName('John@')).toBe(false);
			expect(PersonName.checkFirstName('John!')).toBe(false);
		});

		test('should accept first names with spaces', () => {
			expect(PersonName.checkFirstName('Jean Paul')).toBe(true);
		});

		test('should accept first names with accented characters', () => {
			expect(PersonName.checkFirstName('Zoé')).toBe(true);
			expect(PersonName.checkFirstName('Chloë')).toBe(true);
		});
	});

	describe('checkLastName', () => {
		test('should accept valid last names', () => {
			expect(PersonName.checkLastName('Doe')).toBe(true);
			expect(PersonName.checkLastName('Smith-Jones')).toBe(true);
			expect(PersonName.checkLastName('O\'Brien')).toBe(true);
			expect(PersonName.checkLastName('Müller')).toBe(true);
		});

		test('should reject last names shorter than 2 characters', () => {
			expect(PersonName.checkLastName('D')).toBe(false);
			expect(PersonName.checkLastName('')).toBe(false);
		});

		test('should reject last names longer than 64 characters', () => {
			const longName = 'A'.repeat(65);
			expect(PersonName.checkLastName(longName)).toBe(false);
		});

		test('should reject last names with numbers', () => {
			expect(PersonName.checkLastName('Doe123')).toBe(false);
		});

		test('should reject last names with special characters', () => {
			expect(PersonName.checkLastName('Doe@')).toBe(false);
			expect(PersonName.checkLastName('Doe!')).toBe(false);
		});

		test('should accept last names with spaces', () => {
			expect(PersonName.checkLastName('Van Der Berg')).toBe(true);
		});
	});
});

describe('Email', () => {
	describe('validateEmail', () => {
		test('should validate correct email addresses', () => {
			expect(Email.validateEmail('test@example.com')).toBe(true);
			expect(Email.validateEmail('user.name@example.com')).toBe(true);
			expect(Email.validateEmail('user+tag@example.co.uk')).toBe(true);
			expect(Email.validateEmail('user_name@example.com')).toBe(true);
		});

		test('should reject invalid email addresses', () => {
			expect(Email.validateEmail('invalid')).toBe(false);
			expect(Email.validateEmail('invalid@')).toBe(false);
			expect(Email.validateEmail('@example.com')).toBe(false);
			expect(Email.validateEmail('invalid@.com')).toBe(false);
			expect(Email.validateEmail('invalid @example.com')).toBe(false);
		});

		test('should reject emails with multiple @ symbols', () => {
			expect(Email.validateEmail('user@@example.com')).toBe(false);
		});

		test('should accept emails with dots in local part', () => {
			expect(Email.validateEmail('first.last@example.com')).toBe(true);
		});

		test('should accept emails with subdomains', () => {
			expect(Email.validateEmail('user@mail.example.com')).toBe(true);
		});
	});

	describe('checkEmail', () => {
		test('should validate correct email addresses', () => {
			expect(Email.checkEmail('test@example.com')).toBe(true);
			expect(Email.checkEmail('user.name@example.co')).toBe(true);
			expect(Email.checkEmail('user_name@example.org')).toBe(true);
		});

		test('should reject invalid email addresses', () => {
			expect(Email.checkEmail('invalid')).toBe(false);
			expect(Email.checkEmail('invalid@')).toBe(false);
			expect(Email.checkEmail('@example.com')).toBe(false);
		});

		test('should reject emails with TLD longer than 5 characters', () => {
			expect(Email.checkEmail('test@example.museum')).toBe(false);
		});

		test('should accept emails with TLD up to 5 characters', () => {
			expect(Email.checkEmail('test@example.co')).toBe(true);
			expect(Email.checkEmail('test@example.com')).toBe(true);
			expect(Email.checkEmail('test@example.info')).toBe(true);
		});
	});

	describe('getMailToLink', () => {
		test('should generate mailto link', () => {
			const email = 'test@example.com';
			const expected = '<a href="mailto:test@example.com">test@example.com</a>';
			expect(Email.getMailToLink(email)).toBe(expected);
		});

		test('should handle email with special characters', () => {
			const email = 'user+tag@example.com';
			const expected = '<a href="mailto:user+tag@example.com">user+tag@example.com</a>';
			expect(Email.getMailToLink(email)).toBe(expected);
		});
	});
});

describe('TelephoneNumber', () => {
	// Mock libphonenumber
	beforeAll(() => {
		global.libphonenumber = {
			parsePhoneNumber: jest.fn((phoneNumber, countryCode) => {
				// Simple mock implementation
				if (phoneNumber === '+33612345678') {
					return {
						country: 'FR',
						formatNational: () => '06 12 34 56 78',
						formatInternational: () => '+33 6 12 34 56 78',
						isValid: () => true,
						getType: () => 'MOBILE'
					};
				}
				if (phoneNumber === '+14155552671') {
					return {
						country: 'US',
						formatNational: () => '(415) 555-2671',
						formatInternational: () => '+1 415-555-2671',
						isValid: () => true,
						getType: () => 'FIXED_LINE_OR_MOBILE'
					};
				}
				if (phoneNumber === 'invalid') {
					throw new Error('Invalid phone number');
				}
				return null;
			})
		};

		global.Country = {
			getCountryName: jest.fn((code) => {
				const countries = { FR: 'France', US: 'United States' };
				return countries[code] || code;
			}),
			getFlagImg: jest.fn((code) => {
				return `<img src="/flags/${code.toLowerCase()}.png" />`;
			})
		};
	});

	afterAll(() => {
		delete global.libphonenumber;
		delete global.Country;
	});

	describe('setLocalCountryCode', () => {
		test('should set local country code', () => {
			TelephoneNumber.setLocalCountryCode('FR');
			expect(TelephoneNumber.localCountryCode).toBe('FR');
		});
	});

	describe('setIntlTelInputUtilsPath', () => {
		test('should set intl tel input utils path', () => {
			const path = '/path/to/utils.js';
			TelephoneNumber.setIntlTelInputUtilsPath(path);
			expect(TelephoneNumber.intlTelInputUtilsPath).toBe(path);
		});
	});

	describe('getCountryIsoCode', () => {
		test('should return country code for valid phone number', () => {
			const result = TelephoneNumber.getCountryIsoCode('+33612345678', 'FR');
			expect(result).toBe('FR');
		});

		test('should return null for invalid phone number', () => {
			const result = TelephoneNumber.getCountryIsoCode('invalid', 'FR');
			expect(result).toBeNull();
		});
	});

	describe('formatNational', () => {
		test('should format phone number in national format', () => {
			const result = TelephoneNumber.formatNational('+33612345678', 'FR');
			expect(result).toBe('06 12 34 56 78');
		});

		test('should return empty string for invalid phone number', () => {
			const result = TelephoneNumber.formatNational('invalid', 'FR');
			expect(result).toBe('');
		});
	});

	describe('formatInternational', () => {
		test('should format phone number in international format', () => {
			const result = TelephoneNumber.formatInternational('+33612345678', 'FR');
			expect(result).toBe('+33 6 12 34 56 78');
		});

		test('should return empty string for invalid phone number', () => {
			const result = TelephoneNumber.formatInternational('invalid', 'FR');
			expect(result).toBe('');
		});
	});

	describe('formatInternationalWithTelLink', () => {
		test('should format phone number with tel link', () => {
			const result = TelephoneNumber.formatInternationalWithTelLink('+33612345678', 'FR');
			expect(result).toBe('<a href="tel:+33612345678">+33 6 12 34 56 78</a>');
		});
	});

	describe('parse', () => {
		test('should parse valid phone number', () => {
			const result = TelephoneNumber.parse('+33612345678', 'FR');
			expect(result).toBe('+33 6 12 34 56 78');
		});

		test('should return null for invalid phone number', () => {
			const result = TelephoneNumber.parse('invalid', 'FR');
			expect(result).toBeNull();
		});
	});

	describe('check', () => {
		test('should validate correct phone number', () => {
			const result = TelephoneNumber.check('+33612345678', 'FR');
			expect(result).toBe(true);
		});

		test('should reject invalid phone number', () => {
			const result = TelephoneNumber.check('invalid', 'FR');
			expect(result).toBe(false);
		});
	});

	describe('checkSyntaxe', () => {
		test('should validate French phone numbers', () => {
			expect(TelephoneNumber.checkSyntaxe('0612345678')).toBe(true);
			expect(TelephoneNumber.checkSyntaxe('06 12 34 56 78')).toBe(true);
			expect(TelephoneNumber.checkSyntaxe('06.12.34.56.78')).toBe(true);
			expect(TelephoneNumber.checkSyntaxe('06-12-34-56-78')).toBe(true);
		});

		test('should validate international phone numbers', () => {
			expect(TelephoneNumber.checkSyntaxe('+33612345678')).toBe(true);
			expect(TelephoneNumber.checkSyntaxe('+33 6 12 34 56 78')).toBe(true);
			expect(TelephoneNumber.checkSyntaxe('0033612345678')).toBe(true);
		});

		test('should reject invalid phone numbers', () => {
			expect(TelephoneNumber.checkSyntaxe('123')).toBe(false);
			expect(TelephoneNumber.checkSyntaxe('abcdefghij')).toBe(false);
		});
	});

	describe('getType', () => {
		test('should return phone type', () => {
			const result = TelephoneNumber.getType('+33612345678', 'FR');
			expect(result).toBe('MOBILE');
		});

		test('should return MASKED for null or empty phone number', () => {
			expect(TelephoneNumber.getType(null, 'FR')).toBe('MASKED');
			expect(TelephoneNumber.getType('', 'FR')).toBe('MASKED');
		});

		test('should return null for invalid phone number', () => {
			const result = TelephoneNumber.getType('invalid', 'FR');
			expect(result).toBeNull();
		});
	});

	describe('getTypeLabelList', () => {
		test('should return type labels object', () => {
			const labels = TelephoneNumber.getTypeLabelList();
			expect(labels).toHaveProperty('MOBILE', 'Mobile');
			expect(labels).toHaveProperty('FIXED_LINE', 'Fixe');
			expect(labels).toHaveProperty('MASKED', 'Masqué');
		});
	});

	describe('getTypeLabel', () => {
		test('should return label for known type', () => {
			expect(TelephoneNumber.getTypeLabel('MOBILE')).toBe('Mobile');
			expect(TelephoneNumber.getTypeLabel('FIXED_LINE')).toBe('Fixe');
		});

		test('should return Inconnu for unknown type', () => {
			expect(TelephoneNumber.getTypeLabel('UNKNOWN_TYPE')).toBe('Inconnu');
		});
	});

	describe('getCountryName', () => {
		test('should return country name for phone number', () => {
			const result = TelephoneNumber.getCountryName('+33612345678', 'FR');
			expect(result).toBe('France');
			expect(Country.getCountryName).toHaveBeenCalledWith('FR');
		});
	});

	describe('getFlagImg', () => {
		test('should return flag image for phone number', () => {
			const result = TelephoneNumber.getFlagImg('+33612345678', 'FR');
			expect(result).toContain('<img src="/flags/fr.png"');
			expect(Country.getFlagImg).toHaveBeenCalledWith('FR');
		});
	});

	describe('formatNationalWithFlagImg', () => {
		test('should format phone number with flag image', () => {
			const result = TelephoneNumber.formatNationalWithFlagImg('+33612345678', 'FR');
			expect(result).toContain('<img src="/flags/fr.png"');
			expect(result).toContain('06 12 34 56 78');
		});
	});

	describe('formatNationalWithFlagImgAndTelLink', () => {
		test('should format phone number with flag and tel link', () => {
			const result = TelephoneNumber.formatNationalWithFlagImgAndTelLink('+33612345678', 'FR');
			expect(result).toContain('<img src="/flags/fr.png"');
			expect(result).toContain('<a href="tel:+33612345678">');
			expect(result).toContain('06 12 34 56 78');
		});
	});
});
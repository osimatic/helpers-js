const { IBAN, BankCard } = require('../bank');

describe('IBAN', () => {
	describe('format', () => {
		test('should format IBAN with spaces every 4 characters', () => {
			const iban = 'FR7630006000011234567890189';
			expect(IBAN.format(iban)).toBe('FR76 3000 6000 0112 3456 7890 189');
		});

		test('should remove non-alphanumeric characters', () => {
			const iban = 'FR76-3000-6000-0112-3456-7890-189';
			expect(IBAN.format(iban)).toBe('FR76 3000 6000 0112 3456 7890 189');
		});

		test('should handle IBAN with spaces', () => {
			const iban = 'FR76 3000 6000 0112 3456 7890 189';
			expect(IBAN.format(iban)).toBe('FR76 3000 6000 0112 3456 7890 189');
		});

		test('should handle lowercase letters', () => {
			const iban = 'fr7630006000011234567890189';
			expect(IBAN.format(iban)).toBe('FR76 3000 6000 0112 3456 7890 189');
		});

		test('should remove special characters and spaces', () => {
			const iban = 'FR76 3000.6000/0112-3456_7890*189';
			expect(IBAN.format(iban)).toBe('FR76 3000 6000 0112 3456 7890 189');
		});

		test('should handle German IBAN', () => {
			const iban = 'DE89370400440532013000';
			expect(IBAN.format(iban)).toBe('DE89 3704 0044 0532 0130 00');
		});

		test('should handle Belgian IBAN', () => {
			const iban = 'BE68539007547034';
			expect(IBAN.format(iban)).toBe('BE68 5390 0754 7034');
		});

		test('should handle empty string', () => {
			expect(IBAN.format('')).toBe('');
		});

		test('should handle IBAN with mixed case and special chars', () => {
			const iban = 'fR76@3000#6000$0112%3456^7890&189';
			expect(IBAN.format(iban)).toBe('FR76 3000 6000 0112 3456 7890 189');
		});
	});
});

describe('BankCard', () => {
	describe('formatCardNumber', () => {
		test('should format 16-digit card number with dashes', () => {
			const cardNumber = '1234567890123456';
			expect(BankCard.formatCardNumber(cardNumber)).toBe('1234-5678-9012-3456');
		});

		test('should replace asterisks with X', () => {
			const cardNumber = '1234********3456';
			expect(BankCard.formatCardNumber(cardNumber)).toBe('1234-****-****-3456');
		});

		test('should replace asterisks with custom hiddenChar', () => {
			const cardNumber = '1234********3456';
			expect(BankCard.formatCardNumber(cardNumber, 'X')).toBe('1234-XXXX-XXXX-3456');
		});

		test('should replace X with custom hiddenChar', () => {
			const cardNumber = '1234XXXXXXXX3456';
			expect(BankCard.formatCardNumber(cardNumber, '#')).toBe('1234-####-####-3456');
		});

		test('should replace both * and X with hiddenChar', () => {
			const cardNumber = '1234**XX**XX3456';
			// After formatting: 1234-**XX-**XX-3456
			// After replacing * and X with -: 1234-----------3456 (11 dashes: 3 from formatting + 8 from replacement)
			expect(BankCard.formatCardNumber(cardNumber, '-')).toBe('1234-----------3456');
		});

		test('should handle lowercase x', () => {
			const cardNumber = '1234xxxxxxxx3456';
			expect(BankCard.formatCardNumber(cardNumber, '•')).toBe('1234-••••-••••-3456');
		});

		test('should not format if not 16 digits', () => {
			const cardNumber = '12345678901234';
			expect(BankCard.formatCardNumber(cardNumber)).toBe('12345678901234');
		});

		test('should not format if more than 16 digits', () => {
			const cardNumber = '12345678901234567';
			expect(BankCard.formatCardNumber(cardNumber)).toBe('12345678901234567');
		});

		test('should handle card number with all zeros', () => {
			const cardNumber = '0000000000000000';
			expect(BankCard.formatCardNumber(cardNumber)).toBe('0000-0000-0000-0000');
		});

		test('should handle card number with letters (treated as 16 chars)', () => {
			const cardNumber = '123456789012ABCD';
			expect(BankCard.formatCardNumber(cardNumber)).toBe('1234-5678-9012-ABCD');
		});

		test('should handle empty string', () => {
			expect(BankCard.formatCardNumber('')).toBe('');
		});
	});

	describe('formatExpirationDate', () => {
		// Mock SqlDateTime since it's imported from another module
		beforeAll(() => {
			global.SqlDateTime = {
				getMonthName: jest.fn((date, locale) => {
					// Mock implementation
					const d = new Date(date);
					const month = d.toLocaleString(locale, { month: 'long' });
					return month.charAt(0).toUpperCase() + month.slice(1);
				}),
				getYear: jest.fn((date) => {
					const d = new Date(date);
					return d.getFullYear();
				})
			};
		});

		afterAll(() => {
			delete global.SqlDateTime;
		});

		test('should format expiration date in French', () => {
			const date = '2025-12-31';
			const result = BankCard.formatExpirationDate(date, 'fr-FR');
			expect(result).toContain('2025');
			expect(SqlDateTime.getMonthName).toHaveBeenCalledWith(date, 'fr-FR');
			expect(SqlDateTime.getYear).toHaveBeenCalledWith(date);
		});

		test('should use default locale fr-FR', () => {
			const date = '2025-06-15';
			BankCard.formatExpirationDate(date);
			expect(SqlDateTime.getMonthName).toHaveBeenCalledWith(date, 'fr-FR');
		});

		test('should format expiration date in English', () => {
			const date = '2025-03-20';
			const result = BankCard.formatExpirationDate(date, 'en-US');
			expect(result).toContain('2025');
			expect(SqlDateTime.getMonthName).toHaveBeenCalledWith(date, 'en-US');
		});

		test('should handle different date formats', () => {
			const date = '2026-01-01';
			const result = BankCard.formatExpirationDate(date);
			expect(result).toContain('2026');
		});
	});
});
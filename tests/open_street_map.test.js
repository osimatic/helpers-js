const { OpenStreetMap } = require('../open_street_map');

describe('OpenStreetMap', () => {
	describe('getUrl', () => {
		test('should generate OpenStreetMap URL with latitude and longitude', () => {
			const url = OpenStreetMap.getUrl(48.8566, 2.3522);

			expect(url).toBe('https://www.openstreetmap.org/?mlat=48.8566&mlon=2.3522#map=17/48.8566/2.3522&layers=N');
		});

		test('should handle negative coordinates', () => {
			const url = OpenStreetMap.getUrl(-33.8688, 151.2093);

			expect(url).toContain('mlat=-33.8688');
			expect(url).toContain('mlon=151.2093');
		});

		test('should handle zero coordinates', () => {
			const url = OpenStreetMap.getUrl(0, 0);

			expect(url).toContain('mlat=0');
			expect(url).toContain('mlon=0');
		});

		test('should include zoom level 17', () => {
			const url = OpenStreetMap.getUrl(48.8566, 2.3522);

			expect(url).toContain('#map=17/');
		});

		test('should include layers=N parameter', () => {
			const url = OpenStreetMap.getUrl(48.8566, 2.3522);

			expect(url).toContain('&layers=N');
		});
	});

	describe('getUrlFromCoordinates', () => {
		test('should parse coordinate string and generate URL', () => {
			const url = OpenStreetMap.getUrlFromCoordinates('48.8566,2.3522');

			expect(url).toBe('https://www.openstreetmap.org/?mlat=48.8566&mlon=2.3522#map=17/48.8566/2.3522&layers=N');
		});

		test('should handle negative coordinates in string', () => {
			const url = OpenStreetMap.getUrlFromCoordinates('-33.8688,151.2093');

			expect(url).toContain('mlat=-33.8688');
			expect(url).toContain('mlon=151.2093');
		});

		test('should parse coordinates with spaces', () => {
			const url = OpenStreetMap.getUrlFromCoordinates('48.8566, 2.3522');

			expect(url).toContain('mlat=48.8566');
			expect(url).toContain('mlon=2.3522');
		});

		test('should handle decimal coordinates', () => {
			const url = OpenStreetMap.getUrlFromCoordinates('48.856614,2.352222');

			expect(url).toContain('mlat=48.856614');
			expect(url).toContain('mlon=2.352222');
		});
	});

	describe('getCountryBoundingBoxes', () => {
		test('should return object with country codes', () => {
			const boxes = OpenStreetMap.getCountryBoundingBoxes();

			expect(typeof boxes).toBe('object');
			expect(boxes).toHaveProperty('fr');
			expect(boxes).toHaveProperty('de');
			expect(boxes).toHaveProperty('us');
		});

		test('should have France bounding box', () => {
			const boxes = OpenStreetMap.getCountryBoundingBoxes();

			expect(boxes.fr).toEqual([[41.333, -5.142], [51.091, 9.559]]);
		});

		test('should have Germany bounding box', () => {
			const boxes = OpenStreetMap.getCountryBoundingBoxes();

			expect(boxes.de).toEqual([[47.270, 5.866], [55.058, 15.041]]);
		});

		test('should have USA bounding box', () => {
			const boxes = OpenStreetMap.getCountryBoundingBoxes();

			expect(boxes.us).toEqual([[24.396, -124.848], [49.384, -66.885]]);
		});

		test('should include European countries', () => {
			const boxes = OpenStreetMap.getCountryBoundingBoxes();

			expect(boxes).toHaveProperty('fr'); // France
			expect(boxes).toHaveProperty('de'); // Germany
			expect(boxes).toHaveProperty('es'); // Spain
			expect(boxes).toHaveProperty('it'); // Italy
			expect(boxes).toHaveProperty('gb'); // UK
		});

		test('should include Asian countries', () => {
			const boxes = OpenStreetMap.getCountryBoundingBoxes();

			expect(boxes).toHaveProperty('cn'); // China
			expect(boxes).toHaveProperty('in'); // India
			expect(boxes).toHaveProperty('jp'); // Japan
		});

		test('should include American countries', () => {
			const boxes = OpenStreetMap.getCountryBoundingBoxes();

			expect(boxes).toHaveProperty('us'); // USA
			expect(boxes).toHaveProperty('ca'); // Canada
			expect(boxes).toHaveProperty('br'); // Brazil
			expect(boxes).toHaveProperty('mx'); // Mexico
		});

		test('should include African countries', () => {
			const boxes = OpenStreetMap.getCountryBoundingBoxes();

			expect(boxes).toHaveProperty('ma'); // Morocco
			expect(boxes).toHaveProperty('eg'); // Egypt
			expect(boxes).toHaveProperty('za'); // South Africa
		});

		test('should have bounding box format [[S,W], [N,E]]', () => {
			const boxes = OpenStreetMap.getCountryBoundingBoxes();
			const frBox = boxes.fr;

			expect(Array.isArray(frBox)).toBe(true);
			expect(frBox).toHaveLength(2);
			expect(Array.isArray(frBox[0])).toBe(true);
			expect(Array.isArray(frBox[1])).toBe(true);
			expect(frBox[0]).toHaveLength(2);
			expect(frBox[1]).toHaveLength(2);
		});
	});

	describe('getCountryBoundingBox', () => {
		test('should return bounding box for France', () => {
			const box = OpenStreetMap.getCountryBoundingBox('FR');

			expect(box).toEqual([[41.333, -5.142], [51.091, 9.559]]);
		});

		test('should be case insensitive', () => {
			const boxUpper = OpenStreetMap.getCountryBoundingBox('FR');
			const boxLower = OpenStreetMap.getCountryBoundingBox('fr');
			const boxMixed = OpenStreetMap.getCountryBoundingBox('Fr');

			expect(boxLower).toEqual(boxUpper);
			expect(boxMixed).toEqual(boxUpper);
		});

		test('should handle whitespace in country code', () => {
			const box = OpenStreetMap.getCountryBoundingBox(' FR ');

			expect(box).toEqual([[41.333, -5.142], [51.091, 9.559]]);
		});

		test('should return null for unknown country code', () => {
			const box = OpenStreetMap.getCountryBoundingBox('XX');

			expect(box).toBeNull();
		});

		test('should return null for empty string', () => {
			const box = OpenStreetMap.getCountryBoundingBox('');

			expect(box).toBeNull();
		});

		test('should return null for null', () => {
			const box = OpenStreetMap.getCountryBoundingBox(null);

			expect(box).toBeNull();
		});

		test('should return null for undefined', () => {
			const box = OpenStreetMap.getCountryBoundingBox(undefined);

			expect(box).toBeNull();
		});

		test('should return bounding box for Germany', () => {
			const box = OpenStreetMap.getCountryBoundingBox('DE');

			expect(box).toEqual([[47.270, 5.866], [55.058, 15.041]]);
		});

		test('should return bounding box for USA', () => {
			const box = OpenStreetMap.getCountryBoundingBox('US');

			expect(box).toEqual([[24.396, -124.848], [49.384, -66.885]]);
		});

		test('should return bounding box for Japan', () => {
			const box = OpenStreetMap.getCountryBoundingBox('JP');

			expect(box).toEqual([[24.249, 122.938], [45.557, 153.987]]);
		});

		test('should return bounding box for Brazil', () => {
			const box = OpenStreetMap.getCountryBoundingBox('BR');

			expect(box).toEqual([[-33.751, -73.987], [5.271, -34.729]]);
		});
	});

	describe('centerOnFrance', () => {
		test('should call setView with France coordinates', () => {
			const mockMap = {
				setView: jest.fn()
			};

			OpenStreetMap.centerOnFrance(mockMap);

			expect(mockMap.setView).toHaveBeenCalledWith([46.52863469527167, 2.43896484375], 6);
		});

		test('should use zoom level 6', () => {
			const mockMap = {
				setView: jest.fn()
			};

			OpenStreetMap.centerOnFrance(mockMap);

			expect(mockMap.setView).toHaveBeenCalledWith(expect.any(Array), 6);
		});
	});

	describe('centerMapToCoordinates', () => {
		test('should call setView with provided coordinates', () => {
			const mockMap = {
				setView: jest.fn(),
				getZoom: jest.fn(() => 10)
			};

			OpenStreetMap.centerMapToCoordinates(mockMap, 48.8566, 2.3522);

			expect(mockMap.setView).toHaveBeenCalledWith([48.8566, 2.3522], 15);
		});

		test('should use minimum zoom of 15 if current zoom is lower', () => {
			const mockMap = {
				setView: jest.fn(),
				getZoom: jest.fn(() => 10)
			};

			OpenStreetMap.centerMapToCoordinates(mockMap, 48.8566, 2.3522);

			expect(mockMap.setView).toHaveBeenCalledWith(expect.any(Array), 15);
		});

		test('should keep current zoom if higher than 15', () => {
			const mockMap = {
				setView: jest.fn(),
				getZoom: jest.fn(() => 18)
			};

			OpenStreetMap.centerMapToCoordinates(mockMap, 48.8566, 2.3522);

			expect(mockMap.setView).toHaveBeenCalledWith(expect.any(Array), 18);
		});

		test('should not call setView when map is null', () => {
			const mockMap = {
				setView: jest.fn(),
				getZoom: jest.fn(() => 10)
			};

			OpenStreetMap.centerMapToCoordinates(null, 48.8566, 2.3522);

			expect(mockMap.setView).not.toHaveBeenCalled();
		});

		test('should handle negative coordinates', () => {
			const mockMap = {
				setView: jest.fn(),
				getZoom: jest.fn(() => 10)
			};

			OpenStreetMap.centerMapToCoordinates(mockMap, -33.8688, 151.2093);

			expect(mockMap.setView).toHaveBeenCalledWith([-33.8688, 151.2093], 15);
		});
	});

	describe('centerMapToLocations', () => {
		test('should call fitBounds with location bounds', () => {
			const mockMap = {
				invalidateSize: jest.fn(),
				fitBounds: jest.fn(),
				getZoom: jest.fn(() => 12),
				setZoom: jest.fn()
			};

			// Mock L.latLngBounds
			global.L = {
				latLngBounds: jest.fn((locations) => ({
					_bounds: locations
				}))
			};

			const locations = [[48.8566, 2.3522], [48.8606, 2.3376]];
			OpenStreetMap.centerMapToLocations(mockMap, locations);

			expect(mockMap.invalidateSize).toHaveBeenCalledWith(false);
			expect(global.L.latLngBounds).toHaveBeenCalledWith(locations);
			expect(mockMap.fitBounds).toHaveBeenCalled();

			delete global.L;
		});

		test('should not do anything when map is null', () => {
			const mockMap = {
				invalidateSize: jest.fn(),
				fitBounds: jest.fn()
			};

			OpenStreetMap.centerMapToLocations(null, [[48.8566, 2.3522]]);

			expect(mockMap.invalidateSize).not.toHaveBeenCalled();
		});

		test('should not do anything when locations list is empty', () => {
			const mockMap = {
				invalidateSize: jest.fn(),
				fitBounds: jest.fn()
			};

			OpenStreetMap.centerMapToLocations(mockMap, []);

			expect(mockMap.invalidateSize).not.toHaveBeenCalled();
		});

		test('should set zoom to maxZoom if current zoom exceeds it', () => {
			const mockMap = {
				invalidateSize: jest.fn(),
				fitBounds: jest.fn(),
				getZoom: jest.fn(() => 20),
				setZoom: jest.fn()
			};

			global.L = {
				latLngBounds: jest.fn((locations) => ({
					_bounds: locations
				}))
			};

			const locations = [[48.8566, 2.3522]];
			OpenStreetMap.centerMapToLocations(mockMap, locations, [20, 20], 18);

			expect(mockMap.setZoom).toHaveBeenCalledWith(18);

			delete global.L;
		});

		test('should use custom padding', () => {
			const mockMap = {
				invalidateSize: jest.fn(),
				fitBounds: jest.fn(),
				getZoom: jest.fn(() => 12),
				setZoom: jest.fn()
			};

			global.L = {
				latLngBounds: jest.fn((locations) => ({
					_bounds: locations
				}))
			};

			const locations = [[48.8566, 2.3522]];
			OpenStreetMap.centerMapToLocations(mockMap, locations, [50, 50]);

			expect(mockMap.fitBounds).toHaveBeenCalledWith(
				expect.anything(),
				{ padding: [50, 50] }
			);

			delete global.L;
		});
	});
});
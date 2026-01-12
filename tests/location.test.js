const { Country, GeographicCoordinates, Polygon } = require('../location');

describe('Country', () => {
	describe('getCountries', () => {
		test('should return an object with country codes', () => {
			const countries = Country.getCountries();
			expect(typeof countries).toBe('object');
			expect(countries).toHaveProperty('FR');
			expect(countries).toHaveProperty('US');
			expect(countries).toHaveProperty('GB');
		});

		test('should have correct country names', () => {
			const countries = Country.getCountries();
			expect(countries.FR).toBe('France');
			expect(countries.US).toBe('United States');
			expect(countries.GB).toBe('United Kingdom');
		});
	});

	describe('getCountryName', () => {
		test('should return country name for valid code', () => {
			expect(Country.getCountryName('FR')).toBe('France');
			expect(Country.getCountryName('US')).toBe('United States');
			expect(Country.getCountryName('CA')).toBe('Canada');
		});

		test('should return the code itself if country not found', () => {
			expect(Country.getCountryName('XX')).toBe('XX');
			expect(Country.getCountryName('ZZZ')).toBe('ZZZ');
		});
	});

	describe('getContinents', () => {
		test('should return an object with continent IDs', () => {
			const continents = Country.getContinents();
			expect(typeof continents).toBe('object');
			expect(continents[1]).toBe('Europe');
			expect(continents[3]).toBe('Afrique');
			expect(continents[6]).toBe('Asie');
		});
	});

	describe('getFlagPath', () => {
		test('should return correct flag path', () => {
			const path = Country.getFlagPath('FR');
			expect(path).toContain('fr.png');
		});

		test('should lowercase the country code', () => {
			const path = Country.getFlagPath('US');
			expect(path).toContain('us.png');
		});

		test('should use custom flags path when set', () => {
			Country.setFlagsPath('/custom/flags/');
			const path = Country.getFlagPath('FR');
			expect(path).toBe('/custom/flags/fr.png');

			// Reset for other tests
			Country.flagsPath = undefined;
		});

		test('should use default path when not set', () => {
			Country.flagsPath = undefined;
			const path = Country.getFlagPath('DE');
			expect(path).toBe('/de.png');
		});
	});

	describe('getFlagImg', () => {
		test('should return HTML img tag', () => {
			const html = Country.getFlagImg('FR');
			expect(html).toContain('<img');
			expect(html).toContain('src=');
			expect(html).toContain('fr.png');
			expect(html).toContain('class="flag"');
		});

		test('should include country name in title', () => {
			const html = Country.getFlagImg('US');
			expect(html).toContain('title="United States"');
		});

		test('should wrap img in span', () => {
			const html = Country.getFlagImg('GB');
			expect(html).toMatch(/^<span>/);
			expect(html).toMatch(/<\/span>$/);
		});
	});

	describe('getCountryList', () => {
		test('should return the same as getCountries (deprecated)', () => {
			const list = Country.getCountryList();
			const countries = Country.getCountries();
			expect(list).toEqual(countries);
		});
	});
});

describe('GeographicCoordinates', () => {
	describe('check', () => {
		test('should validate correct coordinates', () => {
			expect(GeographicCoordinates.check('48.8566,2.3522')).toBe(true);
			expect(GeographicCoordinates.check('0,0')).toBe(true);
			expect(GeographicCoordinates.check('-45.5,-73.6')).toBe(true);
			expect(GeographicCoordinates.check('90,180')).toBe(true);
			expect(GeographicCoordinates.check('-90,-180')).toBe(true);
		});

		test('should reject invalid coordinates', () => {
			expect(GeographicCoordinates.check('91,180')).toBe(false);
			expect(GeographicCoordinates.check('45,181')).toBe(false);
			expect(GeographicCoordinates.check('abc,def')).toBe(false);
			expect(GeographicCoordinates.check('45')).toBe(false);
		});
	});

	describe('parse', () => {
		test('should parse valid coordinate string', () => {
			const coords = GeographicCoordinates.parse('48.8566,2.3522');
			expect(coords).toEqual([48.8566, 2.3522]);
		});

		test('should handle spaces and semicolons', () => {
			expect(GeographicCoordinates.parse('48.8566, 2.3522')).toEqual([48.8566, 2.3522]);
			expect(GeographicCoordinates.parse('48.8566;2.3522')).toEqual([48.8566, 2.3522]);
			expect(GeographicCoordinates.parse('  48.8566  ,  2.3522  ')).toEqual([48.8566, 2.3522]);
		});

		test('should return null for invalid input', () => {
			expect(GeographicCoordinates.parse(null)).toBeNull();
			expect(GeographicCoordinates.parse('')).toBeNull();
			expect(GeographicCoordinates.parse('NaN,NaN')).toBeNull();
			expect(GeographicCoordinates.parse('invalid')).toBeNull();
		});

		test('should return string when asString=true', () => {
			const coords = GeographicCoordinates.parse('48.8566,2.3522', true);
			expect(typeof coords).toBe('string');
		});
	});

	describe('toFixed', () => {
		test('should format number with default 6 decimals', () => {
			expect(GeographicCoordinates.toFixed(48.85661234)).toBe('48.856612');
		});

		test('should format number with custom decimals', () => {
			expect(GeographicCoordinates.toFixed(48.85661234, 2)).toBe('48.86');
			expect(GeographicCoordinates.toFixed(48.85661234, 4)).toBe('48.8566');
		});
	});

	describe('format', () => {
		test('should format coordinates with default 6 decimals', () => {
			expect(GeographicCoordinates.format(48.8566, 2.3522)).toBe('48.856600,2.352200');
		});

		test('should format coordinates with custom decimals', () => {
			expect(GeographicCoordinates.format(48.8566, 2.3522, 2)).toBe('48.86,2.35');
		});
	});

	describe('convertToGeoJson', () => {
		test('should convert to GeoJSON Point format', () => {
			const geoJson = GeographicCoordinates.convertToGeoJson(48.8566, 2.3522);
			expect(geoJson).toEqual({
				type: 'Point',
				coordinates: [2.3522, 48.8566]
			});
		});

		test('should convert strings to numbers', () => {
			const geoJson = GeographicCoordinates.convertToGeoJson('48.8566', '2.3522');
			expect(geoJson.coordinates[0]).toBe(2.3522);
			expect(geoJson.coordinates[1]).toBe(48.8566);
		});
	});

	describe('parseFromGeoJson', () => {
		test('should parse GeoJSON Point to [lat, long]', () => {
			const geoJson = { type: 'Point', coordinates: [2.3522, 48.8566] };
			const coords = GeographicCoordinates.parseFromGeoJson(geoJson);
			expect(coords).toEqual([48.8566, 2.3522]);
		});

		test('should parse GeoJSON string', () => {
			const geoJsonStr = '{"type":"Point","coordinates":[2.3522,48.8566]}';
			const coords = GeographicCoordinates.parseFromGeoJson(geoJsonStr);
			expect(coords).toEqual([48.8566, 2.3522]);
		});

		test('should return null for invalid GeoJSON', () => {
			expect(GeographicCoordinates.parseFromGeoJson({ type: 'Point', coordinates: [] })).toBeNull();
			expect(GeographicCoordinates.parseFromGeoJson({ type: 'Point' })).toBeNull();
		});

		test('should return string when asString=true', () => {
			const geoJson = { type: 'Point', coordinates: [2.3522, 48.8566] };
			const coords = GeographicCoordinates.parseFromGeoJson(geoJson, true);
			expect(coords).toBe('48.8566,2.3522');
		});
	});

	describe('formatPoint', () => {
		test('should format GeoJSON Point with default 6 decimals', () => {
			const geoJsonPoint = { type: 'Point', coordinates: [2.3522123, 48.8566789] };
			const formatted = GeographicCoordinates.formatPoint(geoJsonPoint);
			expect(formatted).toBe('48.856679,2.352212');
		});

		test('should format GeoJSON Point with custom decimals', () => {
			const geoJsonPoint = { type: 'Point', coordinates: [2.3522, 48.8566] };
			const formatted = GeographicCoordinates.formatPoint(geoJsonPoint, 2);
			expect(formatted).toBe('48.86,2.35');
		});

		test('should return empty string for invalid GeoJSON Point', () => {
			const invalidPoint1 = { type: 'Point', coordinates: [] };
			const invalidPoint2 = { type: 'Point' };
			expect(GeographicCoordinates.formatPoint(invalidPoint1)).toBe('');
			expect(GeographicCoordinates.formatPoint(invalidPoint2)).toBe('');
		});

		test('should handle GeoJSON Point as JSON string', () => {
			const geoJsonStr = '{"type":"Point","coordinates":[2.3522,48.8566]}';
			const formatted = GeographicCoordinates.formatPoint(geoJsonStr, 4);
			expect(formatted).toBe('48.8566,2.3522');
		});
	});

	describe('haversine', () => {
		test('should calculate distance between two points', () => {
			// Paris to London: ~344 km
			const distance = GeographicCoordinates.haversine(48.8566, 2.3522, 51.5074, -0.1278);
			expect(distance).toBeGreaterThan(340000);
			expect(distance).toBeLessThan(345000);
		});

		test('should return 0 for same coordinates', () => {
			const distance = GeographicCoordinates.haversine(48.8566, 2.3522, 48.8566, 2.3522);
			expect(distance).toBe(0);
		});
	});

	describe('isPointCorrespondingToLocationsList', () => {
		test('should return true when point matches string coordinate in list', () => {
			const locationsList = ['48.8566,2.3522', '51.5074,-0.1278'];
			expect(GeographicCoordinates.isPointCorrespondingToLocationsList(48.8566, 2.3522, locationsList, 1)).toBe(true);
		});

		test('should return true when point matches GeoJSON Point in list', () => {
			const locationsList = [
				{ type: 'Point', coordinates: [2.3522, 48.8566] }
			];
			expect(GeographicCoordinates.isPointCorrespondingToLocationsList(48.8566, 2.3522, locationsList, 1)).toBe(true);
		});

		test('should return false when point does not match any location', () => {
			const locationsList = ['51.5074,-0.1278'];
			expect(GeographicCoordinates.isPointCorrespondingToLocationsList(48.8566, 2.3522, locationsList, 1)).toBe(false);
		});

		test('should return true when point is inside polygon', () => {
			const locationsList = [
				{
					type: 'Polygon',
					coordinates: [[
						[2.3, 48.8],
						[2.4, 48.8],
						[2.4, 48.9],
						[2.3, 48.9],
						[2.3, 48.8]
					]]
				}
			];
			expect(GeographicCoordinates.isPointCorrespondingToLocationsList(48.85, 2.35, locationsList)).toBe(true);
		});

		test('should skip null/undefined items in list', () => {
			const locationsList = [null, undefined, { type: 'Point', coordinates: [2.3522, 48.8566] }];
			expect(GeographicCoordinates.isPointCorrespondingToLocationsList(48.8566, 2.3522, locationsList, 1)).toBe(true);
		});

		test('should handle invalid string coordinates in list', () => {
			const locationsList = ['invalid', '48.8566,2.3522'];
			expect(GeographicCoordinates.isPointCorrespondingToLocationsList(48.8566, 2.3522, locationsList, 1)).toBe(true);
		});

		test('should handle invalid Point without coordinates', () => {
			const locationsList = [{ type: 'Point' }, { type: 'Point', coordinates: [2.3522, 48.8566] }];
			expect(GeographicCoordinates.isPointCorrespondingToLocationsList(48.8566, 2.3522, locationsList, 1)).toBe(true);
		});
	});

	describe('getAllLatLongsFromGeoJsonList', () => {
		test('should extract coordinates from Point', () => {
			const geoJsonList = [
				{ type: 'Point', coordinates: [2.3522, 48.8566] }
			];
			const coords = GeographicCoordinates.getAllLatLongsFromGeoJsonList(geoJsonList);
			expect(coords).toEqual([[48.8566, 2.3522]]);
		});

		test('should extract coordinates from Polygon', () => {
			const geoJsonList = [
				{
					type: 'Polygon',
					coordinates: [[
						[2.3, 48.8],
						[2.4, 48.9]
					]]
				}
			];
			const coords = GeographicCoordinates.getAllLatLongsFromGeoJsonList(geoJsonList);
			expect(coords).toEqual([[48.8, 2.3], [48.9, 2.4]]);
		});

		test('should handle mixed GeoJSON types', () => {
			const geoJsonList = [
				{ type: 'Point', coordinates: [2.3522, 48.8566] },
				{
					type: 'Polygon',
					coordinates: [[
						[2.3, 48.8],
						[2.4, 48.9]
					]]
				}
			];
			const coords = GeographicCoordinates.getAllLatLongsFromGeoJsonList(geoJsonList);
			expect(coords.length).toBe(3);
		});
	});
});

describe('Polygon', () => {
	describe('convertToGeoJson', () => {
		test('should convert latlngs to GeoJSON Polygon', () => {
			const latlngs = [
				{ lat: 48.8, lng: 2.3 },
				{ lat: 48.9, lng: 2.4 },
				{ lat: 48.85, lng: 2.5 }
			];
			const geoJson = Polygon.convertToGeoJson(latlngs);
			expect(geoJson.type).toBe('Polygon');
			expect(geoJson.coordinates[0]).toHaveLength(4); // Should be closed
			expect(geoJson.coordinates[0][0]).toEqual([2.3, 48.8]);
			expect(geoJson.coordinates[0][3]).toEqual([2.3, 48.8]); // Closed
		});

		test('should handle multi-ring polygons', () => {
			const latlngs = [
				[
					{ lat: 48.8, lng: 2.3 },
					{ lat: 48.9, lng: 2.4 },
					{ lat: 48.85, lng: 2.5 }
				]
			];
			const geoJson = Polygon.convertToGeoJson(latlngs);
			expect(geoJson.type).toBe('Polygon');
			expect(geoJson.coordinates).toHaveLength(1);
		});

		test('should not duplicate closing point if already closed', () => {
			const latlngs = [
				{ lat: 48.8, lng: 2.3 },
				{ lat: 48.9, lng: 2.4 },
				{ lat: 48.85, lng: 2.5 },
				{ lat: 48.8, lng: 2.3 }
			];
			const geoJson = Polygon.convertToGeoJson(latlngs);
			expect(geoJson.coordinates[0]).toHaveLength(4);
		});
	});

	describe('format', () => {
		test('should format a valid polygon', () => {
			const polygon = {
				type: 'Polygon',
				coordinates: [[
					[2.3, 48.8],
					[2.4, 48.9],
					[2.5, 48.85],
					[2.3, 48.8]
				]]
			};
			const formatted = Polygon.format(polygon);
			expect(formatted).toHaveProperty('label');
			expect(formatted).toHaveProperty('title');
			expect(formatted.label).toContain('Polygone de');
			expect(formatted.label).toContain('sommets');
		});

		test('should handle empty polygon', () => {
			const polygon = {
				type: 'Polygon',
				coordinates: [[]]
			};
			const formatted = Polygon.format(polygon);
			expect(formatted.label).toBe('Polygon (vide)');
		});

		test('should parse JSON string', () => {
			const polygonStr = '{"type":"Polygon","coordinates":[[[2.3,48.8],[2.4,48.9],[2.3,48.8]]]}';
			const formatted = Polygon.format(polygonStr);
			expect(formatted).toHaveProperty('label');
		});
	});

	describe('getStartCoordinates', () => {
		test('should return start coordinates as array', () => {
			const polygon = {
				type: 'Polygon',
				coordinates: [[
					[2.3, 48.8],
					[2.4, 48.9],
					[2.3, 48.8]
				]]
			};
			const coords = Polygon.getStartCoordinates(polygon);
			expect(coords).toEqual([48.8, 2.3]);
		});

		test('should return start coordinates as string when asString=true', () => {
			const polygon = {
				type: 'Polygon',
				coordinates: [[
					[2.3, 48.8],
					[2.4, 48.9],
					[2.3, 48.8]
				]]
			};
			const coords = Polygon.getStartCoordinates(polygon, true);
			expect(coords).toBe('48.8,2.3');
		});

		test('should return null for empty polygon', () => {
			const polygon = {
				type: 'Polygon',
				coordinates: [[]]
			};
			const coords = Polygon.getStartCoordinates(polygon);
			expect(coords).toBeNull();
		});
	});

	describe('isPointOnSegmentDeg', () => {
		test('should return true for point on segment', () => {
			const A = [0, 0];
			const B = [2, 2];
			expect(Polygon.isPointOnSegmentDeg(1, 1, A, B)).toBe(true);
		});

		test('should return false for point not on segment', () => {
			const A = [0, 0];
			const B = [2, 2];
			expect(Polygon.isPointOnSegmentDeg(1, 0, A, B)).toBe(false);
		});

		test('should return true for point at segment endpoints', () => {
			const A = [0, 0];
			const B = [2, 2];
			expect(Polygon.isPointOnSegmentDeg(0, 0, A, B)).toBe(true);
			expect(Polygon.isPointOnSegmentDeg(2, 2, A, B)).toBe(true);
		});
	});

	describe('isPointInRing', () => {
		test('should return true for point inside ring', () => {
			const ring = [
				[0, 0],
				[4, 0],
				[4, 4],
				[0, 4],
				[0, 0]
			];
			expect(Polygon.isPointInRing(2, 2, ring)).toBe(true);
		});

		test('should return false for point outside ring', () => {
			const ring = [
				[0, 0],
				[4, 0],
				[4, 4],
				[0, 4],
				[0, 0]
			];
			expect(Polygon.isPointInRing(5, 5, ring)).toBe(false);
		});

		test('should return true for point on ring edge', () => {
			const ring = [
				[0, 0],
				[4, 0],
				[4, 4],
				[0, 4],
				[0, 0]
			];
			expect(Polygon.isPointInRing(2, 0, ring)).toBe(true);
		});
	});

	describe('isPointInPolygon', () => {
		test('should return true for point inside polygon', () => {
			const polygon = {
				type: 'Polygon',
				coordinates: [[
					[0, 0],
					[4, 0],
					[4, 4],
					[0, 4],
					[0, 0]
				]]
			};
			expect(Polygon.isPointInPolygon(2, 2, polygon)).toBe(true);
		});

		test('should return false for point outside polygon', () => {
			const polygon = {
				type: 'Polygon',
				coordinates: [[
					[0, 0],
					[4, 0],
					[4, 4],
					[0, 4],
					[0, 0]
				]]
			};
			expect(Polygon.isPointInPolygon(5, 5, polygon)).toBe(false);
		});

		test('should return false for point in hole', () => {
			const polygon = {
				type: 'Polygon',
				coordinates: [
					// Outer ring
					[
						[0, 0],
						[4, 0],
						[4, 4],
						[0, 4],
						[0, 0]
					],
					// Hole
					[
						[1, 1],
						[3, 1],
						[3, 3],
						[1, 3],
						[1, 1]
					]
				]
			};
			expect(Polygon.isPointInPolygon(2, 2, polygon)).toBe(false);
		});
	});

	describe('toLatLngRings', () => {
		test('should convert GeoJSON to LatLng rings', () => {
			const polygon = {
				type: 'Polygon',
				coordinates: [[
					[2.3, 48.8],
					[2.4, 48.9],
					[2.5, 48.85],
					[2.3, 48.8]
				]]
			};
			const rings = Polygon.toLatLngRings(polygon);
			expect(rings).toHaveLength(1);
			expect(rings[0][0]).toEqual([48.8, 2.3]);
		});

		test('should return false for invalid polygon', () => {
			const polygon = { type: 'Polygon', coordinates: [] };
			expect(Polygon.toLatLngRings(polygon)).toBe(false);
		});

		test('should close unclosed rings', () => {
			const polygon = {
				type: 'Polygon',
				coordinates: [[
					[2.3, 48.8],
					[2.4, 48.9],
					[2.5, 48.85]
				]]
			};
			const rings = Polygon.toLatLngRings(polygon);
			const lastPoint = rings[0][rings[0].length - 1];
			const firstPoint = rings[0][0];
			expect(lastPoint).toEqual(firstPoint);
		});
	});
});
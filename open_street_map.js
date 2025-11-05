/**
 * https://leafletjs.com/
 * https://switch2osm.org/the-basics/
 * https://www.openstreetmap.org/help
 */
class OpenStreetMap {

	constructor(mapContainer, options={}) {
		/*let [lat, lng] = button.data('coordinates').split(',');
		let map = L.map('modal_map_canvas2').setView([lat, lng], 17);

		L.marker([lat, lng], {
			icon: L.icon({iconUrl: getIconOfMapMarker(button.data('type_marker'))}),
			title: popoverContent.title
			//popupopen: setTimeout(displayEmployeesAndCompaniesAndTasks, 250)
		}).addTo(map)
			.bindPopup(popoverContent.content)
			//.openPopup()
		;*/

		this.markers = [];
		this.locations = [];

		this.map = OpenStreetMap.createMap(mapContainer, options);
		if (null === this.map) {
			return;
		}

		this.centerOnFrance();
	}

	static createMap(mapContainer, options={}) {
		if (!mapContainer.length) {
			return null;
		}

		const container = L.DomUtil.get(mapContainer[0]);
		if (container != null) {
			container._leaflet_id = null;
		}

		const map = L.map(mapContainer[0], options);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		OpenStreetMap.centerOnFrance(map);

		return map;
	}

	static getUrl(latitude, longitude) {
		return 'https://www.openstreetmap.org/?mlat='+latitude+'&mlon='+longitude+'#map=17/'+latitude+'/'+longitude+'&layers=N';
		//return 'https://www.openstreetmap.org/#map=17/'+latitude+'/'+longitude+'';
	}

	static getUrlFromCoordinates(locationCoordinates) {
		locationCoordinates = locationCoordinates.split(',');
		return OpenStreetMap.getUrl(parseFloat(locationCoordinates[0]), parseFloat(locationCoordinates[1]));
	}

	setZoom(zoom) {
		this.map.setZoom(zoom);
	}

	deleteMarkers() {
		this.locations = [];

		//this.markers.forEach(marker => marker.setMap(null));

		this.markers.length = 0;
		this.markers = [];
	}

	addMarkers(listLocations, icon) {
		if (listLocations.length === 0) {
			return;
		}

		listLocations.forEach(location => this.addMarker(location, icon));
	}

	addMarker(coordinates, options) {
		let locationCoordinates = coordinates.split(',');
		let latitude = parseFloat(locationCoordinates[0]);
		let longitude = parseFloat(locationCoordinates[1]);

		let marker = L.marker([latitude, longitude], {
			icon: L.icon({
				iconUrl: options['icon'],
				iconSize: [22, 32],
			}),
			title: options['title'],
		});

		//marker.on('click', () => {
		marker.on('popupopen', () => {
			//console.log('popupopen');
			if (typeof options['on_click'] == 'function') {
				options['on_click']();
			}
			return false;
		});
		marker.addTo(this.map);
		marker.bindPopup(options['popup_content']);

		this.markers.push(marker);
		this.locations.push([latitude, longitude]);
	}

	setView(location, zoom) {
		this.map.setView(location, zoom);
	}

	centerOnFrance() {
		OpenStreetMap.centerOnFrance(this.map);
	}

	static centerOnFrance(map) {
		map.setView([46.52863469527167, 2.43896484375], 6);
	}

	centerOnMarkers(padding) {
		OpenStreetMap.centerMapToLocations(this.map, this.locations, padding);
	}

	static centerMapToLocations(map, locationsList, padding=[20,20], maxZoom=18) {
		if (!map || locationsList.length === 0) {
			return;
		}

		map.invalidateSize(false);

		const bounds = L.latLngBounds(locationsList);
		map.fitBounds(bounds, { padding: padding });
		if (map.getZoom() > maxZoom) {
			map.setZoom(maxZoom);
		}
	}

	static centerMapToGooglePlace(map, place) {
		if (place && place.geometry && place.geometry.location) {
			const loc = place.geometry.location;
			OpenStreetMap.centerMapToCoordinates(map, loc.lat(), loc.lng());
		}
	}

	static centerMapToCoordinates(map, lat, long) {
		if (!map) {
			return;
		}
		map.setView([lat, long], Math.max(map.getZoom(), 15));
	}

	connectMarkers() {
		if (this.locations.length === 0) {
			return;
		}

		let prevLocation = null;
		let listLineCoordinates = [];
		this.locations.forEach(location => {
			if (prevLocation != null) {
				listLineCoordinates.push([prevLocation, location]);
			}
			prevLocation = location;
		});

		listLineCoordinates.forEach(line => {
			L.polyline(line, {color: '#728bec'}).addTo(this.map);
		});
	}
}

module.exports = { OpenStreetMap };
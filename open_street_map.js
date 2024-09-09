/**
 * https://leafletjs.com/
 * https://switch2osm.org/the-basics/
 * https://www.openstreetmap.org/help
 */
class OpenStreetMap {

	constructor(mapId, options) {
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
		this.mapId = mapId;

		if (!$('#'+mapId).length) {
			return;
		}

		let container = L.DomUtil.get(mapId);
		if (container != null) {
			container._leaflet_id = null;
		}

		this.map = L.map(mapId, options || {});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(this.map);

		this.centerOnFrance();
	}

	static getUrl(latitude, longitude) {
		return 'https://www.openstreetmap.org/?mlat='+latitude+'&mlon='+longitude+'#map=17/'+latitude+'/'+longitude+'&layers=N';
		//return 'https://www.openstreetmap.org/#map=17/'+latitude+'/'+longitude+'';
	}

	static getUrlFromCoordinates(locationCoordinates) {
		locationCoordinates = locationCoordinates.split(',');
		return this.getUrl(parseFloat(locationCoordinates[0]), parseFloat(locationCoordinates[1]));
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
		this.map.setView([46.52863469527167, 2.43896484375], 6);
	}

	centerOnMarkers(padding) {
		this.map.invalidateSize(false);

		if (this.locations.length === 0) {
			return;
		}

		this.map.fitBounds(new L.LatLngBounds(this.locations), {
			padding: typeof padding != 'undefined' ? padding : [0, 0]
		});
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
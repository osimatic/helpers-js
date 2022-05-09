class WebSocket {
    /**
     * socketEvents : events en provenance de la socket qui seront dispatchés à travers le bus event
     * busEvents : events en provenance de l'event bus qui seront dispatchés vers la socket
     * customBusEvents : events "spéciaux" en provenance de l'event bus qui seront dispatchés vers la socket : array({ 'custom_name' => 'event_name' }, ...)
    */
    static setEventListeners(socketEvents, busEvents, customBusEvents) {
        this.socketEvents = socketEvents;
		this.busEvents = busEvents;
        this.customBusEvents = customBusEvents;
    }

    static getEventBus() {
        return this.eventBus;
    }

	static connect(url, options, connectInitPayload, onConnectionAckCallback, onUnavailableCallback) {
        const io = require('socket.io-client');
        const EventBus = require('./event_bus');
        
        this.eventBus = new EventBus();
        this.logged = false;
		this.instance = io(url, options);

		this.initEventsListeners();
		this.initConnectionListeners(onUnavailableCallback);

		this.instance.on('connect', () => {
			if (this.logged) {
				this.clear(onUnavailableCallback);
			}

			this.logged = true;
            this.instance.emit('connect_init', connectInitPayload, onConnectionAckCallback);
		});
	}

	static initConnectionListeners(onUnavailableCallback) {
		['connect_error', 'connect_timeout', 'reconnect_error', 'reconnect_failed', 'disconnect'].forEach(event => this.instance.on(event, () => this.clear(event, onUnavailableCallback)));
		this.instance.on('error', (error) => this.clear(error, onUnavailableCallback));
	}

	static clear(error, onUnavailableCallback) {
		this.unregisterOutcomingBusEvents();
        
        if (onUnavailableCallback != 'undefined') {
            onUnavailableCallback(error);
        }
	}

    static unregisterIncomingBusEvents() {
        
    }

	static unregisterOutcomingBusEvents() {
		this.busEvents.forEach(event => this.eventBus.unsubscribe(event, {}));
        this.customBusEvents.forEach((object) => this.eventBus.unsubscribe(object.custom_name, {}));
	}

	static initEventsListeners() {
		this.socketEvents.forEach(event => this.instance.on(event, (payload) => this.eventBus.publish(event, payload)));
		this.busEvents.forEach(event => this.eventBus.subscribe(event, (payload) => this.instance.emit(event, payload)));
        this.customBusEvents.forEach((object) => this.eventBus.subscribe(object.custom_name, (payload) => this.instance.emit(object.event_name, payload)));
	}
}

module.exports = { WebSocket };
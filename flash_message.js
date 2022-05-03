class FlashMessage {
	static displaySuccess(message, reload, modal) {
		this.display('success', message, reload, modal);
	}

	static displayError(message, modal) {
		this.display('danger', message, false, modal);
	}

	static display(type, message, reload, modal) {
		if ('undefined' !== typeof modal) {
			modal.modal('hide');
		}
		if ($('div.snackbar').length !== 0) {
			$('div.snackbar').remove();
		}
		var snackbar = $('<div class="snackbar '+type+'"></div>');
		$('html body').append(snackbar);
		snackbar.html(message);
		snackbar.addClass('show');

		setTimeout(function () {
			$('div.snackbar').remove();
		}, 6000);

		if (true === reload) {
			document.location.reload();
		}
	}

	/** @deprecated **/
	static displayRequestFailure(status, exception, modal) {
		console.log('request failure. Status: ', status, ' Exception: ', exception);
		this.display('danger', typeof labelErrorOccured != 'undefined' ? labelErrorOccured :  "Une erreur s'est produite.", false, modal);
	}

}

module.exports = { FlashMessage };
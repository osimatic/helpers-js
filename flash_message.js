class FlashMessage {
	static displaySuccess(message, reload, modal=null) {
		this.display('success', message, reload, modal);
	}
	static displayWarning(message, modal=null) {
		this.display('warning', message, false, modal);
	}
	static displayError(message, modal=null) {
		this.display('danger', message, false, modal);
	}

	static display(type, message, reload, modal=null) {
		if (null !== modal) {
			modal.modal('hide');
		}
		if ($('div.snackbar').length !== 0) {
			$('div.snackbar').remove();
		}
		let snackbar = $('<div class="snackbar '+type+'"></div>');
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
}

module.exports = { FlashMessage };
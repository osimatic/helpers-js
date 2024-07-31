class FlashMessage {
	static displaySuccess(message, reload=false, modal=null, onMessageHidden=null, domId=null) {
		this.display('success', message, reload, modal, onMessageHidden, domId);
	}
	static displayWarning(message, modal=null, onMessageHidden=null, domId=null) {
		this.display('warning', message, false, modal, onMessageHidden, domId);
	}
	static displayError(message, modal=null, onMessageHidden=null, domId=null) {
		this.display('danger', message, false, modal, onMessageHidden, domId);
	}

	static display(type, message, reload=false, modal=null, onMessageHidden=null, domId=null) {
		if (null !== modal) {
			modal.modal('hide');
		}

		$('div.snackbar').remove();
		let snackbar = $('<div class="snackbar '+type+'" '+(null !== domId ? 'id="'+domId+'"' : '')+'></div>');
		$('html body').append(snackbar);
		snackbar.html(message);
		snackbar.addClass('show');

		setTimeout(function () {
			$('div.snackbar').remove();
			if (typeof onMessageHidden == 'function') {
				onMessageHidden();
			}
		}, 6000);

		if (true === reload) {
			document.location.reload();
		}
	}
}

module.exports = { FlashMessage };
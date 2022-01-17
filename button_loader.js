
// Loading button plugin (removed from BS4)
(function($) {
	"use strict";

	$.fn.extend({
		/*
		button: function (action) {
			console.log(action);
			if (action === 'loading' && this.data('loading-text')) {
				console.log('loading');
				this.data('original-text', this.html()).html(this.data('loading-text')).prop('disabled', true);
			}
			if (action === 'reset' && this.data('original-text')) {
				console.log('reset');
				this.html(this.data('original-text')).prop('disabled', false);
			}
		},
		*/

		buttonLoader: function (action) {
			//console.log(action);
			var self = $(this);
			if (action === 'start' || action === 'loading') {
				if ($(self).attr('disabled')) {
					return self;
				}
				$(self).attr('disabled', true);
				$(self).attr('data-btn-text', $(self).html());
				//let text = '<span class="spinner"><i class=\'fa fa-circle-notch fa-spin\'></i></span>Traitement en cours…';
				let text = '<i class=\'fa fa-circle-notch fa-spin\'></i> Traitement en cours…';
				if ($(self).data('load-text') != undefined && $(self).data('load-text') != null && $(self).data('load-text') != '') {
					text = $(self).data('load-text');
				}
				if ($(self).data('loading-text') != undefined && $(self).data('loading-text') != null && $(self).data('loading-text') != '') {
					text = $(self).data('loading-text');
				}
				$(self).html(text);
				$(self).addClass('disabled');
			}
			if (action === 'stop' || action === 'reset') {
				$(self).html($(self).attr('data-btn-text'));
				$(self).removeClass('disabled');
				$(self).attr('disabled', false);
				//$(self).removeAttr("disabled");
			}
			return self;
		}
	});
}(jQuery));

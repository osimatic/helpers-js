class DetailsSubArray {

	static initDetailsLink(table, callbackOnDetailsActionRequestSuccess, callbackOnDetailsActionRequestError, callbackOnDetailsActionRequestBeforeSend) {
		function getNbColumns(tr) {
			return tr.closest('table').find('thead tr').children().length;
		}
		function displayErrorRow(tr) {
			tr.after($('<tr class="text-error"><td colspan="'+getNbColumns(tr)+'">'+labelErrorOccured+'</td></tr>'));
		}
		function displayDetailsRow(tr, content) {
			var trContent = $(''
				+ '<tr class="participants">'
				+ '<td colspan="'+getNbColumns(tr)+'">'
				+ '</td>'
				+ '</tr>'
			);
			trContent.find('td').append(content);
			tr.after(trContent);
		}

		function hideDetailsRow(link) {
			var tr = link.closest('tr').addClass('folded');
			if (tr.next().hasClass('participants') ) {
				tr.next().remove();
			}
			showPlusButton(link);
		}

		function showPlusButton(link) {
			link.prop('title', showDetailsLabel).attr('disabled', false).html($('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>'));
		}
		function showMinusButton(link) {
			link.prop('title', hideDetailsLabel).attr('disabled', false).html($('<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>'));
		}

		function displayLoading(link) {
			link.attr('disabled', true).html($('<i class="fa fa-circle-notch fa-spin"></i>'));
			var tr = link.closest('tr');
			tr.after($('<tr class="waiting_icon"><td colspan="'+getNbColumns(tr)+'" class="center"><i class="fa fa-circle-notch fa-spin"></i></td></tr>'));
		}
		function hideLoading(link) {
			// todo : cacher que le loader du lien au lieu de tous les loaders (cas ou l'user clique sur tous les boutons rapidement)
			if ($('tr.waiting_icon').length > 0) {
				$(('tr.waiting_icon')).remove();
			}
		}

		function setHideDetailsLink(link) {
			showMinusButton(link);
			link.click(function() {
				$(this).stop();
				hideDetailsRow(link);
				setDisplayDetailsLink(link);
				return false;
			});
		}

		function setDisplayDetailsLink(link) {
			link.click(function() {
				$(this).stop().off('click');
				hideDetailsRow(link);
				doDetailsActionRequest(link);
				return false;
			});
		}

		function doDetailsActionRequest(link) {
			displayLoading(link);

			if (typeof callbackOnDetailsActionRequestBeforeSend != 'undefined' && callbackOnDetailsActionRequestBeforeSend != null) {
				displayDetailsRow(link.closest('tr'), callbackOnDetailsActionRequestBeforeSend(link));
				hideLoading(link);
				setHideDetailsLink(link);
				return;
			}

			//link.attr('disabled', true).button('loading');
			$.ajax({
				url: link.data("url_details"),
				method: 'GET',
				headers: HTTPRequest.getHeaders(),
				cache: false,
				dataType: 'json',
				success: function (jsonObj) {
					if (jsonObj == null) {
						if (typeof callbackOnDetailsActionRequestError != 'undefined' && callbackOnDetailsActionRequestError != null) {
							callbackOnDetailsActionRequestError(link);
							return;
						}
						displayErrorRow(link.closest('tr'));
						return;
					}

					if (typeof callbackOnDetailsActionRequestSuccess != 'undefined' && callbackOnDetailsActionRequestSuccess != null) {
						displayDetailsRow(link.closest('tr'), callbackOnDetailsActionRequestSuccess(jsonObj, link));
					}
				},
				error: function (jqxhr, status, exception) {
					console.log('Detail request failure. Status: '+status+' ; Exception: '+exception);

					if (typeof callbackOnDetailsActionRequestError != 'undefined' && callbackOnDetailsActionRequestError != null) {
						callbackOnDetailsActionRequestError(link);
						return;
					}

					link.closest('tr').after($('<tr class="error"><td colspan="6" class="center">'+labelErrorOccured+'</td></tr>'));
					//window.location.replace(decodeURIComponent(urlRetour));
				},
				complete: function() {
					hideLoading(link);
					setHideDetailsLink(link);
					//link.attr('disabled', false).button('reset');
				}
			});
		}

		table.find('a.details_link').each(function(idx, link) {
			$(link).removeClass('hide');
			setDisplayDetailsLink($(link));
			showPlusButton($(link));
		});
	}

}

module.exports = { DetailsSubArray };
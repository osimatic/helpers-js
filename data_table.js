
class DataTable {
	// criteres = {};

	constructor() {
		this.criteres = {};
	}

	static setCallbackOnLoadData(callback) {
		this.callbackOnLoadData = callback;
	}

	// ------------------------------------------------------------
	// Critères
	// ------------------------------------------------------------

	static populateFormFromFilters(form) {
		FormHelper.populateForm(form, this.criteres);
	}

	static setDefaultFilters(filters) {
		this.criteres = filters;
	}

	static setFiltersFromForm(form) {
		this.criteres = UrlAndQueryString.parseQuery(form.serialize());
	}

	static getFilterParam(key) {
		return this.criteres[key] || 'NONE';
	}

	static getFilters() {
		return this.criteres;
	}

	// ------------------------------------------------------------
	// Chargement tableau
	// ------------------------------------------------------------

	static init(options) {
		var div = options.div;
		var defaultFilters = options.default_filters || {};

		//let form = div.find('.filter_popover_content form');
		//if (typeof form != 'undefined') {
		let queryStringFilters = UrlAndQueryString.parseQuery(window.location.search);
		defaultFilters = Object.assign(defaultFilters, queryStringFilters);
		//}

		// Bouton filtrer
		var filterLink = div.find('a.filter_link');
		if (filterLink.length) {
			filterLink.popover({
				content: div.find('.filter_popover_content').html(),
				template: '<div class="popover filter_popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
				container: 'body',
				// trigger: 'manual',
				trigger: 'click',
				html: true,
				animation: false,
				// placement: 'topRight'
				placement: 'leftTop'
			})
			.click(function(e) {
				// 	$('.popover').not(this).hide(); // optional, hide other popovers
				e.preventDefault();
			});

			filterLink.on('shown.bs.popover', function () {
				var form = $('.filter_popover form');

				DataTable.populateFormFromFilters(form);

				// Lien input period
				InputPeriod.addLinks(form);

				// Callback custom
				if (typeof options.on_show_filter_form != 'undefined' && options.on_show_filter_form != null) {
					options.on_show_filter_form(form);
				}

				form.find('button[type="submit"]').off('click').click(function(e) {
					// e.preventDefault();
					DataTable.updateFiltersAndLoadData(div, form);
					return false;
				});
			});
		}

		// Bouton exporter
		var exportLink = div.find('a.export_link');
		if (exportLink.length) {
			if (typeof options.export_modal_enabled == 'undefined' || !options.export_modal_enabled) {
				// sans modal
				exportLink.click(function(e) {
					e.preventDefault();
					var button = $(this).attr('disabled', true).button('loading');
					if (typeof options.on_export != 'undefined' && options.on_export != null) {
						options.on_export(button.data('format'), {...DataTable.getFilters()}, () => {
							button.attr('disabled', false).button('reset');
						});
					}
					return false;
				});
			}
			else {
				// avec modal
				exportLink.click(function(e) {
					// todo : ouvrir modal #modal_export lors du click sur le lien
				});

				$('div#modal_export').on('show.bs.modal', function (event) {
					var button = $(event.relatedTarget);
					var modal = $(this);
					var form = modal.find('form');

					// Fonction de callback permettant d'initialiser contenu du modal export, cette fonction doit renvoyer le contenu du modal
					if (typeof options.set_export_form != 'undefined' && options.set_export_form != null) {
						modal.find('modal-body').html(options.set_export_form(modal, button));
					}

					// Fonction de callback permettant d'initialiser le modal export
					if (typeof options.on_show_export_form != 'undefined' && options.on_show_export_form != null) {
						modal.find('modal-body').html(options.on_show_export_form(modal, button));
					}

					var btnSubmit = form.find('button[type="submit"]').attr('disabled', false).button('reset');
					btnSubmit.off('click').click(function(e) {
						e.preventDefault();
						$(this).attr('disabled', true).button('loading');

						// Une fois le formulaire d'export validé, si fonction callback spécifié, on l'appelle, cette fonction doit renvoyer true ou false pour savoir si le form contient des erreurs ou non.
						let hasErrors = false;
						if (typeof options.on_submit_export_modal != 'undefined' && options.on_submit_export_modal != null) {
							hasErrors = options.on_submit_export_modal(modal, button);
						}

						if (hasErrors) {
							$(this).attr('disabled', false).button('reset');
							return false;
						}

						// S'il n'y a pas d'erreur on enclenche l'export
						if (typeof options.on_export != 'undefined' && options.on_export != null) {
							options.on_export(button.data('format'), {...DataTable.getFilters()}, form, () => {
								// Retrait du modal
								modal.modal('hide');
							});
						}

						return false;
					});
				});
			}

		}

		console.log('defaultFilters', defaultFilters);

		DataTable.setDefaultFilters(defaultFilters);
		DataTable.setCallbackOnLoadData(options.on_load_data);

		DataTable.loadData(div);
	}

	static updateFiltersAndLoadData(div, form) {
		DataTable.setFiltersFromForm(form);
		DataTable.addBrowserHistory();
		// DataTable.populateFormFromFilters($('.filter_popover form'));

		$('a.filter_link').popover('hide');
		$('.filter_popover').remove();

		DataTable.loadData(div);
	}

	static loadData(div) {
		console.log('DataTable.loadData');
		DataTable.addLoader(div);

		if (typeof this.callbackOnLoadData != 'undefined' && this.callbackOnLoadData != null) {
			this.callbackOnLoadData(div, DataTable.getFilters());
		}
	}

	static addBrowserHistory() {
		//console.log('addBrowserHistory');
		// on ne garde que les critères contenant des valeurs de type string ou tableau avec max 3 éléments
		let savedCriterias = Object.filter(this.criteres, value => (!Array.isArray(value) || (Array.isArray(value) && value.length <= 3)));
		//console.log('savedCriterias', savedCriterias);

		//var url = urldecode(urlRetour);
		var url = window.location.href;
		//console.log('current url', url);

		let queryString = UrlAndQueryString.getQueryString(url);
		//console.log('current QueryString', queryString);

		// todo : delete params qui ne sont pas dans savedCriterias
		Object.entries(savedCriterias).forEach(([key, value]) => queryString = UrlAndQueryString.setParam(queryString, key, value));
		queryString = queryString.includes('?') ? queryString.substring(1) : queryString;
		//console.log('new queryString', queryString);

		let newUrl = UrlAndQueryString.getPath(url) + '?' + queryString;
		window.history.pushState("", "", newUrl);
	}


	// ------------------------------------------------------------
	// Affichage tableau
	// ------------------------------------------------------------

	static resetContent(div) {
		//console.log('resetContent');
		div.find('span.nb_items_many, span.nb_items_one').addClass('hide');
		div.find('span.nb_items_no').removeClass('hide');
		var table = div.find('table.table');
		table.find('thead,tfoot').removeClass('hide');
		table.find('tbody').children().remove();

		if ($.fn.dataTable.isDataTable(table)) {
			table.DataTable().clear();
			table.DataTable().destroy();
		}
	}

	static addModalLoader(modal, btnSubmit) {
		modal.find('.modal-body').addClass('hide').before('<div class="modal-body loader center"><i class="fa fa-circle-notch fa-spin"></i></div>');
		if (typeof btnSubmit != 'undefined') {
			btnSubmit.attr('disabled', true).button('loading');
		}
	}
	static removeModalLoader(modal, btnSubmit) {
		modal.find('.modal-body').removeClass('hide').parent().find('.loader').remove();
		if (typeof btnSubmit != 'undefined') {
			btnSubmit.attr('disabled', false).button('reset');
		}
	}

	static addLoader(div, isSmall) {
		if (typeof isSmall != 'undefined' && isSmall) {
			div.addClass('hide').before('<p class="loader center"><i class="fa fa-circle-notch fa-spin"></i></p>');
			return;
		}
		//div.addClass('hide').parent().prepend('<div class="alert alert-info loader center">Veuillez patienter… <br><p><i class="fa fa-circle-notch fa-spin"></i></p></div>');
		div.addClass('hide').before('<div class="alert alert-info loader center">Veuillez patienter… <br><p><i class="fa fa-circle-notch fa-spin"></i></p></div>');
	}
	static removeLoader(div) {
		div.removeClass('hide').parent().find('.loader').remove();
	}

	static displayErrorMessage(div, msg) {
		this.displayMessage(div, msg, 'danger');
	}
	static displayMessage(div, msg, cssClass /*, removeLoader=false*/) {
		this.resetContent(div);
		var table = div.find('table');
		table.find('thead,tfoot').addClass('hide');
		var msgHtml = '<div class="text-'+cssClass+' center">'+msg+'</div>';
		if (table.find('tbody').length == 0) {
			table.append('<tbody></tbody>');
		}
		table.find('tbody').append('<tr class="no_items '+cssClass+'"><td>'+msgHtml+'</td></tr>');
		// table.after(msgHtml);
		// if (removeLoader) {
		DataTable.removeLoader(div);
		// }
	}

	static displayErrorFromXhr(div, jqxhr, defaultMessage) {
		this.displayError(div, JSON.parse(jqxhr.responseJSON), defaultMessage);
	}

	static displayError(div, data, defaultMessage) {
		var error = null;
		if (data != null) {
			if (typeof data.error != 'undefined') {
				error = data.error;
			}
			else if (typeof data[0] != 'undefined' && typeof data[0].error != 'undefined') {
				error = data[0].error;
			}
		}

		if (error == null) {
			return this.displayErrorMessage(div, (typeof defaultMessage != 'undefined' ? defaultMessage : labelErrorOccured));
		}
		return this.displayErrorMessage(div, 'Critères sélectionnés incorrect.');
	}

	static getDefaultColumnsForDisplayedTable(div) {
		var table = div.find('table');
		var columns = [];
		var defaultHiddenColumns = table.data('hidden_fields') != null ? table.data('hidden_fields').split(',') : [];
		table.find('thead tr th').each(function(idx, th) {
			if (defaultHiddenColumns.indexOf($(th).data('key')) == -1) {
				columns.push($(th).data('key'));
			}
		});
		//console.log(columns);
		return columns;
	}

	static setDataContent(div, data, displayLineCallback, completeCallback) {
		//console.log('setDataContent');
		var table = div.find('table').removeClass('hide');

		try {
			DataTable.resetContent(div);
			var tableBody = table.find('tbody');
			for (var i = 0; i < data.length; i++) {
				tableBody.append(displayLineCallback(data[i]));
			}

			if (data.length) {
				div.find('span.nb_items_no').addClass('hide');
				if (data.length === 1 && div.find('span.nb_items_one').length) {
					div.find('span.nb_items_one').removeClass('hide');
				}
				else {
					div.find('span.nb_items_many').removeClass('hide');
					div.find('span.nb_items').text(data.length);
				}
			}
			else {
				// si pas de plugin DataTable sur le tableau, on cache le tableau s'il n'y a pas de résultat
				if (table.is('[data-no_datatables="1"]')) {
					table.addClass('hide');
				}
			}

			DataTable.initDataContent(div);
			if (typeof completeCallback == 'function') {
				completeCallback();
			}
			DataTable.removeLoader(div);
		}
		catch (e) {
			console.log(e);
		}
	}

	static initDataContent(div) {
		//console.log('initDataContent');
		var table = div.find('table');

		// Popover/Tooltip
		div.find('[data-toggle="popover"]').popover({'trigger':'hover', 'html':true});
		div.find('[data-toggle="tooltip"]').tooltip();

		// Action multiple / checkbox select all
		if (table.length > 0) {
			//SelectAll.initInTable(table);
			//MultipleActionInTable.init(table);

			//paging(div.find('select.pagination_max_rows'));
		}

		if (table.length > 0 && !table.is('[data-no_datatables="1"]') && !$.fn.dataTable.isDataTable(table)) {
			if (table.data('page_length') != null) {
				dateTablesOptions.pageLength = table.data('page_length');
			}
			table.DataTable(dateTablesOptions);
		}

		DataTable.updateDataContent(div);
	}

	static updateDataContent(div) {
		var table = div.find('table');

		// Maj colonnes
		if (table.length > 0 && typeof div.data('table_name') != 'undefined' && div.data('table_name') != null && div.data('display_items').split(',').indexOf('table_columns') != -1) {
			table.find('thead tr th').each(function(idx, th) {
				// table.find('.'+$(th).data('key')+':not(.select):not(.action)').hide();
				table.find('.'+$(th).data('key')+':not(.select):not(.action)').addClass('hide');
			});
			var columns = this.getDisplayParam(div, 'html', null, 'columns').split(',').removeEmptyValues();
			$.each(columns, function(idx, key) {
				table.find('.'+key).removeClass('hide');
				// table.find('.'+key).show();
			});
		}

		if (typeof this.callbackOnUpdateDataContent != 'undefined' && this.callbackOnUpdateDataContent != null) {
			this.callbackOnUpdateDataContent(div);
		}
	}

	static filterRows(table, callback) {
		if (!$.fn.dataTable.isDataTable(table)) {
			return;
		}

		$.fn.dataTable.ext.search = [];
		//$.fn.dataTable.ext.search.pop();
		var dataTableObject = table.DataTable();
		$.fn.dataTable.ext.search.push(
			function(settings, searchData, index, rowData, counter) {
				return callback($(dataTableObject.row(index).node()));
			}
		);
		dataTableObject.draw();
	}

	static sort(table, tdSelector) {
		//if (table.find('tbody tr').length > 0 && $.fn.dataTable.isDataTable(table)) {
		if ($.fn.dataTable.isDataTable(table)) {
			let idx = table.find('thead tr '+tdSelector).index();
			if (idx >= 0) {
				table.DataTable().order([idx, 'asc']);
			}
		}
	}

}

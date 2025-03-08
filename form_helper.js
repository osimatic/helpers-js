class FormHelper {
	static init(form, onSubmitCallback, submitButton=null) {
		FormHelper.reset(form, submitButton);
		submitButton = null != submitButton ? submitButton : form.find('button[name="validate"]');
		submitButton.off('click').click(function(e) {
			e.preventDefault();
			FormHelper.buttonLoader($(this), 'loading');
			FormHelper.hideFormErrors(form);
			if (typeof onSubmitCallback == 'function') {
				onSubmitCallback(form, submitButton);
			}
		});
		return form;
	}

	static reset(form, submitButton=null) {
		submitButton = null != submitButton ? submitButton : form.find('button[name="validate"]');
		form.find('input[name]:not([type="checkbox"], [type="radio"]), select:not(.selectpicker), textarea').each((idx, el) => $(el).val('')).off('change');
		form.find('select.selectpicker').each((idx, el) => $(el).val(''));
		FormHelper.buttonLoader(submitButton, 'reset');
		FormHelper.hideFormErrors(form);
		return form;
	}

	static populateForm(form, data) {
		form.find('[name="employees_display_type"][value="NONE"]').prop('checked', true); //todo à retirer

		$.each(data, function(key, value) {
			if (value == null) {
				return;
			}

			if (typeof value == 'object') {
				let select = form.find('[name="'+key+'[]"]');
				select.find('option').prop('selected', false);
				select.data('default_id', value.join(','));
				$.each(value, function(key, val) {
					select.find('option[value="'+val+'"]').prop('selected', true);
				});
				return;
			}

			let input = form.find('[name="'+key+'"]');

			if (input.prop('type') === 'radio' || input.prop('type') === 'checkbox') {
				input.prop('checked', false);
				input.filter('[value="'+value+'"]').prop('checked', true);
				return;
			}

			input.val(value);
			// console.log(form.find('[name="'+key+'"]').length);
		});
	}


	static getFormData(form) {
		// var formElement = document.getElementById("myFormElement");
		return new FormData(form[0]);
	}

	static getDataFromFormData(formData) {
		let data = {};
		for(let pair of formData.entries()) {
			//console.log(pair[0]+ ', '+ pair[1]);
			data[pair[0]] = pair[1];
		}
		return data;
	}

	static getFormDataQueryString(form) {
		return form.serialize();
		// cette soluce marche pas pour les clés sous forme de tableau : ids[]=1&ids[]=2
		/*
		return form.serializeArray().reduce(function(obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});
		*/
	}



	// ------------------------------------------------------------
	// Input text
	// ------------------------------------------------------------

	static getInputValue(input) {
		if (typeof input == 'undefined') {
			return null;
		}
		let value = $(input).val();
		if (value === null || value === '') {
			return null;
		}
		return value;
	}

	static getLinesOfTextarea(textarea) {
		return textarea.val().replace(/(\r\n|\n|\r)/g, "\n").split("\n").filter(word => word.length > 0);
	}

	static setOnInputChange(input, callback, doneTypingInterval=700) {
		// setup before functions
		let typingTimer;  // timer identifier

		// on keyup, start the countdown
		input.on('keyup', function () {
			clearTimeout(typingTimer);
			typingTimer = setTimeout(callback, doneTypingInterval); // time in ms
		});

		// on keydown, clear the countdown
		input.on('keydown', function () {
			clearTimeout(typingTimer);
		});

		// on focusout, clear the countdown and call callback
		input.on('focusout', function () {
			clearTimeout(typingTimer);
			callback();
		});
	}

	// ------------------------------------------------------------
	// Select
	// ------------------------------------------------------------

	static resetSelectOption(form, selectName) {
		form.find('select[name="'+selectName+'"] option').prop('disabled', false).prop('selected', false);
	}
	static setSelectedSelectOption(form, selectName, optionValue) {
		form.find('select[name="'+selectName+'"] option[value="'+optionValue+'"]').prop('selected', true);
	}
	static setSelectedSelectOptions(form, selectName, optionValues) {
		$.each(optionValues, function(idx, id) {
			FormHelper.setSelectedSelectOption(form, selectName, id);
		});
	}
	static disableSelectOption(form, selectName, optionValue) {
		form.find('select[name="'+selectName+'"] option[value="'+optionValue+'"]').prop('disabled', true);
	}
	static disableSelectOptions(form, selectName, optionValues) {
		$.each(optionValues, function(idx, id) {
			FormHelper.disableSelectOption(form, selectName, id);
		});
	}
	static countSelectOptions(form, selectName) {
		return form.find('select[name="'+selectName+'"] option:not([disabled])').length;
	}


	// ------------------------------------------------------------
	// Checkbox
	// ------------------------------------------------------------

	static getCheckedValues(inputs) {
		return inputs.map(function() {
			if (this.checked) {
				return this.value;
			}
		}).get();
	}

	static setCheckedValues(inputs, defaultValues) {
		$.each(defaultValues, function(idx, value) {
			inputs.parent().find('[value="'+value+'"]').prop('checked', true);
		});
	}

	static getInputListValues(inputs) {
		return inputs.map(function() {
			return this.value;
		}).get().filter(word => word.length > 0);
	}


	// ------------------------------------------------------------
	// Champs
	// ------------------------------------------------------------

	static initTypeFields(form) {
		//if ( $('[type="date"]').prop('type') != 'date' ) {
		//	$('[type="date"]').datepicker();
		//}
		if (typeof Modernizr != 'undefined') {
			if (!Modernizr.inputtypes.date) {
				// $.fn.datepicker.defaults.language = 'fr';
				// $.datepicker.setDefaults( $.datepicker.regional["fr"]);
				form.find('input[type="date"]')
					.css('max-width', '120px')
					// 28/06/2021 : désactivation du datepicker car safari le gere en natif
					/*
					.datepicker({
						dateFormat: 'yy-mm-dd',
						changeMonth: true,
						changeYear: true,
						showOn: "both",
						buttonImage: ROOT_PATH+'images/icons/calendar-alt.png',
						buttonImageOnly: true,
					})
					*/
				;
				//form.find('input[type="date"]').datepicker({dateFormat: 'yy-mm-dd', minDate: "-10Y", maxDate: "+3Y"});
				// $("#date_conf").datepicker("option", $.datepicker.regional["fr"]);
				// $("#date_conf").datepicker("option", "dateFormat", "yy-mm-dd");
			}
			if (!Modernizr.inputtypes.time) {
				form.find('input[type="time"]')
					.css('max-width', '100px')
					.attr('placeholder', 'hh:mm')
				;
				form.find('input[type="time"][step="1"]').attr('placeholder', 'hh:mm:ss');
			}
		}

		// Show/Hide password
		let linkTogglePassword = $('<span class="input-group-text"><i class="fas fa-eye toggle_password"></i></span>');
		linkTogglePassword.find('i').click(function(e) {
			e.preventDefault();
			let input = $(this).closest('.input-group').find('input');
			let passwordHidden = input.attr('type') === 'password';
			input.attr('type', passwordHidden ? 'text' : 'password');
			$(this).removeClass('fa-eye fa-eye-slash').addClass(passwordHidden ? 'fa-eye-slash' : 'fa-eye');
		});
		form.find('input[type="password"]').wrap('<div class="input-group password"></div>').after(linkTogglePassword);
	}

	static hideField(inputOrSelect) {
		inputOrSelect.closest('.form-group').addClass('hide');
	}

	// ------------------------------------------------------------
	// Messages erreur
	// ------------------------------------------------------------

	static extractErrorKeyOfJson(json, onlyIfUniqueError=false) {
		if (typeof json == 'undefined' || json == null) {
			return null;
		}

		if (typeof json.error != 'undefined') {
			return json.error;
		}

		if (onlyIfUniqueError && !json.length || json.length > 1) {
			return null;
		}

		if (typeof json[0] != 'undefined' && typeof json[0].error != 'undefined') {
			return json[0].error;
		}

		if (typeof json[0] != 'undefined' && Array.isArray(json[0]) && json[0].length === 2) {
			return json[0][0];
		}

		return null;
	}

	static hideFormErrors(form) {
		form.find('div.form_errors').remove();
		return form;
	}

	static getFormErrorText(errors) {
		let errorLabels = [];
		for (let property in errors) {
			// console.log(property);
			if (typeof errors[property] == 'function') {
				continue;
			}
			if (typeof errors[property]['error_description'] !== 'undefined') {
				errorLabels.push(errors[property]['error_description']);
				continue;
			}
			if (Array.isArray(errors[property]) && errors[property].length === 2) {
				errorLabels.push(errors[property][1]);
				continue;
			}
			errorLabels.push(errors[property]);
		}
		return errorLabels.removeEmptyValues().map(errorLabel => '<span>' + errorLabel + '</span>').join('<br/>');
	}

	static displayFormErrors(form, btnSubmit, errors, errorWrapperDiv=null) {
		this.displayFormErrorsFromText(form, this.getFormErrorText(errors), errorWrapperDiv);
		if (btnSubmit != null) {
			FormHelper.buttonLoader(btnSubmit, 'reset');
			//if (btnSubmit.buttonLoader != null) {
			//	btnSubmit.buttonLoader('reset');
			//} else {
			//	btnSubmit.attr('disabled', false).button('reset');
			//}
		}
	}

	static displayFormErrorsFromText(form, errorLabels, errorWrapperDiv=null) {
		let errorDiv = '<div class="alert alert-danger form_errors">'+errorLabels+'</div>';

		if (null != errorWrapperDiv) {
			errorWrapperDiv.append(errorDiv);
			return;
		}

		if (form.find('.form_errors_content').length) {
			form.find('.form_errors_content').append(errorDiv);
			return;
		}

		let errorsParentDiv = form;
		if (form.find('.modal-body').length) {
			errorsParentDiv = form.find('.modal-body');
		}

		let firstFormGroup = errorsParentDiv.find('.form-group:first');
		if (firstFormGroup.length) {
			if (firstFormGroup.parent().parent().hasClass('row')) {
				firstFormGroup.parent().parent().before(errorDiv);
			}
			else {
				errorsParentDiv.find('.form-group:first').before(errorDiv);
			}
			return;
		}

		errorsParentDiv.prepend(errorDiv);
	}


	// ------------------------------------------------------------
	// Bouton valider
	// ------------------------------------------------------------

	static buttonLoader(button, action) {
		button = $(button);
		if (action === 'start' || action === 'loading') {
			if (button.attr('disabled')) {
				return self;
			}
			button.attr('disabled', true);
			button.data('btn-text', button.html());
			//let text = '<span class="spinner"><i class=\'fa fa-circle-notch fa-spin\'></i></span>Traitement en cours…';
			let text = '<i class=\'fa fa-circle-notch fa-spin\'></i> Traitement en cours…';
			if (button.data('load-text') != null && button.data('load-text') !== '') {
				text = button.data('load-text');
			}
			if (button.data('loading-text') != null && button.data('loading-text') !== '') {
				text = button.data('loading-text');
			}
			button.html(text);
			button.addClass('disabled');
		}
		if (action === 'stop' || action === 'reset') {
			button.html(button.data('btn-text'));
			button.removeClass('disabled');
			button.attr('disabled', false);
			//button.removeAttr("disabled");
		}
		return button;
	}
	

}

class ArrayField {
	static init(formGroupDiv, defaultValues, options = {
		entering_field_in_table: true,
		item_name: null,
		list_empty_text: null,
		add_one_button_enabled: true,
		add_one_button_label: null,
		add_multi_button_enabled: false,
		add_multi_button_label: null,
		input_name: null,
		init_callback: null,
		update_list_callback: null,
		get_errors_callback: null,

	}) {
		function isOptionDefined(optionName) {
			return typeof options[optionName] != 'undefined' && null !== options[optionName];
		}

		let itemsList = defaultValues;

		if (!formGroupDiv.find('table').length) {
			formGroupDiv.append($('<table class="table table-sm"><tbody></tbody></table>'));
		}
		if (!formGroupDiv.find('.list_empty').length) {
			formGroupDiv.append($('<div class="list_empty">'+(isOptionDefined('list_empty_text') ? options['list_empty_text'] : '<em>aucun</em>')+'</div>'));
		}
		if (!options['entering_field_in_table'] && !formGroupDiv.find('.add_one, .add_multi').length) {
			let divLinks = formGroupDiv.find('.links');
			if (!divLinks.length) {
				divLinks = $('<div class="links text-center"></div>');
				formGroupDiv.append(divLinks);
			}

			if (options['add_one_button_enabled']) {
				divLinks.append($('<a href="#" class="add_one btn btn-sm btn-success">'+(isOptionDefined('add_one_button_label') ? options['add_one_button_label'] : 'Ajouter')+'</a>'));
			}
			if (options['add_multi_button_enabled']) {
				divLinks.append($('<a href="#" class="add_multi btn btn-sm btn-success">'+(isOptionDefined('add_multi_button_label') ? options['add_multi_button_label'] : 'Ajout multiple')+'</a>'));
			}
			formGroupDiv.append(divLinks);
		}

		if (options['entering_field_in_table']) {

		}
		else {

		}

		function addLine(item) {
			const table = formGroupDiv.find('table').removeClass('hide');
			let tr;
			if (table.find('tbody tr.base').length) {
				tr = table.find('tbody tr.base').clone().removeClass('hide').removeClass('base');
			}
			else {
				if (options['entering_field_in_table']) {
					tr = $('<tr>' +
						'<td><input type="text" name="'+options['input_name']+'"></td>' +
						'<td class="text-end">' +
						'<a href="#" title="Ajouter" class="add btn btn-sm btn-success"><i class="fas fa-plus"></i></a>' +
						'<a href="#" title="Supprimer" class="remove btn btn-sm btn-danger"><i class="fas fa-times"></i></a>' +
						'</td>' +
						'</tr>');
				}
				else {
					tr = $('<tr>' +
						'<td><input type="hidden" name="'+options['input_name']+'"> <span class="value"></span></td>' +
						'<td class="text-end"><a href="#" title="Supprimer" class="remove btn btn-sm btn-danger"><i class="fas fa-times"></i></a></td>' +
						'</tr>');
				}
			}
			tr.find('a.add').click(function () {
				addLine();
				return false;
			});
			tr.find('a.remove').click(function () {
				const tr = $(this).closest('tr');
				itemsList.unsetVal(tr.data('item'));
				tr.remove();
				onUpdateList();
				return false;
			});

			if (typeof item != 'undefined' && null !== item) {
				tr.data('item', item);
				tr.find('input').val(item);
				tr.find('span.value').text(item);
			}

			table.find('tbody').append(tr);
			return tr;
		}

		function onUpdateList() {
			formGroupDiv.find('.list_empty, table').addClass('hide');

			// Maj tableau
			if (itemsList.length) {
				let table = formGroupDiv.find('table').removeClass('hide');
				table.find('tbody').empty();
				itemsList.forEach(itemsList, item => addLine(item));
			}
			else {
				formGroupDiv.find('.list_empty').removeClass('hide');
			}

			if (typeof options['update_list_callback'] == 'function') {
				options['update_list_callback'](itemsList);
			}

			cancelAdd();
		}

		function startAdd() {
			formGroupDiv.find('a.add_one, a.add_multi').addClass('hide').closest('.links').addClass('hide');
			formGroupDiv.find('.item_add_one, .item_add_multi').addClass('hide');
			formGroupDiv.find('.item_add_one, .item_add_multi').find('input[type="text"], textarea').val('');
		}
		function cancelAdd() {
			formGroupDiv.find('a.add_one, a.add_multi').removeClass('hide').closest('.links').removeClass('hide');
			formGroupDiv.find('.item_add_one, .item_add_multi').addClass('hide');
		}

		function addItemsInList(items) {
			if (!Array.isArray(items)) {
				items = [items];
			}

			for (let i = 0; i < items.length; i++) {
				if (itemsList.indexOf(items[i]) === -1) {
					itemsList.push(items[i]);
				}
			}

			onUpdateList();
		}

		function submitAddNewItem(item, divAdd) {
			const items = Array.isArray(item) ? item : [item];

			divAdd.find('.errors').addClass('hide');

			if (typeof options['format_entered_value_callback'] == 'function') {
				items.map(item => options['format_entered_value_callback'](item, divAdd));
			}

			if (typeof options['get_errors_callback'] == 'function') {
				const errors = options['get_errors_callback'](items, itemsList, divAdd);
				if (errors.length) {
					displayErrors(divAdd, errors);
					return;
				}
			}

			addItemsInList(items);
		}

		function displayErrors(divAdd, errors) {
			if (!Array.isArray(errors)) {
				errors = [errors];
			}
			divAdd.find('.errors').text(errors.join('<br/>')).removeClass('hide');
		}

		function initLinkAddOne() {
			if (!formGroupDiv.find('a.add_one').length || !formGroupDiv.find('a.add_one:not([disabled])').length) {
				return;
			}

			let divAdd = formGroupDiv.find('.item_add_one');
			if (!divAdd.length) {
				divAdd = $(
					'<div class="item_add_one">' +
						'<div class="alert alert-danger pt-1 pb-1 errors hide"></div>' +
						'<div class="form-inline">' +
							'<input type="text" class="form-control" placeholder="'+options['item_name']+'" value="" /> &nbsp;' +
							'<a href="#" title="Ajouter" class="add btn btn-success"><i class="fas fa-plus"></i></a> &nbsp;' +
							'<a href="#" class="cancel">Annuler</a>' +
						'</div>' +
						(isOptionDefined('form_desc')?'<br><span class="form-text">'+options['form_desc']+'</span>':'') +
					'</div>'
				);
				formGroupDiv.append(divAdd);
			}

			divAdd.find('a.cancel').off('click').click(function () {
				cancelAdd();
				return false;
			});
			divAdd.find('a.add').off('click').click(function () {
				submitAddNewItem(divAdd.find('input[type="text"]').val());
				return false;
			});

			formGroupDiv.find('a.add_one').off('click').click(function () {
				startAdd();
				formGroupDiv.find('.item_add_one').removeClass('hide');
				return false;
			});
		}

		function initLinkAddMulti() {
			if (!formGroupDiv.find('a.add_multi').length || !formGroupDiv.find('a.add_multi:not([disabled])').length) {
				return;
			}

			let divAdd = formGroupDiv.find('.item_add_multi');
			if (!divAdd.length) {
				divAdd = $(
					'<div class="item_add_multi">' +
						'<div class="alert alert-danger pt-1 pb-1 errors hide"></div>' +
						'<div class="form-group">' +
							'<label>Liste à ajouter :</label>' +
							'<textarea name="emails" class="form-control" rows="10"></textarea>' +
							'<span class="form-text">Un élément par ligne.</span>' +
						'</div>' +
						'<div class="form-inline">' +
							'<a href="#" title="Ajouter" class="add btn btn-success"><i class="fas fa-plus"></i></a> &nbsp;' +
							'<a href="#" class="cancel">Annuler</a>' +
						'</div>' +
					'</div>'
				);
				formGroupDiv.append(divAdd);
			}

			divAdd.find('a.cancel').off('click').click(function () {
				cancelAdd();
				return false;
			});
			divAdd.find('a.add').off('click').click(function () {
				const items = divAdd.find('textarea').val().normalizeBreaks("\n").split(/\n/ms).filter(value => value.length > 0);
				submitAddNewItem(items);
				return false;
			});

			formGroupDiv.find('a.add_multi').off('click').click(function () {
				startAdd();
				formGroupDiv.find('.item_add_multi').removeClass('hide');
				return false;
			});
		}

		initLinkAddOne();
		initLinkAddMulti();
		onUpdateList();

		if (typeof options['init_callback'] == 'function') {
			options['init_callback'](formGroupDiv, onUpdateList, addItemsInList);
		}
	}
}

class EditValue {
	static init(valueDiv, onSubmitCallback, getInputCallback) {
		let link = $('<a href="#" class="text-warning"><i class="fas fa-pencil-alt"></i></a>');
		valueDiv.parent().append('&nbsp;').append(link);

		function cancelEdit(valueParentDiv) {
			valueParentDiv.find('a, span').removeClass('hide');
			valueParentDiv.find('form').remove();
		}

		link.click(function (e) {
			e.preventDefault();

			let parent = $(this).parent();

			parent.find('a, span').addClass('hide');

			let form = $('<form class="form-inline"></form>');

			let value = parent.find('span').data('value') || parent.find('span').text();
			let input = $( typeof getInputCallback == 'function' ? getInputCallback(value) : '<input type="text" />');
			form.append(input);
			form.find('input').addClass('form-control').css('width', 'auto').val(value);

			let button = $('<button type="submit" class="btn btn-success ms-2" data-loading-text="<i class=\'fa fa-circle-notch fa-spin\'></i>" style="vertical-align: baseline;"><i class="fas fa-check"></i></button>');
			button.click(function (e) {
				FormHelper.buttonLoader(parent.find('button'), 'loading');
				let newValue = parent.find('input').val();
				onSubmitCallback(newValue, parent,
					(isSuccess, valueFormatCallback) => {
						cancelEdit(parent);
						if (isSuccess) {
							parent.find('span').data('value', newValue).text(typeof valueFormatCallback == 'function' ? valueFormatCallback(newValue) : newValue);
						}
					}
				);
			});
			form.append(button);

			parent.append(form);
			return false;
		});
	}
}

module.exports = { FormHelper, ArrayField, EditValue };
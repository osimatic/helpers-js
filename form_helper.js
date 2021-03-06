class FormHelper {
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

	static getFormData(form) {
		// var formElement = document.getElementById("myFormElement");
		return new FormData(form[0]);
	}

	static getDataFromFormData(formData) {
		var data = {};
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


	static populateForm(form, data) {
		form.find('[name="employees_display_type"][value="NONE"]').prop('checked', true); //todo à retirer
		
		$.each(data, function(key, value) {
			if (value == null) {
				return;
			}

			if (typeof value == 'object') {
				var select = form.find('[name="'+key+'[]"]');
				select.find('option').prop('selected', false);
				select.data('default_id', value.join(','));
				$.each(value, function(key, val) {
					select.find('option[value="'+val+'"]').prop('selected', true);
				});
				return;
			}

			var input = form.find('[name="'+key+'"]');

			if (input.prop('type') === 'radio' || input.prop('type') === 'checkbox') {
				input.prop('checked', false);
				input.filter('[value="'+value+'"]').prop('checked', true);
				return;
			}

			input.val(value);
			// console.log(form.find('[name="'+key+'"]').length);
		});
	}

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

	static getLinesOfTextarea(textarea) {
		return textarea.val().replace(/(\r\n|\n|\r)/g, "\n").split("\n").filter(word => word.length > 0);
	}


	// ------------------------------------------------------------
	// Champs
	// ------------------------------------------------------------

	static initTypeFields(form) {
		//if ( $('[type="date"]').prop('type') != 'date' ) {
		//	$('[type="date"]').datepicker();
		//}
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

	// ------------------------------------------------------------
	// Messages
	// ------------------------------------------------------------

	static extractErrorKeyOfJson(json, onlyIfUniqueError) {
		if (typeof json == 'undefined' || json == null) {
			return null;
		}

		if (typeof json.error != 'undefined') {
			return json.error;
		}

		if (typeof onlyIfUniqueError != 'undefined' && onlyIfUniqueError && !json.length || json.length > 1) {
			return null;
		}

		if (typeof json[0] != 'undefined' && typeof json[0].error != 'undefined') {
			return json[0].error;
		}

		return null;
	}

	static hideFormErrors(form) {
		form.find('div.form_errors').remove();
		return form;
	}

	static getFormErrorText(errors) {
		let errorLabels = '';
		for (let property in errors) {
			// console.log(property);
			if (typeof errors[property] != 'function') {
				if (typeof errors[property]['error_description'] === 'undefined') {
					errorLabels += '<span>' + errors[property] + '</span><br>';
				} else {
					errorLabels += '<span>' + errors[property]['error_description'] + '</span><br>';
				}
			}
		}
		return errorLabels;
	}

	static displayFormErrors(form, btnSubmit, errors, errorWrapperDiv) {
		this.displayFormErrorsFromText(form, this.getFormErrorText(errors), errorWrapperDiv);
		if (btnSubmit != null) {
			if (btnSubmit.buttonLoader != null) {
				btnSubmit.buttonLoader('reset');
			} else {
				btnSubmit.attr('disabled', false).button('reset');
			}
		}
	}

	static displayFormErrorsFromText(form, errorLabels, errorWrapperDiv) {
		let errorDiv = '<div class="alert alert-danger form_errors">'+errorLabels+'</div>';

		if (typeof errorWrapperDiv != 'undefined' && errorWrapperDiv != null) {
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


	static buttonLoader(button, action) {
		button = $(button);
		if (action === 'start' || action === 'loading') {
			if (button.attr('disabled')) {
				return self;
			}
			button.attr('disabled', true);
			button.attr('data-btn-text', button.html());
			//let text = '<span class="spinner"><i class=\'fa fa-circle-notch fa-spin\'></i></span>Traitement en cours…';
			let text = '<i class=\'fa fa-circle-notch fa-spin\'></i> Traitement en cours…';
			if (button.data('load-text') != undefined && button.data('load-text') != null && button.data('load-text') != '') {
				text = button.data('load-text');
			}
			if (button.data('loading-text') != undefined && button.data('loading-text') != null && button.data('loading-text') != '') {
				text = button.data('loading-text');
			}
			button.html(text);
			button.addClass('disabled');
		}
		if (action === 'stop' || action === 'reset') {
			button.html(button.attr('data-btn-text'));
			button.removeClass('disabled');
			button.attr('disabled', false);
			//button.removeAttr("disabled");
		}
		return button;
	}
	
	
	
	

	/** @deprecated **/
	static logRequestFailure(status, exception) {
		console.log('request failure. Status: '+status+' ; Exception: '+exception);
	}

	/** @deprecated **/
	static displayFormErrorsFromXhr(form, btnSubmit, xhr) {
		this.displayFormErrors(form, btnSubmit, xhr.responseJSON);
	}

}

module.exports = { FormHelper };
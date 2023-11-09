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
			if (typeof errors[property] != 'function') {
				if (typeof errors[property]['error_description'] === 'undefined') {
					errorLabels.push(errors[property]);
				} else {
					errorLabels.push(errors[property]['error_description']);
				}
			}
		}
		return errorLabels.removeEmptyValues().map(errorLabel => '<span>' + errorLabel + '</span>').join('<br/>');
	}

	static displayFormErrors(form, btnSubmit, errors, errorWrapperDiv) {
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

module.exports = { FormHelper, EditValue };
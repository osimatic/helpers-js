
class ImportFromCsv {

	static initModal(modal, importColumns, requestImportData, specificDescDiv, additionalFormField) {
		modal.find('.modal-body').empty().append($('.import_form_base').clone().removeClass('import_form_base hide'));

		let formUpload = modal.find('.form_upload');
		let formMatching = modal.find('.form_matching');
		let divResult = modal.find('.csv_result');

		function resetUi() {
			formMatching.addClass('hide');
			formUpload.removeClass('hide');
			formUpload.find('div.errors').addClass('hide');
		}

		if (typeof specificDescDiv != 'undefined' && specificDescDiv != null) {
			modal.find('.specific_desc').append(specificDescDiv);
		}

		if (typeof additionalFormField != 'undefined' && additionalFormField != null) {
			modal.find('.import_matching_select_content').after(additionalFormField);
		}

		formUpload.find('button[type="submit"]').click(function(event) {
			event.preventDefault();
			$(this).buttonLoader('loading');
			formUpload.find('div.errors').addClass('hide');

			let isFileParsed = false;
			let hasHeader = formUpload.find('input[name="header"][value="1"]:checked').length;
			let encoding = formUpload.find('select[name="encoding"]').val();

			formUpload.find('input[type="file"]').parse({
				config: {
					header: hasHeader,
					encoding: encoding,
					dynamicTyping: false,
					skipEmptyLines: true,
					beforeFirstChunk: function(chunk) {
						return chunk.trim();
					},
					complete: function(results, file) {
						isFileParsed = true;
						console.log(file, results);

						if (false === CSV.checkFile(file.name, file.type)) {
							$('#form_import_upload div.errors').html(errorMessageFileNotValid).removeClass('hide');
							return;
						}

						let parsedImportList = results.data;
						let header = hasHeader?results.meta.fields:results.data[0];

						ImportFromCsv.displayData(divResult, parsedImportList, (hasHeader?header:null), formMatching);
						ImportFromCsv.displayFormMatching(formMatching, importColumns, header, hasHeader);

						formUpload.addClass('hide');
					}
				},
				before: function(file, inputElem) {
				},
				error: function(err, file, inputElem, reason) {
					isFileParsed = true;
					formUpload.find('div.errors').html(errorMessageFileNotValid).removeClass('hide');
					console.log(err, file, reason);
				},
				complete: function() {
					if (!isFileParsed) {
						formUpload.find('div.errors').html(errorMessageFileEmpty).removeClass('hide');
					}
					formUpload.find('button[type="submit"]').buttonLoader('reset');
				}
			});
			event.preventDefault();
		});

		formMatching.find('button[type="submit"]').click(function (event) {
			event.preventDefault();
			$(this).buttonLoader('loading');
			formMatching.find('div.errors').addClass('hide').empty();
			divResult.find('table tr').removeClass('danger');
			
			let tabLink = ImportFromCsv.getTabLink(formMatching);
			console.log('tabLink', tabLink);

			if ($.isEmptyObject(tabLink)) {
				formMatching.find('div.errors').html(errorMessageImportSelectColumns).removeClass('hide');
				$(this).buttonLoader('reset');
				return false;
			}

			let dataToImport = ImportFromCsv.getDataToImport(divResult, tabLink);
			console.log('dataToImport', dataToImport);

			requestImportData(dataToImport,
				// fonction callback en cas d'erreur de formulaire
				(json) => {
					console.log(json);
					if (typeof json['import_list'] !== 'undefined') {
						formMatching.find('div.errors').html(json['import_list']).removeClass('hide');
					}
					else {
						formMatching.find('div.errors').html(ImportFromCsv.getErrorsHtmlOfImportData(json, divResult)).removeClass('hide');
					}
					formMatching.find('button[type="submit"]').buttonLoader('reset');
				}
			);
		});

		formMatching.find('a.cancel_link').click(function (event) {
			resetUi();
		});

		resetUi();
	}

	static getDataToImport(divResult, tabLink) {
		let importListWithFieldNames = [];
		$.each(divResult.find('table tbody tr'), function(index, line) {
			// console.log('line', line);
			if (!$(line).find('input.import_line_checkbox:checked').length) {
			// if (!divResult.find('table tr[data-line="'+(index+1)+'"] input.import_line_checkbox:checked').length) {
				return;
			}

			let lineData = {line: (index+1)};
			$.each(tabLink, function(key, listeImportIndex) {
				if (listeImportIndex != -1) {
					var td = $(line).find('td[data-key="'+listeImportIndex+'"]');
					if (td.length) {
						lineData[key] = td.text();
					}
				}
			});
			console.log('lineData', lineData);
			importListWithFieldNames.push(lineData);
		});
		return importListWithFieldNames;
	}

	static displayData(divResult, data, header, formMatching) {
		let table = divResult.find('table');
		if (table.length === 0) {
			divResult.append('<table class="table table-sm table-bordered"></table>');
			table = divResult.find('table');
		}
		table.empty();

		let tableContent = '';
		if (null !== header) {
			tableContent += '<thead><tr>';
			//tableContent += '<th><input type="checkbox" class="import_line_select_all" /></th>';
			tableContent += '<th></th>';
			$.each(header, function (index, value) {
				tableContent += '<th>'+value+'</th>';
			});
			tableContent += '<th></th>';
			tableContent += '</tr></thead>';
		}

		tableContent += '<tbody>';
		$.each(data, function (index, line) {
			tableContent += '<tr data-line="'+(index+1)+'">';
			tableContent += '<td class="gras text-end select_line_checkbox"><input type="checkbox" class="import_line_checkbox pull-left" checked="checked" /> '+(index+1)+'.</td>';
			$.each(line, function (key, value) {
				tableContent += '<td data-key="'+key+'">'+(value!==null?value:'')+'</td>';
			});
			tableContent += '<td class="text-center edit_line_button"></td>';
			tableContent +='</tr>';
		});
		tableContent += '</tbody>';

		table.html(tableContent);

		table.find('td.edit_line_button').each(function(idx, el) {
			ImportFromCsv.initEditLink(formMatching, $(el));
		});

		divResult.removeClass('hide');
	}

	static initValidateLine(formMatching, td) {
		td.html($('<a href="#" class="import_validate_line text-success"><i class="fas fa-check"></i></a>'));
		td.find('a.import_validate_line').click(function () {
			let tr = $(this).parent().parent();
			tr.find('td').each(function(key, el) {
				let td = $(el);
				if (td.hasClass('select_line_checkbox') || td.hasClass('edit_line_button')) {
					return;
				}
				td.html(td.find('input').val());
			});

			if (!td.closest('table').find('td input[type="text"]').length) {
				formMatching.find('button[type="submit"]').prop('disabled', false);
			}
			ImportFromCsv.initEditLink(formMatching, td);
			return false;
		});
	}

	static initEditLink(formMatching, td) {
		td.html($('<a href="#" class="import_edit_line text-danger"><i class="fas fa-pencil-alt"></i></a>'));
		td.find('a.import_edit_line').click(function () {
			let tr = $(this).parent().parent();
			tr.find('td').each(function(key, el) {
				let td = $(el);
				if (td.hasClass('select_line_checkbox') || td.hasClass('edit_line_button')) {
					return;
				}
				td.data('original_value', td.html());
				td.html($('<input type="text" class="form-control" value="'+td.html()+'" />'));
			});
			formMatching.find('button[type="submit"]').prop('disabled', true);
			ImportFromCsv.initValidateLine(formMatching, td);
			return false;
		});
	}

	static getErrorsHtmlOfImportData(json, divResult) {
		let resultError = errorMessageImportFailed;
		resultError += '<ul>';
		$.each(json, function(idx, errorData) {
			console.log(errorData);
			divResult.find('table tr[data-line="'+errorData.line+'"]').addClass('danger');

			resultError += '<li>'+lineLabel.format(errorData.line)+'<ul>';
			$.each(errorData.errors, function(index, error) {
				resultError += '<li>'+error+'</li>';
			});
			resultError += '</ul></li>';
		});
		resultError +='</ul>';
		return resultError;
	}

	static getTabLink(formMatching) {
		let tabLink = {};
		formMatching.find('select').each(function(idx, select) {
			var listeImportIndex = $(select).val();
			if (listeImportIndex != -1) {
				let key = $(select).prop('name');
				tabLink[key] = listeImportIndex;
			}
		});
		return tabLink;
	}

	static displayFormMatching(formMatching, importColumns, header, hasHeader) {
		let options = '<option value="-1">'+selectDefaultOptionLabel+'</option>';
		$.each(header, function (index, value) {
			options += '<option value="'+(hasHeader?value:index)+'">' + value + '</option>';
		});

		let selectContent = formMatching.find('.import_matching_select_content').addClass('row').empty();
		$.each(importColumns, function (key, label) {
			let selectFormGroup = $(
				'<div class="form-group col-md-3">' +
					'<label for="form_import_'+key+'">'+label+'</label>' +
					'<select class="form-control" name="'+key+'" id="form_import_'+key+'">'+options+'</select>' +
				'</div>'
			);
			selectFormGroup.find('select option:contains('+label+')').prop('selected', true);
			selectContent.append(selectFormGroup);
		});

		formMatching.find('div.errors').addClass('hide');
		formMatching.removeClass('hide');
	}

}

module.exports = { ImportFromCsv };
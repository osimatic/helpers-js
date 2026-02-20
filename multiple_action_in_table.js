
class MultipleActionInTable {

	// Ajoute les colonnes select (thead th + tbody td) dans le DOM.
	// Idempotent : sans effet si les colonnes existent déjà.
	// Doit être appelé AVANT l'initialisation DataTable.
	static initCols(table, cellCssClass = 'select') {
		if (!table.hasClass('table-action_multiple')) {
			return;
		}
		if (MultipleActionInTable.getDivBtn(table) == null) {
			return;
		}

		if (table.find('thead tr th[data-key="select"]').length === 0) {
			table.find('thead tr').prepend($('<th class="' + cellCssClass + '" data-key="select"></th>'));
		}
		table.find('tbody tr:not(.no_items)').each(function(idx, tr) {
			if ($(tr).find('td.select').length === 0) {
				$(tr).prepend($('<td class="select"><input type="checkbox" class="action_multiple_checkbox" name="' + $(tr).data('action_multiple_input_name') + '" value="' + $(tr).data('action_multiple_item_id') + '"></td>'));
			}
		});
	}

	// Initialise les colonnes (via initCols) puis branche les event handlers.
	// Peut être appelé après l'initialisation DataTable.
	static init(table, cellCssClass = 'select') {
		if (!table.hasClass('table-action_multiple')) {
			return;
		}

		let divBtn = MultipleActionInTable.getDivBtn(table);
		if (divBtn == null) {
			return;
		}

		MultipleActionInTable.initCols(table, cellCssClass);

		if (!divBtn.hasClass('action_multiple_buttons_initialized')) {
			divBtn.prepend($('<img src="'+ROOT_PATH+DOSSIER_IMAGES+'arrow_ltr.png" alt="" /> &nbsp;'));
			divBtn.append($('<br/><br/>'));
			divBtn.addClass('action_multiple_buttons_initialized');
		}

		let firstTh = table.find('thead tr th').first();
		if (firstTh.find('input').length === 0) {
			firstTh.html('<input type="checkbox" class="action_multiple_check_all" />');
		}

		table.find('input.action_multiple_checkbox').change(function() {
			MultipleActionInTable.updateCheckbox(table);
		});

		table.find('input.action_multiple_check_all').off('click').click(function() {
			let table = $(this).closest('table');
			let checkbox = table.find('input.action_multiple_checkbox');
			let checkboxChecked = table.find('input.action_multiple_checkbox:checked');
			if (checkbox.length === checkboxChecked.length) {
				checkbox.prop('checked', false);
			}
			else {
				checkbox.prop('checked', true);
			}
			MultipleActionInTable.updateCheckbox(table);
		});

		MultipleActionInTable.updateCheckbox(table);
	}

	static updateCheckbox(table) {
		MultipleActionInTable.showButtonsAction(table);

		let allCheckbox = table.find('input.action_multiple_checkbox');
		let allCheckboxChecked = table.find('input.action_multiple_checkbox:checked');
		let checkboxSelectAll = table.find('thead tr th input.action_multiple_check_all');

		if (allCheckbox.length === 0) {
			checkboxSelectAll.addClass('hide');
			return;
		}

		checkboxSelectAll.removeClass('hide');
		if (allCheckbox.length === allCheckboxChecked.length) {
			checkboxSelectAll.prop('checked', true);
		}
		else {
			checkboxSelectAll.prop('checked', false);
		}
	}

	static getDivBtn(table) {
		let divTableResponsive = table.parent();
		let divBtn = divTableResponsive.next();
		if (divBtn.hasClass('action_multiple_buttons')) {
			return divBtn;
		}
		divBtn = divTableResponsive.parent().parent().parent().next();
		if (divBtn.hasClass('action_multiple_buttons')) {
			return divBtn;
		}
		return null;
	}

	static showButtonsAction(table) {
		let divBtn = MultipleActionInTable.getDivBtn(table);
		if (divBtn == null) {
			return;
		}

		// console.log(divBtn);
		//var nbItems = $('input[name="' + checkbox.attr('name') + '"]:checked').length;
		let nbItems = table.find('input.action_multiple_checkbox:checked').length;

		if (nbItems > 0 && divBtn.is(':hidden')) {
			divBtn.removeClass('hide');
		}
		// 13/04/2021 : si le tableau est caché cela veut dire qu'il est en train de s'initialiser (après avoir chargé les données) et donc s'il n'y a pas de ligne sélectionnées, on cache la div buttons
		else if ((nbItems === 0 && divBtn.is(':visible')) || (nbItems === 0 && table.is(':hidden'))) {
			divBtn.addClass('hide');
		}

		// affichage aucune action possible si aucun bouton n'est visible
		if (divBtn.is(':visible')) {
			divBtn.find('span.no_button').remove();
			if (divBtn.find('button:visible, a:visible').length === 0) {
				divBtn.find('img').after('<span class="no_button"><em>aucune action possible</em></span>');
			}
		}
	}

}

class MultipleActionInDivList {
// init checkbox
	static init(contentDiv) {
		let buttonsDiv = MultipleActionInDivList.getButtonsDiv(contentDiv);
		if (buttonsDiv == null) {
			return;
		}

		buttonsDiv.addClass('hide');

		// Si aucune div sélectionnable, on n'applique pas le plugin
		if (!contentDiv.find('.multiple_action').length) {
			return;
		}

		if (!buttonsDiv.data('action_multiple_buttons_initialized')) {
			buttonsDiv.prepend($('<img src="'+ROOT_PATH+DOSSIER_IMAGES+'arrow_ltr.png" alt="" /> &nbsp;'));
			buttonsDiv.append($('<br/><br/>'));
			buttonsDiv.data('action_multiple_buttons_initialized', 1);
		}

		// Ajout checkbox pour chaque div sélectionnable
		contentDiv.find('.multiple_action').each(function(idx, div) {
			if ($(div).find('div.multi_select').length === 0) {
				$(div).prepend($('<div class="multi_select float-start me-2"><input type="checkbox" class="action_multiple_checkbox" name="'+$(div).data('action_multiple_input_name')+'" value="'+$(div).data('action_multiple_item_id')+'"></div>'));
			}
		});

		// Ajout checkbox select all
		if (contentDiv.find('input.action_multiple_check_all').length === 0) {
			contentDiv.prepend('<p class="mb-2"><input type="checkbox" class="action_multiple_check_all" /> Tout sélectionner</p>');
		}

		contentDiv.find('input.action_multiple_checkbox').change(function() {
			MultipleActionInDivList.updateCheckbox(contentDiv);
		});

		contentDiv.find('input.action_multiple_check_all').off('click').click(function() {
			let checkbox = contentDiv.find('input.action_multiple_checkbox');
			let checkboxChecked = contentDiv.find('input.action_multiple_checkbox:checked');
			if (checkbox.length === checkboxChecked.length) {
				checkbox.prop('checked', false);
			}
			else {
				checkbox.prop('checked', true);
			}
			MultipleActionInDivList.updateCheckbox(contentDiv);
		});

		MultipleActionInDivList.updateCheckbox(contentDiv);
	}

	static updateCheckbox(contentDiv) {
		MultipleActionInDivList.showButtonsAction(contentDiv);

		let allCheckbox = contentDiv.find('input.action_multiple_checkbox');
		let allCheckboxChecked = contentDiv.find('input.action_multiple_checkbox:checked');
		let checkboxSelectAll = contentDiv.find('input.action_multiple_check_all');

		if (allCheckbox.length === 0) {
			checkboxSelectAll.addClass('hide');
			return;
		}

		checkboxSelectAll.removeClass('hide');
		if (allCheckbox.length === allCheckboxChecked.length) {
			checkboxSelectAll.prop('checked', true);
		}
		else {
			checkboxSelectAll.prop('checked', false);
		}
	}

	static getButtonsDiv(contentDiv) {
		let buttonsDiv = contentDiv.next();
		if (buttonsDiv.hasClass('action_multiple_buttons')) {
			return buttonsDiv;
		}
		return null;
	}

	static showButtonsAction(contentDiv) {
		let buttonsDiv = MultipleActionInDivList.getButtonsDiv(contentDiv);
		if (buttonsDiv == null) {
			return;
		}

		// console.log(divBtn);
		//var nbItems = $('input[name="' + checkbox.attr('name') + '"]:checked').length;
		let nbItems = contentDiv.find('input.action_multiple_checkbox:checked').length;

		if (nbItems > 0 && buttonsDiv.is(':hidden')) {
			buttonsDiv.removeClass('hide');
		}
		// 13/04/2021 : si le tableau est caché cela veut dire qu'il est en train de s'initialiser (après avoir chargé les données) et donc s'il n'y a pas de ligne sélectionnées, on cache la div buttons
		else if ((nbItems === 0 && buttonsDiv.is(':visible')) || (nbItems === 0 && contentDiv.is(':hidden'))) {
			buttonsDiv.addClass('hide');
		}

		// affichage aucune action possible si aucun bouton n'est visible
		if (buttonsDiv.is(':visible')) {
			buttonsDiv.find('span.no_button').remove();
			if (buttonsDiv.find('button:visible, a:visible').length === 0) {
				buttonsDiv.find('img').after('<span class="no_button"><em>aucune action possible</em></span>');
			}
		}
	}
}

module.exports = { MultipleActionInTable, MultipleActionInDivList };

/*
// init checkbox
function initTableActionMultiple(table) {
	if (!table.hasClass('table-action_multiple')) {
		return;
	}

	var divBtn = tableActionMultipleGetDivBtn(table);
	if (divBtn == null) {
		return;
	}

	if (table.find('thead tr th[data-key="select"]').length === 0) {
		table.find('thead tr').prepend($('<th class="select no-sort" data-key="select"></th>'));
	}
	table.find('tbody tr:not(.no_items)').each(function(idx, tr) {
		if ($(tr).find('td.select').length === 0) {
			$(tr).prepend($('<td class="select"><input type="checkbox" class="action_multiple_checkbox" name="'+$(tr).data('action_multiple_input_name')+'" value="'+$(tr).data('action_multiple_item_id')+'"></td>'));
		}
	});

	table.find('input.action_multiple_checkbox').each(function(idx, el) {
		var th = $(el).closest('table').find('thead tr th').first();
		if (th.find('input').length === 0) {
			// console.log(th);
			th.html('<input type="checkbox" class="action_multiple_check_all" />');
			// th.html('Coucou');
		}
	});

	table.find('input.action_multiple_checkbox').change(function() {
		majCheckbox(table);
	});

	table.find('input.action_multiple_check_all').off('click').click(function() {
		var table = $(this).closest('table');
		var checkbox = table.find('input.action_multiple_checkbox');
		var checkboxChecked = table.find('input.action_multiple_checkbox:checked');
		if (checkbox.length === checkboxChecked.length) {
			checkbox.prop('checked', false);
		}
		else {
			checkbox.prop('checked', true);
		}
		majCheckbox(table);
	});
}

function majCheckbox(table) {
	showButtonsAction(table);

	var allCheckbox = table.find('input.action_multiple_checkbox');
	var allCheckboxChecked = table.find('input.action_multiple_checkbox:checked');
	var checkboxSelectAll = table.find('thead tr th input.action_multiple_check_all');
	if (allCheckbox.length === allCheckboxChecked.length) {
		checkboxSelectAll.prop('checked', true);
	}
	else {
		checkboxSelectAll.prop('checked', false);
	}
}

function tableActionMultipleGetDivBtn(table) {
	var divTableResponsive = table.parent();
	var divBtn = divTableResponsive.next();
	if (divBtn.hasClass('action_multiple_buttons')) {
		return divBtn;
	}
	divBtn = divTableResponsive.parent().parent().parent().next();
	if (divBtn.hasClass('action_multiple_buttons')) {
		return divBtn;
	}
	return null;
}

function showButtonsAction(table) {
	var divBtn = tableActionMultipleGetDivBtn(table);
	if (divBtn == null) {
		return;
	}

	// console.log(divBtn);
	//var nbItems = $('input[name="' + checkbox.attr('name') + '"]:checked').length;
	var nbItems = table.find('input.action_multiple_checkbox:checked').length;

	if (nbItems > 0 && divBtn.is(':hidden')) {
		divBtn.removeClass('hide');
	}
	else if (nbItems === 0 && divBtn.is(':visible')) {
		divBtn.addClass('hide');
	}

	// affichage aucune action possible si aucun bouton n'est visible
	if (divBtn.is(':visible')) {
		divBtn.find('span.no_button').remove();
		if (divBtn.find('button:visible, a:visible').length === 0) {
			divBtn.find('img').after('<span class="no_button"><em>aucune action possible</em></span>');
		}
	}
}

$(function() {
	$('.action_multiple_buttons').prepend($('<img src="'+ROOT_PATH+DOSSIER_IMAGES+'arrow_ltr.png" alt="" /> &nbsp;'));
	$('.action_multiple_buttons').append($('<br/><br/>'));

	$('table.table-action_multiple').each(function(idx, table) {
		initTableActionMultiple($(table));
	});
});
*/
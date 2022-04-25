
class MultipleActionInTable {
	// init checkbox
	static init(table) {
		if (!table.hasClass('table-action_multiple')) {
			return;
		}

		var divBtn = MultipleActionInTable.getDivBtn(table);
		if (divBtn == null) {
			return;
		}

		if (!divBtn.hasClass('action_multiple_buttons_initialized')) {
			divBtn.prepend($('<img src="'+ROOT_PATH+DOSSIER_IMAGES+'arrow_ltr.png" alt="" /> &nbsp;'));
			divBtn.append($('<br/><br/>'));
			divBtn.addClass('action_multiple_buttons_initialized');
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
			MultipleActionInTable.updateCheckbox(table);
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
			MultipleActionInTable.updateCheckbox(table);
		});

		MultipleActionInTable.updateCheckbox(table);
	}

	static updateCheckbox(table) {
		MultipleActionInTable.showButtonsAction(table);

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

	static getDivBtn(table) {
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

module.exports = { MultipleActionInTable };

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
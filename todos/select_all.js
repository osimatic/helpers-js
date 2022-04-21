class SelectAll {

	// Dans un form-group

	static initLinkInFormGroup(link) {
		link.off('click').click(function() {
			let formGroup = $(this).closest('.form-group');
			let allCheckbox = formGroup.find('input[type="checkbox"]:not(.check_all)');
			let allCheckboxWithCheckAll = formGroup.find('input[type="checkbox"]');
			let allCheckboxChecked = formGroup.find('input[type="checkbox"]:not(.check_all):checked');
			if (allCheckbox.length === allCheckboxChecked.length) {
				allCheckboxWithCheckAll.prop('checked', false);
			}
			else {
				allCheckboxWithCheckAll.prop('checked', true);
			}
			SelectAll.updateFormGroup(formGroup);
			return false;
		});

		link.closest('.form-group').find('input[type="checkbox"]').change(function() {
			SelectAll.updateFormGroup($(this).closest('.form-group'));
		});
		SelectAll.updateFormGroup(link.closest('.form-group'));
	}

	static updateFormGroup(formGroup) {
		let allCheckbox = formGroup.find('input[type="checkbox"]:not(.check_all)');
		let allCheckboxChecked = formGroup.find('input[type="checkbox"]:not(.check_all):checked');
		let lienSelectAll = formGroup.find('a.check_all');
		// console.log(formGroup);
		// console.log('SelectAll.updateFormGroup', allCheckbox.length, allCheckboxChecked.length);
		if (allCheckboxChecked.length > 0 && allCheckbox.length === allCheckboxChecked.length) {
			lienSelectAll.text('Tout désélectionner');
		}
		else {
			lienSelectAll.text('Tout sélectionner');
		}
	}

	// Dans tableau

	static initInTable(table) {
		let inputCheckAll = table.find('tr input.check_all');
		if (inputCheckAll.length === 0) {
			return;
		}
		inputCheckAll.off('click').click(function() {
			let allCheckbox = table.find('tbody input[type="checkbox"]');
			let allCheckboxChecked = table.find('tbody input[type="checkbox"]:checked');
			if (allCheckbox.length === allCheckboxChecked.length) {
				allCheckbox.prop('checked', false);
			}
			else {
				allCheckbox.prop('checked', true);
			}
			SelectAll.updateTable(table);
		});

		table.find('tbody input[type="checkbox"]').off('change').change(function() {
			SelectAll.updateTable(table);
		});
		SelectAll.updateTable(table);
	}

	static updateTable(table) {
		let allCheckbox = table.find('tbody input[type="checkbox"]');
		let allCheckboxChecked = table.find('tbody input[type="checkbox"]:checked');
		let checkboxSelectAll = table.find('thead input.check_all');
		if (allCheckboxChecked.length > 0 && allCheckbox.length === allCheckboxChecked.length) {
			checkboxSelectAll.prop('checked', true);
		}
		else {
			checkboxSelectAll.prop('checked', false);
		}
	}

	// Dans un div

	static initDiv(div) {
		div.find('input.check_all').off('click').click(function() {
			let rootDiv = $(this).closest('div.checkbox_with_check_all');
			let allCheckbox = rootDiv.find('input[type="checkbox"]:not(.check_all)');
			let allCheckboxChecked = rootDiv.find('input[type="checkbox"]:not(.check_all):checked');
			if (allCheckbox.length === allCheckboxChecked.length) {
				allCheckbox.prop('checked', false);
			}
			else {
				allCheckbox.prop('checked', true);
			}
			SelectAll.updateDiv(rootDiv);
			//SelectAll.updateFormGroup(rootDiv.closest('.form-group'));
		});

		div.find('div.checkbox, div.form-check').find('input[type="checkbox"]').change(function() {
			SelectAll.updateDiv($(this).closest('div.checkbox_with_check_all'));
		});
		SelectAll.updateDiv(div);
	}

	static updateDiv(div) {
		// console.log('SelectAll.updateDiv');
		// console.log(checkbox);
		// 22/11/2021 : rajout :not(.check_all) sinon si toutes les cases sont coché, la case select all n'est pas coché à l'initialisation
		let allCheckbox = div.find('div.checkbox, div.form-check').find('input[type="checkbox"]:not(.check_all)');
		let allCheckboxChecked = div.find('div.checkbox, div.form-check').find('input[type="checkbox"]:not(.check_all):checked');
		let checkboxSelectAll = div.find('input.check_all');
		if (allCheckboxChecked.length > 0 && allCheckbox.length === allCheckboxChecked.length) {
			checkboxSelectAll.prop('checked', true);
		}
		else {
			checkboxSelectAll.prop('checked', false);
		}
	}
}

$(function() {
	// Dans un form-group
	$('a.check_all').each(function(idx, link) {
		SelectAll.initLinkInFormGroup($(link));
	});

	// Dans tableau
	$('table tr input.check_all').each(function(idx, inputCheckAll) {
		SelectAll.initInTable($(inputCheckAll).closest('table'));
	});

	// Dans un div
	$('div.checkbox_with_check_all').each(function(idx, div) {
		SelectAll.initDiv($(div));
	});
});

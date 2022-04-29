class FormDate {
	static majSelectPeriode(select) {
		if (select.find(':selected').attr('value') == 'perso') {
			select.parent().parent().next().removeClass('hide');
		}
		else {
			select.parent().parent().next().addClass('hide');
		}
	}
	
	static majSelectCompare() {
		if ($('form select#periodeCompare').length == 0) {
			return;
		}
	
		var listValues = [];
		periodeSelected = $('form select.periode :selected').attr('value');
		selectCompare = $('form select#periodeCompare');
		periodeCompareSelected = selectCompare.find(':selected').attr('value');
	
		selectCompare.find('option').removeAttr('disabled');
	
		$.each(listePeriodeCompare, function (idx, tabListPeriode) {
			if (idx != 0) {
				listKeyPeriode = array_keys(tabListPeriode.list);
				if (in_array(periodeSelected, listKeyPeriode)) {
					listValues = listKeyPeriode;
					valueDefault = listKeyPeriode[1];
				}
				else {
					selectCompare.find('option[value="' + listKeyPeriode[0] + '"]').parent().children().attr('disabled', 'disabled');
				}
			}
		});
	
		if (periodeSelected == 'perso') {
			valueDefault = 'perso';
		}
		else if (periodeCompareSelected != 'perso' && in_array(periodeCompareSelected, listValues)) {
			valueDefault = periodeCompareSelected;
		}
		selectCompare.find('option[value="' + valueDefault + '"]').attr('selected', 'selected');
	
		majSelectPeriode(selectCompare);
	}
	
	static selectFormDateToday(lien) {
		date = new Date();
		selectFormDate(lien, date.getDate(), (date.getMonth() + 1), date.getFullYear());
	}
	
	static selectFormDateDayMoinsNb(lien, nbJoursMoins) {
		date = new Date();
		date.setDate(date.getDate() - nbJoursMoins);
		selectFormDate(lien, date.getDate(), (date.getMonth() + 1), date.getFullYear());
	}
	
	static selectFormDateCurrentMonth(lien) {
		date = new Date();
		selectFormDate(lien, -1, (date.getMonth() + 1), date.getFullYear());
	}
	
	static selectFormDateMonthMoinsNb(lien, nbMoisMoins) {
		date = new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() - nbMoisMoins);
		selectFormDate(lien, -1, (date.getMonth() + 1), date.getFullYear());
	}
	
	static selectFormDateCurrentYear(lien) {
		today = new Date();
		selectFormDate(lien, -1, -1, today.getFullYear());
	}
	
	static selectFormDateYearMoinsNb(lien, nbAnneesMoins) {
		today = new Date();
		selectFormDate(lien, -1, -1, today.getFullYear() - nbAnneesMoins);
	}
	
	static selectFormDateAddDayFromSelectedDay(lien, nbDaysAdded) {
		date = getDateObjectSelected(lien);
		date.setDate(date.getDate() + nbDaysAdded);
		selectFormDate(lien, date.getDate(), (date.getMonth() + 1), date.getFullYear());
	}
	
	static getDateObjectSelected(lien) {
		selectorDay = '#' + (lien.parent().prev().prev().prev().prev().attr('id')) + ' option:selected';
		selectorMonth = '#' + (lien.parent().prev().prev().prev().attr('id')) + ' option:selected';
		selectorYear = '#' + (lien.parent().prev().prev().attr('id')) + ' option:selected';
		if ($(selectorDay).length > 0 && $(selectorMonth).length > 0 && $(selectorYear).length > 0) {
			return new Date($(selectorYear).attr('value'), $(selectorMonth).attr('value') - 1, $(selectorDay).attr('value'));
		}
		return new Date();
	}
	
	static selectFormDate(lien, day, month, year) {
		selectorDay = '#' + (lien.parent().prev().prev().prev().prev().attr('id')) + ' option[value=' + day + ']';
		selectorMonth = '#' + (lien.parent().prev().prev().prev().attr('id')) + ' option[value=' + month + ']';
		selectorYear = '#' + (lien.parent().prev().prev().attr('id')) + ' option[value=' + year + ']';
		if ($(selectorDay).length > 0) $(selectorDay).prop('selected', 'selected');
		if ($(selectorMonth).length > 0) $(selectorMonth).prop('selected', 'selected');
		if ($(selectorYear).length > 0) $(selectorYear).prop('selected', 'selected');
	}
}

module.exports = { FormDate };


//A DEPLACER DANS LE PROJET MYTIME
/*$(function() {
	// ---------- Choix période (new) ----------

	// Formulaire de sélection de période
	
	if ($('form select.periode').length > 0) {
		$('form select.periode').change(function() {
			majSelectPeriode($(this));
			
			if ($(this).attr('id') == 'periode') {
				majSelectCompare();
			}
		});
	}	

	majSelectCompare();
	// majSelectPeriode($('form select#periodeCompare'));
	

	// ---------- Choix période (old) ----------
	
	if ($('form #day').length > 0 && $('form #month').length > 0 && $('form #year').length > 0) {
		$('form #year').after(
			'<br/>'+
			'<p class="select_date_fastly">'+
			'	<a href="#" class="lien_form_today">Auj.</a> - '+
			'	<a href="#" class="lien_form_yesterday">Hier</a> - '+
			'	<a href="#" class="lien_form_current_month">Ce mois-ci</a> - '+
			'	<a href="#" class="lien_form_last_month">Le mois dernier</a> - '+
			'	<a href="#" class="lien_form_current_year">Cette année</a>'+
			'	- '+
			'	<a href="#" class="lien_form_date_prev_day">Jour précédent</a>'+
			'	- '+
			'	<a href="#" class="lien_form_date_next_day">Jour suivant</a>'+
			'</p>'+
			''
		);
	}
	else if ($('form #month').length > 0 && $('form #year').length > 0) {
		$('form #year').after(
			'<br/>'+
			'<p class="select_date_fastly">'+
			'	<a href="#" class="lien_form_current_month">Ce mois-ci</a> - '+
			'	<a href="#" class="lien_form_last_month">Le mois dernier</a> - '+
			'	<a href="#" class="lien_form_current_year">Cette année</a>'+
			'</p>'+
			''
		);
	}

	if ($('form #dayCompare').length > 0 && $('form #monthCompare').length > 0 && $('form #yearCompare').length > 0) {
		$('form #yearCompare').after(
			'<br/>'+
			'<p class="select_date_fastly">'+
			'	<a href="#" class="lien_form_yesterday">Hier</a> - '+
			'	<a href="#" class="lien_form_day_moins_7">J-7</a> - '+
			'	<a href="#" class="lien_form_day_moins_8">J-8</a> - '+
			'	<a href="#" class="lien_form_last_month">Le mois dernier</a> - '+
			'	<a href="#" class="lien_form_month_moins_2">Mois M-2</a> - '+
			'	<a href="#" class="lien_form_last_year">L\'année dernière</a>'+
			'</p>'+
			''
		);
	}

	// Lien de sélection de date
	
	if ($('form a.lien_form_today').length > 0) {
		$('form a.lien_form_today').click(function() {
			selectFormDateToday($(this));
			return false;
		});
	}
	
	if ($('form a.lien_form_yesterday').length > 0) {
		$('form a.lien_form_yesterday').click(function() {
			selectFormDateDayMoinsNb($(this), 1);
			return false;
		});
	}
	
	if ($('form a.lien_form_day_moins_7').length > 0) {
		$('form a.lien_form_day_moins_7').click(function() {
			selectFormDateDayMoinsNb($(this), 7);
			return false;
		});
	}
	
	if ($('form a.lien_form_day_moins_8').length > 0) {
		$('form a.lien_form_day_moins_8').click(function() {
			selectFormDateDayMoinsNb($(this), 8);
			return false;
		});
	}
	
	if ($('form a.lien_form_current_month').length > 0) {
		$('form a.lien_form_current_month').click(function() {
			selectFormDateCurrentMonth($(this));
			return false;
		});
	}
	
	if ($('form a.lien_form_last_month').length > 0) {
		$('form a.lien_form_last_month').click(function() {
			selectFormDateMonthMoinsNb($(this), 1);
			return false;
		});
	}
	
	if ($('form a.lien_form_month_moins_2').length > 0) {
		$('form a.lien_form_month_moins_2').click(function() {
			selectFormDateMonthMoinsNb($(this), 2);
			return false;
		});
	}
	
	if ($('form a.lien_form_current_year').length > 0) {
		$('form a.lien_form_current_year').click(function() {
			selectFormDateCurrentYear($(this));
			return false;
		});
	}
	
	if ($('form a.lien_form_last_year').length > 0) {
		$('form a.lien_form_last_year').click(function() {
			selectFormDateYearMoinsNb($(this), 1);
			return false;
		});
	}
	
	if ($('form a.lien_form_date_prev_day').length > 0) {
		$('form a.lien_form_date_prev_day').click(function() {
			selectFormDateAddDayFromSelectedDay($(this), -1);
			return false;
		});
	}
	if ($('form a.lien_form_date_next_day').length > 0) {
		$('form a.lien_form_date_next_day').click(function() {
			selectFormDateAddDayFromSelectedDay($(this), 1);
			return false;
		});
	}

	//if ($('form select[name=select_date_fastly]').length > 0) {
	//	$('form select[name=select_date_fastly]').change(function() {
	//		valueOptionSelected = $('form select[name=select_date_fastly] option:selected').attr('value');
	//		if (valueOptionSelected == 'today') {
	//			selectFormDateToday();
	//		}
	//		else if (valueOptionSelected == 'current_month') {
	//			selectFormDateCurrentMonth();
	//		}
	//	});
	//}
	
});*/
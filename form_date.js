// input period de type : Du <input type="date" name="start_date" /> au <input type="date" name="end_date" />
class InputPeriod {

	static addLinks(form) {
		let divParent = form.find('input[type="date"][data-add_period_select_links]').parent();
		if (divParent.hasClass('input-group')) {
			divParent = divParent.parent();
		}
		divParent.append(''
			+'<div class="select_period_links">'
			+'<a href="#" class="period_select_yesterday">Hier</a> - '
			+'<a href="#" class="period_select_current_week">Cette semaine</a> - '
			+'<a href="#" class="period_select_last_week">La semaine dernière</a> - '
			+'<a href="#" class="period_select_current_month">Ce mois-ci</a> - '
			+'<a href="#" class="period_select_last_month">Le mois dernier</a> - '
			+'<a href="#" class="period_select_current_year">Cette année</a>'
			+'</div>'
		);
		this.init(form);
	}

	static init(form) {
		let link;
		//console.log(form.find('a.period_select_current_week'));

		if ((link = form.find('a.period_select_today')).length) {
			link.click(function() { InputPeriod.selectToday($(this)); return false; });
		}
		if ((link = form.find('a.period_select_yesterday')).length) {
			link.click(function() { InputPeriod.selectPreviousDay($(this), 1); return false; });
		}
		if ((link = form.find('a.period_select_tomorrow')).length) {
			link.click(function() { InputPeriod.selectFollowingDay($(this), 1); return false; });
		}
		if ((link = form.find('a.period_select_current_week')).length) {
			link.click(function() { InputPeriod.selectCurrentWeek($(this)); return false; });
		}
		if ((link = form.find('a.period_select_last_week')).length) {
			link.click(function() { InputPeriod.selectPreviousWeek($(this), 1); return false; });
		}
		if ((link = form.find('a.period_select_current_month')).length) {
			link.click(function() { InputPeriod.selectCurrentMonth($(this)); return false; });
		}
		if ((link = form.find('a.period_select_last_month')).length) {
			link.click(function() { InputPeriod.selectPreviousMonth($(this), 1); return false; });
		}
		if ((link = form.find('a.period_select_current_year')).length) {
			link.click(function() { InputPeriod.selectCurrentYear($(this)); return false; });
		}
		if ((link = form.find('a.period_select_last_year')).length) {
			link.click(function() { InputPeriod.selectPreviousYear($(this), 1); return false; });
		}
	}


	static selectToday(link) {
		let date = new Date();
		this.selectPeriod(link, date, date);
	}

	static selectPreviousDay(lien, nbDays) {
		this.selectFollowingDay(lien, -nbDays);
	}
	static selectFollowingDay(lien, nbDays) {
		let date = new Date();
		date.setDate(date.getDate() + nbDays);
		this.selectPeriod(lien, date, date);
	}

	static selectCurrentWeek(lien) {
		let date = new Date();
		this.selectPeriod(lien, DateTime.getFirstDayOfWeek(date), DateTime.getLastDayOfWeek(date));
	}
	static selectPreviousWeek(lien, nbWeeks) {
		this.selectFollowingWeek(lien, -nbWeeks);
	}
	static selectFollowingWeek(lien, nbWeeks) {
		let date = new Date();
		date.setDate(date.getDate() + (7*nbWeeks));
		this.selectPeriod(lien, DateTime.getFirstDayOfWeek(date), DateTime.getLastDayOfWeek(date));
	}

	static selectCurrentMonth(lien) {
		let date = new Date();
		this.selectPeriod(lien, DateTime.getFirstDayOfMonth(date), DateTime.getLastDayOfMonth(date));
	}
	static selectPreviousMonth(lien, nbMonths) {
		this.selectFollowingMonth(lien, -nbMonths);
	}
	static selectFollowingMonth(lien, nbMonths) {
		let date = new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() + nbMonths);
		this.selectPeriod(lien, DateTime.getFirstDayOfMonth(date), DateTime.getLastDayOfMonth(date));
	}

	static selectCurrentYear(lien) {
		this.selectFollowingYear(lien, 0);
	}
	static selectPreviousYear(lien, nbAnneesMoins) {
		this.selectFollowingYear(lien, -nbAnneesMoins);
	}
	static selectFollowingYear(lien, nbAnneesMoins) {
		let date = new Date();
		date.setFullYear(date.getFullYear() + nbAnneesMoins);
		this.selectPeriod(lien, DateTime.getFirstDayOfYear(date), DateTime.getLastDayOfYear(date));
	}


	static selectPeriod(link, startDate, endDate) {
		let inputPeriodStart = link.parent().parent().find('input[type="date"]').filter('[name="date_start"], [name="start_date"], [name="start_period"], [name="period_start_date"]');
		let inputPeriodEnd = link.parent().parent().find('input[type="date"]').filter('[name="date_end"], [name="end_date"], [name="end_period"], [name="period_end_date"]');
		if (inputPeriodStart.length === 0 || inputPeriodEnd.length === 0) {
			console.log('no period input found');
			return;
		}

		inputPeriodStart.val(DateTime.getDateForInputDate(startDate));
		inputPeriodEnd.val(DateTime.getDateForInputDate(endDate));
	}

}

// input period de type : <select class="period">Aujourd'hui / Ce mois-ci / etc. / Personnalisé</select>
class FormDate {

	static fillYearSelect(select, nbYearsBefore=5, nbYearsAfter=0) {
		const currentDate = new Date();
		for (let year=currentDate.getUTCFullYear()-nbYearsBefore; year<=(currentDate.getUTCFullYear()+nbYearsAfter); year++) {
			select.append('<option value="'+year+'">'+year+'</option>');
		}
	}

	static fillMonthSelect(select, locale) {
		for (let month=1; month<=12; month++) {
			select.append('<option value="'+month+'">'+DateTime.getMonthNameByMonth(month, locale).capitalize()+'</option>');
		}
	}

	static fillDayOfWeekSelect(select, locale) {
		for (let dayOfWeek=1; dayOfWeek<=7; dayOfWeek++) {
			select.append('<option value="'+dayOfWeek+'">'+DateTime.getDayNameByDayOfWeek(dayOfWeek, locale).capitalize()+'</option>');
		}
	}

	static initForm(form) {

		function fillPeriodSelect(select) {
			Object.entries(FormDate.getPeriodList()).forEach(([idx, tabListPeriode]) => {
				let html = '<optgroup label="'+tabListPeriode['label']+'">';
				Object.entries(tabListPeriode['list']).forEach(([key, label]) => {
					html += '<option value="'+key+'">'+label+'</option>';
				});
				html += '</optgroup>';
				select.append(html);
			});
			if (select.data('default_value')) {
				select.val(select.data('default_value'));
			}
		}

		function updatePeriodSelect(select) {
			if (select.val() === 'perso') {
				select.closest('.form-group').next().removeClass('hide');
			}
			else {
				select.closest('.form-group').next().addClass('hide');
			}
		}

		function updateForm(form) {
			let periodSelect = form.find('select.periode');
			if (periodSelect.length === 0) {
				return;
			}

			updatePeriodSelect(periodSelect);

			let comparedPeriodSelect = form.find('select.periodeCompare');
			if (comparedPeriodSelect.length === 0) {
				return;
			}

			let listValues = [];
			let valueDefault = null;

			comparedPeriodSelect.find('option').attr('disabled', false);

			Object.entries(FormDate.getPeriodList()).forEach(([idx, tabListPeriode]) => {
				if (idx != 0) {
					let listKeyPeriode = Object.entries(tabListPeriode['list']).map(([key, value]) => key);
					if (listKeyPeriode.indexOf(periodSelect.val()) !== -1) {
						listValues = listKeyPeriode;
						valueDefault = listKeyPeriode[1];
					}
					else {
						comparedPeriodSelect.find('option[value="' + listKeyPeriode[0] + '"]').parent().children().attr('disabled', true);
					}
				}
			});

			if (periodSelect.val() === 'perso') {
				valueDefault = 'perso';
			}
			else if (comparedPeriodSelect.val() !== 'perso' && listValues.indexOf(comparedPeriodSelect.val()) !== -1) {
				valueDefault = comparedPeriodSelect.val();
			}
			comparedPeriodSelect.val(valueDefault);

			updatePeriodSelect(comparedPeriodSelect);
		}

		// ---------- Choix période (new) ----------

		if (form.find('select.periode').length > 0) {
			fillPeriodSelect(form.find('select.periode'));
			form.find('select.periode').change(function() {
				updateForm($(this).closest('form'));
			});
		}

		if (form.find('select.periodeCompare').length > 0) {
			fillPeriodSelect(form.find('select.periodeCompare'));
			form.find('select.periodeCompare').change(function() {
				updateForm($(this).closest('form'));
			});
		}

		updateForm(form);

		// ---------- Choix période (old) ----------

		if (form.find('select.day').length > 0 && form.find('select.month').length > 0 && form.find('select.year').length > 0) {
			form.find('select.year').after(
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
				'</p>'
			);
		}
		else if (form.find('select.month').length > 0 && form.find('select.year').length > 0) {
			form.find('select.year').after(
				'<br/>'+
				'<p class="select_date_fastly">'+
				'	<a href="#" class="lien_form_current_month">Ce mois-ci</a> - '+
				'	<a href="#" class="lien_form_last_month">Le mois dernier</a> - '+
				'	<a href="#" class="lien_form_current_year">Cette année</a>'+
				'</p>'
			);
		}

		if (form.find('select.dayCompare').length > 0 && form.find('select.monthCompare').length > 0 && form.find('select.yearCompare').length > 0) {
			form.find('select.yearCompare').after(
				'<br/>'+
				'<p class="select_date_fastly">'+
				'	<a href="#" class="lien_form_yesterday">Hier</a> - '+
				'	<a href="#" class="lien_form_day_moins_7">J-7</a> - '+
				'	<a href="#" class="lien_form_day_moins_8">J-8</a> - '+
				'	<a href="#" class="lien_form_last_month">Le mois dernier</a> - '+
				'	<a href="#" class="lien_form_month_moins_2">Mois M-2</a> - '+
				'	<a href="#" class="lien_form_last_year">L’année dernière</a>'+
				'</p>'
			);
		}

		// Lien de sélection de date

		if (form.find('a.lien_form_today').length > 0) {
			form.find('a.lien_form_today').click(function() {
				FormDate.setTodaySelected($(this).closest('.form-group'));
				return false;
			});
		}
		if (form.find('a.lien_form_yesterday').length > 0) {
			form.find('a.lien_form_yesterday').click(function() {
				FormDate.addNbDaysToToday($(this).closest('.form-group'), -1);
				return false;
			});
		}
		if (form.find('a.lien_form_day_moins_7').length > 0) {
			form.find('a.lien_form_day_moins_7').click(function() {
				FormDate.addNbDaysToToday($(this).closest('.form-group'), -7);
				return false;
			});
		}
		if (form.find('a.lien_form_day_moins_8').length > 0) {
			form.find('a.lien_form_day_moins_8').click(function() {
				FormDate.addNbDaysToToday($(this).closest('.form-group'), -8);
				return false;
			});
		}

		if (form.find('a.lien_form_current_month').length > 0) {
			form.find('a.lien_form_current_month').click(function() {
				FormDate.setCurrentMonthSelected($(this).closest('.form-group'));
				return false;
			});
		}
		if (form.find('a.lien_form_last_month').length > 0) {
			form.find('a.lien_form_last_month').click(function() {
				FormDate.addNbMonthsToToday($(this).closest('.form-group'), -1);
				return false;
			});
		}
		if (form.find('a.lien_form_month_moins_2').length > 0) {
			form.find('a.lien_form_month_moins_2').click(function() {
				FormDate.addNbMonthsToToday($(this).closest('.form-group'), -2);
				return false;
			});
		}

		if (form.find('a.lien_form_current_year').length > 0) {
			form.find('a.lien_form_current_year').click(function() {
				FormDate.setCurrentYearSelected($(this).closest('.form-group'));
				return false;
			});
		}
		if (form.find('a.lien_form_last_year').length > 0) {
			form.find('a.lien_form_last_year').click(function() {
				FormDate.addNbYearsToToday($(this).closest('.form-group'), -1);
				return false;
			});
		}

		if (form.find('a.lien_form_date_prev_day').length > 0) {
			form.find('a.lien_form_date_prev_day').click(function() {
				FormDate.addNbDaysToSelectedDate($(this).closest('.form-group'), -1);
				return false;
			});
		}
		if (form.find('a.lien_form_date_next_day').length > 0) {
			form.find('a.lien_form_date_next_day').click(function() {
				FormDate.addNbDaysToSelectedDate($(this).closest('.form-group'), 1);
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
	}

	static getPeriodList() {
		return {
			other: {label: 'Autre', list: {
				perso: 						'Personnalisé',
			}},
			'1d': {label: 'Un jour', list: { // 1 jour
				'ajd': 									'Aujourd’hui',
				'hier': 								'Hier',
				'jourMoins2': 							'Avant-hier',
				'jourMoins3': 							'J-3',
				'jourMoins7': 							'J-7',
				'jourMoins8': 							'J-8',
				'same_day_last_year': 					'Même jour l’année dernière',
				'same_day_least_2_years': 				'Même jour l’année A-2',
				'same_day_as_yesterday_last_year': 		'Même jour qu’hier l’année dernière',
				'same_day_as_yesterday_least_2_years': 	'Même jour qu’hier l’année A-2'
			}},
			'1w': {label: 'Une semaine', list: { // 1 semaine
				'curr_week': 					'Cette semaine',
				'last_week': 					'La semaine dernière',
				'weekMoins2': 					'Semaine S-2',
				'weekMoins3': 					'Semaine S-3',
				'weekMoins4': 					'Semaine S-4',
			}},
			'7d': {label: '7 jours', list: { // 7 jours
				'last_7_days': 					'Les 7 derniers jours',
				'last_7_days_before': 			'Les 7 jours avant',
				'last_7_days_least_1_year': 	'Les mêmes 7 jours l’année dernière',
				'last_7_days_least_2_years': 	'Les mêmes 7 jours l’année A-2',
			}},
			'14d': {label: '14 jours', list: { // 14 jours
				'last_14_days': 				'Les 14 derniers jours',
				'last_14_days_before': 			'Les 14 jours avant',
				'last_14_days_least_1_year': 	'Les mêmes 14 jours l’année dernière',
				'last_14_days_least_2_years': 	'Les mêmes 14 jours l’année A-2',
			}},
			// 30 jours
			'30d': {label: '30 jours', list: {
				'last_30_days': 				'Les 30 derniers jours',
				'last_30_days_before': 			'Les 30 jours avant',
				'last_30_days_least_1_year': 	'Les mêmes 30 jours l’année dernière',
				'last_30_days_least_2_years': 	'Les mêmes 30 jours l’année A-2',
			}},
			'60d': {label: '60 jours', list: { // 60 jours
				'last_60_days': 				'Les 60 derniers jours',
				'last_60_days_before': 			'Les 60 jours avant',
				'last_60_days_least_1_year': 	'Les mêmes 60 jours l’année dernière',
				'last_60_days_least_2_years': 	'Les mêmes 60 jours l’année A-2',
			}},
			'1m': {label: 'Un mois', list: { // 1 mois
				'curr_month': 					'Ce mois-ci',
				'last_month': 					'Le mois dernier',
				'monthMoins2': 					'Mois M-2',
				'monthMoins3': 					'Mois M-3',
				'monthMoins4': 					'Mois M-4',
				'monthMoins5': 					'Mois M-5',
				'monthMoins6': 					'Mois M-6',
				'same_month_last_year': 		'Même mois l’année dernière',
				'same_month_least_2_years': 	'Même mois l’année A-2',
			}},
			'3m': {label: '3 mois', list: { // 3 mois
				'last_3_month': 				'Les 3 derniers mois',
				'last_3_month_before': 			'Les 3 mois avant',
				'last_3_month_least_1_year': 	'Les mêmes 3 mois l’année dernière',
				'last_3_month_least_2_years': 	'Les mêmes 3 mois l’année A-2',
			}},
			'6m': {label: '6 mois', list: { // 6 mois
				'last_6_month': 				'Les 6 derniers mois',
				'last_6_month_before': 			'Les 6 mois avant',
				'last_6_month_least_1_year': 	'Les mêmes 6 mois l’année dernière',
				'last_6_month_least_2_years': 	'Les mêmes 6 mois l’année A-2',
			}},
			'12m': {label: '12 mois', list: { // 12 mois
				'last_12_month': 				'Les 12 derniers mois',
				'last_12_month_before': 		'Les 12 mois avant',
				'last_12_month_least_1_year': 	'Les mêmes 12 mois l’année dernière',
				'last_12_month_least_2_years': 	'Les mêmes 12 mois l’année A-2',
			}},
			'24m': {label: '24 mois', list: { // 24 mois
				'last_24_month': 				'Les 24 derniers mois',
				'last_24_month_before': 		'Les 24 mois avant',
				'last_24_month_least_1_year': 	'Les mêmes 24 mois l’année dernière',
				'last_24_month_least_2_years': 	'Les mêmes 24 mois l’année A-2',
			}},
			'1y': {label: 'Une année', list: { // 1 année
				'curr_year': 					'Cette année',
				'last_year': 					'L’année dernière',
				'yearMoins2': 					'Année A-2',
				'yearMoins3': 					'Année A-3',
				'yearMoins4': 					'Année A-4',
			}},
		};
	}
	static setTodaySelected(periodFormGroup) {
		let date = new Date();
		FormDate.setSelectedDate(periodFormGroup, date.getDate(), (date.getMonth() + 1), date.getFullYear());
	}
	static setCurrentMonthSelected(periodFormGroup) {
		let date = new Date();
		FormDate.setSelectedDate(periodFormGroup, -1, (date.getMonth() + 1), date.getFullYear());
	}
	static setCurrentYearSelected(periodFormGroup) {
		let today = new Date();
		FormDate.setSelectedDate(periodFormGroup, -1, -1, today.getFullYear());
	}

	static addNbDaysToToday(periodFormGroup, nbDays) {
		FormDate.addNbDaysToSelectedDate(periodFormGroup, nbDays, false);
	}
	static addNbMonthsToToday(periodFormGroup, nbMonths) {
		FormDate.addNbMonthsToSelectedDate(periodFormGroup, nbMonths, false);
	}
	static addNbYearsToToday(periodFormGroup, nbYears) {
		FormDate.addNbYearsToSelectedDate(periodFormGroup, nbYears, false);
	}

	static addNbDaysToSelectedDate(periodFormGroup, nbDays, fromSelectedDate) {
		let date = typeof fromSelectedDate == 'undefined' || fromSelectedDate ? FormDate.getSelectedDate(periodFormGroup) : new Date();
		date.setDate(date.getDate() + nbDays);
		FormDate.setSelectedDate(periodFormGroup, date.getDate(), (date.getMonth() + 1), date.getFullYear());
	}
	static addNbMonthsToSelectedDate(periodFormGroup, nbMonths, fromSelectedDate) {
		let date = typeof fromSelectedDate == 'undefined' || fromSelectedDate ? FormDate.getSelectedDate(periodFormGroup) : new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() - nbMonths);
		FormDate.setSelectedDate(periodFormGroup, -1, (date.getMonth() + 1), date.getFullYear());
	}
	static addNbYearsToSelectedDate(periodFormGroup, nbYears, fromSelectedDate) {
		let date = typeof fromSelectedDate == 'undefined' || fromSelectedDate ? FormDate.getSelectedDate(periodFormGroup) : new Date();
		FormDate.setSelectedDate(periodFormGroup, -1, -1, date.getFullYear() - nbYears);
	}

	static getSelectedDate(periodFormGroup) {
		let day = periodFormGroup.find('select.day').val();
		let month = periodFormGroup.find('select.month').val();
		let year = periodFormGroup.find('select.year').val();
		if (null != day && null != month && null != year) {
			return new Date(year, month - 1, day);
		}
		return new Date();
	}

	static setSelectedDate(periodFormGroup, day, month, year) {
		periodFormGroup.find('select.day').val(day);
		periodFormGroup.find('select.month').val(month);
		periodFormGroup.find('select.year').val(year);
	}



	/*
	// deprecated

	static majSelectPeriode(select) {
		if (select.find(':selected').attr('value') === 'perso') {
			select.parent().parent().next().removeClass('hide');
		}
		else {
			select.parent().parent().next().addClass('hide');
		}
	}

	static majSelectCompare() {
		if ($('form select#periodeCompare').length === 0) {
			return;
		}

		let listValues = [];
		let periodeSelected = $('form select.periode :selected').attr('value');
		let selectCompare = $('form select#periodeCompare');
		let periodeCompareSelected = selectCompare.find(':selected').attr('value');
		let valueDefault = null;

		selectCompare.find('option').removeAttr('disabled');

		$.each(listePeriodeCompare, function (idx, tabListPeriode) {
			if (idx != 0) {
				let listKeyPeriode = array_keys(tabListPeriode.list);
				if (in_array(periodeSelected, listKeyPeriode)) {
					listValues = listKeyPeriode;
					valueDefault = listKeyPeriode[1];
				}
				else {
					selectCompare.find('option[value="' + listKeyPeriode[0] + '"]').parent().children().attr('disabled', 'disabled');
				}
			}
		});

		if (periodeSelected === 'perso') {
			valueDefault = 'perso';
		}
		else if (periodeCompareSelected !== 'perso' && in_array(periodeCompareSelected, listValues)) {
			valueDefault = periodeCompareSelected;
		}
		selectCompare.find('option[value="' + valueDefault + '"]').attr('selected', 'selected');

		FormDate.majSelectPeriode(selectCompare);
	}

	static selectFormDateToday(lien) {
		let date = new Date();
		FormDate.selectFormDate(lien, date.getDate(), (date.getMonth() + 1), date.getFullYear());
	}
	static selectFormDateDayMoinsNb(lien, nbJoursMoins) {
		let date = new Date();
		date.setDate(date.getDate() - nbJoursMoins);
		FormDate.selectFormDate(lien, date.getDate(), (date.getMonth() + 1), date.getFullYear());
	}
	static selectFormDateCurrentMonth(lien) {
		let date = new Date();
		FormDate.selectFormDate(lien, -1, (date.getMonth() + 1), date.getFullYear());
	}
	static selectFormDateMonthMoinsNb(lien, nbMoisMoins) {
		let date = new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() - nbMoisMoins);
		FormDate.selectFormDate(lien, -1, (date.getMonth() + 1), date.getFullYear());
	}
	static selectFormDateCurrentYear(lien) {
		let today = new Date();
		FormDate.selectFormDate(lien, -1, -1, today.getFullYear());
	}
	static selectFormDateYearMoinsNb(lien, nbAnneesMoins) {
		let today = new Date();
		FormDate.selectFormDate(lien, -1, -1, today.getFullYear() - nbAnneesMoins);
	}
	static selectFormDateAddDayFromSelectedDay(lien, nbDaysAdded) {
		let date = FormDate.getDateObjectSelected(lien);
		date.setDate(date.getDate() + nbDaysAdded);
		FormDate.selectFormDate(lien, date.getDate(), (date.getMonth() + 1), date.getFullYear());
	}
	static getDateObjectSelected(lien) {
		let selectorDay = '#' + (lien.parent().prev().prev().prev().prev().attr('id')) + ' option:selected';
		let selectorMonth = '#' + (lien.parent().prev().prev().prev().attr('id')) + ' option:selected';
		let selectorYear = '#' + (lien.parent().prev().prev().attr('id')) + ' option:selected';
		if ($(selectorDay).length > 0 && $(selectorMonth).length > 0 && $(selectorYear).length > 0) {
			return new Date($(selectorYear).attr('value'), $(selectorMonth).attr('value') - 1, $(selectorDay).attr('value'));
		}
		return new Date();
	}
	static selectFormDate(lien, day, month, year) {
		let selectorDay = '#' + (lien.parent().prev().prev().prev().prev().attr('id')) + ' option[value=' + day + ']';
		let selectorMonth = '#' + (lien.parent().prev().prev().prev().attr('id')) + ' option[value=' + month + ']';
		let selectorYear = '#' + (lien.parent().prev().prev().attr('id')) + ' option[value=' + year + ']';
		if ($(selectorDay).length > 0) $(selectorDay).prop('selected', 'selected');
		if ($(selectorMonth).length > 0) $(selectorMonth).prop('selected', 'selected');
		if ($(selectorYear).length > 0) $(selectorYear).prop('selected', 'selected');
	}
	*/
}

module.exports = { FormDate, InputPeriod };

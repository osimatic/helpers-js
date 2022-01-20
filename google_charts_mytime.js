// /!\
// /!\ Jérôme : à mon avis celui-ci n'est pas à jour et il ne faut plus l'utiliser (provient du projet mytime/admin_osi/audioconf.), 
// /!\ ou alors il faut le retirer des helpers et créer une classe spécifique dans chaque projet (si comportements différents)
// /!\



// google.load("visualization", "1", {packages:["corechart"]});
google.charts.load('current', {'packages':['bar','line','corechart']});
// google.charts.load('current', {packages:['corechart']});

google.charts.setOnLoadCallback(drawAllCharts);

function drawAllCharts() {
	if (typeof(listCharts) != 'undefined'  && listCharts.length > 0) {
		loadListCharts(listCharts);
	}
}

function loadListCharts(listCharts) {
	$.each(listCharts, function(idx, chartData) {
		// console.log('drawChart'+chartData.id);
		drawChart(chartData.type_graph, chartData.id, chartData.title, chartData.libelle_abs, chartData.tab_data_abs, chartData.liste_libelle_ord, chartData.liste_tab_data_ord, chartData.list_color, chartData.format_ord, chartData.height, chartData.width);

		/*
		if (typeof(initWidth) == 'undefined' || initWidth) {
			var width = 0;
			$.each(listGraphStats, function(idx, tabGraph) {
				if ($('#'+tabGraph.id).length) {
					if ($('#'+tabGraph.id).width() > 0) {
						width = $('#'+tabGraph.id).width();
					}
				}
			});
		}

		$.each(listGraphStats, function(idx, tabGraph) {
			drawChart(tabGraph.type_graph, tabGraph.id, tabGraph.title, tabGraph.libelle_abs, tabGraph.tab_data_abs, tabGraph.liste_libelle_ord, tabGraph.liste_tab_data_ord, tabGraph.list_color, tabGraph.format_ord, tabGraph.height, width);
		});
		*/
	});
}

function drawChart(typeGraph, idDiv, titre, libelleAbs, tabDataAbsParam, listeLibelleOrd, listeTabDataOrd, tabColor, formatData, height, width) {
	if ($('#'+idDiv).length == 0) {
		return;
	}

	var afficherLibelleOrd = false;

	isStacked = false;
	if (typeGraph == 'stacked_bar_chart') {
		typeGraph = 'bar_chart';
		isStacked = true;
	}
	if (typeGraph == 'stacked_column_chart') {
		typeGraph = 'column_chart';
		isStacked = true;
	}
	if (typeGraph == 'stacked_combo_chart') {
		typeGraph = 'combo_chart';
		isStacked = true;
	}

	isDualChart = false;
	if (typeGraph == 'dual_column_chart') {
		typeGraph = 'column_chart';
		isDualChart = true;
	}
	if (typeGraph == 'dual_bar_chart') {
		typeGraph = 'bar_chart';
		isDualChart = true;
	}

	// Déclaration du tableau de données
	var data = new google.visualization.DataTable();
	data.addColumn('string', libelleAbs);
	$.each(listeLibelleOrd, function(idx, libelleOrd) {
		data.addColumn('number', libelleOrd);
	});
	
	// Remplissage des données
	var nbCells = 0;
	var numRow = 0;
	$.each(tabDataAbsParam, function(idx, dataAbs) {
		// dataOrd = tabDataOrd[idx];
		// data.addRow([dataAbs, dataOrd]);
		data.addRows(1);
		
		data.setCell(numRow, 0, dataAbs);
		
		var numCell = 1;
		$.each(listeTabDataOrd, function(idx2, tabDataOrd) {
			data.setCell(numRow, numCell, tabDataOrd[idx]);
			numCell++;
		});

		nbCells = numCell;
		numRow++;
	});
	nbCells -= 2;

	// console.log(data);
	// console.log('drawGraph : '+idDiv+' ; type : '+typeGraph);
	
	// Options générales
	var options = {
		colors: tabColor,
		fontName: 'Trebuchet MS',
		fontSize: 12,
		hAxis: {maxAlternation: 1},
		vAxis: {minValue: 0, textPosition: 'out'},
		//gridlines: {color: '#333', count: 1}
	};
	
	if (formatData != null) {
		options.vAxis.format = formatData;
	}
	
	// Options sur le titre du graphique
	options.title = titre;
	if (typeGraph == 'pie_chart') {
		// options.titlePosition = 'none';
	}
	else {
		options.titlePosition = 'none';
	}
	
	// Options sur la taille du graphique
	if (typeGraph == 'bar_chart') {
		options.chartArea = {left:120, top:30};
		options.chartArea.height = (height-60);
		options.chartArea.width = "85%";
	}
	else {
		options.chartArea = {left:"auto", top:"auto"};
		if (height != null) {
			options.chartArea.height = height+"%";
		}
		else {
			options.chartArea.height = "80%";
		}
		options.chartArea.width = "85%";
	}
	// options.chartArea = {};
	// options.chartArea.height = "100%";
	// options.chartArea.width = "100%";

	options.width = width;

	// Options sur la légende
	options.legend = {};
	if (typeGraph == 'pie_chart') {
		options.legend.position = 'right';
	}
	else {
		options.legend.position = 'top';
	}
	
	// Options sur l'affichage des labels en absisse / ordonnée
	if (typeGraph == 'bar_chart') {
		// options.hAxis.title = libelleOrd;
		options.vAxis.title = libelleAbs;
	}
	else {
		options.hAxis.title = libelleAbs;
		// options.vAxis.title = libelleOrd;
	}
	
	// Options sur les graphiques "dual bar chart / dual column chart"
	if (isDualChart) {
		options.series = {};
		options.axes = {};
		if (typeGraph == 'column_chart') {
			options.axes.y = {};
			options.vAxes = {};
		}
		else {
			options.axes.x = {};
			options.hAxes = {};
		}
		$.each(listeLibelleOrd, function(idx, libelleOrd) {
			// console.log(idx);
			if (idx <= 1) {
				// key = 'series_'+idx;
				key = idx;
				// options.series[idx] = {axis: key, targetAxisIndex: key};
				options.series[idx] = {axis: key, targetAxisIndex: idx};
				if (typeGraph == 'column_chart') {
					options.axes.y[key] = {label: libelleOrd};
					if (idx == 1) {
						options.axes.y[key].side = 'right';
					}
					if (formatData != null) {
						options.vAxes[key] = {format: formatData};
					}
				}
				else {
					options.axes.x[key] = {label: libelleOrd};
					if (idx == 1) {
						options.axes.x[key].side = 'top';
					}
					if (formatData != null) {
						options.hAxes[key] = {format: formatData};
					}
				}
			}
		});
		// console.log(options.series);
		// console.log(options.vAxes);
	}

	// Options sur les graphiques "combo chart"
	if (typeGraph == 'combo_chart') {
		options.seriesType = "bars";
		options.series = {};
		options.series[nbCells] = {type: "line"};
	}

	// Options sur le style des lignes pour les "line chart"
	if (typeGraph == 'line_chart') {
		options.series = [{lineWidth: 3}, {lineWidth: 1.5}];
		options.curveType = 'function';
	}
	
	// Options sur le style pour les "pie chart"
	if (typeGraph == 'pie_chart') {
		options.is3D = false;
		options.pieResidueSliceLabel = 'Autre';
	}
	
	if (typeGraph == 'bar_chart') {
		options.bars = 'horizontal';
	}
	
	if (isStacked) {
		options.isStacked = true;
	}

	// console.log(options);
	
	// Création du graphique
	var errorChart = false;
	if (typeGraph == 'column_chart') {
		// var chart = new google.visualization.ColumnChart(document.getElementById(idDiv));
		var chart = new google.charts.Bar(document.getElementById(idDiv));
	}
	else if (typeGraph == 'bar_chart') {
		// var chart = new google.visualization.BarChart(document.getElementById(idDiv));
		var chart = new google.charts.Bar(document.getElementById(idDiv));
	}
	else if (typeGraph == 'line_chart') {
		// var chart = new google.visualization.LineChart(document.getElementById(idDiv));
		var chart = new google.charts.Line(document.getElementById(idDiv));
	}
	else if (typeGraph == 'combo_chart') {
		var chart = new google.visualization.ComboChart(document.getElementById(idDiv));
	}
	else if (typeGraph == 'pie_chart') {
		var chart = new google.visualization.PieChart(document.getElementById(idDiv));
	}
	else {
		errorChart = true;
	}
	
	$('#'+idDiv).removeClass('ajaxLoader');
	$('#'+idDiv).removeClass('graphique_load');
	
	if (errorChart) {
		console.log('erreur graphique');
		$('#'+idDiv).addClass('graphique_error');
		document.getElementById(idDiv).innerHTML = 'Une erreur s\'est produite lors du chargement du graphique.';
	}
	else {
		$('#'+idDiv).addClass('graphique');
		document.getElementById(idDiv).innerHTML = '';
		
		// $('#'+idDiv).
		// document.getElementById(idDiv).style.display = 'block';
		var hasClassActive = $('#'+idDiv).hasClass('active');
		if (!hasClassActive) {
			$('#'+idDiv).addClass('active');
		}
		google.visualization.events.addListener(chart, 'ready', function () {
			// document.getElementById(idDiv).style.display = 'none';
			// $('#'+idDiv).hide();
			if (!hasClassActive) {
				$('#'+idDiv).removeClass('active');
			}
		});
		// console.log($("ul li.ui-state-active").index()

		chart.draw(data, options);
	}
}

class GoogleCharts {
	static init(onLoadCallback) {
		// google.load("visualization", "1", {packages:["corechart"]});
		google.charts.load('current', {'packages':['bar','line','corechart']});
		// google.charts.load('current', {packages:['corechart']});
		
		if (onLoadCallback !== 'undefined') {
			google.charts.setOnLoadCallback(onLoadCallback);
		} 
	}

	static drawCharts(chartsList, onComplete) {
		// on supprime du tableau la liste des graphiques dont l'id div n'a pas été trouvé (le graphique ne pourra pas être généré)
		chartsList = chartsList.filter(chartData => typeof chartData.div_id != 'undefined' && $('#'+chartData.div_id).length);

		let nbChartsCompleted = 0;
		chartsList.forEach(chartData => {
			//console.log(chartData);
			GoogleCharts.draw(
				$('#'+chartData.div_id),
				chartData.chart_type,
				chartData.title,
				chartData.abscissa_label,
				chartData.abscissa_data,
				chartData.ordinate_label,
				chartData.ordinate_data,
				chartData.colors,
				chartData.ordinate_format,
				chartData.height,
				chartData.width,
				chart => {
					nbChartsCompleted++;
					// si tous les graphiques ont été chargés, on appelle le callback onComplete transmis en paramètre
					if (chartsList.length === nbChartsCompleted && typeof onComplete == 'function') {
						onComplete();
					}
				},
			);
		});
	}

	static draw(div, typeGraph, titre, libelleAbs, tabDataAbsParam, listeLibelleOrd, listeTabDataOrd, tabColor, formatData, height, width, onComplete) {
		if (typeof div == 'undefined' || !div.length) {
			console.error('div not found');
			return;
		}

		height = height || null;
		width = width || null;

		let htmlDomDiv = div[0];

		let afficherLibelleOrd = false;

		let isStacked = false;
		if (typeGraph === 'stacked_bar_chart') {
			typeGraph = 'bar_chart';
			isStacked = true;
		}
		if (typeGraph === 'stacked_column_chart') {
			typeGraph = 'column_chart';
			isStacked = true;
		}
		if (typeGraph === 'stacked_combo_chart') {
			typeGraph = 'combo_chart';
			isStacked = true;
		}

		let isDualChart = false;
		if (typeGraph === 'dual_column_chart') {
			typeGraph = 'column_chart';
			isDualChart = true;
		}
		if (typeGraph === 'dual_bar_chart') {
			typeGraph = 'bar_chart';
			isDualChart = true;
		}

		let data = null;
		let nbCells = 0;
		if (typeGraph === 'pie_chart') {
			//data = google.visualization.arrayToDataTable(tabDataAbsParam);

			data = new google.visualization.DataTable();
			data.addColumn('string', libelleAbs);
			data.addColumn('number', '');

			let numRow = 0;
			$.each(tabDataAbsParam, function(idx, value) {
				data.addRows(1);
				data.setCell(numRow, 0, idx);
				data.setCell(numRow, 1, value);
				numRow++;
			});
		}
		else {
			// Déclaration du tableau de données
			data = new google.visualization.DataTable();
			data.addColumn('string', libelleAbs);
			$.each(listeLibelleOrd, function(idx, libelleOrd) {
				data.addColumn('number', libelleOrd);
			});

			// Remplissage des données
			nbCells = 0;
			let numRow = 0;
			$.each(tabDataAbsParam, function(idx, dataAbs) {
				// dataOrd = tabDataOrd[idx];
				// data.addRow([dataAbs, dataOrd]);
				data.addRows(1);

				data.setCell(numRow, 0, dataAbs);

				let numCell = 1;
				$.each(listeTabDataOrd, function(idx2, tabDataOrd) {
					data.setCell(numRow, numCell, tabDataOrd[idx]);
					//data.setCell(numRow, numCell, Math.round(tabDataOrd[idx], 2));
					numCell++;
				});

				nbCells = numCell;
				numRow++;
			});
			nbCells -= 2;
		}

		// console.log(data);
		// console.log('drawGraph : '+div+' ; type : '+typeGraph);

		// Options générales
		let options = {
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
		if (typeGraph === 'pie_chart') {
			// options.titlePosition = 'none';
		}
		else {
			options.titlePosition = 'none';
		}

		// Options sur la taille du graphique
		if (typeGraph === 'bar_chart') {
			options.chartArea = {left:120, top:30};
			//options.chartArea = {left:"auto", top:"auto"};
			//options.chartArea = {};
			if (height != null) {
				options.chartArea.height = (height - 60);
				//options.chartArea.height = '100%';
			}
			options.chartArea.width = "85%";
			//options.chartArea.width = "100%";
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

		//options.width = width;
		//options.width = "100%";
		if (typeof height != 'undefined' && height != null) {
			options.height = height;
		}
		//console.log(div);
		//console.log(div.width());
		//options.width = div.width();

		// Options sur la légende
		options.legend = {};
		if (typeGraph === 'pie_chart') {
			options.legend.position = 'right';
		}
		else if (typeGraph === 'bar_chart') {
			options.legend.position = 'bottom';
		}
		else {
			options.legend.position = 'top';
		}

		// Options sur l'affichage des labels en absisse / ordonnée
		if (typeGraph === 'bar_chart') {
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
			if (typeGraph === 'column_chart') {
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
					let key = idx;
					// options.series[idx] = {axis: key, targetAxisIndex: key};
					options.series[idx] = {axis: key, targetAxisIndex: idx};
					if (typeGraph === 'column_chart') {
						options.axes.y[key] = {label: libelleOrd};
						if (idx === 1) {
							options.axes.y[key].side = 'right';
						}
						if (formatData != null) {
							options.vAxes[key] = {format: formatData};
						}
					}
					else {
						options.axes.x[key] = {label: libelleOrd};
						if (idx === 1) {
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
		if (typeGraph === 'combo_chart') {
			options.seriesType = "bars";
			options.series = {};
			options.series[nbCells] = {type: "line"};
		}

		// Options sur le style des lignes pour les "line chart"
		if (typeGraph === 'line_chart') {
			options.series = [{lineWidth: 3}, {lineWidth: 1.5}];
			options.curveType = 'function';
		}

		// Options sur le style pour les "pie chart"
		if (typeGraph === 'pie_chart') {
			options.is3D = false;
			options.pieResidueSliceLabel = 'Autre';
		}

		if (typeGraph === 'bar_chart') {
			options.bars = 'horizontal';
		}

		if (isStacked) {
			options.isStacked = true;
		}

		// console.log(options);

		// Création du graphique
		let chart = null;
		if (typeGraph === 'column_chart') {
			// chart = new google.visualization.ColumnChart(htmlDomDiv);
			chart = new google.charts.Bar(htmlDomDiv);
		}
		else if (typeGraph === 'bar_chart') {
			// chart = new google.visualization.BarChart(htmlDomDiv);
			chart = new google.charts.Bar(htmlDomDiv);
		}
		else if (typeGraph === 'line_chart') {
			// chart = new google.visualization.LineChart(htmlDomDiv);
			chart = new google.charts.Line(htmlDomDiv);
		}
		else if (typeGraph === 'combo_chart') {
			chart = new google.visualization.ComboChart(htmlDomDiv);
		}
		else if (typeGraph === 'pie_chart') {
			chart = new google.visualization.PieChart(htmlDomDiv);
		}

		div.removeClass('loading');

		if (chart === null) {
			console.error('error during creating chart');
			div.addClass('graphique_error');
			htmlDomDiv.innerHTML = 'Une erreur s\'est produite lors du chargement du graphique.';
			return;
		}

		//div.addClass('graphique');
		div.addClass('chart');
		htmlDomDiv.innerHTML = '';

		// htmlDomDiv.style.display = 'block';
		let tabPaneDiv = div;
		if (!div.hasClass('tab-pane')) {
			tabPaneDiv = div.closest('.tab-pane');
		}

		let hasClassActive = tabPaneDiv.hasClass('active');
		if (!hasClassActive) {
			tabPaneDiv.addClass('active');
		}

		google.visualization.events.addListener(chart, 'ready', function () {
			//console.log('ready');
			//console.log(chart);
			// htmlDomDiv.style.display = 'none';
			// div.hide();
			if (!hasClassActive) {
				tabPaneDiv.removeClass('active');
			}

			if (typeof onComplete == 'function') {
				onComplete(chart);
			}
		});

		// console.log($("ul li.ui-state-active").index()
		//console.log(options);

		chart.draw(data, options);
	}

}

module.exports = { GoogleCharts };
// Fonction commune de pagination
//Bootstrap class pagination https://getbootstrap.com/docs/3.3/components/#pagination

class Pagination {
	static paginateCards(div, nbItemsPerPage) {
		Pagination.paginate(div, div.find('.pagination_item'), nbItemsPerPage);
	}

	static paginateTable(table, select) {
		Pagination.paginate(table, table.find('tbody tr:not(.hide)'), parseInt(table.data('max_rows')), select);
	}

	static paginate(div, items, nbItemsPerPage, select) {
		let maxItems = nbItemsPerPage;

		if (typeof div == 'undefined' || !div.length) {
			return;
		}

		if (typeof select != 'undefined' && select.length) {
			if (!select.children().length) {
				select.append('<option value="0">'+labelDisplayAll+'</option>');
				let nbRowsList = select.data('nb_rows_list') ? select.data('nb_rows_list').split(',') : [5, 10, 25, 50];
				$.each(nbRowsList, function(idx, nbRows) {
					select.append('<option value="'+nbRows+'">'+nbRows+'</option>');
				});

				if (select.data('default_nb_rows')) {
					select.val(select.data('default_nb_rows'))
				}
			}

			maxItems = parseInt(select.val());

			select.change(update);
		}

		let paginationUl = $('ul.pagination');
		if (!paginationUl.length) {
			paginationUl = $('<ul class="pagination"></ul>');
			if (div.find('.pagination_links').length) {
				div.find('.pagination_links').append(paginationUl);
			}
			else {
				div.after(paginationUl);
			}
		}

		function update() {
			let totalItems = items.length;

			let lineNum = 0;
			items.each(function () {
				lineNum++;
				if (0 === maxItems || lineNum <= maxItems) {
					$(this).show();
				}
				else {
					$(this).hide();
				}
			});
			paginationUl.find('li').remove();

			if (0 === maxItems || totalItems < maxItems) {
				paginationUl.addClass('hide');
				return;
			}

			let nbPages = Math.ceil(totalItems/maxItems);
			for (let i=1; i <= nbPages; i++) {
				paginationUl.append('<li class="page-item" data-page="'+i+'"><a href="#" class="page-link">'+i+'<span class="sr-only">(current)</span></a></li>').show();
			}
			paginationUl.removeClass('hide');

			paginationUl.find('li:first-child').addClass('active');
			paginationUl.find('li').click(function () {
				paginationUl.find('li').removeClass('active');

				let pageNum = $(this).data('page');
				let trIndex = 0;
				$(this).addClass('active');
				items.each(function () {
					trIndex++;
					if (trIndex > (maxItems*pageNum) || trIndex <= ((maxItems*pageNum)-maxItems)) {
						$(this).hide();
					}
					else{
						$(this).show();
					}
				});

				return false;
			});
		}

		update();
	}
}

class Navigation {
	static activateTab(a) {
		//console.log(a);
		//a.click();
		let ulNav = a.closest('.nav');
		let tabContent = ulNav.parent().find('.tab-content');

		// d??selection ??ventuel des onglets
		ulNav.find('a.nav-link').each(function(idx, navLink) {
			$(navLink).removeClass('active');
			let id = $(navLink).attr('href');
			if (id.substr(0, 1) === '#') {
				tabContent.find(id).removeClass('active').removeClass('show');
			}
		});

		// s??lection de l'onglet correspondant au navLink pass?? en param??tre
		a.addClass('active');
		tabContent.find(a.attr('href')).addClass('active').addClass('show');
	}
}

module.exports = { Pagination, Navigation };

// deprecated
/*
function paginationAsList(nbResultatsTotal, nbResultatsParPage, urlPage, nomParamPage) {
	var currentUrl = urlPage || window.location.href;
	var afficherLienFirstLastPage = true;
	var afficherLienPagePrecedenteSuivante = true;
	var emptyStringIfOnlyOnePage = true;
	var nbLiensPageDebutFin = 3;
	var nbLiensPageAvantApresPageCourante = 2;
	var strEntreLiensPageDebutFinEtAvantApresPageCourante = '???';
	nomParamPage = nomParamPage || 'page';

	// Si le nombre de r??sultat total est inf??rieur au nombre d'affichage par page, il n'y a qu'une seule page.
	if (nbResultatsTotal < nbResultatsParPage && emptyStringIfOnlyOnePage) {
		return '';
	}

	// Initialisation du nombre de pages
	var nbPages = Math.ceil(nbResultatsTotal/nbResultatsParPage);

	// Initialisation du num??ro de la page courante
	//var query = window.location.search.substring(1).query.split("&");
	
	var url = new URL(currentUrl);
	var params = url.searchParams;

	var numPageCourante = 1;
	if (typeof params.get(nomParamPage) != 'undefined' && params.get(nomParamPage) != null) {
		numPageCourante = parseInt(params.get(nomParamPage));
	}
	if (numPageCourante < 0) {
		numPageCourante = 1;
	}
	if (numPageCourante > nbPages) {
		numPageCourante = nbPages;
	}

	var strPagination = '<ul class="pagination">';

	// Lien pour la premi??re page
	if (afficherLienFirstLastPage) {
		var strLienFirstPage = '&lt;&lt;';
		if (numPageCourante > 1) {
			strPagination += '<li class="page-item"><a class="page-link" href="'+UrlAndQueryString.setParamOfUrl(nomParamPage, 1, currentUrl)+'">'+strLienFirstPage+'</a></li>';
		}
		else {
			strPagination += '<li class="page-item disabled"><a class="page-link" href="#">'+strLienFirstPage+'</a></li>';
		}
	}

	// Lien pour la page pr??c??dente
	if (afficherLienPagePrecedenteSuivante) {
		var strLienPagePrecedente = '&lt;';
		if (numPageCourante > 1) {
			strPagination += '<li class="page-item"><a class="page-link" href="'+UrlAndQueryString.setParamOfUrl(nomParamPage, (numPageCourante - 1), currentUrl)+'">'+strLienPagePrecedente+'</a></li>';
		}
		else {
			strPagination += '<li class="page-item disabled"><a class="page-link" href="#">'+strLienPagePrecedente+'</a></li>';
		}
	}

	var strEntreLiensPageDebutEtAvantPageCouranteDejaAffiche = false;
	var strEntreLiensPageFinEtApresPageCouranteDejaAffiche = false;

	for (var numPage=1; numPage<=nbPages; numPage++) {
		if (numPage < numPageCourante) {
			if (numPage <= nbLiensPageDebutFin || numPage >= (numPageCourante-nbLiensPageAvantApresPageCourante)) {
				strPagination += '<li class="page-item"><a class="page-link" href="'+UrlAndQueryString.setParamOfUrl(nomParamPage, numPage, currentUrl)+'">'+numPage+'</a></li>';
			}
			else {
				if (!strEntreLiensPageDebutEtAvantPageCouranteDejaAffiche) {
					strPagination += '<li class="page-item disabled"><a class="page-link" href="#">'+strEntreLiensPageDebutFinEtAvantApresPageCourante+'</a></li>';
					strEntreLiensPageDebutEtAvantPageCouranteDejaAffiche = true;
				}
			}
		}
		else if (numPage > numPageCourante) {
			if (numPage >= (nbPages-(nbLiensPageDebutFin-1)) || numPage <= (numPageCourante+nbLiensPageAvantApresPageCourante)) {
				strPagination += '<li class="page-item"><a class="page-link" href="'+UrlAndQueryString.setParamOfUrl(nomParamPage, numPage, currentUrl)+'">'+numPage+'</a></li>';
			}
			else {
				if (!strEntreLiensPageFinEtApresPageCouranteDejaAffiche) {
					strPagination += '<li class="page-item disabled"><a class="page-link" href="#">'+strEntreLiensPageDebutFinEtAvantApresPageCourante+'</a></li>';
					strEntreLiensPageFinEtApresPageCouranteDejaAffiche = true;
				}
			}
		}
		else {
			strPagination += '<li class="page-item active"><a class="page-link" href="#">'+numPage+'</a></li>';
		}
	}

	// Lien pour la page suivante
	if (afficherLienPagePrecedenteSuivante) {
		var strLienPageSuivante = '&gt;';
		if (numPageCourante < nbPages) {
			strPagination += '<li class="page-item"><a class="page-link" href="'+UrlAndQueryString.setParamOfUrl(nomParamPage, (numPageCourante + 1), currentUrl)+'">'+strLienPageSuivante+'</a></li>';
		}
		else {
			strPagination += '<li class="page-item disabled"><a class="page-link" href="#">'+strLienPageSuivante+'</a></li>';
		}
	}

	// Lien pour la derni??re page
	if (afficherLienFirstLastPage) {
		var strLienLastPage = '&gt;&gt;';
		if (numPageCourante < nbPages) {
			strPagination += '<li class="page-item"><a class="page-link" href="'+UrlAndQueryString.setParamOfUrl(nomParamPage, nbPages, currentUrl)+'">'+strLienLastPage+'</a></li>';
		}
		else {
			strPagination += '<li class="page-item disabled"><a class="page-link" href="#">'+strLienLastPage+'</a></li>';
		}
	}

	strPagination += '</ul>';

	return strPagination;
}
*/
function selectionnerContenuNode(node) {
	if (window.getSelection) {
		var selection = window.getSelection();
		var intervalle = document.createRange();
		intervalle.selectNodeContents(node);
		selection.removeAllRanges();
		selection.addRange(intervalle);
	}
	else if (document.body.createTextRange) {
		var intervalle = document.body.createTextRange();
		intervalle.moveToElementText(node);
		intervalle.select();
	}
	return false;
}

function copierTexte(texte) {
	if (window.clipboardData && clipboardData.setData) {
		window.clipboardData.setData('Text', texte);
	}
	else if (document.body.createTextRange) {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(texte);
		textRange.execCommand("Copy");
	}
	else {
		try {
			// On test si la configuration permet l'accès au presse-papier.
			netscape.security.PrivilegeManager
			.enablePrivilege("UniversalXPConnect");
		}
		catch (e) {
			alert("Impossible d'accéder au presse-papier.");
		}
		// Initialisation du composant fournit par Mozilla.
		var gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
		// Copie du texte dans le presse papier.
		gClipboardHelper.copyString(texte);
	}
	return false;
}

function escapeHtml(string) {
	var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': '&quot;',
		"'": '&#39;',
		"/": '&#x2F;'
	};
	return String(string).replace(/[&<>"'\/]/g, (s) => entityMap[s]);
}

function truncateString(str, length, from, ellipsis, split) {
	var str1, str2, len1, len2;
	if (str.length <= length) {
		return str.toString();
	}
	ellipsis = typeof ellipsis === 'undefined' ? '…' : ellipsis;
	switch(from) {
		case 'left':
			str2 = split ? truncateOnWord(str, length, true) : str.slice(str.length - length);
			return ellipsis + str2;
		case 'middle':
			len1 = ceil(length / 2);
			len2 = floor(length / 2);
			str1 = split ? truncateOnWord(str, len1) : str.slice(0, len1);
			str2 = split ? truncateOnWord(str, len2, true) : str.slice(str.length - len2);
			return str1 + ellipsis + str2;
		default:
			str1 = split ? truncateOnWord(str, length) : str.slice(0, length);
			return str1 + ellipsis;
	}
}
function truncateOnWord(str, length, from, ellipsis) {
	return truncateString(str, length, from, ellipsis, true);
}

String.prototype.htmlentities = String.prototype.htmlentities || function() {
	return this.replace(/[\u00A0-\u9999<>\&]/gim, (i) => '&#'+i.charCodeAt(0)+';');
};

String.prototype.escapeHtml = String.prototype.escapeHtml || function() {
	return escapeHtml(this);
};

String.prototype.normalizeBreaks = String.prototype.normalizeBreaks || function(breaktype) {
	return this.replace('/(\r\n|\r|\n)/ms', breaktype);
	//return this.replace('/(?:\r\n|\r|\n)/g', breaktype);
	//console.log(breaktype);
	//return this.replace(new RegExp('\r?\n','g'), breaktype);
};

String.prototype.format = String.prototype.format || function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, (match, number) => (typeof args[number] != 'undefined' ? args[number] : match));
};

String.prototype.ucwords = function() {
	return this.toLowerCase().replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, ($1) => $1.toUpperCase());
};
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.encodeForHtmlDataAttribute = function() {
	return this.replace(/\"/g, "'");
}

// s'utilise : "ma chaine {0} de caracteres"
if (!String.format) {
	String.format = function(format) {
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, (match, number) => (typeof args[number] != 'undefined' ? args[number] : match));
	};
}

module.exports = { selectionnerContenuNode, copierTexte, truncateString };
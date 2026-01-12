
class File {
	static download(data, contentType, contentDisposition) {
		let filename = "";
		let disposition = contentDisposition;
		if (disposition && (disposition.indexOf('inline') !== -1 || disposition.indexOf('attachment') !== -1)) {
			let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
			let matches = filenameRegex.exec(disposition);
			if (matches != null && matches[1]) {
				filename = matches[1].replace(/['"]/g, '');
			}
		}

		let blob = new Blob([data], {
			type: contentType
		});

		//console.log('disposition: '+disposition+' ; filename: '+filename+' ; type: '+type);
		//console.log('blob: %o', blob);

		if (typeof window.navigator.msSaveBlob !== 'undefined') {
			// IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
			window.navigator.msSaveBlob(blob, filename);
		} else {
			let URL = window.URL || window.webkitURL;
			let downloadUrl = URL.createObjectURL(blob);

			let a = document.createElement("a");
			// safari doesn't support this yet
			if (typeof a.download === 'undefined') {
				window.location = downloadUrl;
			} else {
				a.href = downloadUrl;
				a.download = (filename?filename:'file.pdf');
				document.body.appendChild(a);
				a.click();
			}

			setTimeout(function () {
				URL.revokeObjectURL(downloadUrl);
			}, 100); // cleanup
		}
	}

	static formatFileSize(fileSizeInBytes, fractionDigits=2, locale='fr-FR') {
		let i = -1;
		let byteUnits = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		if (fileSizeInBytes === 0) {
			return '0 ' + byteUnits[0];
		}
		do {
			fileSizeInBytes = fileSizeInBytes / 1024;
			i++;
		}
		while (fileSizeInBytes >= 1024);
		//var size = Math.max(fileSizeInBytes, 0.1).toFixed(fractionDigits);
		let size = Math.max(fileSizeInBytes, 0.1);
		return (new Intl.NumberFormat(locale, {
			maximumFractionDigits: fractionDigits
		}).format(size)) + ' ' + byteUnits[i];
	}

	static blobToBase64(blob, callback) {
		let reader = new FileReader();
		reader.onload = function() {
			//let dataUrl = reader.result;
			//let base64 = dataUrl.split(',')[1];
			callback(reader.result);
		};
		reader.readAsDataURL(blob);
	};
}

const CSV_FILE_EXTENSION = "csv";
const CSV_MIME_TYPES = [
	'text/csv',
	'txt/csv',
	'application/octet-stream',
	'application/csv-tab-delimited-table',
	'application/vnd.ms-excel',
	'application/vnd.ms-pki.seccat',
	'text/plain',
];

class CSV {
	static checkFile(filename, fileType) {
		return CSV_MIME_TYPES.indexOf(fileType) !== -1 && filename.split('.').pop().toLowerCase() === CSV_FILE_EXTENSION;
	}

}

class Img {
	static compress(oData) {
		let a = [];
		let len = oData.length;
		let p = -1;
		for (let i=0;i<len;i+=4) {
			if (oData[i] > 0)
				a[++p] = String.fromCharCode(oData[i]);
		}
		return a.join("");
	}

	static initImg(div) {
		div.find('.asynchronously_img').each(function(idx, img) {
			Img.loadImgUrl($(img).data('url'), $(img));
		});
	}

	static loadImgUrl(url, img) {
		$.ajax({
			type: 'GET',
			url: url,
			headers: HTTPClient.getHeaders(true),
			cache: false,
			xhrFields: {responseType: 'blob'},
			success: (data) => {
				// var urlCreator = window.URL || window.webkitURL;
				// $(img).attr('src', urlCreator.createObjectURL(data));
				Img.setBlobToImg($(img), data);
			},
			error: (jqxhr, status, errorThrown) => HTTPClient.logJqueryRequestFailure(jqxhr, status, errorThrown),
		});
	}

	static setBlobToImg(img, blob) {
		// img.attr('src', btoa(unescape(encodeURIComponent(data))));
		// img.attr('src', 'data:image/png;base64, '+btoa(unescape(encodeURIComponent(data))));
		let urlCreator = window.URL || window.webkitURL;
		img.attr('src', urlCreator.createObjectURL(blob));
	}

	static async getBase64FromUrl(url) {
		const data = await fetch(url);
		const blob = await data.blob();
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = () => {
				const base64data = reader.result;
				resolve(base64data);
			}
		});
	}
}

module.exports = { File, CSV, Img };
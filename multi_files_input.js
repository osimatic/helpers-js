class MultiFilesInput {
	static init(fileInput, setFilesList, nbMaxFiles, maxFileSize) {
		let filesList = [];
		const formGroup = fileInput.closest('.form-group');

		if (formGroup.find('.multi_files_input_dropzone').length === 0) {
			fileInput.after(`
					<div class="multi_files_input_dropzone border rounded p-3 text-center" style="background:#fafafa; cursor: pointer;">
						<i class="fas fa-cloud-upload-alt fa-2x text-muted mb-1"></i>
						<div class="small text-muted">Glissez-déposez vos fichiers ici ou cliquez pour sélectionner</div>
					</div>
				`);
		}

		if (formGroup.find('.multi_files_input_files_preview').length === 0) {
			formGroup.append(`
					<div class="multi_files_input_files_preview mt-2 d-flex flex-wrap gap-2 hide"></div>
				`);
		}

		const dropzone = fileInput.parent().find('.multi_files_input_dropzone');
		const filesPreview = fileInput.parent().find('.multi_files_input_files_preview').empty();

		fileInput.addClass('hide');

		// Dropzone interactions
		dropzone.off('click').on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			fileInput.trigger('click');
		});
		dropzone.off('click').on('dragover', function (e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).addClass('border-primary');
		});
		dropzone.off('click').on('dragleave', function (e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).removeClass('border-primary');
		});
		dropzone.off('click').on('drop', function (e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).removeClass('border-primary');
			const dtFiles = (e.originalEvent.dataTransfer || {}).files || [];
			handleFiles(Array.from(dtFiles));
		});
		fileInput.off('change').on('change', (e) => {
			handleFiles(Array.from(e.target.files));
			fileInput.val('');
		});

		function handleFiles(selected) {
			for (const f of selected) {
				if (filesList.length >= nbMaxFiles) {
					FlashMessage.displayError('Maximum '+nbMaxFiles+' fichiers autorisés.');
					break;
				}
				if (f.size > maxFileSize) {
					FlashMessage.displayError('Le fichier '+f.name+' dépasse la taille maximale.');
					continue;
				}
				filesList.push(f);
				setFilesList(filesList);
				renderPreview(f);
			}
		}

		function renderPreview(file) {
			const id = 'f_' + Math.random().toString(36).slice(2, 9);
			const wrap = $(`
				<div class="border rounded p-2 d-inline-flex align-items-center" data-file-id="${id}" style="background:white;">
					<div class="me-2 preview-thumb" style="width:64px; height:48px; display:flex; align-items:center; justify-content:center; overflow:hidden;"></div>
					<div class="small text-truncate" style="max-width:160px;">${file.name}</div>
					<button type="button" class="btn-close btn-close-small ms-2" aria-label="Supprimer" style="margin-left:8px;"></button>
				</div>
			`);
			filesPreview.append(wrap);
			filesPreview.removeClass('hide');

			// thumbnail for images
			if (file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = function (e) {
					wrap.find('.preview-thumb').html(`<img src="${e.target.result}" alt="" style="max-width:100%; max-height:100%;" />`);
				};
				reader.readAsDataURL(file);
			} else {
				wrap.find('.preview-thumb').html(`<i class="fas fa-file fa-2x text-muted"></i>`);
			}

			wrap.find('.btn-close').off('click').on('click', function () {
				const idx = $(this).closest('[data-file-id]').index();
				// remove by reference: find corresponding file by name+size (best-effort)
				const name = file.name, size = file.size;
				filesList = filesList.filter(f => !(f.name === name && f.size === size));
				setFilesList(filesList);
				$(this).closest('[data-file-id]').remove();

				if (filesList.length === 0) {
					filesPreview.addClass('hide');
				}
			});
		}
	}
}

module.exports = { MultiFilesInput };
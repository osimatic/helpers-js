const TomSelect = require('tom-select').default;
const { toEl } = require('./util');

// Plugin: select-all / deselect-all (for multiple selects with data-actions-box)
TomSelect.define('actions_box', function() {
	const self = this;
	let injected = false;
	this.on('dropdown_open', function(dropdown) {
		if (injected) {
			return;
		}
		injected = true;
		const div = document.createElement('div');
		div.className = 'ts-actions-box d-flex gap-1 p-1 border-bottom';
		div.innerHTML = ''
			+ '<button type="button" class="btn btn-sm btn-outline-secondary flex-fill">Tout s\u00e9lectionner</button>'
			+ '<button type="button" class="btn btn-sm btn-outline-secondary flex-fill">Tout d\u00e9s\u00e9lectionner</button>';
		div.children[0].addEventListener('mousedown', e => {
			e.preventDefault();
			Object.keys(self.options).forEach(v => { if (!self.options[v].disabled) self.addItem(v, true); });
			self.refreshItems();
		});
		div.children[1].addEventListener('mousedown', e => { e.preventDefault(); self.clear(true); });
		dropdown.insertBefore(div, dropdown.firstChild);
	});
});

class SelectBox {

	/**
	 * Initialize Tom Select on a select element.
	 * Reads data attributes from the element to configure the instance.
	 * If already initialized, syncs options instead.
	 * @param {HTMLElement|jQuery} el
	 * @returns {TomSelect|null}
	 */
	static init(el) {
		el = toEl(el);
		if (!el) {
			return null;
		}

		if (el.tomselect) {
			SelectBox.refresh(el);
			return el.tomselect;
		}

		const isMultiple = el.multiple;
		const plugins = [];
		if (isMultiple && (el.dataset.actionsBox || el.dataset.actions_box)) {
			plugins.push('actions_box');
		}
		if (!isMultiple && el.dataset.allowClear !== 'false') {
			plugins.push('clear_button');
		}
		if (isMultiple) {
			plugins.push('remove_button');
		}

		const ts = new TomSelect(el, {
			allowEmptyOption: !isMultiple,
			placeholder: el.getAttribute('title') || 'Choisissez\u2026',
			plugins,
			wrapperClass: 'ts-wrapper' + (isMultiple ? ' multi' : ' single form-select'),
			onItemAdd: isMultiple ? undefined : function() { this.setTextboxValue(''); this.blur(); },
		});

		if (!isMultiple && !el.querySelector('option[selected]')) {
			ts.clear(true);
		}

		if (el.dataset.hide_if_empty) {
			SelectBox._checkHideIfEmpty(ts);
		}

		return ts;
	}

	static resetAll(container) {
		container = toEl(container);
		container.querySelectorAll('select.ts-select').forEach(el => {
			if (!el.tomselect) {
				el.parentElement.querySelectorAll('.ts-wrapper').forEach(w => w.remove());
				el.classList.remove('ts-hidden-accessible', 'tomselected');
			}
			SelectBox.init(el);
		});
	}

	/**
	 * Sync Tom Select options for all ts-select elements inside a container.
	 * @param {HTMLElement|jQuery} container
	 */
	static refreshAll(container) {
		container = toEl(container);
		if (!container) {
			return;
		}

		container.querySelectorAll('select.ts-select').forEach(el => SelectBox.refresh(el));
	}

	/**
	 * Sync Tom Select options from the underlying <select> element.
	 * @param {HTMLElement|jQuery} el
	 */
	static refresh(el) {
		const ts = SelectBox.getInstance(el);
		if (!ts) {
			return;
		}

		const rawVal = ts.getValue();
		const prevVal = Array.isArray(rawVal) ? [...rawVal] : rawVal;
		el = toEl(el);
		ts.sync();
		if (prevVal && prevVal !== '' && !(Array.isArray(prevVal) && prevVal.length === 0)) {
			ts.setValue(prevVal, true); // restore selection, ignore values not in options
		}
		else {
			// When there was no previous selection, honor option[selected] set before refresh()
			// (e.g. by updateSelectEmployeeCompanyTask). ts.sync() loaded them — read back from the DOM.
			const selectedValues = el
				? [...el.options].filter(o => o.selected && o.value !== '').map(o => o.value)
				: [];
			selectedValues.length > 0 ? ts.setValue(selectedValues, true) : ts.clear(true);
		}
		if (el && el.dataset.hide_if_empty) {
			SelectBox._checkHideIfEmpty(ts);
		}
	}

	/**
	 * Set the selected value(s). Pass null/undefined/'' to clear.
	 * @param {HTMLElement|jQuery} el
	 * @param {string|string[]|null} val
	 */
	static setValue(el, val) {
		el = toEl(el);
		if (!el) {
			return;
		}

		const ts = el.tomselect;
		if (!ts) {
			el.value = (val === null || val === undefined) ? '' : val;
			return;
		}

		if (val === null || val === undefined || val === '') {
			ts.clear(true);
		}
		else {
			ts.setValue(val, true);
		}
	}

	/**
	 * Clear the selected value(s).
	 * @param {HTMLElement|jQuery} el
	 */
	static clear(el) {
		el = toEl(el);
		if (!el) {
			return;
		}

		if (el.tomselect) {
			el.tomselect.clear(true);
		}
		else {
			el.value = '';
		}
	}

	/**
	 * Destroy the Tom Select instance and restore the original <select>.
	 * @param {HTMLElement|jQuery} el
	 */
	static destroy(el) {
		const ts = SelectBox.getInstance(el);
		if (!ts) {
			return;
		}

		ts.destroy();
	}

	static getInstance(el) {
		return toEl(el)?.tomselect ?? null;
	}

	static _checkHideIfEmpty(ts) {
		const hasOptions = Object.keys(ts.options).filter(v => v !== '').length > 0;
		ts.wrapper.closest('.form-group')?.classList.toggle('hide', !hasOptions);
	}
}

module.exports = { SelectBox };
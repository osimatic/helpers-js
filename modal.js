class Modal {
	/**
	 * Hide a Bootstrap modal while preventing the "Blocked aria-hidden on focused element"
	 * browser warning. Bootstrap sets aria-hidden after the CSS transition while its focus
	 * trap may still hold focus inside; blurring the active element first moves focus to
	 * document, which the focus trap ignores (it only intercepts focus on real elements).
	 *
	 * @param {bootstrap.Modal} modal - Bootstrap Modal instance
	 * @param {Element} modalElement - The modal DOM element
	 */
	static hide(modal, modalElement=null) {
		modalElement = modalElement || modal._element;
		if (modalElement.contains(document.activeElement)) {
			document.activeElement.blur();
		}
		modal.hide();
	}
}

module.exports = { Modal };
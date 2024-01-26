class SortableList {
	static init(sortableList, clientYOffset=0) {
		const items = sortableList.find('[draggable="true"]');
		items.get().forEach(item => {
			$(item).on('dragstart', () => {
				// Adding dragging class to an item after a delay
				setTimeout(() => $(item).addClass('dragging'), 0);

			});

			// Removing dragging class from the item on the dragend event
			$(item).on('dragend', () => $(item).removeClass('dragging'));
		});

		const initSortableList = (e) => {
			e.preventDefault();

			const draggingItem = sortableList.find('.dragging');

			// Getting all items except currently dragging and making an array of them
			const siblings = [...sortableList.find('[draggable="true"]:not(.dragging)').get()];

			// Finding the sibling after which the dragging item should be placed
			let nextSibling = siblings.find(sibling => {
				//console.log(e.clientY, sibling.offsetTop + sibling.offsetHeight / 2, sibling.offsetTop, sibling.offsetHeight, sibling);
				return e.clientY+clientYOffset <= sibling.offsetTop + sibling.offsetHeight / 2;
			});

			// Inserting the dragging item before the found sibling
			sortableList.get()[0].insertBefore(draggingItem.get()[0], nextSibling);
		};

		sortableList.on('dragover', initSortableList);
		sortableList.on('dragenter', e => e.preventDefault());
	}
}

module.exports = { SortableList };
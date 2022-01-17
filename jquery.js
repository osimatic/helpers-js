$.fn.filterByData = function(prop, val) {
	return this.filter(
		function() { return $(this).data(prop)==val; }
	);
};
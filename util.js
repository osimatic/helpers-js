
function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}

function refresh() {
	// console.log('Refresh page');
	// history.go(0);
	window.location.reload(true);
}

module.exports = { sleep, refresh };
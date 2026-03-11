class CountDown {

	static init(div, options = {}) {
		const {
			onRefreshData,
			labelNextUpdate = 'Prochaine mise à jour',
			labelDoUpdate = 'Mettre à jour',
		} = options;

		if (!div.length) {
			return;
		}

		div
			.append('<div class="count_down_title">'+labelNextUpdate+'</div>')
			.append('<div class="count_down_progress"><div class="count_down_current"></div></div>')
			.append('<div class="count_down_text"></div>')
			//.append('<div class="cl"></div>')
			.append('<div class="count_down_link"><a href="#" data-loading-text="<i class=\'fa fa-circle-notch fa-spin\'></i>">'+labelDoUpdate+'</a></div>')
		;

		let alreadyMakingRequest = false;
		let secondsBefRefresh = 10;
		let refreshIntervalMillis = 60;
		let currentMillis = 0;
		let currentSecond = 0;

		function refreshData() {
			currentMillis = 0;

			//Pour ne pas relancer une requête si la précédente n'est pas encore finie
			if (true === alreadyMakingRequest) {
				console.log('Already making request, no new request lauched.');
				return;
			}

			if (typeof onRefreshData == 'function') {
				alreadyMakingRequest = true;
				div.find('.count_down_link a').attr('disabled', true).button('loading');

				onRefreshData(
					// completeCallback
					() => {
						alreadyMakingRequest = false;
						div.find('.count_down_link a').attr('disabled', false).button('reset');
					}
				);
			}
		}

		if (div.find('.count_down_link a').length) {
			div.find('.count_down_link a').click(() => {
				refreshData();
				return false;
			});
		}

		setInterval(() => {
			if (!div.find('.count_down_link a').length || !div.find('.count_down_link a').prop('disabled')) {
				currentMillis += refreshIntervalMillis;
			}
			else {
				currentMillis = 0;
			}

			currentSecond = parseInt(currentMillis / 1000);

			//countDownRefresh();
			var divCountDownText;
			var divCountDownCurrentSizePx;

			if (currentSecond >= secondsBefRefresh) {
				divCountDownCurrentSizePx = 120;
				divCountDownText = '0s';
			}
			else {
				divCountDownCurrentSizePx = Math.round((120/(secondsBefRefresh*1000)) * currentMillis);
				divCountDownText = (secondsBefRefresh-currentSecond) + 's';
			}

			if (div.find('.count_down_current').length) {
				div.find('.count_down_current').width(divCountDownCurrentSizePx);
			}
			if (div.find('.count_down_text').length) {
				div.find('.count_down_text').html(divCountDownText);
			}

			if (currentSecond >= secondsBefRefresh) {
				currentMillis = 0;
				setTimeout(() => {
					refreshData();
				}, 100);
			}
		}, refreshIntervalMillis);

		refreshData();
	}

}

module.exports = { CountDown };
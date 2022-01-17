class CountDown {

	constructor(div, callbackOnRefreshData) {
		// console.log('constructor');
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

		this.div = div;
		this.callbackOnRefreshData = callbackOnRefreshData;

		this.alreadyMakingRequest = false;
		this.secondsBefRefresh = 10;
		this.refreshIntervalMillis = 60;
		this.currentMillis = 0;
		this.currentSecond = 0;

		if (div.find('.count_down_link a').length) {
			div.find('.count_down_link a').click(() => {
				this.refreshData();
				return false;
			});
		}

		setInterval(() => {
			if (!div.find('.count_down_link a').length || !div.find('.count_down_link a').prop('disabled')) {
				this.currentMillis += this.refreshIntervalMillis;
			}
			else {
				this.currentMillis = 0;
			}

			this.currentSecond = parseInt(this.currentMillis / 1000);

			//countDownRefresh();
			var divCountDownText;
			var divCountDownCurrentSizePx;

			if (this.currentSecond >= this.secondsBefRefresh) {
				divCountDownCurrentSizePx = 120;
				divCountDownText = '0s';
			}
			else {
				divCountDownCurrentSizePx = Math.round((120/(this.secondsBefRefresh*1000)) * this.currentMillis);
				divCountDownText = (this.secondsBefRefresh-this.currentSecond) + 's';
			}

			if (div.find('.count_down_current').length) {
				div.find('.count_down_current').width(divCountDownCurrentSizePx);
			}
			if (div.find('.count_down_text').length) {
				div.find('.count_down_text').html(divCountDownText);
			}

			if (this.currentSecond >= this.secondsBefRefresh) {
				this.currentMillis = 0;
				setTimeout(() => {
					this.refreshData();
				}, 100);
			}
		}, this.refreshIntervalMillis);

		this.refreshData();
	}

	setCallbackOnRefreshData(callback) {
		this.callbackOnRefreshData = callback;
	}

	refreshData() {
		this.currentMillis = 0;

		//Pour ne pas relancer une requête si la précédente n'est pas encore finie
		if (true === this.alreadyMakingRequest) {
			console.log('Already making request, no new request lauched.');
			return;
		}

		if (typeof this.callbackOnRefreshData == 'function') {
			CountDown.alreadyMakingRequest = true;
			this.div.find('.count_down_link a').attr('disabled', true).button('loading');

			this.callbackOnRefreshData(
				// completeCallback
				() => {
					this.alreadyMakingRequest = false;
					this.div.find('.count_down_link a').attr('disabled', false).button('reset');
				}
			);
		}
	}

}

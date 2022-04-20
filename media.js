class AudioMedia {

	static getPlayer(playUrl) {
		return '<audio controls preload="none"><source src="'+playUrl+'" type="audio/x-wav"></audio>';
	}

	static initPlayLinks(div) {
		// Affiche un lecteur audio
		div.find('.play_link').off('click').click(function() {
			let audio = $(AudioMedia.getPlayer($(this).data('play_url')));
			audio[0].play();
			$(this).after(audio);
			$(this).remove();
			return false;
		});

		div.find('.play_asynchronously_link').off('click').click(function() {
			if ($(this).buttonLoader('loading') != null) {
				let button = $(this).buttonLoader('loading');
				AudioMedia.playAudioUrl($(this).data('url'), () => button.buttonLoader('reset'));
			} else {
				let button = $(this).attr('disabled', true).button('loading');
				AudioMedia.playAudioUrl($(this).data('url'), () => button.attr('disabled', false).button('reset'));
			}
			
			return false;
		});

		div.find('.modal_play_link').off('click').click(function() {
			$('#modal_voice_message_play').on('show.bs.modal', function (event) {
				let button = $(event.relatedTarget);
				let modal = $(this);

				let player = modal.find('audio');
				player.prop('src', button.data('play_url'));
				player.play();
			});

			$('#modal_voice_message_play').modal('show', $(this));
			return false;
		});
	}

	static playAudioUrl(url, onPlayed) {
		try {
			let context = new (window.AudioContext || window.webkitAudioContext)();
			let request = new XMLHttpRequest();
			request.open("GET", url, true);
			Object.entries(httpHeaders).forEach(([key, value]) => request.setRequestHeader(key, value));
			request.responseType = "arraybuffer";

			request.onload = function() {
				context.decodeAudioData(request.response, function(buffer) {
					let source = context.createBufferSource();
					source.buffer = buffer;
					source.connect(context.destination);
					// auto play
					source.start(0); // start was previously noteOn

					source.onended = function(event) {
						if (typeof onPlayed == 'function') {
							onPlayed(event);
						}
					}
				});
			};
			request.send();
		}
		catch(e) {
			console.log(e);
			console.log('web audio api not supported');
		}
	}

}

module.exports = { AudioMedia };

//deprecated
function hasGetUserMedia() {
	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
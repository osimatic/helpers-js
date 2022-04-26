class AudioMedia {

	static getPlayer(playUrl) {
		return '<audio controls preload="none"><source src="' + playUrl + '" type="audio/x-wav"></audio>';
	}

	static initPlayLinks(div) {
		// Affiche un lecteur audio
		div.find('.play_link').off('click').click(function () {
			let audio = $(AudioMedia.getPlayer($(this).data('play_url')));
			audio[0].play();
			$(this).after(audio);
			$(this).remove();
			return false;
		});

		div.find('.play_asynchronously_link').off('click').click(function () {
			if ($(this).buttonLoader('loading') != null) {
				let button = $(this).buttonLoader('loading');
				AudioMedia.playAudioUrl($(this).data('url'), () => button.buttonLoader('reset'));
			} else {
				let button = $(this).attr('disabled', true).button('loading');
				AudioMedia.playAudioUrl($(this).data('url'), () => button.attr('disabled', false).button('reset'));
			}

			return false;
		});

		div.find('.modal_play_link').off('click').click(function () {
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

			request.onload = function () {
				context.decodeAudioData(request.response, function (buffer) {
					let source = context.createBufferSource();
					source.buffer = buffer;
					source.connect(context.destination);
					// auto play
					source.start(0); // start was previously noteOn

					source.onended = function (event) {
						if (typeof onPlayed == 'function') {
							onPlayed(event);
						}
					}
				});
			};
			request.send();
		}
		catch (e) {
			console.log(e);
			console.log('web audio api not supported');
		}
	}

}

//Source : https://www.npmjs.com/package/mic-check
class UserMedia { 
	/** SystemPermissionDenied => (macOS) browser does not have permission to access cam/mic */
    /** UserPermissionDenied => user denied permission for site to access cam/mic */
    /** CouldNotStartVideoSource = > (Windows) browser does not have permission to access cam/mic OR camera is in use by another application or browser tab */
    /** Generic => all other errors */

	static requestMediaPermissions(constraints) {
		return new Promise((resolve, reject) => {	
			let userAgent = navigator.userAgent;
			let browser;
			
			if (userAgent.match(/chrome|chromium|crios/i)) {
				browser = "Chrome";
			} else if (userAgent.match(/firefox|fxios/i)) {
				browser = "firefox";
			} else if (userAgent.match(/safari/i)) {
				browser = "Safari";
			} else if(userAgent.match(/opr\//i)) {
				browser = "Opera";
			} else if (userAgent.match(/edg/i)) {
				browser = "Edge";
			} else {
				browser = "No browser detection";
			}
			
			navigator.mediaDevices.getUserMedia(constraints !== 'undefined' ? constraints : { audio: true, video: true })
			.then((stream) => {
				stream.getTracks().forEach((track) => track.stop());
				resolve();
			}).catch((error) => {
				const errName = error.name;
				const errMessage = error.message;
				let errorType = "Generic";

				if (browser === 'Chrome') {
					if (errName === 'NotAllowedError') {
						if (errMessage === 'Permission denied by system') {
							errorType = "SystemPermissionDenied";
						} else if (errMessage === 'Permission denied') {
							errorType = "UserPermissionDenied";
						}
					} else if (errName === 'NotReadableError') {
						errorType = "CouldNotStartVideoSource";
					}
				} else if (browser === 'Safari') {
					if (errName === 'NotAllowedError') {
						errorType = "UserPermissionDenied";
					}
				} else if (browser === 'Microsoft Edge') {
					if (errName === 'NotAllowedError') {
						errorType = "UserPermissionDenied";
					} else if (errName === 'NotReadableError') {
						errorType = "CouldNotStartVideoSource";
					}
				} else if (browser === 'Firefox') {
					// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#exceptions
					if (errName === 'NotFoundError') {
						errorType = "SystemPermissionDenied";
					} else if (errName === 'NotReadableError') {
						errorType = "SystemPermissionDenied";
					} else if (errName === 'NotAllowedError') {
						errorType = "UserPermissionDenied";
					} else if (errName === 'AbortError') {
						errorType = "CouldNotStartVideoSource";
					}
				}

				reject({ type: errorType, name: error.name, message: error.message });
			});
		});
	}

	static requestAudioPermissions(audioConstraints) {
		return this.requestMediaPermissions({ audio: (audioConstraints !== 'undefined' ? audioConstraints : true), video: false });
	}
	
	static requestVideoPermissions(audioConstraints, videoConstraints) {
		return this.requestMediaPermissions({ audio: (audioConstraints !== 'undefined' ? audioConstraints : true), video: (videoConstraints !== 'undefined' ? videoConstraints : true )});
	}

	static requestMutedVideoPermissions(videoConstraints) {
		return this.requestMediaPermissions({ audio: false, video: (videoConstraints !== 'undefined' ? videoConstraints : true )});
	}
}

module.exports = { AudioMedia, UserMedia };

//deprecated
function hasGetUserMedia() {
	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
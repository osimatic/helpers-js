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
			//if (FormHelper.buttonLoader($(this), 'loading') != null) {
			let button = FormHelper.buttonLoader($(this), 'loading');
			AudioMedia.playAudioUrl($(this).data('url'), () => FormHelper.buttonLoader(button, 'reset'));
			//} else {
			//	let button = $(this).attr('disabled', true).button('loading');
			//	AudioMedia.playAudioUrl($(this).data('url'), () => button.attr('disabled', false).button('reset'));
			//}
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
			Object.entries(HTTPClient.getHeaders(true)).forEach(([key, value]) => request.setRequestHeader(key, value));
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
			console.error('web audio api not supported', e);
		}
	}

	static initAudioVisualization(canvas, audioStream) {
		let canvasCtx = canvas.getContext("2d");
		let canvasWidth = canvas.width;
		let canvasHeight = canvas.height;
		let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		let analyser = audioCtx.createAnalyser();

		let distortion = audioCtx.createWaveShaper();
		let source = audioCtx.createMediaStreamSource(audioStream);
		source.connect(analyser);
		analyser.connect(distortion);
		distortion.connect(audioCtx.destination);

		analyser.fftSize = 256;
		let bufferLength = analyser.frequencyBinCount;
		//console.log(bufferLength);
		let dataArray = new Uint8Array(bufferLength);

		canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

		function draw() {
			let drawVisual = requestAnimationFrame(draw);

			analyser.getByteFrequencyData(dataArray);

			canvasCtx.fillStyle = 'rgb(0, 0, 0)';
			canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);

			let barWidth = (canvasWidth / bufferLength) * 2.5;
			let barHeight;
			let x = 0;
			for (let i = 0; i < bufferLength; i++) {
				barHeight = dataArray[i] / 2;

				canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
				canvasCtx.fillRect(x, canvasHeight - barHeight / 2, barWidth, barHeight);

				x += barWidth + 1;
			}
		}

		draw();
	}
}

class VideoMedia {
	static initPlayPauseClick(videoElement) {
		$(videoElement).click(function(e) {
			// handle click if not Firefox (Firefox supports this feature natively)
			if (typeof InstallTrigger === 'undefined') {
				// get click position
				let clickY = (e.pageY - $(this).offset().top);
				let height = parseFloat( $(this).height() );

				// avoids interference with controls
				if (clickY > 0.82*height) return;

				// toggles play / pause
				this.paused ? this.play() : this.pause();
			}
		});
	}
}

//Source : https://www.npmjs.com/package/mic-check
class UserMedia {
	static hasGetUserMedia() {
		return !!(typeof navigator !== 'undefined' && (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia));
	}

	/** SystemPermissionDenied => (macOS) browser does not have permission to access cam/mic */
	/** UserPermissionDenied => user denied permission for site to access cam/mic */
	/** CouldNotStartVideoSource = > (Windows) browser does not have permission to access cam/mic OR camera is in use by another application or browser tab */
	/** Generic => all other errors */

	static requestMediaPermissions(constraints) {
		/*try {
			console.log(require.resolve("bowser"));
		} catch(e) {
			return;
		}*/

		return new Promise((resolve, reject) => {
			const bowser = require('bowser');
			const browser = bowser.getParser(window.navigator.userAgent);
			const browserName = browser.getBrowserName();

			navigator.mediaDevices.getUserMedia(typeof constraints !== 'undefined' ? constraints : { audio: true, video: true })
			.then((stream) => resolve(stream))
			.catch((error) => {
				const errName = error.name;
				const errMessage = error.message;
				let errorType = "Generic";

				if (browserName === 'Chrome') {
					if (errName === 'NotAllowedError') {
						if (errMessage === 'Permission denied by system') {
							errorType = "SystemPermissionDenied";
						} else if (errMessage === 'Permission denied') {
							errorType = "UserPermissionDenied";
						}
					} else if (errName === 'NotReadableError') {
						errorType = "CouldNotStartVideoSource";
					}
				} else if (browserName === 'Safari') {
					if (errName === 'NotAllowedError') {
						errorType = "UserPermissionDenied";
					}
				} else if (browserName === 'Microsoft Edge') {
					if (errName === 'NotAllowedError') {
						errorType = "UserPermissionDenied";
					} else if (errName === 'NotReadableError') {
						errorType = "CouldNotStartVideoSource";
					}
				} else if (browserName === 'Firefox') {
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
		return this.requestMediaPermissions({ audio: (typeof audioConstraints !== 'undefined' ? audioConstraints : true), video: false });
	}

	static requestVideoPermissions(audioConstraints, videoConstraints) {
		return this.requestMediaPermissions({ audio: (typeof audioConstraints !== 'undefined' ? audioConstraints : true), video: (typeof videoConstraints !== 'undefined' ? videoConstraints : true )});
	}

	static requestMutedVideoPermissions(videoConstraints) {
		return this.requestMediaPermissions({ audio: false, video: (typeof videoConstraints !== 'undefined' ? videoConstraints : true )});
	}
}

module.exports = { AudioMedia, VideoMedia, UserMedia };

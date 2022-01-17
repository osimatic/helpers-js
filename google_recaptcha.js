
var grecaptchaWidgets = [];

function grecaptchaOnload () {
	if (typeof grecaptcha == 'undefined') {
		console.log('var grecaptcha undefined');
		return;
	}
	document.querySelectorAll('.grecaptcha').forEach(element => {
		grecaptchaWidgets[element.id] = grecaptcha.render(element.id, googleReCaptchaDatas);
	});
	//$('.grecaptcha').each(function(idx, el) {
	//	grecaptchaWidgets[$(el).attr('id')] = grecaptcha.render($(el).attr('id'), googleReCaptchaDatas);
	//});
}

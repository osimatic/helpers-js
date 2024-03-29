
class Duration {

	static formatNbDays(nbDays, locale='fr-FR') {
		return new Intl.NumberFormat(locale, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(nbDays);
	}
	static formatNbDaysIfPositive(nbDays) {
		return nbDays < 0 ? '-' : this.formatNbDays(nbDays);
	}
	static formatNbDaysWithColor(nbDays) {
		return '<span class="text-'+(nbDays<0?'danger':'success')+'">'+this.formatNbDays(nbDays)+'</span>';
	}

	static convertToDurationAsCentieme(durationInSeconds) {
		let hour = Math.floor(durationInSeconds / 3600);
		let minutes = durationInSeconds % 3600;
		minutes = Math.floor(minutes / 60);
		// minutes = minutes - (minutes % 60);
		let minCentieme = Math.round( (minutes / 60 ) * 100 );
		return hour+(minCentieme/100);
		//return parseFloat(hour+'.'+minCentieme);
	}

	static convertToDurationAsInputTimeValue(durationInSeconds) {
		return Duration.convertToDurationInHourChronoDisplay(Math.abs(durationInSeconds), 'input_time');
	}

	static convertToDurationInHourChronoDisplay(durationInSeconds, displayMode='chrono') {
		let durationInSecondsOriginal = durationInSeconds;
		durationInSeconds = Math.abs(durationInSeconds);
		let seconds = ( durationInSeconds % 60 );
		let remander = ( durationInSeconds % 3600 ) - seconds;
		let minutes = ( remander / 60 );
		remander = ( durationInSeconds ) - ( durationInSeconds % 3600 );
		let hours = ( remander / 3600 );
		if(hours.toString().length < 2) hours = '0'+hours;
		if(hours.toString().charAt(0) === "-") hours[0] = '0';
		if(minutes.toString().length < 2) minutes = '0'+minutes;
		if(minutes.toString().charAt(0) === "-") minutes[0] = '0';
		if(seconds.toString().length < 2) seconds = '0'+seconds;
		return (durationInSecondsOriginal < 0 ? '- ' : '')+hours+':'+minutes+(displayMode==='input_time'?':':'.')+seconds;
	}

	static convertToDurationInHourStringDisplay(durationInSeconds, withSecondes=true, withMinutes=true, withLibelleMinute=true, libelleEntier=false) {
		// Heures
		let strHeure = '';
		let nbHeures = this.getNbHoursOfDurationInSeconds(durationInSeconds);
		strHeure += nbHeures;
		if (libelleEntier) {
			strHeure += ' heure'+(nbHeures>1?'s':'');
		}
		else {
			strHeure += 'h';
		}
		
		// Minutes
		let strMinute = '';
		let nbMinutes = 0;
		if (withMinutes) {
			nbMinutes = this.getNbMinutesRemainingOfDurationInSeconds(durationInSeconds);
			strMinute += ' ';
			//strMinute += sprintf('%02d', nbMinutes);
			strMinute += nbMinutes.toString().padStart(2, '0');
			if (withLibelleMinute) {
				if (libelleEntier) {
					strMinute += ' minute'+(nbMinutes>1?'s':'');
				}
				else {
					strMinute += 'min';
				}
			}
		}
		
		// Secondes
		let strSeconde = '';
		if (withSecondes) {
			let nbSecondes = this.getNbSecondsRemainingOfDurationInSeconds(durationInSeconds);
			strSeconde += ' ';
			//strSeconde += sprintf('%02d', nbSecondes);
			strSeconde += nbSecondes.toString().padStart(2, '0');
			if (libelleEntier) {
				strSeconde += ' seconde'+(nbSecondes>1?'s':'');
			}
			else {
				strSeconde += 's';
			}
		}
		
		return (strHeure+strMinute+strSeconde).trim();
	}

	static roundNbSeconds(durationInSeconds, roundPrecision, roundMode='close') {
		let hours = Math.floor(durationInSeconds / 3600);
		let minutes = Math.floor((durationInSeconds % 3600) / 60);
		let seconds = durationInSeconds % 60;

		let hoursRounded = hours;
		let minutesRounded = minutes;
		let secondsRounded = seconds;

		if (roundPrecision > 0) {
			let minutesRemaining = minutes % roundPrecision;
			let minutesRemainingAndSecondsAsCentieme = minutesRemaining + seconds/60;
			if (minutesRemainingAndSecondsAsCentieme === 0) {
				// pas d'arrondissement
			}
			else {
				let halfRoundPrecision = roundPrecision / 2;
				hoursRounded = hours;
				secondsRounded = 0;
				if (roundMode === 'up' || (roundMode === 'close' && minutesRemainingAndSecondsAsCentieme > halfRoundPrecision)) {
					// Arrondissement au dessus
					if (minutes > (60-roundPrecision)) {
						minutesRounded = 0;
						hoursRounded++;
					}
					else {
						minutesRounded = (minutes-minutesRemaining)+roundPrecision;
					}
				}
				else {
					// Arrondissement au dessous
					minutesRounded = (minutes-minutesRemaining);
				}
			}
		}
		// console.log(element.data('duration_default'), durationInSeconds, hours, minutes, seconds, '->', secondsTotalRounded, hoursRounded, minutesRounded, secondsRounded);
		return hoursRounded * 3600 + minutesRounded * 60 + secondsRounded;
	}

	static getNbDaysOfDurationInSeconds(durationInSeconds) {
		return Math.floor(durationInSeconds / 86400);
	}
	static getNbHoursOfDurationInSeconds(durationInSeconds) {
		return Math.floor(durationInSeconds / 3600);
	}
	static getNbMinutesOfDurationInSeconds(durationInSeconds) {
		return Math.floor(durationInSeconds / 60);
	}

	/*static getNbMinutesRemaining(durationInSeconds) {
		var remander = ( durationInSeconds % 3600 ) - ( durationInSeconds % 60 );
		return ( remander / 60 );
	}
	static getNbHoursOfDurationInSeconds(durationInSeconds) {
		// return (this.getNbDaysOfDurationInSeconds(durationInSeconds)*24)+this.getNbHoursRemainingOfDurationInSeconds(durationInSeconds);
		return (durationInSeconds - (durationInSeconds % 3600)) / 3600;
	}
	static getNbMinutesOfDurationInSeconds(durationInSeconds) {
		// return (this.getNbDaysOfDurationInSeconds(durationInSeconds)*24*60)+(this.getNbHoursRemainingOfDurationInSeconds(durationInSeconds)*60)+this.getNbMinutesRemainingOfDurationInSeconds(durationInSeconds);
		return (durationInSeconds - (durationInSeconds % 60)) / 60;
	}*/

	static getNbHoursRemainingOfDurationInSeconds(durationInSeconds) {
		return this.getNbHoursOfDurationInSeconds(durationInSeconds % 86400);
	}
	static getNbMinutesRemainingOfDurationInSeconds(durationInSeconds) {
		return this.getNbMinutesOfDurationInSeconds(durationInSeconds % 3600);
	}
	static getNbSecondsRemainingOfDurationInSeconds(durationInSeconds) {
		return durationInSeconds % 60;
	}

}

module.exports = { Duration };
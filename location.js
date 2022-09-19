
class Country {
	static getFlagPath(countryCode) {
		return flagsPath+countryCode.toLowerCase()+'.png';
	}
	static getFlagImg(countryCode) {
		return '<span><img src="'+Country.getFlagPath(countryCode)+'" alt="" title="'+Country.getCountryName(countryCode)+'" class="flag" /></span>'
	}

	static fillCountrySelect(select, defaultValue) {
		Object.entries(Country.getCountries()).forEach(([countryCode, countryName]) => select.append('<option value="'+countryCode+'">'+countryName+'</option>'));
		if (typeof defaultValue != 'undefined') {
			select.val(defaultValue);
		}
		select.selectpicker('refresh');
	}
	static getCountryName(countryCode) {
		if (Country.getCountries().hasOwnProperty(countryCode)) {
			return Country.getCountries()[countryCode];
		}
		return countryCode;
	}
	static getCountries() {
		return {
			AF:'Afghanistan',
			AX:'Åland Islands',
			AL:'Albania',
			DZ:'Algeria',
			AS:'American Samoa',
			AD:'Andorra',
			AO:'Angola',
			AI:'Anguilla',
			AQ:'Antarctica',
			AG:'Antigua and Barbuda',
			AR:'Argentina',
			AM:'Armenia',
			AW:'Aruba',
			AU:'Australia',
			AT:'Austria',
			AZ:'Azerbaijan',
			BS:'Bahamas',
			BH:'Bahrain',
			BD:'Bangladesh',
			BB:'Barbados',
			BY:'Belarus',
			BE:'Belgium',
			BZ:'Belize',
			BJ:'Benin',
			BM:'Bermuda',
			BT:'Bhutan',
			BO:'Bolivia',
			BA:'Bosnia and Herzegovina',
			BW:'Botswana',
			BV:'Bouvet Island',
			BR:'Brazil',
			IO:'British Indian Ocean Territory',
			BN:'Brunei Darussalam',
			BG:'Bulgaria',
			BF:'Burkina Faso',
			BI:'Burundi',
			KH:'Cambodia',
			CM:'Cameroon',
			CA:'Canada',
			CV:'Cape Verde',
			KY:'Cayman Islands',
			CF:'Central African Republic',
			TD:'Chad',
			CL:'Chile',
			CN:'China',
			CX:'Christmas Island',
			CC:'Cocos (Keeling) Islands',
			CO:'Colombia',
			KM:'Comoros',
			CG:'Congo',
			CD:'Congo, The Democratic Republic of The',
			CK:'Cook Islands',
			CR:'Costa Rica',
			CI:'Cote d’Ivoire',
			HR:'Croatia',
			CU:'Cuba',
			CY:'Cyprus',
			CZ:'Czechia',
			DK:'Denmark',
			DJ:'Djibouti',
			DM:'Dominica',
			DO:'Dominican Republic',
			EC:'Ecuador',
			EG:'Egypt',
			SV:'El Salvador',
			GQ:'Equatorial Guinea',
			ER:'Eritrea',
			EE:'Estonia',
			ET:'Ethiopia',
			FK:'Falkland Islands (Malvinas)',
			FO:'Faroe Islands',
			FJ:'Fiji',
			FI:'Finland',
			FR:'France',
			GF:'French Guiana',
			PF:'French Polynesia',
			TF:'French Southern Territories',
			GA:'Gabon',
			GM:'Gambia',
			GE:'Georgia',
			DE:'Germany',
			GH:'Ghana',
			GI:'Gibraltar',
			GR:'Greece',
			GL:'Greenland',
			GD:'Grenada',
			GP:'Guadeloupe',
			GU:'Guam',
			GT:'Guatemala',
			GG:'Guernsey',
			GN:'Guinea',
			GW:'Guinea-bissau',
			GY:'Guyana',
			HT:'Haiti',
			HM:'Heard Island and Mcdonald Islands',
			VA:'Holy See (Vatican City State)',
			HN:'Honduras',
			HK:'Hong Kong',
			HU:'Hungary',
			IS:'Iceland',
			IN:'India',
			ID:'Indonesia',
			IR:'Iran, Islamic Republic of',
			IQ:'Iraq',
			IE:'Ireland',
			IM:'Isle of Man',
			IL:'Israel',
			IT:'Italy',
			JM:'Jamaica',
			JP:'Japan',
			JE:'Jersey',
			JO:'Jordan',
			KZ:'Kazakhstan',
			KE:'Kenya',
			KI:'Kiribati',
			KP:'Korea, Democratic People’s Republic of',
			KR:'Korea, Republic of',
			KW:'Kuwait',
			KG:'Kyrgyzstan',
			LA:'Lao People’s Democratic Republic',
			LV:'Latvia',
			LB:'Lebanon',
			LS:'Lesotho',
			LR:'Liberia',
			LY:'Libyan Arab Jamahiriya',
			LI:'Liechtenstein',
			LT:'Lithuania',
			LU:'Luxembourg',
			MO:'Macao',
			MK:'Macedonia, The Former Yugoslav Republic of',
			MG:'Madagascar',
			MW:'Malawi',
			MY:'Malaysia',
			MV:'Maldives',
			ML:'Mali',
			MT:'Malta',
			MH:'Marshall Islands',
			MQ:'Martinique',
			MR:'Mauritania',
			MU:'Mauritius',
			YT:'Mayotte',
			MX:'Mexico',
			FM:'Micronesia, Federated States of',
			MD:'Moldova, Republic of',
			MC:'Monaco',
			MN:'Mongolia',
			ME:'Montenegro',
			MS:'Montserrat',
			MA:'Morocco',
			MZ:'Mozambique',
			MM:'Myanmar',
			NA:'Namibia',
			NR:'Nauru',
			NP:'Nepal',
			NL:'Netherlands',
			AN:'Netherlands Antilles',
			NC:'New Caledonia',
			NZ:'New Zealand',
			NI:'Nicaragua',
			NE:'Niger',
			NG:'Nigeria',
			NU:'Niue',
			NF:'Norfolk Island',
			MP:'Northern Mariana Islands',
			NO:'Norway',
			OM:'Oman',
			PK:'Pakistan',
			PW:'Palau',
			PS:'Palestinian Territory, Occupied',
			PA:'Panama',
			PG:'Papua New Guinea',
			PY:'Paraguay',
			PE:'Peru',
			PH:'Philippines',
			PN:'Pitcairn',
			PL:'Poland',
			PT:'Portugal',
			PR:'Puerto Rico',
			QA:'Qatar',
			RE:'Reunion',
			RO:'Romania',
			RU:'Russian Federation',
			RW:'Rwanda',
			SH:'Saint Helena',
			KN:'Saint Kitts and Nevis',
			LC:'Saint Lucia',
			PM:'Saint Pierre and Miquelon',
			VC:'Saint Vincent and The Grenadines',
			WS:'Samoa',
			SM:'San Marino',
			ST:'Sao Tome and Principe',
			SA:'Saudi Arabia',
			SN:'Senegal',
			RS:'Serbia',
			SC:'Seychelles',
			SL:'Sierra Leone',
			SG:'Singapore',
			SK:'Slovakia',
			SI:'Slovenia',
			SB:'Solomon Islands',
			SO:'Somalia',
			ZA:'South Africa',
			GS:'South Georgia and The South Sandwich Islands',
			ES:'Spain',
			LK:'Sri Lanka',
			SD:'Sudan',
			SR:'Suriname',
			SJ:'Svalbard and Jan Mayen',
			SZ:'Swaziland',
			SE:'Sweden',
			CH:'Switzerland',
			SY:'Syrian Arab Republic',
			TW:'Taiwan, Province of China',
			TJ:'Tajikistan',
			TZ:'Tanzania, United Republic of',
			TH:'Thailand',
			TL:'Timor-leste',
			TG:'Togo',
			TK:'Tokelau',
			TO:'Tonga',
			TT:'Trinidad and Tobago',
			TN:'Tunisia',
			TR:'Turkey',
			TM:'Turkmenistan',
			TC:'Turks and Caicos Islands',
			TV:'Tuvalu',
			UG:'Uganda',
			UA:'Ukraine',
			AE:'United Arab Emirates',
			GB:'United Kingdom',
			US:'United States',
			UM:'United States Minor Outlying Islands',
			UY:'Uruguay',
			UZ:'Uzbekistan',
			VU:'Vanuatu',
			VE:'Venezuela',
			VN:'Viet Nam',
			VG:'Virgin Islands, British',
			VI:'Virgin Islands, U.S.',
			WF:'Wallis and Futuna',
			EH:'Western Sahara',
			YE:'Yemen',
			ZM:'Zambia',
			ZW:'Zimbabwe',
		};
	}

	static getContinents() {
		return {
			1: "Europe",
			2: "Moyen-Orient",
			3: "Afrique",
			4: "Amérique du Nord",
			5: "Amérique du Sud",
			6: "Asie",
			7: "Océanie",
		};
	}

	/** @deprecated **/
	static getCountryList() {
		return Country.getCountries();
	}
}

class PostalAddress {
	static setAutocomplete(input, onPlaceChanged) {
		let autocomplete = new google.maps.places.Autocomplete(
			input[0],
			{types: ['geocode']}
		);
		//console.log(autocomplete);

		// When the user selects an address from the dropdown, populate the address fields in the form.
		autocomplete.addListener('place_changed', function() {
			let place = autocomplete.getPlace();
			input.val('');
			if (typeof onPlaceChanged == 'function') {
				onPlaceChanged(place['formatted_address']);
			}
		});
	}

	static format(addressData, separator) {
		if (typeof separator == 'undefined') {
			separator = '<br/>';
		}

		/*
		var address = new Address({
			country: "USA",
			countryCode: "US",
			postalCode: "95054",
			region: "CA",
			locality: "Santa Clara",
			streetAddress: "LG Silicon Valley Lab, 5150 Great America Pkwy"
		});
		var af = new AddressFmt();
		var formatted = af.format(address);
		console.log(formatted);
		 */

		var addressDataForPluging = {
			streetAddress: addressData.streetAddress+(addressData.additionalAddress!=null&&addressData.additionalAddress!==''?"\n"+addressData.additionalAddress:''),
			postalCode: addressData.postalCode,
			locality: addressData.locality,
			region: addressData.state,
			countryCode: addressData.countryCode,
			country: Country.getCountryName(addressData.countryCode),
		};
		if (addressDataForPluging.locality == null) {
			addressDataForPluging.locality = addressData.suburb;
		}
		if (addressDataForPluging.locality == null) {
			addressDataForPluging.locality = addressData.stateDistrict;
		}

		var af = new AddressFmt();
		var formattedAddress = af.format(new Address(addressDataForPluging));
		return formattedAddress.replace(/\n+/g, separator);
	}

	static getComponentsFromGoogleApi(googleApiResult) {
		/*
		var addressData = {
			streetAddress: address.street,
			additionalAddress: null,
			postalCode: address.zipCode,
			locality: address.city,
			stateDistrict: null,
			state: null,
			countryCode: address.country,
		};
		*/

		var streetNumber = null;
		var route = null;
		var shortRoute = null;

		var addressData = {};
		googleApiResult.address_components.forEach(function(resultAddressComponent) {
			if (resultAddressComponent.types.indexOf('street_number') !== -1) {
				streetNumber = resultAddressComponent.long_name;
			}
			if (resultAddressComponent.types.indexOf('route') !== -1) {
				route = resultAddressComponent.long_name;
				shortRoute = resultAddressComponent.long_name;
			}
			if (resultAddressComponent.types.indexOf('sublocality_level_1') !== -1) {
				addressData.suburb = resultAddressComponent.long_name;
			}
			if (resultAddressComponent.types.indexOf('locality') !== -1) {
				addressData.locality = resultAddressComponent.long_name;
			}
			if (resultAddressComponent.types.indexOf('postal_town') !== -1) {
				addressData.locality = resultAddressComponent.long_name;
			}
			if (resultAddressComponent.types.indexOf('postal_code') !== -1) {
				addressData.postalCode = resultAddressComponent.long_name;
			}
			if (resultAddressComponent.types.indexOf('administrative_area_level_3') !== -1) {
				addressData.locality = resultAddressComponent.long_name;
			}
			if (resultAddressComponent.types.indexOf('administrative_area_level_2') !== -1) {
				addressData.stateDistrict = resultAddressComponent.long_name;
			}
			if (resultAddressComponent.types.indexOf('administrative_area_level_1') !== -1) {
				addressData.state = resultAddressComponent.long_name;
			}
			if (resultAddressComponent.types.indexOf('country') !== -1) {
				addressData.countryCode = resultAddressComponent.short_name;
			}
		});
		var htmlAddress = $(googleApiResult.adr_address);
		// console.log(googleApiResult.adr_address);
		// console.log(htmlAddress);
		// console.log(htmlAddress.find('span.street-address'));
		//console.log($(htmlAddress[0]).text());
		if (htmlAddress.length && $(htmlAddress[0]).length) {
			addressData.streetAddress = $(htmlAddress[0]).text();
		}
		else {
			addressData.streetAddress = streetNumber+' '+route;
		}

		return addressData;
	}
}

class GeographicCoordinates {
	static check(str) {
		return /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(str);
	}
}

module.exports = { Country, PostalAddress, GeographicCoordinates };
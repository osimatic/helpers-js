//A noter : les réécritures de prototypes définies dans certains fichiers n'ont pas besoin d'être exportés depuis le module en question (exemple Array / Object dans array.js).
//Il faut uniquement appeler require() (sans récupérer le retour) et ajouter la/les classe(s) concernée(s) dans l'export ci-dessous (l'appel de require() applique l'extension).

// rien à exporter (que des extensions d'objet natif)
require('./string');
require('./array');
require('./number');

// exports d'ojets non natif
const { HTTPRequest, Cookie, UrlAndQueryString } = require('./network');
const { IBAN, BankCard } = require('./bank');
const { AudioMedia, UserMedia } = require('./media');
const { PersonName, Email, TelephoneNumber } = require('./contact_details');
const { DateTime, TimestampUnix, SqlDate, SqlTime, SqlDateTime } = require('./date_time');
const { Duration } = require('./duration');
const { File, CSV, Img } = require('./file');
const { FormHelper, EditValue } = require('./form_helper');
const { Country, PostalAddress, GeographicCoordinates } = require('./location');
const { HexColor, RgbColor } = require('./draw');
const { SocialNetwork } = require('./social_network');
const { sleep, refresh } = require('./util');
const { chr, ord, trim, empty } = require('./php.min');

// exports plugins "maison"
const { Browser } = require('./visitor');
const { DataTable } = require('./data_table');
const { Pagination, Navigation } = require('./paging');
const { DetailsSubArray } = require('./details_sub_array');
const { SelectAll } = require('./select_all');
const { MultipleActionInTable, MultipleActionInDivList } = require('./multiple_action_in_table');
const { FormDate, InputPeriod } = require('./form_date');
const { ShoppingCart } = require('./shopping_cart');
const { FlashMessage } = require('./flash_message');
const { CountDown } = require('./count_down');
const { ImportFromCsv } = require('./import_from_csv');
const { JwtToken, JwtSession, ApiTokenSession } = require('./jwt');
const { ListBox } = require('./list_box');
const { WebRTC } = require('./web_rtc');
const { EventBus } = require('./event_bus');

// exports surcouche lib externe
const { GoogleCharts } = require('./google_charts');
const { GoogleRecaptcha } = require('./google_recaptcha');
const { GoogleMap } = require('./google_maps');
const { OpenStreetMap } = require('./open_street_map');
const { WebSocket } = require('./web_socket');

module.exports = {
	Array, Object, Number, String,
	HTTPRequest, Cookie, UrlAndQueryString, IBAN, BankCard, AudioMedia, UserMedia, PersonName, Email, TelephoneNumber, DateTime, TimestampUnix, SqlDate, SqlTime, SqlDateTime, Duration, File, CSV, Img, FormHelper, Country, PostalAddress, GeographicCoordinates, HexColor, RgbColor, SocialNetwork,
	Browser, DataTable, Pagination, Navigation, DetailsSubArray, SelectAll, MultipleActionInTable, MultipleActionInDivList, EditValue, FormDate, InputPeriod, ShoppingCart, FlashMessage, CountDown, ImportFromCsv, JwtToken, JwtSession, ApiTokenSession, ListBox, WebRTC, WebSocket, EventBus,
	sleep, refresh, chr, ord, trim, empty,
	GoogleCharts, GoogleRecaptcha, GoogleMap, OpenStreetMap
};
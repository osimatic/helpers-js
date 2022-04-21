//A noter : les réécritures de prototypes définies dans certains fichiers n'ont pas besoin d'être exportés depuis le module en question (exemple Array / Object dans array.js).
//Il faut uniquement appeler require() (sans récupérer le retour) et ajouter la/les classe(s) concernée(s) dans l'export ci-dessous (l'appel de require() applique l'extension).

const { HTTPRequest, Cookie, UrlAndQueryString } = require('./network');
const { IBAN } = require('./bank');
const { AudioMedia } = require('./media');
const { PersonName, Email, TelephoneNumber } = require('./contact_details');
const { CountDown } = require('./count_down');
const { DataTable } = require('./data_table');
const { DateTime, TimestampUnix, SqlDate, SqlTime, SqlDateTime, InputPeriod } = require('./date_time');
const { DetailsSubArray } = require('./details_sub_array');
const { Duration } = require('./duration');
const { File, CSV, Img } = require('./file');
const { FlashMessage } = require('./flash_message');
const { FormHelper } = require('./form_helper');
const { GoogleMap } = require('./google_maps');
const { ImportFromCsv } = require('./import_from_csv');
const { JwtToken, JwtSession } = require('./jwt');
const { ListBox } = require('./list_box');
const { COUNTRIES_LIST, Country, PostalAddress, Location } = require('./location');
const { SocialNetwork } = require('./social_network');
const { getValuesByKeyInArrayOfArrays, renameKeys, renameKeysByCallback } = require('./array');
const { NumberValue } = require('./number');
const { selectionnerContenuNode, copierTexte } = require('./string');
const { addBookmark, sleep, refresh } = require('./util');
const { chr, ord, trim, empty } = require('./php.min');

module.exports = {
    HTTPRequest, Cookie, UrlAndQueryString, IBAN, AudioMedia, PersonName, Email, TelephoneNumber, CountDown, DataTable,
    DateTime, TimestampUnix, SqlDate, SqlTime, SqlDateTime, InputPeriod, DetailsSubArray, Duration, File, CSV, Img,
    FlashMessage, FormHelper, GoogleMap, ImportFromCsv, JwtToken, JwtSession, ListBox, COUNTRIES_LIST, Country, PostalAddress, 
    Location, SocialNetwork, Array, Object, getValuesByKeyInArrayOfArrays, renameKeys, renameKeysByCallback, Number, NumberValue,
    String, selectionnerContenuNode, copierTexte, addBookmark, sleep, refresh, chr, ord, trim, empty
};
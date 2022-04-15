import CryptoJS from 'crypto-js'

// todo: dynamic  keys
const iv = CryptoJS.enc.Utf8.parse('8244002440089157');
const key = CryptoJS.enc.Utf8.parse('93106165734640459728346589106791');
const second_key = CryptoJS.enc.Utf8.parse('97952160493714852094564712118349');

/**
 * Parses the embedded video URL to encrypt-ajax.php parameters
 * @param {cheerio} $ Cheerio object of the embedded video page
 * @param {string} id Id of the embedded video URL
 */
export function generateEncryptAjaxParameters($, id) {
    const
        cryptVal = $("script[data-name='episode']").data().value,
        decryptedData = CryptoJS.AES['decrypt'](cryptVal, key, {
            'iv': iv
        }),
        decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData),
        videoId = decryptedStr.substring(0, decryptedStr.indexOf('&')),
        encryptedVideoId = CryptoJS.AES['encrypt'](videoId, key, {
            'iv': iv
        }).toString();

    return 'id=' + encryptedVideoId + decryptedStr.substring(decryptedStr.indexOf('&')) + '&alias=' + videoId;
}
/**
 * Decrypts the encrypted-ajax.php response
 * @param {object} obj Response from the server
 */
export function decryptEncryptAjaxResponse(obj) {
    const decrypted = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(obj.data, second_key, {
        'iv': iv
    }));
    return JSON.parse(decrypted);
}
import CryptoJS from 'crypto-js'


// Credit to MeemeeLab for this code

const iv = CryptoJS.enc.Utf8.parse('4770478969418267');
const ajaxData = CryptoJS.enc.Utf8.parse('63976882873559819639988080820907');

/**
 * Parses the embedded video URL to encrypt-ajax.php parameters
 * @param {cheerio} $ Cheerio object of the embedded video page
 * @param {string} id Id of the embedded video URL
 */
export function generateEncryptAjaxParameters($, id) {
    const
        cryptVal = $("script[data-name='episode']").data().value,
        decryptedData = CryptoJS.AES['decrypt'](cryptVal, ajaxData, {
            'iv': iv
        }),
        decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData),
        videoId = decryptedStr.substring(0, decryptedStr.indexOf('&')),
        encryptedVideoId = CryptoJS.AES['encrypt'](videoId, ajaxData, {
            'iv': iv
        }).toString();
    return 'id=' + encryptedVideoId + decryptedStr.substring(decryptedStr.indexOf('&')) + '&alias=' + videoId;
}
/**
 * Decrypts the encrypted-ajax.php response
 * @param {object} obj Response from the server
 */
export function decryptEncryptAjaxResponse(obj) {
    const decrypted = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(obj.data, ajaxData, {
        'iv': iv
    }));
    return JSON.parse(decrypted);
}
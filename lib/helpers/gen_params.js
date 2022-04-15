import axios from 'axios';
import CryptoJS from 'crypto-js'

const ENCRYPTION_KEYS_URL = "https://raw.githubusercontent.com/justfoolingaround/animdl-provider-benchmarks/master/api/gogoanime.json"

let iv = null;
let key = null;
let second_key = null;

const fetch_keys = async() => {
    const response = await axios.get(ENCRYPTION_KEYS_URL);
    const res = response.data;
    return {
        iv: CryptoJS.enc.Utf8.parse(res.iv),
        key: CryptoJS.enc.Utf8.parse(res.key),
        second_key: CryptoJS.enc.Utf8.parse(res.second_key)
    };
}


/**
 * Parses the embedded video URL to encrypt-ajax.php parameters
 * @param {cheerio} $ Cheerio object of the embedded video page
 * @param {string} id Id of the embedded video URL
 */
export async function generateEncryptAjaxParameters($, id) {

    const keys = await fetch_keys();
    iv = keys.iv;
    key = keys.key;
    second_key = keys.second_key;

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
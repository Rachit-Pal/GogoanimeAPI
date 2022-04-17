import axios from 'axios';
import CryptoJS from 'crypto-js'
import hexlify from 'binascii';

const ENCRYPTION_KEYS_URL = "https://raw.githubusercontent.com/justfoolingaround/animdl-provider-benchmarks/master/api/gogoanime.json"

let iv = null;
let key = null;
let second_key = null;

const fetch_keys = async() => {
    const response = await axios.get(ENCRYPTION_KEYS_URL);
    const res = response.data;
    return {
        iv: (res.iv),
        key: (res.key),
        second_key: (res.second_key)
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


    key = hexlify.hexlify(atob(id) + iv).substr(0, 32);
    // encrypt the key
    const encrypted_key = CryptoJS.AES['encrypt'](id, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
    });

    return 'id=' + encrypted_key + '&alias=' + id;
}
/**
 * Decrypts the encrypted-ajax.php response
 * @param {object} obj Response from the server
 */
export function decryptEncryptAjaxResponse(obj) {

    const decrypted = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(obj.data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv)
    }));
    return JSON.parse(decrypted);
}
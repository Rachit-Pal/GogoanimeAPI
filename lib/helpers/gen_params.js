import CryptoJS from 'crypto-js'

function generateEncryptAjaxParameters($, id) {
    const value6 = $('script[data-name=\x27ts\x27]').data('value');
    const value5 = $("[name='crypto']").attr('content');
    const value1 =
        CryptoJS.enc.Utf8.stringify(
            CryptoJS.AES.decrypt($('script[data-name=\x27crypto\x27]').data('value'),
                CryptoJS.enc.Utf8.parse(value6.toString() + value6.toString()), {
                    iv: CryptoJS.enc.Utf8.parse(value6)
                }));

    const value4 =
        CryptoJS.AES.decrypt(value5, CryptoJS.enc.Utf8.parse(value1), {
            iv: CryptoJS.enc.Utf8.parse(value6)
        });
    const value3 = CryptoJS.enc.Utf8.stringify(value4);
    const value2 = f_random(16);
    return 'id=' + CryptoJS.AES.encrypt(id, CryptoJS.enc.Utf8.parse(value1), {
        iv: CryptoJS.enc.Utf8.parse(value2)
    }).toString() + '&time=' + '00' + value2 + '00' + value3.substring(value3.indexOf('&'));
}
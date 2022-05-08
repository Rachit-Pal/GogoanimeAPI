import axios from 'axios'

const HOST = "https://sbplay2.com/sources43"
const PAYLOAD = (hex) => `4a71726a35734f5956737a687c7c${hex}7c7c54616b4a654b545a6343736d7c7c73747265616d7362/4d6161616b677836586172357c7c353735303433343937333735363836313436333836663432376337633338376136313736343437383761363733323330363637303763376337613731366637613530366634663435333436643730353337633763373337343732363536313664373336327c7c496136703944674a676248557c7c73747265616d7362`

const streamsbExtract = async(url) => {
    url = new URL(url)

    const id = url.href.split("/e/").pop()
    let arrBytes = new TextEncoder().encode(id)

    const res = await axios.get(`${HOST}/${PAYLOAD(toHexString(Array.from(arrBytes)))}`, { headers: { "watchsb": "streamsb" } })

    return res.data
}

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

(async() => {
    await streamsbExtract("https://sbplay2.xyz/e/3ynvtedj558c")

})()
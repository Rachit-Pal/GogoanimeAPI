// @NOTE: this api is still under development

import axios from 'axios'
import cheerio from 'cheerio'
import CryptoJS from 'crypto-js'


const BASE_URL = "https://gogoanime.film/"
const ajax_url = "https://ajax.gogo-load.com/"
const anime_info_url = "https://gogoanime.film/category/"
const anime_movies_path = "/anime-movies.html"
const popular_path = "/popular.html"
const new_season_path = "/new-season.html"
const search_path = "/search.html"
const popular_ongoing_url = `${ajax_url}ajax/page-recent-release-ongoing.html`;
const recent_release_url = `${ajax_url}ajax/page-recent-release.html`
const list_episodes_url = `${ajax_url}ajax/load-list-episode`
const seasons_url = "https://gogoanime.film/sub-category/"

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
const Referer = "https://gogoplay.io/"

const Genres = [
    "action",
    "adventure",
    "cars",
    "comedy",
    "crime",
    "dementia",
    "demons",
    "drama",
    "dub",
    "ecchi",
    "family",
    "fantasy",
    "game",
    "gourmet",
    "harem",
    "hentai",
    "historical",
    "horror",
    "josei",
    "kids",
    "magic",
    "martial-arts",
    "mecha",
    "military",
    "Mmusic",
    "mystery",
    "parody",
    "police",
    "psychological",
    "romance",
    "samurai",
    "school",
    "sci-fi",
    "seinen",
    "shoujo",
    "shoujo-ai",
    "shounen",
    "shounen-ai",
    "slice-of-Life",
    "space",
    "sports",
    "super-power",
    "supernatural",
    "suspense",
    "thriller",
    "vampire",
    "yaoi",
    "yuri",
]


// export const scrapeMp4 = async({ list = [], id }) => {
//     try {

//         const page = await axios.get(BASE_URL + '/' + id)
//         const $ = cheerio.load(page.data)

//         const url = $("li.dowloads > a").attr("href")
//         const downloadPage = await axios.post(download_url, {
//             captcha_v3: captcha_v3,
//             id: url.split("=")[1]
//         }, {
//             headers: {
//                 Referer: url
//             }
//         })
//         const $$ = cheerio.load(downloadPage.data)

//         $$("#content-download > div:nth-child(1) > div.dowload").each((i, el) => {
//             list.push({
//                 link: $$(el).find('a').attr('href'),
//                 quality: $$(el).find('a').text().replace(/(\r\n|\n|\r)/gm, "").replace("Download", '').replace("(", '').split('-')[0].trim(),
//                 referer: url
//             })
//         })
//         return list


//     } catch (err) {
//         console.log(err)
//         return { error: err }
//     }

// }

// scrapeMp4({ id: "boruto-naruto-next-generations-episode-218" })

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function f_random(length) {
    var i = length,
        str = '';
    while (i > 0x0) {
        i--,
        str += getRandomInt(0, 9);
    }
    return str;
}

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

export const scrapeMP4 = async({ id }) => {
    try {
        const epPage = await axios.get(BASE_URL + "/" + id);
        const $ = cheerio.load(epPage.data)

        const server = $('li.vidcdn > a').attr('data-video')

        const url = new URL("https:" + server);

        const goGoServerPage = await axios.get(url.href)
        const $$ = cheerio.load(goGoServerPage.data)

        const params = generateEncryptAjaxParameters($$, url.searchParams.get('id'))

        const res = await axios.get(`${url.protocol}//${url.hostname}/encrypt-ajax.php?${params}`, {
            headers: {
                'Referer': url.href,
                'User-Agent': USER_AGENT,
                'X-Requested-With': 'XMLHttpRequest'
            }
        })

        return {
            headers: {
                'Referer': Referer,
            },
            data: res.data.source,
        }


    } catch (err) {
        console.log(err)
        return { error: err }
    }
}


export const scrapeSearch = async({ list = [], keyw, page = 1 }) => {
    try {
        const searchPage = await axios.get(`${BASE_URL + search_path}?keyword=${keyw}&page=${page}`);
        const $ = cheerio.load(searchPage.data);

        $('div.last_episodes > ul > li').each((i, el) => {
            list.push({
                animeId: $(el).find('p.name > a').attr('href').split('/')[2],
                animeTitle: $(el).find('p.name > a').attr('title'),
                animeUrl: BASE_URL + "/" + $(el).find('p.name > a').attr('href'),
                animeImg: $(el).find('div > a > img').attr('src'),
                status: $(el).find('p.released').text().trim()
            });
        });

        return list;
    } catch (err) {
        console.log(err)
        return { error: err }
    }
};

export const scrapeRecentRelease = async({ list = [], page = 1, type = 1 }) => {
    try {

        const mainPage = await axios.get(`${recent_release_url}?page=${page}&type=${type}`)
        const $ = cheerio.load(mainPage.data)

        $('div.last_episodes.loaddub > ul > li').each((i, el) => {
            list.push({
                episodeId: $(el).find('p.name > a').attr('href').split('/')[1],
                animeTitle: $(el).find('p.name > a').attr('title'),
                episodeNum: $(el).find('p.episode').text().replace('Episode ', '').trim(),
                subOrDub: $(el).find('div > a > div').attr('class').replace('type ic-', ''),
                animeImg: $(el).find('div > a > img').attr('src'),
                episodeUrl: BASE_URL + "/" + $(el).find('p.name > a').attr('href')
            })
        })
        return list

    } catch (err) {
        console.log(err)
        return { error: err }
    }
}

export const scrapeNewSeason = async({ list = [], page = 1 }) => {
    try {
        const popularPage = await axios.get(`${BASE_URL+new_season_path}?page=${page}`)
        const $ = cheerio.load(popularPage.data)


        $('div.last_episodes > ul > li').each((i, el) => {

            list.push({
                animeId: $(el).find('p.name > a').attr('href').split('/')[2],
                animeTitle: $(el).find('p.name > a').attr('title'),
                animeImg: $(el).find('div > a > img').attr('src'),
                releasedDate: $(el).find('p.released').text().replace('Released: ', '').trim(),
                animeUrl: BASE_URL + "/" + $(el).find('p.name > a').attr('href')
            })
        })
        return list

    } catch (err) {
        console.log(err)
        return { error: err }
    }
}

export const scrapePopularAnime = async({ list = [], page = 1 }) => {
    try {
        const popularPage = await axios.get(`${BASE_URL+popular_path}?page=${page}`)
        const $ = cheerio.load(popularPage.data)


        $('div.last_episodes > ul > li').each((i, el) => {

            list.push({
                animeId: $(el).find('p.name > a').attr('href').split('/')[2],
                animeTitle: $(el).find('p.name > a').attr('title'),
                animeImg: $(el).find('div > a > img').attr('src'),
                releasedDate: $(el).find('p.released').text().replace('Released: ', '').trim(),
                animeUrl: BASE_URL + "/" + $(el).find('p.name > a').attr('href')
            })
        })
        return list

    } catch (err) {
        console.log(err)
        return { error: err }
    }

}


export const scrapeAnimeMovies = async({ list = [], aph = "", page = 1 }) => {
    try {
        const popularPage = await axios.get(`${BASE_URL+anime_movies_path}?aph=${aph.trim().toUpperCase()}&page=${page}`)
        const $ = cheerio.load(popularPage.data)


        $('div.last_episodes > ul > li').each((i, el) => {
            list.push({
                animeId: $(el).find('p.name > a').attr('href').split('/')[2],
                animeTitle: $(el).find('p.name > a').attr('title'),
                animeImg: $(el).find('div > a > img').attr('src'),
                releasedDate: $(el).find('p.released').text().replace('Released: ', '').trim(),
                animeUrl: BASE_URL + "/" + $(el).find('p.name > a').attr('href')
            })
        })
        return list

    } catch (err) {
        console.log(err)
        return { error: err }
    }
}

export const scrapeTopAiringAnime = async({ list = [], page = 1 }) => {
    try {

        const popular_page = await axios.get(`${popular_ongoing_url}?page=${page}`)
        const $ = cheerio.load(popular_page.data)

        $('div.added_series_body.popular > ul > li').each((i, el) => {
            var genres = []
            $(el).find('p.genres > a').each((i, el) => {
                genres.push($(el).attr('title'))
            })
            list.push({
                animeId: $(el).find('a:nth-child(1)').attr('href').split('/')[2],
                animeTitle: $(el).find('a:nth-child(1)').attr('title'),
                animeImg: $(el).find('a:nth-child(1) > div').attr('style').match('(https?:\/\/.*\.(?:png|jpg))')[0],
                latestEp: $(el).find('p:nth-child(4) > a').text().trim(),
                animeUrl: BASE_URL + "/" + $(el).find('a:nth-child(1)').attr('href'),
                genres: genres
            })
        })

        return list
    } catch (err) {
        console.log(err)
        return { error: err }
    }
}

export const scrapeGenre = async({ list = [], genre, page = 1 }) => {
    try {
        var genre = genre.trim().replace(/ /g, '-').toLowerCase()

        if (Genres.indexOf(genre) > -1) {
            const genrePage = await axios.get(`${BASE_URL}/genre/${genre}?page=${page}`)
            const $ = cheerio.load(genrePage.data)

            $('div.last_episodes > ul > li').each((i, elem) => {
                list.push({
                    animeId: $(elem).find('p.name > a').attr('href').split('/')[2],
                    animeTitle: $(elem).find('p.name > a').attr('title'),
                    animeImg: $(elem).find('div > a > img').attr('src'),
                    releasedDate: $(elem).find('p.released').text().replace('Released: ', '').trim(),
                    animeUrl: BASE_URL + "/" + $(elem).find('p.name > a').attr('href')
                })
            })
            return list

        }
        return { error: "Genre Not Found" }

    } catch (err) {
        console.log(err)
        return { error: err }
    }
}

// scrapeGenre({ genre: "cars", page: 1 }).then((res) => console.log(res))


/**
 * @param {string} id anime id.
 * @returns Resolves when the scraping is complete.
 * @example 
 * scrapeGoGoAnimeInfo({id: "naruto"})
 * .then((res) => console.log(res)) // => The anime information is returned in an Object.
 * .catch((err) => console.log(err))
 * 
 */
export const scrapeAnimeDetails = async({ id }) => {
    try {
        var genres = []
        var epList = []

        const animePageTest = await axios.get(`${anime_info_url}${id}`)
        const $ = cheerio.load(animePageTest.data)

        const animeTitle = $('div.anime_info_body_bg > h1').text()
        const animeImage = $('div.anime_info_body_bg > img').attr('src')
        const type = $('div.anime_info_body_bg > p:nth-child(4) > a').text()
        const desc = $('div.anime_info_body_bg > p:nth-child(5)').text().replace('Plot Summary: ', '')
        const releasedDate = $('div.anime_info_body_bg > p:nth-child(7)').text().replace('Released: ', '')
        const status = $('div.anime_info_body_bg > p:nth-child(8) > a').text()
        const otherName = $('div.anime_info_body_bg > p:nth-child(9)').text().replace('Other name: ', '').replace(/;/g, ',')

        $('div.anime_info_body_bg > p:nth-child(6) > a').each((i, elem) => {
            genres.push($(elem).attr('title').trim())
        })

        const ep_start = $("#episode_page > li").first().find('a').text().split('-')[0]
        const ep_end = $('#episode_page > li').last().find('a').text().split('-')[1]
        const movie_id = $('#movie_id').attr('value')
        const alias = $('#alias_anime').attr('value')

        const html = await axios.get(`${list_episodes_url}?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`)
        const $$ = cheerio.load(html.data);

        $$("#episode_related > li").each((i, el) => {
            epList.push({
                episodeId: $(el).find("a").attr("href").split('/')[1],
                episodeNum: $(el).find(`div.name`).text().replace('EP ', ''),
                episodeUrl: BASE_URL + $(el).find(`a`).attr('href').trim()
            })
        })

        return {
            animeTitle: animeTitle.toString(),
            type: type.toString(),
            releasedDate: releasedDate.toString(),
            status: status.toString(),
            genres: genres,
            otherNames: otherName,
            synopsis: desc.toString(),
            animeImg: animeImage.toString(),
            totalEpisodes: ep_end,
            episodesList: epList
        }




    } catch (err) {
        console.log(err)
        return { error: err }
    }
}

export const scrapeSeason = async({ list = [], season, page = 1 }) => {
    try {
        const season_page = await axios.get(`${seasons_url}${season}?page=${page}`)
        const $ = cheerio.load(season_page.data)

        $('div.last_episodes > ul > li').each((i, el) => {
            list.push({
                animeId: $(el).find('div > a').attr('href').split('/')[2],
                animeTitle: $(el).find('div > a').attr('title'),
                animeImg: $(el).find('div > a > img').attr('src'),
                animeUrl: BASE_URL + "/" + $(el).find('div > a').attr('href'),
            })
        })

        return list
    } catch (err) {
        console.log(err)
        return { error: err }
    }
}

// scrapeAnimeDetails({ id: "naruto" }).then((res) => console.log(res))
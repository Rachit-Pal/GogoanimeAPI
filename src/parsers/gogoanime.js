import axios from 'axios'
import cheerio from 'cheerio'
import CryptoJS from 'crypto-js'

import { f_random } from '../helpers/random.js'
import { Constants } from '../utils/C.js'

export class Gogoanime {
    static BASE_URL = "https://gogoanime.film/"
    static ajax_url = "https://ajax.gogo-load.com/"
    static anime_info_url = "https://gogoanime.film/category/"
    static anime_movies_path = "/anime-movies.html"
    static popular_path = "/popular.html"
    static new_season_path = "/new-season.html"
    static search_path = "/search.html"
    static popular_ongoing_url = `${this.ajax_url}ajax/page-recent-release-ongoing.html`;
    static recent_release_url = `${this.ajax_url}ajax/page-recent-release.html`
    static list_episodes_url = `${this.ajax_url}ajax/load-list-episode`
    static seasons_url = "https://gogoanime.film/sub-category/"
    static GOGO_Referer = "https://gogoplay.io/"


    static parseData($) {
        const list = [];

        $('div.last_episodes > ul > li').each((i, el) => {
            list.push({
                animeId: $(el).find('p.name > a').attr('href').split('/')[2],
                animeTitle: $(el).find('p.name > a').attr('title'),
                animeImg: $(el).find('div > a > img').attr('src'),
                releasedDate: $(el).find('p.released').text().replace('Released: ', '').trim(),
                animeUrl: this.BASE_URL + "/" + $(el).find('p.name > a').attr('href')
            })
        })
        return list
    }

    static generateEncryptAjaxParameters($, id) {
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

    static scrapeMP4 = async({ id }) => {
        var m3u8Url = '';
        try {
            const epPage = await axios.get(BASE_URL + "/" + id);
            const $ = cheerio.load(epPage.data)

            const server = $('li.vidcdn > a').attr('data-video')

            const goGoServerPage = await axios.get("https:" + server)
            const $$ = cheerio.load(goGoServerPage.data)

            const data = $$('body > div > div').html()
            const matcher = data.match('(http|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?')[0]
            if (matcher.includes("m3u8") || matcher.includes("googlevideo")) {
                m3u8Url = matcher
            }
            return {
                m3u8: m3u8Url,
                referer: "https:" + server,
            }

        } catch (err) {
            console.log(err)
            return { error: err }
        }
    }


    static scrapeSearch = async({ keyw, page = 1 }) => {
        try {
            const searchPage = await axios.get(`${this.BASE_URL + this.search_path}?keyword=${keyw}&page=${page}`);
            const $ = cheerio.load(searchPage.data);

            return [...this.parseData($)]
        } catch (err) {
            console.log(err)
            return { error: err }
        }
    };

    static scrapeRecentRelease = async({ page = 1, type = 1 }) => {
        try {

            const mainPage = await axios.get(`${this.recent_release_url}?page=${page}&type=${type}`)
            const $ = cheerio.load(mainPage.data)

            let list = [];

            $('div.last_episodes.loaddub > ul > li').each((i, el) => {
                list.push({
                    episodeId: $(el).find('p.name > a').attr('href').split('/')[1],
                    animeTitle: $(el).find('p.name > a').attr('title'),
                    episodeNum: $(el).find('p.episode').text().replace('Episode ', '').trim(),
                    subOrDub: $(el).find('div > a > div').attr('class').replace('type ic-', ''),
                    animeImg: $(el).find('div > a > img').attr('src'),
                    episodeUrl: this.BASE_URL + "/" + $(el).find('p.name > a').attr('href')
                })
            })
            return list

        } catch (err) {
            console.log(err)
            return { error: err }
        }
    }

    static scrapeNewSeason = async({ page = 1 }) => {
        try {
            const popularPage = await axios.get(`${this.BASE_URL + this.new_season_path}?page=${page}`)
            const $ = cheerio.load(popularPage.data)

            return [...this.parseData($)];

        } catch (err) {
            console.log(err)
            return { error: err }
        }
    }

    static scrapePopularAnime = async({ page = 1 }) => {
        try {
            const popularPage = await axios.get(`${this.BASE_URL + this.popular_path}?page=${page}`)
            const $ = cheerio.load(popularPage.data)

            return [...this.parseData($)];

        } catch (err) {
            console.log(err)
            return { error: err }
        }

    }

    static scrapeAnimeMovies = async({ aph = "", page = 1 }) => {
        try {
            const popularPage = await axios.get(`${this.BASE_URL + this.anime_movies_path}?aph=${aph.trim().toUpperCase()}&page=${page}`)
            const $ = cheerio.load(popularPage.data)

            return [...this.parseData($)];

        } catch (err) {
            console.log(err)
            return { error: err }
        }
    }

    static scrapeTopAiringAnime = async({ page = 1 }) => {
        try {

            const popular_page = await axios.get(`${this.popular_ongoing_url}?page=${page}`)
            const $ = cheerio.load(popular_page.data)

            let list = [];

            $('div.added_series_body.popular > ul > li').each((i, el) => {
                let genres = []
                $(el).find('p.genres > a').each((i, el) => {
                    genres.push($(el).attr('title'))
                })
                list.push({
                    animeId: $(el).find('a:nth-child(1)').attr('href').split('/')[2],
                    animeTitle: $(el).find('a:nth-child(1)').attr('title'),
                    animeImg: $(el).find('a:nth-child(1) > div').attr('style').match('(https?:\/\/.*\.(?:png|jpg))')[0],
                    latestEp: $(el).find('p:nth-child(4) > a').text().trim(),
                    animeUrl: this.BASE_URL + "/" + $(el).find('a:nth-child(1)').attr('href'),
                    genres: genres
                })
            })

            return list
        } catch (err) {
            console.log(err)
            return { error: err }
        }
    }

    static scrapeGenre = async({ genre, page = 1 }) => {
        try {
            if (!genre) return { error: "Genre is required" };

            genre.trim().replace(/ /g, '-').toLowerCase();

            if (Constants.Genres.indexOf(genre) === -1) return { error: "Genre Not Found" }

            const genrePage = await axios.get(`${this.BASE_URL}/genre/${genre}?page=${page}`)
            const $ = cheerio.load(genrePage.data)

            return [...this.parseData($)];

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
     * .then((res) => console.log(res)) // => {...}
     * .catch((err) => console.log(err))
     * 
     */
    static scrapeAnimeDetails = async({ id }) => {
        try {
            var genres = []
            var epList = []

            const animePageTest = await axios.get(`${this.anime_info_url}${id}`)
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

            const html = await axios.get(`${this.list_episodes_url}?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`)
            const $$ = cheerio.load(html.data);

            $$("#episode_related > li").each((i, el) => {
                epList.push({
                    episodeId: $(el).find("a").attr("href").split('/')[1],
                    episodeNum: $(el).find(`div.name`).text().replace('EP ', ''),
                    episodeUrl: this.BASE_URL + $(el).find(`a`).attr('href').trim()
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

    static scrapeSeason = async({ season, page = 1, year = new Date().getFullYear() }) => {
        try {
            if (!season) return { error: "Season is required" };
            season.trim().toLowerCase();
            if (Constants.Seasons.indexOf(season) === -1) return { error: "Season Not Found" };

            const season_page = await axios.get(`${this.seasons_url}${season}-${year}-anime?page=${page}`)
            const $ = cheerio.load(season_page.data)

            return [...this.parseData($)];
        } catch (err) {
            console.log(err)
            return { error: err }
        }
    }

}

//Gogoanime.scrapeSeason({ season: "winter" }).then((res) => console.log(res))
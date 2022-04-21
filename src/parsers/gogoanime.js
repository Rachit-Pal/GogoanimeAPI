import axios from 'axios'
import cheerio from 'cheerio'
import CryptoJS from 'crypto-js'

import { f_random } from '../utils/helpers.js'
import { Constants } from '../utils/C.js'

export class Gogoanime {
    static BASE_URL = "https://gogoanime.news"
    static BASE_URL2 = "https://gogoanime.film"
    static ajax_url = "https://ajax.gogo-load.com/"
    static anime_info_url = (url) => `${url}/category/`
    static anime_movies_path = "/anime-movies.html"
    static popular_path = "/popular.html"
    static current_season_path = "/new-season.html"
    static search_path = "/search.html"
    static popular_ongoing_url = `${this.ajax_url}ajax/page-recent-release-ongoing.html`;
    static recent_release_path = "/recent-release-anime"
    static list_episodes_url = `${this.ajax_url}ajax/load-list-episode`
    static seasons_url = "/season"
    static GOGO_Referer = "https://gogoplay.io/"


    static parseData($, isSearch = false, isDefault = true, isDefault2 = false, selector = null) {
        if (isSearch) {
            const news = [];

            $(`${isDefault ? "#wrapper_bg > section > div:nth-child(2) > div.page_content > ul > li" : "div.related_right.center_col1 > div > ul > li.news-items"}`).each((i, el) => {
                const articleId = $(el).find("div.cover > div.thumbnails-request > a").attr("href").split("/")[2];
                const type = $(el).find("div.cover > div.thumbnails-request > div.request_top > span").text();
                const title = $(el).find("div.title > a").attr("title");
                const link = this.BASE_URL + $(el).find("div.cover > div.thumbnails-request > a").attr("href");
                const img = $(el).find("div.cover > div.thumbnails-request > a > img").attr("data-original");
                const date = $(el).find("div.timess").text().trim();

                news.push({
                    articleId: articleId,
                    type: type,
                    title: title,
                    link: link,
                    img: img,
                    date: date,
                });
            })

            return news;
        }

        const animeList = [];
        $(`${(selector) ? selector : isDefault ? "div.last_episodes > div > ul > li" : (isDefault2) ? "div.last_episodes > ul > li" : "#wrapper_bg > section > div > div.page_content > ul > li"}`).each((i, el) => {
            animeList.push({
                animeId: $(el).find(`${isDefault2 ? "p.name > a" : "div.name > a"}`).attr('href').split('/')[2],
                animeTitle: $(el).find(`${isDefault2 ? "p.name > a" : "div.name > a"}`).attr('title'),
                animeImg: $(el).find('div.img > a > img').attr(`${isDefault2 ? "src":"data-original"}`),
                releasedDate: $(el).find('p.released').text().replace('Released: ', '').trim(),
                animeUrl: this.BASE_URL + $(el).find(`${isDefault2 ? "p.name > a" : "div.name > a"}`).attr('href')
            })
        })
        return animeList
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
            const epPage = await axios.get(this.BASE_URL2 + "/" + id);
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
            return { error: err }
        }
    }


    static scrapeSearch = async({ keyw, page = 1 }) => {
        try {
            if (!keyw) return { error: "Keyword is empty" }

            const searchPage = await axios.get(`${this.BASE_URL + this.search_path}?keyword=${keyw}&page=${page}`);
            const $search = cheerio.load(searchPage.data);

            return {
                anime_results: [...this.parseData($search, false, true)],
                news_results: [...this.parseData($search, true)]
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) return { error: "Page not found :(" }
                else return { error: err.response.statusText }
            }
            return { error: err }
        }
    };

    static scrapeRecentRelease = async({ page = 1 }) => {
        try {

            const mainPage = await axios.get(`${ this.BASE_URL + this.recent_release_path}?page=${page}`)
            const $ = cheerio.load(mainPage.data)

            let list = [];
            $('#wrapper_bg > section > div > div.page_content > ul > li').each((i, el) => {
                list.push({
                    animeId: $(el).find('div.name > a').attr('href').split('/')[2],
                    animeTitle: $(el).find('div.name > a').attr('title'),
                    episodeNum: $(el).find('p.released').text().replace('Episode ', '').trim(),
                    animeImg: $(el).find('div.img > a > img').attr('data-original'),
                    animeUrl: this.BASE_URL + $(el).find('div.name > a').attr('href')
                })
            })
            return list

        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) return { error: "Page not found :(" }
                else return { error: err.response.statusText }
            }
            return { error: err }
        }
    }

    static scrapeCurrentSeason = async({ page = 1 }) => {
        try {
            const main_page = await axios.get(`${this.BASE_URL}`)
            const $ = cheerio.load(main_page.data)

            let current_season = $("#wrapper_bg > section > section:nth-child(12) > div > div.anime_name.icon_1 > h2").text().trim();
            for (let season of Constants.Seasons) {
                if (current_season.toLowerCase().includes(season)) {
                    current_season = season;
                    break;
                }
            }

            if (current_season) return await this.scrapeSeason({ season: current_season, page: page })

            return { error: "Can't find season :(" }


        } catch (err) {
            console.log(err)
            return { error: err }
        }
    }

    static scrapePopularAnime = async({ page = 1 }) => {
        try {
            const popularPage = await axios.get(`${this.BASE_URL2 + this.popular_path}?page=${page}`)
            const $ = cheerio.load(popularPage.data)

            return [...this.parseData($, false, false, true)];

        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) return { error: "Page not found :(" }
                else return { error: err.response.statusText }
            }
            return { error: err }
        }

    }


    static scrapeAnimeMovies = async({ aph = "", page = 1 }) => {
        try {
            const popularPage = await axios.get(`${this.BASE_URL2 + this.anime_movies_path}?aph=${aph.trim().toUpperCase()}&page=${page}`)
            const $ = cheerio.load(popularPage.data)

            return [...this.parseData($, false, false, true)];

        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) return { error: "Page not found :(" }
                else return { error: err.response.statusText }
            }
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
                    genres: genres,
                    animeImg: $(el).find('a:nth-child(1) > div').attr('style').match('(https?:\/\/.*\.(?:png|jpg))')[0],
                    latestEp: $(el).find('p:nth-child(4) > a').text().trim(),
                    animeUrl: this.BASE_URL + $(el).find('a:nth-child(1)').attr('href'),
                })
            })

            return list
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) return { error: "Page not found :(" }
                else return { error: err.response.statusText }
            }
            return { error: err }
        }
    }

    static scrapeGenre = async({ genre, page = 1 }) => {
        try {
            if (!genre) return { error: "Genre is required" };

            genre.trim().replace(/ /g, '-').toLowerCase();

            if (Constants.Genres.indexOf(genre) === -1) return { error: "Genre Not Found" }

            const genrePage = await axios.get(`${this.BASE_URL2}/genre/${genre}?page=${page}`)
            const $ = cheerio.load(genrePage.data)

            return [...this.parseData($, false, false, true)];

        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) return { error: "Page not found :(" }
                else return { error: err.response.statusText }
            }
            return { error: err }
        }
    }


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

            const animePageTest = await axios.get(`${this.anime_info_url(this.BASE_URL)}${id}`)
            const $ = cheerio.load(animePageTest.data)

            const animeTitle = $('div.anime_info_body_bg > h1').text()
            const animeImage = $('div.anime_info_body > div > img').attr('data-original')
            const type = $('div.anime_info_body > div > p:nth-child(3)').text().replace('Type: ', '').trim()
            const desc = $('div.anime_info_body > div > p:nth-child(4)').text().replace('Plot Summary: ', '')
            const releasedDate = $(' div.anime_info_body > div > p:nth-child(6)').text().replace('Released: ', '')
            const status = $('div.anime_info_body > div > p:nth-child(7)').text().replace('Status: ', '').trim()
            const otherName = ($("div.anime_info_body > div > p:nth-child(8) > a").html()) ? [] : $('div.anime_info_body > div > p:nth-child(8)').text().replace('Other name: ', '').includes(';') ?
                $('div.anime_info_body > div > p:nth-child(8)').text().replace('Other name: ', '').split(';').map(el => el.trim()) :
                $('div.anime_info_body > div > p:nth-child(8)').text().replace('Other name: ', '').split(',').map(el => el.trim());

            const genres = $('div.anime_info_body > div > p:nth-child(5)').text().replace('Genre: ', '').split(', ').map(genre => genre.trim())

            const relatedArticles = [...this.parseData($, true, false)]

            const relatedAnime = [...this.parseData($, false, false, false, "section.content_right.block_mb > div:nth-child(2) > div > div.related_right.center_col1 > div > ul > li")]

            const charactersAndVoiceActors = [];

            $("div.anime_info_body.list_characters_voice > ul > li").each((i, el) => {
                const characterSelector = $(el).find('div.left')
                const voiceActorSelector = $(el).find('div.right')

                const character = {
                    characterId: characterSelector.find('div.bottom > p.title > a').attr('href').split('/')[2],
                    characterName: characterSelector.find('div.bottom > p.title > a').text().trim(),
                    characterUrl: this.BASE_URL + characterSelector.find('div.bottom > p.title > a').attr('href'),
                    characterImg: characterSelector.find('div.picture > div > a > img').attr('data-original'),
                    characterRole: characterSelector.find('div.bottom > p.roles').text().trim(),
                }
                const voiceActor = {
                    voiceActorId: voiceActorSelector.find('div.bottom > p.title > a').attr('href').split('/')[2],
                    voiceActorName: voiceActorSelector.find('div.bottom > p.title > a').text().trim(),
                    voiceActorUrl: this.BASE_URL + voiceActorSelector.find('div.bottom > p.title > a').attr('href'),
                    voiceActorImg: voiceActorSelector.find('div.picture > div > a > img').attr('data-original'),
                    voiceActorRole: voiceActorSelector.find('div.bottom > p.roles').text().trim(),
                }

                charactersAndVoiceActors.push({ character, voiceActor })
            })

            return {
                animeId: id,
                animeTitle: animeTitle.toString(),
                type: type.toString(),
                status: status.toString(),
                genres: genres,
                releasedDate: releasedDate.toString(),
                synopsis: desc.toString(),
                otherNames: otherName,
                animeImg: animeImage.toString(),
                charactersAndVoiceActors,
                relatedArticles: relatedArticles,
                relatedAnime: relatedAnime,
            }




        } catch (err) {
            return { error: err }
        }
    }

    static scrapeEpisodes = async({ animeId }) => {
        try {
            const animePage = await axios.get(`${this.anime_info_url(this.BASE_URL2)}${animeId}`)
            const $ = cheerio.load(animePage.data)

            const ep_start = $("#episode_page > li").first().find('a').text().split('-')[0]
            const ep_end = $('#episode_page > li').last().find('a').text().split('-')[1]
            const movie_id = $('#movie_id').attr('value')
            const alias = $('#alias_anime').attr('value')

            const html = await axios.get(`${this.list_episodes_url}?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`)
            const $$ = cheerio.load(html.data);

            let list = [];

            $$("#episode_related > li").each((i, el) => {
                list.push({
                    episodeId: $(el).find("a").attr("href").split('/')[1],
                    episodeNum: $(el).find(`div.name`).text().replace('EP ', ''),
                    episodeUrl: this.BASE_URL + $(el).find(`a`).attr('href').trim()
                })
            })

            return {
                totalEpisodes: ep_end,
                episodesList: list
            };

        } catch (err) {
            console.log(err)
            return { error: "something went wrong!!" }
        }
    }

    static scrapeSeason = async({ season, page = 1, year = new Date().getFullYear() }) => {
        try {
            if (!season) return { error: "Season is required" };
            season.trim().toLowerCase();
            if (Constants.Seasons.indexOf(season) === -1) return { error: "Season Not Found" };

            const season_page = await axios.get(`${this.BASE_URL + this.seasons_url}/${season}-${year}-anime?page=${page}`)

            const $ = cheerio.load(season_page.data)

            return [...this.parseData($, false, false)];
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) return { error: "Page not found :(" }
                else return { error: err.response.statusText }
            }
            return { error: `'${season} ${year}' so you have decided to travel to the future ;)!!` }
        }
    }

}

//Gogoanime.scrapeSeason({ season: "winter" }).then((res) => console.log(res))
import cheerio from 'cheerio';
import axios from 'axios';

import { Constants } from '../utils/C.js';


export class Animekisa {
    static MAIN_URL = 'https://animekisa.in/';
    static ajax_path = `${this.MAIN_URL}ajax/list/`
    static animelist_path = 'animelist';
    static genre_path = 'genre';
    static season_path = 'season';
    static search_path = 'filter';

    static parseData($) {
        const data = [];

        $('.film_list-wrap > .flw-item').each((i, el) => {
            const animeId = $(el).find('.film-detail.film-detail-fix > h3 > a').attr('href').split('/')[4].split('-episode')[0];
            const animeTitle = $(el).find('.film-detail.film-detail-fix > h3 > a').text().trim();
            const subOrDub = (typeof $(el).find('.film-poster > .pick.film-poster-quality') !== 'undefined') ? $(el).find('.film-poster > .pick.film-poster-quality').text().trim() : "SUB";
            const animeUrl = $(el).find('.film-detail.film-detail-fix > h3 > a').attr('href').split('-episode')[0].replace("/watch/", "/anime/");
            const animeImg = $(el).find('.film-poster > img').attr('data-src');
            const type = $(el).find('.film-detail.film-detail-fix > div > span:nth-child(3)').text().trim();
            const released = $(el).find('.film-detail.film-detail-fix > div > span:nth-child(1)').text().trim();
            const latestEpisode = $(el).find('.film-detail.film-detail-fix > .fd-infor > span:nth-child(4)').text().trim();
            const episodeId = $(el).find('.film-detail.film-detail-fix > h3 > a').attr('href').split('/')[4];
            const episodeUrl = $(el).find('.film-detail.film-detail-fix > h3 > a').attr('href');

            data.push({
                animeId: animeId,
                animeTitle: animeTitle,
                subOrDub: subOrDub,
                animeUrl: animeUrl,
                animeImg: animeImg,
                type: type,
                released: released,
                latestEpisode: latestEpisode,
                episodeId: episodeId,
                episodeUrl: episodeUrl,
            });
        })

        return data;
    }

    static scrapeSearch = async({ status = "all", sort = "default", keyword = "", page = 1, type = [], genre = [], season = [], lang = [], country = [], years = [] }) => {
        const symbl = "%5B%5D";

        try {
            const genres = Array.isArray(genre) ? genre.join(`&genres${symbl}=`) : genre;
            const types = Array.isArray(type) ? type.join(`&type${symbl}=`) : type;
            const seasons = Array.isArray(season) ? season.join(`&season${symbl}=`) : season;
            const language = Array.isArray(lang) ? lang.join(`&language${symbl}=`) : lang;
            const countries = Array.isArray(country) ? country.join(`&countries${symbl}=`) : country;
            const year = Array.isArray(years) ? years.join(`&year${symbl}=`) : years;

            const url = `${this.MAIN_URL + this.search_path}?type${symbl}=${types}&season${symbl}=${seasons}&status=${status}&language${symbl}=${language}&keyword=${keyword}&sort=${sort}&countries${symbl}=${countries}&genres=${genres}&year${symbl}=${year}&page=${page}`;

            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            return [...this.parseData($)];

        } catch (err) {
            return { error: err };
        }
    }

    static scrapeType = async({ type, page = 1 }) => {
        try {
            type.toLowerCase();
            if (Constants.Types.indexOf(type) === -1) return { error: `${type} is not a valid type! :(` };

            const url = `${this.MAIN_URL + type}?page=${page}`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            return [...this.parseData($)];

        } catch (err) {
            return { error: err };
        }
    }

    static scrapeSeason = async({ season, page = 1 }) => {
        try {
            if (!season) return { error: "Season is required" };
            season.trim().toLowerCase();

            if (Constants.Seasons.indexOf(season) === -1) return { error: `${season} is not a valid season! :(` };

            const url = `${this.MAIN_URL + this.season_path}/${season}?page=${page}`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            return [...this.parseData($)];

        } catch (err) {
            return { error: err };
        }
    }

    static scrapeGenre = async({ genre, page = 1 }) => {
        try {
            if (!genre) return { error: "Genre is required" };
            genre.trim().replace(/ /g, '-').toLowerCase();

            if (Constants.Genres.indexOf(genre) === -1) return { error: `${genre} is not a valid genre! :(` };

            const url = `${this.MAIN_URL}${this.genre_path}/${genre}?page=${page}`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            return [...this.parseData($)];

        } catch (err) {
            return { error: err };
        }
    }

    static scrapeSortedAnimeList = async({ type = "all", sort, page = 1 }) => {
        try {
            if (!sort) return { error: "Sort is required" };
            if (Constants.Sorts.indexOf(sort) === -1) return { error: `${sort} is not a valid sort! :(` };

            if (sort === "views") {
                const url = `${this.ajax_path}/${sort}?type=${type}&page=${page}`;
                const response = await axios.get(url);
                const $ = cheerio.load(response.data);

                let data = [];

                $('div.block_area-content.block_area-list.film_list.film_list-grid > div').each((i, el) => {

                    const animeId = $(el).find('div.film-poster > a').attr('href').split('/')[4];
                    const animeTitle = $(el).find('div.detail > h3 > a').text().trim();
                    const subOrDub = (typeof $(el).find('.film-poster > .pick.film-poster-quality') !== 'undefined') ? $(el).find('.film-poster > .pick.film-poster-quality').text().trim() : "SUB";
                    const animeUrl = $(el).find('div.film-poster > a').attr('href');
                    const animeImg = $(el).find('.film-poster > a > img').attr('data-src');
                    const type = $(el).find('div.detail > div.links > span.type').text().trim();
                    const released = $(el).find('div.detail > div.links > span.year').text().trim();
                    const latestEpisode = $(el).find('div.detail > div.links > strong > a').text().trim();
                    const episodeId = $(el).find('div.detail > div.links > strong > a').attr('href').split('/')[4];
                    const episodeUrl = $(el).find('div.detail > div.links > strong > a').attr('href');

                    let genres = [];

                    $(el).find("div.detail > div.genres > a").each((i, el) => {
                        genres.push($(el).text().trim());
                    });

                    data.push({
                        animeId: animeId,
                        animeTitle: animeTitle,
                        subOrDub: subOrDub,
                        animeUrl: animeUrl,
                        animeImg: animeImg,
                        type: type,
                        genres: genres,
                        released: released,
                        latestEpisode: latestEpisode,
                        episodeId: episodeId,
                        episodeUrl: episodeUrl,
                    });
                })

                return data;

            }

            const url = `${this.ajax_path}/${sort}?type=${type}&page=${page}`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            return [...this.parseData($)];


        } catch (err) {
            return { error: err };
        }
    }

    static scrapeM3U8 = async(url) => {

        const headers = {
            'User-Agent': Constants.USER_AGENT,
            'Referer': MAIN_URL,
        }

        const res = await axios.get(url, { headers: headers });
        const $ = cheerio.load(res.data);

        let token = new RegExp("(?<=window.skey = )'.*?'").exec($.html())[0];
        if (!token) return { error: "Token not found! can't fetch m3u8." };

        token = token.trim('\'');

        const media = await axios.get(`${url.replace("/e/", "/info/")}?skey=${token}`, { headers: headers })
        const sources = JSON.parse(JSON.stringify(media.data));

        return {
            headers: {
                Referer: MAIN_URL,
            },
            data: sources.media.sources
        };
    }


}

//Animekisa.scrapeGenre({ genre: "action", page: 1 }).then((res) => console.log(res));
//Animekisa.scrapeSearch({ isDub: false, isSub: false }).then((res) => console.log(res));
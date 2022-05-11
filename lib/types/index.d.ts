export type AnimeList = {
  animeId: string | undefined;
  animeTitle: string | undefined;
  animeUrl: string | undefined;
  animeImg: string | undefined;
  status: string | undefined;
};

export type Episode = {
  episodeId: string | undefined;
  episodeNum: number | string | undefined;
  episodeUrl: string | undefined;
};

export type Anime = {
  animeId: string | undefined;
  type: string | undefined;
  animeTitle: string | undefined;
  animeImg: string | undefined;
  status: string | undefined;
  genres: string[] | undefined;
  otherNames: string[] | string | undefined;
  synopsis: string | undefined;
  totalEpisodes: number | string | undefined;
  episodesList: Episode[] | undefined;
};

/**
 * @typedef {Object} AnimeList
 * @param {Anime[]} list out put of the anime list
 * @param {string} keyw query keyword to search
 * @param {string} page current page
 */
export declare function scrapeSearch(list: AnimeList[] = [], keyw: string, page: number = 1): Promise<AnimeList[]>;

/**
 *
 * @param animeId anime id to scrape the anime info
 * @returns {Anime} anime info object
 */
export declare function scrapeAnimeDetails(animeId: string): Promise<Anime>;

// TODO: add more functions

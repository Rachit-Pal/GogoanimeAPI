export type AnimeList = {
  animeId?: string;
  animeTitle?: string;
  animeUrl?: string;
  animeImg?: string;
  status?: string;
};

export type Episode = {
  episodeId?: string;
  episodeNum?: number | string;
  episodeUrl?: string;
};

export type Anime = {
  animeId?: string;
  type?: string;
  animeTitle?: string;
  animeImg?: string;
  status?: string;
  genres?: string[];
  otherNames?: string[] | string;
  synopsis?: string;
  totalEpisodes?: number | string;
  episodesList?: Episode[];
};

/**
 * @typedef {Object} AnimeList
 * @param {Anime[]} list out put of the anime list
 * @param {string} keyw query keyword to search
 * @param {string} page current page
 */
export declare function scrapeSearch(list: ?AnimeList[], keyw: string, page: number = 1): Promise<AnimeList[]>;

/**
 *
 * @param animeId anime id to scrape the anime info
 * @returns {Anime} anime info object
 */
export declare function scrapeAnimeDetails(animeId: string): Promise<Anime>;

// TODO: add more functions

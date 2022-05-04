<p align="center">
  <a href="https://github.com/riimuru/gogoanime">
    <img src="images/image1.png" alt="Logo" width="85" height="85">
  </a>

  <h3 align="center">GogoAnime API</h3>

  <p align="center">
    <samp>A free anime streaming restful API serving anime from <a href="https://www1.gogoanime.cm/">GogoAnime</a></samp>
    <br />
    <a href="#available-routes"><strong>Explore the api »</strong></a>
    <br />
    <br />
    <a href="https://github.com/riimuru/gogoanime/issues">Bug report</a>
    ·
    <a href="https://github.com/riimuru/gogoanime/issues">Feature request</a>
  </p>
</p>

### Note: You might experience some delays or issues using [my hosted api on heroku](https://gogoanime.herokuapp.com/), so feel free to host it on your own site.

# Guide

Below you'll find examples using [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) but you can use any other http library out there.

## Available Routes

- [Get Recent Episodes](#get-recent-episodes)
- [Get Popular Anime](#get-popular-anime)
- [Get Anime Search](#get-anime-search)
- [Get Anime Movies](#get-anime-movies)
- [Get Top Airing](#get-top-airing)
- [Get Anime Genres](#get-anime-genres)
- [Get Anime Details](#get-anime-details)
- [Get Streaming URLs](#get-streaming-urls)

## Get Recent Episodes

| Parameter    | Description                                                                                                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type` (int) | (optional) by default the type is 1. **type 1: japanese with subtitle. type 2: english dub with no subtitles. type 3: chinese with english subtitles.** Example: `GET /recent-release?type=2` |
| `page` (int) | **type 1 page limit: [1-331]. type 2: [1-139]. type 3: [1-22].**                                                                                                                              |

```js
fetch("https://gogoanime.herokuapp.com/recent-release")
  .then((response) => response.json())
  .then((animelist) => console.log(animelist));
```

Output >>

```json
[
    {
        "episodeId": "deep-insanity-the-lost-child-episode-9",
        "animeTitle": "Deep Insanity: The Lost Child",
        "episodeNum": "9",
        "subOrDub": "SUB",
        "animeImg": "https://cdnimg.xyz/cover/deep-insanity-the-lost-child.png",
        "episodeUrl": "https://www1.gogoanime.cm//deep-insanity-the-lost-child-episode-9"
    },
    {...},
    ...
]
```

## Get Popular Anime

| Parameter    | Description         |
| ------------ | ------------------- |
| `page` (int) | page limit: [1-504] |

```js
fetch("https://gogoanime.herokuapp.com/popular")
  .then((response) => response.json())
  .then((animelist) => console.log(animelist));
```

Output >>

```json
[
    {
        "animeId": "boruto-naruto-next-generations",
        "animeTitle": "Boruto: Naruto Next Generations",
        "animeImg": "https://gogocdn.net/cover/boruto-naruto-next-generations.png",
        "releasedDate": "2017",
        "animeUrl": "https://www1.gogoanime.cm//category/boruto-naruto-next-generations"
    },
    {...},
    ...
]
```

## Get Anime Search

| Parameter       | Description         |
| --------------- | ------------------- |
| `keyw` (string) | anime title         |
| `page` (int)    | page limit may vary |

```js
fetch("https://gogoanime.herokuapp.com/search?keyw=naruto")
  .then((response) => response.json())
  .then((animelist) => console.log(animelist));
```

Output >>

```json
[
    {
        "animeId": "naruto",
        "animeTitle": "Naruto",
        "animeUrl": "https://www1.gogoanime.cm//category/naruto",
        "animeImg": "https://gogocdn.net/images/anime/N/naruto.jpg",
        "status": "Released: 2002"
    },
    {...},
    ...
]
```

## Get Anime Movies

| Parameter      | Description                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `aph` (string) | (optional) by default the movie list is random. **values are from [A-Z]. And 0 is Ascending order with page limit of [1-89].** |
| `page` (int)   | page limit may vary                                                                                                            |

```js
fetch("https://gogoanime.herokuapp.com/anime-movies")
  .then((response) => response.json())
  .then((animelist) => console.log(animelist));
```

Output >>

```json
[
	{
		"animeId": "tenchi-muyou-manatsu-no-eve",
		"animeTitle": "Tenchi Muyou! Manatsu no Eve",
		"animeImg": "https://gogocdn.net/cover/tenchi-muyou-manatsu-no-eve.png",
		"releasedDate": "1997",
		"animeUrl": "https://www1.gogoanime.cm//category/tenchi-muyou-manatsu-no-eve"
	},
    {...},
    ...
]
```

## Get Top Airing

| Parameter    | Description       |
| ------------ | ----------------- |
| `page` (int) | page limit [1-26] |

```js
fetch("https://gogoanime.herokuapp.com/top-airing")
  .then((response) => response.json())
  .then((animelist) => console.log(animelist));
```

Output >>

```json
[
	{
		"animeId": "sekai-saikou-no-ansatsusha-isekai-kizoku-ni-tensei-suru",
		"animeTitle": "Sekai Saikou no Ansatsusha, Isekai Kizoku ni Tensei suru",
		"animeImg": "https://cdnimg.xyz/cover/sekai-saikou-no-ansatsusha-isekai-kizoku-ni-tensei-suru.png",
		"latestEp": "Episode 9",
		"animeUrl": "https://www1.gogoanime.cm//category/sekai-saikou-no-ansatsusha-isekai-kizoku-ni-tensei-suru",
		"genres": ["Action", "Drama", "Fantasy", "Mystery", "Romance"]
	}
    {...},
    ...
]
```

## Get Anime Genres

| Parameter         | Description                           |
| ----------------- | ------------------------------------- |
| `:genre` (string) | [Genres are avaliable below](#genres) |
| `page` (int)      | The page limit varies by genre.       |

#### Genres

| Genre           |
| --------------- |
| `action`        |
| `adventure`     |
| `cars `         |
| `comedy`        |
| `crime`         |
| `dementia`      |
| `demons`        |
| `drama`         |
| `dub`           |
| `ecchi`         |
| `family`        |
| `fantasy`       |
| `game`          |
| `gourmet`       |
| `harem`         |
| `historical`    |
| `horror`        |
| `josei`         |
| `kids`          |
| `magic`         |
| `martial-arts`  |
| `mecha`         |
| `military`      |
| `Mmusic`        |
| `mystery`       |
| `parody`        |
| `police`        |
| `psychological` |
| `romance`       |
| `samurai`       |
| `school`        |
| `sci-fi`        |
| `seinen`        |
| `shoujo`        |
| `shoujo-ai`     |
| `shounen`       |
| `shounen-ai`    |
| `slice-of-Life` |
| `space`         |
| `sports`        |
| `super-power`   |
| `supernatural`  |
| `suspense`      |
| `thriller`      |
| `vampire`       |
| `yaoi`          |
| `yuri`          |

```js
fetch("https://gogoanime.herokuapp.com/genre/action")
  .then((response) => response.json())
  .then((animelist) => console.log(animelist));
```

Output >>

```json
[
    {
        "animeId": "isekai-meikyuu-de-harem-wo",
        "animeTitle": "Isekai Meikyuu de Harem wo",
        "animeImg": "https://gogocdn.net/cover/isekai-meikyuu-de-harem-wo.png",
        "releasedDate": "2022",
        "animeUrl": "https://www1.gogoanime.cm//category/isekai-meikyuu-de-harem-wo"
    },
    {...},
    ...
```

## Get Anime Details

| Parameter      | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| `:id` (string) | **animeId can be found in every response body as can be seen in the above examples** |

```js
fetch("https://gogoanime.herokuapp.com/anime-details/naruto")
  .then((response) => response.json())
  .then((animelist) => console.log(animelist));
```

Output >>

```json
{
    "animeTitle": "Naruto",
    "type": "TV Series",
    "releasedDate": "2002",
    "status": "Completed",
    "genres": ["Action", "Comedy", "Martial Arts", "Shounen", "Super Power"],
    "otherNames": "ナルト",
    "synopsis": "...",
    "animeImg": "https://gogocdn.net/images/anime/N/naruto.jpg",
    "episodesAvaliable": "220",
    "episodesList": [
        {
            "episodeId": "naruto-episode-220",
            "episodeNum": "220",
            "episodeUrl": "https://www1.gogoanime.cm//naruto-episode-220"
        },
        {...},
        ...
    ]
}
```

## Get Streaming URLs

You might need the referer url to bypass 403 (Forbidden) HTTP code.

| Parameter      | Description                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| `:id` (string) | episodeId. **To verify the id of each episode, look at the episodesList property in the example above.** |

### VIDCDN

```js
fetch("https://gogoanime.herokuapp.com/vidcdn/watch/naruto-episode-220")
  .then((response) => response.json())
  .then((animelist) => console.log(animelist));
```

Output >>

```json
{
  "headers": {
    "Referer": "https://gogoplay.io/"
  },
  "data": [
    {
      "file": "https://vidstreamingcdn.com/cdn34/a96411258da4b8a75319906d0cc507f7/EP.18.v0.1644104042.360p.mp4?mac=7GmeilE5nn5L7xGZqxt4YNTnzQ53eEazGha0ZBD15WU%3D&vip=&expiry=1644122389382",
      "label": "360 P",
      "type": "mp4"
    },
    {
      "file": "https://vidstreamingcdn.com/cdn34/a96411258da4b8a75319906d0cc507f7/EP.18.v0.1644104042.480p.mp4?mac=JBKmkO3IViHhGVSsXLekTDjhGICtfkmvXPuW7wEPGuw%3D&vip=&expiry=1644122389440",
      "label": "480 P",
      "type": "mp4"
    },
    {
      "file": "https://vidstreamingcdn.com/cdn34/a96411258da4b8a75319906d0cc507f7/EP.18.v0.1644104042.720p.mp4?mac=wx74gKGn9SeKI%2BFJRUbR6n3ohlwcdf9ANYZhJgtSG54%3D&vip=&expiry=1644122389494",
      "label": "720 P",
      "type": "mp4"
    },
    {
      "file": "https://vidstreamingcdn.com/cdn34/a96411258da4b8a75319906d0cc507f7/EP.18.v0.1644104042.1080p.mp4?mac=vBygNaIMu43c33aeSeMzl%2Fp24QG5QTEzI6adjkaemIE%3D&vip=&expiry=1644122389554",
      "label": "1080 P",
      "type": "mp4"
    },
    {
      "file": "https://vidstreamingcdn.com/cdn34/a96411258da4b8a75319906d0cc507f7/EP.18.v0.1644104042.720p.mp4?mac=wx74gKGn9SeKI%2BFJRUbR6n3ohlwcdf9ANYZhJgtSG54%3D&vip=&expiry=1644122389494",
      "label": "Auto",
      "default": "true",
      "type": "mp4"
    }
  ]
}
```

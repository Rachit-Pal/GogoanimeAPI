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

# Guide

Below you'll find examples using [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) but you can use any other http library out there.

## Available Routes

- [Get Recent Episodes](#get-recent-episodes)
- [Get Popular Anime](#get-popular-anime)
- [Get Anime Search](#get-anime-search)
- [Get Anime Movies](#get-anime-movies)
- [Get Top Airing](#get-top-airing)
- [Get Anime Genres](#get-genre)
- [Get Anime Details](#get-anime-details)
- [Get Streaming URLs](#get-streaming-url)

## Get Recent Episodes

| Parameter    | Description                                                                                                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type` (int) | (optional) by default the type is 1. **type 1: japanese with subtitle. type 2: english dub with no subtitles. type 3: chinese with english subtitles.** Example: `GET /recent-release?type=2` |
| `page` (int) | **type 1 page limit: [1-331]. type 2: [1-139]. type 3: [1-22].**                                                                                                                              |

```js
fetch("http://localhost:3000/recent-release")
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
fetch("http://localhost:3000/popular")
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
fetch("http://localhost:3000/search?keyw=naruto")
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
fetch("http://localhost:3000/anime-movies")
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
fetch("http://localhost:3000/top-airing")
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
fetch("http://localhost:3000/genre/action")
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

| Parameter      | Description                                     |
| -------------- | ----------------------------------------------- |
| `:id` (string) | **animeId can be found in every response body** |

```js
fetch("http://localhost:3000/anime-details/naruto")
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

### GOGO SERVER

To play the m3u8 videos you will need to use some HLS player.

```js
fetch("http://localhost:3000/gogo-server/watch/naruto-episode-220")
	.then((response) => response.json())
	.then((animelist) => console.log(animelist));
```

Output >>

```json
{
	"m3u8": "https://www02.anicdn.stream/videos/hls/8gQCxrw3kKcSr1vw79zLNQ/1638936932/25615/027e9529af2b06fe7b4f47e507a787eb/ep.220.1631668946.m3u8",
	"referer": "https://gogoplay1.com/embedplus?id=MjU2MTU=&token=7SinmMUWpAkoUImuYBMWag&expires=1638924332"
}
```

### VIDSTREAMING

```js
fetch("http://localhost:3000/vid-streaming/watch/naruto-episode-220")
	.then((response) => response.json())
	.then((animelist) => console.log(animelist));
```

Output >>

```json
[
	{
		"link": "https://gogo-cdn.com/download.php?url=aHR0cHM6LyAawehyfcghysfdsDGDYdgdsfsdfwstdgdsgtert9AdrefsdsdfwerFrefdsfrersfdsrfer36343534jZG4yNi5hbmljZG4uc3RyZWFtL3VzZXIxMzQyLzYxOWI4MzJhZjhmMTZhODhjYTEzOTdjMmQ0YjJjODQ2L0VQLjIyMC52MS4zNjBwLm1wND90b2tlbj1ubXdsU0dKTWxycFVyNjBWSFRoMmh3JmV4cGlyZXM9MTYzODkzODYwOSZpZD0yNTYxNQ==",
		"quality": "360P",
		"referer": "https://gogoplay1.com/download?id=MjU2MTU=&typesub=Gogoanime-SUB&title=Naruto+Episode+220"
	},
	{
		"link": "https://gogo-cdn.com/download.php?url=aHR0cHM6LyAawehyfcghysfdsDGDYdgdsfsdfwstdgdsgtert9AdeqwrwedffryretgsdFrsftrsvfsfsrjZG4yNi5hbmljZG4uc3RyZWFtL3VzZXIxMzQyLzYxOWI4MzJhZjhmMTZhODhjYTEzOTdjMmQ0YjJjODQ2L0VQLjIyMC52MS40ODBwLm1wND90b2tlbj03VGY4S3ZwUGNmZ3AwQXZneV9oa01RJmV4cGlyZXM9MTYzODkzODYwOSZpZD0yNTYxNQ==",
		"quality": "480P",
		"referer": "https://gogoplay1.com/download?id=MjU2MTU=&typesub=Gogoanime-SUB&title=Naruto+Episode+220"
	},
	{
		"link": "https://gogo-cdn.com/download.php?url=aHR0cHM6LyAdrefsdsdfwerFrefdsfrersfdsrfer363435349AdeqwrwedffryretgsdFrsftrsvfsfsrjZG4yNi5hbmljZG4uc3RyZWFtL3VzZXIxMzQyLzYxOWI4MzJhZjhmMTZhODhjYTEzOTdjMmQ0YjJjODQ2L0VQLjIyMC52MS43MjBwLm1wND90b2tlbj04Ri1vTWFsYV9MdnpoVHdtYmZIZ1NRJmV4cGlyZXM9MTYzODkzODYwOSZpZD0yNTYxNQ==",
		"quality": "720P",
		"referer": "https://gogoplay1.com/download?id=MjU2MTU=&typesub=Gogoanime-SUB&title=Naruto+Episode+220"
	},
	{
		"link": "https://gogo-cdn.com/download.php?url=aHR0cHM6LyAawehyfcghysfdsDGDYdgdsfsdfwstdgdsgtert9AdrefsdsdfwerFrefdsfrersfdsrfer36343534jZG4yNi5hbmljZG4uc3RyZWFtL3VzZXIxMzQyLzYxOWI4MzJhZjhmMTZhODhjYTEzOTdjMmQ0YjJjODQ2L0VQLjIyMC52MS4xMDgwcC5tcDQ/dG9rZW49ejJMRWo4eE00QWNvWmE4TlFOQmp5QSZleHBpcmVzPTE2Mzg5Mzg2MDkmaWQ9MjU2MTU=",
		"quality": "1080P",
		"referer": "https://gogoplay1.com/download?id=MjU2MTU=&typesub=Gogoanime-SUB&title=Naruto+Episode+220"
	}
]
```

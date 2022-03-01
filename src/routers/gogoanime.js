import express from "express";

import { Gogoanime } from "../parsers/index.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to Gogoanime home page!!");
});

router.get("/search", async(req, res) => {
    try {
        const keyw = req.query.keyw
        const page = req.query.page

        const data = await Gogoanime.scrapeSearch({ keyw: keyw, page: page })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

router.get("/recent-release", async(req, res) => {
    try {
        const page = req.query.page
        const type = req.query.type

        const data = await Gogoanime.scrapeRecentRelease({ page: page, type: type })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

router.get("/current-season", async(req, res) => {
    try {
        const page = req.query.page

        const data = await Gogoanime.scrapeCurrentSeason({ page: page })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

router.get("/popular", async(req, res) => {
    try {
        const page = req.query.page

        const data = await Gogoanime.scrapePopularAnime({ page: page })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

router.get("/anime-movies", async(req, res) => {
    try {
        const page = req.query.page
        const alphabet = req.query.aph

        const data = await Gogoanime.scrapeAnimeMovies({ page: page, aph: alphabet })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).send({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})


router.get("/top-airing", async(req, res) => {
    try {
        const page = req.query.page

        const data = await Gogoanime.scrapeTopAiringAnime({ page: page })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).send({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

router.get("/season/:season", async(req, res) => {
    try {
        const page = req.query.page
        const season = req.params.season

        const data = await Gogoanime.scrapeSeason({ page: page, season: season })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).send({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

router.get("/genre/:genre", async(req, res) => {
    try {
        const genre = req.params.genre
        const page = req.query.page

        const data = await Gogoanime.scrapeGenre({ genre: genre, page: page })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).send({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})


router.get("/anime-details/:id", async(req, res) => {
    try {
        const id = req.params.id

        const data = await Gogoanime.scrapeAnimeDetails({ id: id })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

router.get("/anime-episodes/:animeId", async(req, res) => {
    try {
        const animeId = req.params.animeId

        const data = await Gogoanime.scrapeEpisodes({ animeId: animeId })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})




router.get("/vidcdn/watch/:id", async(req, res) => {
    try {
        const id = req.params.id

        const data = await Gogoanime.scrapeMP4({ id: id })

        res.status(200).json(data)


    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

export default router;
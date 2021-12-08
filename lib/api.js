import express from 'express'
import cors from 'cors'

import {
    scrapeGenre,
    scrapeTopAiringAnime,
    scrapeAnimeMovies,
    scrapePopularAnime,
    scrapeNewSeason,
    scrapeRecentRelease,
    scrapeSearch,
    scrapeAnimeDetails,
    scrapeM3U8,
    scrapeMp4,

} from './anime_parser.js'

const port = process.env.PORT || 3000;

const corsOptions = {
    origin: "*",
    credentails: true,
    optionSuccessStatus: 200,
    port: port,
}

const app = express();


app.use(cors(corsOptions))
app.use(express.json())


app.get("/", (req, res) => {
    res.status(200).json('Welcome to GogoAnime API!')
})

app.get("/search", async(req, res) => {
    try {
        const keyw = req.query.keyw
        const page = req.query.page

        const data = await scrapeSearch({ keyw: keyw, page: page })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

app.get("/recent-release", async(req, res) => {
    try {
        const page = req.query.page
        const type = req.query.type

        const data = await scrapeRecentRelease({ page: page, type: type })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

app.get("/new-season", async(req, res) => {
    try {
        const page = req.query.page

        const data = await scrapeNewSeason({ page: page })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

app.get("/popular", async(req, res) => {
    try {
        const page = req.query.page

        const data = await scrapePopularAnime({ page: page })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

app.get("/anime-movies", async(req, res) => {
    try {
        const page = req.query.page
        const alphabet = req.query.aph

        const data = await scrapeAnimeMovies({ page: page, aph: alphabet })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).send({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})


app.get("/top-airing", async(req, res) => {
    try {
        const page = req.query.page

        const data = await scrapeTopAiringAnime({ page: page })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).send({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

app.get("/genre/:genre", async(req, res) => {
    try {
        const genre = req.params.genre
        const page = req.query.page

        const data = await scrapeGenre({ genre: genre, page: page })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).send({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})


app.get("/anime-details/:id", async(req, res) => {
    try {
        const id = req.params.id

        const data = await scrapeAnimeDetails({ id: id })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})


app.get("/gogo-server/watch/:id", async(req, res) => {
    try {
        const id = req.params.id

        const data = await scrapeM3U8({ id: id })

        res.status(200).json(data)


    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

app.get("/vid-streaming/watch/:id", async(req, res) => {
    try {
        const id = req.params.id

        const data = await scrapeMp4({ id: id })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

app.use((req, res) => {
    res.status(404).json({
        status: 404,
        error: "Not Found",
    })
})


app.listen(port, () => {
    console.log(
        "Express server listening on port %d in %s mode",
        port,
        app.settings.env
    )
})
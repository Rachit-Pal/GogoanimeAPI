import express from "express";

import { Animekisa } from "../parsers/index.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to Animekisa home page!!");
});

router.get("/search", async(req, res) => {
    try {
        const lang = req.query.lang;
        const query = req.query.query;
        const page = req.query.page;
        const status = req.query.status;
        const sort = req.query.sort;
        const genres = req.query.genres;
        const type = req.query.type;
        const season = req.query.season;
        const countries = req.query.country;
        const year = req.query.year;

        const data = await Animekisa.scrapeSearch({
            status: status,
            sort: sort,
            keyword: query,
            page: page,
            type: type,
            genre: genres,
            season: season,
            lang: lang,
            country: countries,
            years: year
        });

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
});


router.get("/type/:type", async(req, res) => {
    try {
        const type = req.params.type;
        const page = req.query.page;

        const data = await Animekisa.scrapeType({
            type: type,
            page: page
        });

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})

router.get("/anime-list/:sort/:type", async(req, res) => {
    try {
        const type = req.params.type;
        const sort = req.params.sort;
        const page = req.query.page;

        const data = await Animekisa.scrapeSortedAnimeList({
            type: type,
            sort: sort,
            page: page
        });

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})


router.get("/genre/:genre", async(req, res) => {
    try {
        const genre = req.params.genre;
        const page = req.query.page;

        const data = await Animekisa.scrapeGenre({
            genre: genre,
            page: page
        });

        res.status(200).json(data);


    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
});

router.get("/season/:season", async(req, res) => {
    try {
        const page = req.query.page;
        const season = req.params.season;

        const data = await Animekisa.scrapeSeason({
            season: season,
            page: page
        });

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
})



export default router;
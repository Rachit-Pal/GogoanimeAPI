import { scrapeSeason } from '../../../lib/anime_parser.js';
import initMiddleware from '../../../lib/init-middleware.js';
import Cors from 'cors';

const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        origin: "*",
        credentails: true,
        optionSuccessStatus: 200
    })
  )

export default async function handler(req, res) {
    await cors(req, res);
    
    try {
        const page = req.query.page
        const season = req.query.season

        const data = await scrapeSeason({ page: page, season: season })

        res.status(200).json(data)

    } catch (err) {
        res.status(500).send({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
  };
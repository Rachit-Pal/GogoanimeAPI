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

        res.status(200).json({ genres: ['action', 'adventure', 'cars', 'comedy', 'crime', 'dementia', 'demons', 'drama', 'dub', 'ecchi', 'family', 'fantasy', 'game', 'gourmet', 'harem', 'historical', 'horror', 'josei', 'kids', 'magic', 'martial-arts', 'mecha', 'military', 'music', 'mystery', 'parody', 'police', 'psychological', 'romance', 'samurai', 'school', 'sci-fi', 'seinen', 'shoujo', 'shoujo-ai', 'shounen', 'shounen-ai', 'slice-of-life', 'space', 'sports', 'super-power', 'supernatural', 'suspense', 'thriller', 'vampire', 'yaoi', 'yuri']})

    } catch (err) {
        res.status(500).send({
            status: 500,
            error: "Internal Error",
            message: err,
        })
    }
  };
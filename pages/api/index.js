import initMiddleware from '../../lib/init-middleware.js';
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
  
  res.status(200).json({  message: "Welcome to GogoAnime API!", code: 200 });
};
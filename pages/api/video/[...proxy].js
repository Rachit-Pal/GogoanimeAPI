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
    
    const { src, referrer } = req.query;
  
    const options = {
      headers: {
        Referer: referrer,
      },
    };
  
    // fetch the data from the url
    const response = await fetch(src, options);
  
    const setHeader = (header) => {
      res.setHeader(header, response.headers.get(header.toLowerCase()));
    };
  
    // set etag, and expires header so that the browser caches the video data
    setHeader('etag');
    setHeader('expires');
  
    // send the response data back to the client
    res.send(response.body);
  }
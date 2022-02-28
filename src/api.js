import express from 'express'
import cors from 'cors'

import { Constants } from './utils/C.js'

import gogoanime from './routers/gogoanime.js'
import animekisa from './routers/animekisa.js'

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

app.use('/favicon.ico', express.static('../images/image1.png'))

app.use("/gogoanime", gogoanime);
app.use("/animekisa", animekisa);

app.get("/", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write('<h1>Welcome to Anime parser API!</h1>');
    res.write('<h2>Endpoints:</h2>');
    res.write('<ul>');
    res.write('<li>/gogoanime/search?keyw=<keyword>&page=<page number>');
    res.write('<li>/gogoanime/recent-release?page=<page number>&type=<type>');
    res.write('<li>/gogoanime/new-season?page=<page number>');
    res.write('<li>/animekisa/search?keyw=<keyword>&page=<page number>');
    res.write('<li>/animekisa/recent-release?page=<page number>&type=<type>');
    res.write('<li>/animekisa/new-season?page=<page number>');
    res.write('</ul>');

    res.end();
})


app.use((req, res) => {
    res.status(404).json({
        status: 404,
        error: "Page Not Found",
    })
})


app.listen(port, () => {
    console.log(
        "Express server listening on port %d in %s mode",
        port,
        app.settings.env
    )
    console.log(`http://localhost:${port}`)
})
const axios = require("axios")
const express = require('express')
const https = require("https");

const target = "https://javplayer.me/"

const app = express()
const port = 5000

const getHtml = async (slug) => {
    return await axios.get(target + "v/" + slug, {
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
        headers: {
            "Referer": "https://javplayer.me/"
        }
    })
        .then(res => res)
        .then((data) => {
            const ress = data.data.replace("enrichyummy", '');
            return ress.replaceAll(target, "/")
        })
        .catch(e => {
            console.error("error on getHtml")
            console.error(e.message)
            return e.message
        })
}

const getAssets = async (path) => {
    return await axios.get(target + path, {
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
        headers: {
            "Referer": "https://javplayer.me/"
        }
    })
        .then(res => res)
        .then((data) => {
            return {data: data.data, headers: data.headers}
        })
        .catch(e => {
            console.error("error on getAssets")
            console.error(e.message)
            return e.message
        })
}

app.get('/v/:slug', async (req, res) => {
    const slug = req.params.slug
    const result = await getHtml(slug)
    res.send(result)
})

app.get('**', async (req, res) => {
    const path = req.url.split('/').slice(1).join('/');
    const result = await getAssets(path)
    res.set(result.headers)
    res.send(result.data)

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;

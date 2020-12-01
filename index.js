const express = require('express')
const app = express()
const got = require('got')
const sharp = require('sharp')
const stream = require('stream')

const port = process.env.PORT || 8080
const filterLink = process.env.FILTER_LINK
app.listen(port, () => {
    console.log(`image-cropper: listening on port ${port}`);
});

app.get('/crop', (req, res) => {
    const originalLink = req.query["original-link"]
    const width = req.query.width
    const height = req.query.height

    validateInput(req, res, originalLink, width, height)

    res.setHeader('Content-type', 'image/jpeg')

    const inputStream = got.stream(originalLink)
    const transformer = sharp().resize(parseInt(width), parseInt(height))

    const ps = new stream.PassThrough()
    //Based on: https://stackoverflow.com/questions/17515699/node-express-sending-image-files-as-api-response
    stream.pipeline(
        inputStream,
        transformer,
        ps,
        (err) => {
            if (err) {
                console.log(err) // No such file or any other kind of error
                return res.sendStatus(400)
            }
        })
    ps.pipe(res)
});

function validateInput(req, res, originalLink, width, height) {
    let isValid = true

    if(!filterLink) {
        res.json({"message": "Misconfigured server"})
        res.status(500)
        isValid = false
    }
    if(!originalLink.includes(filterLink)) {
        res.json({"message": "Bad URL"})
        res.status(204)
        isValid = false
    }

    if(!isNumeric(height) || !isNumeric(width)) {
        res.json({"message": "Bad parameters"})
        res.status(204)
        isValid = false
    }
    if(!isValid) {
        res.end()
    }
}

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) &&
        !isNaN(parseInt(str))
}

//To stop node process from within docker smoothly
process.on('SIGINT', () => {
    console.info("Interrupted")
    process.exit(0)
})

module.exports = app;

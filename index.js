const express = require('express')
const app = express()
const got = require('got')
const sharp = require('sharp')
const stream = require('stream')

const port = process.env.PORT || 8080
const filterLink = process.env.FILTER_LINK || ""

app.listen(port, () => {
    console.log(`image-cropper: listening on port ${port}`);
});

let validator = function validatorMiddleware(req, res, next) {
    validateInput(req, res) ? next() : res.end()
}

app.use(validator)

app.get('/crop', (req, res) => {
    res.sendStatus(400)
    let {originalLink, width, height} = extractParams(req)

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
                console.log(err.message) // No such file or any other kind of error
                return res.sendStatus(400)
            }
        })
    ps.pipe(res)
});

function validateInput(req, res) {
    let isValid = true
    let errorMessage

    let {originalLink, width, height} = extractParams(req)

    if (!originalLink.includes(filterLink)) {
        errorMessage = {"message": "Bad URL"}
        isValid = false
    }

    if (!isNumeric(height) || !isNumeric(width)) {
        errorMessage = {"message": "Bad parameters"}
        isValid = false
    }
    if (errorMessage) {
        res.status(400)
        res.json(errorMessage)
    }
    return isValid
}

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) &&
        !isNaN(parseInt(str))
}

function extractParams(req) {
    return {
        originalLink: req.query["original-link"],
        width: req.query.width,
        height: req.query.height
    }
}

//To stop node process from within docker smoothly
process.on('SIGINT', () => {
    console.info("Interrupted")
    process.exit(0)
})

module.exports = app;

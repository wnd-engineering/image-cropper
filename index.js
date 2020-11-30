const express = require('express');
const app = express();
const got = require('got');
const sharp = require('sharp');
const stream = require('stream')

app.get('/crop', (req, res) => {
    const originalLink = req.query["original-link"]
    if(!originalLink.includes("https://storage.googleapis.com/user-models")) {
        res.json({"message": "Bad URL"})
        res.status(204)
        return
    }
    const width = req.query.width
    const height = req.query.height
    if(!isNumeric(height) || !isNumeric(width)) {
        res.json({"message": "Bad parameters"})
        res.status(204)
        return
    }

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

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`image-cropper: listening on port ${port}`);
});

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) &&
        !isNaN(parseInt(str))
}

module.exports = app;

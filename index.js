const express = require('express');
const app = express();
const gcs = require('@google-cloud/storage');
const got = require('got');
const through = require('through');
const path = require('path');
const sharp = require('sharp');
const http = require("http");
const stream = require('stream')

app.get('/crop', (req, res) => {
    const width = req.query.width;
    const height = req.query.height;
    const originalLink = req.query["original-link"];
    const inputStream = got.stream(originalLink);
    const transformer = sharp().resize(parseInt(width), parseInt(height));
        // .on('info', function (info) {
        //     console.log('Image height is ' + info.height);
        // });

    const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
    //Based on: https://stackoverflow.com/questions/17515699/node-express-sending-image-files-as-api-response
    stream.pipeline(
        inputStream,
        transformer,
        ps, // <---- this makes a trick with stream error handling
        (err) => {
            //https://stackoverflow.com/questions/21771220/error-handling-with-node-js-streams
            if (err) {
                console.log(err) // No such file or any other kind of error
                return res.sendStatus(400);
            }
        })
    ps.pipe(res) // <---- this makes a trick with stream error handling
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`image-cropper: listening on port ${port}`);
});

module.exports = app;

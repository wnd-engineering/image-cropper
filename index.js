const express = require('express');
const app = express();
const gcs = require('@google-cloud/storage');
const got = require('got');
const through = require('through');
const path = require('path');
const sharp = require('sharp');
const http = require("http");

app.get('/crop', (req, res) => {
    const width = req.query.width;
    const height = req.query.height;
    const originalLink = req.query["original-link"];
    const inputStream = got.stream(originalLink);
    const transformer = sharp().resize(parseInt(width), parseInt(height));
    inputStream.on('end', () => res.end());
    inputStream.pipe(transformer).jpeg().pipe(res);
    // req.pipe(through(write, end)).pipe(res)
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`image-cropper: listening on port ${port}`);
});

module.exports = app;

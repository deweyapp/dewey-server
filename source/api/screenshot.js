var _               = require('underscore');
var imagemagick     = require('imagemagick-native');
var request         = require('request');
var url             = require('url');
var webshot         = require('webshot');

function screenshotService(app){

    const webshot_options = {
        screenSize: {
            width: 1024, height: 768 // default render size
        },
        shotSize: {
            width: 'window', height: 'window' // snapshot size of whole window
        },
        streamType: 'png', // by default png
        timeout: 60000 // waiting maximum 60 seconds
    };

    // resize to 400px x 300px
    // we are showing screenshots as 200x150 images, but multiplying on 2 to support retina
    const imagepick_options = {
        width: 400,
        height: 300
    };

    app.get('/screenshot/:url/screenshot.png', function(req, res) {
        var requestedUrl = req.param('url');

        if (!requestedUrl) {
            res.status(400).end();
            return;
        }

        res.header('Content-Type', 'image/png');
        webshot(requestedUrl, webshot_options)
            .on('error', function(err) {
                res.status(400).end();
            })
            .pipe(imagemagick.streams.convert(imagepick_options))
            .on('error', function(err) {
                res.status(400).end();
            })
            .pipe(res)
            .on('error', function(err) {
                res.status(500).end();
            })
            .on('close', function() {
                res.end();
            });
    });
}

module.exports = screenshotService;

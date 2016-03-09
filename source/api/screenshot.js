var imagemagick     = require('imagemagick-native');
var url             = require('url');
var webshot         = require('webshot');
var bottleneck      = require("bottleneck");

function screenshotService(app){
    // resize to 400px x 300px
    // we are showing screenshots as 200x150 images, but multiplying on 2 to support retina
    const imagepick_options = {
        width: 400,
        height: 300
    };

    var limiter = new bottleneck(16);

    function handleRequest(req, res, type) {
        var requestedUrl = req.param('url');

        if (!requestedUrl) {
            res.status(400).end();
            return;
        }

        res.header('Content-Type', 'image/' + type);


        limiter.submit(
        function(cb) {
            webshot(requestedUrl, {
                screenSize: {
                    width: 1024, height: 768 // default render size
                },
                shotSize: {
                    width: 'window', height: 'window' // snapshot size of whole window
                },
                streamType: type,
                timeout: 10000 // waiting maximum 10 seconds
            })
                .on('error', function(err) {
                    res.status(400).end();
                    cb();
                })
                .pipe(imagemagick.streams.convert(imagepick_options))
                .on('error', function(err) {
                    res.status(400).end();
                    cb();
                })
                .pipe(res)
                .on('error', function(err) {
                    res.status(500).end();
                    cb();
                })
                .on('drain', function() {
                    res.end();
                    cb();
                })
                .on('finish', function() {
                    res.end();
                    cb();
                });
        }, null)
    }

    app.get('/screenshot/:url/screenshot.jpg', function(req, res) {
        handleRequest(req, res, 'jpg');
    });

    app.get('/screenshot/:url/screenshot.png', function(req, res) {
        handleRequest(req, res, 'png');
    });
}

module.exports = screenshotService;

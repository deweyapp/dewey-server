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

    var limiter = new bottleneck(process.env.DEWEY_SERVER_MAX_WEBSHOT || 4);

    function handleRequest(req, res, type) {
        var requestedUrl = req.params.url;

        if (!requestedUrl) {
            res.status(400).end();
            return;
        }

        var parsedUrl = url.parse(requestedUrl);
        if (!parsedUrl.protocol ||
            !parsedUrl.host) {
            res.status(400).end();
            return;
        }

        res.header('Content-Type', 'image/' + type);

        res.header('Cache-Control', 'public, max-age=31557600'); // one year
        limiter.submit(
        function(cb) {
            var webshotStream = webshot(requestedUrl, {
                screenSize: {
                    width: 1024, height: 768 // default render size
                },
                shotSize: {
                    width: 'window', height: 'window' // snapshot size of whole window
                },
                streamType: type,
                timeout: 50000, // waiting maximum 10 seconds
                renderDelay: 200
            });

            webshotStream.on('end', function() {
                cb();
            });

            webshotStream.on('error', function(err) {
                res.status(500).end();
            });

            var imagemagickStream = imagemagick.streams.convert(imagepick_options);
            imagemagickStream.on('error', function(err) {
                res.status(500).end();
            });

            webshotStream.pipe(imagemagickStream);

            res.on('error', function(err) {
                res.status(500).end();
            });

            res.on('finish', function() {
                res.end();
            });

            imagemagickStream.pipe(res)
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

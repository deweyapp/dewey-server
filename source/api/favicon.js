var querystring = require('querystring');
var url         = require('url');
var https       = require('https');
var bottleneck  = require("bottleneck");

function faviconService(app){
    const google_url = 'http://www.google.com/s2/favicons?domain=';
    const agent = new https.Agent({keepAlive: true, maxSockets: process.env.DEWEY_SERVER_MAX_FAVICON || 32});

    app.get('/favicon/:domain/favicon.ico', function(req, res){
        var domain = req.params.domain;
        if (!domain) {
            res.status(400).end();
            return;
        }

        res.header('Content-Type', 'image/png');
        https.get({
            agent: agent,
            protocol: 'https:',
            host: 'www.google.com',
            path: '/s2/favicons?domain=' + domain // we expect that domain is already encoded
        }, function(googleResponse, err) {
            if (err) {
                res.status(400).end();
                return;
            }

            res.header('Cache-Control', 'public, max-age=31557600'); // one year
            googleResponse.pipe(res);
        });
    });
}

module.exports = faviconService;

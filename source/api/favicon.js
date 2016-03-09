var querystring = require('querystring');
var url         = require('url');
var https       = require('https');

function faviconService(app){
    const google_url = 'http://www.google.com/s2/favicons?domain=';
    const agent = new https.Agent({keepAlive: true});

    app.get('/favicon?:domain', function(req, res){
        if (!req.query.domain) {
            res.status(400).end();
            return;
        }

        res.setHeader('Content-Type', 'image/png');
        https.get({
            agent: agent,
            protocol: 'https:',
            host: 'www.google.com',
            path: '/s2/favicons?domain=' + querystring.escape(req.query.domain)
        }, function(googleResponse, err) {
            if (err) {
                console.warn(err);
                res.status(400).end();
                return;
            }

            googleResponse.pipe(res);
        });
    });
}

module.exports = faviconService;

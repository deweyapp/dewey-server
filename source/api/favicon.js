var request = require('request');

function faviconService(app){
    app.get('/favicon?:query', getFaviconByUrl, function(req, res){
        res.json(req.data);
    });
    
    function getFaviconByUrl(req, res, next){
        var query = req.query.query;
        request.get(getUrl() + query).pipe(res);
    }

    function getUrl(){
    	return 'http://www.google.com/s2/favicons?domain=';
    }
}

module.exports = faviconService;
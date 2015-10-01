var request = require('request');
var _       = require('underscore');

function screenshotService(app){
    
    var limit = 200;
    var storage = [];

    app.get('/screenshot?:query', function(req, res) {

        var ip = req.connection.remoteAddress;
        if(isCallAllowed(ip)=== false){
            return res.json({
                status: 'error',
                msg: 'Call limit for today'
            });
        }
        
        var address = req.query.query;
        var url = getPage2ImageUrl(address);

        request.get(url, function(err, obj, body) {
            var data = JSON.parse(body);
            return res.json(data);
        });
    });

    function isCallAllowed(ip){
        var existing = _.findWhere(storage, {id: ip});
        
        if(_.isUndefined(existing)){
            // console.log('First');
            storage.push({
                id: ip,
                limit: 1,
                lastMade: new Date()
            });
            return true;
        }

        var now = new Date();

        var isNotToday = existing.lastMade.getDate() != now.getDate()
                          || existing.lastMade.getMonth() != now.getMonth()
                          || existing.lastMade.getFullYear() != now.getFullYear();
        if(isNotToday === true){
            // console.log('Not today');
            existing.limit = 1;
            existing.lastMade = new Date();

            return true;
        }

        if(existing.limit <= limit){
            // console.log('Less');
            existing.limit ++;
            return true;
        }
        // console.log('Limit');

        return false;
    }

    function getPage2ImageUrl(address){

        var apikey = process.env.page2imageKey || 'apikey';

        var ss=  'http://api.page2images.com/restfullink?p2i_url=' +
            address +
            '&p2i_device=6&p2i_size=400x150&p2i_screen=1024x768&p2i_imageformat=jpg&p2i_wait=0&p2i_key=' + apikey;

console.log(ss);
            return ss;
    }
}

module.exports = screenshotService;
var request = require('request');

function screenshotService(app){
    
    app.get('/screenshot?:query', function(req, res) {

        var ip = req.connection.remoteAddress;
        console.log(ip);

        var address = req.query.query;
        var url = getPage2ImageUrl(address);

        request.get(url, function(err, obj, body) {
            var data = JSON.parse(body);

            if(data.status === 'finished' || data.status === 'error')
                return res.json(data);

            setInterval(function(){

                request.get(url, intervalRequest(url, res));

            }, 5000);
        });
    });

    function intervalRequest(url, res){
        request.get(url, function(err, obj, body){
            var data = JSON.parse(body);

            if(data.status === 'finished' || data.status === 'error')
                return res.json(data);
        });        
    }

    function getPage2ImageUrl(address){
        return 'http://api.page2images.com/restfullink?p2i_url=' +
            address +
            '&p2i_device=6&p2i_size=400x150&p2i_screen=1024x768&p2i_imageformat=jpg&p2i_wait=0&p2i_key=7cd903b37d087238';
    }
}

module.exports = screenshotService;
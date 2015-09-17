var request = require('request');

function screenshotService(app){
    
    app.get('/screenshot?:query', function(req, res) {
        var address = req.query.query;
        var url = getPage2ImageUrl(address);

        request.get(url, function(err, obj, body) {
            var data = JSON.parse(body);

            if(data.status === 'finished')
                return res.json(data);

            setTimeout(function() {

                request.get(url).pipe(res);

            }, 55000);
        });
    });

    function getPage2ImageUrl(address){
        return 'http://api.page2images.com/restfullink?p2i_url=' +
            address +
            '&p2i_device=6&p2i_size=400x150&p2i_screen=1024x768&p2i_imageformat=jpg&p2i_wait=0&p2i_key=7cd903b37d087238';
    }
}

module.exports = screenshotService;
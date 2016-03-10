var express = require('express');
var http = require('http');
var morgan = require('morgan');

if (process.env.DEWEY_SERVER_APPINSIGHTS_KEY) {
    var appInsights = require("applicationinsights");
    appInsights.setup(process.env.DEWEY_SERVER_APPINSIGHTS_KEY).start();
    console.log('App Insights started with key = ' + process.env.DEWEY_SERVER_APPINSIGHTS_KEY);
}

var app = express();

var cors = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-Access-Token, X-Revision, Content-Type');

	next();
};

app.use(cors);
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time'))

// routing
require('./source/api')(app);

var port = process.env.port || 3000;
http.createServer(app).listen(port, function() {});

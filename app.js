var express = require('express');
var app = express();
var http = require('http');

var cors = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-Access-Token, X-Revision, Content-Type');

	next();
};

app.configure(function(){
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.cookieParser());
	app.use(cors);
	app.use(express.methodOverride());
});

// routing
require('./source/api')(app);

var port = process.env.port || 3000;
http.createServer(app).listen(port, function() {});
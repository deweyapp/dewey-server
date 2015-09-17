function api(app) {
	require('./favicon')(app);
	require('./screenshot')(app);
}

module.exports = api;
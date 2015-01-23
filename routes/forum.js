
module.exports = function(app) {
	app.get('/forum', function (req, res) {
		var template_vars = {
			title: 'Forums',
			testobject: [{
				foo: 'foo 1',
				bar: 'bar 1'
			}, {
				foo: 'foo 2',
				bar: 'bar 2'
			}]
				
		};
		res.render('forum.html', template_vars);
	});
};
import * as express from 'express';

export default function Page404(app: express.Application) {
	app.get('/404', (req, res) => {
		res.status(404);
		res.redirect('/pages/404.html');
	});

	app.get('/404.htm', (req, res) => {
		res.redirect('/pages/404.html');
	});
	app.get('/404.html', (req, res) => {
		res.redirect('/pages/404.html');
	});
	app.get('/pages/404.htm', (req, res) => {
		res.redirect('/pages/404.html');
	});
}

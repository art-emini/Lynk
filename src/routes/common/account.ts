import * as express from 'express';
import { Low } from '../../packages/lowdb';
import Types from '../../types/types';
import * as fs from 'fs/promises';
import path = require('path');
import { accountViewLimiter } from '../../middleware/rateLimit';

export default function account(
	app: express.Application,
	userDB: Low<Types.User[]>
) {
	app.get('/account/:token/:page', async (req, res) => {
		const token = req.params.token;
		const page = req.params.page;

		// login with token

		await userDB.read();

		const user = userDB.data.find((u) => u.token === token);

		if (user) {
			if (
				page !== 'analytics' &&
				page !== 'lynks' &&
				page !== 'createLynk' &&
				page !== 'manageLynks' &&
				page !== 'manageAccount'
			) {
				res.status(404);
				res.redirect('/pages/404.html');
				return;
			}

			const file = await fs.readFile(
				path.join(__dirname + `/../../../public/pages/${page}.html`),
				'utf-8'
			);

			res.status(200);
			res.send(file);
		} else {
			res.status(403);
			res.send('Invalid Login.');
		}
	});
}

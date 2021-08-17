import * as express from 'express';
import { Low } from '../../packages/lowdb';
import Types from '../../types/types';

export default function auth(
	app: express.Application,
	userDB: Low<Types.User[]>
) {
	app.get('/api/auth/:token', async (req, res) => {
		const token = req.params.token;

		// check if token exists
		await userDB.read();

		const fUser = userDB.data.find((u) => u.token === token);

		if (fUser) {
			res.status(200);
			res.send(`
				<!DOCTYPE html>
				<html lang="en">
					<head>
						<meta charset="UTF-8" />
						<meta http-equiv="X-UA-Compatible" content="IE=edge" />
						<meta name="viewport" content="width=device-width, initial-scale=1.0" />
						<title>Lynk - Auth</title>
						<link rel="shortcut icon" href="#" type="image/x-icon" />
					</head>
					<body>
					Authenticating..

					<script src='../../js/auth.js'></script>

					</body>
				</html>

			`);
		} else {
			res.status(403);
			res.redirect('/pages/login.html');
		}
	});
}

import * as express from 'express';
import { editLynkLimiter } from '../../middleware/rateLimit';
import { Low } from '../../packages/lowdb';
import Types from '../../types/types';
import validateURL from '../../utils/validURL';

export default function editLynk(
	app: express.Application,
	userDB: Low<Types.User[]>,
	lynkDB: Low<Types.Lynk[]>
) {
	app.patch('/api/editLynk', editLynkLimiter, async (req, res) => {
		const token = req.body.token;
		const lynkID = req.body.lynkID;
		const redirectURL = req.body.redirectURL;

		if (typeof redirectURL !== 'string') {
			res.status(400);
			res.send('Invalid Body. Redirect url is missing or invalid.');
			return;
		}

		if (!validateURL(redirectURL)) {
			res.status(400);
			res.send('Invalid URL.');
		}

		// login user with token
		await userDB.read();

		const user = userDB.data.find((u) => u.token === token);

		if (user) {
			// change lynk redirect url
			await lynkDB.read();

			const lynk = lynkDB.data.find((l) => l.id === lynkID);

			if (lynk) {
				lynkDB.data.find((l) => l.id === lynkID).redirectUrl =
					redirectURL;

				res.status(200);
				res.send('Updated lynk.');

				await lynkDB.write();
			} else {
				res.status(404);
				res.send('Cannot find lynk with that ID.');
			}
		} else {
			res.status(403);
			res.send('Invalid Login');
		}
	});
}

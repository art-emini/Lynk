import * as express from 'express';
import { createLynkLimiter } from '../../middleware/rateLimit';
import { Low } from '../../packages/lowdb';
import Types from '../../types/types';
import randomID from '../../utils/randomID';

export default function createLynk(
	app: express.Application,
	lynkDB: Low<Types.Lynk[]>,
	userDB: Low<Types.User[]>
) {
	app.post('/api/createLynk', createLynkLimiter, async (req, res) => {
		const token: string = req.body.token;
		const redirectUrl: string = req.body.redirectUrl;

		if (typeof redirectUrl !== 'string') {
			res.status(400);
			res.send('Invalid Body. Redirect url is missing.');
			return;
		}

		// login with token

		await userDB.read();

		const fUser = userDB.data.find((u) => u.token === token);

		if (fUser) {
			const lynkID = randomID(10);
			const lynk: Types.Lynk = {
				ownerID: fUser.id,
				id: lynkID,
				redirectUrl,
				url:
					new URL(req.url, `http://${req.headers.host}`).origin +
					`/url/${lynkID}`,
				meta: {
					dateCreated:
						new Date().toDateString() +
						' - ' +
						new Date().toTimeString(),
					visits: 0,
					sources: [],
					dayStats: [],
				},
			};

			await lynkDB.read();

			lynkDB.data.push(lynk);

			await lynkDB.write();

			res.status(200);
			res.send(`Created Lynk. ${lynk.url}`);
		} else {
			res.status(403);
			res.send('Invalid Login');
		}
	});
}

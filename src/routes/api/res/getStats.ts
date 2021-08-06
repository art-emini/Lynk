import * as express from 'express';
import { getStatsLimiter } from '../../../middleware/rateLimit';
import { Low } from '../../../packages/lowdb';
import Types from '../../../types/types';

export default function getStats(
	app: express.Application,
	lynkDB: Low<Types.Lynk[]>,
	userDB: Low<Types.User[]>
) {
	app.post('/api/res/getStats', getStatsLimiter, async (req, res) => {
		const token = req.body.token;

		await userDB.read();

		const foundUser = userDB.data.find((u) => u.token === token);

		if (foundUser) {
			// get all of their lynks
			await lynkDB.read();
			await userDB.read();

			const lynks = lynkDB.data.filter((l) => l.ownerID === foundUser.id);
			let totalVisits = 0;

			for await (const lynk of lynks) {
				totalVisits += lynk.meta.visits;
			}

			res.status(200);
			res.json({
				lynks,
				totalVisits,
			});
			res.end();
		} else {
			res.status(403);
			res.send('Invalid Login.');
		}
	});
}

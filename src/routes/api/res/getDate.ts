import * as express from 'express';
import { Low } from '../../../packages/lowdb';
import Types from '../../../types/types';

export default function getDate(
	app: express.Application,
	lynkDB: Low<Types.Lynk[]>,
	userDB: Low<Types.User[]>
) {
	app.post('/api/res/getDate', async (req, res) => {
		const token = req.body.token;
		const date = req.body.date;

		await userDB.read();

		const foundUser = userDB.data.find((u) => u.token === token);

		if (foundUser) {
			await lynkDB.read();
			await userDB.read();

			const lynksF = lynkDB.data.filter(
				(l) => l.ownerID === foundUser.id
			);
			const days: Types.Day[] = [];

			let totalVisits = 0;

			for await (const lynk of lynksF) {
				const day = lynk.meta.dayStats.find((d) => d.date === date);

				if (day) {
					days.push(day);
					totalVisits += day.visits;
				}
			}

			res.status(200);
			res.json({
				days,
				totalVisits,
			});
		} else {
			res.status(403);
			res.send('Invalid Login.');
		}
	});
}

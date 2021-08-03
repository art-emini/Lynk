import * as express from 'express';
import { lynkViewLimiter } from '../../middleware/rateLimit';
import { Low } from '../../packages/lowdb';
import Types from '../../types/types';
import * as xss from 'xss';

export default function lynk(
	app: express.Application,
	lynkDB: Low<Types.Lynk[]>
) {
	app.get('/url/:lynkID', lynkViewLimiter, async (req, res) => {
		const lynkID = req.params.lynkID;

		const source = req.query.source;

		await lynkDB.read();

		const lynk = lynkDB.data.find((l) => l.id === lynkID);

		if (lynk) {
			const currentDate = new Date().toDateString();
			const day: Types.Day = {
				date: currentDate,
				visits: 1,
				sources: [],
			};

			lynkDB.data.find((l) => l.id === lynkID).meta.visits += 1;

			if (source) {
				lynkDB.data
					.find((l) => l.id === lynkID)
					.meta.sources.push(xss.filterXSS(String(source)));

				day.sources.push(xss.filterXSS(String(source)));
			}

			if (
				lynkDB.data
					.find((l) => l.id === lynkID)
					.meta.dayStats.find((d) => d.date === currentDate)
			) {
				lynkDB.data
					.find((l) => l.id === lynkID)
					.meta.dayStats.find((d) => d.date === currentDate).visits++;
				if (source) {
					lynkDB.data
						.find((l) => l.id === lynkID)
						.meta.dayStats.find((d) => d.date === currentDate)
						.sources.push(xss.filterXSS(String(source)));
				}
			} else {
				lynkDB.data
					.find((l) => l.id === lynkID)
					.meta.dayStats.push(day);
			}

			await lynkDB.write();

			res.status(200);
			res.redirect(lynk.redirectUrl);
		} else {
			res.status(404);
			res.redirect('/404');
			return;
		}
	});
}

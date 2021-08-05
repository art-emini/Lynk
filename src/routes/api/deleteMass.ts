import * as express from 'express';
import { deleteLynkLimiter } from '../../middleware/rateLimit';
import { Low } from '../../packages/lowdb';
import Types from '../../types/types';

export default function deleteMass(
	app: express.Application,
	lynkDB: Low<Types.Lynk[]>,
	userDB: Low<Types.User[]>
) {
	app.delete('/api/deleteMass', deleteLynkLimiter, async (req, res) => {
		const token: string = req.body.token;
		const lynkIDs: string[] = req.body.lynkIDs;

		// login with token

		await userDB.read();

		const fUser = userDB.data.find((u) => u.token === token);

		if (fUser) {
			for await (const lynkID of lynkIDs) {
				await lynkDB.read();
				const lynk = lynkDB.data.find((l) => l.id === lynkID);

				if (lynk) {
					lynkDB.data.splice(
						lynkDB.data.findIndex((l) => l.id === lynkID),
						1
					);
				}

				await lynkDB.write();
			}

			res.status(200);
			res.send('Deleted lynks.');
		} else {
			res.status(403);
			res.send('Invalid Login');
		}
	});
}

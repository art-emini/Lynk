import * as express from 'express';
import { deleteLynkLimiter } from '../../middleware/rateLimit';
import { Low } from '../../packages/lowdb';
import Types from '../../types/types';

export default function deleteLynk(
	app: express.Application,
	lynkDB: Low<Types.Lynk[]>,
	userDB: Low<Types.User[]>
) {
	app.delete('/api/deleteLynk', deleteLynkLimiter, async (req, res) => {
		const token: string = req.body.token;
		const lynkID: string = req.body.lynkID;

		// login with token

		await userDB.read();

		const fUser = userDB.data.find((u) => u.token === token);

		if (fUser) {
			await lynkDB.read();

			const lynk = lynkDB.data.find((l) => l.id === lynkID);

			if (lynk) {
				lynkDB.data.splice(
					lynkDB.data.findIndex((l) => l.id === lynk.id),
					1
				);

				res.status(204);
				res.send('Deleted lynk.');
			} else {
				res.status(404);
				res.send(
					`Cannot delete lynk. Cannot find lynk with id ${lynkID}.`
				);
			}

			await lynkDB.write();
		} else {
			res.status(403);
			res.send('Invalid Login');
		}
	});
}

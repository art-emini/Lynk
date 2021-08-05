import * as express from 'express';
import { Low } from '../../packages/lowdb';
import Types from '../../types/types';
import * as bcrypt from 'bcrypt';
import { deleteUserLimiter } from '../../middleware/rateLimit';

export default function deleteUser(
	app: express.Application,
	userDB: Low<Types.User[]>,
	lynkDB: Low<Types.Lynk[]>
) {
	app.delete('/api/deleteUser', deleteUserLimiter, async (req, res) => {
		const user: Types.UserStripped = req.body.user;

		// login
		await userDB.read();

		const foundUser = userDB.data.find((u) => u.email === user.email);

		if (foundUser) {
			const match = await bcrypt.compare(
				user.password,
				foundUser.password
			);

			if (match) {
				// delete user
				await userDB.read();

				userDB.data.splice(
					userDB.data.findIndex((u) => u.email === user.email),
					1
				);

				await userDB.write();

				// delete all of their lynks

				await lynkDB.read();
				await userDB.read();

				const fList = lynkDB.data.filter(
					(l) => l.ownerID === foundUser.id
				);

				for await (const fLynk of fList) {
					lynkDB.data.splice(
						lynkDB.data.findIndex((l) => l.id === fLynk.id),
						1
					);
				}

				// const theirLynksStr = foundUser.lynks;

				// for await (const lynkString of theirLynksStr) {
				// 	const fLynk = lynkDB.data.find((l) => l.id === lynkString);
				// 	lynkDB.data.splice(
				// 		lynkDB.data.findIndex((l) => l.id === fLynk.id),
				// 		1
				// 	);
				// }

				await lynkDB.write();

				res.status(200);
				res.redirect('/');
			} else {
				res.status(403);
				res.send('Incorrect email or password');
			}
		} else {
			res.status(403);
			res.send('Incorrect email or password');
		}
	});
}

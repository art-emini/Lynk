import * as express from 'express';
import { Low } from '../../packages/lowdb';
import Types from '../../types/types';
import * as bcrypt from 'bcrypt';

export default function loginUser(
	app: express.Application,
	userDB: Low<Types.User[]>
) {
	app.post('/api/login', async (req, res) => {
		const user: Types.UserStripped = req.body.user;

		await userDB.read();

		const foundUser = userDB.data.find((u) => u.email === user.email);

		if (foundUser) {
			const match = await bcrypt.compare(
				user.password,
				foundUser.password
			);

			if (match) {
				res.status(200);
				res.redirect(`/api/auth/${foundUser.token}`);
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

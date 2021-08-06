import * as express from 'express';
import { Low } from '../../packages/lowdb';
import Types from '../../types/types';
import * as bcrypt from 'bcrypt';
import randomID from '../../utils/randomID';

export default function generateToken(
	app: express.Application,
	userDB: Low<Types.User[]>
) {
	app.post('/api/generateToken', async (req, res) => {
		const user: Types.UserStripped = req.body.user;

		await userDB.read();

		const foundUser = userDB.data.find((u) => u.email === user.email);

		if (foundUser) {
			const match = await bcrypt.compare(
				user.password,
				foundUser.password
			);

			if (match) {
				const token = randomID(75);

				await userDB.read();

				userDB.data.find((u) => u.email === foundUser.email).token =
					token;

				await userDB.write();

				res.status(200);
				res.send(token);
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

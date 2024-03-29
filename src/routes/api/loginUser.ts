import * as express from 'express';
import { Low } from '../../packages/lowdb';
import Types from '../../types/types';
import * as bcrypt from 'bcrypt';
import dateDiff from '../../utils/dateDiff';
import randomID from '../../utils/randomID';

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

			let token = foundUser.token;

			// check if last login in days was over 7 days
			if (dateDiff(new Date(foundUser.lastLogin), new Date()) > 7) {
				token = randomID(75);

				await userDB.read();

				userDB.data.find((u) => u.email === user.email).token = token;
				userDB.data.find((u) => u.email === user.email).lastLogin =
					Number(new Date());

				await userDB.write();

				console.log(
					'Generated new token for user since last login was 7 days ago.'
				);
			}

			if (match) {
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

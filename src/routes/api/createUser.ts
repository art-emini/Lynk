import * as express from 'express';
import { Low } from '../../packages/lowdb';
import Types from '../../types/types';
import * as bcrypt from 'bcrypt';
import randomID from '../../utils/randomID';
import { createUserLimiter } from '../../middleware/rateLimit';

export default function createUser(
	app: express.Application,
	userDB: Low<Types.User[]>
) {
	app.post('/api/createUser', createUserLimiter, async (req, res) => {
		const user: Types.UserStripped = req.body.user;

		// check if email is in use
		await userDB.read();

		const fUser = userDB.data.find((u) => u.email === user.email);

		if (!fUser) {
			const hashed = await bcrypt.hash(user.password, 10);
			const token = randomID(75);

			await userDB.read();

			userDB.data.push({
				id: randomID(15),
				email: user.email,
				password: hashed,
				token,
				lastLogin: Number(new Date()),
			});

			await userDB.write();

			res.status(200);
			res.send(token);
			return;
		} else {
			res.status(409);
			res.send('Email already in use.');
			return;
		}
	});
}

import * as express from 'express';
import { Low } from '../../packages/lowdb';
import Types from '../../types/types';

export default function loginToken(
	app: express.Application,
	userDB: Low<Types.User[]>
) {
	app.post('/api/loginToken', async (req, res) => {
		const userToken: string = req.body.token;

		await userDB.read();

		const foundUser = userDB.data.find((u) => u.token === userToken);

		if (foundUser) {
			res.status(200);
			res.redirect(`/api/auth/${foundUser.token}`);
			console.log('Authenticating User with loginToken route.');
		} else {
			res.status(403);
			res.send('Incorrect email or password');
		}
	});
}

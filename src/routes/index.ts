import * as express from 'express';
import path = require('path');
import { Low } from '../packages/lowdb';
import Types from '../types/types';

// routes
import auth from './api/auth';
import createLynk from './api/createLynk';
import createUser from './api/createUser';
import deleteLynk from './api/deleteLynk';
import deleteMass from './api/deleteMass';
import deleteUser from './api/deleteUser';
import editLynk from './api/editLynk';
import generateToken from './api/generateToken';
import loginToken from './api/loginToken';
import loginUser from './api/loginUser';
import getDate from './api/res/getDate';
import getStats from './api/res/getStats';
import account from './common/account';
import lynk from './common/lynk';

export default function routes(
	app: express.Application,
	lynkDB: Low<Types.Lynk[]>,
	userDB: Low<Types.User[]>
) {
	app.use(express.static(path.join(__dirname + '/../../public')));

	// -------- api

	// get
	lynk(app, lynkDB);
	auth(app, userDB);
	account(app, userDB);

	// post
	createLynk(app, lynkDB, userDB);
	createUser(app, userDB);
	loginUser(app, userDB);
	loginToken(app, userDB);

	getStats(app, lynkDB, userDB);
	getDate(app, lynkDB, userDB);

	generateToken(app, userDB);

	// delete
	deleteLynk(app, lynkDB, userDB);
	deleteMass(app, lynkDB, userDB);
	deleteUser(app, userDB, lynkDB);

	// patch
	editLynk(app, userDB, lynkDB);

	// -------- end api
}

/* eslint-disable @typescript-eslint/no-var-requires */
// dependencies
import * as express from 'express';
import { Socket, Server } from 'socket.io';
import { createServer } from 'http';
import { JSONFile, Low } from './packages/lowdb';
import path = require('path');

// others
import middleware from './middleware';
import routes from './routes';

// type refs
import Types from './types/types';

// setup
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// db
const userFile = path.join(__dirname + '/../db/users.json');
const userAdapter = new JSONFile<Types.User[]>(userFile);
const userDB = new Low<Types.User[]>(userAdapter);

const lynkFile = path.join(__dirname + '/../db/lynks.json');
const linkAdapter = new JSONFile<Types.Lynk[]>(lynkFile);
const lynkDB = new Low<Types.Lynk[]>(linkAdapter);

// variables
const port = process.env.PORT || 8080;

// middleware
middleware(app);

// routes
routes(app, lynkDB, userDB);

// socket io
io.on('connection', (socket: Socket) => {
	socket.emit('console', 'Connected to server.');
});

// server listen

httpServer.listen(port, () => {
	console.log(`Server listening on *:${port}.`);
});

import * as cors from 'cors';
import * as helmet from 'helmet';
import * as express from 'express';
import { lynkViewLimiter } from './rateLimit';
import * as morgan from 'morgan';

export default function middleware(app: express.Application) {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cors());
	app.use(helmet());
	app.use(morgan(':method :url :status :response-time ms'));

	app.use('/url', lynkViewLimiter);
}

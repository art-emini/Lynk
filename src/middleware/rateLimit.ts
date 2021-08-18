import * as rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
	windowMs: 1000 * 60 * 15,
	max: 7,
	message:
		'You have reached the max amount of auth calls. Please try again later.',
});

export const createLynkLimiter = rateLimit({
	windowMs: 1000 * 60 * 5,
	max: 5,
	message:
		'You have reached the max amount of createLynk calls. Please try again later.',
});

export const deleteLynkLimiter = rateLimit({
	windowMs: 1000 * 60 * 10,
	max: 15,
	message:
		'You have reached the max amount of deleteLynk calls. Please try again later.',
});

export const deleteUserLimiter = rateLimit({
	windowMs: 1000 * 60 * 5,
	max: 1,
	message:
		'You have reached the max amount of deleteUser calls. Please try again later.',
});

export const createUserLimiter = rateLimit({
	windowMs: 1000 * 60 * 5,
	max: 2,
	message:
		'You have reached the max amount of createUser calls. Please try again later.',
});

export const lynkViewLimiter = rateLimit({
	windowMs: 1000 * 60 * 15,
	max: 10,
	message:
		'You have reached the max amount of lynkView calls. Please try again later.',
});

export const accountViewLimiter = rateLimit({
	windowMs: 1000 * 60 * 10,
	max: 20,
	message:
		'You have reached the max amount of account calls. Please try again later.',
});

export const editLynkLimiter = rateLimit({
	windowMs: 1000 * 60 * 10,
	max: 10,
	message:
		'You have reached the max amount of editLynk calls. Please try again later.',
});

export const getStatsLimiter = rateLimit({
	windowMs: 1000 * 60 * 15,
	max: 100,
	message:
		'You have reached the max amount of getStats calls. Please try again later.',
});

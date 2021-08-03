import * as rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
	windowMs: 1000 * 60 * 15,
	max: 7,
	message:
		'You have reached the max amount of auth calls in 15 minutes. Please try again later.',
});

export const createLynkLimiter = rateLimit({
	windowMs: 1000 * 60 * 15,
	max: 10,
	message:
		'You have reached the max amount of createLynk calls in 15 minutes. Please try again later.',
});

export const deleteLynkLimiter = rateLimit({
	windowMs: 1000 * 60 * 15,
	max: 15,
	message:
		'You have reached the max amount of deleteLynk calls in 15 minutes. Please try again later.',
});

export const deleteUserLimiter = rateLimit({
	windowMs: 1000 * 60 * 15,
	max: 2,
	message:
		'You have reached the max amount of deleteUser calls in 15 minutes. Please try again later.',
});

export const createUserLimiter = rateLimit({
	windowMs: 1000 * 60 * 15,
	max: 2,
	message:
		'You have reached the max amount of createUser calls in 15 minutes. Please try again later.',
});

export const lynkViewLimiter = rateLimit({
	windowMs: 1000 * 60 * 15,
	max: 10,
	message:
		'You have reached the max amount of lynkView calls in 15 minutes. Please try again later.',
});

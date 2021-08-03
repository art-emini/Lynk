console.log(`Auth, ${location.pathname.replace('/api/auth/', '')}`);
localStorage.setItem(
	'lynk-security-session-token',
	location.pathname.replace('/api/auth/', '')
);
setTimeout(async () => {
	location.href =
		location.origin +
		`/account/${localStorage.getItem('lynk-security-session-token')}`;
}, 250);

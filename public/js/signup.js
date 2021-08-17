const socket = io();

socket.on('console', (msg) => console.log(msg));

const signUpForm = document.getElementById('signUpForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

const results = document.getElementById('results');

signUpForm.onsubmit = async (e) => {
	e.preventDefault();

	if (!strongPass(passwordInput.value)) {
		results.innerHTML =
			'Password must contain at least 8 characters consisting of, 1+ lowercase, 1+ uppercase, and 1+ special characters.';

		return;
	}

	try {
		const res = await axios.post(location.origin + '/api/createUser', {
			user: {
				email: emailInput.value,
				password: passwordInput.value,
			},
		});

		results.innerHTML = 'Created Account! Logging in..';
		setTimeout(() => {
			location.href = location.origin + `/api/auth/${res.data}`;
		}, 250);
	} catch (error) {
		if (!strongPass(passwordInput.value)) {
			results.innerHTML =
				'Password must contain at least 8 characters consisting of, 1+ lowercase, 1+ uppercase, and 1+ special characters.';
		} else {
			results.innerHTML = 'Email already in use.';
		}
	}
};

io = undefined;

function strongPass(pass) {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
		pass
	);
}

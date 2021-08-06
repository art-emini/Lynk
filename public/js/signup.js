const socket = io();

socket.on('console', (msg) => console.log(msg));

const signUpForm = document.getElementById('signUpForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

const results = document.getElementById('results');

signUpForm.onsubmit = async (e) => {
	e.preventDefault();

	try {
		const res = await axios.post(location.origin + '/api/createUser', {
			user: {
				email: emailInput.value,
				password: passwordInput.value,
			},
		});

		results.innerHTML = 'Logging in..';
		setTimeout(() => {
			location.href = location.origin + `/api/auth/${res.data}`;
		}, 250);
	} catch (error) {
		results.innerHTML = 'Email already in use.';
	}
};

io = undefined;

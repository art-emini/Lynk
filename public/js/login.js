const socket = io();

socket.on('console', (msg) => console.log(msg));

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

const results = document.getElementById('results');

loginForm.onsubmit = async (e) => {
	e.preventDefault();

	try {
		const res = await axios.post(location.origin + '/api/login', {
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
		results.innerHTML = 'Incorrect email or password.';
	}
};

io = undefined;

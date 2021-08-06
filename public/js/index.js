const socket = io();
const sessionToken = localStorage.getItem('lynk-security-session-token');
const form = document.querySelector('form');
const inputURL = document.getElementById('redirectLink');
const result = document.getElementById('result');

const accountPage = document.getElementById('accountPage');
const loginPage = document.getElementById('loginPage');
const signupPage = document.getElementById('signUpPage');

socket.on('console', (msg) => console.log(msg));

// check if token is valid
(async function () {
	try {
		const res = await axios.post(location.href + 'api/loginToken', {
			token: sessionToken,
		});
		console.log('Logged in.');
		loginPage.style.display = 'none';
		signupPage.style.display = 'none';
	} catch (error) {
		localStorage.setItem('lynk-security-session-token', undefined);
		console.log('Invalid Login. Set session token as undefined.');
		accountPage.style.display = 'none';
	}
})();

form.onsubmit = async (e) => {
	e.preventDefault();
	if (sessionToken) {
		const res = await axios.post(location.href + 'api/createLynk', {
			token: sessionToken,
			redirectUrl: inputURL.value,
		});
		const link = res.data.replace('Created Lynk. ', '');
		result.innerHTML = link;
		result.href = link;
	} else {
		location.href = location.href + 'login';
	}
};

accountPage.href = location.href + `account/${sessionToken}/analytics`;

io = undefined;

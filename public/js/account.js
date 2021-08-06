const socket = io();
const sessionToken = localStorage.getItem('lynk-security-session-token');

const analyticsPage = document.getElementById('analyticsPage');
const lynksPage = document.getElementById('lynksPage');
const createLynkPage = document.getElementById('createLynkPage');
const manageLynksPage = document.getElementById('manageLynksPage');
const manageAccountPage = document.getElementById('manageAccountPage');

const pageHeader = document.getElementById('pageHeader');

const tableAnalytics = document.getElementById('analyticsTable');
const tableBodyAnalytics = document.getElementById('tableBodyAnalytics');

const tableDaily = document.getElementById('dailyTable');
const tableBodyDaily = document.getElementById('tableBodyDaily');

const dateForm = document.getElementById('dateForm');
const dateInput = document.getElementById('dateInput');

const urlForm = document.getElementById('urlForm');
const redirectLink = document.getElementById('redirectLink');
const sourceInput = document.getElementById('sourceInput');
const result = document.getElementById('result');

const formConfirmContainer = document.getElementById('formConfirmContainer');
const formDelete = document.getElementById('formDelete');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

(async function () {
	// check if token is valid
	try {
		const res = await axios.post(location.origin + '/api/loginToken', {
			token: sessionToken,
		});

		console.log('Logged in.');

		analyticsPage.href =
			location.origin + `/account/${sessionToken}/analytics`;
		lynksPage.href = location.origin + `/account/${sessionToken}/lynks`;
		createLynkPage.href =
			location.origin + `/account/${sessionToken}/createLynk`;
		manageLynksPage.href =
			location.origin + `/account/${sessionToken}/manageLynks`;
		manageAccountPage.href =
			location.origin + `/account/${sessionToken}/manageAccount`;
	} catch (error) {
		console.error(error);
		localStorage.setItem('lynk-security-session-token', undefined);
		console.log('Invalid Login. Set session token as undefined.');
		location.href = location.origin + '/pages/login';
	}
	// get stats

	const res = await axios.post(location.origin + '/api/res/getStats', {
		token: sessionToken,
	});

	const data = res.data;

	const page = location.href
		.replace(`/account/${sessionToken}`, '')
		.replace(location.origin, '')
		.replace('/', '');

	switch (page) {
		case 'analytics':
			// All Time
			for (let i = 0; i < data.lynks.length; i++) {
				const tr = document.createElement('tr');
				const th = document.createElement('th');

				const url = document.createElement('td');
				const redirectUrl = document.createElement('td');
				const visits = document.createElement('td');
				const popularSource = document.createElement('td');
				const dateCreated = document.createElement('td');

				const modeSource = mode(data.lynks[i].meta.sources);

				url.innerHTML = `<a href=${data.lynks[i].url} target="_blank" class="a-color">${data.lynks[i].url}</a>`;
				redirectUrl.innerHTML = `<a href=${data.lynks[i].redirectUrl} target="_blank" class="a-color">${data.lynks[i].redirectUrl}</a>`;
				visits.innerHTML = data.lynks[i].meta.visits;
				dateCreated.innerHTML = data.lynks[i].meta.dateCreated;

				if (modeSource) {
					popularSource.innerHTML = modeSource;
				} else {
					popularSource.innerHTML = 'N/A';
				}

				th.innerHTML = tableAnalytics.rows.length;
				th.scope = 'row';

				tr.appendChild(th);
				tr.appendChild(url);
				tr.appendChild(redirectUrl);
				tr.appendChild(visits);
				tr.appendChild(popularSource);
				tr.appendChild(dateCreated);

				tableBodyAnalytics.appendChild(tr);
			}

			// Daily
			dateForm.onsubmit = async (e) => {
				e.preventDefault();

				// remove rows first
				const oldRows = tableBodyDaily.querySelectorAll('tr');
				oldRows.forEach((row) => {
					row.remove();
				});

				// get stats

				const dailyRes = await axios.post(
					location.origin + '/api/res/getDate',
					{
						token: sessionToken,
						date: dateInput.value,
					}
				);

				const dailyData = dailyRes.data;

				for (let i = 0; i < dailyData.days.length; i++) {
					const day = dailyData.days[i];

					const tr = document.createElement('tr');
					const th = document.createElement('th');

					const url = document.createElement('td');
					const redirectUrl = document.createElement('td');
					const visits = document.createElement('td');
					const popularSource = document.createElement('td');

					const modeSource = mode(day.sources);

					url.innerHTML = `<a href=${day.parentURL} target="_blank" class="a-color">${day.parentURL}</a>`;
					redirectUrl.innerHTML = `<a href=${day.parentRedirect} target="_blank" class="a-color">${day.parentRedirect}</a>`;
					visits.innerHTML = day.visits;

					if (modeSource) {
						popularSource.innerHTML = modeSource;
					} else {
						popularSource.innerHTML = 'N/A';
					}

					th.innerHTML = tableDaily.rows.length;
					th.scope = 'row';

					tr.appendChild(th);
					tr.appendChild(url);
					tr.appendChild(redirectUrl);
					tr.appendChild(visits);
					tr.appendChild(popularSource);

					tableBodyDaily.appendChild(tr);
				}
			};
			break;

		case 'lynks':
			for (let i = 0; i < data.lynks.length; i++) {
				const lynk = data.lynks[i];

				const tr = document.createElement('tr');
				const th = document.createElement('th');

				const url = document.createElement('td');
				const redirectUrl = document.createElement('td');

				url.innerHTML = `<a href=${lynk.url} target="_blank" class="a-color">${lynk.url}</a>`;
				redirectUrl.innerHTML = `<a href=${lynk.redirectUrl} target="_blank" class="a-color">${lynk.redirectUrl}</a>`;

				th.innerHTML = tableAnalytics.rows.length;
				th.scope = 'row';

				tr.appendChild(th);
				tr.appendChild(url);
				tr.appendChild(redirectUrl);

				tableAnalytics.appendChild(tr);
			}
			break;

		case 'createLynk':
			urlForm.onsubmit = async (e) => {
				e.preventDefault();

				if (!validateUrl(redirectLink.value)) {
					result.innerHTML =
						'Invalid URL. URL must include protocol. (http, https, ftp)';
					return;
				}

				if (sessionToken) {
					const res = await axios.post(
						location.origin + '/api/createLynk',
						{
							token: sessionToken,
							redirectUrl: redirectLink.value,
						}
					);

					let link = res.data.replace('Created Lynk. ', '');

					if (sourceInput.value.trim().length > 0) {
						const str = link;
						str.substr(-1);
						if (str === '/') {
							link = link.slice(0, -1);
						}
						link += `?source=${sourceInput.value}`;
					}

					result.innerHTML = link;
					result.href = link;
				} else {
					location.href = location.href + 'login';
				}
			};
			break;

		case 'manageLynks':
			for (let i = 0; i < data.lynks.length; i++) {
				const lynk = data.lynks[i];

				const tr = document.createElement('tr');
				const th = document.createElement('th');

				const url = document.createElement('td');
				const redirectUrl = document.createElement('td');
				const actionTD = document.createElement('td');

				const deleteBTN = document.createElement('button');
				deleteBTN.classList.add('btn', 'btn-danger');
				deleteBTN.innerHTML = 'Delete';

				const editButton = document.createElement('button');
				editButton.classList.add('btn', 'btn-warning', 'mr-sm-3');
				editButton.innerHTML = 'Edit';

				actionTD.appendChild(editButton);
				actionTD.appendChild(deleteBTN);

				url.innerHTML = `<a href=${lynk.url} target="_blank" class="a-color">${lynk.url}</a>`;
				redirectUrl.innerHTML = `<a href=${lynk.redirectUrl} target="_blank" class="a-color">${lynk.redirectUrl}</a>`;

				th.innerHTML = tableAnalytics.rows.length;
				th.scope = 'row';

				tr.appendChild(th);
				tr.appendChild(url);
				tr.appendChild(redirectUrl);
				tr.appendChild(actionTD);

				tableAnalytics.appendChild(tr);

				editButton.onclick = function () {
					editLynk(actionTD.parentElement.rowIndex);
				};

				deleteBTN.onclick = function () {
					deleteLynk(actionTD.parentElement.rowIndex);
				};
			}
			break;

		case 'manageAccount':
			document.getElementById('deleteBTN').onclick =
				function deleteAccount() {
					formConfirmContainer.classList.remove('hidden');
				};

			document.getElementById('logOutBTN').onclick = logOut;

			document.getElementById('generateTokenBTN').onclick = generateToken;

			const deleteAccountResults = document.getElementById(
				'deleteAccountResults'
			);

			formDelete.onsubmit = async (e) => {
				e.preventDefault();

				const confirm = window.confirm(
					'Are you sure you would like to delete your Lynk account? All of your lynks will be deleted. There is no way to recover your account or lynks.'
				);

				const url = location.origin;

				if (!confirm) {
					return;
				}

				try {
					const res = await axios.delete(url + '/api/deleteUser', {
						data: {
							user: {
								email: emailInput.value,
								password: passwordInput.value,
							},
						},
					});

					if (res.status === 200) {
						deleteAccountResults.innerHTML =
							'Deleted account and all links.';

						setTimeout(() => {
							localStorage.setItem(
								'lynk-security-session-token',
								undefined
							);
							location.href = location.origin;
						}, 500);
					}
				} catch (error) {
					deleteAccountResults.innerHTML =
						'Incorrect email or password.';
				}
			};
			break;

		default:
			break;
	}
})();

socket.on('console', (msg) => console.log(msg));

io = undefined;

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function mode(arr) {
	return arr
		.sort(
			(a, b) =>
				arr.filter((v) => v === a).length -
				arr.filter((v) => v === b).length
		)
		.pop();
}

function validateUrl(value) {
	return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
		value
	);
}

async function editLynk(row) {
	const lynkID = tableAnalytics.rows[
		row
	].children[1].children[0].href.replace(location.origin + '/', '');

	let redirectURL = window.prompt('RedirectURL: ');

	if (!validateUrl(redirectURL)) {
		return;
	}

	const a = tableAnalytics.rows[row].children[2].children[0];

	a.href = redirectURL;
	a.innerHTML = redirectURL;

	const res = await axios.patch(location.origin + '/api/editLynk', {
		token: sessionToken,
		lynkID,
		redirectURL,
	});
}

async function deleteLynk(row) {
	const lynkID = tableAnalytics.rows[
		row
	].children[1].children[0].href.replace(location.origin + '/', '');

	const confirm = window.confirm(
		'Are you sure that you want to delete this lynk?'
	);

	if (confirm) {
		const res = await axios.delete(location.origin + '/api/deleteLynk', {
			data: {
				token: sessionToken,
				lynkID,
			},
		});

		if (res.status === 200) {
			tableAnalytics.rows[row].remove();

			let otherRows = [].slice.call(tableAnalytics.rows);
			otherRows.splice(0, 1);

			otherRows.forEach((row) => {
				let number = Number(row.children[0].innerHTML);
				row.children[0].innerHTML = number -= 1;
			});
		}
	}
}

function logOut() {
	localStorage.setItem('lynk-security-session-token', undefined);
	location.href = location.origin;
}

async function generateToken() {
	const email = window.prompt('Email:');
	const password = window.prompt('Password:');

	try {
		const res = await axios.post(location.origin + '/api/generateToken', {
			user: {
				email,
				password,
			},
		});

		if (res.status === 200) {
			document.getElementById('manageAccountResults').innerHTML =
				'Logged out of all session. Re-Logging in with new token..';
			setTimeout(() => {
				location.href = location.origin + `/api/auth/${res.data}`;
			}, 250);
		}
	} catch (error) {
		document.getElementById('manageAccountResults').innerHTML =
			'Incorrect Email or Password';
	}
}

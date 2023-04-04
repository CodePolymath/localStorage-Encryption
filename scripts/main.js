let passphrase;

document.addEventListener("DOMContentLoaded", () => {
	let strItemName = 'encrypted-1';
	let data = localStorage.getItem(strItemName);
	let counter = 1;
	let ulLocalStorage = document.querySelector('#ulLocalStorage');
	while (data) {
		let newLI = document.createElement('li');
		newLI.innerHTML = data;
		ulLocalStorage.appendChild(newLI);
		counter +=1;
		strItemName = strItemName.replace(/\d*$/,counter.toString());
		data = localStorage.getItem(strItemName);
	}
	let inpUserName1 = document.querySelector('#inpUserName1');
	let inpData = document.querySelector('#inpData');
	let inpUserName2 = document.querySelector('#inpUserName2');

	document.querySelector('#inpPassword1').addEventListener('keydown', (e) => {
		if (e.keyCode === 13) {
			clickSet();
		}
	});
	inpData.addEventListener('keydown', (e) => {
		if (e.keyCode === 13) {
			clickSave();
		}
	});
	document.querySelector('#inpPassword2').addEventListener('keydown', (e) => {
		if (e.keyCode === 13) {
			clickDecrypt();
		}
	});
	document.querySelector('#btnSet').addEventListener('click', clickSet);
	document.querySelector('#btnSave').addEventListener('click', clickSave);
	document.querySelector('#btnDecrypt').addEventListener('click', clickDecrypt);

	function clickSet() {
		let username = inpUserName1.value;
		let password = document.querySelector('#inpPassword1').value;
		if (username.length === 0 || password.length === 0){
			console._log('No username or password');
			alert('Please enter a UserName and Password.');
			inpUserName1?.focus();
			return;
		}
		passphrase = CryptoJS.SHA1(username + password).toString();
		clearLocalStorage();

		let span = document.querySelector('#spnPassphrase');
		span.classList.remove('displayNone');
		setTimeout(() => {
			span.classList.add('fadeOut');
			setTimeout(() => {
				span.classList.add('displayNone').classList.remove('fadeOut');
			},2100);
		},3000);
		console._log(passphrase);

		sessionStorage.setItem('passphrase', passphrase);
		let encrypted = CryptoJS.AES.encrypt('SUCCESS!', passphrase).toString(); // a simple phrase used to text expected output of AES decryption
		console._log(encrypted);

		localStorage.setItem('itemKey',encrypted);
		inpData?.focus();
	};
	function clickSave() {
		let data = inpData.value;
		if (typeof passphrase === 'undefined' || passphrase.length === 0){
  		sessionStorage.getItem('passphrase', passphrase);
		}

		if (passphrase === null || passphrase?.length === 0){
			alert('Sorry, there is no passphrase stored. Please set a UserName and Password first.');
			inpUserName1?.focus();
			console._log('no passphrase');
			return;
		}
		if (data === null || data.length === 0){
			alert('Please enter some data to store first.');
			inpData?.focus();
			console._log('no data entered');
			return;
		}
		let itemKey = localStorage.getItem('itemKey');
		if (itemKey === null || itemKey.length === 0){
			let encrypted1 = CryptoJS.AES.encrypt('SUCCESS!', passphrase).toString();
			console._log(encrypted1);

			localStorage.setItem('itemKey',encrypted1);
		}

		let counter = localStorage.length;
		let encrypted = CryptoJS.AES.encrypt(data, passphrase).toString();
		localStorage.setItem('encrypted-' + counter.toString(), encrypted);
		let newLI = document.createElement('li');
		newLI.innerHTML = encrypted;
		ulLocalStorage?.appendChild(newLI);
		inpData.value = '';
		inpData?.focus();

	};
	function clickDecrypt() {
		let username = inpUserName2.value;
		let password = document.querySelector('#inpPassword2').value;

		if (username.length === 0 || password.length === 0){
			alert('Please enter your UserName and Password');
			inpUserName2?.focus();
			console._log('No username or password');
			return;
		}
		let length = localStorage.length;
		if (length < 2){
			alert('You haven\'t stored any data yet. Please store some data and try again.');
			inpData?.focus();
			return;
		}
		passphrase = CryptoJS.SHA1(username + password).toString();
		console._log(passphrase);
		let testItem;
		try {
			testItem = CryptoJS.AES.decrypt(localStorage.getItem('itemKey'), passphrase).toString(CryptoJS.enc.Utf8);
		}
		catch (e) {
			alert('Sorry, that\'s not the correct UserName or Password. Please try again.');
			inpUserName2?.focus();
			return;
		}
		if (testItem !== 'SUCCESS!') {
			alert('Sorry, that\'s not the correct UserName or Password. Please try again.');
			inpUserName2?.focus();
			return;
		}

		ulLocalStorage2.innerHTML = '';

		let decrypted = '';
		let item = '';
		let fragment = document.createDocumentFragment();
		for (let i = 1; i < length; i++){
			item = 'encrypted-' + i.toString();
			decrypted = CryptoJS.AES.decrypt(localStorage.getItem(item), passphrase).toString(CryptoJS.enc.Utf8);
			let newLI = document.createElement('li');
			newLI.innerHTML = decrypted;
			fragment.appendChild(newLI);
		}
		ulLocalStorage2.append(fragment);
	};

	document.querySelector('#btnClearStorage').addEventListener('click', () => {
		let response = confirm('Are you sure? This will delete all your data in LocalStorage.');
		if (!response){
			return;
		}
		clearLocalStorage();

	});
	document.querySelector('#btnReset').addEventListener('click', () => {
		let response = confirm('Are you sure? This will delete and reset everything!');
		if (!response){
			return;
		}

		let inputs = document.getElementsByTagName('input');
		for (let i = 0; i < inputs.length; i++){
			inputs[i].value = '';
		}
  	sessionStorage.removeItem('passphrase');
		clearLocalStorage();
	});

	inpUserName1?.focus();

});
/* END DOCUMENT READY */
function clearLocalStorage(){
	document.querySelector('#ulLocalStorage').innerHTML = '';
	document.querySelector('#ulLocalStorage2').innerHTML = '';

	localStorage.clear();
}

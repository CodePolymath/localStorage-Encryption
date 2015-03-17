var passphrase;

$(document).ready(function(){
	$('#btnSet').on('click',function(){
		var username = $('#inpUserName1').val();
		var password = $('#inpPassword1').val();
		if (username.length === 0 || password.length === 0){
			console._log('No username or password');
			alert('Please enter a UserName and Password.');
			$('#inpUserName1').focus();
			return;
		}
		passphrase = CryptoJS.SHA1(username + password).toString();
		clearLocalStorage();

		var span = $('#spnPassphrase');
		span.removeClass('displayNone');
		setTimeout(function(){
			span.addClass('fadeOut');
			setTimeout(function(){
				span.addClass('displayNone').removeClass('fadeOut');
			},2100);
		},3000);
		console._log(passphrase);

		$.cookie('passphrase',passphrase);
		var encrypted = CryptoJS.AES.encrypt('SUCCESS!', passphrase).toString();
		console._log(encrypted);

		localStorage.setItem('itemKey',encrypted);
		$('#inpData').focus();

	});
	$('#btnSave').on('click',function(){
		var data = $('#inpData').val();
		if (passphrase === undefined || passphrase.length === 0){
			passphrase = $.cookie('passphrase');
		}

		if (passphrase === null || passphrase.length === 0){
			alert('Sorry, there is no passphrase stored. Please set a UserName and Password first.');
			$('#inpUserName1').focus();
			console._log('no passphrase');
			return;
		}
		if (data === null || data.length === 0){
			alert('Please enter some data to store first.');
			$('#inpData').focus();
			console._log('no data entered');
			return;
		}
		var itemKey = localStorage.getItem('itemKey');
		if (itemKey === null || itemKey.length === 0){
			var encrypted1 = CryptoJS.AES.encrypt('SUCCESS!', passphrase).toString();
			console._log(encrypted1);

			localStorage.setItem('itemKey',encrypted1);
		}

		var counter = localStorage.length;
		var encrypted = CryptoJS.AES.encrypt(data, passphrase).toString();
		localStorage.setItem('encrypted-' + counter.toString(), encrypted);
		var newLI = document.createElement('li');
		newLI.innerHTML = encrypted;
		$('#ulLocalStorage').append(newLI);
		$('#inpData').val('').focus();

	});
	$('#btnDecrypt').on('click',function(){
		var username = $('#inpUserName2').val();
		var password = $('#inpPassword2').val();
		$('#ulLocalStorage2').html('');

		if (username.length === 0 || password.length === 0){
			alert('Please enter your UserName and Password');
			$('#inpUserName2').focus();
			console._log('No username or password');
			return;
		}
		var length = localStorage.length;
		if (length < 2){
			alert('You haven\'t stored any data yet. Please store some data and try again.');
			$('#inpData').focus();
			return;
		}
		passphrase = CryptoJS.SHA1(username + password).toString();
		console._log(passphrase);
		var testItem;
		try {
			testItem = CryptoJS.AES.decrypt(localStorage.getItem('itemKey'), passphrase).toString(CryptoJS.enc.Utf8);
		}
		catch (e) {
			alert('Sorry, that\'s not the correct UserName or Password. Please try again.');
			$('#inpUserName2').focus();
			return;
		}
		if (testItem !== 'SUCCESS!') {
			alert('Sorry, that\'s not the correct UserName or Password. Please try again.');
			$('#inpUserName2').focus();
			return;
		}

		var decrypted = '';
		var item = '';
		for (var i = 1; i < length; i++){
			item = 'encrypted-' + i.toString();
			decrypted = CryptoJS.AES.decrypt(localStorage.getItem(item), passphrase).toString(CryptoJS.enc.Utf8);
			var newLI = document.createElement('li');
			newLI.innerHTML = decrypted;
			$('#ulLocalStorage2').append(newLI);
		}

	});

	$('#btnClearStorage').on('click',function(){
		var response = confirm('Are you sure? This will delete all your data in LocalStorage.');
		if (!response){
			return;
		}
		clearLocalStorage();

	});
	$('#btnReset').on('click',function(){
		var response = confirm('Are you sure? This will delete and reset everything!');
		if (!response){
			return;
		}

		var inputs = document.getElementsByTagName('input');
		for (var i = 0; i < inputs.length; i++){
			inputs[i].value = '';
		}
		$.cookie('passphrase',null);
		clearLocalStorage();
	});

	$('#inpUserName1').focus();

});
/* END DOCUMENT READY */
function clearLocalStorage(){
	$('#ulLocalStorage').html('');
	$('#ulLocalStorage2').html('');

	localStorage.clear();
}

'use strict';

//Wait for document to load and be stable
if(window.addEventListener){//WC3
	window.addEventListener('load', init, false);
}
else if(window.attachEvent){//older IE
	window.attachEvent('onload', init);
}

function init(){
	//Adds listeners to buttons after HTML is loaded and stable.
	
	//set event listeners
	addListener($("login_button"), "click", attemptLogin);
	
	//Add JSON library if browser doesn't already support it.
	if(typeof JSON == 'undefined'){
		var script = document.createElement('script');
		script.src = 'json2.js';
		document.getElementsByTagName('head')[0].appendChild(script);
	}
}

function addListener(obj, type, fn){
	if(obj && obj.addEventListener){//WC3
		obj.addEventListener(type, fn, false);
	}
	else if(obj && obj.obj.attachEvent){//older IE
		obj.attachEvent('on' + type, fn)
	}
}

function $(theID){
	//return the element with the specified ID
	if(typeof theID == 'string')
		return document.getElementById(theID);
}

function getAjaxObj(){
	var ajax = null;
	if(window.XMLHttpRequest)
		ajax = new XMLHttpRequest();
	else if (window.ActiveXObject)//older IE
		ajax = new ActiveXObject('MSXML2.XMLHTTP3.0');
	
	return ajax;
}

function attemptLogin(){
	//Uses AJAX to authenticate credentials with the server.
	
//	var data = "playerName=" + $("login_username").value;
//				+ "&password=" + $("login_password").value;
//	var ajax = getAjaxObj();
	
//	ajax.open('POST', 'http://universe.tc.uvu.edu/cs2550/assignments/PasswordCheck/check.php', false);	//false makes it synchronous
//	ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//	ajax.send(data);
	
	//Testing server response, local file won't return 200
//	if(ajax.status == 200){
//		var dataSpan = $("login_message");
//		var responseJson = JSON.parse(ajax.responseText);
//		if(responseJson["result"] == 'valid'){
			localStorage.setItem('Name', $("login_username").value);
			localStorage.setItem('Wallet', 1000);
			localStorage.setItem('Wins', 0);
			localStorage.setItem('FlaggedMines', 0);
			localStorage.setItem('Losses', 0);
//			localStorage.setItem('password', $("login_password").value);
//			localStorage.setItem('cs2550timestamp', responseJson["userName"] + " " + responseJson['timestamp']);
			window.location = "./Sweeper.html";
//		}
//		else {
//			dataSpan.style.color = "red";
//			dataSpan.innerHTML = "There was an error logging in.";
//		}
//	}
}
var animationIMG;
var msPerFrame = 50;
var margin = 30;
var myLeft = 0;
var myTop = 0;
var winWidth = window.innerWidth;
var winHeight = window.innerHeight;

function homeRun(){
	//alert("Width: " + window.innerWidth + "px, Height: " + window.innerHeight + "px");
	animationIMG = document.getElementById("animationIMG");
	
	moveRight();
}

function moveRight(){
	myLeft += 15;
	animationIMG.style.left = myLeft + "px";
	
	if(myLeft < winWidth - animationIMG.width - margin){
		setTimeout(moveRight, msPerFrame);
	}
	else {
		animationIMG.src = "img/2mines.png";
		setTimeout(moveDown, msPerFrame);
	}
}

function moveDown(){
	myTop += 15;
	animationIMG.style.top = myTop + "px";
	
	if(myTop < winHeight - animationIMG.height - margin){
		setTimeout(moveDown, msPerFrame);
	}
	else {
		animationIMG.src = "img/3mines.png";
		setTimeout(moveLeft, msPerFrame);
	}
}

function moveLeft(){
	myLeft -= 15;
	animationIMG.style.left = myLeft + "px";
	
	if(myLeft > margin){
		setTimeout(moveLeft, msPerFrame);
	}
	else {
		animationIMG.src = "img/4mines.png";
		setTimeout(moveUp, msPerFrame);
	}
}

function moveUp(){
	myTop -= 15;
	animationIMG.style.top = myTop + "px";
	
	if(myTop > margin){
		setTimeout(moveUp, msPerFrame);
	}
	else{
		document.getElementById("animationDIV").innerHTML = "<h1 style=\"color:red\">HOME RUN!</h1>";
	}
}
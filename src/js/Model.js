'use strict';

//Initiate Model object - not to be used by external codes.
var theGame = {
	gridRows: [],
	firstClick: true,
	width: 0,
	height: 0,
	mines: 0,
	minesLeft: 0,
	gameType: ""
};

//Wait for document to load and be stable
if(window.addEventListener){//WC3
	window.addEventListener('load', init, false);
}
else if(window.attachEvent){//older IE
	window.attachEvent('onload', init);
}

function init(){
	//Adds listeners to buttons after HTML is loaded and stable.
	
	//Add JSON script if it's not natively supported by the browser.
	if (typeof JSON == 'undefined'){
		var script = document.createElement('script');
		script.src = 'js/json2.js';
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	
	//load player stats from local storage.
	loadGameProgress();
	
	//set event listeners
	addListener($("bNewGame"), "click", startNewGame);
	addListener($("bLoadGame"), "click", loadGameFile);
	addListener($("difficultyChoice"), "change", toggleCustMenuDisplay);
}

function initTileListeners(){
	//Start up game related even listeners with new game.
	
	setFirstClick(true);
	
	$("gameGrid").addEventListener("contextmenu", function(e){
		e.preventDefault();
	}, false);
	var unexploredClass1 = $$("unexplored"); //returns an array
	var unexploredClass2 = $$("gr-unexplored");
	var maybeClass1 = $$("maybe"); //returns an array
	var maybeClass2 = $$("gr-maybe");
	var flaggedClass1 = $$("flagged"); //returns an array
	var flaggedClass2 = $$("gr-flagged");
	
	//////////////////////////////////////////////////
	//	This code can potentially be more efficient	//
	//////////////////////////////////////////////////
	for (var i = 0; i < unexploredClass1.length; i++){
		addListener(unexploredClass1[i], 'click', reveal);
		addListener(unexploredClass1[i], 'contextmenu', markTile);
	}
	for (var i = 0; i < unexploredClass2.length; i++){
		addListener(unexploredClass2[i], 'click', reveal);
		addListener(unexploredClass2[i], 'contextmenu', markTile);
	}
	
	//Will need to set these listeners if the player loads game.
	for (var i = 0; i < maybeClass1.length; i++){
		addListener(maybeClass1[i], 'click', reveal);
		addListener(maybeClass1[i], 'contextmenu', markTile);
	}
	for (var i = 0; i < unexploredClass2.length; i++){
		addListener(maybeClass2[i], 'click', reveal);
		addListener(maybeClass2[i], 'contextmenu', markTile);
	}
	for (var i = 0; i < unexploredClass1.length; i++){
		addListener(flaggedClass2[i], 'click', reveal);
		addListener(flaggedClass1[i], 'contextmenu', markTile);
	}
	for (var i = 0; i < unexploredClass2.length; i++){
		addListener(flaggedClass2[i], 'click', reveal);
		addListener(flaggedClass2[i], 'contextmenu', markTile);
	}
}

function deinitTileListeners(){
	//disable game related event listeners when the game ends.
	
	//Get all elements of the specified class stored in variables.
	var unexploredClass1 = $$("unexplored"); //returns an array
	var unexploredClass2 = $$("gr-unexplored");
	var maybeClass1 = $$("maybe"); //returns an array
	var maybeClass2 = $$("gr-maybe");
	var flaggedClass1 = $$("flagged"); //returns an array
	var flaggedClass2 = $$("gr-flagged");
	
	//////////////////////////////////////////////////
	//	This code can potentially be more efficient	//
	//////////////////////////////////////////////////
	for (var i = 0; i < unexploredClass1.length; i++){
		removeListener(unexploredClass1[i], 'click', reveal);
		removeListener(unexploredClass1[i], 'contextmenu', markTile);
	}
	for (var i = 0; i < unexploredClass2.length; i++){
		removeListener(unexploredClass2[i], 'click', reveal);
		removeListener(unexploredClass2[i], 'contextmenu', markTile);
	}
	for (var i = 0; i < maybeClass1.length; i++){
		removeListener(maybeClass1[i], 'click', reveal);
		removeListener(maybeClass1[i], 'contextmenu', markTile);
	}
	for (var i = 0; i < maybeClass2.length; i++){
		removeListener(maybeClass2[i], 'click', reveal);
		removeListener(maybeClass2[i], 'contextmenu', markTile);
	}
	for (var i = 0; i < flaggedClass1.length; i++){
		removeListener(flaggedClass1[i], 'contextmenu', markTile);
	}
	for (var i = 0; i < flaggedClass2.length; i++){
		removeListener(flaggedClass2[i], 'contextmenu', markTile);
	}
}

function setTheGame(height, width, mines, gameType){
	theGame.height = height;
	theGame.width = width;
	theGame.mines = mines;
	theGame.minesLeft = mines;
	theGame.gameType = gameType;
}

function getFirstClick(){
	//Is only true if no tiles have been explored.
	
	return theGame.firstClick;
}

function setFirstClick(bool){
	//Used when starting a new game.
	
	theGame.firstClick = bool;
}

function getTileValue(row, col){
	//Returns the class name for the selected tile.
	
	return theGame.gridRows[row][col];
}

function getRowSize(){
	return theGame.height;
}

function getColSize(){
	return theGame.width;
}

function getGameType(){
	return theGame.gameType;
}

function getMines(){
	return theGame.mines;
}

function getMinesLeft(){
	return theGame.minesLeft;
}

function setMinesLeft(increment){
	//Takes 1 or -1 or increment or decrement.
	
	if (increment == 1 && theGame.minesLeft < theGame.mines && theGame.minesLeft >= 0)
		theGame.minesLeft += increment;
	else if (increment == -1 && theGame.minesLeft <= theGame.mines && theGame.minesLeft > 0)
		theGame.minesLeft += increment;
	
	//Test if all flags are truly mines, if yes, celebrate a job well done!
	var flaggedAllMines = theGame.mines - countMinesFlagged();
	if (theGame.minesLeft == 0 && flaggedAllMines == 0){
		gameOver(true);
	}
}

function countMinesFlagged(){
	//Scans through the player map and counts all flagged tiles that really are mines.
	
	var counter = 0;
	
	for (var row = 0; row < theGame.height; row++){
		for (var col = 0; col < theGame.width; col++){
			if (isFlagged(row, col)){
				if (theGame.gridRows[row][col] == "mine" || theGame.gridRows[row][col] == "gr-mine"){
					counter++;
				}	
			}
		}//End of for loop (Col)
	}//End of for loop (row)
	
	return counter;
}

function addListener(obj, type, fn){
	//Creates a listener based on player's browser.
	
	if(obj && obj.addEventListener){//WC3
		obj.addEventListener(type, fn, false);
	}
	else if(obj && obj.obj.attachEvent){//older IE
		obj.attachEvent('on' + type, fn)
	}
}

function removeListener(obj, type, fn){
	//Removes a listener based on player's browser.
	
	if(obj && obj.removeEventListener){//WC3
		obj.removeEventListener(type, fn, false);
	}
	else if(obj && obj.obj.detachEvent){//older IE
		obj.detachEvent('on' + type, fn)
	}
}

function getLocalStorageItem(variable){
	//Retrieves item from local storage.
	
	return localStorage.getItem(variable);
}

function initiateLocalStorage(){
	localStorage.setItem("Name", "Mysterio")
	localStorage.setItem("Wallet", 1000)
	localStorage.setItem("Wins", 0)
	localStorage.setItem("FlaggedMines", 0)
	localStorage.setItem("Losses", 0)
}

function getAjaxObj(){
	//Creates an appropriate XMLHTTPRequest object based on player's browser.
	
	var ajax = null;
	if(window.XMLHttpRequest)
		ajax = new XMLHttpRequest();
	else if (window.ActiveXObject)//older IE
		ajax = new ActiveXObject('MSXML2.XMLHTTP3.0');
	
	return ajax;
}

function loadGameFile(){
	//requests a local JSON file with game data to be loaded.
	
	var ajax = getAjaxObj();
	
	ajax.open("GET", "./gameSave.json", false);
	ajax.setRequestHeader('Content-Type', 'application/json');
	ajax.send();
	
	//note for later: This is where status == 200 check would go for online implementation.
	var jsonresponse = JSON.parse(ajax.responseText);
	
	//Load the grid for the Model
	loadGameInfo(jsonresponse);
	
	//Load the map for the View/player
	loadGameMap(jsonresponse);
	
	//Update theGame variable
	theGame.gridRows = jsonresponse.theGame.gridRows;
	theGame.firstClick = false;
	theGame.width = jsonresponse.theGame.width;
	theGame.height = jsonresponse.theGame.height;
	theGame.mines = jsonresponse.theGame.mines;
	theGame.minesLeft = jsonresponse.theGame.minesLeft;
	theGame.gameType = jsonresponse.theGame.gameType;
	
	//Update Visible Player Stats
	updateMinesLeft();
	loadGameProgress();
}

function loadGameInfo(jsondata){
	//called by loadGameFile(). Inject JSON values into theGame.gridRows
	
	destroyMap();
	
	for (var i = 0; i < jsondata.theGame.height; i++){
		theGame.gridRows[i] = new Array(jsondata.theGame.width);
		for (var j = 0; j < jsondata.theGame.height; j++){
			theGame.gridRows[i][j] = jsondata.theGame.gridRows[i][j];
		}
	}
}

function gameOver(win){
	//called on when player clicks on a mine or has flagged all mines. win is a boolean value.
	
	if (win){
		//win == true - flagged all mines!
		updateGameState("Win!");
		deinitTileListeners();
		localStorage.setItem('Wallet', parseInt(localStorage.getItem('Wallet')) + theGame.mines * 20);
		localStorage.setItem('Wins', parseInt(localStorage.getItem('Wins')) + 1);
		localStorage.setItem('FlaggedMines', parseInt(localStorage.getItem('FlaggedMines')) + theGame.mines);
		loadGameProgress();
	}
	else{
		//win == false - clicked on a mine.
		var coma = Math.ceil(Math.random() * theGame.minesLeft);
		updateGameState("Coma for\n"  + coma + " day(s).")
		deinitTileListeners();
		localStorage.setItem('Wallet', parseInt(localStorage.getItem('Wallet')) + countMinesFlagged() * 20);
		localStorage.setItem('Wallet', parseInt(localStorage.getItem('Wallet')) - coma * 15);
		localStorage.setItem('Losses', parseInt(localStorage.getItem('Losses')) + 1);
		localStorage.setItem('FlaggedMines', parseInt(localStorage.getItem('FlaggedMines')) + countMinesFlagged());
		loadGameProgress();
	}
}

function destroyMap(){
	//Replace theGame.gridRows with an empty Array object.
	
	theGame.gridRows = [];
}//End of destroyMap

function generateGrid( coordY, coordX){
	//Generates a two dimensional Array - all tiles undefined.
	//Then the mines are assigned to random tiles.
	//Then the numbers are generated around the mines.
	//Then the empty spaces are assigned to the remaining undefined elements.
	
	//Is called by the function "reveal", so first we set firstClick to false
	theGame.firstClick = false;
	
	//First: create two dimensional grid. theGame.gridRows[3][7] - references row 3, column 7
	for (var i = 0; i < theGame.height; i++){
		theGame.gridRows[i] = new Array(theGame.width);
		for (var j = 0; j < theGame.width; j++){
			theGame.gridRows[i][j] = undefined;
		}
	}
	
	//Second: set 3x3 empty tile cluster.
	for (var i = coordY -1; i <= coordY + 1; i++ ){
		if(i >= 0 && i <= theGame.height){
			for (var j = coordX -1; j <= coordX + 1; j++ ){
				if(j >= 0 && j <= theGame.width){
					theGame.gridRows[i][j] = theGame.gameType + "empty";
				}
			}
		}
	}
	
	//Third: Assign mines to random tiles. Don't let them occupy the same tile or the empty tiles.
	assignMines();
	
	//Fourth: Populate numbers around mines.
	numberMines();
	
}//End of generateGrid

function assignMines(){
	//Assigns mines to random tiles on the grid.
	//Does not assign any two mines to the same tile or to already assigned "empty" tiles.
	
	//Declare variables.
	var minesRemaining = theGame.mines;	//Used as a counter.
	var row, col;
	
	while (minesRemaining > 0){
		row = Math.floor(Math.random() * theGame.gridRows.length);
		col = Math.floor(Math.random() * theGame.gridRows[0].length);
		
		//Only assign mine and reduce mines count if the tile is empty.
		if(theGame.gridRows[row][col] != "mine" && theGame.gridRows[row][col] != "gr-mine"
			&& theGame.gridRows[row][col] != "empty" && theGame.gridRows[row][col] != "gr-empty"){
			theGame.gridRows[row][col] = theGame.gameType + "mine";
			minesRemaining--;
		}
	}//End of while
}//End of assignMines

function numberMines(){
	//Selects a tile, counts the amounts of mines around it, then numbers them. Skip mines.
	
	var mineCount = 0;
	
	//Scans through each tile in the grid.
	for (var i = 0; i < theGame.height; i++){
		for (var j = 0; j < theGame.width; j++){
			//If it's a mine, move to the next tile.
			if (theGame.gridRows[i][j] == "mine" || theGame.gridRows[i][j] == "gr-mine"){
				continue;
			}
			
			//If it's not a mine, check adjacent tiles for mines to determine the tile class.
			for (var k = i - 1; k <= i + 1; k++){
				//If k is outside the range of the gridRows arrays, we don't want to cause errors.
				if (k < 0 || k >= theGame.height){
					continue;
				}
				for(var l = j - 1; l <= j + 1; l++){
					//If l is outside the range of the gridRows arrays, we don't want to cause errors.
					if (l < 0 || l >= theGame.width){
						continue;
					}
					
					//Start counting adjacent mines.
					if (theGame.gridRows[k][l] == "mine" || theGame.gridRows[k][l] == "gr-mine"){
						mineCount++;
					}
				}
			}//End of checking adjacent tiles for mines.
			
			switch(mineCount){
				case 0:
					theGame.gridRows[i][j] = theGame.gameType + "empty";
					break;
				case 1:
					theGame.gridRows[i][j] = theGame.gameType + "mine1";
					break;
				case 2:
					theGame.gridRows[i][j] = theGame.gameType + "mines2";
					break;
				case 3:
					theGame.gridRows[i][j] = theGame.gameType + "mines3";
					break;
				case 4:
					theGame.gridRows[i][j] = theGame.gameType + "mines4";
					break;
				case 5:
					theGame.gridRows[i][j] = theGame.gameType + "mines5";
					break;
				case 6:
					theGame.gridRows[i][j] = theGame.gameType + "mines6";
					break;
				case 7:
					theGame.gridRows[i][j] = theGame.gameType + "mines7";
					break;
				case 8:
					theGame.gridRows[i][j] = theGame.gameType + "mines8";
					break;
				
			}//End of switch
			
			//reset mine counter
			mineCount = 0;
		}
	}//End of traversing the grid.
}
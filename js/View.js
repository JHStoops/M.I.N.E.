'use strict';

function $(theID){
	//return the element with the specified ID
	
	if(typeof theID == 'string')
		return document.getElementById(theID);
}

function $$(theClass){
	//returns an array with all elements of the specified class
	
	if(typeof theClass == 'string')
		return document.getElementsByClassName(theClass);
}

function loadGameProgress(){
	//Displays info from local storage in side panel
	if(!getLocalStorageItem('Name'))
		initiateLocalStorage();
	$("playerName").innerHTML = getLocalStorageItem('Name');
	$("playerWallet").innerText = getLocalStorageItem('Wallet');
	$("playerWins").innerText = getLocalStorageItem('Wins');
	$("playerFlaggedMines").innerText = getLocalStorageItem('FlaggedMines');
	$("playerLosses").innerText = getLocalStorageItem('Losses');
	
}

function toggleCustMenuDisplay() {
	//Used to extend the game menu when player creates custom map.
	
	if( $("Custom").selected )
		$("custMenu").style.display = "inline";
	else
		$("custMenu").style.display = "none";
}

function isFlagged(row, col){
	//Checks if the specified tile on the player map is flagged.
	
	if ($("r" + row + "c" + col).className == "flagged" || $("r" + row + "c" + col).className == "gr-flagged")
		return true;
	else
		return false;
}

function updateGameState(newState){
	//Updates the game state between "Playing", "Win!", and "Coma for X day(s)")
	
	$("gameState").innerText = newState;
}

function updateMinesLeft(){
	//Updates the minesLeft in the game stats.
	
	$("minesLeft").innerText = getMinesLeft();
}

function startNewGame(){
	//Sets up variables and maps for a new game.
	
	var height, width, mines;	//local variables
	var gameType = "";
	
	updateGameState("Playing");
	$("minesTotal").innerText = getMines();
	
	//This function ests the variable to be passed to the map generator.
	//It's value is the file names' shared prefix.
	if ($("Grassy").checked == true){
		gameType = "gr-";
	}
	
	if ($("Beginner").selected){
		height = 9;
		width = 9;
		mines = 10;
	} else if ($("Intermediate").selected){
		height = 16;
		width = 16;
		mines = 40;
	} else if ($("Expert").selected){
		height = 16;
		width = 30;
		mines = 99;
	} else if ($("Custom").selected){
		//Display Errors if appropriate
		if (!$("custHeight").value || $("custHeight").value < 9 || $("custHeight").value > 40)
			$("custHeightError").innerText = "Please select a value between 9-40.";
		else
			$("custHeightError").innerText = "";
		if (!$("custWidth").value || $("custWidth").value < 9 || $("custWidth").value > 40)
			$("custWidthError").innerText = "Please select a value between 9-40.";
		else
			$("custWidthError").innerText = "";
		if (!$("custMines").value || $("custMines").value < 9 || $("custMines").value > ($("custHeight").value * $("custWidth").value / 2))
			$("custMinesError").innerText = "Please select a value between 9 - ((height * width) / 2).";
		else
			$("custMinesError").innerText = "";
		
		//set game if all is well.
		if ($("custHeight").value && $("custWidth").value && $("custMines").value &&
			$("custMines").value <= ($("custHeight").value * $("custWidth").value / 2) &&
			$("custHeight").value <= 40 && $("custWidth").value <= 40 && 
			$("custHeight").value >= 9 && $("custWidth").value >= 9 && $("custMines").value >= 9){
				height = parseInt($("custHeight").value);
				width = parseInt($("custWidth").value);
				mines = parseInt($("custMines").value);
		}
	}
	
	//Display total amount of mines.
	$("minesTotal").innerText = mines;
	
	//Delete previously used map's 2D array
	destroyMap();

	//(Re)Initialize global variables used for referencing values beneath "unexplored" tiles.
	setTheGame(height, width, mines, gameType)
	
	//Generate the player map (the Grid contains the values beneath the map.)
	generateMap(gameType);
	$("minesLeft").innerText = getMinesLeft();
	
}//End of startNewGame



function loadGameMap(jsondata){
	//called by loadGameFile(). Generates the visual part of the saved game (JSON data)
	
	var gameArea = $("game");
	var htmlString = "<table id='gameGrid'>";			//Overwrites the previous table
	
	for (var i = 0; i < jsondata.theGame.gridRows.length; i++){
		htmlString += "<tr>";
		for (var j = 0; j < jsondata.theGame.gridRows[0].length; j++){
			htmlString += "<td id='r"+i+"c"+j+"' class='"+jsondata.playerMap[i][j]+"'></td>";
		}
		htmlString += "</tr>";
	}
	
	htmlString += "</table>";
	gameArea.innerHTML = htmlString;
	$("minesLeft").innerText = getMinesLeft();
	initTileListeners();				//Set the event listeners for the tiles.
}

function reveal(){
	//Reveals the tile's true contents by transferring the value from the Grid to the user's map.
	
	//If first click, generate the grid.
	if (getFirstClick() == true){

		//Generate bombs
		generateGrid(this.parentNode.rowIndex, this.cellIndex);
		//generate rest of map.
	}
	
	//Looks up the id of the selected tile, manipulates the id to get the row and col indices.
	if (this.className == "unexplored" || this.className == "maybe" ||
		this.className == "gr-unexplored" || this.className == "gr-maybe"){

		var col = this.cellIndex;
		var row = this.parentNode.rowIndex;
		
		//Retrieve the classname from the Model.
		this.className = getTileValue(row, col);
		
		if (this.className == "empty" || this.className == "gr-empty"){
			revealEmpty(row, col);
		}
		
		//These two if statements start an animation for the mine to explode.
		if (this.className == "mine"){
			this.innerHTML = "<div class=\"explode\"></div><div class=\"smoke\"></div>";
			setTimeout(function(){if(getFirstClick() == false && $("r"+row+"c"+col).className == "mine") $("r"+row+"c"+col).className = "crater"; }, 1000);
			
			for (var i = 0; i < getRowSize(); i++){
				for (var j = 0; j < getColSize(); j++){
					//alert($("r"+i+"c"+j).className);
					if(getTileValue(i, j) == "mine" && $("r"+i+"c"+j).className != "flagged"){
						//alert("row: " + row + ", col: " + col);
						$("r"+i+"c"+j).className = "mine";
						$("r"+i+"c"+j).innerHTML = "<div class=\"explode\"></div><div class=\"smoke\"></div>";
						
						//I tried using setTimer here, but it only affected the last mine on the map.
						//Creating this function runs this code on all mines!
						boom(i, j);
					}
				}//End of for(j...
			}//End of for (i...
			
			gameOver(false);
		}

		if (this.className == "gr-mine"){
			this.innerHTML = "<div class=\"explode\"></div><div class=\"smoke\"></div>";
			setTimeout(function(){if(getFirstClick() == false && $("r"+row+"c"+col).className == "gr-mine") $("r"+row+"c"+col).className = "gr-crater"; }, 1000);

			for (var i = 0; i < getRowSize(); i++){
				for (var j = 0; j < getColSize(); j++){
					//alert($("r"+i+"c"+j).className);
					if(getTileValue(i, j) == "gr-mine" && $("r"+i+"c"+j).className != "gr-flagged"){
						//alert("row: " + row + ", col: " + col);
						$("r"+i+"c"+j).className = "gr-mine";
						$("r"+i+"c"+j).innerHTML = "<div class=\"explode\"></div><div class=\"smoke\"></div>";
						
						boom(i, j);
					}
				}//End of for(j...
			}//End of for (i...
		
			gameOver(false);
		}
	}
}

function generateMap(gameType){
	//Generates the visible map for the player. Not to be confused with the grid.

	//Running innerHTML for some reason generated a set of tr tags around each iteration
	//in the inner loop. I found out that creating a string, then running innerHTML once
	//works perfectly. I'm sure it is more efficient this way as well.
	var gameArea = $("game");
	var htmlString = "<table id='gameGrid'>";			//Overwrites the previous table
	
	for (var i = 0; i < theGame.height; i++){
		htmlString += "<tr>";
		for (var j = 0; j < theGame.width; j++){
			//Switch between 
			htmlString += "<td id='r"+i+"c"+j+"' class='"+gameType+"unexplored'></td>";
			//alert(i + " " + j);
		}
		htmlString += "</tr>";
	}

	htmlString += "</table>";
	gameArea.innerHTML = htmlString;
	initTileListeners();				//Set the event listeners for the tiles.
}

function boom(row, col){
	//Detonates all unflagged mines when player reveals a mine.
	
	if($("r"+row+"c"+col).className == "mine")
		setTimeout(function(){if(getFirstClick() == false && $("r"+row+"c"+col).className == "mine") $("r"+row+"c"+col).className = "crater"; }, 1000);
	else
		setTimeout(function(){if(getFirstClick() == false && $("r"+row+"c"+col).className == "gr-mine") $("r"+row+"c"+col).className = "gr-crater"; }, 1000);
}

function revealEmpty(row, col){
	//When player clicks on an empty tile, this function will reveal the rest
	//of the group of empty tiles and their adjacent tiles (always numbers - never mines)
	var tile;
	
	for (var i = row - 1; i <= row + 1; i++){
		
		if (i < 0 || i >= getRowSize()){
			continue;
		}
		for (var j = col - 1; j <= col + 1; j++){
			//Don't check the tile itself, only its adjacet tiles.
			if (i == row && j == col) {
				continue;
			}
			if (j < 0 || j >= getColSize()){
				continue;
			}
			tile = $("r"+i+"c"+j);
			//alert(tile.id);	//I used this to track the recursion.
			
			//Only deal with tile if it's still unexplored.
			if (tile.className == "unexplored" || tile.className == "gr-unexplored"
				 || tile.className == "maybe"  || tile.className == "gr-maybe"
				 || tile.className == "flagged"  || tile.className == "gr-flagged"){
				tile.className = getTileValue(i, j);
				
				//If the tile happens to be another empty tile, it's time to go recursive!
				if (tile.className == "empty" || tile.className == "gr-empty"){
					revealEmpty(i, j);
				}
			}//End if(tile.className...
		}//End for (var j...
	}//End for (var i...
}//End function revealEmpty

function markTile(){
	//Will mark the selected tile as a question mark, which can still be left-clicked to reveal.
	//If it's a question mark, it'll turn into flagged state, where a left-click does nothing.
	//If it's in flagged state, then it'll return to normal unexplored state.

	switch(this.className){
		case "unexplored":
			this.className = "maybe";
			break;
		case "maybe":
			if(getMinesLeft() > 0){
				this.className = "flagged";
				setMinesLeft(-1);
				updateMinesLeft();
			}
			else{
				this.className = "unexplored";
			}
			break;
		case "flagged":
			if(getMinesLeft() < getMines()){
				this.className = "unexplored";
				setMinesLeft(1);
				updateMinesLeft();
			}
			break;
		case "gr-unexplored":
			this.className = "gr-maybe";
			break;
		case "gr-maybe":
			if(getMinesLeft() > 0){
				this.className = "gr-flagged";
				setMinesLeft(-1);
				updateMinesLeft();
			}
			else{
				this.className = "gr-unexplored";
			}
			break;
		case "gr-flagged":
			if(getMinesLeft() < getMines()){
				this.className = "gr-unexplored";
				setMinesLeft(1);
				updateMinesLeft();
			}
			break;
	}
}
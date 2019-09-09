import React, { useContext } from 'react'
import { GameContext } from '../App'

/**
 * @description - Sets up constiables and maps for a new game.
 */
export default function GameField() {
	const { dispatch, state } = useContext(GameContext)
	const { flaggedMines, height, losses, mapStyle, mines, minesLeft, minesTotal, money, width, wins } = state
	if ((!height && !width) || !mines) return false
	if (!height) height = width
	if (!width) width = height

	/**
	 * @description - Start up game related even listeners with new game.
	 */
	function initTileListeners(){
		setFirstClick(true);

		$("gameGrid").addEventListener("contextmenu", function(e){
			e.preventDefault();
		}, false);
		const unexploredClass1 = $$("unexplored"); //returns an array
		const unexploredClass2 = $$("gr-unexplored");
		const maybeClass1 = $$("maybe"); //returns an array
		const maybeClass2 = $$("gr-maybe");
		const flaggedClass1 = $$("flagged"); //returns an array
		const flaggedClass2 = $$("gr-flagged");

		//////////////////////////////////////////////////
		//	This code can potentially be more efficient	//
		//////////////////////////////////////////////////
		for (let i = 0; i < unexploredClass1.length; i++){
			addListener(unexploredClass1[i], 'click', reveal);
			addListener(unexploredClass1[i], 'contextmenu', markTile);
		}
		for (let i = 0; i < unexploredClass2.length; i++){
			addListener(unexploredClass2[i], 'click', reveal);
			addListener(unexploredClass2[i], 'contextmenu', markTile);
		}

		//Will need to set these listeners if the player loads game.
		for (let i = 0; i < maybeClass1.length; i++){
			addListener(maybeClass1[i], 'click', reveal);
			addListener(maybeClass1[i], 'contextmenu', markTile);
		}
		for (let i = 0; i < unexploredClass2.length; i++){
			addListener(maybeClass2[i], 'click', reveal);
			addListener(maybeClass2[i], 'contextmenu', markTile);
		}
		for (let i = 0; i < unexploredClass1.length; i++){
			addListener(flaggedClass2[i], 'click', reveal);
			addListener(flaggedClass1[i], 'contextmenu', markTile);
		}
		for (let i = 0; i < unexploredClass2.length; i++){
			addListener(flaggedClass2[i], 'click', reveal);
			addListener(flaggedClass2[i], 'contextmenu', markTile);
		}
	}

	/**
	 * @description - return the element with the specified ID
	 */
	function $(theID){
		if(typeof theID === 'string')
			return document.getElementById(theID);
	}

	/**
	 * @description - returns an array with all elements of the specified class
	 */
	function $$(theClass){
		if(typeof theClass === 'string')
			return document.getElementsByClassName(theClass);
	}

	/**
	 * @description - Updates the game state between "Playing", "Win!", and "Coma for X day(s)")
	 */
	function updateGameState(newState){
		$("gameState").innerText = newState;
	}

	function getMines(){
		return theGame.mines;
	}

	/**
	 * @description - Replace theGame.gridRows with an empty Array object.
	 */
	function destroyMap(){
		theGame.gridRows = [];
	}

	/** View Functions */

	function toggleCustMenuDisplay() {
		//Used to extend the game menu when player creates custom map.

		if( $("Custom").selected )
			$("custMenu").style.display = "inline";
		else
			$("custMenu").style.display = "none";
	}

	function isFlagged(row, col){
		//Checks if the specified tile on the player map is flagged.

		if ($("r" + row + "c" + col).className === "flagged" || $("r" + row + "c" + col).className === "gr-flagged")
			return true;
		else
			return false;
	}

	function reveal(){
		//Reveals the tile's true contents by transferring the value from the Grid to the user's map.

		//If first click, generate the grid.
		if (getFirstClick() === true){

			//Generate bombs
			generateGrid(this.parentNode.rowIndex, this.cellIndex);
			//generate rest of map.
		}

		//Looks up the id of the selected tile, manipulates the id to get the row and col indices.
		if (this.className === "unexplored" || this.className === "maybe" ||
			this.className === "gr-unexplored" || this.className === "gr-maybe"){

			const col = this.cellIndex;
			const row = this.parentNode.rowIndex;

			//Retrieve the classname from the Model.
			this.className = getTileValue(row, col);

			if (this.className === "empty" || this.className === "gr-empty"){
				revealEmpty(row, col);
			}

			//These two if statements start an animation for the mine to explode.
			if (this.className === "mine"){
				this.innerHTML = "<div class=\"explode\"></div><div class=\"smoke\"></div>";
				setTimeout(function(){if(getFirstClick() === false && $("r"+row+"c"+col).className === "mine") $("r"+row+"c"+col).className = "crater"; }, 1000);

				for (let i = 0; i < getRowSize(); i++){
					for (let j = 0; j < getColSize(); j++){
						//alert($("r"+i+"c"+j).className);
						if(getTileValue(i, j) === "mine" && $("r"+i+"c"+j).className !== "flagged"){
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

			if (this.className === "gr-mine"){
				this.innerHTML = "<div class=\"explode\"></div><div class=\"smoke\"></div>";
				setTimeout(function(){if(getFirstClick() === false && $("r"+row+"c"+col).className === "gr-mine") $("r"+row+"c"+col).className = "gr-crater"; }, 1000);

				for (let i = 0; i < getRowSize(); i++){
					for (let j = 0; j < getColSize(); j++){
						//alert($("r"+i+"c"+j).className);
						if(getTileValue(i, j) === "gr-mine" && $("r"+i+"c"+j).className !== "gr-flagged"){
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

	function boom(row, col){
		//Detonates all unflagged mines when player reveals a mine.

		if($("r"+row+"c"+col).className === "mine")
			setTimeout(function(){if(getFirstClick() === false && $("r"+row+"c"+col).className === "mine") $("r"+row+"c"+col).className = "crater"; }, 1000);
		else
			setTimeout(function(){if(getFirstClick() === false && $("r"+row+"c"+col).className === "gr-mine") $("r"+row+"c"+col).className = "gr-crater"; }, 1000);
	}

	function revealEmpty(row, col){
		//When player clicks on an empty tile, this function will reveal the rest
		//of the group of empty tiles and their adjacent tiles (always numbers - never mines)
		let tile;

		for (let i = row - 1; i <= row + 1; i++){

			if (i < 0 || i >= getRowSize()){
				continue;
			}
			for (let j = col - 1; j <= col + 1; j++){
				//Don't check the tile itself, only its adjacet tiles.
				if (i === row && j === col) {
					continue;
				}
				if (j < 0 || j >= getColSize()){
					continue;
				}
				tile = $("r"+i+"c"+j);
				//alert(tile.id);	//I used this to track the recursion.

				//Only deal with tile if it's still unexplored.
				if (tile.className === "unexplored" || tile.className === "gr-unexplored"
					|| tile.className === "maybe"  || tile.className === "gr-maybe"
					|| tile.className === "flagged"  || tile.className === "gr-flagged"){
					tile.className = getTileValue(i, j);

					//If the tile happens to be another empty tile, it's time to go recursive!
					if (tile.className === "empty" || tile.className === "gr-empty"){
						revealEmpty(i, j);
					}
				}//End if(tile.className...
			}//End for (const j...
		}//End for (const i...
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
				if(minesLeft > 0){
					this.className = "flagged";
					setMinesLeft(-1);
					updateMinesLeft();
					// TODO: Figure out how to replace this.
					// dispatch('game:minesLeft', { minesLeft})
				}
				else{
					this.className = "unexplored";
				}
				break;
			case "flagged":
				if(minesLeft < mines){
					this.className = "unexplored";
					setMinesLeft(1);
					updateMinesLeft();
				}
				break;
			case "gr-unexplored":
				this.className = "gr-maybe";
				break;
			case "gr-maybe":
				if(minesLeft > 0){
					this.className = "gr-flagged";
					setMinesLeft(-1);
					updateMinesLeft();
				}
				else{
					this.className = "gr-unexplored";
				}
				break;
			case "gr-flagged":
				if(minesLeft < mines){
					this.className = "gr-unexplored";
					setMinesLeft(1);
					updateMinesLeft();
				}
				break;
			default:
				throw new Error();
		}
	}

	/** End of View Functions */
	/** Model Functions */

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
		if (typeof JSON === 'undefined'){
			const script = document.createElement('script');
			script.src = 'js/json2.js';
			document.getElementsByTagName('head')[0].appendChild(script);
		}

		//set event listeners
		//addListener($("bLoadGame"), "click", loadGameFile);
		addListener($("difficultyChoice"), "change", toggleCustMenuDisplay);
	}

	function deinitTileListeners(){
		//disable game related event listeners when the game ends.

		//Get all elements of the specified class stored in constiables.
		const unexploredClass1 = $$("unexplored"); //returns an array
		const unexploredClass2 = $$("gr-unexplored");
		const maybeClass1 = $$("maybe"); //returns an array
		const maybeClass2 = $$("gr-maybe");
		const flaggedClass1 = $$("flagged"); //returns an array
		const flaggedClass2 = $$("gr-flagged");

		//////////////////////////////////////////////////
		//	This code can potentially be more efficient	//
		//////////////////////////////////////////////////
		for (let i = 0; i < unexploredClass1.length; i++){
			removeListener(unexploredClass1[i], 'click', reveal);
			removeListener(unexploredClass1[i], 'contextmenu', markTile);
		}
		for (let i = 0; i < unexploredClass2.length; i++){
			removeListener(unexploredClass2[i], 'click', reveal);
			removeListener(unexploredClass2[i], 'contextmenu', markTile);
		}
		for (let i = 0; i < maybeClass1.length; i++){
			removeListener(maybeClass1[i], 'click', reveal);
			removeListener(maybeClass1[i], 'contextmenu', markTile);
		}
		for (let i = 0; i < maybeClass2.length; i++){
			removeListener(maybeClass2[i], 'click', reveal);
			removeListener(maybeClass2[i], 'contextmenu', markTile);
		}
		for (let i = 0; i < flaggedClass1.length; i++){
			removeListener(flaggedClass1[i], 'contextmenu', markTile);
		}
		for (let i = 0; i < flaggedClass2.length; i++){
			removeListener(flaggedClass2[i], 'contextmenu', markTile);
		}
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

	function setMinesLeft(increment){
		//Takes 1 or -1 or increment or decrement.

		if (increment === 1 && theGame.minesLeft < theGame.mines && theGame.minesLeft >= 0)
			theGame.minesLeft += increment;
		else if (increment === -1 && theGame.minesLeft <= theGame.mines && theGame.minesLeft > 0)
			theGame.minesLeft += increment;

			//Test if all flags are truly mines, if yes, celebrate a job well done!
		const flaggedAllMines = theGame.mines - countMinesFlagged();
		if (theGame.minesLeft === 0 && flaggedAllMines === 0){
			gameOver(true);
		}
	}

	/**
	 * @description - Scans through the player map and counts all flagged tiles that really are mines.
	 */
	function countMinesFlagged(){
		let counter = 0;

		for (let row = 0; row < theGame.height; row++){
			for (let col = 0; col < theGame.width; col++){
				if (isFlagged(row, col)){
					if (theGame.gridRows[row][col] === "mine" || theGame.gridRows[row][col] === "gr-mine"){
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

	/**
	 * @description - called on when player clicks on a mine or has flagged all mines.
	 * @param {boolean} win
	 */
	function gameOver(win){
		if (win){
			//win === true - flagged all mines!
			updateGameState("Win!");
			deinitTileListeners();
			localStorage.setItem('Wallet', parseInt(localStorage.getItem('Wallet')) + theGame.mines * 20);
			localStorage.setItem('Wins', parseInt(localStorage.getItem('Wins')) + 1);
			localStorage.setItem('FlaggedMines', parseInt(localStorage.getItem('FlaggedMines')) + theGame.mines);
			// TODO: Update stats in context reducer
		}
		else{
			//win === false - clicked on a mine.
			const coma = Math.ceil(Math.random() * theGame.minesLeft);
			updateGameState("Coma for\n"  + coma + " day(s).")
			deinitTileListeners();
			localStorage.setItem('Wallet', parseInt(localStorage.getItem('Wallet')) + countMinesFlagged() * 20);
			localStorage.setItem('Wallet', parseInt(localStorage.getItem('Wallet')) - coma * 15);
			localStorage.setItem('Losses', parseInt(localStorage.getItem('Losses')) + 1);
			localStorage.setItem('FlaggedMines', parseInt(localStorage.getItem('FlaggedMines')) + countMinesFlagged());
			// TODO: Update stats in context reducer
		}
	}

	function generateGrid( coordY, coordX){
		//Generates a two dimensional Array - all tiles undefined.
		//Then the mines are assigned to random tiles.
		//Then the numbers are generated around the mines.
		//Then the empty spaces are assigned to the remaining undefined elements.

		//Is called by the function "reveal", so first we set firstClick to false
		theGame.firstClick = false;

		//First: create two dimensional grid. theGame.gridRows[3][7] - references row 3, column 7
		for (let i = 0; i < theGame.height; i++) {
			theGame.gridRows[i] = new Array(theGame.width);
			for (let j = 0; j < theGame.width; j++) {
				theGame.gridRows[i][j] = undefined;
			}
		}

		//Second: set 3x3 empty tile cluster.
		for (let i = coordY -1; i <= coordY + 1; i++) {
			if(i >= 0 && i <= theGame.height){
				for (let j = coordX -1; j <= coordX + 1; j++) {
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

		//Declare constiables.
		let minesRemaining = theGame.mines;	//Used as a counter.
		let row, col;

		while (minesRemaining > 0){
			row = Math.floor(Math.random() * theGame.gridRows.length);
			col = Math.floor(Math.random() * theGame.gridRows[0].length);

			//Only assign mine and reduce mines count if the tile is empty.
			if(theGame.gridRows[row][col] !== "mine" && theGame.gridRows[row][col] !== "gr-mine"
				&& theGame.gridRows[row][col] !== "empty" && theGame.gridRows[row][col] !== "gr-empty"){
				theGame.gridRows[row][col] = theGame.gameType + "mine";
				minesRemaining--;
			}
		}//End of while
	}//End of assignMines

	/**
	 * @description - Selects a tile, counts the amounts of mines around it, then numbers them. Skip mines.
	 */
	function numberMines(){
		let mineCount = 0;

		//Scans through each tile in the grid.
		for (let i = 0; i < theGame.height; i++){
			for (let j = 0; j < theGame.width; j++){
				//If it's a mine, move to the next tile.
				if (theGame.gridRows[i][j] === "mine" || theGame.gridRows[i][j] === "gr-mine"){
					continue;
				}

				//If it's not a mine, check adjacent tiles for mines to determine the tile class.
				for (let k = i - 1; k <= i + 1; k++){
					//If k is outside the range of the gridRows arrays, we don't want to cause errors.
					if (k < 0 || k >= theGame.height){
						continue;
					}
					for(let l = j - 1; l <= j + 1; l++){
						//If l is outside the range of the gridRows arrays, we don't want to cause errors.
						if (l < 0 || l >= theGame.width){
							continue;
						}

						//Start counting adjacent mines.
						if (theGame.gridRows[k][l] === "mine" || theGame.gridRows[k][l] === "gr-mine"){
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
					default:
						throw new Error()
				}//End of switch

				//reset mine counter
				mineCount = 0;
			}
		}//End of traversing the grid.
	}

	/** End of Model Functions */

	//It's value is the file names' shared prefix.
	// TODO: refactor gameType to simply use mapStyle directly
  let gameType = mapStyle === 'Classic' ? '' : 'gr-'

	//Delete previously used map's 2D array
	destroyMap();

	// TODO: Reactify initTileListeners() on the fields

	return (
		<table id='gameGrid'>
			{
				Array(height).fill(undefined).map((r, i) => {
					return <tr>
						{
							Array(width).fill(undefined).map((c, j) => <td id={`r${i}c${j}`} className={`${gameType}unexplored`}></td>)
						}
					</tr>
				})
			}
		</table>
	)
}

//Initiate Model object - not to be used by external codes.
const theGame = {
  gridRows: [],
  firstClick: true,
  width: 0,
  height: 0,
  mines: 0,
  minesLeft: 0,
  gameType: ""
};
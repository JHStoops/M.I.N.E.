import React, { useContext, useState } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { GameContext } from '../App'
import { Tile } from './'

let gridRows= []
const styles = {
	gameGrid: css`
		border: 1px solid black;
		border-collapse: collapse;
	`
}

/**
 * @description - Sets up constiables and maps for a new game.
 */
export default function GameField() {
	const { dispatch, state } = useContext(GameContext)
	const { firstClick, flaggedMines, height, losses, mapStyle, mines, minesLeft, minesTotal, money, status, width, wins } = state
	if ((!height && !width) || !mines || status === 'Idle') return false
	if (!height) height = width
	if (!width) width = height

	/**
	 * @description - return the element with the specified ID
	 */
	function $(theID){
		if(typeof theID === 'string')
			return document.getElementById(theID);
	}

	function isFlagged(row, col){
		//Checks if the specified tile on the player map is flagged.

		if ($('r' + row + 'c' + col).className === 'flagged' || $('r' + row + 'c' + col).className === 'gr-flagged')
			return true;
		else
			return false;
	}

	/**
	 * @description - Scans through the player map and counts all flagged tiles that really are mines.
	 */
	function countMinesFlagged(){
		let counter = 0;

		for (let row = 0; row < height; row++){
			for (let col = 0; col < width; col++){
				if (isFlagged(row, col)){
					if (gridRows[row][col] === 'mine' || gridRows[row][col] === 'gr-mine'){
						counter++;
					}
				}
			}//End of for loop (Col)
		}//End of for loop (row)

		return counter;
	}

/**
 * @description - When player clicks on an empty tile, this function will reveal the rest of the group of empty tiles and their adjacent tiles (always numbers - never mines)
 * @param {*} row
 * @param {*} col
 */
function revealEmpty(row, col){
  let tile;

  for (let i = row - 1; i <= row + 1; i++){
    if (i < 0 || i >= height) continue;

    for (let j = col - 1; j <= col + 1; j++){
      // Don't check the tile itself, only its adjacet tiles.
      if (i === row && j === col) continue;
      if (j < 0 || j >= width) continue;
      tile = $('r'+i+'c'+j);

      // Only deal with tile if it's still unexplored.
      if ([`${mapStyle}unexplored`, `${mapStyle}maybe`, `${mapStyle}flagged`].includes(gridRows[row][col])) {
        // tile.className = getTileValue(i, j);

        // If the tile happens to be another empty tile, it's time to go recursive!
        if (tile.className === 'empty' || tile.className === 'gr-empty') {
          revealEmpty(i, j);
        }
      }// End if(tile.className...
    }// End for (const j...
  }// End for (const i...
}// End function revealEmpty

	/**
	 * @description - called on when player clicks on a mine or has flagged all mines.
	 * @param {boolean} win
	 */
	function gameOver(win){
		if (win) dispatch({type: 'game:win', monetaryReward: minesTotal * 100 })
		else dispatch({type: 'game:lose', hospitalBill: (minesTotal - minesLeft) * -50 })
	}

	/**
	 * @description - generates the map after player clicks for the first time to ensure first click isn't a mine.
	 * @param {number} coordY - Y coordinate of firstClick
	 * @param {number} coordX - X coordinate of firstClick
	 */
	function generateGrid(coordY, coordX){
		// First: create two dimensional grid. gridRows[3][7] - references row 3, column 7
		for (let i = 0; i < height; i++) {
			gridRows[i] = new Array(width);
			for (let j = 0; j < width; j++) {
				gridRows[i][j] = { value: undefined, explored: false};
			}
		}

		// Second: set 3x3 empty tile cluster around player's first click.
		for (let i = coordY -1; i <= coordY + 1; i++) {
			if(i >= 0 && i <= height){
				for (let j = coordX -1; j <= coordX + 1; j++) {
					if(j >= 0 && j <= width){
						gridRows[i][j].value = 'Empty'
						gridRows[i][j].explored = true
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
		//Does not assign any two mines to the same tile or to already assigned 'empty' tiles.

		//Declare constiables.
		let minesRemaining = mines;	//Used as a counter.

		while (minesRemaining > 0){
			let row = Math.floor(Math.random() * gridRows.length);
			let col = Math.floor(Math.random() * gridRows[0].length);

			//Only assign mine and reduce mines count if the tile is empty.
			if(gridRows[row][col].value !== 'Mine' && gridRows[row][col].value !== 'Empty') {
				gridRows[row][col].value = 'Mine';
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
		for (let i = 0; i < height; i++){
			for (let j = 0; j < width; j++){
				//If it's a mine, move to the next tile.
				if (gridRows[i][j].value === `${mapStyle}mine`) continue

				//If it's not a mine, check adjacent tiles for mines to determine the tile class.
				for (let k = i - 1; k <= i + 1; k++){
					//If k is outside the range of the gridRows arrays, we don't want to cause errors.
					if (k < 0 || k >= height) continue
					for(let l = j - 1; l <= j + 1; l++){
						//If l is outside the range of the gridRows arrays, we don't want to cause errors.
						if (l < 0 || l >= width) continue

						//Start counting adjacent mines.
						if (gridRows[k][l].value === `${mapStyle}mine`){
							mineCount++;
						}
					}
				}//End of checking adjacent tiles for mines.

				switch(mineCount){
					case 0:
						gridRows[i][j].value = 'Empty';
						break;
					case 1:
						gridRows[i][j].value = 'Mine1';
						break;
					case 2:
						gridRows[i][j].value = 'Mines2';
						break;
					case 3:
						gridRows[i][j].value = 'Mines3';
						break;
					case 4:
						gridRows[i][j].value = 'Mines4';
						break;
					case 5:
						gridRows[i][j].value = 'Mines5';
						break;
					case 6:
						gridRows[i][j].value = 'Mines6';
						break;
					case 7:
						gridRows[i][j].value = 'Mines7';
						break;
					case 8:
						gridRows[i][j].value = 'Mines8';
						break;
					default:
						throw new Error()
				}//End of switch

				//reset mine counter
				mineCount = 0;
			}
		}//End of traversing the grid.
	}

	/**
   * @description - Reveals an unexplored tile's content
   */
	function handleReveal(i, j) {
    if (firstClick) {
      dispatch({type: 'game:firstClickClicked'})
			generateGrid()
		}

		if (gridRows[i][j].value === 'empty') {
			// revealEmpty(row, col)
		}

		//These two if statements start an animation for the mine to explode.
		if (gridRows[i][j].value === 'mine') {
			this.innerHTML = '<div class=\'explode\'></div><div class=\'smoke\'></div>';
			setTimeout(function() {
				if(!firstClick && $('r'+row+'c'+col).className.includes('mine')) $('r'+row+'c'+col).className = `${mapStyle}crater`
			}, 1000)

			for (let i = 0; i < height; i++) {
				for (let j = 0; j < width; j++) {
					// if(getTileValue(i, j).includes('mine') && !$('r'+i+'c'+j).className.includes('flagged')) {
					//   $('r'+i+'c'+j).className = `${mapStyle}crater`
					//   $('r'+i+'c'+j).innerHTML = '<div class=\'explode\'></div><div class=\'smoke\'></div>'

					//   boom(i, j)
					// }
				}//End of for(j...
			}//End of for (i...

			// gameOver(false)
		}
	}

	return (
		<table id="gameGrid" css={styles.gameGrid}>
			<tbody>
				{
					Array(height).fill(undefined).map((r, i) => {
						return <tr key={i}>
							{
								Array(width).fill(undefined).map((c, j) => <Tile key={`r${i}c${j}`} mapStyle={mapStyle} reveal={() => handleReveal(i, j)} />)
							}
						</tr>
					})
				}
			</tbody>
		</table>
	)
}

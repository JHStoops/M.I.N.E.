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
	const { flaggedMines, height, losses, mapStyle, mines, minesLeft, minesTotal, money, width, wins } = state
	if ((!height && !width) || !mines) return false
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

// TODO: Maybe MineField should pass a callback to recursively open empty tile areas?
function revealEmpty(row, col){
  //When player clicks on an empty tile, this function will reveal the rest
  //of the group of empty tiles and their adjacent tiles (always numbers - never mines)
  let tile;

  for (let i = row - 1; i <= row + 1; i++){
    if (i < 0 || i >= height) continue;

    for (let j = col - 1; j <= col + 1; j++){
      //Don't check the tile itself, only its adjacet tiles.
      if (i === row && j === col) continue;
      if (j < 0 || j >= width) continue;
      tile = $('r'+i+'c'+j);

      //Only deal with tile if it's still unexplored.
      if (tile.className === 'unexplored' || tile.className === 'gr-unexplored'
        || tile.className === 'maybe'  || tile.className === 'gr-maybe'
        || tile.className === 'flagged'  || tile.className === 'gr-flagged'){
        // tile.className = getTileValue(i, j);

        //If the tile happens to be another empty tile, it's time to go recursive!
        if (tile.className === 'empty' || tile.className === 'gr-empty'){
          revealEmpty(i, j);
        }
      }//End if(tile.className...
    }//End for (const j...
  }//End for (const i...
}//End function revealEmpty

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
				gridRows[i][j] = undefined;
			}
		}

		// Second: set 3x3 empty tile cluster around player's first click.
		for (let i = coordY -1; i <= coordY + 1; i++) {
			if(i >= 0 && i <= height){
				for (let j = coordX -1; j <= coordX + 1; j++) {
					if(j >= 0 && j <= width){
						gridRows[i][j] = 'Empty';
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
		let row, col;

		while (minesRemaining > 0){
			row = Math.floor(Math.random() * gridRows.length);
			col = Math.floor(Math.random() * gridRows[0].length);

			//Only assign mine and reduce mines count if the tile is empty.
			if(gridRows[row][col] !== 'Mine' && gridRows[row][col] !== 'Empty') {
				gridRows[row][col] = 'Mine';
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
				if (gridRows[i][j] === 'mine' || gridRows[i][j] === 'gr-mine'){
					continue;
				}

				//If it's not a mine, check adjacent tiles for mines to determine the tile class.
				for (let k = i - 1; k <= i + 1; k++){
					//If k is outside the range of the gridRows arrays, we don't want to cause errors.
					if (k < 0 || k >= height){
						continue;
					}
					for(let l = j - 1; l <= j + 1; l++){
						//If l is outside the range of the gridRows arrays, we don't want to cause errors.
						if (l < 0 || l >= width){
							continue;
						}

						//Start counting adjacent mines.
						if (gridRows[k][l] === 'mine' || gridRows[k][l] === 'gr-mine'){
							mineCount++;
						}
					}
				}//End of checking adjacent tiles for mines.

				switch(mineCount){
					case 0:
						gridRows[i][j] = 'Empty';
						break;
					case 1:
						gridRows[i][j] = 'Mine1';
						break;
					case 2:
						gridRows[i][j] = 'Mines2';
						break;
					case 3:
						gridRows[i][j] = 'Mines3';
						break;
					case 4:
						gridRows[i][j] = 'Mines4';
						break;
					case 5:
						gridRows[i][j] = 'Mines5';
						break;
					case 6:
						gridRows[i][j] = 'Mines6';
						break;
					case 7:
						gridRows[i][j] = 'Mines7';
						break;
					case 8:
						gridRows[i][j] = 'Mines8';
						break;
					default:
						throw new Error()
				}//End of switch

				//reset mine counter
				mineCount = 0;
			}
		}//End of traversing the grid.
	}

	return (
		<table id="gameGrid" css={styles.gameGrid}>
			<tbody>
				{
					Array(height).fill(undefined).map((r, i) => {
						return <tr key={i}>
							{
								Array(width).fill(undefined).map((c, j) => <Tile key={`r${i}c${j}`} mapStyle={mapStyle} generateGrid={() => generateGrid(i, j)} />)
							}
						</tr>
					})
				}
			</tbody>
		</table>
	)
}

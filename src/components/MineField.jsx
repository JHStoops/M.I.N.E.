import React, { useContext, useState } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { GameContext } from '../App'
import { Tile } from './'

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
	const [gridRows, setGridRows] = useState([])
	const { firstClick, flaggedMines, height, losses, mapStyle, mines, minesLeft, minesTotal, money, status, width, wins } = state
	if ((!height && !width) || !mines || status === 'Idle') return false
	if (!height) height = width
	if (!width) width = height

	/**
	 * @description - Reveals an unexplored tile's content
	 */
	function handleReveal(i, j) {
		if (firstClick) {
			dispatch({type: 'game:firstClickClicked'})
			generateGrid(i, j)
		}

		if (gridRows[i][j].value === `${mapStyle}Empty`) {
			revealEmpty(i, j)
		}
		else if (gridRows[i][j].value === `${mapStyle}Mine`) {
			gridRows.forEach(row => {
				row.forEach(tile => {
					if (tile.value === `${mapStyle}Mine`) tile.explored = true
				})
			})

			gameOver(false)
		}
		else {
			gridRows[i][j].explored = true
			setGridRows([...gridRows])
		}
	}

	/**
	 * @description - called on when player clicks on a mine or has flagged all mines.
	 * @param {boolean} win
	 */
	function gameOver(win){
		if (win) dispatch({type: 'game:win', monetaryReward: minesTotal * 100 })
		else dispatch({type: 'game:lose', hospitalBill: (minesTotal - minesLeft) * -50 })
	}

	/**
	 * @description - When player clicks on an empty tile, this function will reveal the rest of the group of empty tiles and their adjacent tiles (always numbers - never mines)
	 * @param {*} row
	 * @param {*} col
	 */
	function revealEmpty(row, col){
		let tile;

		for (let i = row - 1; i <= row + 1; i++) {
			if (i < 0 || i >= height) continue

			for (let j = col - 1; j <= col + 1; j++) {
				// Don't check the tile itself, only its adjacet tiles.
				if (i === row && j === col) continue
				if (j < 0 || j >= width) continue
				tile = gridRows[i][j]

				// If the tile happens to be another empty tile, it's time to go recursive!
				if (!tile.explored && tile.value === `${mapStyle}Empty`) {
					tile.explored = true
					setGridRows([...gridRows])
					revealEmpty(i, j)
				}
				else {
					tile.explored = true
					setGridRows([...gridRows])
				}
			}// End for (const j...
		}// End for (const i...
	}// End function revealEmpty

	/**
	 * @description - generates the map after player clicks for the first time to ensure first click isn't a mine.
	 * @param {number} coordY - Y coordinate of firstClick
	 * @param {number} coordX - X coordinate of firstClick
	 */
	function generateGrid(coordY, coordX){
		// set 3x3 empty tile cluster around player's first click.
		for (let i = coordY -1; i <= coordY + 1; i++) {
			if(i >= 0 && i <= height){
				for (let j = coordX -1; j <= coordX + 1; j++) {
					if(j >= 0 && j <= width){
						gridRows[i][j].value = `${mapStyle}Empty`
					}
				}
			}
		}

		// Assign mines to random tiles. Don't let them occupy the same tile or the empty tiles.
		assignMines();

		// Populate numbers around mines.
		numberMines();

		console.table(gridRows.map(row => row.map(el => el.value)))
	}

	function assignMines(){
		//Assigns mines to random tiles on the grid.
		//Does not assign any two mines to the same tile or to already assigned Empty tiles.

		//Declare constiables.
		let minesRemaining = mines;	//Used as a counter.

		while (minesRemaining > 0){
			let row = Math.floor(Math.random() * gridRows.length)
			let col = Math.floor(Math.random() * gridRows[0].length)

			//Only assign mine and reduce mines count if the tile is empty.
			if(gridRows[row][col].value !== `${mapStyle}Mine` && gridRows[row][col].value !== `${mapStyle}Empty`) {
				gridRows[row][col].value = `${mapStyle}Mine`
				minesRemaining--
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
				if (gridRows[i][j].value === `${mapStyle}Mine`) continue

				//If it's not a mine, check adjacent tiles for mines to determine the tile class.
				for (let k = i - 1; k <= i + 1; k++) {
					//If k is outside the range of the gridRows arrays, we don't want to cause errors.
					if (k < 0 || k >= height) continue
					for (let l = j - 1; l <= j + 1; l++) {
						//If l is outside the range of the gridRows arrays, we don't want to cause errors.
						if (l < 0 || l >= width) continue

						//Start counting adjacent mines.
						if (gridRows[k][l].value === `${mapStyle}Mine`) {
							mineCount++;
						}
					}
				}//End of checking adjacent tiles for mines.

				switch (mineCount) {
					case 0:
						gridRows[i][j].value = `${mapStyle}Empty`;
						break;
					case 1:
						gridRows[i][j].value = `${mapStyle}Mines1`;
						break;
					case 2:
						gridRows[i][j].value = `${mapStyle}Mines2`;
						break;
					case 3:
						gridRows[i][j].value = `${mapStyle}Mines3`;
						break;
					case 4:
						gridRows[i][j].value = `${mapStyle}Mines4`;
						break;
					case 5:
						gridRows[i][j].value = `${mapStyle}Mines5`;
						break;
					case 6:
						gridRows[i][j].value = `${mapStyle}Mines6`;
						break;
					case 7:
						gridRows[i][j].value = `${mapStyle}Mines7`;
						break;
					case 8:
						gridRows[i][j].value = `${mapStyle}Mines8`;
						break;
					default:
						throw new Error()
				}//End of switch

				//reset mine counter
				mineCount = 0;
			}
		}//End of traversing the grid.
	}

	if (gridRows.length === 0 && status === 'Playing') {
		for (let i = 0; i < height; i++) {
			gridRows[i] = new Array(width);
			for (let j = 0; j < width; j++) {
				gridRows[i][j] = { value: undefined, explored: false};
			}
		}
	}

	return (
		<table id="gameGrid" css={styles.gameGrid}>
			<tbody>
				{
					gridRows.map((row, i) => {
						return <tr key={i}>
							{
								row.map((tile, j) => <Tile key={`r${i}c${j}`} value={tile.value} explored={tile.explored} mapStyle={mapStyle} reveal={() => handleReveal(i, j)} />)
							}
						</tr>
					})
				}
			</tbody>
		</table>
	)
}

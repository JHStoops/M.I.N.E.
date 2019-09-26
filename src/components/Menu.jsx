import React, { useContext, useState } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { GameContext } from '../App'

const styles = {
	menu: css`
		float: left;
		background-color: beige;
		border: 1px solid black;
		padding: 5px;
		max-width: 130px;
		height: 100%;

		input[type=number]{
			width: 40px;
		}
	`
}

export default function Menu() {
  const { dispatch, state } = useContext(GameContext)
	const { flaggedMines, height, losses, mapStyle, mines, minesLeft, minesTotal, money, status, width, wins } = state
	const [difficulty, setDifficulty] = useState('Beginner')
	const [customField, setCustomField] = useState({height: 9, mines: 10, width: 9})
	const [_mapStyle, setMapStyle] = useState('Classic')

	function startNewGame() {
		const action = { type: `newGame:${difficulty}` }
		if (difficulty === 'Custom') {
			Object.assign(action, customField)
		}
		dispatch(action)

		// Set mapStyle
		action.type = `mapStyle:${mapStyle}`
		dispatch(action)
	}

	function changeCustomField(attr, value) {
		setCustomField(Object.assign({}, customField, {[attr]: value}))
	}

	return (
		<aside id="gameMenu" css={styles.menu}>
			<h4>Player Stats</h4>
			Wallet: $<span id="playerWallet">{money}</span> <br />
			Wins: <span id="playerWins">{wins}</span> <br />
			Losses: <span id="playerLosses">{losses}</span> <br />
			Flagged mines: <span id="playerFlaggedMines">{flaggedMines}</span> <br />

			<br />
			<h4>Game Stats</h4>
			Mines Total: <span id="minesTotal">{ minesTotal }</span> <br />
			Mines Left: <span id="minesLeft">{ minesLeft }</span> <br />
			Status: <span id="gameState">{ status }</span>

			<br /><br />
			<h4>Game Menu</h4>
			Difficulty:<select id="difficultyChoice" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
				<option value="Beginner" id="Beginner">Beginner</option>
				<option value="Intermediate" id="Intermediate">Intermediate</option>
				<option value="Expert" id="Expert">Expert</option>
				<option value="Custom" id="Custom">Custom</option>
			</select>
			<div id="custMenu" style={{display: 'none'}}>
				Height: <input type="number" min = "9" max = "40" value={customField.height} onChange={(event) => changeCustomField('height', event.target.value)} /><br />
				Width: <input type="number" min = "9" max = "40" value={customField.width} onChange={(event) => changeCustomField('width', event.target.value)} /><br />
				Mines: <input type="number" min = "9" max = "400" value={customField.mines} onChange={(event) => changeCustomField('mines', event.target.value)} /><br />
			</div>
			<br />
			Map Style:<br />
			<input id="Classic" type="radio" name="mineField" value="Classic" onChange={event => setMapStyle(event.target.value)} checked={_mapStyle === 'Classic'} /><label htmlFor="Classic">Classic</label><br />
			<input id="Grassy" type="radio" name="mineField" value="Grassy" onChange={event => setMapStyle(event.target.value)} checked={_mapStyle === 'Grassy'} /><label htmlFor="Grassy">Grassy</label><br />

			<button id="bNewGame" onClick={startNewGame}>Start New Game!</button> <br />
			<button id="bSaveGame">Save Game</button> <br />
			<button id="bLoadGame">Load Game</button> <br /><br />
		</aside>
	)
}
import React, { useState } from 'react'

export default function Menu(props) {
	const { dispatch } = props
	const [difficulty, setDifficulty] = useState('Beginner')
	const [customField, setCustomField] = useState({height: 9, mines: 10, width: 9})
	const [mapStyle, setMapStyle] = useState('Classic')
	if (!dispatch) return false

	function startNewGame() {
		const action = { type: `size:${difficulty}` }
		if (difficulty === 'Custom') {
			Object.assign(action, customField)
		}
		dispatch(action)

		// Set mapStyle
		action.type = mapStyle
		dispatch(action)
	}

	function changeCustomField(attr, value) {
		setCustomField(Object.assign({}, customField, {[attr]: value}))
	}

	return (
		<aside id="gameMenu">
			<h4>Player Stats</h4>
			Player: <span id="playerName"></span> <br />
			Wallet: $<span id="playerWallet"></span> <br />
			Wins: <span id="playerWins"></span> <br />
			Losses: <span id="playerLosses"></span> <br />
			Flagged mines: <span id="playerFlaggedMines"></span> <br />

			<br />
			<h4>Game Stats</h4>
			Mines Total: <span id="minesTotal"></span> <br />
			Mines Left: <span id="minesLeft"></span> <br />
			Status: <span id="gameState"></span>

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
			<input id="Classic" type="radio" name="mineField" value="Classic" onChange={event => setMapStyle(event.target.value)} checked={mapStyle === 'Classic'} /><label htmlFor="Classic">Classic</label><br />
			<input id="Grassy" type="radio" name="mineField" value="Grassy" onChange={event => setMapStyle(event.target.value)} checked={mapStyle === 'Grassy'} /><label htmlFor="Grassy">Grassy</label><br />

			<button id="bNewGame" onClick={startNewGame}>Start New Game!</button> <br />
			<button id="bSaveGame">Save Game</button> <br />
			<button id="bLoadGame">Load Game</button> <br /><br />

			Focus Music:
			<img id="bMusicPlayer" height="63px" width="63px" src="img/pause-play-button.png" onClick={() => { $('musicPlayer').paused ? $('musicPlayer').play() : $('musicPlayer').pause()}} alt="Play concentration music" />
			<audio id="musicPlayer" src="motivational_music.mp3" type="audio/mpeg" />
		</aside>
	)
}

/**
 * @description - return the element with the specified ID
 */
function $(theID){
	if(typeof theID === 'string')
		return document.getElementById(theID);
}
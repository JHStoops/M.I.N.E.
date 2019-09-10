import React, { createContext, useReducer } from 'react'
import { Menu, MineField } from './components'
import './styles.css'

function mineFieldReducer(state, action) {
	switch (action.type) {
		case 'newGame:Beginner':
			return Object.assign({}, state, {
				status: 'Playing',
				height: 9,
				width: 9,
				mines: 10,
				minesLeft: 10,
				minesTotal: 10
			})
			case 'newGame:Intermediate':
				return Object.assign({}, state, {
					status: 'Playing',
					height: 16,
					width: 16,
					mines: 40,
					minesLeft: 40,
					minesTotal: 40
				})
			case 'newGame:Expert':
				return Object.assign({}, state, {
					status: 'Playing',
					height: 16,
					width: 30,
					mines: 99,
					minesLeft: 99,
					minesTotal: 99
				})
		case 'newGame:Custom':
			return Object.assign({}, state, {
				status: 'Playing',
				height: action.height,
				width: action.width,
				mines: action.mines,
				minesLeft: action.mines,
				minesTotal: action.mines
			})
		case 'mapStyle:Classic':
			return Object.assign({}, state, {mapStyle: ''})
		case 'mapStyle:Grassy':
			return Object.assign({}, state, {mapStyle: 'gr-'})
		case 'game:Status':
			return Object.assign({}, state, action.status)
		case 'game:minesLeft':
			return Object.assign({}, state, {minesLeft: action.minesLeft })
		case 'game:Reset':
			return Object.assign({}, state, {
				status: 'Idle',
				minesLeft: state.mines,
				minesTotal: state.mines
			})
		case 'player:wins': // TODO
		case 'player:losses': // TODO
		case 'player:flaggedMines': // TODO
		case 'player:money': // TODO
		default:
			return {
				// GameField
				mapStyle: '',
				status: 'Idle',
				height: 9,
				width: 9,
				mines: 10,
				minesLeft: 10,
				minesTotal: 10,

				// Player
				money: 0,
				wins: 0,
				losses: 0,
				flaggedMines: 0
			}
	}
}

export const GameContext = createContext();

export default function App() {
	const [state, dispatch] = useReducer(mineFieldReducer, {
		mapStyle: '',
		status: 'Idle',
		height: 9,
		width: 9,
		mines: 10,
		minesLeft: 10,
		minesTotal: 10,
		money: 0,
		wins: 0,
		losses: 0,
		flaggedMines: 0
	})

  return (
		<GameContext.Provider value={{ state, dispatch }}>
			<div id="wrapper">
				<h1>M.I.N.E. - Mine Initiative of Nations Everywhere</h1>
				<Menu />
				<MineField />
			</div>
		</GameContext.Provider>
  );
}
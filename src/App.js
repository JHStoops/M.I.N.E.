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
			return Object.assign({}, state, {mapStyle: 'gr_'})
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
		case 'game:win':
			return Object.assign({}, state, {
				status: 'Celebrating 🎉',
				wins: state.wins + 1,
				money: state.money + action.monetaryReward,
				flaggedMines: state.flaggedMines + state.totalMines
			})
		case 'game:lose':
			return Object.assign({}, state, {
				status: 'Deep in Coma 😴',
				losses: state.losses + 1,
				money: state.money - action.hospitalBill,
				flaggedMines: state.flaggedMines + state.totalMines - state.minesLeft
			})
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
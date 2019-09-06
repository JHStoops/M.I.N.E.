import React, { createContext, useReducer } from 'react'
import { Menu, MineField } from './components'
import './styles.css'

function mineFieldReducer(state, action) {
	switch (action.type) {
		case 'size:Beginner':
			return Object.assign({}, state, {
				height: 9,
				width: 9,
				mines: 10
			})
			case 'size:Intermediate':
				return Object.assign({}, state, {
					height: 9,
					width: 9,
					mines: 10
				})
			case 'size:Expert':
				return Object.assign({}, state, {
					height: 9,
					width: 9,
					mines: 10
				})
		case 'size:Custom':
			return Object.assign({}, state, {
				height: action.height,
				width: action.width,
				mines: action.mines
			})
		case 'mapStyle:Classic':
			return Object.assign({}, state, {mapStyle: ''})
		case 'mapStyle:Grassy':
			return Object.assign({}, state, {mapStyle: 'gr-'})
		case 'game:Status':
			return Object.assign({}, state, action.status)
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
				mapStyle: 'Classic',
				height: 9,
				width: 9,
				mines: 10
			}
	}
}

export const ThemeContext = createContext();

export default function App() {
	const [state, dispatch] = useReducer(mineFieldReducer, {
		mapStyle: 'Classic',
		height: 9,
		width: 9,
		mines: 10
	})

  return (
		<ThemeContext.Provider value={state.mapStyle}>
			<div id="wrapper">
				<h1>M.I.N.E. - Mine Initiative of Nations Everywhere</h1>
				<Menu dispatch={dispatch} />
				<MineField state={state} />
			</div>
		</ThemeContext.Provider>
  );
}
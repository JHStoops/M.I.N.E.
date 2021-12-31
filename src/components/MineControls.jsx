import React, { useCallback, useState } from 'react'
import MineField from './MineField'
import './mineField.css'

const difficultyToDimensionsMap = {
  easy: { height: 10, width: 10, mines: 10 },
  medium: { height: 14, width: 18, mines: 40 },
  hard: { height: 20, width: 24, mines: 99 },
}

/**
 * @describe - Presentational component for displaying game controls, e.g. difficulty selector, timer, flags remaining, etc.
*/
export default function MineControls() {
  const [difficulty, setDifficulty] = useState('easy')

  const handleDifficultyChange = useCallback((event) => setDifficulty(event.target.value), [])

  return (
    <div className="gui">
      <div className="hud">
        <select value={difficulty} onChange={handleDifficultyChange}>
          <option name="easy" value="easy">Easy</option>
          <option name="medium" value="medium">Medium</option>
          <option name="hard" value="hard">Hard</option>
        </select>
      </div>
      <MineField dimensions={difficultyToDimensionsMap[difficulty]} />
    </div>
  )
}

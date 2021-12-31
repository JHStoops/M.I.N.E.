import React, { useCallback, useState } from 'react'
import { doToAdjacentTiles, generatePlaceholderMineField, generateRandomField } from '../lib/utils'
import Tile from './Tile'
import './mineField.css'

/**
 * @describe Recursively exposes empty tiles until it reaches field edge or non-empty tiles.
 * @param {array} mineField - 2D array holding all tiles in minefield.
 * @param {number} x - Minefield's column coordinate
 * @param {number} y - Minefield's row coordinate
 */
function exposeEmptyTiles(mineField, x, y) {
  // TODO: Fix this logic. mineField needs to be a different reference from what the component holds in order for setMindeField to update the state.
  doToAdjacentTiles(mineField, x, y, (tileObj, tileX, tileY) => {
    // Do nothing on self
    if (tileX === x && tileY === y) return

    // Do nothing if it has already been explored
    if (tileObj.forceShow) return

    // Set `forceShow` flag
    tileObj.forceShow = true

    // If tile is 'empty' recursively open neighboring tiles
    if (tileObj.type === 'empty') exposeEmptyTiles(mineField, tileX, tileY)
  })

  return mineField
}

/**
 * @describe -
*/
export default function MineField() {
  const [firstClickPerformed, setFirstClickPerformed] = useState(false)
  const [mineField, setMineField] = useState(() => generatePlaceholderMineField(10, 10))

  const handleEmptyTileClick = useCallback(
    (x, y) => {
      let newMineField
      if (firstClickPerformed) {
        newMineField = JSON.parse(JSON.stringify(mineField))
      } else {
        newMineField = generateRandomField(10, 10, 10, { x, y })
        setFirstClickPerformed(true)
      }
      newMineField = exposeEmptyTiles(newMineField, x, y)
      setMineField(newMineField)
    },
    [firstClickPerformed, mineField],
  )

  return mineField.map((row, rowIndex) => (
    <div className="mine-field-row">
      {
        row.map((tile, tileIndex) => (
          <Tile
            // eslint-disable-next-line react/no-array-index-key
            key={`${rowIndex}-${tileIndex}`}
            forceShow={tile.forceShow}
            onEmptyTileClick={() => handleEmptyTileClick(tileIndex, rowIndex)}
            type={tile.type}
          />
        ))
      }
    </div>
  ))
}

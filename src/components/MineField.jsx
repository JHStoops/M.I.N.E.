import React, { useCallback, useEffect, useState } from 'react'
import { exposeEmptyTiles, generatePlaceholderMineField, generateRandomField } from '../lib/utils'
import Tile from './Tile'
import './mineField.css'

/**
 * @describe - Presentational component for displaying the MineField and all its tiles.
*/
export default function MineField({ dimensions }) {
  const [firstClickPerformed, setFirstClickPerformed] = useState(false)
  const [mineField, setMineField] = useState(() => generatePlaceholderMineField(dimensions.width, dimensions.height))

  useEffect(() => {
    console.log('setting mine field...')
    setMineField(generatePlaceholderMineField(dimensions.width, dimensions.height))
  }, [dimensions])

  const handleEmptyTileClick = useCallback(
    (x, y) => {
      let newMineField
      if (firstClickPerformed) {
        newMineField = JSON.parse(JSON.stringify(mineField))
      } else {
        newMineField = generateRandomField(dimensions.width, dimensions.height, dimensions.mines, { x, y })
        setFirstClickPerformed(true)
      }
      newMineField = exposeEmptyTiles(newMineField, x, y)
      setMineField(newMineField)
    },
    [dimensions.height, dimensions.mines, dimensions.width, firstClickPerformed, mineField],
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

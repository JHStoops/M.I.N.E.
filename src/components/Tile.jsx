import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

/**
 * @describe -
*/
export default function Tile({ forceShow, onEmptyTileClick, type }) {
  const [tileState, setTileState] = useState('unexplored')
  const isExplored = tileState === 'explored'

  useEffect(() => {
    if (forceShow) setTileState('explored')
  }, [forceShow])

  const handleClick = useCallback(
    () => {
      if (tileState === 'flagged') return
      if (type === 'mine') console.log('Explode!')
      else if (type === 'empty') onEmptyTileClick()
      setTileState('explored')
    },
    [onEmptyTileClick, tileState, type],
  )

  const handleKeyUp = useCallback(
    (event) => {
      if (event.code === 'Enter') handleClick()
    },
    [handleClick],
  )

  const toggleRightClick = useCallback((event) => {
    event.preventDefault()
    if (tileState === 'explored') setTileState('explored')
    else if (tileState === 'unexplored') setTileState('questionable')
    else if (tileState === 'questionable') setTileState('flagged')
    else setTileState('unexplored')
  }, [tileState])

  if (isExplored) return (<img className="mine-field-tile" onContextMenu={toggleRightClick} src={`/images/${type}.png`} alt={type} />)
  return (
    <img
      className="mine-field-tile"
      src={`/images/${tileState}.png`}
      onContextMenu={toggleRightClick}
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      onDragStart={() => false}
      role="button"
      tabIndex={0}
      alt="unexplored"
    />
  )
}
Tile.propTypes = {
  /** Only set to true when player clicks an empty tile and the field exposes all surrounding tiles. */
  forceShow: PropTypes.bool,
  /** Triggers the field to expose all surrounding tiles recursively. */
  onEmptyTileClick: PropTypes.func.isRequired,
  /** The type of tile to display when it is explored. */
  type: PropTypes.string.isRequired,
}
Tile.defaultProps = {
  forceShow: false,
}

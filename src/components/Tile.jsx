import React, { useContext, useState } from 'react'
import { GameContext } from '../App'

export default function Tile(props) {
  const { id, mapStyle } = props
  const [state, setState] = useState('unexplored')
	const { dispatch, state: { mines, minesLeft } } = useContext(GameContext)

    function markTile(event){
      //Will mark the selected tile as a question mark, which can still be left-clicked to reveal.
      //If it's a question mark, it'll turn into flagged state, where a left-click does nothing.
      //If it's in flagged state, then it'll return to normal unexplored state.

      event.preventDefault();

      switch(state){
        case 'unexplored':
            setState('maybe');
          break;
        case 'maybe':
          if(minesLeft > 0){
            setState('flagged');
            dispatch('game:minesLeft', { minesLeft: minesLeft - 1 })
          }
          else{
            setState('unexplored');
          }
          break;
        case 'flagged':
          if(minesLeft < mines){
            setState('unexplored');
            dispatch('game:minesLeft', { minesLeft: minesLeft + 1 })
          }
          break;
        default:
          throw new Error();
      }
    }

  return <td id={id} className={`${mapStyle}${state}`} onClick={reveal} onContextMenu={markTile} />
}

function reveal() {

}

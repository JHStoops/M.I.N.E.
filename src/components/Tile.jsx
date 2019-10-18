import React, { useContext, useState } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import IMG from '../img'
import { GameContext } from '../App'

export default function Tile(props) {
  const { generateGrid, height, mapStyle, reveal, status, tileValue, width } = props
  const [visualState, setVisualState] = useState('unexplored')
  const { dispatch, state: { firstClick, minesTotal, minesLeft } } = useContext(GameContext)
  const styles = {
    tile: css`
      margin: 0px;
      padding: 0px;
      width: 20px;
      height: 20px;

      &.mine, &.gr_mine {
        background-image:url(${IMG[`${mapStyle}Mine`]});
        position: relative;						/* Need this to display animation. */
        width: 20px;
        height: 20px;
      }
      &.crater, &.gr_crater {
        background-image:url(${IMG[`${mapStyle}Crater`]});
        position: relative;						/* Need this to display animation. */
        width: 20px;
        height: 20px;
      }
      &.explode{
        background-image:url(${IMG.Explosion});
        -webkit-animation: explosion 3s linear;
        -moz-animation: explosion 3s linear;
        -ms-transform: explosion 3s linear;
        -o-animation: explosion 3s linear;
        animation: explosion 3s linear;
        opacity: 0;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 20px;
        height: 20px;
      }
      &.smoke {
        background-image: url(${IMG.Smoke});
        -webkit-animation: smoking 1s infinite;
        -webkit-animation-delay: 2s;
        -moz-animation: smoking 1s infinite;
        -moz-animation-delay: 2s;
        -ms-animation: smoking 1s infinite;
        -ms-animation-delay: 2s;
        -o-animation: smoking 1s infinite;
        -o-animation-delay: 2s;
        animation: smoking 1s infinite;
        animation-delay: 2s;
        opacity: 0;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 20px;
        height: 20px;
      }
      @keyframes explosion {
        0% {
          transform: scale(0) rotate(0deg);
          opacity: 1;
        }
        50% {
          transform: scale(1) rotate(1turn);
          opacity: 1;
        }
        100% {
          transform: scale(0) rotate(2turn);
          opacity: 0;
        }
      }
      @keyframes smoking {
        0% {
          transform: skewX(0deg);
          opacity: 0.6;
        }
        50% {
          transform: skewX(20deg);
          opacity: 0.6;
        }
        100% {
          transform: skewX(-20deg);
          opacity: 0.6;
        }
      }
    `
  }

  /**
   * @description - handles right-clicks on any tile by toggling between unexplored, maybe (?), and flagged
   * @param {object} event - the right-click event object
   */
  function markTile(event){
    event.preventDefault()

    switch(visualState){
      case 'unexplored':
          setVisualState('maybe')
        break
      case 'maybe':
        if(minesLeft > 0) {
          setVisualState('flagged')
          dispatch({ type: 'game:minesLeft', minesLeft: minesLeft - 1 })
        }
        else{
          setVisualState('unexplored')
        }
        break
      case 'flagged':
          setVisualState('unexplored')
          dispatch({ type: 'game:minesLeft', minesLeft: minesLeft + 1 })
        break
    }
  }

  // I don't think this is necessary aymore
  function $(theID){
    if(typeof theID === 'string')
      return document.getElementById(theID);
  }

  /**
   * @description - Detonates all unflagged mines when player reveals a mine.
   */
  function boom(){
    if (tileValue === `${mapStyle}mine`) setTimeout(() => setVisualState(`${mapStyle}crater`), 1000);
  }

  const bgImage = IMG[`${mapStyle}${visualState.charAt(0).toUpperCase() + visualState.slice(1)}`]
  return <td
    css={styles.tile}
    className={`${mapStyle}${visualState}`}
    onClick={reveal}
    onContextMenu={markTile}
    style={{ backgroundImage: 'url(' + bgImage + ')' }}
    />
}
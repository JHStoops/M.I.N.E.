import React, { useContext, useState } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import IMG from '../img'
import { GameContext } from '../App'

const styles = {
  tile: css`
    margin: 0px;
    padding: 0px;
    width: 20px;
    height: 20px;
    background-image:url(${IMG.Unexplored});

    .empty{
      background-image:url(${IMG.Empty});
    }
    .mine1{
      background-image:url(${IMG.Mines1});
    }
    .mines2{
      background-image:url(${IMG.Mines2});
    }
    .mines3{
      background-image:url(${IMG.Mines3});
    }
    .mines4{
      background-image:url(${IMG.Mines4});
    }
    .mines5{
      background-image:url(${IMG.Mines5});
    }
    .mines6{
      background-image:url(${IMG.Mines6});
    }
    .mines7{
      background-image:url(${IMG.Mines7});
    }
    .mines8{
      background-image:url(${IMG.Mines8});
    }
    .unexplored{
      background-image:url(${IMG.Unexplored});
    }
    .maybe{
      background-image:url(${IMG.Maybe});
    }
    .flagged{
      background-image:url(${IMG.Flagged});
    }
    .mine{
      background-image:url(${IMG.Mine});
      position: relative;						/* Need this to display animation. */
      width: 20px;
      height: 20px;
    }
    .crater {
      background-image:url(${IMG.Crater});
      position: relative;						/* Need this to display animation. */
      width: 20px;
      height: 20px;
    }
    .gr-empty{
      background-image:url(${IMG.gr_Empty});
    }
    .gr-mine1{
      background-image:url(${IMG.gr_Mines1});
    }
    .gr-mines2{
      background-image:url(${IMG.gr_Mines2});
    }
    .gr-mines3{
      background-image:url(${IMG.gr_Mines3});
    }
    .gr-mines4{
      background-image:url(${IMG.gr_Mines4});
    }
    .gr-mines5{
      background-image:url(${IMG.gr_Mines5});
    }
    .gr-mines6{
      background-image:url(${IMG.gr_Mines6});
    }
    .gr-mines7{
      background-image:url(${IMG.gr_Mines7});
    }
    .gr-mines8{
      background-image:url(${IMG.gr_Mines8});
    }
    .gr-unexplored{
      background-image:url(${IMG.gr_Unexplored});
    }
    .gr-maybe{
      background-image:url(${IMG.gr_Maybe});
    }
    .gr-flagged{
      background-image:url(${IMG.gr_Flagged});
    }
    .gr-mine{
      background-image:url(${IMG.gr_Mine});
      position: relative;						/* Need this to display animation. */
      width: 20px;
      height: 20px;
    }
    .gr-crater {
      background-image:url(${IMG.gr_Crater});
      position: relative;						/* Need this to display animation. */
      width: 20px;
      height: 20px;
    }
    .explode{
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
    .smoke {
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
        -webkit-transform: scale(0) rotate(0deg);	/*Chrome 4.0+, Safari 3.2+, Opera 15.0+*/
        -moz-transform: scale(0) rotate(0deg);		/*Firefox 3.5+*/
        -ms-transfrom: scale(0) rotate(0deg);		/*IE 9.0+*/
        -o-transform: scale(0) rotate(0deg);		/*Opera 10.5+*/
        transform: scale(0) rotate(0deg);			/*Chrome 36.0+, Edge 12.0+, IE 10.0+, Firefox 16.0+, Opera 23.0+*/
        opacity: 1;
      }
      50% {
        -webkit-transform: scale(1) rotate(1turn);
        -moz-transform: scale(1) rotate(1turn);
        -ms-transform: scale(1) rotate(1turn);
        -o-transform: scale(1) rotate(1turn);
        transform: scale(1) rotate(1turn);
        opacity: 1;
      }
      100% {
        -webkit-transform: scale(0) rotate(2turn);
        -moz-transform: scale(0) rotate(2turn);
        -ms-transform: scale(0) rotate(2turn);
        -o-transform: scale(0) rotate(2turn);
        transform: scale(0) rotate(2turn);
        opacity: 0;
      }
    }
    @keyframes smoking {
      0% {
        -webkit-transform: skewX(0deg);
        -moz-transform: skewX(0deg);
        -ms-transform: skewX(0deg);
        -o-transform: skewX(0deg);
        transform: skewX(0deg);
        opacity: 0.6;
      }
      50% {
        -webkit-transform: skewX(20deg);
        -moz-transform: skewX(20deg);
        -ms-transform: skewX(20deg);
        -o-transform: skewX(20deg);
        transform: skewX(20deg);
        opacity: 0.6;
      }
      100% {
        -webkit-transform: skewX(-20deg);
        -moz-transform: skewX(-20deg);
        -ms-transform: skewX(-20deg);
        -o-transform: skewX(-20deg);
        transform: skewX(-20deg);
        opacity: 0.6;
      }
    }
  `
}

export default function Tile(props) {
  const { id, height, mapStyle, tileValue, width } = props
  const [revealState, setRevealState] = useState('unexplored')
  const { dispatch, state: { mines, minesLeft } } = useContext(GameContext)

    function markTile(event){
      //Will mark the selected tile as a question mark, which can still be left-clicked to reveal.
      //If it's a question mark, it'll turn into flagged state, where a left-click does nothing.
      //If it's in flagged state, then it'll return to normal unexplored state.

      event.preventDefault();

      switch(revealState){
        case 'unexplored':
            setRevealState('maybe');
          break;
        case 'maybe':
          if(minesLeft > 0){
            setRevealState('flagged');
            dispatch('game:minesLeft', { minesLeft: minesLeft - 1 })
          }
          else{
            setRevealState('unexplored');
          }
          break;
        case 'flagged':
          if(minesLeft < mines){
            setRevealState('unexplored');
            dispatch('game:minesLeft', { minesLeft: minesLeft - 1 })
          }
          break;
        default:
          throw new Error();
      }
    }

function reveal() {
  //Reveals the tile's true contents by transferring the value from the Grid to the user's map.

  //If first click, generate the grid.
  let firstClick = true // FIXME: Replace with reducer state
  if (firstClick){
    // generateGrid(this.parentNode.rowIndex, this.cellIndex);
  }

  //Looks up the id of the selected tile, manipulates the id to get the row and col indices.
  if (this.className.includes('unexplored') || this.className.includes('maybe')) {
    const col = this.cellIndex
    const row = this.parentNode.rowIndex

    //Retrieve the classname from the Model.
    // this.className = getTileValue(row, col)

    if (this.className.includes('empty')) {
      // revealEmpty(row, col)
    }

    //These two if statements start an animation for the mine to explode.
    if (this.className.includes('mine')){
      this.innerHTML = '<div class=\'explode\'></div><div class=\'smoke\'></div>';
      setTimeout(function() {
        if(!firstClick && $('r'+row+'c'+col).className.includes('mine')) $('r'+row+'c'+col).className = `${mapStyle}crater`
      }, 1000)

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          // if(getTileValue(i, j).includes('mine') && !$('r'+i+'c'+j).className.includes('flagged')) {
          //   $('r'+i+'c'+j).className = `${mapStyle}crater`
          //   $('r'+i+'c'+j).innerHTML = '<div class=\'explode\'></div><div class=\'smoke\'></div>'

          //   boom(i, j)
          // }
        }//End of for(j...
      }//End of for (i...

      // gameOver(false)
    }
  }
}

// I don't think this is necessary aymore
function $(theID){
  if(typeof theID === 'string')
    return document.getElementById(theID);
}

// I don't think this is necessary aymore (Just dispatch loss, the MineField should pass props down to trigger animation)
function boom(row, col){
  //Detonates all unflagged mines when player reveals a mine.

  if($('r'+row+'c'+col).className === 'mine')
    setTimeout(function() {
      // if(!firstClick && $('r'+row+'c'+col).className === 'mine') $('r'+row+'c'+col).className = 'crater';
    }, 1000);
  else
    setTimeout(function() {
      // if(!firstClick && $('r'+row+'c'+col).className === 'gr-mine') $('r'+row+'c'+col).className = 'gr-crater';
    }, 1000);
}

  return <td id={id} css={styles.tile} className={`${mapStyle}${revealState}`} onClick={reveal} onContextMenu={markTile} />
}
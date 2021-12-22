function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * @describe Perform an action on each adjacent tile.
 * @param {Array} mineField - The 2D array of tiles in the minefield.
 * @param {Number} x - start x coordinate.
 * @param {Number} y - Start y coordinate.
 * @param {Function} action - The action to be performed per adjacent tile.
 */
export function doToAdjacentTiles(mineField, x, y, action) {
  for (let i = Math.max(0, x); i <= Math.min(mineField[0].length - 1, x + 1); i++) {
    for (let j = Math.max(0, y); j <= Math.min(mineField.length - 1, y + 1); j++) {
      action(mineField[y][x], x, y)
    }
  }
}

/**
 *
 * @param {Number} width - How many tiles wide to make the mine field.
 * @param {Number} height - How many tiles high to make the mine field.
 * @param {Number} mines - How many mines to place in the mine field
 */
export function generateRandomField(width, height, mines, firstClickCoords) {
  if (mines >= width * height) throw Error('generateRandomField(...): Mines exceeded number of tiles.')
  const mineField = new Array(height)
    .fill()
    .map((row) => new Array(width).fill()
      .map((tile) => ({ forceShow: false, type: 'empty'}))
    )

  // randomly place mines
  for (let i = 0; i < mines; i++) {
    // Keep generating new numbers until we get one that isn't a mine already, the firstClick coordinate, and to allow first click to be an empty tile
    let column
    let row
    do {
      column = getRandomNumber(0, width)
      row = getRandomNumber(0, height)
    } while (mineField[row][column].type === 'mine'
      || (
        (column < firstClickCoords.x + 2 && column > firstClickCoords.x - 2)
        && (row < firstClickCoords.y + 2 && row > firstClickCoords.y - 2)))

    mineField[row][column].type = 'mine'
  }

  // Put in numbers
  mineField.forEach((row, rowIndex) => {
    row.forEach((tile, tileIndex) => {
      if (tile === 'mine') return
      let mineCount = 0

      doToAdjacentTiles(mineField, tileIndex, rowIndex, (tileObj) => {
        if (tileObj.type === 'mine') mineCount++
      })

      if (mineCount) mineField[rowIndex][tileIndex].type = `mines${mineCount}`
    })
  })

  console.log(mineField)
  return mineField
}

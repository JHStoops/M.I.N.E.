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
  for (let i = Math.max(0, x - 1); i <= Math.min(mineField[0].length - 1, x + 1); i++) {
    for (let j = Math.max(0, y - 1); j <= Math.min(mineField.length - 1, y + 1); j++) {
      if (!(i === x && j === y)) action(mineField[j][i], i, j)
    }
  }
}

export function generatePlaceholderMineField(width, height) {
  return new Array(height)
    .fill()
    .map(() => new Array(width)
      .fill()
      .map(() => ({ forceShow: false, type: 'empty' })))
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
    .map(() => new Array(width).fill()
      .map(() => ({ forceShow: false, type: 'empty' })))

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
      if (tile.type === 'mine') return
      let mineCount = 0

      doToAdjacentTiles(mineField, tileIndex, rowIndex, (tileObj) => {
        if (tileObj.type === 'mine') mineCount++
      })

      if (mineCount) mineField[rowIndex][tileIndex].type = `mines${mineCount}`
    })
  })

  return mineField
}

/**
 * @describe Recursively exposes empty tiles until it reaches field edge or non-empty tiles.
 * @param {array} mineField - 2D array holding all tiles in minefield.
 * @param {number} x - Minefield's column coordinate
 * @param {number} y - Minefield's row coordinate
 */
export function exposeEmptyTiles(mineField, x, y) {
  // TODO: Fix this logic. mineField needs to be a different reference from what the component holds in order for setMindeField to update the state.
  doToAdjacentTiles(mineField, x, y, (tileObj, tileX, tileY) => {
    // Do nothing on self
    if (tileX === x && tileY === y) return

    // Do nothing if it has already been explored
    if (tileObj.forceShow) return

    // Set `forceShow` flag
    // eslint-disable-next-line no-param-reassign
    tileObj.forceShow = true

    // If tile is 'empty' recursively open neighboring tiles
    if (tileObj.type === 'empty') exposeEmptyTiles(mineField, tileX, tileY)
  })

  return mineField
}

/**
 *
 * @param {Number} width - How many tiles wide to make the field.
 * @param {Number} height - How many tiles high to make the field.
 * @param {Number} mines - How many mines to place in the field
 */
export function generateRandomField(width, height, mines) {
  if (mines >= width * height) throw Error('generateRandomField(...): Mines exceeded number of tiles.')
  const field = new Array(height).fill(new Array(width).fill('empty'))

  // randomly place mines

  // Put in numbers

  return field
}

export function something() {}

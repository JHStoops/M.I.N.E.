import React from 'react'
import PropTypes from 'prop-types'
import { generateRandomField } from '../lib/utils'

/**
 * @describe -
*/
export default function MineField({}) {
  console.log(generateRandomField(10, 10, 10))
  return 'MineField'
}
MineField.propTypes = {

}

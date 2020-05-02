const getFirstEmptyField = (map, z, x) => {
  const size = map.length
  let y = size

  for (let i = size - 1; i > 0; i--) {
    if (map[i][z][x] === 0) {
      y = i
    } else {
      break
    }
  }

  return y
}

export default getFirstEmptyField

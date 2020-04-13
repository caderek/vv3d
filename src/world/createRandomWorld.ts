import blocks from "../blocks"

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const createRandomWorld = () => {
  const size = randomInt(3, 15)
  console.log(size)

  let world = []
  for (let y = 0; y < size; y++) {
    world.push([])

    for (let z = 0; z < size; z++) {
      world[y].push([])

      for (let x = 0; x < size; x++) {
        const randomIndex = randomInt(0, blocks.length - 1)
        world[y][z].push({ type: blocks[randomIndex].name })
      }
    }
  }

  return world
}

export default createRandomWorld

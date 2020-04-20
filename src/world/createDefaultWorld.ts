import blocks from "../blocks"

const createDefaultWorld = (size, floorHeight) => {
  let world = []
  for (let y = 0; y < size; y++) {
    world.push([])

    for (let z = 0; z < size; z++) {
      world[y].push([])

      for (let x = 0; x < size; x++) {
        world[y][z].push(y < floorHeight ? 10 : null)
      }
    }
  }

  return world
}

export default createDefaultWorld

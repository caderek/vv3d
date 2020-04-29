import blocksInfo from "./blocks"
import createRandomWorld from "./world/createRandomWorld"
import WorldGraph from "./world/world-graph"
import { saveWorld } from "./save"

const createWorld = (game, savedWorld, blocks, scene, shadows, lights) => {
  const { map, data } = savedWorld ? savedWorld : createRandomWorld()
  game.world.map = map
  game.world.data = data
  game.world.graph = new WorldGraph(game)

  game.world.size = game.world.map.length
  game.world.items = []

  for (let y = 0; y < game.world.size; y++) {
    for (let z = 0; z < game.world.size; z++) {
      for (let x = 0; x < game.world.size; x++) {
        if (game.world.map[y][z][x] !== 0) {
          const [shapeId, materialId, rotation] = String(
            game.world.map[y][z][x],
          ).split("_")

          blocks.create(y, z, x, shapeId, materialId, rotation)
        }
      }
    }
  }

  lights.createSkybox(game.world.size)
  saveWorld(game)
}

export default createWorld

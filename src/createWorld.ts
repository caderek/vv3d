import blocksInfo from "./blocks"
import createVoxel from "./createVoxel"
import createRandomWorld from "./world/createRandomWorld"
import WorldGraph from "./world/world-graph"
import { saveWorld } from "./save"

const createWorld = (game, savedWorld, baseBlocks, scene, shadows, lights) => {
  game.world.map = savedWorld ? savedWorld : createRandomWorld()
  game.world.graph = new WorldGraph(game)

  game.world.size = game.world.map.length
  console.log("Size:", game.world.size)
  game.world.items = []

  for (const key in baseBlocks) {
    baseBlocks[key].setParent(null)
    baseBlocks[key].isVisible = false
  }

  for (let y = 0; y < game.world.size; y++) {
    for (let z = 0; z < game.world.size; z++) {
      for (let x = 0; x < game.world.size; x++) {
        if (game.world.map[y][z][x] !== null) {
          createVoxel(
            scene,
            game,
            baseBlocks[blocksInfo[game.world.map[y][z][x]].name],
            shadows.shadowGenerator,
            y,
            z,
            x,
            false,
          )
        }
      }
    }
  }

  lights.createSkybox(game.world.size)
  saveWorld(game.world.map)
}

export default createWorld

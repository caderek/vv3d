import blocksInfo from "./blocks"
import createRandomWorld from "./world/createRandomWorld"
import WorldGraph from "./world/world-graph"
import { saveWorld } from "./save"
import Cyclops from "./entities/cyclops"

const mobClasses = {
  Cyclops,
}

const createWorld = (
  game,
  savedWorld,
  blocks,
  scene,
  shadows,
  lights,
  sounds,
  modelsMeta,
) => {
  const { map, data, mobs } = savedWorld ? savedWorld : createRandomWorld()
  game.world.map = map
  game.world.data = data
  game.world.graph = new WorldGraph(game)
  game.world.mobs = mobs

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

  if (mobs) {
    game.mobs = mobs.map(({ name, y, z, x }) =>
      new mobClasses[name](scene, game, sounds, modelsMeta).place(y, z, x),
    )
  }

  saveWorld(game)
}

export default createWorld

const incrementByFace = [
  {
    0: { z: -1, y: 0, x: 0 },
    1: { z: -1, y: 0, x: 0 },
    2: { z: 1, y: 0, x: 0 },
    3: { z: 1, y: 0, x: 0 },
    4: { z: 0, y: 0, x: -1 },
    5: { z: 0, y: 0, x: -1 },
    6: { z: 0, y: 0, x: 1 },
    7: { z: 0, y: 0, x: 1 },

    8: { z: 0, y: 1, x: 0 },
    9: { z: 0, y: 1, x: 0 },
    10: { z: 0, y: -1, x: 0 },
    11: { z: 0, y: -1, x: 0 },
  },
  {
    0: { z: 0, y: 0, x: 1 },
    1: { z: 0, y: 0, x: 1 },
    2: { z: 0, y: 0, x: -1 },
    3: { z: 0, y: 0, x: -1 },
    4: { z: -1, y: 0, x: 0 },
    5: { z: -1, y: 0, x: 0 },
    6: { z: 1, y: 0, x: 0 },
    7: { z: 1, y: 0, x: 0 },

    8: { z: 0, y: 1, x: 0 },
    9: { z: 0, y: 1, x: 0 },
    10: { z: 0, y: -1, x: 0 },
    11: { z: 0, y: -1, x: 0 },
  },
  {
    0: { z: 1, y: 0, x: 0 },
    1: { z: 1, y: 0, x: 0 },
    2: { z: -1, y: 0, x: 0 },
    3: { z: -1, y: 0, x: 0 },
    4: { z: 0, y: 0, x: 1 },
    5: { z: 0, y: 0, x: 1 },
    6: { z: 0, y: 0, x: -1 },
    7: { z: 0, y: 0, x: -1 },

    8: { z: 0, y: 1, x: 0 },
    9: { z: 0, y: 1, x: 0 },
    10: { z: 0, y: -1, x: 0 },
    11: { z: 0, y: -1, x: 0 },
  },
  {
    0: { z: 0, y: 0, x: -1 },
    1: { z: 0, y: 0, x: -1 },
    2: { z: 0, y: 0, x: 1 },
    3: { z: 0, y: 0, x: 1 },
    4: { z: 1, y: 0, x: 0 },
    5: { z: 1, y: 0, x: 0 },
    6: { z: -1, y: 0, x: 0 },
    7: { z: -1, y: 0, x: 0 },

    8: { z: 0, y: 1, x: 0 },
    9: { z: 0, y: 1, x: 0 },
    10: { z: 0, y: -1, x: 0 },
    11: { z: 0, y: -1, x: 0 },
  },
]

const gather = (scene, game, pickedMesh, ship, sounds) => {
  sounds.gather.play()
  pickedMesh.dispose()
  scene.getMeshByName(`item_${pickedMesh.id}`).dispose()
  const light = scene.getLightByID(`light_${pickedMesh.id}`)
  if (light) {
    light.dispose()
  }
  const [y, z, x] = pickedMesh.id.split("_").map(Number)
  ship.shoot(y, z, x, "right")
  game.world.map[y][z][x] = 0
}

const build = (game, pickedMesh, faceId, ship, sounds, blocks, state) => {
  const [gridY, gridZ, gridX] = pickedMesh.id.split("_").map(Number)
  const rotation = game.world.map[gridY][gridZ][gridX].split("_")[2]
  const incrementsTable =
    rotation === undefined
      ? incrementByFace[2]
      : incrementByFace[Number(rotation)]
  const inc = incrementsTable[faceId]
  const y = gridY + inc.y
  const z = gridZ + inc.z
  const x = gridX + inc.x

  if (
    y >= 0 &&
    y < game.world.size - 2 &&
    z > 0 &&
    z < game.world.size - 1 &&
    x > 0 &&
    x < game.world.size - 1 &&
    game.world.map[y][z][x] === 0
  ) {
    sounds.build.play()
    ship.shoot(y, z, x, "left")

    blocks.create(
      y,
      z,
      x,
      state.activeShape,
      state.activeMaterial,
      undefined,
      true,
    )
  } else {
    console.log({ y, z, x })
    console.log("??", game.world.map[y][z][x])
    console.log({ faceId })
    console.log({ inc })
    sounds.denied.play()
  }
}

export { gather, build }

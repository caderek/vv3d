import * as BABYLON from "babylonjs"
import { saveWorld } from "./save"
import { blocksValues } from "./blocks"

const createVoxel = (
  scene,
  game,
  parentMesh,
  shadowGenerator,
  y,
  z,
  x,
  save = true,
) => {
  const gap = 0.0

  game.world.map[y][z][x] = blocksValues.find(
    ({ name }) => name === parentMesh.id,
  ).id

  const item = parentMesh.createInstance(`item_${y}_${z}_${x}`)

  item.position.y = y + gap * y
  item.position.z = z + gap * z
  item.position.x = x + gap * x
  item.isPickable = false
  item.isVisible = true
  item.material.maxSimultaneousLights = 12
  item.cullingStrategy =
    BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY
  item.freezeWorldMatrix()

  if (!parentMesh.name.includes("glow")) {
    shadowGenerator.addShadowCaster(item)
  }

  let light

  if (parentMesh.name.includes("glow-white")) {
    light = new BABYLON.PointLight(
      `light_${y}_${z}_${x}`,
      new BABYLON.Vector3(x, y, z),
      scene,
    )
    light.intensity = 10
    // light.includedOnlyMeshes = getItemsWithinRadius(scene, 4, y, z, x)
  }

  const box = BABYLON.MeshBuilder.CreateBox(
    `${y}_${z}_${x}`,
    {
      width: 1,
      height: 1,
      depth: 1,
    },
    scene,
  )

  box.position.y = y
  box.position.z = z
  box.position.x = x
  box.material = new BABYLON.StandardMaterial("none", scene)
  box.material.alpha = 0
  box.isVisible = false

  if (save) {
    saveWorld(game.world.map)
  }

  game.world.items.push(item)
  game.world.items.push(box)

  if (light) {
    game.world.items.push(light)
  }
}

export default createVoxel

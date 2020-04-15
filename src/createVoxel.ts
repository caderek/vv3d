import * as BABYLON from "babylonjs"
import { saveWorld } from "./save"
import { blocksValues } from "./blocks"

const createVoxel = (
  scene,
  world,
  parentMesh,
  shadowGenerator,
  y,
  z,
  x,
  save = true,
) => {
  const gap = 0.0

  world[y][z][x] = blocksValues.find(({ name }) => name === parentMesh.id).id

  const item = parentMesh.createInstance(`item_${y}_${z}_${x}`)

  item.position.y = y + gap * y
  item.position.z = z + gap * z
  item.position.x = x + gap * x
  item.isPickable = false
  item.isVisible = true
  item.material.maxSimultaneousLights = 12

  if (!parentMesh.name.includes("glow")) {
    shadowGenerator.addShadowCaster(item)
  }

  if (parentMesh.name.includes("glow-white")) {
    const light = new BABYLON.PointLight(
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
    saveWorld(world)
  }

  // item.physicsImpostor = new BABYLON.PhysicsImpostor(
  //   box,
  //   BABYLON.PhysicsImpostor.BoxImpostor,
  //   { mass: 0, restitution: 0.9 },
  //   scene,
  // )
}

export default createVoxel

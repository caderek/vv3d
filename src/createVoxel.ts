import * as BABYLON from "babylonjs"
import { saveWorld } from "./save"
import { blocksValues } from "./blocks"

const cornerAngles = [
  Math.PI / 4,
  (3 * Math.PI) / 4,
  (5 * Math.PI) / 4,
  (7 * Math.PI) / 4,
]

enum Rotations {
  FRONT,
  RIGHT,
  BACK,
  LEFT,
}

const rotationAngles = [Math.PI, 1.5 * Math.PI, 0, 0.5 * Math.PI]

const getRotation = (scene, box) => {
  const angle = BABYLON.Angle.BetweenTwoPoints(
    new BABYLON.Vector2(
      scene.activeCamera.position.x,
      scene.activeCamera.position.z,
    ),
    new BABYLON.Vector2(box.position.x, box.position.z),
  )
  const rad = angle.radians()

  let rotation = 0

  if (rad > cornerAngles[0] && rad <= cornerAngles[1]) {
    rotation = Rotations.FRONT
  } else if (rad > cornerAngles[1] && rad <= cornerAngles[2]) {
    rotation = Rotations.RIGHT
  } else if (rad > cornerAngles[2] && rad <= cornerAngles[3]) {
    rotation = Rotations.BACK
  } else {
    rotation = Rotations.LEFT
  }

  return rotation
}

const createVoxel = (
  scene,
  game,
  parentMesh,
  shadows,
  y,
  z,
  x,
  save = true,
  rotation = undefined,
) => {
  const gap = 0.0

  const blockData = blocksValues.find(({ name }) => name === parentMesh.id)

  const item = parentMesh.createInstance(`item_${y}_${z}_${x}`)

  item.position.y = y + gap * y
  item.position.z = z + gap * z
  item.position.x = x + gap * x
  item.isPickable = false
  item.isVisible = true
  item.material.maxSimultaneousLights = 12
  item.cullingStrategy =
    BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY

  if (!parentMesh.name.includes("glow")) {
    shadows.addCaster(item)
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
  box.isVisible = false

  if (blockData.rotatable) {
    rotation = rotation !== undefined ? rotation : getRotation(scene, box)

    item.rotate(BABYLON.Axis.Y, rotationAngles[rotation], BABYLON.Space.LOCAL)
    game.world.map[y][z][x] = `${blockData.id}_${rotation}`
  } else {
    game.world.map[y][z][x] = blockData.id
  }

  // item.freezeWorldMatrix()

  if (save) {
    saveWorld(game)
  }

  game.world.items.push(item)
  game.world.items.push(box)

  if (light) {
    game.world.items.push(light)
  }
}

export default createVoxel

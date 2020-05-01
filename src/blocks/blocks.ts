import createMaterials from "./materials"
import createShapes from "./shapes"
import { saveWorld } from "../save"

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

class Blocks {
  public materials: any
  public shapes: any
  private scene: any
  private game: any
  private shadows: any
  private baseBlocks: { [key: string]: any }

  constructor(scene, game, shadows) {
    this.scene = scene
    this.game = game
    this.shadows = shadows
    this.materials = createMaterials(scene)
    this.shapes = createShapes(scene)
    this.baseBlocks = {}
  }

  create(y, z, x, shapeId, materialId, rotation = undefined, save = false) {
    const gap = 0.0
    const baseBlockName = `${shapeId}_${materialId}`

    if (!this.baseBlocks[baseBlockName]) {
      this.createBaseBlock(shapeId, materialId)
    }

    const item = this.baseBlocks[baseBlockName].createInstance(
      `item_${y}_${z}_${x}`,
    )

    item.position.y = y + gap * y
    item.position.z = z + gap * z
    item.position.x = x + gap * x
    item.isPickable = false
    item.isVisible = true
    item.material.maxSimultaneousLights = 12
    item.cullingStrategy =
      BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY

    if (this.shapes[shapeId].rotatable) {
      rotation = rotation !== undefined ? rotation : this.getRotation(x, z)

      item.rotate(BABYLON.Axis.Y, rotationAngles[rotation], BABYLON.Space.LOCAL)
      this.game.world.map[y][z][x] = `${shapeId}_${materialId}_${rotation}`
    } else {
      this.game.world.map[y][z][x] = `${shapeId}_${materialId}`
    }

    if (
      this.materials[materialId].emission === 0 &&
      !this.materials[materialId].groups.includes("water")
    ) {
      this.shadows.addCaster(item)
    }

    const lightSettings = this.materials[materialId].light

    if (lightSettings) {
      this.addLight(y, z, x, lightSettings)
    }

    item.freezeWorldMatrix()

    this.createBox(y, z, x)

    this.game.world.items.push(item)

    if (save) {
      saveWorld(this.game)
    }

    return item
  }

  private createBaseBlock(shapeId, materialId) {
    const baseBlock = this.shapes[shapeId].mesh.clone(
      `${shapeId}_${materialId}`,
    )
    baseBlock.material = this.materials[materialId].material
    baseBlock.receiveShadows = true
    baseBlock.makeGeometryUnique()

    this.baseBlocks[`${shapeId}_${materialId}`] = baseBlock
  }

  private addLight(y, z, x, lightSettings) {
    const light = new BABYLON.PointLight(
      `light_${y}_${z}_${x}`,
      new BABYLON.Vector3(x, y, z),
      this.scene,
    )
    light.intensity = lightSettings.intensity
    light.diffuse = new BABYLON.Color3(...lightSettings.color)

    this.game.world.items.push(light)
  }

  private createBox(y, z, x) {
    const box = BABYLON.MeshBuilder.CreateBox(
      `${y}_${z}_${x}`,
      {
        width: 1,
        height: 1,
        depth: 1,
      },
      this.scene,
    )

    box.position.y = y
    box.position.z = z
    box.position.x = x
    box.isVisible = false

    this.game.world.items.push(box)
  }

  private getRotation(x, z) {
    const angle = BABYLON.Angle.BetweenTwoPoints(
      new BABYLON.Vector2(
        this.scene.activeCamera.position.x,
        this.scene.activeCamera.position.z,
      ),
      new BABYLON.Vector2(x, z),
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
}

export default Blocks

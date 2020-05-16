import createMaterials from "./materials"
import createShapes from "./shapes"
import { saveWorld } from "../save"

const cornerAngles = [0, Math.PI / 2, Math.PI, Math.PI + Math.PI / 2]
const flipAngles = [
  0,
  Math.PI / 4,
  Math.PI / 2,
  (3 * Math.PI) / 4,
  Math.PI,
  (5 * Math.PI) / 4,
  Math.PI + Math.PI / 2,
  (7 * Math.PI) / 4,
]

const sideAngles = [
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

    const item = this.shapes[shapeId].children
      ? // !TODO OPTIMIZE to instances!
        this.baseBlocks[baseBlockName].clone(`item_${y}_${z}_${x}`)
      : this.baseBlocks[baseBlockName].createInstance(`item_${y}_${z}_${x}`)

    // if (this.shapes[shapeId].children) {
    //   this.baseBlocks[baseBlockName].getChildren().forEach((child, index) => {
    //     const childInstance = child.createInstance(
    //       `child_${y}_${z}_${x}_${index}`,
    //     )
    //     childInstance.isVisible = true
    //     childInstance.isPickable = false
    //     childInstance.setParent(item)
    //     childInstance.position = child.position
    //   })
    // }

    item.position.y = y + gap * y
    item.position.z = z + gap * z
    item.position.x = x + gap * x
    item.isPickable = false
    item.isVisible = true

    if (this.shapes[shapeId].rotatable) {
      rotation =
        rotation !== undefined ? rotation : this.getRotation(x, z, shapeId)

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

    this.createBox(y, z, x, this.shapes[shapeId].box)

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

  private createBox(y, z, x, boxData) {
    const height = boxData ? boxData.size[0] : 1
    const depth = boxData ? boxData.size[1] : 1
    const width = boxData ? boxData.size[2] : 1
    const offsetY = boxData ? boxData.offset[0] : 0
    const offsetZ = boxData ? boxData.offset[1] : 0
    const offsetX = boxData ? boxData.offset[2] : 0

    const box = BABYLON.MeshBuilder.CreateBox(
      `${y}_${z}_${x}`,
      {
        width,
        height,
        depth,
      },
      this.scene,
    )

    box.position.y = y + offsetY
    box.position.z = z + offsetZ
    box.position.x = x + offsetZ

    box.isVisible = false

    this.game.world.items.push(box)
  }

  private getRotation(x, z, shapeId) {
    const angle = BABYLON.Angle.BetweenTwoPoints(
      new BABYLON.Vector2(
        this.scene.activeCamera.position.x,
        this.scene.activeCamera.position.z,
      ),
      new BABYLON.Vector2(x, z),
    )
    const rad = angle.radians()

    let rotation = 0

    if (this.shapes[shapeId].rotationType === "flip") {
      const angles = flipAngles

      if (
        (rad > angles[0] && rad <= angles[1]) ||
        (rad > angles[5] && rad <= angles[6])
      ) {
        rotation = Rotations.BACK
      } else if (
        (rad > angles[1] && rad <= angles[2]) ||
        (rad > angles[4] && rad <= angles[5])
      ) {
        rotation = Rotations.FRONT
      } else if (
        (rad > angles[3] && rad <= angles[4]) ||
        (rad > angles[6] && rad <= angles[7])
      ) {
        rotation = Rotations.RIGHT
      } else {
        rotation = Rotations.LEFT
      }
    } else {
      const angles =
        this.shapes[shapeId].rotationType === "side" ? sideAngles : cornerAngles

      if (rad > angles[0] && rad <= angles[1]) {
        rotation = Rotations.FRONT
      } else if (rad > angles[1] && rad <= angles[2]) {
        rotation = Rotations.RIGHT
      } else if (rad > angles[2] && rad <= angles[3]) {
        rotation = Rotations.BACK
      } else {
        rotation = Rotations.LEFT
      }
    }

    return rotation
  }
}

export default Blocks

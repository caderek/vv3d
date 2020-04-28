import createMaterials from "./materials"
import createShapes from "./shapes"

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

    console.log({ materials: this.materials, shapes: this.shapes })
  }

  create(y, z, x, shapeId, materialId) {
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

    if (this.materials[materialId].emission === 0) {
      this.shadows.addCaster(item)
    }

    if (this.materials[materialId].light) {
      this.addLight
    }

    return item
  }

  private createBaseBlock(shapeId, materialId) {
    const baseBlock = this.shapes[shapeId].mesh.clone(
      `${shapeId}_${materialId}`,
    )
    baseBlock.material = this.materials[materialId].material
    baseBlock.receiveShadows = true

    this.baseBlocks[`${shapeId}_${materialId}`] = baseBlock
  }

  private addLight(y, z, x, light) {
    if (light) {
      const l = new BABYLON.PointLight(
        `light_${y}_${z}_${x}`,
        new BABYLON.Vector3(x, y, z),
        this.scene,
      )
      l.intensity = light.intensity
    }
  }
}

export default Blocks

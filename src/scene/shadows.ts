import * as BABYLON from "babylonjs"
import { blocksValues } from "../blocks"

const names = blocksValues.map((block) => block.name)

class Shadows {
  shadowGenerator: any
  private scene: any
  private light: any

  constructor(scene, light) {
    this.scene = scene
    this.light = light

    this.create()
  }

  private create() {
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, this.light)

    shadowGenerator.bias = 0.01
    shadowGenerator.usePercentageCloserFiltering = true
    shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM

    // !Exclude invisible meshes and sky box
    // this.scene.meshes
    //   .filter((mesh) => names.includes(mesh.name))
    //   .forEach((mesh) => {
    //     mesh.receiveShadows = true
    //   })

    this.shadowGenerator = shadowGenerator
  }

  addCaster(mesh) {
    this.shadowGenerator.addShadowCaster(mesh)
  }

  refresh() {
    this.shadowGenerator.dispose()
    this.create()
  }
}

export default Shadows

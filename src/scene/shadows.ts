import * as BABYLON from "babylonjs"

class Shadows {
  shadowGenerator: any
  private scene: any

  constructor(scene, light) {
    this.scene = scene

    const shadowGenerator = new BABYLON.ShadowGenerator(4096, light)

    shadowGenerator.bias = 0.01
    shadowGenerator.usePercentageCloserFiltering = true
    shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM

    // !Exclude invisible meshes and sky box
    this.scene.meshes.forEach((mesh) => {
      mesh.receiveShadows = true
    })

    this.shadowGenerator = shadowGenerator
  }
}

export default Shadows

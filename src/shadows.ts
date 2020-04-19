import * as BABYLON from "babylonjs"

class Shadows {
  shadowGenerator: any
  private scene: any
  private visible: boolean

  constructor(scene, light) {
    this.scene = scene
    this.visible = true

    const shadowGenerator = new BABYLON.ShadowGenerator(1024, light)

    shadowGenerator.bias = 0.01
    shadowGenerator.usePercentageCloserFiltering = true
    shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM

    // !Exclude invisible meshes and sky box
    this.scene.meshes.forEach((mesh) => {
      mesh.receiveShadows = true
    })

    this.shadowGenerator = shadowGenerator
  }

  toggle() {
    this.visible = !this.visible
    this.scene.meshes.forEach((mesh) => {
      mesh.receiveShadows = this.visible
    })
  }
}

export default Shadows

import * as BABYLON from "babylonjs"

const addShadows = (scene, light) => {
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light)

  shadowGenerator.bias = 0.01
  shadowGenerator.usePercentageCloserFiltering = true
  shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM

  // !Exclude invisible meshes and sky box
  scene.meshes.forEach((mesh) => {
    console.log("ok")
    mesh.receiveShadows = true
  })

  return shadowGenerator
}

export { addShadows }

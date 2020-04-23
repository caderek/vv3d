import * as BABYLON from "babylonjs"

const addBackground = (scene: BABYLON.Scene) => {}

const addLights = (scene) => {}

const addLightsAndShadows = (scene) => {
  scene.clearColor = new BABYLON.Color3(0, 0, 0)

  const topLight = new BABYLON.DirectionalLight(
    "topLight",
    new BABYLON.Vector3(50, -50, 50),
    scene,
  )
  topLight.diffuse = new BABYLON.Color3(1, 1, 0.8)
  topLight.intensity = 4
  topLight.autoUpdateExtends = false
  topLight.autoCalcShadowZBounds = true

  const bottomLight = new BABYLON.DirectionalLight(
    "bottomLight",
    new BABYLON.Vector3(-50, 50, -50),
    scene,
  )
  bottomLight.intensity = 0.5

  const ambientLight = new BABYLON.HemisphericLight(
    "ambientLight",
    new BABYLON.Vector3(0, 50, 0),
    scene,
  )
  ambientLight.intensity = 0.2

  const shadowGenerator = new BABYLON.ShadowGenerator(4096, topLight)
  shadowGenerator.bias = 0.01

  shadowGenerator.usePercentageCloserFiltering = true
  shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH
  scene.meshes
    .filter((mesh) => mesh.name.includes("stone-"))
    .forEach((mesh) => {
      mesh.receiveShadows = true
    })

  scene.meshes.forEach((mesh) => {
    if (mesh.id.includes("stone_")) {
      shadowGenerator.addShadowCaster(mesh)
    }
  })

  return { shadowGenerator, topLight, bottomLight, ambientLight }
}

export default addLightsAndShadows

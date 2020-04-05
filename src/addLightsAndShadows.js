import { Mesh } from "three"

const addLightsAndShadows = (scene) => {
  scene.clearColor = new BABYLON.Color3(0, 0, 0)

  const topLight = new BABYLON.DirectionalLight(
    "topLight",
    new BABYLON.Vector3(50, -50, 50),
    scene,
  )
  topLight.diffuse = new BABYLON.Color3(1, 1, 0.8)
  topLight.intensity = 3
  topLight.autoUpdateExtends = false

  const bottomLight = new BABYLON.DirectionalLight(
    "bottomLight",
    new BABYLON.Vector3(-50, 50, -50),
    scene,
  )

  const ambientLight = new BABYLON.HemisphericLight(
    "ambientLight",
    new BABYLON.Vector3(0, 50, 0),
    scene,
  )
  ambientLight.intensity = 0.3

  const shadowGenerator = new BABYLON.ShadowGenerator(2048, topLight)

  shadowGenerator.usePercentageCloserFiltering = true
  shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH
  scene.meshes.find((mesh) => mesh.id === "ground").receiveShadows = true

  scene.meshes.forEach((mesh) => {
    if (mesh.id.includes("ground_")) {
      shadowGenerator.addShadowCaster(mesh)
    }
  })

  return { shadowGenerator, topLight, bottomLight, ambientLight }
}

export default addLightsAndShadows
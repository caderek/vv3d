const addLightsAndShadows = (scene) => {
  scene.clearColor = new BABYLON.Color3(0, 0, 0)

  const topLight = new BABYLON.DirectionalLight(
    "topLight",
    new BABYLON.Vector3(30, -50, 30),
    scene,
  )
  topLight.diffuse = new BABYLON.Color3(1, 1, 0.8)
  topLight.intensity = 5
  topLight.autoUpdateExtends = false

  const bottomLight = new BABYLON.DirectionalLight(
    "bottomLight",
    new BABYLON.Vector3(-50, 50, -50),
    scene,
  )

  const ambient = new BABYLON.HemisphericLight(
    "ambientLight",
    new BABYLON.Vector3(0, 1, 0),
    scene,
  )
  ambient.intensity = 0.5

  const shadowGenerator = new BABYLON.ShadowGenerator(1024, topLight)

  shadowGenerator.usePercentageCloserFiltering = true
  shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM
  // shadowGenerator.bias = 0.0001

  scene.meshes.forEach((mesh) => {
    if (mesh.id.includes("ground")) {
      shadowGenerator.addShadowCaster(mesh)
      mesh.receiveShadows = true
    }
  })

  return scene
}

export default addLightsAndShadows

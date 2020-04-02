const addLightsAndShadows = (scene) => {
  scene.clearColor = new BABYLON.Color3(0, 0, 0)

  const topLight = new BABYLON.DirectionalLight(
    "topLight",
    new BABYLON.Vector3(2, -5, 2),
    scene,
  )
  topLight.diffuse = new BABYLON.Color3(1, 1, 1)
  topLight.intensity = 5
  topLight.autoUpdateExtends = false

  const bottomLight = new BABYLON.DirectionalLight(
    "bottomLight",
    new BABYLON.Vector3(2, 10, 2),
    scene,
  )

  const ambient = new BABYLON.HemisphericLight(
    "ambientLight",
    new BABYLON.Vector3(0, 1, 0),
    scene,
  )
  ambient.intensity = 0.5

  const shadowGenerator = new BABYLON.ShadowGenerator(1024, topLight)

  return scene
}

export default addLightsAndShadows

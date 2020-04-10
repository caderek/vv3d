import * as BABYLON from "babylonjs"

const addLights = (scene) => {
  const top = new BABYLON.DirectionalLight(
    "topLight",
    new BABYLON.Vector3(50, -50, 50),
    scene,
  )
  top.diffuse = new BABYLON.Color3(1, 1, 0.8)
  top.intensity = 4
  top.autoUpdateExtends = false
  top.autoCalcShadowZBounds = true

  const bottom = new BABYLON.DirectionalLight(
    "bottomLight",
    new BABYLON.Vector3(-50, 50, -50),
    scene,
  )
  bottom.intensity = 0.5

  const ambient = new BABYLON.HemisphericLight(
    "ambientLight",
    new BABYLON.Vector3(0, 50, 0),
    scene,
  )
  ambient.intensity = 0.2

  return { top, bottom, ambient }
}

export { addLights }

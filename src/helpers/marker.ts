import * as BABYLON from "babylonjs"

const createMarker = (scene) => {
  const marker = BABYLON.MeshBuilder.CreateBox(
    `marker`,
    {
      width: 1,
      height: 1,
      depth: 1,
    },
    scene,
  )

  marker.position.y = 2
  marker.position.z = 0
  marker.position.x = 0
  marker.isVisible = true
  marker.material = new BABYLON.StandardMaterial("marker", scene)
  marker.material.alpha = 0
  marker.enableEdgesRendering()
  marker.edgesWidth = 1
  marker.edgesColor = new BABYLON.Color4(1, 1, 1, 0.2)

  return marker
}

export { createMarker }

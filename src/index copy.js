import * as BABYLON from "babylonjs"
import "babylonjs-loaders"

var canvas = document.getElementById("viewport")
// Load the 3D engine
var engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
})

var createScene = function() {
  // Create a scene.
  var scene = new BABYLON.Scene(engine)

  scene.clearColor = new BABYLON.Color3(0, 0, 0, 1)
  var light = new BABYLON.PointLight(
    "pointLight",
    new BABYLON.Vector3(1, 10, 1),
    scene,
  )
  var shadowGenerator = new BABYLON.ShadowGenerator(1024, light)

  // Append glTF model to scene.
  BABYLON.SceneLoader.Append("models/", "tank.gltf", scene, function(scene) {
    // Create a default arc rotate camera and light.
    scene.createDefaultCameraOrLight(true, true, true)
    console.log({ scene })
    scene.animationGroups.forEach((animation) => {
      animation.play(true)
    })

    // The default camera looks at the back of the asset.
    // Rotate the camera by 180 degrees to the front of the asset.
    scene.activeCamera.alpha += 1.25 * Math.PI
    engine.runRenderLoop(function() {
      scene.render()
    })
    window.addEventListener("click", function() {
      // We try to pick an object
      var pickResult = scene.pick(scene.pointerX, scene.pointerY)
      console.log(pickResult)
    })
  })

  return scene
}

const main = async () => {}

main()

createScene()
// run the render loop
// the canvas/window resize event handler
window.addEventListener("resize", function() {
  engine.resize()
})

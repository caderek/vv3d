import * as BABYLON from "babylonjs"
import "babylonjs-loaders"
import addLightsAndShadows from "./addLightsAndShadows"
import { MeshAssetTask } from "babylonjs"

const config = {
  mapSize: 12,
  blockSize: 1,
}

const createScene = async (engine) => {
  const scene = new BABYLON.Scene(engine)

  await new Promise((resolve, reject) => {
    BABYLON.SceneLoader.Append(
      "models/",
      "ground.glb",
      scene,
      resolve,
      null,
      reject,
    )
  })

  const ground = scene.meshes.find((mesh) => mesh.name === "ground")

  const board = Array.from({ length: config.mapSize }, () =>
    Array.from({ length: config.mapSize }, () =>
      Array.from({ length: config.mapSize }, () => null),
    ),
  )

  const groundSize = ground.getBoundingInfo().boundingBox.extendSize.x

  ground.setParent(null)

  for (let z = 0; z < config.mapSize; z++) {
    for (let y = 0; y < config.mapSize; y++) {
      for (let x = 0; x < config.mapSize; x++) {
        board[z][y][x] = ground.createInstance(`ground_${z}_${y}_${x}`)
        // board[z][y][x].setParent(ground)
        board[z][y][x].position.x = config.blockSize * x
        board[z][y][x].position.z = config.blockSize * y
        board[z][y][x].position.y = config.blockSize * z
        board[z][y][x].isPickable = false

        var box = BABYLON.MeshBuilder.CreateBox(
          `${z}_${y}_${x}`,
          {
            width: config.blockSize,
            height: config.blockSize,
            depth: config.blockSize,
          },
          scene,
        )
        // box.material = new BABYLON.StandardMaterial("sm", scene)
        // box.material.alpha = 0.0
        box.position.x = config.blockSize * x
        box.position.z = config.blockSize * y
        box.position.y = config.blockSize * z
        box.isVisible = false
      }
    }
  }

  ground.isVisible = false

  const indexes = Object.fromEntries(
    scene.meshes.map(({ id }, index) => [id, index]),
  )

  addLightsAndShadows(scene)

  // scene.animationGroups.forEach((animation) => {
  //   animation.play(true)
  // })

  // BABYLON.SceneOptimizer.OptimizeAsync(
  //   scene,
  //   BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed(),
  //   function () {
  //     // On success
  //     console.log("Optimized!")
  //   },
  //   function () {
  //     // FPS target not reached
  //     console.log("Not optimized!")
  //   },
  // )

  engine.runRenderLoop(function () {
    scene.render()
  })

  window.addEventListener("click", function () {
    const { hit, pickedMesh, faceId } = scene.pick(
      scene.pointerX,
      scene.pointerY,
      (mesh) => mesh.isPickable && mesh.isEnabled,
    )

    if (hit === true) {
      pickedMesh.dispose()
      scene.meshes
        .find((mesh) => mesh.id === `ground_${pickedMesh.id}`)
        .dispose()
    }
  })

  window.addEventListener("contextmenu", function () {
    const { hit, pickedMesh, pickedPoint, faceId } = scene.pick(
      scene.pointerX,
      scene.pointerY,
      (mesh) => mesh.isPickable && mesh.isEnabled,
    )

    if (hit === true) {
      console.log({ id: pickedMesh.id, faceId })
    }
  })

  return scene
}

const main = async () => {
  const canvas = document.getElementById("viewport")

  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  })

  const scene = await createScene(engine)
  // Parameters: alpha, beta, radius, target position, scene
  // var camera = new BABYLON.ArcRotateCamera(
  //   "Camera",
  //   0,
  //   0,
  //   10,
  //   new BABYLON.Vector3(6, 0, 6),
  //   scene,
  // )

  // // This attaches the camera to the canvas
  // camera.attachControl(canvas, true)
  scene.createDefaultCamera(true, true, true)
  scene.activeCamera.alpha += 1.25 * Math.PI
  scene.activeCamera.inertia = 0
}

main()

window.addEventListener("resize", function () {
  engine.resize()
})

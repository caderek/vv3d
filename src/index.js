import * as BABYLON from "babylonjs"
import "babylonjs-loaders"
import addLightsAndShadows from "./addLightsAndShadows"
import { MeshAssetTask } from "babylonjs"

const config = {
  worldSize: 20,
  mapSize: {
    x: 20,
    y: 3,
    z: 20,
  },
  blockSize: 1,
}

const createBox = (scene, board, parentMesh, shadowGenerator, y, z, x) => {
  board[y][z][x] = parentMesh.createInstance(
    `${parentMesh.name}_${y}_${z}_${x}`,
  )
  board[y][z][x].position.y = config.blockSize * y
  board[y][z][x].position.z = config.blockSize * z
  board[y][z][x].position.x = config.blockSize * x
  board[y][z][x].isPickable = false

  shadowGenerator.addShadowCaster(board[y][z][x])

  const box = BABYLON.MeshBuilder.CreateBox(
    `${y}_${z}_${x}`,
    {
      width: config.blockSize,
      height: config.blockSize,
      depth: config.blockSize,
    },
    scene,
  )

  box.position.y = config.blockSize * y
  box.position.z = config.blockSize * z
  box.position.x = config.blockSize * x
  box.isVisible = false
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
  const { shadowGenerator } = addLightsAndShadows(scene)

  const ground = scene.meshes.find((mesh) => mesh.name === "ground")

  const board = Array.from({ length: config.worldSize }, () =>
    Array.from({ length: config.worldSize }, () =>
      Array.from({ length: config.worldSize }, () => null),
    ),
  )

  ground.setParent(null)

  for (let y = 0; y < config.mapSize.y; y++) {
    for (let z = 0; z < config.mapSize.z; z++) {
      for (let x = 0; x < config.mapSize.x; x++) {
        createBox(scene, board, ground, shadowGenerator, y, z, x)
      }
    }
  }

  ground.isVisible = false

  engine.runRenderLoop(function () {
    scene.render()
  })

  window.addEventListener("click", function () {
    const { hit, pickedMesh, faceId } = scene.pick(
      scene.pointerX,
      scene.pointerY,
      (mesh) => mesh.isPickable && mesh.isEnabled && mesh.id !== "ground",
    )

    if (hit === true) {
      pickedMesh.dispose()
      scene.meshes
        .find((mesh) => mesh.id === `ground_${pickedMesh.id}`)
        .dispose()
    }
  })

  const incrementByFace = {
    0: { z: 1, y: 0, x: 0 },
    1: { z: 1, y: 0, x: 0 },
    2: { z: -1, y: 0, x: 0 },
    3: { z: -1, y: 0, x: 0 },
    4: { z: 0, y: 0, x: 1 },
    5: { z: 0, y: 0, x: 1 },
    6: { z: 0, y: 0, x: -1 },
    7: { z: 0, y: 0, x: -1 },
    8: { z: 0, y: 1, x: 0 },
    9: { z: 0, y: 1, x: 0 },
    10: { z: 0, y: 1, x: 0 },
    11: { z: 0, y: 1, x: 0 },
  }

  window.addEventListener("contextmenu", function () {
    const { hit, pickedMesh, pickedPoint, faceId } = scene.pick(
      scene.pointerX,
      scene.pointerY,
      (mesh) => mesh.isPickable && mesh.isEnabled && mesh.id !== "ground",
    )

    if (hit === true) {
      const inc = incrementByFace[faceId]
      const y = pickedMesh.position.y + inc.y
      const z = pickedMesh.position.z + inc.z
      const x = pickedMesh.position.x + inc.x

      if (
        y >= 0 &&
        y < config.worldSize &&
        z >= 0 &&
        z < config.worldSize &&
        x >= 0 &&
        x < config.worldSize
      ) {
        createBox(scene, board, ground, shadowGenerator, y, z, x)
      } else {
        // console.log("Outside!")
      }
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

  scene.createDefaultCamera(true, true, true)
  scene.activeCamera.alpha += 0.25 * Math.PI
  scene.activeCamera.beta -= 0.15 * Math.PI
  scene.activeCamera.inertia = 0
}

main()

window.addEventListener("resize", function () {
  engine.resize()
})

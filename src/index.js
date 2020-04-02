import * as BABYLON from "babylonjs"
import "babylonjs-loaders"
import addLightsAndShadows from "./addLightsAndShadows"

const state = {
  active: null,
  mapSize: 11,
}

const getObject = (mesh) => {
  if (mesh.id === "__root__" || mesh.parent.id === "__root__") {
    return mesh
  }

  return getObject(mesh.parent)
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

  const board = Array.from({ length: state.mapSize }, () =>
    Array.from({ length: state.mapSize }, () =>
      Array.from({ length: state.mapSize }, () => null),
    ),
  )

  const groundSize = ground.getBoundingInfo().boundingBox.extendSize.x

  console.log({ groundSize })

  for (let z = 0; z < state.mapSize; z++) {
    for (let y = 0; y < state.mapSize; y++) {
      for (let x = 0; x < state.mapSize; x++) {
        board[z][y][x] = ground.clone(`ground_${y}_${x}`)
        board[z][y][x].position.x = groundSize * x
        board[z][y][x].position.z = groundSize * y
        board[z][y][x].position.y = groundSize * z
      }
    }
  }

  ground.isVisible = false

  scene.createDefaultCamera(true, true, true)
  scene.activeCamera.alpha += 1.25 * Math.PI

  const indexes = Object.fromEntries(
    scene.meshes.map(({ id }, index) => [id, index]),
  )

  addLightsAndShadows(scene)

  scene.animationGroups.forEach((animation) => {
    animation.play(true)
  })

  engine.runRenderLoop(function() {
    scene.render()
  })

  window.addEventListener("click", function() {
    const { hit, pickedMesh } = scene.pick(scene.pointerX, scene.pointerY)

    if (hit === true) {
      const mesh = getObject(pickedMesh)
      mesh.isVisible = false
    } else {
      state.active = null
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
}

main()

window.addEventListener("resize", function() {
  engine.resize()
})

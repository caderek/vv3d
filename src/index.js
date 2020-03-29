import * as BABYLON from "babylonjs"
import "babylonjs-loaders"

const state = {
  active: null,
  mapSize: 11,
}

const getObject = (mesh) => {
  if (mesh.parent.id === "__root__") {
    return mesh
  }

  return getObject(mesh.parent)
}

var canvas = document.getElementById("viewport")
// Load the 3D engine
var engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
})

var createScene = async function() {
  // Create a scene.
  var scene = new BABYLON.Scene(engine)

  scene.clearColor = new BABYLON.Color3(0, 0, 0, 1)

  var light = new BABYLON.PointLight(
    "pointLight",
    new BABYLON.Vector3(1, 10, 1),
    scene,
  )

  // var shadowGenerator = new BABYLON.ShadowGenerator(1024, light)

  // Append glTF model to scene.
  await new Promise((resolve, reject) => {
    BABYLON.SceneLoader.Append(
      "models/",
      "tank.glb",
      scene,
      resolve,
      null,
      reject,
    )
  })
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

  // Create a default arc rotate camera and light.
  scene.createDefaultCameraOrLight(true, true, true)

  const ground = scene.meshes.find((mesh) => mesh.name === "ground")

  const board = Array.from({ length: state.mapSize }, () =>
    Array.from({ length: 8 }, () => null),
  )

  const groundSize = ground.getBoundingInfo().boundingBox.extendSize.x

  console.log({ groundSize })

  for (let y = 0; y < state.mapSize; y++) {
    for (let x = 0; x < state.mapSize; x++) {
      board[y][x] = ground.clone(`ground_${y}_${x}`)
      board[y][x].position.x = groundSize * x * 2
      board[y][x].position.z = groundSize * y * 2
    }
  }

  ground.isVisible = false

  const indexes = Object.fromEntries(
    scene.meshes.map(({ id }, index) => [id, index]),
  )

  scene.animationGroups.forEach((animation) => {
    animation.play(true)
  })

  // The default camera looks at the back of the asset.
  // Rotate the camera by 180 degrees to the front of the asset.
  scene.activeCamera.alpha += 1.25 * Math.PI
  engine.runRenderLoop(function() {
    // scene.meshes[ids.tank].position.x += 0.005
    scene.render()
  })
  window.addEventListener("click", function() {
    // We try to pick an object
    const { hit, pickedMesh } = scene.pick(scene.pointerX, scene.pointerY)
    if (hit === true) {
      const mesh = getObject(pickedMesh)
      console.log({ picked: mesh.name })
      mesh.position.y += 0.1
    } else {
      state.active = null
    }

    console.log({ state })
  })

  return scene
}

const main = async () => {
  const scene = await createScene()
}

main()

// run the render loop
// the canvas/window resize event handler
window.addEventListener("resize", function() {
  engine.resize()
})

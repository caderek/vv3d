import "pepjs"
import * as BABYLON from "babylonjs"
import "babylonjs-loaders"
import addLightsAndShadows from "./addLightsAndShadows"
import Stats from "stats.js"

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

const config = {
  worldSize: 30,
  mapSize: {
    x: 30,
    y: 2,
    z: 30,
  },
  blockSize: 1,
}

const state = {
  activeBlock: "stone-green",
}

const blockTypes = [
  { name: "stone-white", iconColor: "#fff" },
  { name: "stone-lightgray", iconColor: "#aaaaaa" },
  { name: "stone-darkgray", iconColor: "#555555" },
  { name: "stone-black", iconColor: "#000" },
  { name: "stone-red", iconColor: "#FF2225" },
  { name: "stone-lightred", iconColor: "#FF6969" },
  { name: "stone-darkred", iconColor: "#700F10" },
  { name: "stone-green", iconColor: "#2A942C" },
  { name: "stone-lightgreen", iconColor: "#7FC524" },
  { name: "stone-darkgreen", iconColor: "#195A1B" },
  { name: "stone-blue", iconColor: "#2462FF" },
  { name: "stone-lightblue", iconColor: "#4BBCFF" },
  { name: "stone-darkblue", iconColor: "#1226FF" },
  { name: "stone-pink", iconColor: "#FF1FB7" },
  { name: "stone-purple", iconColor: "#810AFF" },
  { name: "stone-yellow", iconColor: "#FFBD1D" },
  { name: "stone-orange", iconColor: "#FF6A28" },
  { name: "stone-brown", iconColor: "#922B00" },
  { name: "stone-lightbrown", iconColor: "#BB7744" },
  { name: "stone-darkbrown", iconColor: "#754100" },
]

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

const createBox = (scene, board, parentMesh, shadowGenerator, y, z, x) => {
  board[y][z][x] = parentMesh.createInstance(`item_${y}_${z}_${x}`)
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

  for (const blockType of blockTypes) {
    await new Promise((resolve, reject) => {
      BABYLON.SceneLoader.Append(
        "models/",
        `${blockType.name}.glb`,
        scene,
        resolve,
        null,
        reject,
      )
    })
  }

  const { shadowGenerator } = addLightsAndShadows(scene)

  const baseBlocks = Object.fromEntries(
    blockTypes.map(({ name }) => {
      return [name, scene.meshes.find((mesh) => mesh.name === name)]
    }),
  )

  console.log({ baseBlocks })

  const board = Array.from({ length: config.worldSize }, () =>
    Array.from({ length: config.worldSize }, () =>
      Array.from({ length: config.worldSize }, () => null),
    ),
  )

  for (const key in baseBlocks) {
    baseBlocks[key].setParent(null)
  }

  for (let y = 0; y < config.mapSize.y; y++) {
    for (let z = 0; z < config.mapSize.z; z++) {
      for (let x = 0; x < config.mapSize.x; x++) {
        createBox(
          scene,
          board,
          baseBlocks["stone-green"],
          shadowGenerator,
          y,
          z,
          x,
        )
      }
    }
  }

  for (const key in baseBlocks) {
    baseBlocks[key].isVisible = false
  }

  const input = {
    pointer: {
      down: false,
      up: false,
      moved: 0,
    },
  }

  const action1 = () => {
    const { hit, pickedMesh, faceId } = scene.pick(
      scene.pointerX,
      scene.pointerY,
      (mesh) =>
        mesh.isPickable &&
        mesh.isEnabled &&
        !["white", "black", "red", "green", "blue"].includes(mesh.id),
    )

    if (hit === true) {
      pickedMesh.dispose()
      scene.meshes.find((mesh) => mesh.id === `item_${pickedMesh.id}`).dispose()
    }
  }

  const action2 = () => {
    const { hit, pickedMesh, faceId } = scene.pick(
      scene.pointerX,
      scene.pointerY,
      (mesh) => mesh.isPickable && mesh.isEnabled && !mesh.id.includes("stone"),
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
        createBox(
          scene,
          board,
          baseBlocks[state.activeBlock],
          shadowGenerator,
          y,
          z,
          x,
        )
      }
    }
  }

  let start = 0
  let stop = 0
  let right = false
  let moved = 0

  engine.runRenderLoop(function () {
    stats.begin()

    if (input.down) {
      start = Date.now()
      moved = 0
      input.down = false
    } else if (input.up) {
      if (moved > 10) {
        return
      }

      stop = Date.now()
      const duration = stop - start
      if (duration >= 400 || right) {
        action2()
        right = false
      } else {
        action1()
      }
      start = 0
      stop = 0
      input.up = false
    }

    scene.render()
    stats.end()
  })

  window.addEventListener("contextmenu", () => {
    right = true
  })

  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
        input.down = true
        break
      case BABYLON.PointerEventTypes.POINTERUP:
        input.up = true
        break
      case BABYLON.PointerEventTypes.POINTERMOVE:
        input.moved++
        break
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
  scene.activeCamera.inertia = 0.1
}

main()

window.addEventListener("resize", function () {
  engine.resize()
})

const toolbox = document.getElementById("toolbox")

document.getElementById("toolbox-switch").addEventListener("click", () => {
  toolbox.classList.toggle("hidden")
})

toolbox.addEventListener("click", ({ target }) => {
  if (target.dataset.type === "item") {
    state.activeBlock = target.dataset.id
    toolbox.classList.toggle("hidden")
  }
})

const renderToolboxItem = (name, iconColor) => `
  <div
    class="item"
    data-type="item"
    data-id="${name}"
    style="background-color: ${iconColor};"
  ></div>
`

const toolboxItems = blockTypes
  .map(({ name, iconColor }) => renderToolboxItem(name, iconColor))
  .join("\n")

toolbox.innerHTML = toolboxItems

import "pepjs"
import * as BABYLON from "babylonjs"
import "babylonjs-loaders"
import addLightsAndShadows from "./addLightsAndShadows"
import Stats from "stats.js"
import isMobile from "is-mobile"

const mobile = isMobile()

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

const configs = {
  s: {
    worldSize: 12,
    mapSize: {
      x: 12,
      y: 2,
      z: 12,
    },
    blockSize: 1,
  },

  m: {
    worldSize: 20,
    mapSize: {
      x: 20,
      y: 2,
      z: 20,
    },
    blockSize: 1,
  },

  l: {
    worldSize: 30,
    mapSize: {
      x: 30,
      y: 2,
      z: 30,
    },
    blockSize: 1,
  },
}

let config = {
  worldSize: 20,
  mapSize: {
    x: 20,
    y: 2,
    z: 20,
  },
  blockSize: 1,
}

const state = {
  activeBlock: "stone-green",
}

const blockTypes = [
  { name: "stone-white" },
  { name: "stone-lightgray" },
  { name: "stone-darkgray" },
  { name: "stone-black" },
  { name: "stone-red" },
  { name: "stone-lightred" },
  { name: "stone-darkred" },
  { name: "stone-green" },
  { name: "stone-lightgreen" },
  { name: "stone-darkgreen" },
  { name: "stone-blue" },
  { name: "stone-lightblue" },
  { name: "stone-darkblue" },
  { name: "stone-pink" },
  { name: "stone-purple" },
  { name: "stone-yellow" },
  { name: "stone-orange" },
  { name: "stone-brown" },
  { name: "stone-lightbrown" },
  { name: "stone-darkbrown" },
  { name: "glow-white" },
  { name: "glow-yellow" },
  { name: "glow-red" },
  { name: "glow-magenta" },
  { name: "glow-cyan" },
  { name: "glow-green" },
]

var limitLoop = function (fn, fps) {
  var then = Date.now()

  fps = fps || 60
  var interval = 1000 / fps

  return (function loop(time) {
    requestAnimationFrame(loop)

    var now = Date.now()
    var delta = now - then

    if (delta > interval) {
      then = now - (delta % interval)
      fn()
    }
  })(0)
}

const changeLight = (scene, { top, bottom, ambient }) => {
  scene.getLightByID("topLight").intensity = top
  scene.getLightByID("bottomLight").intensity = bottom
  scene.getLightByID("ambientLight").intensity = ambient
}

const saveWorld = (world) => {
  window.localStorage.setItem("world", JSON.stringify(world))
}

function downloadImage(data, filename = "untitled.jpeg") {
  var a = document.createElement("a")
  a.href = data
  a.download = filename
  document.body.appendChild(a)
  a.click()
}

const blockNames = blockTypes.map(({ name }) => name)

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
  10: { z: 0, y: -1, x: 0 },
  11: { z: 0, y: -1, x: 0 },
}

const getItemsWithinRadius = (scene, radius, y, z, x) => {
  const meshes = []
  for (let i = -radius + y; i <= radius + y; i++) {
    for (let j = -radius + z; j <= radius + z; j++) {
      for (let k = -radius + x; k <= radius + x; k++) {
        const mesh = scene.getMeshByName(`item_${i}_${j}_${k}`)
        if (mesh) {
          meshes.push(mesh)
        }
      }
    }
  }
  return meshes
}

const createBox = (
  scene,
  world,
  parentMesh,
  shadowGenerator,
  y,
  z,
  x,
  save = true,
) => {
  world[y][z][x].type = parentMesh.name
  const item = parentMesh.createInstance(`item_${y}_${z}_${x}`)
  item.position.y = config.blockSize * y
  item.position.z = config.blockSize * z
  item.position.x = config.blockSize * x
  item.isPickable = false
  item.isVisible = true
  item.material.maxSimultaneousLights = 12

  if (!parentMesh.name.includes("glow")) {
    shadowGenerator.addShadowCaster(item)
  }

  if (parentMesh.name.includes("glow-white")) {
    const light = new BABYLON.PointLight(
      `light_${y}_${z}_${x}`,
      new BABYLON.Vector3(x, y, z),
      scene,
    )
    light.intensity = 10
    // light.includedOnlyMeshes = getItemsWithinRadius(scene, 4, y, z, x)
  }

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

  if (save) {
    saveWorld(world)
  }
}

const createScene = async (engine) => {
  const scene = new BABYLON.Scene(engine)
  scene.blockMaterialDirtyMechanism = true
  var gl = new BABYLON.GlowLayer("glow", scene)
  gl.intensity = 0.5

  var options = new BABYLON.SceneOptimizerOptions()
  options.addOptimization(new BABYLON.HardwareScalingOptimization(4, 4))

  // Optimizer
  var optimizer = new BABYLON.SceneOptimizer(scene, options)
  optimizer.targetFrameRate = 30

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

  let savedWorld = window.localStorage.getItem("world")

  if (savedWorld) {
    savedWorld = JSON.parse(savedWorld)
  }

  const worldSize = savedWorld ? savedWorld.length : config.worldSize

  const world = savedWorld
    ? savedWorld
    : Array.from({ length: config.worldSize }, (_, y) =>
        Array.from({ length: config.worldSize }, (_, z) =>
          Array.from({ length: config.worldSize }, (_, x) => ({
            type:
              y < config.mapSize.y &&
              z < config.mapSize.z &&
              x < config.mapSize.x
                ? "stone-green"
                : null,
          })),
        ),
      )

  for (const key in baseBlocks) {
    baseBlocks[key].setParent(null)
  }

  for (let y = 0; y < worldSize; y++) {
    for (let z = 0; z < worldSize; z++) {
      for (let x = 0; x < worldSize; x++) {
        if (world[y][z][x].type) {
          createBox(
            scene,
            world,
            baseBlocks[world[y][z][x].type],
            shadowGenerator,
            y,
            z,
            x,
            false,
          )
        }
      }
    }
  }

  for (const key in baseBlocks) {
    baseBlocks[key].isVisible = false
  }

  const action1 = () => {
    const { hit, pickedMesh } = scene.pick(
      scene.pointerX,
      scene.pointerY,
      (mesh) =>
        mesh.isPickable && mesh.isEnabled && !blockNames.includes(mesh.id),
    )

    if (hit === true) {
      pickedMesh.dispose()
      scene.getMeshByName(`item_${pickedMesh.id}`).dispose()
      const light = scene.getLightByID(`light_${pickedMesh.id}`)
      if (light) {
        light.dispose()
      }
      const [y, z, x] = pickedMesh.id.split("_")
      world[y][z][x].type = null
      saveWorld(world)
    }
  }

  const action2 = () => {
    const { hit, pickedMesh, faceId } = scene.pick(
      scene.pointerX,
      scene.pointerY,
      (mesh) =>
        mesh.isPickable && mesh.isEnabled && !blockNames.includes(mesh.id),
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
          world,
          baseBlocks[state.activeBlock],
          shadowGenerator,
          y,
          z,
          x,
        )
      }
    }
  }

  const input = {
    down: false,
    isDown: false,
  }

  let right = false
  let left = false
  let timer = 0
  let cycle = false
  let prevCameraPosition = { x: null, y: null, z: null }

  limitLoop(function () {
    stats.begin()

    const cameraNotMoved =
      scene.activeCamera.position.x === prevCameraPosition.x &&
      scene.activeCamera.position.y === prevCameraPosition.y &&
      scene.activeCamera.position.z === prevCameraPosition.z

    if (!mobile) {
      if (input.down) {
        prevCameraPosition = { ...scene.activeCamera.position }
        input.down = false
      } else if (input.up) {
        input.up = false

        if (!cameraNotMoved) {
          return
        }

        if (right) {
          action2()
          right = false
        } else if (left) {
          action1()
          left = false
        }
      }
    } else {
      if (timer !== 0) {
        timer++
      }

      if (timer > 7 && cameraNotMoved) {
        action1()
        cycle = true
        timer = 1
      }

      if (input.down) {
        timer = 1
        input.down = false
        prevCameraPosition = { ...scene.activeCamera.position }
      } else if (input.up) {
        if (timer <= 15 && !cycle && cameraNotMoved) {
          action2()
        }
        timer = 0
        input.up = false
        cycle = false
      }
    }

    scene.render()
    stats.end()
  }, 20)

  window.addEventListener("contextmenu", () => {
    right = true
  })

  window.addEventListener("click", (e) => {
    left = true
  })

  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
        input.down = true
        break
      case BABYLON.PointerEventTypes.POINTERUP:
        input.up = true
        break
    }
  })

  return { scene, world }
}

const main = async () => {
  const canvas = document.getElementById("viewport")

  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  })

  const { scene, world } = await createScene(engine)

  scene.createDefaultCamera(true, true, true)
  scene.activeCamera.alpha += 0.25 * Math.PI
  scene.activeCamera.beta -= 0.15 * Math.PI
  scene.activeCamera.inertia = 0.1

  window.addEventListener("resize", function () {
    engine.resize()
  })

  let day = true

  document.getElementById("light-switch").addEventListener("click", () => {
    day = !day
    changeLight(
      scene,
      day
        ? { top: 4, bottom: 0.5, ambient: 0.2 }
        : { top: 0.1, bottom: 0.01, ambient: 0.01 },
    )
  })

  document.getElementById("reset").addEventListener("click", () => {
    window.localStorage.removeItem("world")
    location.reload()
  })

  document.getElementById("screenshot").addEventListener("click", () => {
    const dataUrl = canvas.toDataURL("image/png")

    if (mobile) {
      const image = new Image()
      image.src = dataUrl

      const win = window.open("")
      win.document.write(image.outerHTML)
    } else {
      downloadImage(dataUrl, "my-world.png")
    }
  })
}

const toolbox = document.getElementById("toolbox")
const splash = document.getElementById("splash")
const toolboxSwitchImg = document.getElementById("active-item")

document.getElementById("toolbox-switch").addEventListener("click", () => {
  toolbox.classList.toggle("hidden")
})

if (!window.localStorage.getItem("world")) {
  splash.classList.remove("hidden")
  splash.addEventListener("click", ({ target }) => {
    if (target.dataset.type === "size") {
      config = configs[target.dataset.value]
    }

    main()
    splash.classList.toggle("hidden")
  })
} else {
  main()
}

toolbox.addEventListener("click", ({ target }) => {
  if (target.dataset.type === "item") {
    state.activeBlock = target.dataset.id
    toolbox.classList.toggle("hidden")
    toolboxSwitchImg.src = `/models/ico/${target.dataset.id}.png`
  }
})

const renderToolboxItem = (name) => `
  <div
    class="item"
    data-type="item"
    data-id="${name}"
    style="background-image: url(/models/ico/${name}.png);"
  ></div>
`

const toolboxItems = blockTypes
  .map(({ name }) => renderToolboxItem(name))
  .join("\n")

toolbox.innerHTML = toolboxItems

import "pepjs"
import * as BABYLON from "babylonjs"
import "babylonjs-loaders"
import { addBackground } from "./background"
import { addLights } from "./lights"
import { addShadows } from "./shadows"
import * as Stats from "stats.js"
import * as isMobile from "is-mobile"

const mobile = isMobile()
const targetFPS = 20

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

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
  { name: "column-white" },
  { name: "fence" },
  { name: "half-white" },
  { name: "shelf" },
  { name: "oven" },
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

const changeLight = (scene, { top, bottom, ambient, sky }) => {
  scene.clearColor = new BABYLON.Color3.FromHexString(sky)
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
  const gap = 0.0

  world[y][z][x].type = parentMesh.name

  const item = parentMesh.createInstance(`item_${y}_${z}_${x}`)

  item.position.y = config.blockSize * y + gap * y
  item.position.z = config.blockSize * z + gap * z
  item.position.x = config.blockSize * x + gap * x
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
  box.material = new BABYLON.StandardMaterial("none", scene)
  box.material.alpha = 0
  box.isVisible = false

  if (save) {
    saveWorld(world)
  }
}

const createScene = async (engine) => {
  const scene = new BABYLON.Scene(engine)
  scene.blockMaterialDirtyMechanism = true

  var skybox = BABYLON.Mesh.CreateBox(
    "skyBox",
    16,
    scene,
    false,
    BABYLON.Mesh.BACKSIDE,
  )
  var skyboxMaterial = new BABYLON.StandardMaterial("skybox", scene)
  skyboxMaterial.disableLighting = true
  skyboxMaterial.emissiveColor = new BABYLON.Color3(0.15, 0.35, 0.75)
  skyboxMaterial.alpha = 0.95
  skybox.material = skyboxMaterial
  skybox.backFaceCulling = true
  skybox.position.y = 5.5
  skybox.position.z = 5.5
  skybox.position.x = 5.5
  skybox.isPickable = false

  var gl = new BABYLON.GlowLayer("glow", scene)
  gl.intensity = 0.5
  gl.addExcludedMesh(skybox)

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

  // const marker = BABYLON.MeshBuilder.CreateBox(
  //   `marker`,
  //   {
  //     width: config.blockSize,
  //     height: config.blockSize,
  //     depth: config.blockSize,
  //   },
  //   scene,
  // )

  // marker.position.y = 2
  // marker.position.z = 0
  // marker.position.x = 0
  // marker.isVisible = true
  // marker.material = new BABYLON.StandardMaterial("marker", scene)
  // marker.material.alpha = 0
  // marker.enableEdgesRendering()
  // marker.edgesWidth = 1
  // marker.edgesColor = new BABYLON.Color4(1, 1, 1, 0.2)

  addBackground(scene)
  const lights = addLights(scene)
  const shadowGenerator = addShadows(scene, lights.top)

  const baseBlocks = Object.fromEntries(
    blockTypes.map(({ name }) => {
      return [name, scene.meshes.find((mesh) => mesh.name === name)]
    }),
  )

  type World = { type: string }[][][]
  let savedWorldEntry = window.localStorage.getItem("world")
  let savedWorld

  if (savedWorldEntry) {
    savedWorld = JSON.parse(savedWorldEntry)
  }

  const worldSize = savedWorld ? savedWorld.length : config.worldSize

  const world: World = savedWorld
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
    up: false,
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
  }, targetFPS)

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
        ? // ? { top: 4, bottom: 0.5, ambient: 0.2, sky: "#007bff" }
          { top: 4, bottom: 0.5, ambient: 0.2, sky: "#00000" }
        : { top: 0.1, bottom: 0.01, ambient: 0.01, sky: "#000000" },
    )
  })

  document.getElementById("reset").addEventListener("click", () => {
    window.localStorage.removeItem("world")
    location.reload()
  })

  document.getElementById("screenshot").addEventListener("click", () => {
    // @ts-ignore
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
    // @ts-ignore
    if (target.dataset.type === "size") {
      // @ts-ignore
      config = configs[target.dataset.value]
    }

    main()
    splash.classList.toggle("hidden")
  })
} else {
  main()
}

// @ts-ignore
toolbox.addEventListener("click", ({ target }) => {
  // @ts-ignore
  if (target.dataset.type === "item") {
    // @ts-ignore
    state.activeBlock = target.dataset.id
    // @ts-ignore
    toolbox.classList.toggle("hidden")
    // @ts-ignore
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

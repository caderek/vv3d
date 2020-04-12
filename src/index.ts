import "pepjs"
import * as BABYLON from "babylonjs"
import "babylonjs-loaders"
import { addBackground } from "./background"
// import { addLights, changeLights } from "./lights"
import Lights from "./lights"
import { addShadows } from "./shadows"
import * as isMobile from "is-mobile"
import blockTypes from "./blocks"
import configs from "./configs"
import stats from "./stats"
import gameLoop from "./game-loop"
import optimize from "./optimize"
import createVoxel from "./createVoxel"
import downloadImage from "./helpers/downloadImage"
import { saveWorld } from "./save"
import AmbientOcclusion from "./ambient-occlusion"
import createDefaultWorld from "./world/createDefaultWorld"
import createRandomWorld from "./world/createRandomWorld"

const mobile = isMobile()
const targetFPS = 20

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

const createScene = async (engine) => {
  const scene = new BABYLON.Scene(engine)
  scene.blockMaterialDirtyMechanism = true

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

  addBackground(scene)

  const lights = new Lights(scene)
  console.log({ lights })
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
    : // : createDefaultWorld(config.worldSize, 2)
      createRandomWorld()

  for (const key in baseBlocks) {
    baseBlocks[key].setParent(null)
  }

  for (let y = 0; y < worldSize; y++) {
    for (let z = 0; z < worldSize; z++) {
      for (let x = 0; x < worldSize; x++) {
        if (world[y][z][x].type) {
          createVoxel(
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

  optimize(scene)

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
        createVoxel(
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

  gameLoop(function () {
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

  return { scene, world, lights }
}

const main = async () => {
  const canvas = document.getElementById("viewport")

  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  })

  const { scene, world, lights } = await createScene(engine)

  scene.createDefaultCamera(true, true, true)
  scene.activeCamera.alpha += 0.25 * Math.PI
  scene.activeCamera.beta -= 0.15 * Math.PI
  scene.activeCamera.inertia = 0
  scene.activeCamera.checkCollisions = true

  const camera = scene.cameras[scene.cameras.length - 1]
  // const ambientOcclusion = new AmbientOcclusion(scene, camera)

  window.addEventListener("resize", function () {
    engine.resize()
  })

  let day = true

  document.getElementById("light-switch").addEventListener("click", () => {
    day = !day
    lights.change(
      day
        ? { top: 4, bottom: 0.5, ambient: 0.2, skyAlpha: 0.95 }
        : { top: 0.1, bottom: 0.1, ambient: 0.01, skyAlpha: 0.1 },
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

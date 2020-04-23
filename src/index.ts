import "pepjs"
import * as BABYLON from "babylonjs"
import "babylonjs-loaders"
import { addBackground } from "./scene/background"
import Lights from "./scene/lights"
import Shadows from "./scene/shadows"
import * as isMobile from "is-mobile"
import blocksInfo, { blocksValues } from "./blocks"
import stats from "./helpers/stats"
import gameLoop from "./game-loop"
import createVoxel from "./createVoxel"
import AmbientOcclusion from "./scene/ambient-occlusion"
import createDefaultWorld from "./world/createDefaultWorld"
import createRandomWorld from "./world/createRandomWorld"
import Hero from "./entities/hero"
import Ship from "./entities/ship"
import loadModels from "./loaders/load-models"
import WorldGraph from "./world/world-graph"
import Camera from "./scene/camera"
import createPrimaryAction from "./actions/action-primary"
import createSecondaryAction from "./actions/action-secondary"

const toolbox = document.getElementById("toolbox")
const toolboxSwitchImg = document.getElementById("active-item")

const mobile = isMobile()
const targetFPS = 20

enum Modes {
  build,
  hero,
  wires,
}

const state = {
  activeBlock: "stone-green",
  mode: Modes.build,
  day: true,
  music: false,
  track: 0,
}

const createScene = async (engine, canvas) => {
  const scene = new BABYLON.Scene(engine)
  scene.blockMaterialDirtyMechanism = true
  scene.useGeometryIdsMap = true
  scene.useClonedMeshMap = true

  const modelsMeta = await loadModels(scene)

  console.log(scene)

  addBackground(scene)
  const sounds = {
    go: new BABYLON.Sound("go", "sound/go.mp3", scene),
    denied: new BABYLON.Sound("denied", "sound/denied.mp3", scene),
    button: new BABYLON.Sound("button", "sound/button.mp3", scene),
    ship: new BABYLON.Sound("ship", "sound/ship.mp3", scene),
    gather: new BABYLON.Sound("gather", "sound/gather.mp3", scene),
    build: new BABYLON.Sound("build", "sound/build.mp3", scene),
  }

  const songs = [
    new BABYLON.Sound("nocturne", "music/nocturne.mp3", scene),
    new BABYLON.Sound("moonlight_sonata", "music/moonlight_sonata.mp3", scene),
    new BABYLON.Sound("chinese_dance", "music/chinese_dance.mp3", scene),
    new BABYLON.Sound(
      "piano_sonata_no_5_in_g_major",
      "music/piano_sonata_no_5_in_g_major.mp3",
      scene,
    ),
  ]

  const lights = new Lights(scene)
  const shadows = new Shadows(scene, lights.top)

  const baseBlocks = Object.fromEntries(
    blocksValues.map(({ name }) => {
      return [name, scene.meshes.find((mesh) => mesh.name === name)]
    }),
  )

  type World = string[][][]
  let savedWorldEntry = window.localStorage.getItem("world")
  let savedWorld

  if (savedWorldEntry) {
    savedWorld = JSON.parse(savedWorldEntry)
  }

  const world: World = savedWorld ? savedWorld : createRandomWorld()
  // const world: World = savedWorld ? savedWorld : createDefaultWorld(10, 2)

  const worldSize = world.length
  const worldGraph = new WorldGraph(world)

  console.log({ worldSize })

  const hero = new Hero(scene, world, worldGraph, sounds)
  const camera = new Camera(scene, canvas, world, hero)

  for (const key in baseBlocks) {
    baseBlocks[key].setParent(null)
  }

  for (let y = 0; y < worldSize; y++) {
    for (let z = 0; z < worldSize; z++) {
      for (let x = 0; x < worldSize; x++) {
        if (world[y][z][x] !== null) {
          createVoxel(
            scene,
            world,
            baseBlocks[blocksInfo[world[y][z][x]].name],
            shadows.shadowGenerator,
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

  const ship = new Ship(scene, world, worldGraph, camera)

  lights.createSkybox(worldSize)
  lights.createGlow([lights.skybox])

  const action1 = createPrimaryAction({
    scene,
    state,
    world,
    worldGraph,
    modelsMeta,
    sounds,
    ship,
  })

  const action2 = createSecondaryAction({
    scene,
    canvas,
    state,
    world,
    worldGraph,
    modelsMeta,
    sounds,
    songs,
    ship,
    hero,
    lights,
    mobile,
    baseBlocks,
    shadows,
  })

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

    hero.render()
    ship.render()

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
          left = false
          right = false
          return
        }

        if (left) {
          action2()
          left = false
        } else if (right) {
          action1()
          right = false
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

  canvas.addEventListener("contextmenu", () => {
    right = true
  })

  canvas.addEventListener("click", ({ target }) => {
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

  return { scene, world, lights, shadows }
}

const main = async () => {
  const canvas = document.getElementById("viewport")

  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  })

  BABYLON.Engine.audioEngine.useCustomUnlockedButton = true

  console.log({ engine })

  const { scene, world, lights, shadows } = await createScene(engine, canvas)

  window.addEventListener("resize", function () {
    engine.resize()
  })

  window.addEventListener(
    "click",
    () => {
      BABYLON.Engine.audioEngine.unlock()
    },
    { once: true },
  )
}

if (!window.localStorage.getItem("world")) {
  main()
  // splash.classList.remove("hidden")
  // splash.addEventListener("click", ({ target }) => {
  //   // @ts-ignore
  //   if (target.dataset.type === "size") {
  //     // @ts-ignore
  //     config = configs[target.dataset.value]
  //   }

  //   main()
  //   splash.classList.toggle("hidden")
  // })
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

const toolboxItems = blocksValues
  .map(({ name }) => renderToolboxItem(name))
  .join("\n")

toolbox.innerHTML = toolboxItems

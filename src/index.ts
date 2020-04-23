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
import handleControls from "./actions/handle-controls"

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
  const ship = new Ship(scene, world, worldGraph, camera)

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

  const controls = handleControls(scene, action1, action2, canvas, mobile)

  const renderFrame = () => {
    controls()

    hero.render()
    ship.render()

    scene.render()
  }

  return renderFrame
}

const main = async () => {
  const canvas = document.getElementById("viewport")

  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  })

  BABYLON.Engine.audioEngine.useCustomUnlockedButton = true

  const renderFrame = await createScene(engine, canvas)

  gameLoop(() => {
    stats.begin()
    renderFrame()
    stats.end()
  }, targetFPS)

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

main()

// !TODO TEMP TOOLBOX

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

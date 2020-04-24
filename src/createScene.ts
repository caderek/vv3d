import * as BABYLON from "babylonjs"
import { addBackground } from "./scene/background"
import Lights from "./scene/lights"
import Shadows from "./scene/shadows"
import blocksInfo, { blocksValues } from "./blocks"
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
import { Modes } from "./types/enums"
import { saveWorld } from "./save"
import * as GUI from "babylonjs-gui"

const createWorld = (savedWorld, baseBlocks, scene, shadows, lights) => {
  const worldMap = savedWorld ? savedWorld : createRandomWorld()
  const worldSize = worldMap.length
  const worldGraph = new WorldGraph(worldMap)

  for (const key in baseBlocks) {
    baseBlocks[key].setParent(null)
    baseBlocks[key].isVisible = false
  }

  const worldItems = []

  for (let y = 0; y < worldSize; y++) {
    for (let z = 0; z < worldSize; z++) {
      for (let x = 0; x < worldSize; x++) {
        if (worldMap[y][z][x] !== null) {
          createVoxel(
            scene,
            worldMap,
            worldItems,
            baseBlocks[blocksInfo[worldMap[y][z][x]].name],
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

  lights.createSkybox(worldSize)
  saveWorld(worldMap)

  return {
    map: worldMap,
    graph: worldGraph,
    size: worldSize,
    items: worldItems,
  }
}

const createScene = async (engine, canvas, mobile) => {
  const state = {
    activeBlock: "stone-green",
    mode: Modes.build,
    day: true,
    music: false,
    track: 0,
  }

  console.log(BABYLON)

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

  let savedWorldEntry = window.localStorage.getItem("world")
  let savedWorld

  if (savedWorldEntry) {
    savedWorld = JSON.parse(savedWorldEntry)
  }

  let world = createWorld(savedWorld, baseBlocks, scene, shadows, lights)

  const hero = new Hero(scene, world, sounds)
  const camera = new Camera(scene, canvas, world, hero)
  const ship = new Ship(scene, world, camera)

  const next = () => {
    world.items.forEach((item) => item.dispose())
    world = createWorld(null, baseBlocks, scene, shadows, lights)
  }

  const action1 = createPrimaryAction({
    scene,
    state,
    world: world.map,
    worldGraph: world.graph,
    modelsMeta,
    sounds,
    ship,
  })

  const action2 = createSecondaryAction({
    scene,
    canvas,
    state,
    world,
    modelsMeta,
    sounds,
    songs,
    ship,
    hero,
    lights,
    mobile,
    baseBlocks,
    shadows,
    next,
  })

  const controls = handleControls(scene, action1, action2, canvas, mobile)

  const renderFrame = () => {
    controls()

    hero.render()
    ship.render()

    scene.render()
  }

  return { renderFrame, scene }
}

export default createScene

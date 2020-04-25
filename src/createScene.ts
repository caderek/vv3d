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

const createWorld = (game, savedWorld, baseBlocks, scene, shadows, lights) => {
  game.world.map = savedWorld ? savedWorld : createRandomWorld()
  game.world.graph = new WorldGraph(game.world.map)

  game.world.size = game.world.map.length
  game.world.items = []

  for (const key in baseBlocks) {
    baseBlocks[key].setParent(null)
    baseBlocks[key].isVisible = false
  }

  for (let y = 0; y < game.world.size; y++) {
    for (let z = 0; z < game.world.size; z++) {
      for (let x = 0; x < game.world.size; x++) {
        if (game.world.map[y][z][x] !== null) {
          createVoxel(
            scene,
            game,
            baseBlocks[blocksInfo[game.world.map[y][z][x]].name],
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

  lights.createSkybox(game.world.size)
  saveWorld(game.world.map)

  console.log("Meshes count:", scene.meshes.length)
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
  // @ts-ignore
  scene.useGeometryIdsMap = true
  // @ts-ignore
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

  console.log("SHADOWS!")
  console.log({ shadows })

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

  const game = {
    world: {
      map: null,
      graph: null,
      size: null,
      items: null,
    },
  }

  createWorld(game, savedWorld, baseBlocks, scene, shadows, lights)

  const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")
  gui.idealHeight = 1080

  const hero = new Hero(scene, game.world, sounds)
  const camera = new Camera(scene, canvas, game.world, hero)
  const ship = new Ship(scene, game.world, camera, gui)

  const next = () => {
    game.world.items.forEach((item) => item.dispose())
    createWorld(game, null, baseBlocks, scene, shadows, lights)
  }

  const action1 = createPrimaryAction({
    scene,
    state,
    game,
    modelsMeta,
    sounds,
    ship,
  })

  const action2 = createSecondaryAction({
    scene,
    canvas,
    state,
    game,
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

  // @ts-ignore
  document.getElementById("toolbox").addEventListener("click", ({ target }) => {
    // @ts-ignore
    if (target.dataset.type === "item") {
      sounds.button.play()
      // @ts-ignore
      state.activeBlock = target.dataset.id
      // @ts-ignore
      toolbox.classList.toggle("hidden")
    }
  })

  return { renderFrame, scene }
}

export default createScene

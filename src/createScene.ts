import * as BABYLON from "babylonjs"
import { addBackground } from "./scene/background"
import Lights from "./scene/lights"
import Shadows from "./scene/shadows"
import { blocksValues } from "./blocks"
import Hero from "./entities/hero"
import Bot from "./entities/bot"
import Gun from "./entities/gun"
import Ship from "./entities/ship"
import Cyclops from "./entities/cyclops"
import loadModels from "./loaders/load-models"
import Camera from "./scene/camera"
import createPrimaryAction from "./actions/action-primary"
import createSecondaryAction from "./actions/action-secondary"
import handleControls from "./actions/handle-controls"
import { Modes } from "./types/enums"
import * as GUI from "babylonjs-gui"
import createWorld from "./createWorld"
import Blocks from "./blocks/blocks"

const createScene = async (engine, canvas, mobile) => {
  const state = {
    activeShape: 1,
    activeMaterial: 1,
    mode: Modes.build,
    day: true,
    music: false,
    track: 0,
  }

  const scene = new BABYLON.Scene(engine)
  scene.blockMaterialDirtyMechanism = true
  // @ts-ignore
  scene.useGeometryIdsMap = true
  // @ts-ignore
  scene.useClonedMeshMap = true

  const modelsMeta = await loadModels(scene)

  addBackground(scene)

  const sounds = {
    go: new BABYLON.Sound("go", "sound/go.mp3", scene),
    denied: new BABYLON.Sound("denied", "sound/denied.mp3", scene),
    button: new BABYLON.Sound("button", "sound/button.mp3", scene),
    ship: new BABYLON.Sound("ship", "sound/ship.mp3", scene),
    gather: new BABYLON.Sound("gather", "sound/gather.mp3", scene),
    build: new BABYLON.Sound("build", "sound/build.mp3", scene),
    gun: new BABYLON.Sound("gun", "sound/gun.mp3", scene),
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

  let savedWorldEntry = window.localStorage.getItem("world")
  let savedWorld

  if (savedWorldEntry) {
    savedWorld = JSON.parse(savedWorldEntry)

    if (savedWorld.version !== 1) {
      window.localStorage.removeItem("world")
      savedWorld = undefined
    }
  }

  const game = {
    world: {
      map: null,
      graph: null,
      size: null,
      items: [],
    },
    gun: null,
    pause: false,
  }

  const camera = new Camera(scene, canvas, game)
  const blocks = new Blocks(scene, game, shadows)

  createWorld(game, savedWorld, blocks, scene, shadows, lights)

  const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")
  gui.idealHeight = 1080

  const bot = new Bot(scene, game, sounds, shadows.shadowGenerator)
  const hero = new Hero(scene, game, sounds, bot)
  const gun = new Gun(scene, game, sounds)
  game.gun = gun
  hero.changeGun(gun)
  const ship = new Ship(scene, game, camera, gui, shadows.shadowGenerator)
  const enemies = [
    new Cyclops(scene, game, sounds, modelsMeta).place(10, 5, 5),
    new Cyclops(scene, game, sounds, modelsMeta).place(10, 7, 8),
  ]

  const next = () => {
    game.pause = true
    game.world.items.forEach((item) => item.dispose())
    createWorld(game, null, blocks, scene, shadows, lights)
    camera.goToOrbit()
    ship.refreshScreen()
    game.pause = false
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
    blocks,
    shadows,
    next,
  })

  const controls = handleControls(scene, action1, action2, canvas, mobile)

  const renderFrame = () => {
    controls()

    hero.render()
    bot.render()
    ship.render()
    gun.render()
    enemies.forEach((enemy) => enemy.render())

    scene.render()
  }

  const $toolbox = document.getElementById("toolbox")
  const $selectedShape = document.getElementById("selected-shape")
  const $selectedMaterial = document.getElementById("selected-material")

  // @ts-ignore
  document
    .getElementById("toolbox-shapes")
    .addEventListener("click", ({ target }) => {
      // @ts-ignore
      if (target.dataset.type === "shape") {
        sounds.button.play()
        // @ts-ignore
        state.activeShape = target.dataset.id
        // @ts-ignore
        $selectedShape.style.backgroundImage = `url(/models/ico/${target.dataset.name}.png)`
      }
    })

  document
    .getElementById("toolbox-materials")
    .addEventListener("click", ({ target }) => {
      // @ts-ignore
      if (target.dataset.type === "material") {
        sounds.button.play()
        // @ts-ignore
        state.activeMaterial = target.dataset.id
        // @ts-ignore
        $selectedMaterial.style.background = target.dataset.color
      }
    })

  document.getElementById("back").addEventListener("click", () => {
    sounds.button.play()
    $toolbox.classList.toggle("hidden")
  })

  return { renderFrame, scene, game }
}

export default createScene

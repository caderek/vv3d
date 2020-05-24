import * as BABYLON from "babylonjs"
import { addBackground } from "./scene/background"
import Lights from "./scene/lights"
import Shadows from "./scene/shadows"
import { blocksValues } from "./blocks"
import Hero from "./entities/hero"
import Bot from "./entities/bot"
import Gun from "./entities/gun"
import Ship from "./entities/ship"
import loadModels from "./loaders/load-models"
import Camera from "./scene/camera"
import createPrimaryAction from "./actions/action-primary"
import createSecondaryAction from "./actions/action-secondary"
import handleControls from "./actions/handle-controls"
import { Modes } from "./types/enums"
import * as GUI from "babylonjs-gui"
import createWorld from "./createWorld"
import Blocks from "./blocks/blocks"
import { materialsByID } from "./blocks/materials"

const debug = (scene) => {
  const blockNames = blocksValues.map(({ name }) => name)

  document
    .getElementById("viewport")
    .addEventListener("auxclick", function (e) {
      if (e.button == 1) {
        const { hit, pickedMesh, faceId } = scene.pick(
          scene.pointerX,
          scene.pointerY,
          (mesh) => {
            return (
              mesh.isPickable && mesh.isEnabled && !blockNames.includes(mesh.id)
            )
          },
        )

        if (pickedMesh) {
          console.log(pickedMesh.name)
        }
      }
    })
}

const createScene = async (engine, canvas, mobile) => {
  const state = {
    activeShape: 1,
    activeMaterial: 1,
    mode: Modes.build,
    day: true,
    music: false,
    track: 0,
    reverseBuild: false,
    tab: "blocks",
    tabAll: true,
  }

  const scene = new BABYLON.Scene(engine)
  scene.blockMaterialDirtyMechanism = true
  // @ts-ignore
  scene.useGeometryIdsMap = true
  // @ts-ignore
  scene.useClonedMeshMap = true

  debug(scene)

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
    copy: new BABYLON.Sound("copy", "sound/copy.mp3", scene),
    pop: new BABYLON.Sound("pop", "sound/pop.mp3", scene),
    ugh: new BABYLON.Sound("ugh", "sound/ugh.mp3", scene),
    die: new BABYLON.Sound("die", "sound/die.mp3", scene),
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

  // window.localStorage.removeItem("world")

  let savedWorldEntry = window.localStorage.getItem("world")
  let savedWorld

  if (savedWorldEntry) {
    savedWorld = JSON.parse(savedWorldEntry)

    if (savedWorld.version !== "0.1.11") {
      window.localStorage.removeItem("world")
      savedWorld = undefined
    }
  }

  const game = {
    world: {
      map: null,
      data: {},
      graph: null,
      size: null,
      items: [],
      mobs: [],
    },
    mobs: new Map(),
    bullets: new Map(),
    hero: null,
    ship: null,
    pause: false,
    sounds,
    mobile,
  }

  const camera = new Camera(scene, canvas, game)
  const blocks = new Blocks(scene, game, shadows, lights)

  createWorld(
    game,
    savedWorld,
    blocks,
    scene,
    shadows,
    lights,
    sounds,
    modelsMeta,
  )

  const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")
  gui.idealHeight = 1080

  const bot = new Bot(scene, game, sounds, shadows.shadowGenerator)
  const hero = new Hero(scene, state, game, sounds, bot, modelsMeta)
  game.hero = hero
  const gun = new Gun(scene, game, sounds, modelsMeta)
  hero.changeGun(gun)
  const ship = new Ship(scene, game, camera, gui, shadows.shadowGenerator)
  game.ship = ship

  const next = () => {
    game.pause = true
    game.bullets.forEach((_, bullet) => bullet.mesh.dispose())
    game.bullets = new Map()
    game.world.items.forEach((item) => item.dispose())
    createWorld(game, null, blocks, scene, shadows, lights, sounds, modelsMeta)
    camera.goToOrbit()
    ship.refreshScreen()
    game.pause = false
  }

  const skybox = BABYLON.MeshBuilder.CreateBox(
    "skyBox",
    { size: 10000.0 },
    scene,
  )
  skybox.position.x = 9
  skybox.position.y = 9
  skybox.position.z = 9

  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene)
  skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    "skybox/skybox",
    scene,
  )
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
  skybox.material = skyboxMaterial
  skybox.isPickable = false

  const action1 = createPrimaryAction({
    scene,
    state,
    game,
    modelsMeta,
    sounds,
    ship,
    blocks,
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
    engine,
    camera,
  })

  const controls = handleControls(scene, game, action1, action2, canvas, mobile)

  const renderFrame = () => {
    controls()

    hero.render()
    bot.render()
    ship.render()
    gun.render()
    game.bullets.forEach((_, bullet) => bullet.render())
    game.mobs.forEach((_, mob) => mob.render())

    scene.render()
  }

  const $toolbox = document.getElementById("toolbox")
  const $selectedShape = document.getElementById("selected-shape")
  const $selectedMaterial = document.getElementById("selected-material")

  const $allMaterials = [
    ...document.querySelectorAll('[data-material-type="all"]'),
  ]
  const $baseMaterials = [
    ...document.querySelectorAll('[data-material-type="base"]'),
  ]

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

        // @ts-ignore
        const shapeType = target.dataset.shapeType
        const tabAll = shapeType === "all"

        if (tabAll !== state.tabAll) {
          state.tabAll = !state.tabAll

          if (state.tabAll) {
            $allMaterials.forEach(($material) => {
              $material.classList.remove("none")
            })
            $baseMaterials.forEach(($material) => {
              $material.classList.remove("none")
            })
          } else {
            $baseMaterials.forEach(($material) => {
              $material.classList.add("none")
            })

            if (materialsByID[state.activeMaterial].type !== "all") {
              state.activeMaterial = 1
              // @ts-ignore
              $selectedMaterial.style.backgroundImage = "none"
              // @ts-ignore
              $selectedMaterial.style.background = materialsByID[1].colorHex
              $selectedMaterial.style.boxShadow = "none"
            }
          }
        }
      }
    })

  document
    .getElementById("toolbox-materials")
    .addEventListener("click", ({ target }) => {
      // @ts-ignore
      if (target.dataset.type === "material") {
        sounds.button.play()

        // @ts-ignore
        const emission = Number(target.dataset.emission)
        // @ts-ignore
        const light = target.dataset.light === "1"
        // @ts-ignore
        const texture = target.dataset.texture

        // @ts-ignore
        state.activeMaterial = target.dataset.id
        if (light) {
          // @ts-ignore
          $selectedMaterial.style.background = "none"
          $selectedMaterial.style.backgroundImage =
            // @ts-ignore
            `radial-gradient(${target.dataset.color}, rgba(0, 0, 0, 0))`
        } else if (texture) {
          $selectedMaterial.style.background = "none"
          $selectedMaterial.style.backgroundImage = `url(${texture}`
          $selectedMaterial.style.backgroundSize = "cover"
        } else {
          // @ts-ignore
          $selectedMaterial.style.backgroundImage = "none"
          // @ts-ignore
          $selectedMaterial.style.background = target.dataset.color
        }

        $selectedMaterial.style.boxShadow =
          // @ts-ignore
          emission > 0 ? `0 0 20px ${target.dataset.color}` : "none"
      }
    })

  document
    .getElementById("tab-toolbox-liquids")
    .addEventListener("click", ({ target }) => {
      // @ts-ignore
      if (target.dataset.type === "liquid") {
        sounds.button.play()
        // @ts-ignore
        state.activeMaterial = target.dataset.id
        state.activeShape = 1
        $toolbox.classList.toggle("hidden")
        game.pause = false
      }
    })

  document
    .getElementById("tab-toolbox-plants")
    .addEventListener("click", ({ target }) => {
      // @ts-ignore
      if (target.dataset.type === "plant") {
        sounds.button.play()
        // @ts-ignore
        state.activeShape = target.dataset.id
        // @ts-ignore
        state.activeMaterial = target.dataset.materialId
          // @ts-ignore
          .replace("{grass}", game.world.data.grassMaterial || "16c")
          // @ts-ignore
          .replace("{leafs}", game.world.data.plantsMaterial || "16a")
        $toolbox.classList.toggle("hidden")
        game.pause = false
      }
    })

  document.getElementById("back").addEventListener("click", () => {
    sounds.button.play()
    $toolbox.classList.toggle("hidden")
    game.pause = false
  })

  const $tabs = [...document.getElementsByClassName("tab")]
  const $tabsContent = [...document.getElementsByClassName("tab-toolbox")]
  const $toolboxSelected = document.getElementById("toolbox-selected")

  document.getElementById("tabs").addEventListener("click", ({ target }) => {
    // @ts-ignore
    if (target.dataset.type === "tab") {
      // @ts-ignore
      if (target.dataset.id === "blocks") {
        $toolboxSelected.classList.remove("hidden")
      } else {
        $toolboxSelected.classList.add("hidden")
      }

      sounds.button.play()
      // @ts-ignore
      state.tab = target.dataset.id

      $tabsContent.forEach(($tabContent) => {
        $tabContent.classList.add("hidden")
      })

      $tabs.forEach(($tab) => {
        $tab.classList.remove("tab-selected")
      })

      document
        // @ts-ignore
        .getElementById(`tab-toolbox-${target.dataset.id}`)
        .classList.remove("hidden")

      document
        // @ts-ignore
        .getElementById(`tab-${target.dataset.id}`)
        .classList.add("tab-selected")
    }
  })

  return { renderFrame, scene, game }
}

export default createScene

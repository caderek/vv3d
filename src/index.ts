import "pepjs"
import * as BABYLON from "babylonjs"
import "babylonjs-loaders"
import { addBackground } from "./background"
import Lights from "./lights"
import Shadows from "./shadows"
import * as isMobile from "is-mobile"
import blocksInfo, { blocksValues } from "./blocks"
import stats from "./stats"
import gameLoop from "./game-loop"
import createVoxel from "./createVoxel"
import downloadImage from "./helpers/downloadImage"
import { saveWorld } from "./save"
import AmbientOcclusion from "./ambient-occlusion"
import createDefaultWorld from "./world/createDefaultWorld"
import createRandomWorld from "./world/createRandomWorld"
import Hero from "./hero"
import Ship from "./ship"
import loadModels from "./load-models"
import graph from "./graph"
import WorldGraph from "./graph"
import { randomInt } from "./helpers/random"

const toolbox = document.getElementById("toolbox")
const splash = document.getElementById("splash")
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
  mode: Modes.hero,
  day: true,
  music: false,
  track: 0,
}

const blockNames = blocksValues.map(({ name }) => name)

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

const createScene = async (engine, canvas) => {
  const scene = new BABYLON.Scene(engine)
  scene.blockMaterialDirtyMechanism = true
  scene.useGeometryIdsMap = true
  scene.useClonedMeshMap = true

  const modelsMeta = await loadModels(scene)

  addBackground(scene)
  const sounds = {
    go: new BABYLON.Sound("go", "sound/go.wav", scene),
    denied: new BABYLON.Sound("denied", "sound/denied.wav", scene),
    button: new BABYLON.Sound("button", "sound/button.wav", scene),
    ship: new BABYLON.Sound("ship", "sound/ship.wav", scene),
    gather: new BABYLON.Sound("gather", "sound/gather.wav", scene),
    build: new BABYLON.Sound("build", "sound/build.wav", scene),
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

  const camera = new BABYLON.ArcRotateCamera(
    "Camera",
    (Math.PI / 4) * 7,
    Math.PI / 3,
    worldSize * 3,
    new BABYLON.Vector3(worldSize / 2, 0, worldSize / 2),
    scene,
  )

  camera.inertia = 0
  camera.checkCollisions = true
  camera.panningInertia = 0
  camera.panningSensibility = 100
  camera.pinchPrecision = 20
  camera.pinchToPanMaxDistance = 40

  camera.attachControl(canvas, true)

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

  const hero = new Hero(scene, world, worldGraph, sounds)
  hero.bounce()

  const ship = new Ship(scene, world, worldGraph)

  console.log(scene)

  lights.createSkybox(worldSize)
  lights.createGlow([lights.skybox])

  // var lines = BABYLON.MeshBuilder.CreateLines(
  //   "lines",
  //   { points: myArray, updatable: true },
  //   scene,
  // )

  const action1 = () => {
    const { hit, pickedMesh } = scene.pick(
      scene.pointerX,
      scene.pointerY,
      (mesh) =>
        mesh.isPickable && mesh.isEnabled && !blockNames.includes(mesh.id),
    )

    if (hit === true) {
      if (modelsMeta.has(pickedMesh)) {
        const meta = modelsMeta.get(pickedMesh)
        console.log(meta)
      } else if (state.mode === Modes.build) {
        sounds.gather.play()
        pickedMesh.dispose()
        scene.getMeshByName(`item_${pickedMesh.id}`).dispose()
        const light = scene.getLightByID(`light_${pickedMesh.id}`)
        if (light) {
          light.dispose()
        }
        const [y, z, x] = pickedMesh.id.split("_").map(Number)
        world[y][z][x] = null
        worldGraph.add(y, z, x)
        saveWorld(world)
      }
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
      if (modelsMeta.has(pickedMesh)) {
        const meta = modelsMeta.get(pickedMesh)
        console.log(meta)
        if (meta.rootName === "ship") {
          if (!ship.orbiting) {
            state.mode = state.mode === Modes.build ? Modes.hero : Modes.build
            lights.toggleSkybox()
            ship.toggle()
            hero.toggle()
            sounds.ship.play()
            return
          }

          const buttons = {
            "button-pink": () => {
              toolbox.classList.toggle("hidden")
            },
            "button-green": () => {
              const dataUrl = canvas.toDataURL("image/png")

              if (mobile) {
                const image = new Image()
                image.src = dataUrl

                const win = window.open("")
                win.document.write(image.outerHTML)
              } else {
                downloadImage(dataUrl, "my-world.png")
              }
            },
            "button-orange": () => {
              state.music = !state.music

              if (state.music) {
                const song = songs[state.track]
                song.play()
              } else {
                songs[state.track].pause()
              }
            },
            "button-red": () => {
              state.track = (state.track + 1) % songs.length
              songs.forEach((song) => song.stop())
              songs[state.track].play()
              state.music = true
            },
            "button-purple": () => {
              console.log("lights switch")
              state.day = !state.day
              lights.change(
                state.day
                  ? {
                      top: 4,
                      bottom: 0.5,
                      ambient: 0.2,
                      skyAlpha: 0.95,
                      color: "#FFFFFF",
                    }
                  : {
                      top: 0.1,
                      bottom: 0.1,
                      ambient: 0.01,
                      skyAlpha: 0.1,
                      color: "#9fbfff",
                    },
              )
            },
            "button-blue": () => {
              window.localStorage.removeItem("world")
              location.reload()
            },
            "button-yellow": () => {
              state.mode = state.mode === Modes.build ? Modes.hero : Modes.build
              lights.toggleSkybox()
              ship.toggle()
              hero.toggle()
            },
          }

          if (buttons[meta.name]) {
            sounds.button.play()
            buttons[meta.name]()
          }
        }
      } else if (state.mode === Modes.build) {
        const inc = incrementByFace[faceId]
        const y = pickedMesh.position.y + inc.y
        const z = pickedMesh.position.z + inc.z
        const x = pickedMesh.position.x + inc.x

        if (
          y >= 0 &&
          y < world.length &&
          z >= 0 &&
          z < world.length &&
          x >= 0 &&
          x < world.length
        ) {
          sounds.build.play()
          createVoxel(
            scene,
            world,
            baseBlocks[state.activeBlock],
            shadows.shadowGenerator,
            y,
            z,
            x,
          )
        } else {
          sounds.denied.play()
        }

        worldGraph.remove(y, z, x)
      } else {
        hero.move(pickedMesh.id)
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

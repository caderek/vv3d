import { blocksValues } from "../blocks"
import { Modes } from "../types/enums"
import { gather, build } from "./building"
import { saveWorld } from "../save"

const toolbox = document.getElementById("toolbox")

const blockNames = blocksValues.map(({ name }) => name)

const createSecondaryAction = ({
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
}) => () => {
  const { hit, pickedMesh, faceId } = scene.pick(
    scene.pointerX,
    scene.pointerY,
    (mesh) =>
      mesh.isPickable && mesh.isEnabled && !blockNames.includes(mesh.id),
  )

  // console.log({ picked: pickedMesh.name, pickedMesh })

  if (hit === true) {
    if (modelsMeta.has(pickedMesh)) {
      const meta = modelsMeta.get(pickedMesh)

      // console.log({ meta })

      if (meta.type === "mob" && state.mode === Modes.hero) {
        game.hero.attack(meta.model)
      }

      if (meta.rootName === "ship") {
        if (!ship.orbiting) {
          state.mode = state.mode === Modes.build ? Modes.hero : Modes.build
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
            if (!mobile) {
              BABYLON.Tools.CreateScreenshot(engine, camera, {
                width: window.innerWidth,
                height: window.innerHeight,
              })
            } else {
              state.reverseBuild = !state.reverseBuild
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
            state.day = !state.day
            lights.change(
              state.day
                ? {
                    top: 4,
                    bottom: 1,
                    ambient: 0.2,
                    skyAlpha: 0.95,
                    color: "#FFFFFF",
                  }
                : {
                    top: 0.1,
                    bottom: 0.1,
                    ambient: 0.1,
                    skyAlpha: 0.1,
                    color: "#9fbfff",
                  },
            )
          },
          "button-blue": () => {
            next()
          },
          "button-yellow": () => {
            state.mode = state.mode === Modes.build ? Modes.hero : Modes.build
            ship.toggle()
            hero.toggle()
            game.world.graph.create(game.world.map)
          },
        }

        if (buttons[meta.name]) {
          sounds.button.play()
          buttons[meta.name]()
        }
      }
    } else if (state.mode === Modes.build) {
      if (state.reverseBuild) {
        gather(scene, game, pickedMesh, ship, sounds)
        saveWorld(game)
      } else {
        build(game, pickedMesh, faceId, ship, sounds, blocks, state)
      }
    } else {
      hero.move(pickedMesh.id)
    }
  }
}

export default createSecondaryAction

import { blocksValues } from "../blocks"
import { Modes } from "../types/enums"
import { saveWorld } from "../save"
import downloadImage from "../helpers/downloadImage"
import createVoxel from "../createVoxel"

const toolbox = document.getElementById("toolbox")

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

const blockNames = blocksValues.map(({ name }) => name)

const createSecondaryAction = ({
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
}) => () => {
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
            // window.localStorage.removeItem("world")
            // location.reload()
            next()
          },
          "button-yellow": () => {
            state.mode = state.mode === Modes.build ? Modes.hero : Modes.build
            lights.toggleSkybox()
            ship.toggle()
            hero.toggle()
            world.graph.create(world)
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
        y < world.map.length &&
        z >= 0 &&
        z < world.map.length &&
        x >= 0 &&
        x < world.map.length
      ) {
        sounds.build.play()
        ship.shoot(y, z, x, "left")
        createVoxel(
          scene,
          world.map,
          world.items,
          baseBlocks[state.activeBlock],
          shadows.shadowGenerator,
          y,
          z,
          x,
        )
      } else {
        sounds.denied.play()
      }

      // worldGraph.remove(y, z, x)
    } else {
      hero.move(pickedMesh.id)
    }
  }
}

export default createSecondaryAction

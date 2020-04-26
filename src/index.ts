import "pepjs"
import * as BABYLON from "babylonjs"
import "babylonjs-loaders"
// @ts-ignore
import * as isMobile from "is-mobile"
import { blocksValues } from "./blocks"
import stats from "./helpers/stats"
import gameLoop from "./game-loop"
import createScene from "./createScene"
import * as GUI from "babylonjs-gui"

const toolbox = document.getElementById("toolbox")

const mobile = isMobile()
const targetFPS = 20

const main = async () => {
  const canvas = document.getElementById("viewport") as HTMLCanvasElement

  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  })

  BABYLON.Engine.audioEngine.useCustomUnlockedButton = true

  const { renderFrame, scene, game } = await createScene(engine, canvas, mobile)

  gameLoop(() => {
    if (!game.pause) {
      stats.begin()
      renderFrame()
      stats.end()
    }
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

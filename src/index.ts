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
const toolboxSwitchImg = document.getElementById("active-item")

const mobile = isMobile()
const targetFPS = 20

const main = async () => {
  const canvas = document.getElementById("viewport") as HTMLCanvasElement

  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  })

  BABYLON.Engine.audioEngine.useCustomUnlockedButton = true

  const { renderFrame, scene } = await createScene(engine, canvas, mobile)

  const screen = scene.getMeshByName("ship-screen")

  var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")
  advancedTexture.idealHeight = 1080

  var rect1 = new GUI.Rectangle()
  rect1.width = "400px"
  rect1.height = "100px"
  rect1.thickness = 0
  // rect1.background = "black"
  advancedTexture.addControl(rect1)

  var label = new GUI.TextBlock()
  label.text = "Welcome to the new planet!"
  // label.color = "#E70075"
  label.color = "#008DE7"
  label.fontFamily = "monospace"
  rect1.addControl(label)

  rect1.linkWithMesh(screen)

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

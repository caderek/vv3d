import "pepjs"
import "@pwabuilder/pwainstall"
import * as BABYLON from "babylonjs"
import "babylonjs-loaders"
// @ts-ignore
import * as isMobile from "is-mobile"
import { blocksValues } from "./blocks"
import stats from "./helpers/stats"
import gameLoop from "./game-loop"
import createScene from "./createScene"
import * as GUI from "babylonjs-gui"
import { shapeEntries } from "./blocks/shapes"
import { materialEntries } from "./blocks/materials"

const $toolboxShapes = document.getElementById("toolbox-shapes")
const $toolboxMaterials = document.getElementById("toolbox-materials")

const mobile = isMobile()
const targetFPS = 20

const main = async () => {
  const canvas = document.getElementById("viewport") as HTMLCanvasElement

  const engine = new BABYLON.Engine(canvas, true, {
    // preserveDrawingBuffer: true,
    // stencil: true,
    disableWebGL2Support: true,
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

const renderToolboxShape = (name, id) => `
  <div
    class="shape"
    data-type="shape"
    data-name="${name}"
    data-id="${id}"
    style="background-image: url(/models/ico/${name}.png);"
  ></div>
`

const toolboxShapes = shapeEntries
  .map(({ name, id }) => renderToolboxShape(name, id))
  .join("\n")

const renderToolboxMaterial = (id, colorHex, emission) => `
  <div
    class="material"
    data-type="material"
    data-color="${colorHex}"
    data-emission="${emission}"
    data-id="${id}"
    style="background: ${colorHex}; ${
  emission > 0 ? `box-shadow: 0 0 20px ${colorHex}` : ""
}"
  ></div>
`

const toolboxMaterials = materialEntries
  .map(({ id, colorHex, emission }) =>
    renderToolboxMaterial(id, colorHex, emission),
  )
  .join("\n")

$toolboxShapes.innerHTML = toolboxShapes
$toolboxMaterials.innerHTML = toolboxMaterials

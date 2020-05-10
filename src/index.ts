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
    preserveDrawingBuffer: true,
    // stencil: true,
    disableWebGL2Support: true,
  })

  BABYLON.Engine.audioEngine.useCustomUnlockedButton = true

  const { renderFrame, scene, game } = await createScene(engine, canvas, mobile)

  const camera = scene.activeCamera

  // new BABYLON.FxaaPostProcess("fxaa", 1.0, camera)
  // new BABYLON.BlackAndWhitePostProcess("bandw", 1.0, camera)
  // new BABYLON.BloomEffect(scene, 1, 1, 1);
  // scene.fogMode = BABYLON.Scene.FOGMODE_EXP
  // scene.fogDensity = 0.1
  // scene.fogColor = new BABYLON.Color3(0, 0, 0)

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

const renderToolboxMaterial = (id, colorHex, emission, light) => {
  const style = light
    ? `background-image: radial-gradient(${colorHex}, rgba(0, 0, 0, 0)); box-shadow: 0 0 20px ${colorHex}`
    : emission > 0
    ? `background: ${colorHex}; box-shadow: 0 0 20px ${colorHex}`
    : `background: ${colorHex};`

  return `
    <div
      class="material"
      data-type="material"
      data-color="${colorHex}"
      data-emission="${emission}"
      data-light=${light ? 1 : 0}
      data-id="${id}"
      style="${style}"
    ></div>
  `
}

const toolboxMaterials = materialEntries
  .map(({ id, colorHex, emission, light }) =>
    renderToolboxMaterial(id, colorHex, emission, light),
  )
  .join("\n")

$toolboxShapes.innerHTML = toolboxShapes
$toolboxMaterials.innerHTML = toolboxMaterials

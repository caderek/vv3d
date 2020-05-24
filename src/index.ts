import "pepjs"
import "@pwabuilder/pwainstall"
import * as BABYLON from "babylonjs"
import "babylonjs-loaders"
// @ts-ignore
import * as isMobile from "is-mobile"
import { blocksValues } from "./blocks"
// import stats from "./helpers/stats"
import gameLoop from "./game-loop"
import createScene from "./createScene"
import * as GUI from "babylonjs-gui"
import { shapeEntries } from "./blocks/shapes"
import { materialEntries } from "./blocks/materials"
import AmbientOcclusion from "./scene/ambient-occlusion"

const $toolboxShapes = document.getElementById("toolbox-shapes")
const $toolboxMaterials = document.getElementById("toolbox-materials")
const $toolboxLiquids = document.getElementById("tab-toolbox-liquids")
const $toolboxPlants = document.getElementById("tab-toolbox-plants")
const $toolboxItems = document.getElementById("tab-toolbox-items")

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

  // new AmbientOcclusion(scene, camera)

  // new BABYLON.FxaaPostProcess("fxaa", 1.0, camera)
  // new BABYLON.BlackAndWhitePostProcess("bandw", 1.0, camera)
  // new BABYLON.BloomEffect(scene, 1, 1, 1);
  // scene.fogMode = BABYLON.Scene.FOGMODE_EXP
  // scene.fogDensity = 0.1
  // scene.fogColor = new BABYLON.Color3(0, 0, 0)

  let gpon = false
  gameLoop(() => {
    const gp = navigator.getGamepads()[0]
    if (gp && !gpon) {
      console.log({ gp })
      game.sounds.die.play()
      gpon = true
    }
    if (!game.pause) {
      // stats.begin()
      renderFrame()
      // stats.end()
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

const renderToolboxShape = (name, id, type) => `
  <div
    class="shape"
    data-type="shape"
    data-shape-type="${type}"
    data-name="${name}"
    data-id="${id}"
    style="background-image: url(/models/ico/${name}.png);"
  ></div>
`

const toolboxShapes = shapeEntries
  .filter(
    ({ groups }) => groups.includes("base") || groups.includes("constructions"),
  )
  .map(({ name, id, type }) => renderToolboxShape(name, id, type))
  .join("\n")

const renderToolboxMaterial = (
  id,
  colorHex,
  emission,
  light,
  texture,
  type,
) => {
  let style = light
    ? `background-image: radial-gradient(${colorHex}, rgba(0, 0, 0, 0)); box-shadow: 0 0 20px ${colorHex};`
    : emission > 0
    ? `background: ${colorHex}; box-shadow: 0 0 20px ${colorHex};`
    : `background: ${colorHex};`

  if (texture) {
    style += `background: none; background-image: url(${texture.src}); background-size: cover;`
  }

  return `
    <div
      class="material"
      data-type="material"
      data-color="${colorHex}"
      data-emission="${emission}"
      data-light=${light ? 1 : 0}
      data-texture="${texture ? texture.src : ""}"
      data-id="${id}"
      data-material-type="${type}"
      style="${style}"
    ></div>
  `
}

const toolboxMaterials = materialEntries
  .filter(({ groups }) => groups.includes("building"))
  .map(({ id, colorHex, emission, light, texture, type }) =>
    renderToolboxMaterial(id, colorHex, emission, light, texture, type),
  )
  .join("\n")

const renderLiquids = (id, colorHex) => {
  const style = `background: ${colorHex};`
  return `
    <div
      class="liquid"
      data-type="liquid"
      data-id="${id}"
      style="${style}"
    ></div>
  `
}

const toolboxLiquids = materialEntries
  .filter(({ type }) => type === "liquid")
  .map(({ id, colorHex }) => renderLiquids(id, colorHex))
  .join("\n")

const renderPlants = (id, name, pallets) => {
  if (pallets.length === 0) {
    return `
      <div
        class="plant"
        data-type="plant"
        data-id="${id}"
        data-material-id="{${name}}"
        style="background-image: url(/models/ico/${name}.png)"
      ></div>
    `
  }

  return pallets
    .map((palette) => {
      const materials = palette.filter((item) => item !== null)
      const ico = `${name}_${materials.join("_")}`

      return `
      <div
        class="plant"
        data-type="plant"
        data-id="${id}"
        data-material-id="${
          palette[0] === null ? "{leafs}." : ""
        }${materials.join(".")}"
        style="background-image: url(/models/ico/${ico}.png)"
      ></div>
    `
    })
    .join("\n")
}

const toolboxPlants = shapeEntries
  .filter(({ type }) => type === "plant" || type === "grass")
  .map(({ id, name, pallets }) => renderPlants(id, name, pallets))
  .join("\n")

$toolboxShapes.innerHTML = toolboxShapes
$toolboxMaterials.innerHTML = toolboxMaterials
$toolboxLiquids.innerHTML = toolboxLiquids
$toolboxPlants.innerHTML = toolboxPlants

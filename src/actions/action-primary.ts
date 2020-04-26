import { blocksValues } from "../blocks"
import { Modes } from "../types/enums"
import { saveWorld } from "../save"

const blockNames = blocksValues.map(({ name }) => name)

const createPrimaryAction = ({
  scene,
  state,
  game,
  modelsMeta,
  sounds,
  ship,
}) => () => {
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
      ship.shoot(y, z, x, "right")
      game.world.map[y][z][x] = null
      // worldGraph.add(y, z, x)
      saveWorld(game)
    }
  }
}

export default createPrimaryAction

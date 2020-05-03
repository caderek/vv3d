import { blocksValues } from "../blocks"
import { Modes } from "../types/enums"
import { saveWorld } from "../save"
import { gather, build } from "./building"

const blockNames = blocksValues.map(({ name }) => name)

const createPrimaryAction = ({
  scene,
  state,
  game,
  modelsMeta,
  sounds,
  ship,
  blocks,
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
    } else if (state.mode === Modes.build) {
      if (state.reverseBuild) {
        build(game, pickedMesh, faceId, ship, sounds, blocks, state)
      } else {
        gather(scene, game, pickedMesh, ship, sounds)
        saveWorld(game)
      }
    }
  }
}

export default createPrimaryAction

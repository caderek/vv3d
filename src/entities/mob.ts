import * as BABYLON from "babylonjs"

let counter = 0

class Mob {
  public mesh: any
  private game: any
  private scene: any
  private sounds: any
  private mobData: any

  constructor(mobData, scene, game, sounds, modelsMeta) {
    this.game = game
    this.scene = scene
    this.sounds = sounds
    this.mobData = mobData

    const name = `${mobData.type}_${counter++}`
    const baseMesh = scene.getMeshByName(mobData.type)
    baseMesh.setParent(null)
    this.mesh = baseMesh.clone(name)
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL)

    this.mesh.isVisible = true
    this.mesh.isPickable = true

    modelsMeta.set(this.mesh, {
      root: this.mesh,
      rootName: name,
      type: "mob",
      model: this,
    })

    this.mesh.getChildren().forEach((mesh) => {
      mesh.isVisible = true
      mesh.isPickable = true
      modelsMeta.set(mesh, {
        root: this.mesh,
        rootName: name,
        type: "mob",
        model: this,
      })
    })

    game.world.items.push(this.mesh)
  }

  place(y, z, x) {
    this.mesh.position.y = y + this.mobData.offsetY
    this.mesh.position.z = z
    this.mesh.position.x = x

    return this
  }

  move() {}

  render() {
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 80, BABYLON.Space.LOCAL)
  }
}

export default Mob

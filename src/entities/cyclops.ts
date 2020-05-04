import * as BABYLON from "babylonjs"

let counter = 0

class Cyclops {
  public mesh: any
  private game: any
  private scene: any
  private sounds: any

  constructor(scene, game, sounds, modelsMeta) {
    this.game = game
    this.scene = scene
    this.sounds = sounds

    const name = `cyclops_${counter++}`
    const baseMesh = scene.getMeshByName("cyclops")
    this.mesh = baseMesh.parent.clone(name)
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL)

    const clonedMesh = this.mesh.getChildren()[0]
    clonedMesh.isVisible = true
    clonedMesh.isPickable = true

    modelsMeta.set(clonedMesh, {
      root: this.mesh,
      rootName: name,
      type: "monster",
      model: this,
    })

    clonedMesh.getChildren().forEach((mesh) => {
      mesh.isVisible = true
      mesh.isPickable = true
      modelsMeta.set(mesh, {
        root: this.mesh,
        rootName: name,
        type: "monster",
        model: this,
      })
    })

    game.world.items.push(this.mesh)
  }

  place(y, z, x) {
    this.mesh.position.y = y
    this.mesh.position.z = z
    this.mesh.position.x = x

    return this
  }

  move() {}

  render() {
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 80, BABYLON.Space.LOCAL)
  }
}

export default Cyclops

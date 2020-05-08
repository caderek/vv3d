import * as BABYLON from "babylonjs"

let counter = 0

class Mob {
  public mesh: any
  private game: any
  private scene: any
  private sounds: any
  private mobData: any
  private dying: boolean
  private dead: boolean
  private ticksToDie: number
  private health: number

  constructor(mobData, scene, game, sounds, modelsMeta, shadows) {
    this.game = game
    this.scene = scene
    this.sounds = sounds
    this.mobData = mobData
    this.health = mobData.health
    this.dead = false
    this.dying = false

    const name = `${mobData.type}_${counter++}`
    const baseMesh = scene.getMeshByName(mobData.type)
    const hitBox = this.createHitBox(name)
    baseMesh.setParent(null)

    const clonedMesh = baseMesh.clone(`${name}_mesh`)
    clonedMesh.setParent(hitBox)
    clonedMesh.position.x = 0
    clonedMesh.position.y = 0
    clonedMesh.position.z = 0
    shadows.addCaster(clonedMesh)

    clonedMesh.isVisible = true
    clonedMesh.getChildren().forEach((mesh) => {
      mesh.isVisible = true
      mesh.isPickable = false
    })

    this.mesh = hitBox
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL)

    modelsMeta.set(this.mesh, {
      root: this.mesh,
      rootName: name,
      type: "mob",
      model: this,
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

  takeDamage(damage, weaponCycle) {
    this.health -= damage

    if (this.health <= 0) {
      this.dying = true
      this.ticksToDie = weaponCycle - 2
      return true
    }

    return false
  }

  private createHitBox(name) {
    const box = BABYLON.MeshBuilder.CreateBox(
      name,
      {
        width: 1,
        height: 1,
        depth: 1,
      },
      this.scene,
    )

    box.isVisible = false
    box.isPickable = true

    return box
  }

  render() {
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 80, BABYLON.Space.LOCAL)
    if (!this.dead) {
      if (this.dying) {
        if (this.ticksToDie <= 0) {
          this.dead = true
          this.sounds.pop.play()
          this.mesh.dispose()
        } else {
          this.ticksToDie--
        }
      }
    }
  }
}

export default Mob

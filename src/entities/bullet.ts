import * as BABYLON from "babylonjs"

let material = null

class Bullet {
  public mesh: BABYLON.Mesh
  private incrementVector: BABYLON.Vector3
  private game: any
  private damage: number

  constructor(scene, game, from, damage, speed) {
    this.game = game
    this.damage = damage

    this.mesh = BABYLON.MeshBuilder.CreateBox(
      name,
      {
        width: 0.2,
        height: 0.2,
        depth: 0.2,
      },
      scene,
    )

    this.mesh.position = from.position.clone()

    this.mesh.isPickable = false

    if (!material) {
      material = new BABYLON.StandardMaterial("bullet-material", scene)
      material.diffuseColor = new BABYLON.Color3(0, 1, 0)
      material.emissiveColor = new BABYLON.Color3(0, 1, 0)
    }

    this.mesh.material = material

    const xx = BABYLON.Ray.CreateNewFromTo(
      from.position,
      game.hero.mesh.position,
    )

    this.incrementVector = xx.direction.multiply(
      new BABYLON.Vector3(speed, speed, speed),
    )
  }

  render() {
    if (!this.mesh) {
      return
    }

    if (
      this.game.hero.onLand &&
      this.mesh.intersectsMesh(this.game.hero.mesh)
    ) {
      this.game.hero.takeDamage(this.damage)
      this.mesh.dispose()
      this.game.bullets.delete(this)
    } else {
      this.mesh.position = this.mesh.position.add(this.incrementVector)
    }
  }
}

export default Bullet

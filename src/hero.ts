import * as BABYLON from "babylonjs"

class Hero {
  public mesh: any
  private scene: any

  constructor(scene) {
    this.scene = scene
    this.mesh = scene.getMeshByName("hero").parent
    this.mesh.position.y = 5
    this.mesh.position.z = -1
    this.mesh.position.x = -1
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL)

    scene.getMeshByName("hero-glow.R").material.disableLighting = true
  }

  bounce() {
    const animations = this.scene.animationGroups.filter((animation) =>
      animation.name.includes("hero"),
    )
    animations.forEach((animation) => animation.play(true))
  }
}

export default Hero

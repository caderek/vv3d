import * as BABYLON from "babylonjs"

class Hero {
  public mesh: any
  private amp: number
  private change: number
  private scene: any

  constructor(scene) {
    this.scene = scene
    this.mesh = scene.getMeshByName("hero")
    this.mesh.setParent(null)
    this.mesh.position.y = 3
    this.mesh.position.z = -1
    this.mesh.position.x = -1
    this.amp = 0
    this.change = 0.01

    scene.getMeshByName("hero_glow.R").material.disableLighting = true
    console.log(scene)
  }

  bounce() {
    // const animations = this.scene.animationGroups.filter((animation) =>
    //   animation.name.includes("hero"),
    // )

    // animations.forEach((animation) => animation.play(true))
    this.amp += this.change
    if (this.amp > 0.8) {
      this.change = -0.05
    } else if (this.amp < -0.8) {
      this.change = 0.05
    }
    this.mesh.position.y += this.change
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 24, BABYLON.Space.LOCAL)
  }
}

export default Hero

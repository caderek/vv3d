import * as BABYLON from "babylonjs"

class Camera {
  public camera: any
  private scene: any
  private game: any

  constructor(scene, canvas, game) {
    this.scene = scene
    this.game = game

    const camera = new BABYLON.ArcRotateCamera(
      "Camera",
      0,
      0,
      0,
      new BABYLON.Vector3(0, 0, 0),
      scene,
    )

    camera.inertia = 0
    camera.checkCollisions = true
    camera.panningInertia = 0
    camera.panningSensibility = 100
    camera.pinchPrecision = 20
    camera.pinchToPanMaxDistance = 40

    camera.attachControl(canvas, true)

    this.camera = camera
  }

  goToOrbit() {
    this.camera.setTarget(
      new BABYLON.Vector3(
        this.game.world.size / 2 - 1,
        this.game.world.size / 3,
        this.game.world.size / 2 - 1,
      ),
    )
    this.camera.setPosition(
      new BABYLON.Vector3(this.game.world.size + 20, this.game.world.size, -20),
    )
  }

  goToHero() {
    this.goToOrbit()
  }
}

export default Camera

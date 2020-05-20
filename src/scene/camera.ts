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
    camera.panningInertia = 0
    camera.panningSensibility = 50
    camera.pinchPrecision = 20
    camera.allowUpsideDown = false
    camera.checkCollisions = true
    camera.lowerRadiusLimit = 10
    camera.upperRadiusLimit = 100
    camera.angularSensibilityY = 500
    camera.angularSensibilityX = 500
    camera.useNaturalPinchZoom = true

    camera.attachControl(canvas, true)

    let touches = 0

    scene.onPrePointerObservable.add((action) => {
      const { type, event } = action

      if (type === 1) {
        touches++
      } else if (type === 2) {
        touches--
      }

      if (touches > 2) {
        action.skipOnPointerObservable = true
      }
    })

    this.camera = camera
  }

  goToOrbit() {
    this.camera.setTarget(
      new BABYLON.Vector3(
        this.game.world.size / 2 - 1,
        3,
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

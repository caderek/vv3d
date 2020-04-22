import * as BABYLON from "babylonjs"

class Camera {
  private scene: any
  private world: any
  private worldSize: number
  private camera: any
  private hero: any

  constructor(scene, canvas, world, hero) {
    this.scene = scene
    this.world = world
    this.hero = hero

    this.worldSize = world.length

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
        this.worldSize / 2,
        this.worldSize / 3,
        this.worldSize / 2,
      ),
    )
    this.camera.setPosition(
      new BABYLON.Vector3(
        this.worldSize * 2,
        this.worldSize * 1.5,
        -this.worldSize,
      ),
    )
  }

  goToHero() {
    this.camera.setTarget(
      new BABYLON.Vector3(
        this.worldSize / 2,
        this.worldSize / 3,
        this.worldSize / 2,
      ),
    )

    this.camera.setPosition(
      new BABYLON.Vector3(
        this.worldSize * 2,
        this.worldSize * 1.5,
        -this.worldSize,
      ),
    )
  }
}

export default Camera

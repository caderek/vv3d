import * as BABYLON from "babylonjs"
import { saveWorld } from "../save"
import { Environments } from "../world/mobsData"
import { materialsByID } from "../blocks/materials"
import { randomInt } from "../helpers/random"

let counter = 0

enum Actions {
  move,
  stay,
}

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
  private gridPosition: any
  private checkFn: any
  private action: Actions
  private remainingPath: any[]
  private remainingSteps: number
  private velocityX: number
  private velocityY: number
  private velocityZ: number

  constructor(mobData, scene, game, sounds, modelsMeta, shadows) {
    this.game = game
    this.scene = scene
    this.sounds = sounds
    this.mobData = mobData
    this.health = mobData.health
    this.dead = false
    this.dying = false
    this.checkFn = {
      [Environments.land]: this.checkLand,
      [Environments.air]: this.checkAir,
      [Environments.water]: this.checkWater,
    }[mobData.environment]
    this.remainingPath = []
    this.remainingSteps = 0
    this.velocityX = 0
    this.velocityY = 0
    this.velocityZ = 0

    const name = `${mobData.type}_${counter++}`
    const baseMesh = scene.getMeshByName(mobData.type)
    const hitBox = this.createHitBox(name)
    baseMesh.setParent(null)

    const clonedMesh = baseMesh.clone(`${name}_mesh`)
    clonedMesh.setParent(hitBox)
    clonedMesh.position.x = 0
    clonedMesh.position.y = 0
    clonedMesh.position.z = 0
    this.gridPosition = { x: 0, y: 0, z: 0 }
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
    this.gridPosition = { x, y, z }
    this.mesh.position.y = y + this.mobData.offsetY
    this.mesh.position.z = z
    this.mesh.position.x = x

    this.move()

    return this
  }

  move() {
    this.action = Actions.move
    const availableBlocks = this.getAvailableBlocks()

    if (availableBlocks.length === 0) {
      return
    }

    const { x, y, z } = availableBlocks[
      randomInt(Math.random, 0, availableBlocks.length - 1)
    ]

    this.remainingPath = this.game.world.graph.find(
      `${this.gridPosition.y}_${this.gridPosition.z}_${this.gridPosition.x}`,
      `${y}_${z}_${x}`,
    )
  }

  stay() {}

  private getAvailableBlocks() {
    const availableBlocks = []

    for (let y = this.gridPosition.y - 1; y <= this.gridPosition.y + 1; y++) {
      for (let z = this.gridPosition.z - 1; z <= this.gridPosition.z + 1; z++) {
        for (
          let x = this.gridPosition.x - 1;
          x <= this.gridPosition.x + 1;
          x++
        ) {
          if (
            (y === this.gridPosition.y &&
              x === this.gridPosition.x &&
              z === this.gridPosition.z) ||
            z < 1 ||
            x < 1 ||
            y < 1 ||
            z > this.game.world.map.length - 2 ||
            y > this.game.world.map.length - 2 ||
            x > this.game.world.map.length - 2
          ) {
            continue
          }

          const worldItem = this.game.world.map[y][z][x]
          const worldItemBelow = this.game.world.map[y - 1][z][x]

          if (this.checkFn(worldItem, worldItemBelow)) {
            availableBlocks.push({ x, y, z })
          }
        }
      }
    }

    return availableBlocks
  }

  private checkAir(worldItem) {
    return worldItem === 0
  }

  private checkWater(worldItem, worldItemBelow) {
    const isWater =
      worldItem !== 0 &&
      materialsByID[worldItem.split("_")[1]].groups.includes("water")

    const isWaterBelow =
      worldItemBelow !== 0 &&
      materialsByID[worldItemBelow.split("_")[1]].groups.includes("water")

    return (worldItem === 0 && isWaterBelow) || isWater
  }

  private checkLand(worldItem, worldItemBelow) {
    const material = String(worldItemBelow).split("_")[1]
    return (
      worldItem === 0 &&
      worldItemBelow !== 0 &&
      !materialsByID[material].groups.includes("water")
    )
  }

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
          this.game.mobs.delete(this)
          // !todo optimize this to quickly remove from array (or change array to object)
          this.game.world.mobs = this.game.world.mobs.filter(
            ({ mobData }) => mobData.id !== this.mobData.id,
          )
          saveWorld(this.game)
        } else {
          this.ticksToDie--
        }
      }

      if (this.remainingPath.length > 0 || this.remainingSteps > 0) {
        if (this.remainingSteps === 0) {
          const waypoint = this.remainingPath.shift()
          this.gridPosition.z = Math.round(this.gridPosition.z)
          this.gridPosition.y = Math.round(this.gridPosition.y)
          this.gridPosition.x = Math.round(this.gridPosition.x)

          this.velocityZ = waypoint.z - this.gridPosition.z
          this.velocityY = waypoint.y - this.gridPosition.y
          this.velocityX = waypoint.x - this.gridPosition.x

          this.remainingSteps = Math.round(1 / this.mobData.speed)
        }

        this.gridPosition.y += this.velocityY * this.mobData.speed
        this.gridPosition.z += this.velocityZ * this.mobData.speed
        this.gridPosition.x += this.velocityX * this.mobData.speed

        this.mesh.position.y += this.velocityY * this.mobData.speed
        this.mesh.position.z += this.velocityZ * this.mobData.speed
        this.mesh.position.x += this.velocityX * this.mobData.speed

        this.remainingSteps--
      } else {
        this.gridPosition.z = Math.round(this.gridPosition.z)
        this.gridPosition.y = Math.round(this.gridPosition.y)
        this.gridPosition.x = Math.round(this.gridPosition.x)

        this.move()
      }
    }
  }
}

export default Mob

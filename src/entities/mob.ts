import * as BABYLON from "babylonjs"
import { saveWorld } from "../save"
import { Environments, Behaviors } from "../world/mobsData"
import { materialsByID } from "../blocks/materials"
import { randomInt } from "../helpers/random"
import Bullet from "./bullet"

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
  private remainingPath: any[]
  private remainingSteps: number
  private velocityX: number
  private velocityY: number
  private velocityZ: number
  private remainingWait: number
  private continueMoving: boolean
  private actions: any[]
  private rotationSpeed: number
  private modelsMeta: any
  private speed: number
  private attackTicks: number
  private attacking: boolean

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
    this.continueMoving = false
    this.velocityX = 0
    this.velocityY = 0
    this.velocityZ = 0
    this.rotationSpeed = randomInt(Math.random, 6, 10) * 10
    this.modelsMeta = modelsMeta
    this.speed = this.mobData.speed
    this.attackTicks = 0
    this.attacking = false

    this.actions = [this.move, this.stay]

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
    this.continueMoving = Math.random() < this.mobData.mobility
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

  stay() {
    this.remainingWait = randomInt(Math.random, 20, 100)
  }

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

  attack() {
    if (
      this.game.hero &&
      this.game.hero.onLand &&
      this.mobData.behavior === Behaviors.aggressive
    ) {
      const isTargetInRange = this.checkIfTargetIsInRange(
        this.mesh.absolutePosition,
      )

      if (isTargetInRange) {
        this.rotateTowards(this.game.hero.mesh.position)
        this.attackTicks = 20
        this.game.bullets.set(
          new Bullet(
            this.scene,
            this.game,
            this.mesh,
            this.mobData.damage,
            this.mobData.attackSpeed,
          ),
        )
      } else {
        this.getInRange()
      }
    }
  }


  private rotateTowards(target) {
    const angle = -this.getAngleToTarget(target) + Math.PI / 2
    const axis = new BABYLON.Vector3(0, 1, 0)
    const quaternion = BABYLON.Quaternion.RotationAxis(axis, angle)
    this.mesh.rotationQuaternion = quaternion
  }

  private getAngleToTarget(target) {
    const angle = BABYLON.Angle.BetweenTwoPoints(
      new BABYLON.Vector2(this.mesh.position.x, this.mesh.position.z),
      new BABYLON.Vector2(target.x, target.z),
    )
    const rad = angle.radians()

    return rad
  }


  private getInRange() {
    const heroFieldId = `${Math.round(
      this.game.hero.mesh.position.y,
    )}_${Math.round(this.game.hero.mesh.position.z)}_${Math.round(
      this.game.hero.mesh.position.x,
    )}`

    const mobFieldId = `${Math.round(this.gridPosition.y)}_${Math.round(
      this.gridPosition.z,
    )}_${Math.round(this.gridPosition.x)}`

    const steps = this.game.world.graph
      .find(mobFieldId, heroFieldId)
      .slice(0, -1)

    for (let i = 0; i < steps.length; i++) {
      const from = new BABYLON.Vector3(steps[i].x, steps[i].y, steps[i].z)
      const isTargetInRange = this.checkIfTargetIsInRange(from)
      if (isTargetInRange) {
        this.remainingPath = steps.slice(0, i + 1)
        break
      }
    }
  }

  private checkIfTargetIsInRange(from) {
    const pickingRay = BABYLON.Ray.CreateNewFromTo(
      from,
      this.game.hero.mesh.absolutePosition,
    )

    const hit = this.scene.pickWithRay(pickingRay, (mesh) => {
      const meta = this.modelsMeta.get(mesh)
      return mesh.isPickable && (meta === undefined || meta.type === "hero")
    })

    return hit.pickedMesh === this.game.hero.mesh
  }

  render() {
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

          this.remainingSteps = Math.round(1 / this.speed)

          this.rotateTowards(new BABYLON.Vector3(waypoint.x, waypoint.y, waypoint.z))
        }

        this.gridPosition.y += this.velocityY * this.speed
        this.gridPosition.z += this.velocityZ * this.speed
        this.gridPosition.x += this.velocityX * this.speed

        this.mesh.position.y += this.velocityY * this.speed
        this.mesh.position.z += this.velocityZ * this.speed
        this.mesh.position.x += this.velocityX * this.speed

        this.remainingSteps--
      } else if (this.remainingWait > 0) {
        this.mesh.rotate(
          BABYLON.Axis.Y,
          Math.PI / this.rotationSpeed,
          BABYLON.Space.LOCAL,
        )

        this.remainingWait--
      } else if (this.attackTicks !== 0) {
        this.attackTicks--
      } else {
        this.gridPosition.z = Math.round(this.gridPosition.z)
        this.gridPosition.y = Math.round(this.gridPosition.y)
        this.gridPosition.x = Math.round(this.gridPosition.x)

        const action = randomInt(Math.random, 0, 2)

        if (this.continueMoving) {
          this.move()
          return
        }

        if (this.mobData.behavior === Behaviors.aggressive) {
          const distanceToHero = this.game.hero.mesh.position
            .subtract(this.mesh.position)
            .length()

          if (distanceToHero <= this.mobData.sight) {
            this.speed = this.mobData.runSpeed
            this.attack()
            return
          }
        }

        this.speed = this.mobData.speed

        switch (action) {
          case Actions.move:
            this.move()
            break
          case Actions.stay:
            this.stay()
            break
        }
      }
    }
  }
}

export default Mob

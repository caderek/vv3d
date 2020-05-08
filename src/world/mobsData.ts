enum Behaviors {
  aggressive,
  peaceful,
  defensive,
}

enum Environments {
  land,
  water,
  air,
}

const mobsData = [
  {
    type: "andy",
    offsetY: -0.2,
    environment: Environments.land,
    behavior: Behaviors.aggressive,
    speed: 1,
    sight: 10,
    damage: 1,
    health: 10,
  },
  {
    type: "john",
    offsetY: 0.2,
    environment: Environments.air,
    behavior: Behaviors.aggressive,
    speed: 1,
    sight: 10,
    damage: 1,
    health: 20,
  },
  {
    type: "bobby",
    offsetY: -0.3,
    environment: Environments.water,
    behavior: Behaviors.aggressive,
    speed: 1,
    sight: 10,
    damage: 1,
    health: 5,
  },
]

export { Environments }
export default mobsData

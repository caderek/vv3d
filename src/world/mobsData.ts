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
    behavior: Behaviors.peaceful,
    speed: 0.05,
    runSpeed: 0.1,
    attackSpeed: 0.2,
    sight: 10,
    damage: 1,
    health: 10,
    mobility: 0.5,
  },
  {
    type: "john",
    offsetY: 0.2,
    environment: Environments.air,
    behavior: Behaviors.aggressive,
    speed: 0.05,
    runSpeed: 0.1,
    attackSpeed: 0.2,
    sight: 10,
    damage: 5,
    health: 20,
    mobility: 0.8,
  },
  {
    type: "bobby",
    offsetY: -0.3,
    environment: Environments.water,
    behavior: Behaviors.peaceful,
    speed: 0.025,
    runSpeed: 0.1,
    attackSpeed: 0.2,
    sight: 10,
    damage: 1,
    health: 5,
    mobility: 0.6,
  },
]

export { Environments, Behaviors }
export default mobsData

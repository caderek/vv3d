import { blocksValues } from "../blocks"
import * as SimplexNoise from "simplex-noise"

console.log(SimplexNoise)

const randomToInt = (num, min, max) => {
  return Math.floor(num * (max - min + 1)) + min
}

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const createResourceWorld = () => {
  const size = randomInt(3, 15)
  const availableBlocks = blocksValues.filter(({ groups }) =>
    groups.includes("resource"),
  )

  let world = []
  for (let y = 0; y < size; y++) {
    world.push([])

    for (let z = 0; z < size; z++) {
      world[y].push([])

      for (let x = 0; x < size; x++) {
        const randomIndex = randomInt(0, availableBlocks.length - 1)
        world[y][z].push({ type: availableBlocks[randomIndex].name })
      }
    }
  }

  return world
}

const createDumpWorld = () => {
  const size = randomInt(3, 15)
  const availableBlocks = blocksValues.filter(({ groups }) =>
    groups.includes("processed"),
  )

  let world = []
  for (let y = 0; y < size; y++) {
    world.push([])

    for (let z = 0; z < size; z++) {
      world[y].push([])

      for (let x = 0; x < size; x++) {
        const randomIndex = randomInt(0, availableBlocks.length - 1)
        world[y][z].push({ type: availableBlocks[randomIndex].name })
      }
    }
  }

  return world
}

const createCavedWorld = () => {
  const size = 12 //randomInt(3, 15)

  const simplex = new SimplexNoise("seed")

  const strength = randomInt(0, 5)
  console.log({ strength })

  let world = []
  for (let y = 0; y < size; y++) {
    world.push([])

    for (let z = 0; z < size; z++) {
      world[y].push([])

      for (let x = 0; x < size; x++) {
        const isEmpty = simplex.noise3D(y, z, x) > 0

        if (!isEmpty) {
          world[y][z].push({ type: "stone-darkgray" })
        } else {
          world[y][z].push({ type: null })
        }
      }
    }
  }

  return world
}

const createNatureWorld = () => {
  const size = randomInt(3, 10) * 2
  console.log({ size })
  const hasWater = Math.random() > 0.5
  const hasGrass = Math.random() > 0.5 && hasWater
  const hasCaves = Math.random() > 0.5

  const resourceBlocks = blocksValues
    .filter(({ groups }) => groups.includes("resource"))
    .map((item) => item.id)
  const crystalBlocks = blocksValues
    .filter(({ groups }) => groups.includes("crystal"))
    .map((item) => item.id)
  const bioBlocks = blocksValues
    .filter(({ groups }) => groups.includes("bio"))
    .map((item) => item.id)
  const liquidBlocks = blocksValues
    .filter(({ groups }) => groups.includes("water"))
    .map((item) => item.id)

  const liquid = liquidBlocks[randomInt(0, liquidBlocks.length - 1)]
  const grass = bioBlocks[randomInt(0, bioBlocks.length - 1)]

  const availableBlocks = []

  const variety = randomInt(1, 10)
  console.log({ variety })

  for (let i = 0; i < variety; i++) {
    const threshold = i == 0 ? 0.01 : 0.1
    const group = Math.random() > threshold ? resourceBlocks : crystalBlocks
    availableBlocks.push(group[randomInt(0, group.length - 1)])
  }

  const simplex = new SimplexNoise(Math.random())

  const strength = randomInt(0, 5)
  console.log({ strength })

  const heights = []

  for (let z = 0; z < size; z++) {
    heights.push([])

    for (let x = 0; x < size; x++) {
      const factor = simplex.noise2D(z, x)
      const delta = randomToInt(factor, 0, strength)
      heights[z].push(Math.round(size / 2 + delta))
    }
  }

  let world = []

  for (let y = 0; y < size; y++) {
    world.push([])

    for (let z = 0; z < size; z++) {
      world[y].push([])

      for (let x = 0; x < size; x++) {
        const height = heights[z][x]
        const rand = simplex.noise3D(y, z, x)
        const isEmpty = rand < 0 && hasCaves

        if (y < height && !isEmpty) {
          const index = randomToInt(
            Math.abs(rand),
            0,
            availableBlocks.length - 1,
          )

          world[y][z].push(availableBlocks[index])
        } else if (y === height && !isEmpty && hasGrass) {
          world[y][z].push(grass)
        } else if (y < size / 2 && hasWater) {
          world[y][z].push(liquid)
        } else {
          world[y][z].push(null)
        }
      }
    }
  }

  return world
}

const createRandomWorld = () => {
  return createNatureWorld()
}

export default createRandomWorld

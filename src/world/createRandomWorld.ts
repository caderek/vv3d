import { blocksValues } from "../blocks"
import * as SimplexNoise from "simplex-noise"
import seedrandom from "seedrandom"

const randomToInt = (num, min, max) => {
  return Math.floor(num * (max - min + 1)) + min
}

const randomInt = (rng, min, max) => {
  return Math.floor(rng() * (max - min + 1)) + min
}

const createResourceWorld = (rng) => {
  const size = randomInt(rng, 5, 15)
  const availableBlocks = blocksValues.filter(({ groups }) =>
    groups.includes("resource"),
  )

  let world = []
  for (let y = 0; y < size; y++) {
    world.push([])

    for (let z = 0; z < size; z++) {
      world[y].push([])

      for (let x = 0; x < size; x++) {
        const randomIndex = randomInt(rng, 0, availableBlocks.length - 1)
        world[y][z].push(availableBlocks[randomIndex].id)
      }
    }
  }

  return world
}

const createDumpWorld = (rng) => {
  const size = randomInt(rng, 3, 15)
  const availableBlocks = blocksValues.filter(({ groups }) =>
    groups.includes("processed"),
  )

  let world = []
  for (let y = 0; y < size; y++) {
    world.push([])

    for (let z = 0; z < size; z++) {
      world[y].push([])

      for (let x = 0; x < size; x++) {
        const randomIndex = randomInt(rng, 0, availableBlocks.length - 1)
        world[y][z].push(availableBlocks[randomIndex].id)
      }
    }
  }

  return world
}

const createNatureWorld = (rng) => {
  const size = randomInt(rng, 4, 10) * 2

  const availableChunks = []

  for (let i = 1; i <= size / 3; i++) {
    if (size % i === 0) {
      availableChunks.push(i)
    }
  }

  const chunkSize =
    availableChunks[randomInt(rng, 0, availableChunks.length - 1)]

  const hasWater = rng() > 0.5
  const hasGrass = rng() > 0.5 && hasWater
  const hasCaves = rng() > 0.5

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

  const liquid = liquidBlocks[randomInt(rng, 0, liquidBlocks.length - 1)]
  const grass = bioBlocks[randomInt(rng, 0, bioBlocks.length - 1)]

  const availableBlocks = []

  const variety = randomInt(rng, 1, 10)

  for (let i = 0; i < variety; i++) {
    const threshold = i == 0 ? 0.01 : 0.1
    const group = rng() > threshold ? resourceBlocks : crystalBlocks
    availableBlocks.push(group[randomInt(rng, 0, group.length - 1)])
  }

  const simplex = new SimplexNoise(rng)

  const amplitude = randomInt(rng, 0, 5)

  const horizon = randomInt(rng, 3, Math.floor(0.6 * size))

  const heights = []
  let a
  let b

  for (let z = 0; z < size; z++) {
    heights.push([])
    a = z === 0 ? 0 : z % chunkSize === 0 ? a + 1 : a

    for (let x = 0; x < size; x++) {
      b = x === 0 ? 0 : x % chunkSize === 0 ? b + 1 : b

      const factor = simplex.noise2D(a, b)
      const delta = randomToInt(factor, 0, amplitude)
      const baseHeight = Math.round(horizon + delta)
      const height = baseHeight > size ? size : baseHeight < 1 ? 1 : baseHeight
      heights[z].push(height)
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
        } else if (
          y === height &&
          !isEmpty &&
          hasGrass &&
          (y >= horizon || !hasWater)
        ) {
          world[y][z].push(grass)
        } else if (y < (hasGrass ? horizon : horizon - 1) && hasWater) {
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
  const seed = Math.random()
  const rng = seedrandom(seed)
  const rand = rng()
  const generator =
    rand < 0.01
      ? createResourceWorld
      : rand > 0.99
      ? createDumpWorld
      : createNatureWorld

  return generator(rng)
}

export default createRandomWorld

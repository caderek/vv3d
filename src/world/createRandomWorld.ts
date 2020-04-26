import { blocksValues } from "../blocks"
// @ts-ignore
import * as SimplexNoise from "simplex-noise"
// @ts-ignore
import seedrandom from "seedrandom"

const randomToInt = (num, min, max) => {
  return Math.floor(num * (max - min + 1)) + min
}

const randomInt = (rng, min, max) => {
  return Math.floor(rng() * (max - min + 1)) + min
}

const randomName = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lettersLength = randomInt(Math.random, 3, 5)
  const numbersLength = randomInt(Math.random, 2, 5)

  let name = ""

  for (let i = 0; i < lettersLength; i++) {
    name += alphabet[randomInt(Math.random, 0, alphabet.length - 1)]
  }

  name += "-"

  for (let i = 0; i < numbersLength; i++) {
    name += randomInt(Math.random, 0, 9)
  }

  return name
}

const createNatureWorld = (rng) => {
  const size = 16 //randomInt(rng, 4, 6) * 2

  const availableChunks = []

  for (let i = 1; i <= size / 2; i++) {
    if (size % i === 0) {
      availableChunks.push(i)
    }
  }

  availableChunks.slice(1, -1).forEach((size) => availableChunks.push(size))

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

  let map = []

  for (let y = 0; y < size + 2; y++) {
    map.push([])

    for (let z = 0; z < size + 2; z++) {
      map[y].push([])

      for (let x = 0; x < size + 2; x++) {
        if (
          x === 0 ||
          x === size + 1 ||
          z === 0 ||
          z === size + 1 ||
          y >= size
        ) {
          map[y][z].push(null)
          continue
        }

        // world[y][z].push(10)
        // continue

        const height = heights[z - 1][x - 1]
        const rand = simplex.noise3D(y, z, x)
        const isEmpty = rand < 0 && hasCaves

        if (y < height && !isEmpty) {
          const index = randomToInt(
            Math.abs(rand),
            0,
            availableBlocks.length - 1,
          )

          map[y][z].push(availableBlocks[index])
        } else if (
          y === height &&
          !isEmpty &&
          hasGrass &&
          (y >= horizon || !hasWater)
        ) {
          map[y][z].push(grass)
        } else if (y < (hasGrass ? horizon : horizon - 1) && hasWater) {
          map[y][z].push(liquid)
        } else {
          map[y][z].push(null)
        }
      }
    }
  }

  return map
}

const createRandomWorld = () => {
  const name = randomName()
  const seed = name
  const rng = seedrandom(seed)
  const generator = createNatureWorld

  return { map: generator(rng), data: { name } }
}

export default createRandomWorld

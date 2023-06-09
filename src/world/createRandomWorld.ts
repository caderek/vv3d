import { materialEntries, materialsByID, leafsIds } from "../blocks/materials"
import { plants } from "../blocks/shapes"
// @ts-ignore
import * as SimplexNoise from "simplex-noise"
// @ts-ignore
import seedrandom from "seedrandom"
import getFirstEmptyField from "../helpers/getFirstEmptyField"
import mobsData, { Environments } from "./mobsData"
import fragments from "./fragments"

const treeModels = {
  cube: fragments.filter((fragment) => fragment.type === "tree-leafs-cube"),
  slope: fragments.filter((fragment) => fragment.type === "tree-leafs-slope"),
}
const treeTypes = ["cube", "cube", "slope"]

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

  const minChunkSize = rng() > 0.9 ? 1 : 2

  for (let i = minChunkSize; i <= size / 2; i++) {
    if (size % i === 0) {
      availableChunks.push(i)
    }
  }

  availableChunks.slice(1, -1).forEach((size) => availableChunks.push(size))

  const chunkSize =
    availableChunks[randomInt(rng, 0, availableChunks.length - 1)]

  const hasLiquid = rng() > 0.5
  const hasWater = hasLiquid && rng() > 0.2
  const hasGrass = rng() > 0.5 && hasWater
  const hasCaves = rng() > 0.5
  const lifeRand = rng()
  const hasLife = hasGrass
    ? lifeRand > 0.3
    : hasWater
    ? lifeRand > 0.5
    : lifeRand > 0.9

  const resourceMaterials = materialEntries
    .filter(({ groups }) => groups.includes("stone"))
    .map((item) => item.id)
  const crystalMaterials = materialEntries
    .filter(({ groups }) => groups.includes("crystal"))
    .map((item) => item.id)
  const bioMaterials = materialEntries
    .filter(({ groups }) => groups.includes("bio"))
    .map((item) => item.id)
  const liquidMaterials = materialEntries
    .filter(({ groups }) =>
      hasWater
        ? groups.includes("water")
        : groups.includes("liquid") && !groups.includes("water"),
    )
    .map((item) => item.id)

  const liquid = liquidMaterials[randomInt(rng, 0, liquidMaterials.length - 1)]
  const grass = bioMaterials[randomInt(rng, 0, bioMaterials.length - 1)]

  const availableMaterials = []

  const variety = randomInt(rng, 1, 10)

  for (let i = 0; i < variety; i++) {
    const threshold = i == 0 ? 0.001 : 0.05
    const group = rng() > threshold ? resourceMaterials : crystalMaterials
    availableMaterials.push(group[randomInt(rng, 0, group.length - 1)])
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
  const availableForPlants = []

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
          map[y][z].push(0)
          continue
        }

        // if (y === 1) {
        //   map[y][z].push(`1_3`)
        //   continue
        // } else {
        //   map[y][z].push(0)
        //   continue
        // }

        const height = heights[z - 1][x - 1]
        const rand = simplex.noise3D(y, z, x)
        const isEmpty = rand < 0 && hasCaves

        if (y < height && !isEmpty) {
          const index = randomToInt(
            Math.abs(rand),
            0,
            availableMaterials.length - 1,
          )

          map[y][z].push(`1_${availableMaterials[index]}`)
        } else if (
          y === height &&
          !isEmpty &&
          hasGrass &&
          (y >= horizon || !hasLiquid)
        ) {
          availableForPlants.push([y + 1, z, x])
          map[y][z].push(`1_${grass}`)
        } else if (y < (hasGrass ? horizon : horizon - 1) && hasLiquid) {
          map[y][z].push(`1_${liquid}`)
        } else {
          map[y][z].push(0)
        }
      }
    }
  }

  return { map, hasLife, availableForPlants, grass, hasGrass }
}

const addPlants = (rng, map, mobs, availableForPlants, grass) => {
  const numberOfTrees = randomInt(rng, 1, 20)
  const trees = []
  const leafsId = leafsIds[randomInt(rng, 0, leafsIds.length - 1)] as string
  const leafsColor = leafsId.slice(-1)
  const treeType = treeTypes[randomInt(rng, 0, treeTypes.length - 1)]

  const plantsPallets = Object.fromEntries(
    plants.map((plant) => {
      return [
        plant.id,
        plant.pallets[randomInt(rng, 0, plant.pallets.length - 1)].map((item) =>
          item === null ? `16${leafsColor}` : item,
        ),
      ]
    }),
  )

  for (let i = 0; i < numberOfTrees; i++) {
    const rand = randomInt(rng, 0, treeModels[treeType].length - 1)
    trees.push(treeModels[treeType][rand])
  }

  const bookedPlaces = new Set(mobs.map(({ z, x }) => `${z}_${x}`))

  availableForPlants.forEach(([y, z, x]) => {
    const rand = rng()
    let item = null

    if (rand > 0.6) {
      item = `40_${grass}`
    } else if (rand > 0.45) {
      const plant = plants[randomInt(rng, 0, plants.length - 1)]
      const palette = plantsPallets[plant.id]
      item = `${plant.id}_${palette.join(".")}`
    }

    if (item !== null) {
      map[y][z][x] = `${item}_${randomInt(rng, 0, 3)}`

      bookedPlaces.add(`${z}_${x}`)
    }
  })

  trees.forEach((tree) => {
    const place =
      availableForPlants[randomInt(rng, 0, availableForPlants.length - 1)]

    if (
      !bookedPlaces.has(`${place[1]}_${place[2]}`) &&
      place[0] + tree.height - 1 < map.length - 2 &&
      place[1] + tree.depth - tree.center[0] - 1 < map.length - 1 &&
      place[1] - tree.center[0] > 0 &&
      place[2] + tree.width - tree.center[1] - 1 < map.length - 1 &&
      place[2] - tree.center[1] > 0
    ) {
      const [centerY, centerZ, centerX] = place
      const startY = centerY
      const startZ = centerZ - tree.center[0]
      const startX = centerX - tree.center[1]

      for (let y = startY, yy = 0; y < startY + tree.height; y++, yy++) {
        for (let z = startZ, zz = 0; z < startZ + tree.depth; z++, zz++) {
          for (let x = startX, xx = 0; x < startX + tree.width; x++, xx++) {
            map[y][z][x] =
              tree.fragment[yy][zz][xx] === 0
                ? 0
                : tree.fragment[yy][zz][xx].replace("{leafs}", leafsId)
          }
        }
      }

      for (let z = startZ - 1; z < startZ + tree.depth + 1; z++) {
        for (let x = startX - 1; x < startX + tree.width + 1; x++) {
          bookedPlaces.add(`${z}_${x}`)
        }
      }
    }
  })

  return { plantsMaterial: `16${leafsColor}` }
}

const generateMobs = (rng, map) => {
  const amount = randomInt(rng, 3, 15)
  let mobs = []

  const spawnPoints = {
    land: [],
    water: [],
  }

  for (let z = 1; z < map.length - 1; z++) {
    for (let x = 1; x < map.length - 1; x++) {
      // Exclude hero and bot positions
      if ((z === 1 && x === 9) || (z === 1 && x === 8)) {
        continue
      }

      const y = getFirstEmptyField(map, z, x) - 1

      if (y > 0) {
        const blockMaterial = map[y][z][x].split("_")[1]
        const isWater = materialsByID[blockMaterial].groups.includes("water")
        spawnPoints[isWater ? "water" : "land"].push({ y: y + 1, z, x })
      }
    }
  }

  for (let i = 0; i < amount; i++) {
    const mobData = {
      ...mobsData[randomInt(rng, 0, mobsData.length - 1)],
      id: i,
    }

    const spawns =
      mobData.environment === Environments.land
        ? spawnPoints.land
        : mobData.environment === Environments.water
        ? spawnPoints.water
        : rng() > 0.5
        ? spawnPoints.land
        : spawnPoints.water

    const index = randomInt(rng, 0, spawns.length)
    const point = spawns.splice(index, 1)[0]

    if (point) {
      mobs.push({ mobData, ...point })
    }
  }

  return mobs
}

const createRandomWorld = () => {
  const name = randomName()
  const seed = name
  const rng = seedrandom(seed)
  const generator = createNatureWorld
  const { map, hasLife, availableForPlants, grass, hasGrass } = generator(rng)
  const mobs = hasLife ? generateMobs(rng, map) : []
  let plantsMaterial = null

  if (availableForPlants.length > 0) {
    plantsMaterial = addPlants(rng, map, mobs, availableForPlants, grass)
      .plantsMaterial
  }

  return {
    map,
    data: { name, plantsMaterial, grassMaterial: hasGrass ? grass : null },
    mobs,
  }
}

export default createRandomWorld

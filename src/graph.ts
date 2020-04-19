import createGraph from "ngraph.graph"
import path from "ngraph.path"

const perpendicularWeight = 1
const diagonalWeight2d = Math.sqrt(2)
const diagonalWeight3d = Math.sqrt(3)

const increments = [
  { z: 1, y: 0, x: 0 },
  { z: -1, y: 0, x: 0 },
  { z: 0, y: 0, x: 1 },
  { z: 0, y: 0, x: -1 },
  { z: 0, y: 1, x: 0 },
  { z: 0, y: -1, x: 0 },
]

const elo = []

const diagonals2d = [
  {
    inc: { z: 1, y: 0, x: 1 },
    neighbors: [increments[2], increments[0]],
  },
  {
    inc: { z: -1, y: 0, x: -1 },
    neighbors: [increments[3], increments[1]],
  },
  {
    inc: { z: 1, y: 0, x: -1 },
    neighbors: [increments[3], increments[0]],
  },
  {
    inc: { z: -1, y: 0, x: 1 },
    neighbors: [increments[2], increments[1]],
  },

  {
    inc: { z: 0, y: 1, x: 1 },
    neighbors: [increments[2], increments[4]],
  },
  {
    inc: { z: 0, y: -1, x: -1 },
    neighbors: [increments[3], increments[5]],
  },
  {
    inc: { z: 0, y: 1, x: -1 },
    neighbors: [increments[4], increments[3]],
  },
  {
    inc: { z: 0, y: -1, x: 1 },
    neighbors: [increments[5], increments[2]],
  },

  {
    inc: { z: 1, y: 1, x: 0 },
    neighbors: [increments[0], increments[4]],
  },
  {
    inc: { z: -1, y: -1, x: 0 },
    neighbors: [increments[1], increments[5]],
  },
  {
    inc: { z: -1, y: 1, x: 0 },
    neighbors: [increments[1], increments[4]],
  },
  {
    inc: { z: 1, y: -1, x: 0 },
    neighbors: [increments[0], increments[5]],
  },
]

const diagonals3d = [
  {
    inc: { z: 1, y: 1, x: 1 },
    neighbors: [
      { z: 1, y: 0, x: 1 },
      { z: 0, y: 0, x: 1 },
      { z: 1, y: 0, x: 0 },
      { z: 1, y: 1, x: 0 },
      { z: 0, y: 1, x: 1 },
      { z: 0, y: 1, x: 0 },
    ],
  },
  {
    inc: { z: -1, y: 1, x: 1 },
    neighbors: [
      { z: -1, y: 0, x: 1 },
      { z: 0, y: 0, x: 1 },
      { z: -1, y: 0, x: 0 },
      { z: -1, y: 1, x: 0 },
      { z: 0, y: 1, x: 1 },
      { z: 0, y: 1, x: 0 },
    ],
  },
  {
    inc: { z: 1, y: 1, x: -1 },
    neighbors: [
      { z: 1, y: 0, x: -1 },
      { z: 0, y: 0, x: -1 },
      { z: 1, y: 0, x: 0 },
      { z: 1, y: 1, x: 0 },
      { z: 0, y: 1, x: -1 },
      { z: 0, y: 1, x: 0 },
    ],
  },
  {
    inc: { z: -1, y: 1, x: -1 },
    neighbors: [
      { z: -1, y: 0, x: -1 },
      { z: 0, y: 0, x: -1 },
      { z: -1, y: 0, x: 0 },
      { z: -1, y: 1, x: 0 },
      { z: 0, y: 1, x: -1 },
      { z: 0, y: 1, x: 0 },
    ],
  },

  {
    inc: { z: 1, y: -1, x: 1 },
    neighbors: [
      { z: 1, y: 0, x: 1 },
      { z: 0, y: 0, x: 1 },
      { z: 1, y: 0, x: 0 },
      { z: 1, y: -1, x: 0 },
      { z: 0, y: -1, x: 1 },
      { z: 0, y: -1, x: 0 },
    ],
  },
  {
    inc: { z: -1, y: -1, x: 1 },
    neighbors: [
      { z: -1, y: 0, x: 1 },
      { z: 0, y: 0, x: 1 },
      { z: -1, y: 0, x: 0 },
      { z: -1, y: -1, x: 0 },
      { z: 0, y: -1, x: 1 },
      { z: 0, y: -1, x: 0 },
      { z: 0, y: -1, x: 0 },
    ],
  },
  {
    inc: { z: 1, y: -1, x: -1 },
    neighbors: [
      { z: 1, y: 0, x: -1 },
      { z: 0, y: 0, x: -1 },
      { z: 1, y: 0, x: 0 },
      { z: 1, y: -1, x: 0 },
      { z: 0, y: -1, x: -1 },
      { z: 0, y: -1, x: 0 },
    ],
  },
  {
    inc: { z: -1, y: -1, x: -1 },
    neighbors: [
      { z: -1, y: 0, x: -1 },
      { z: 0, y: 0, x: -1 },
      { z: -1, y: 0, x: 0 },
      { z: -1, y: -1, x: 0 },
      { z: 0, y: -1, x: -1 },
      { z: 0, y: -1, x: 0 },
    ],
  },
]

class WorldGraph {
  private pathFinder: any
  private world: any

  constructor(world) {
    this.world = world

    const graph = createGraph()
    const size = world.length

    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        for (let x = 0; x < size; x++) {
          if (world[y][z][x] === null) {
            const base = { x, y, z }

            graph.addNode(`${y}_${z}_${x}`, { y, z, x })

            increments.forEach((inc) => {
              const { isEmpty, zz, yy, xx } = this.checkTarget(base, inc)

              if (isEmpty) {
                graph.addLink(`${y}_${z}_${x}`, `${yy}_${zz}_${xx}`, {
                  weight: perpendicularWeight,
                })
              }
            })

            diagonals2d.forEach(({ inc, neighbors }) => {
              const { isEmpty, zz, yy, xx } = this.checkTarget(base, inc)
              const areNeighborsEmpty = neighbors
                .map((inc) => this.checkTarget(base, inc).isEmpty)
                .every((isEmpty) => isEmpty)

              if (isEmpty && areNeighborsEmpty) {
                graph.addLink(`${y}_${z}_${x}`, `${yy}_${zz}_${xx}`, {
                  weight: diagonalWeight2d,
                })
              }
            })

            diagonals3d.forEach(({ inc, neighbors }) => {
              const { isEmpty, zz, yy, xx } = this.checkTarget(base, inc)
              const areNeighborsEmpty = neighbors
                .map((inc) => {
                  if (base.x === 1 && base.y === 1 && base.z === 1) {
                    console.log({
                      base,
                      inc,
                      isEmpty: this.checkTarget(base, inc).isEmpty,
                    })
                  }
                  return this.checkTarget(base, inc).isEmpty
                })
                .every((isEmpty) => isEmpty)

              if (isEmpty && areNeighborsEmpty) {
                graph.addLink(`${y}_${z}_${x}`, `${yy}_${zz}_${xx}`, {
                  weight: diagonalWeight3d,
                })
              }
            })
          }
        }
      }
    }

    this.pathFinder = path.nba(graph, {
      distance(fromNode, toNode, link) {
        return link.data.weight
      },
    })
  }

  private checkTarget(base, inc) {
    const yy = base.y + inc.y
    const zz = base.z + inc.z
    const xx = base.x + inc.x

    return { isEmpty: this.world?.[yy]?.[zz]?.[xx] === null, yy, zz, xx }
  }

  find(from, to) {
    const path = this.pathFinder
      .find(from, to)
      .map((node) => node.data)
      .reverse()
      .slice(1)

    return path
  }
}

export default WorldGraph

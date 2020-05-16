// @ts-ignore
import createGraph from "ngraph.graph"
// @ts-ignore
import Path from "ngraph.path"
import { materialsByID } from "../blocks/materials"
import { shapesByID } from "../blocks/shapes"

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

const allNeighbors = [
  ...increments,

  { z: 1, y: 1, x: 1 },
  { z: -1, y: 1, x: -1 },
  { z: -1, y: 1, x: 1 },
  { z: 1, y: 1, x: -1 },

  { z: 1, y: -1, x: 1 },
  { z: -1, y: -1, x: -1 },
  { z: -1, y: -1, x: 1 },
  { z: 1, y: -1, x: -1 },

  { z: 1, y: 0, x: 1 },
  { z: -1, y: 0, x: -1 },
  { z: -1, y: 0, x: 1 },
  { z: 1, y: 0, x: -1 },

  { z: 0, y: 1, x: 1 },
  { z: 0, y: -1, x: -1 },
  { z: 0, y: 1, x: -1 },
  { z: 0, y: -1, x: 1 },

  { z: 1, y: 1, x: 0 },
  { z: -1, y: -1, x: 0 },
  { z: -1, y: 1, x: 0 },
  { z: 1, y: -1, x: 0 },
]

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
  private game: any
  private graph: any

  constructor(game) {
    this.game = game
    this.create()
  }

  create() {
    this.graph = createGraph()

    const size = this.game.world.size

    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        for (let x = 0; x < size; x++) {
          this.addPaths(y, z, x)
        }
      }
    }
  }

  private isPenetrable(worldItem) {
    if (worldItem === undefined) {
      return false
    }

    if (worldItem === 0) {
      return true
    }

    const [shape, material] = worldItem.split("_")

    return (
      materialsByID[material].groups.includes("water") ||
      shapesByID[shape].penetrable
    )
  }

  private checkTarget(base, inc) {
    const yy = base.y + inc.y
    const zz = base.z + inc.z
    const xx = base.x + inc.x

    return {
      isEmpty: this.isPenetrable(this.game.world.map?.[yy]?.[zz]?.[xx]),
      yy,
      zz,
      xx,
    }
  }

  private addPaths(y, z, x) {
    if (this.isPenetrable(this.game.world.map?.[y]?.[z]?.[x])) {
      const base = { x, y, z }

      this.graph.addNode(`${y}_${z}_${x}`, { y, z, x })

      increments.forEach((inc) => {
        const { isEmpty, zz, yy, xx } = this.checkTarget(base, inc)

        if (isEmpty) {
          this.graph.addLink(`${y}_${z}_${x}`, `${yy}_${zz}_${xx}`, {
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
          this.graph.addLink(`${y}_${z}_${x}`, `${yy}_${zz}_${xx}`, {
            weight: diagonalWeight2d,
          })
        }
      })

      diagonals3d.forEach(({ inc, neighbors }) => {
        const { isEmpty, zz, yy, xx } = this.checkTarget(base, inc)
        const areNeighborsEmpty = neighbors
          .map((inc) => {
            return this.checkTarget(base, inc).isEmpty
          })
          .every((isEmpty) => isEmpty)

        if (isEmpty && areNeighborsEmpty) {
          this.graph.addLink(`${y}_${z}_${x}`, `${yy}_${zz}_${xx}`, {
            weight: diagonalWeight3d,
          })
        }
      })
    }
  }

  private removePaths(y, z, x) {
    if (this.isPenetrable(this.game.world.map?.[y]?.[z]?.[x])) {
      const base = { x, y, z }

      increments.forEach((inc) => {
        const { isEmpty, zz, yy, xx } = this.checkTarget(base, inc)

        if (!isEmpty) {
          const link = this.graph.getLink(`${y}_${z}_${x}`, `${yy}_${zz}_${xx}`)

          this.graph.removeLink(link)
        }
      })

      diagonals2d.forEach(({ inc, neighbors }) => {
        const { isEmpty, zz, yy, xx } = this.checkTarget(base, inc)
        const areNeighborsEmpty = neighbors
          .map((inc) => this.checkTarget(base, inc).isEmpty)
          .every((isEmpty) => isEmpty)

        if (!isEmpty || !areNeighborsEmpty) {
          const link = this.graph.getLink(`${y}_${z}_${x}`, `${yy}_${zz}_${xx}`)

          this.graph.removeLink(link)
        }
      })

      diagonals3d.forEach(({ inc, neighbors }) => {
        const { isEmpty, zz, yy, xx } = this.checkTarget(base, inc)
        const areNeighborsEmpty = neighbors
          .map((inc) => {
            return this.checkTarget(base, inc).isEmpty
          })
          .every((isEmpty) => isEmpty)

        if (!isEmpty || !areNeighborsEmpty) {
          const link = this.graph.getLink(`${y}_${z}_${x}`, `${yy}_${zz}_${xx}`)

          this.graph.removeLink(link)
        }
      })
    }
  }

  add(y, z, x) {
    this.addPaths(y, z, x)
  }

  remove(y, z, x) {
    console.log("removed node:", `${y}_${z}_${x}`)
    this.graph.removeNode(`${y}_${z}_${x}`)
    allNeighbors.forEach((inc) => {
      this.removePaths(y + inc.y, z + inc.z, x + inc.x)
    })
  }

  find(from, to) {
    if (!this.graph.hasNode(from) || !this.graph.hasNode(to)) {
      return []
    }

    const pathFinder = Path.nba(this.graph, {
      distance(_, __, link) {
        return link.data.weight
      },
    })

    const path = pathFinder
      .find(from, to)
      .map((node) => node.data)
      .reverse()
      .slice(1)

    return path
  }
}

export default WorldGraph

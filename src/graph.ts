import createGraph from "ngraph.graph"
import path from "ngraph.path"

const increments = [
  { z: 1, y: 0, x: 0 },
  { z: -1, y: 0, x: 0 },
  { z: 0, y: 0, x: 1 },
  { z: 0, y: 0, x: -1 },
  { z: 0, y: 1, x: 0 },
  { z: 0, y: -1, x: 0 },
]

class WorldGraph {
  private pathFinder: any

  constructor(world) {
    const graph = createGraph()
    const size = world.length
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        for (let x = 0; x < size; x++) {
          if (world[y][z][x] === null) {
            graph.addNode(`${y}_${z}_${x}`, { y, z, x })
            increments.forEach((inc) => {
              const yy = y + inc.y
              const zz = z + inc.z
              const xx = x + inc.x

              if (world?.[yy]?.[zz]?.[xx] === null) {
                graph.addLink(`${y}_${z}_${x}`, `${yy}_${zz}_${xx}`)
              }
            })
          }
        }
      }
    }

    //@ts-ignore
    this.pathFinder = path.nba(graph)
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

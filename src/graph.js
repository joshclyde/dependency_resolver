const doUpdate = node => console.log(JSON.stringify(node.toSerializable(), null, 2));

class DirectedGraph {
  constructor() {
    this.nodes = {};
  }

  addNode(node) {
    this.nodes = {
      ...this.nodes,
      [node.id]: node,
    };
    return this;
  }

  markNodeComplete(nodeId) {
    this.nodes[nodeId].markComplete();
  }

  addConnection(nodeIdFrom, nodeIdTo) {
    this.nodes[nodeIdFrom].addConnection(nodeIdTo);
    return this;
  }

  getDependantChildren(nodeIdOfDependency) {
    return this.nodes[nodeIdOfDependency].allConnections;
  }

  // mark depth
  // get children
  //

  traverseGraphDFS(rootNodeId, previousNodeId, nodes = { ...this.nodes }, depth = 0) {
    const node = nodes[rootNodeId];
    if (previousNodeId) {
      node.addPackageToUpdate(previousNodeId);
    }

    if (node.depth < depth) {
      node.depth = depth;
    }
    const children = this.getDependantChildren(rootNodeId)
      .forEach(child => {
        this.traverseGraphDFS(child, rootNodeId, nodes, depth + 1);
      });
    return nodes;
  }
  // 
  // traverseGraph(rootNodeId) {
  //   const node = this.nodes[rootNodeId];
  //   let queue = [node];
  //   let depth = 0;
  //   const set = new Set(queue);
  //   while (queue.length > 0) {
  //     const current = queue.shift();
  //     console.log('depth', current.id, depth)
  //     if (current.depth < depth) {
  //       current.depth = depth;
  //     }
  //
  //     const children = this.getDependantChildren(current.id)
  //       .map(childId => this.nodes[childId]);
  //     children.forEach(child => {
  //       set.add(child);
  //       child.incrementDepth();
  //       console.log(current.id, ' -> ', child.id)
  //       child.addPackageToUpdate(current.id);
  //       queue.push(child);
  //     });
  //   }
  //   return set;
  // }

  toString() {
    return JSON.stringify({
      nodes: Object.keys(this.nodes)
        .reduce(
          (obj, key) => Object.assign(obj, { [key]: this.nodes[key].toSerializable() }),
          {},
        )
    }, null, 2);
  }
}

module.exports = {
  default: DirectedGraph
};

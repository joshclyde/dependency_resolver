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

  addConnection(nodeIdFrom, nodeIdTo) {
    this.nodes[nodeIdFrom].addConnection(nodeIdTo);
    return this;
  }

  getDependantChildren(nodeIdOfDependency) {
    return Array.from(this.nodes[nodeIdOfDependency].connections);
  }

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

class DirectedGraph {
  constructor() {
    this.nodes = {};
  }

  addNode(node) {
    this.nodes = Object.assign({}, this.nodes, { [node.id]: node });
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

  cloneNodes() {
    return Object.keys(this.nodes)
      .map(key => this.nodes[key])
      .map(node => node.deepClone())
      .reduce(
        (obj, node) => Object.assign(obj, { [node.id]: node }),
        {},
      );
  }

  buildDependencyMap(rootNodeId, previousNodeId, nodes = this.cloneNodes(), depth = 0) {
    const node = nodes[rootNodeId];
    if (previousNodeId) {
      node.addPackageToUpdate(previousNodeId);
    }

    if (node.depth < depth) {
      node.depth = depth;
    }
    this.getDependantChildren(rootNodeId)
      .forEach(child => {
        this.buildDependencyMap(child, rootNodeId, nodes, depth + 1);
      });

    return nodes;
  }

  toString() {
    return JSON.stringify({
      nodes: Object.keys(this.nodes)
        .reduce(
          (obj, key) => Object.assign(obj, { [key]: this.nodes[key].toSerializable() }),
          {},
        ),
    }, null, 2);
  }
}

module.exports = {
  default: DirectedGraph,
};

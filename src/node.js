
class Node {
  constructor(id, version, connections = []) {
    this.id = id;
    this.version = version;
    this.connections = new Set(connections);
    this.complete = false;
    this.depth = 0;
    this.packagesToUpdate = new Set();
  }

  markComplete() {
    this.complete = true;
    return this;
  }

  addConnection(nodeId) {
    this.connections.add(nodeId);
    return this;
  }

  incrementDepth() {
    this.depth += 1;
  }

  addPackageToUpdate(node) {
    this.packagesToUpdate.add(node);
    return this;
  }

  get allConnections() {
    return Array.from(this.connections);
  }

  toSerializable() {
    return {
      id: this.id,
      version: this.version,
      connections: Array.from(this.connections),
      complete: this.complete,
      depth: this.depth,
      packagesToUpdate: Array.from(this.packagesToUpdate)
    };
  }
}

module.exports = {
  default: Node
};

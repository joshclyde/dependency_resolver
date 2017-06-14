
class Node {
  constructor(id, version, connections = [], visited = false, depth = 0, packagesToUpdate = new Set()) {
    this.id = id;
    this.version = version;
    this.connections = new Set(connections);
    this.visited = visited;
    this.depth = depth;
    this.packagesToUpdate = packagesToUpdate;
  }

  deepClone() {
    return new Node(
      this.id,
      this.version,
      [...Array.from(this.connections)],
      this.visited,
      this.depth,
      this.packagesToUpdate,
    );
  }

  markVisited() {
    this.visited = true;
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

  containsPackageToUpdate(nodeId) {
    if (this.packagesToUpdate.has(nodeId)) {
      return true;
    }
    return false;
  }

  get allConnections() {
    return Array.from(this.connections);
  }

  get allPackagesToUpdate() {
    return Array.from(this.packagesToUpdate);
  }

  toSerializable() {
    return {
      id: this.id,
      version: this.version,
      connections: Array.from(this.connections),
      visited: this.visited,
      depth: this.depth,
      packagesToUpdate: Array.from(this.packagesToUpdate),
    };
  }
}

module.exports = {
  default: Node,
};


class Node {
  constructor(id, version, connections = []) {
    this.id = id;
    this.version = version;
    this.connections = new Set(connections);
    this.complete = false;
  }

  markComplete() {
    this.complete = true;
    return this;
  }

  addConnection(nodeId) {
    this.connections.add(nodeId);
    return this;
  }

  toSerializable() {
    return {
      id: this.id,
      version: this.version,
      connections: Array.from(this.connections),
      complete: this.complete,
    };
  }
}

module.exports = {
  default: Node
};

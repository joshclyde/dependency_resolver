#!/usr/bin/env node

const program = require('commander');
const prompt = require('prompt');
const sh = require('shelljs');

const {
  dirs,
  getCurrentVersion,
  // updateVersion,
  getMetadataFromProjectName,
  findProjectsWithDependency,
  execNpmVersion,
  updateDependencyVersion,
} = require('./commandTools');
const Graph = require('./graph').default;
const Node = require('./node').default;

program
  .arguments('<dependency>')
  .arguments('<whichVersion>')
  .parse(process.argv);


// print the dependency connections to the console
// get the ordered list of commands to be executed


// the project that has been updated
const dependency = program.args[0];
// major, minor, or patch
const whichVersion = program.args[1];
console.log('Our dependency: %s and we are updating version %s', dependency, whichVersion);

// get the current version of our project
const currentVersion = getCurrentVersion(dependency);
console.log('Current version: %s', currentVersion);

// calculate the updated version
// const updatedVersion = updateVersion(currentVersion, whichVersion);
// console.log('New version: %s', updatedVersion);

// Get current directory of terminal
const currentDir = sh.pwd().toString();
// Get all directories inside current directory
const allProjects = dirs(currentDir);


const buildGraph = (dependency, dependencyGraph) => {
  const projectsWithDependency = findProjectsWithDependency(allProjects, dependency);
  const { version: dependencyVersion } = getMetadataFromProjectName(dependency);
  const dependencyChildrenIds = projectsWithDependency
    .map(({ id }) => id);
  dependencyGraph.addNode(new Node(dependency, dependencyVersion, dependencyChildrenIds));
  projectsWithDependency.forEach(({ id, version }) => {
    dependencyGraph.addNode(new Node(id, version));
    buildGraph(id, dependencyGraph);
  });
  return dependencyGraph;
};

const dependencyGraph = buildGraph(dependency, new Graph());

// console.log("Projects with dependency", dependencyGraph.toString());

const schema = [
  {
    name: 'shouldUpdate',
    default: 'y',
    pattern: /^[yn]$/,
    description: 'Do you want to update this package? (y/n)',
  },
  // {
  //   name: 'versionName',
  //   default: 'y',
  //   pattern: /^[yn]$/,
  //   description: 'Do you want to update this package? (y/n)',
  //   // default: 'patch',
  //   // pattern: /^patch|minor|major$/,
  //   // description: 'Update version type (patch/minor/major)',
  // },
];

// const updatePackages = nodes => {
//   if (nodes.length <= 0) {
//     return;
//   }
//   const nodeCopy = [...nodes];
//   const node = nodeCopy.shift();
//   console.log(`\n\n\nupdating package: ${node.id}`);
//   // TODO: Prompt user for version to update as (patch minor major)
//   const packagesToUpdate = node.allPackagesToUpdate;
//   packagesToUpdate.forEach(packageName => {
//     updateDependencyVersion(node.id, packageName, getCurrentVersion(packageName));
//     console.log(`updated ${packageName}`);
//   });
//   prompt.get(schema, (err, result) => {
//     // if (err) {
//     //   process.exit(1);
//     // }
//     if (result.shouldUpdate === 'y') {
//       execNpmVersion(node.id, result.versionName || 'patch');
//     }
//     // updatePackages(nodeCopy);
//   });
// };


const updatePackage = node => {
  console.log(`\n\n\nupdating package: ${node.id}`);
  // TODO: Prompt user for version to update as (patch minor major)
  const packagesToUpdate = node.allPackagesToUpdate;
  packagesToUpdate.forEach(packageName => {
    updateDependencyVersion(node.id, packageName, getCurrentVersion(packageName));
    console.log(`updated ${packageName}`);
  });
  execNpmVersion(node.id, whichVersion);
};

const printThingsToUpdate = mapOfDependencies =>
  node => {
    console.log('-------------  ', node.id);
    node.allPackagesToUpdate
      .forEach(idToUpdate => console.log(idToUpdate, mapOfDependencies[idToUpdate].version));
    return node;
  };

const mapOfDependencies = dependencyGraph.buildDependencyMap(dependency);
// if there was a cycle in the graph
// console.log(dependencyGraph.toString())
if (!mapOfDependencies) {
  console.log('Aborting! There was a cycle in your dependency graph!');
} else {
  const packagesToUpdate = Object.keys(mapOfDependencies)
    .map(key => mapOfDependencies[key])
    .sort((a, b) => a.depth - b.depth)
    .map(printThingsToUpdate(mapOfDependencies))
    .forEach(updatePackage);

  // prompt.start();
  // updatePackages(packagesToUpdate);
  console.log('after prompt');
}

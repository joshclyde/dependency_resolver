
const sh = require('shelljs');
const fs = require('fs');

const dirs = pathName => fs.readdirSync(pathName).filter(f => fs.statSync(`${pathName}/${f}`).isDirectory());

const getCurrentVersion = pathToFile => {
  // console.log('trying to read', `${pathToFile}/package.json`);
  const json = JSON.parse(fs.readFileSync(`${pathToFile}/package.json`, 'utf8'));
  return json.version;
};

const updateVersion = (currentVersion, whichVersion) => {
  const currentVersionSplit = currentVersion.split('.');
  // TODO: allow the user to choose whether to update major, minor, or patch
  switch (whichVersion) {
    case 'major':
      currentVersionSplit[0] = (parseInt(currentVersionSplit[0], 10) + 1).toString();
      break;
    case 'minor':
      currentVersionSplit[1] = (parseInt(currentVersionSplit[1], 10) + 1).toString();
      break;
    case 'patch':
      currentVersionSplit[2] = (parseInt(currentVersionSplit[2], 10) + 1).toString();
      break;
    default:
  }
  return currentVersionSplit.join('.');
};

const projectHasDependency = dependency =>
  projectName => {
    const json = JSON.parse(fs.readFileSync(`${projectName}/package.json`, 'utf8'));
    return json !== undefined && json.dependencies !== undefined && json.dependencies[dependency] !== undefined;
  };

const getMetadataFromProjectName = projectName => {
  const json = JSON.parse(fs.readFileSync(`${projectName}/package.json`, 'utf8'));
  return {
    version: json.version,
    id: json.name,
  };
};

const findProjectsWithDependency = (projects, dependency) => {
  const projectsWith = projects
    .filter(projectHasDependency(dependency))
    .map(getMetadataFromProjectName);
  return projectsWith;
};

/*
* Updates the version of the project
* @param {String} project - the project to be updated
* @param {String} whichVersion - major, minor, or patch
*
*/
const execNpmVersion = (project, whichVersion) => {
  sh.cd(project);
  sh.exec(`npm version ${whichVersion}`);
  sh.cd('..');
};

/*
* Installs the dependency's version
* @param {String} project - the project that has the dependency
* @param {String} dependency - the dependency to be installed
* @param {String} version - the version of the dependency
*/
const execNpmInstall = (project, dependency, version) => {
  sh.cd(project);
  sh.exec(`npm install ${dependency}@${version} --save --force`);
  sh.cd('..');
};

const updateDependencyVersion = (projectName, dependencyName, version) => {
  // TODO: i dont think i want to edit the package.json directly. instead, should use npm commands. so this is temporary.
  // using json to find dependencyName version and udpate it
  const json = JSON.parse(fs.readFileSync(`${projectName}/package.json`, 'utf8'));
  json.dependencies[dependencyName] = version;
  fs.writeFileSync(`${projectName}/package.json`, JSON.stringify(json, null, '\t'));
};

module.exports = {
  dirs,
  getCurrentVersion,
  updateVersion,
  projectHasDependency,
  getMetadataFromProjectName,
  findProjectsWithDependency,
  execNpmVersion,
  execNpmInstall,
  updateDependencyVersion,
};

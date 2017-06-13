#!/usr/bin/env node
// console.log("console.log output")

const co = require('co');
const prompt = require('co-prompt');
const program = require('commander');
const sh = require("shelljs");
const fs = require('fs');

/*
  defining our arguments
  arguments
    <dependency>: the project which will be updated
  TODO: add a few more options such as
    - major, minor, patch (currently major is hardcoded)
*/
program
  .arguments('<dependency>')
  .arguments('<which_version>')
  .parse(process.argv);

/*
* Get the current version of a project from its package.json
* @param {String} path_to_file - the path to the package.json
* @return {String} the current version number
*/
const get_current_version = (path_to_file) => {
  // using regex to find version
  // const version_line= sh.grep('version', path_to_file).toString();
  // const reg_find_version = /\d.\d.\d/;
  // const current_version_num = version_line.match(reg_find_version).toString();

  // using json to find version
  const json = JSON.parse(fs.readFileSync(path_to_file, 'utf8'))
  return json.version;
}

/*
* Calculate the updated version number of major, minor, or patch
* @param {String} current_version - the version number to be updated
* @param {String} which_version - major, minor, or patch
* @return {String} the updated version number
*/
const update_version = (current_version, which_version) => {
  let current_version_split = current_version.split('.');
  // TODO: allow the user to choose whether to update major, minor, or patch
  switch (which_version) {
    case 'major':
      current_version_split[0] = (parseInt(current_version_split[0]) + 1).toString();
      break;
    case 'minor':
      current_version_split[1] = (parseInt(current_version_split[1]) + 1).toString();
      break;
    case 'patch':
      current_version_split[2] = (parseInt(current_version_split[2]) + 1).toString();
      break;
    default:
  }
  return current_version_split.join('.');
}

const project_has_dependency = (path_to_file, dependency) => {
  const json = JSON.parse(fs.readFileSync(path_to_file, 'utf8'))
  return json !== undefined && json.dependencies !== undefined && json.dependencies[dependency] !== undefined;
}

const find_projects_with_dependency = (projects, dependency) => {
  const projects_with = projects.filter((project) => { return project_has_dependency(project + '/package.json', dependency) });
  return projects_with;
}

/*
* Updates the version of the project
* @param {String} project - the project to be updated
* @param {String} which_version - major, minor, or patch
*
*/
const exec_npm_version = (project, which_version) => {
  sh.cd(project);
  sh.exec('npm version ' + which_version);
  sh.cd('..');
}

/*
* Installs the dependency's version
* @param {String} project - the project that has the dependency
* @param {String} dependency - the dependency to be installed
* @param {String} version - the version of the dependency
*/
const exec_npm_install = (project, dependency, version) => {
  sh.cd(project);
  sh.exec('npm install ' + dependency + '@' + version + ' --save --force');
  sh.cd('..');
}

const update_dependency_version = (project, dependency, version) => {
  // TODO: i dont think i want to edit the package.json directly. instead, should use npm commands. so this is temporary.
  // using json to find dependency version and udpate it
  let json = JSON.parse(fs.readFileSync(project + '/package.json', 'utf8'))
  json.dependencies[dependency] = version;
  fs.writeFile(project + '/package.json', JSON.stringify(json, null, '\t'), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log(project + '/package.json has successfully updated to ' + dependency + '@' + version);
  });
}

// print the dependency connections to the console
// get the ordered list of commands to be executed


// the project that has been updated
const dependency = program.args[0];
// major, minor, or patch
const which_version = program.args[1];
console.log("Our dependency: %s and we are updating version %s", dependency, which_version);

// get the current version of our project
const current_version = get_current_version(dependency + '/package.json');
console.log("Current version: %s", current_version);

// calculate the updated version
const updated_version = update_version(current_version, which_version);
console.log("New version: %s", updated_version);


const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory());
// Get current directory of terminal
const curr_dir = sh.pwd().toString()
// Get all directories inside current directory
const all_projects = dirs(curr_dir);
const projects_with_dependency = find_projects_with_dependency(all_projects, dependency);
console.log("Projects with dependency: %s", projects_with_dependency);



// update the projects version
// exec_npm_version(dependency, which_version);


// TODO: find all projects that have our project as a dependency
// TODO: since we are updating the projects that are dependent on our project, we must then
//       update the projects that use these projects as dependencies.
//       basically, we have to recursively do this again which each of the projects.
// TODO: make sure there is no circular dependencies (kinda chained with the above step)
// TODO: run all commands that are needed to update our projects
//       (like updating dependcy version, updating current version, publishing to npm, pushing to git)



// const fs = require('fs');
// // Function used to get all directories inside a given directory (p)
// const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory());
//
// // Get current directory of terminal
// const curr_dir = sh.pwd().toString()
//
//
// // Get all directories inside current directory
// const all_projects = dirs(curr_dir);
// all_projects.forEach(function hasDependency(project, index) {
//   // const reg_dependency_version = /$dependency
//   const my_regex = new RegExp(dependency + ': \d.\d.\d', "g");
//   var replace = "regex";
//   var re = new RegExp(replace,"g");
//   You can dynamically create regex objects this way. Then you will do:
//
//   "mystring".replace(re, "newstring")
//   const dependency_line = sh.grep(dependency, project + '/package.json').toString();
//   console.log('Has dependency: %s', dependency_line);
// })

#!/usr/bin/env node
// console.log("console.log output")

/*
  What I need
    - ROOT_DIR: root directory of all projects that will update to current version
    - PROJECT: project name of the dependency that has been updated
    - VERSION: the new version of the dependency
  Program will
    1. Find all projects in ROOT_DIR that have a dependency on PROJECT
    2. Update the version of PROJECT in each of these projects.
    3. Update the version of each of the projects that have the dependency
    4. Recursively do this for each of the projects
  Things to watch out for
    - circular dependencies
    -
*/

var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var sh = require("shelljs");

program
  .arguments('<dependency>')
  .option('-p, --path_to_root <path_to_root>', 'The path to the root directory of all projects that should be updated')
  .option('-v, --version_num <version_num>', 'The version to update the dependency to')
  .parse(process.argv);

// The project that has been updated
const dependency = program.args[0];
console.log("Our dependency: %s", dependency);

// Function used to get all directories inside a given directory
const fs = require('fs');
const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory());

// Get current directory of terminal
const curr_dir = sh.pwd().toString()

// Get the current version number of our dependency
const version_line= sh.grep('version', dependency + '/package.json').toString();
// TODO: maybe make a more concrete regex to get version number
const reg_find_version = /\d.\d.\d/;
const current_version_num = version_line.match(reg_find_version).toString();

console.log("Current version: %s", current_version_num);

let current_version_split = current_version_num.split('.');
// TODO: allow the user to choose whether to update major, minor, or patch
const which_version = 'major';
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
console.log("New version: %s", current_version_split.join('.'));

// Get all directories inside current directory
const all_projects = dirs(curr_dir);
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

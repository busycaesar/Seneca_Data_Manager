// GLOBAL VARIABLE.
var students = [];
var programs = [];
var fs = require("fs");

// EXPORT FUNCTIONS.

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/students.JSON", (err, data) => {
      if (err) reject("Unable to read the file");
      students = JSON.parse(data);
      resolve();
    });
    fs.readFile("./data/programs.JSON", (err, data) => {
      if (err) reject("Unable to read the file");
      programs = JSON.parse(data);
    });
    resolve();
  });
};

module.exports.getAllStudents = function () {
  return new Promise((resolve, reject) => {
    if (students.length > 0) resolve(students);
    else reject("No Results Returned");
  });
};

module.exports.getInternationalStudents = function () {
  return new Promise((resolve, reject) => {
    const intStudents = students.filter((stu) => {
      return stu.isInternationalStudent === true;
    });
    if (intStudents.length > 0) resolve(intStudents);
    else reject("No Results Returned");
  });
};

module.exports.getPrograms = function () {
  return new Promise((resolve, reject) => {
    if (programs.length > 0) resolve(programs);
    else reject("No Results Returned");
  });
};
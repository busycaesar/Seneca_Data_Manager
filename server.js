/********************************************************************************* 
*  WEB322 – Assignment 02 
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source  
*  (including 3rd party web sites) or distributed to other students. 
*  
*  Name: Dev Jigishkumar Shah Student ID: 131623217 Date: 28/09/2022 
* 
*  Online (Cyclic) Link:  
* 
********************************************************************************/

// ==> INCLUDING MODULES

var express = require("express");
const { resolve } = require("path");
var app = express();
var path = require("path");
var data = require("./data-service.js");

// ==> SETTING PORT

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));

// ==> ON START FUNCTION

function onHTTPStart() {
  console.log("Express http server listening on port " + HTTP_PORT);
}

// ==> GET REQUESTS

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/about.html"));
});

app.get("/students", (req, res) => {
  data
    .getAllStudents()
    .then((data) => {
      res.setHeader("Content-Type", "application/json");
      res.json(data);
    })
    .catch((err) => {
      res.json({ Message: "Error" });
    });
});

app.get("/intlstudents", (req, res) => {
  data
    .getInternationalStudents()
    .then((data) => {
      res.setHeader("Content-Type", "application/json");
      res.json(data);
    })
    .catch((err) => {
      res.json({ Message: "Error" });
    });
});

app.get("/programs", (req, res) => {
  data
    .getPrograms()
    .then((data) => {
      res.setHeader("Content-Type", "application/json");
      res.json(data);
    })
    .catch((err) => {
      res.json({ Message: "Error" });
    });
});

app.use((req, res) => {
  res
    .status(404)
    .send(
      "<h1>ERROR 404. PAGE NOT FOUND.</h1><img alt='Its error so no image.'/>"
    );
});

// ==> LISTEN REQUEST.

data
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHTTPStart);
  })
  .catch((err) => {
    console.log("Error in initializing the data.");
  });
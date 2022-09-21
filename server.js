// ==> INCLUDING MODULES

var express = require("express");
var app = express();
var path = require("path");
var data = require("./data-service.js");

// ==> SETTING PORT

var HTTP_PORT = process.env.PORT || 8080;

// ==> ON START FUNCTION

function onHTTPStart(){
  console.log("Express http server listening on port " + HTTP_PORT);
}

app.use(express.static("public")); //////////////////////////////////////////////////////////////////////////// IS THIS THE CORRECT LOCATION FOR THIS STATEMENT?

// ==> GET REQUESTS

app.get("/", (req, res) => {
  res.sendFile("D:/CPA Sem 3/WEB 322/web322-app/views/home.html");
});

app.get("/about.html", (req, res) => {
  res.sendFile("D:/CPA Sem 3/WEB 322/web322-app/views/about.html");
});

app.get("/students", (req, res) => {
  res.sendFile("D:/CPA Sem 3/WEB 322/web322-app/data/students.JSON");
});

app.get("/intlstudents", (req, res) => {});

app.get("/programs", (req, res) => {
  res.sendFile("D:/CPA Sem 3/WEB 322/web322-app/data/programs.JSON");
}); //////////////////////////////////////////////////////////////////////////////////////////////// THE DATA SEND IS YET TO BE CONVERTED INTO A JSON FORMATTED STRING.

app.get("/app", (req, res) => {
  res.send("404 Page Not Found");
});

// ==> LISTEN REQUEST.

app.listen(HTTP_PORT,onHTTPStart);

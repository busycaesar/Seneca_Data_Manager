/********************************************************************************* 
*  WEB322 – Assignment 04 
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part  
*  of this assignment has been copied manually or electronically from any other source  
*  (including 3rd party web sites) or distributed to other students. 
*  
*  Name: DEV JIGISHKUMAR SHAH Student ID: 131623217 Date: 12/11/2022
* 
*  Online (Heroku) Link: https://web--322.herokuapp.com/
* 
********************************************************************************/ 

// ==> INCLUDING MODULES

const express = require("express");
const app = express();
const path = require("path");
const data = require("./data-service");
const multer = require("multer");
const fs = require("fs");
const exphbs = require("express-handlebars");
const { equal } = require("assert");

// ==> SETTING PORT

const HTTP_PORT = process.env.PORT || 8080;

// ==> STATIC FILES

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      navLink: (url, options) => {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
        equal: f;
      },
      equal: (lvalue, rvalue, options) => {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);
app.set("view engine", ".hbs");

// ==> ON START FUNCTION

function onHTTPStart() {
  console.log("Express http server listening on port " + HTTP_PORT);
}

// ==> MULTER MIDDLEWARE.

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ==> GET REQUESTS

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/students", (req, res) => {
  if (req.query.status) {
    data
      .getStudentsByStatus(req.query.status)
      .then((data) => {
        res.render("students", { students: data });
      })
      .catch((err) => {
        res.json({ Message: "Error" });
      });
  } else if (req.query.program) {
    data
      .getStudentsByProgramCode(req.query.program)
      .then((data) => {
        res.render("students", { students: data });
      })
      .catch((err) => {
        res.json({ Message: "Error" });
      });
  } else if (req.query.credential) {
    data
      .getStudentsByExpectedCredential(req.query.credential)
      .then((data) => {
        res.render("students", { students: data });
      })
      .catch((err) => {
        res.json({ Message: "Error" });
      });
  } else {
    data
      .getAllStudents()
      .then((data) => {
        res.render("students", { students: data });
      })
      .catch((err) => {
        res.render("students", { message: "no results" });
      });
  }
});

app.get("/programs", (req, res) => {
  data
    .getPrograms()
    .then((data) => {
      res.render("programs", { programs: data });
    })
    .catch((err) => {
      res.json({ Message: "Error" });
    });
});

app.get("/students/add", (req, res) => {
  res.render("addStudent");
});

app.get("/images/add", (req, res) => {
  res.render("addImage");
});

app.get("/images", (req, res) => {
  fs.readdir("./public/images/uploaded", (err, data) => {
    if (err) console.log("Error in reading the directory.");
    else {
      res.render("images", { images: data });
    }
  });
});

app.get("/student/:studentId", (req, res) => {
  data
    .getStudentById(req.params.studentId)
    .then((data) => {
      res.render("student", { student: data });
    })
    .catch((err) => {
      res.render("student", { message: "no results" });
    });
});

// ==> POST REQUEST.

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.post("/students/add", (req, res) => {
  data.addStudent(req.body).then(res.redirect("/students"));
});

app.post("/student/update", (req, res) => {
  data
    .updateStudent(req.body)
    .then(res.redirect("/students"))
    .catch((err) => {
      console.log("There was an error", err);
    });
});

// ==> ERROR 404

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
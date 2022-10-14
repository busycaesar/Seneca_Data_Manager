/*********************************************************************************
 *  WEB322 – Assignment 03
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: DEV JIGISHKUMAR SHAH Student ID: 131623217 Date: 12/10/2022
 *
 *  Online (Cyclic) Link:
 *
 ********************************************************************************/

// ==> INCLUDING MODULES

var express = require("express");
var app = express();
var path = require("path");
var data = require("./data-service.js");
var multer = require("multer");
var fs = require("fs");

// ==> SETTING PORT

var HTTP_PORT = process.env.PORT || 8080;

// ==> STATIC FILES

app.use(express.static("public/css"));
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/about.html"));
});

app.get("/students", (req, res) => {
  if (req.query.status) {
    data
      .getStudentsByStatus(status)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ Message: "Error" });
      });
  }
  if (req.query.value) {
    getStudentsByProgramCode(programCode)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ Message: "Error" });
      });
  }
  if (req.query.credential) {
    getStudentsByExpectedCredential(credential)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ Message: "Error" });
      });
  }
  data
    .getAllStudents()
    .then((data) => {
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
      res.json(data);
    })
    .catch((err) => {
      res.json({ Message: "Error" });
    });
});

app.get("/students/add", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/addStudent.html"));
});

app.get("/images/add", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/addImage.html"));
});

app.get("/images", (req, res) => {
  fs.readdir("./public/images/uploaded", (err, data) => {
    if (err) console.log("Error in reading the directory.");
    else res.json({ images: data });
  });
});

app.get("/student/value", (req, res) => {
  data
    .getStudentById(sid)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ Message: "Error" });
    });
});

// ==> POST REQUEST.

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.post("/students/add", (req, res) => {
  data.addStudent(req.body).then(res.redirect("/students"));
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
/*********************************************************************************
 *  WEB322 – Assignment 06
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: DEV JIGISHKUMAR SHAH Student ID: 131623217 Date: 02/12/2022
 *
 *  Online (Heroku) Link: https://web322app.onrender.com
 *
 ********************************************************************************/

// ==> INCLUDING MODULES

const express = require("express");
const path = require("path");
const data = require("./data-service.js");
const fs = require("fs");
const multer = require("multer");
const exphbs = require("express-handlebars");
const app = express();
const dataServiceAuth = require("./data-service-auth");
const clientSessions = require("client-sessions");

// ==> SETTING PORT

const HTTP_PORT = process.env.PORT || 8080;

// ==> ON START FUNCTION

const onHTTPStart = () => {
  console.log("Express http server listening on port " + HTTP_PORT);
};

// ==> MIDDLEWARES.

app.use(
  clientSessions({
    cookieName: "session",
    secret: "web_322_app_assignment_6",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60,
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

const ensureLogin = (req, res, next) => {
  if (!req.session.user) res.redirect("/login");
  else next();
};

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
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

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ==> GET REQUESTS

app.use((req, res, next) => {
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

app.get("/students", ensureLogin, (req, res) => {
  if (req.query.status) {
    data
      .getStudentsByStatus(req.query.status)
      .then((data) => {
        if (data.length > 0) res.render("students", { students: data });
        else
          res.render("students", { message: "No Students in the database." });
      })
      .catch((err) => {
        res.status(500).send({ Message: "Error" });
      });
  } else if (req.query.program) {
    data
      .getStudentsByProgramCode(req.query.program)
      .then((data) => {
        if (data.length > 0) res.render("students", { students: data });
        else
          res.render("students", { message: "No Students in the database." });
      })
      .catch((err) => {
        res.status(500).send({ Message: "Error" });
      });
  } else if (req.query.credential) {
    data
      .getStudentsByExpectedCredential(req.query.credential)
      .then((data) => {
        if (data.length > 0) res.render("students", { students: data });
        else
          res.render("students", { message: "No Students in the database." });
      })
      .catch((err) => {
        res.status(500).send({ Message: "Error" });
      });
  } else {
    data
      .getAllStudents()
      .then((data) => {
        if (data.length > 0) res.render("students", { students: data });
        else
          res.render("students", { message: "No Students in the database." });
      })
      .catch((err) => {
        res.status(500).send({ Message: "Error" });
      });
  }
});

app.get("/programs", ensureLogin, (req, res) => {
  data
    .getPrograms()
    .then((data) => {
      if (data.length > 0) res.render("programs", { programs: data });
      else res.render("programs", { message: "No Programs in the database." });
    })
    .catch((err) => {
      res.status(500).send({ Message: "Error" });
    });
});

app.get("/students/add", ensureLogin, (req, res) => {
  data
    .getPrograms()
    .then((data) => {
      res.render("addStudent", { programs: data });
    })
    .catch((err) => {
      res.render("addStudent", { programs: [] });
    });
});

app.get("/images/add", ensureLogin, (req, res) => {
  res.render("addImage");
});

app.get("/images", ensureLogin, (req, res) => {
  fs.readdir("./public/images/uploaded", (err, data) => {
    if (err) console.log("Error in reading the directory.");
    else {
      res.render("images", { images: data });
    }
  });
});

app.get("/student/:studentId", ensureLogin, (req, res) => {
  // VARIABLE DECLARATION.
  let viewData = {};
  data
    .getStudentById(req.params.studentId)
    .then((data) => {
      if (data) viewData.student = data[0];
      else viewData.student = null;
    })
    .catch(() => {
      viewData.student = null;
    })
    .then(data.getPrograms)
    .then((data) => {
      viewData.programs = data;
      for (let i = 0; i < viewData.programs.length; i++) {
        if (viewData.programs[i].programCode == viewData.student.program) {
          viewData.programs[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.programs = [];
    })
    .then(() => {
      if (viewData.student == null) res.status(404).send("Student Not Found");
      else res.render("student", { viewData: viewData });
    })
    .catch((err) => {
      res.status(500).send("Unable to Show Students");
    });
});

app.get("/programs/add", ensureLogin, (req, res) => {
  res.render("addProgram");
});

app.get("/program/:programCode", ensureLogin, (req, res) => {
  data
    .getProgramByCode(req.params.programCode)
    .then((data) => {
      if (data.length > 0) res.render("program", { program: data[0] });
      else res.status(500).send("Program not found.");
    })
    .catch(() => res.status(404).send("Program Not Found"));
});

app.get("/program/delete/:programCode", ensureLogin, (req, res) => {
  data
    .deleteProgramByCode(req.params.programCode)
    .then(() => {
      res.redirect("/programs");
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Program / Program not found");
    });
});

app.get("/student/delete/:studentID", ensureLogin, (req, res) => {
  data
    .deleteStudentById(req.params.studentID)
    .then(() => {
      res.redirect("/students");
    })
    .catch(() => {
      res.status(500).send("Unable to Remove Student / Student not found");
    });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

app.get("/userHistory", ensureLogin, (req, res) => {
  res.render("userHistory");
});

// ==> POST REQUEST.

app.post("/images/add", ensureLogin, upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.post("/students/add", ensureLogin, (req, res) => {
  data
    .addStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.status(500).send("Unable to Add Student");
    });
});

app.post("/student/update", ensureLogin, (req, res) => {
  data
    .updateStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.status(500).send("There was an error", err);
    });
});

app.post("/programs/add", ensureLogin, (req, res) => {
  data
    .addProgram(req.body)
    .then(() => {
      res.redirect("/programs");
    })
    .catch((err) => {
      res.status(500).send("Unable to Add Program");
    });
});

app.post("/program/update", ensureLogin, (req, res) => {
  data
    .updateProgram(req.body)
    .then(() => {
      res.redirect("/programs");
    })
    .catch((err) => {
      res.status(500).send("There was an error", err);
    });
});

app.post("/register", (req, res) => {
  dataServiceAuth
    .registerUser(req.body)
    .then(() => {
      res.render("register", { successMessage: "User created" });
    })
    .catch((err) => {
      res.render("register", {
        errorMessage: err,
        userName: req.body.userName,
      });
    });
});

app.post("/login", (req, res) => {
  req.body.userAgent = req.get("User-Agent");
  dataServiceAuth
    .checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user[0].userName,
        email: user[0].email,
        loginHistory: user[0].loginHistory,
      };
      res.redirect("/students");
    })
    .catch((err) => {
      res.render("login", { errorMessage: err, userName: req.body.userName });
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
  .then(dataServiceAuth.initialize())
  .then(() => {
    app.listen(HTTP_PORT, onHTTPStart);
  })
  .catch((err) => {
    console.log("Error in initializing the data.");
  });
// REQUIRED HEADER FILES.
const Sequelize = require("sequelize");

var sequelize = new Sequelize(
  "ridcpwzu",
  "ridcpwzu",
  "UeDZfx5zNy0QmsNjtMPjob7fkhkFPXWD",
  {
    host: "peanut.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnathorization: false },
    },
    query: { raw: true },
  }
);

// DATA MODELS.

var Student = sequelize.define("Student", {
  studentID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  phone: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  isInternationalStudent: Sequelize.BOOLEAN,
  expectedCredential: Sequelize.STRING,
  status: Sequelize.STRING,
  registrationDate: Sequelize.STRING,
});

var Program = sequelize.define("Program", {
  programCode: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  programName: Sequelize.STRING,
});

// RELATIONSHIP BETWEEN DATE MODELS.

Program.hasMany(Student, { foreignKey: "program" });

// EXPORT FUNCTIONS.

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to sync the database.");
      });
  });
};

module.exports.getAllStudents = () => {
  return new Promise((resolve, reject) => {
    Student.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPrograms = () => {
  return new Promise((resolve, reject) => {
    Program.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.addStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    studentData.isInternationalStudent = studentData.isInternationalStudent
      ? true
      : false;
    for (data in studentData) {
      if (studentData[data] == "") studentData[data] = null;
    }
    Student.create(studentData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to create student");
      });
  });
};

module.exports.getStudentsByStatus = (argument_status) => {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        status: argument_status,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getStudentsByProgramCode = (programCode) => {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        program: programCode,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getStudentsByExpectedCredential = (credential) => {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        expectedCredential: credential,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getStudentById = (sid) => {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        studentID: sid,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.updateStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    studentData.isInternationalStudent = studentData.isInternationalStudent
      ? true
      : false;
    for (data in studentData) {
      if (studentData[data] == "") studentData[data] = null;
    }
    Student.update(studentData, { where: { studentID: studentData.studentID } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to update student");
      });
  });
};

module.exports.addProgram = (programData) => {
  return new Promise((resolve, reject) => {
    for (data in programData) {
      if (data.trim() == "") {
        data = null;
      }
    }
    Program.create({
      programCode: programData.programCode,
      programName: programData.programName,
    })
      .then(() => resolve())
      .catch(() => reject("unable to create program"));
  });
};

module.exports.updateProgram = (programData) => {
  console.log(programData);
  return new Promise((resolve, reject) => {
    for (data in programData) {
      if (data.trim() == "") {
        data = null;
      }
    }
    Program.update(
      { programName: programData.programName },
      { where: { programCode: programData.programCode } }
    )
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject();
      });
  });
};

module.exports.getProgramByCode = (pcode) => {
  return new Promise((resolve, reject) => {
    Program.findAll({
      where: {
        programCode: pcode,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.deleteProgramByCode = (pcode) => {
  console.log(pcode);
  return new Promise((resolve, reject) => {
    Program.destroy({
      where: {
        programCode: pcode,
      },
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject();
      });
  });
};

module.exports.deleteStudentById = (sId) => {
  console.log(sId);
  return new Promise((resolve, reject) => {
    Student.destroy({
      where: {
        studentID: sId,
      },
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject();
      });
  });
};
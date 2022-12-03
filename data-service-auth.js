// ==> INCLUDING MODULES

const mongo_db = require("mongoose");
const schema = mongo_db.Schema;
const bcrypt = require("bcryptjs");

// => CONNECTING WITH THE DATABASE.

var password = encodeURIComponent("WEB322@cpa@senecacollege");

mongo_db.connect(
  `mongodb+srv://busycaesar:${password}@cluster0.j0bhhjl.mongodb.net/?retryWrites=true&w=majority`
);

// ==> Data Type.

var userSchema = new schema({
  userName: { type: String, unique: true },
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String,
    },
  ],
});

let User;

// ==> Exported functions.

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    let db = mongo_db.createConnection(
      `mongodb+srv://busycaesar:${password}@cluster0.j0bhhjl.mongodb.net/SENECAWEB?retryWrites=true&w=majority`
    );
    db.on("error", (err) => {
      reject(err);
    });
    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    let message = [
      "Passwords do not match.",
      "User Name already taken.",
      "There was an error creating the user: ",
      "There was an error encrypting the password",
    ];
    if (userData.password == userData.password2) {
      bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(userData.password, salt))
        .then((hash) => {
          userData.password = hash;
          let new_user = new User(userData);
          new_user
            .save()
            .then(() => {
              resolve();
            })
            .catch((err) => {
              if (err.code == 11000) reject(message[1], err);
              reject(message[2]);
            });
        })
        .catch((err) => {
          reject(message[3], err);
        });
    } else reject(message[0]);
  });
};

module.exports.checkUser = (userData) => {
  return new Promise((resolve, reject) => {
    let message = [
      "Unable to find user: ",
      "Incorrect Password for user: ",
      "There was an error verifying the user: ",
    ];
    User.find({ userName: userData.userName })
      .exec()
      .then((found_user) => {
        if (found_user[0].length <= 0) reject(message[0], userData.userName);
        else {
          bcrypt
            .compare(userData.password, found_user[0].password)
            .then((result) => {
              if (result)
                found_user[0].loginHistory.push({
                  dateTime: new Date().toString(),
                  userAgent: userData.userAgent,
                });
              else reject(message[1], userData.userName);
            });
        }
        User.updateOne(
          { userName: userData.userName },
          { $set: { loginHistory: found_user[0].loginHistory } }
        )
          .exec()
          .then(() => {
            resolve(found_user);
          })
          .catch((err) => {
            reject(message[2], err);
          });
      })
      .catch(() => {
        reject(message[0], userData.userName);
      });
  });
};
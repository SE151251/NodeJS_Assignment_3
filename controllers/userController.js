const bcrypt = require("bcrypt");
const User = require("../model/user");
var passport = require("passport");
const jwt = require("jsonwebtoken");
class userController {
  index(req, res, next) {
    res.render("register");
  }
  listUsers(req, res, next) {
    User.find({})
      .then((users) => {
        res.render("accounts", {
          title: "The list of Users",
          users: users,
          isLogin: { name: req.name, role: req.role },
        });
      })
      .catch(next);
  }

  regist(req, res, next) {
    const { username, password } = req.body;
    let errors = [];
    if (!username || !password) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }
    if (errors.length > 0) {
      res.render("register", {
        errors,
        username,
        password,
      });
    } else {
      User.findOne({ username: username }).then((user) => {
        if (user) {
          errors.push({ msg: "Username already exists" });
          res.render("register", {
            errors,
            username,
            password,
          });
        } else {
          const newUser = new User({
            username,
            password,
          });
          //Hash password
          bcrypt.hash(newUser.password, 10, function (err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                res.redirect("/users/login");
              })
              .catch(next);
          });
        }
      });
    }
  }

  login(req, res, next) {
    if (req.cookies.jwt) {
      const token = req.cookies.jwt;
      jwt.verify(token, "my_secret_key", (err, decoded) => {
        if (err) {
          req.flash('error_msg', err.message);
          return res.render("login");
        } else {
          if (decoded.user.role === "admin")
          return res.redirect("/users/dashboard");
          else return res.redirect("/");
        }
      });
    } else {
      return res.render("login");
    }
  }
  signin(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/users/dashboard",
      failureRedirect: "/users/login/",
      failureFlash: true,
    })(req, res, next);
  }

  dashboard(req, res, next) {
    res.render("dashboard", {
      title: "Dashboard",
      isLogin: { name: req.name, role: req.role },
    });
  }
  signout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success_msg", "You are logged out");
      //  res.clearCookie('jwt');
      res.redirect("/users/login");
    });
  }

  //update user
  formEdit(req, res, next) {
    const userId = req.userId;
    console.log(userId);
    User.findById(userId)
      .then((user) => {
        console.log(user);
        res.render("profile", {
          title: "The detail of User",
          user: user,
          isLogin: { name: req.name, role: req.role },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  edit(req, res, next) {
    var data = {
      name: req.body.name,
      YOB: req.body.yob,
    };
    User.updateOne({ _id: req.userId }, data)
      .then(() => {
        try {
          const decodedToken = jwt.verify(req.cookies.jwt, 'my_secret_key');        
          const now = Math.floor(Date.now() / 1000);
          console.log(decodedToken);
            const expiresIn = decodedToken.exp - now;
            console.log(`JWT will expire in ${expiresIn} seconds`); 
            console.log(`${expiresIn}s`);
            const new_token = jwt.sign(
              {
                user: {
                  userId: decodedToken.user.userId,
                  name: req.body.name,
                  role: decodedToken.user.role,
                },
              },
              "my_secret_key",
              {
                expiresIn: `${expiresIn}s`,
              }
            );
            const decodedToken2 = jwt.verify(new_token, 'my_secret_key');        
            console.log("2 : ",decodedToken2);
            const expiresIn2 = decodedToken.exp - now;
            console.log(`JWT will expire in ${expiresIn2} seconds`); 
            res.clearCookie("jwt");
            res.cookie("jwt", new_token, {
              httpOnly: true,
              secure: true,
              maxAge: 24 * 60 * 60 * 1000,
            });        
        } catch (err) {
          console.error('Failed to verify JWT', err);
        }
        req.flash("success_msg", "Updated successfully!");
        res.redirect(`/users/edit`);
      })
      .catch((err) => {
        req.flash("error_msg", err);
        res.redirect(`/users/edit`);
      });
  }
  loginJWT(req, res, next) {
    const userName = req.body.userName;
    const password = req.body.password;
    User.findOne({ username: userName })
      .then((user) => {
        if (!user) {
          req.flash("error_msg", "This username is not registed!");
          return res.redirect("/users/login");
        }
        //Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            const token = jwt.sign(
              {
                user: {
                  userId: user._id.toString(),
                  name: user.name,
                  role: user.isAdmin === true ? "admin" : "user",
                },
              },
              "my_secret_key",
              {
                expiresIn: "5s",
              }
            );
            res.cookie("jwt", token, {
              httpOnly: true,
              secure: true,
              maxAge: 24 * 60 * 60 * 1000,
            });
            if (user.isAdmin === true) {
              console.log("zo admin");
              return res.redirect("/users/dashboard");
            } else {
              return res.redirect("/");
            }
          } else {
            req.flash("error_msg", "Password is incorrect!");
            return res.redirect("/users/login");
          }
        });
      })
      .catch((err) => console.log(err));
  }
  logout(req, res, next) {
    res.clearCookie("jwt");
    req.flash("success_msg", "You are logged out");
    res.redirect("/");
  }
}
module.exports = new userController();

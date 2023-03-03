const bcrypt = require("bcrypt");
const User = require("../model/user");
var passport = require("passport");
var jwt = require("jsonwebtoken");
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
          isLogin: req.session.passport === undefined ? false : true,
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
    res.render("login");
  }
  signin(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/users/dashboard",
      failureRedirect: "/users/login/",
      failureFlash: true,
    })(req, res, next);
  }

  dashboard(req, res, next) {
    
    res.render("dashboard",{title: "Dashboard", isLogin: req.session.passport === undefined ? false : true,})
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
    const userId = req.session.passport.user.id;
    console.log(userId);
    User.findById(userId)
      .then((user) => {
        console.log(user);
        res.render("profile", {
          title: "The detail of User",
          user: user,
          isLogin: req.session.passport === undefined ? false : true,
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
    User.updateOne({ _id: req.session.passport.user.id }, data)
      .then(() => {
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
            console.log("ok");
            const token = jwt.sign(
              {
                user: {
                  name: user.username,
                  role: user.isAdmin === true ? "admin" : "user",
                },
              },
              "my_secret_key",
              {
                expiresIn: "30m",
              }
            );
            console.log(token);
            res.cookie("jwt", token, { httpOnly: true });
            if (user.isAdmin === true) {
              console.log("zo admin");
              return res.redirect("/users/dashboard");}
            else { return res.redirect("/"); }
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
    req.flash("success_msg","you are logged out")
    res.redirect("/");
  }
}
module.exports = new userController();

const bcrypt = require("bcrypt");
const User = require("../model/user");
var passport = require("passport");
var authenticate = require('../config/auth');
class userController {
  index(req, res, next) {
    res.render("register");
  }
  loginJWT(req, res, next) {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
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
    console.log("dashboard: ",req.user);
    res.render("dashboard");
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
}

// app.post('/login', (req, res, next) => {
//     passport.authenticate('local', { session: false }, (err, user, info) => {
//         if (err) {
//             return next(err);
//         }
//         if (!user) {
//             req.flash('error', 'Invalid username or password');
//             return res.redirect('/login');
//         }
//         const token = jwt.sign({ username: user.username }, 'your_secret_key');
//         res.cookie('jwt', token, { httpOnly: true });
//         res.redirect('/protected');
//     })(req, res, next);
// });
// app.get('/protected', jwtAuth, (req, res) => {
//   res.render('protected', { user: req.user });
// });
// app.get('/logout', (req, res) => {
//   res.clearCookie('jwt');
//   req.logout();
//   res.redirect('/');
// });

// file ejs
// <script>
//     const token = '<%= req.cookies.jwt %>';
//     const headers = new Headers();
//     headers.append('Authorization', `Bearer ${token}`);
//     fetch('/api/data', { headers })
//         .then(response => response.json())
//         .then(data => console.log(data))
//         .catch(error => console.error(error));
// </script>
module.exports = new userController();

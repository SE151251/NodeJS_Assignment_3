const requireRole = (req, res, next) => {  
    console.log("data user: ",req.user);
      if (req.user && req.user.isAdmin === true) {
        console.log("ok");
        next();
      } else {
        console.log("no");
        req.flash('error_msg',"Access denied, your role is not admin")
        res.redirect('/users/login');
      }
    };
module.exports = {requireRole}
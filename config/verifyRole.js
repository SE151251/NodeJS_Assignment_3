const requireRole = (req, res, next) => {  
  console.log(req.user);
      if (req.user && req.user.role === "admin") {
        next();
      } else {
        req.flash('error_msg',"Access denied, your role is not admin")
        res.redirect('/');
      }
    };
module.exports = {requireRole}
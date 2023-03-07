var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports = {
    //with passport
        ensureAuthenticated: function(req, res, next) {
           if(req.isAuthenticated()){
               return next();
           }
           req.flash('error_msg', 'Please log in first!');
           res.redirect('/users/login');
        },
        //with jwt
        jwtAuth: (req, res, next) => {
         const token = req.cookies.jwt;
         console.log("token cookie", token);
         if (!token) {
            console.log("error token");
           req.flash('error_msg', 'Please log in first!');
           return res.redirect('/users/login');
         }
         jwt.verify(token, 'my_secret_key', (err, decoded) => {
           if (err) {
            console.log(err.message);
            req.flash('error_msg', err.message);
            return res.redirect('/users/login');
           }
           req.userId = decoded.user.userId;
           req.name = decoded.user.name;
           req.role = decoded.user.role;
           next();
         });
       } 
    }
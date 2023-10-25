const Orchids = require("../model/orchid");
const Categories = require("../model/category");
const Users = require("../model/user");
const jwt = require("jsonwebtoken");

class OrchidController {
  home(req, res, next) {
    if (req.cookies.jwt) {
      jwt.verify(req.cookies.jwt, "my_secret_key", (err, decoded) => {
        if (err) {
          req.name = undefined;
          req.role = undefined;
          Categories.find({})
            .then((categories) => {
              Orchids.find()
                .populate("category", ["categoryName"])
                .then((orchids) => {
                  res.render("index", {
                    title: "List of Orchids",
                    orchids: orchids,               
                    categoriesList: categories,
                    isLogin: { name: req.name, role: req.role },
                  });
                })
                .catch((err) => {
                  console.log(err);
                  next();
                });
            })
            .catch((err) => {
              console.log(err);
              next();
            });
        } else {
          req.userId = decoded.user.userId;
          req.name = decoded.user.name;
          req.role = decoded.user.role;
          Categories.find({})
            .then((categories) => {
              Orchids.find()
                .populate("category", ["categoryName"])
                .then((orchids) => {
                  res.render("index", {
                    title: "List of Orchids",
                    orchids:orchids,
                    categoriesList: categories,
                    isLogin: { name: req.name, role: req.role },
                  });
                })
                .catch((err) => {
                  console.log(err);
                  next();
                });
            })
            .catch((err) => {
              console.log(err);
              next();
            });
        }
      });
    } else {
        Categories.find({})
        .then((categories) => {
          Orchids.find({ isCaptain: true })
            .populate("nation", ["name", "description"])
            .then((orchids) => {
              res.render("index", {
                title: "List of Orchids",
                orchids: orchids,
                categoriesList: categories,
                isLogin: { name: req.name, role: req.role },
              });
            })
            .catch((err) => {
              console.log(err);
              next();
            });
        })
        .catch((err) => {
          console.log(err);
          next();
        });
    }
  }
  index = async function index(req, res, next) {
    const ITEMS_PER_PAGE = 10; // Số lượng players trên mỗi trang
    const page = +req.query.page || 1; // Lấy số trang hiện tại từ query string
    let totalItems; // Tổng số players trong cơ sở dữ liệu
    let totalPages;
    let regex;
    const filter_nation = req.query.category;
    if (req.query.name) {
      regex = new RegExp(req.query.name, "i");
    }
    const categories = await Categories.find();
    if (!req.query.name) {
       
      if (filter_nation) {
        const query = { category: filter_nation };                  
        Orchids.find(query)
          .countDocuments()
          .then((count) => {
           
            totalItems = count;
            totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE); // Tính tổng số trang
            return Orchids.find(query)
              .skip((page - 1) * ITEMS_PER_PAGE) // Bỏ qua các players trên trang hiện tại
              .limit(ITEMS_PER_PAGE) // Giới hạn số lượng players trên mỗi trang
              .populate("category", ["categoryName"])
              .exec();
          })
          .then((orchids) => {
         
            res.render("orchidSite", {
              title: "List of Orchids",
              orchids: orchids,       
              categoriesList: categories,
              isLogin: { name: req.name, role: req.role },
              currentPage: page,
              hasNextPage: ITEMS_PER_PAGE * page < totalItems,
              hasPreviousPage: page > 1,
              nextPage: page + 1,
              previousPage: page - 1,
              lastPage: totalPages,
            });
          })
          .catch((err) => {
            console.log(err);
            next();
          });
      } else {

        Orchids.find()
          .countDocuments()
          .then((count) => {
            totalItems = count;
            totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE); // Tính tổng số trang
            return Orchids.find()
              .skip((page - 1) * ITEMS_PER_PAGE) // Bỏ qua các players trên trang hiện tại
              .limit(ITEMS_PER_PAGE) // Giới hạn số lượng players trên mỗi trang
              .populate("category", ["categoryName"])
              .exec();
          })
          .then((orchids) => {
        
            res.render("orchidSite", {
              title: "List of Orchids",
              orchids: orchids,            
              categoriesList: categories,
              isLogin: { name: req.name, role: req.role },
              currentPage: page,
              hasNextPage: ITEMS_PER_PAGE * page < totalItems,
              hasPreviousPage: page > 1,
              nextPage: page + 1,
              previousPage: page - 1,
              lastPage: totalPages,
            });
          })
          .catch((err) => {
            console.log("err: ",err);
            next();
          });
      }
    } else {
      var query;
      if (filter_nation != undefined) {
        query = {
          name: { $regex: regex },       
          category: filter_nation,
        };
      }else{
        query = {
            name: { $regex: regex },       
           
          };
      } 
      Orchids.find(query)
        .countDocuments()
        .then((count) => {         
          totalItems = count;
          totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE); // Tính tổng số trang
          return Orchids.find(query)
            .skip((page - 1) * ITEMS_PER_PAGE) // Bỏ qua các players trên trang hiện tại
            .limit(ITEMS_PER_PAGE) // Giới hạn số lượng players trên mỗi trang
            .populate("category", ["categoryName"])
            .exec();
        })
        .then((orchids) => {      
          res.render("orchidSite", {
            title: "List of Orchids",
            orchids: orchids,     
            categoriesList: categories,
            isLogin: { name: req.name, role: req.role },
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: totalPages,
          });
        })
        .catch((err) => {
          console.log(err);
          next();
        });
    }
  };
  dashboard(req, res, next) {
    Promise.all([
      Orchids.countDocuments({}),
      Categories.countDocuments({}),
      Users.countDocuments({}),
    ])
      .then(([totalOrchids, totalCategories, totalUsers]) => {
        res.render("dashboard", {
          title: "Dashboard",
          totalOrchids: totalOrchids,
          totalCategories: totalCategories,
          totalUsers: totalUsers,
          isLogin: { name: req.name, role: req.role },
        });
      })
      .catch((err) => {
        console.error(err);
        next();
      });
  }

  create(req, res, next) {
    Categories.find({})
      .then((categories) => {
        if (categories.length === 0) {
          req.flash(
            "error_msg",
            "Please input data of Categories in Database first!!!"
          );
          return res.redirect("/Orchids");
        } else {
          var data = {
            name: req.body.name,
            image:
              req.file === undefined
                ? ""
                : `/images/Orchids/${req.file.originalname}`,
            origin: req.body.origin,          
            category: req.body.category,
            isNatural: req.body.isNatural === undefined ? false : true,
          };
          const orchid = new Orchids(data);
          Orchids.find({ name: orchid.name }).then((orchidCheck) => {
            if (orchidCheck.length > 0) {
              req.flash("error_msg", "Duplicate orchid name!");
              res.redirect("/orchids");
            } else {
                orchid
                .save()
                .then(() => res.redirect("/orchids"))
                .catch(next);
            }
          });
        }
      })
      .catch((err) => {
        req.flash("error_msg", "Server Error");
        return res.redirect("/orchids");
      });
  }
  orchidDetail(req, res, next) {
    const orchidId = req.params.orchidId;
    if (req.cookies.jwt) {
      jwt.verify(req.cookies.jwt, "my_secret_key", (err, decoded) => {
        if (err) {
          req.name = undefined;
          req.role = undefined;
          Categories.find({})
            .then((categories) => {
              Orchids.findById(orchidId)
                .populate("category", "categoryName")
                .then((orchid) => {
                  res.render("orchidDetail", {
                    title: "Detail of Orchid",
                    orchid: orchid,                 
                    categoriesList: categories,
                    isLogin: { name: req.name, role: req.role },
                  });
                })
                .catch(next);
            })
            .catch(next);
        } else {
          req.userId = decoded.user.userId;
          req.name = decoded.user.name;
          req.role = decoded.user.role;
          Categories.find({})
            .then((categories) => {
              Orchids.findById(orchidId)
                .populate("category", "categoryName")
                .then((orchid) => {
                  res.render("orchidDetail", {
                    title: "Detail of Orchid",
                    orchid: orchid,                  
                    categoriesList: categories,
                    isLogin: { name: req.name, role: req.role },
                  });
                })
                .catch(next);
            })
            .catch(next);
        }
      });
    } else {
      Categories.find({})
        .then((categories) => {
          Orchids.findById(orchidId)
            .populate("category", "categoryName")
            .then((orchid) => {
              res.render("orchidDetail", {
                title: "Detail of Orchid",
                orchid: orchid,             
                categoriesList: categories,
                isLogin: { name: req.name, role: req.role },
              });
            })
            .catch(next);
        })
        .catch(next);
    }
  }
  formEdit(req, res, next) {
    const orchidId = req.params.orchidId;
    Categories.find({})
      .then((categories) => {
        Orchids.findById(orchidId)
          .populate("category", "categoryName")
          .then((orchid) => {
            res.render("editorchid", {
              title: "Detail of Orchid",
              orchid: orchid,            
              categoriesList: categories,
              isLogin: { name: req.name, role: req.role },
            });
          })
          .catch(next);
      })
      .catch(next);
  }
  edit(req, res, next) {
    var data;
    if (!req.file) {
      data = {
        name: req.body.name,
        origin: req.body.origin,     
        category: req.body.category,
        isNatural: req.body.isNatural === undefined ? false : true,
      };
    } else {
      data = {
        name: req.body.name,
        image: `/images/Orchids/${req.file.originalname}`,
        origin: req.body.origin,     
        category: req.body.category,
        isNatural: req.body.isNatural === undefined ? false : true,
      };
    }
    Orchids.updateOne({ _id: req.params.orchidId }, data)
      .then(() => {
        res.redirect("/orchids");
      })
      .catch((err) => {
        console.log("error update: ", err);
        req.flash("error_msg", "Duplicate orchid name!");
        res.redirect(`/orchids/edit/${req.params.orchidId}`);
      });
  }
  delete(req, res, next) {
   Orchids.findByIdAndDelete({ _id: req.params.orchidId })
      .then(() => res.redirect("/orchids"))
      .catch(next);
  }
}
module.exports = new OrchidController();

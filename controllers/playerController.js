const Players = require("../model/player");
const Nations = require("../model/nation");
const Users = require("../model/user");
const jwt = require("jsonwebtoken");
let clubData = [
  { id: "1", name: "Arsenal" },
  { id: "2", name: "Manchester United" },
  { id: "3", name: "Chelsea" },
  { id: "4", name: "Manchester City" },
  { id: "5", name: "PSG" },
  { id: "6", name: "Inter Milan" },
  { id: "7", name: "Real Madrid" },
  { id: "8", name: "Barcelona" },
];
let postitionData = [
  { id: "1", name: "Goalkeeper" },
  { id: "2", name: "Centre Back" },
  { id: "3", name: "Left Back" },
  { id: "4", name: "Right Back" },
  { id: "5", name: "Sweeper" },
  { id: "6", name: "Center Midfielder" },
  { id: "7", name: "Left Midfielder" },
  { id: "8", name: "Right Midfielder" },
  { id: "9", name: " Attacker " },
];
class PlayerController {
  home(req, res, next) {
    if(req.cookies.jwt){
      jwt.verify(req.cookies.jwt, 'my_secret_key', (err, decoded) => {
        if (err) {
          req.name = undefined;
          req.role = undefined;
          Nations.find({})
      .then((nations) => {
        Players.find({ isCaptain: true })
          .populate("nation", ["name", "description"])
          .then((players) => {
            res.render("index", {
              title: "The list of Players",
              players: players,
              positionList: postitionData,
              clubList: clubData,
              nationsList: nations,
              isLogin: {name: req.name, role:req.role}
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
        }else{
        req.userId = decoded.user.userId;
        req.name = decoded.user.name;
        req.role = decoded.user.role;
        Nations.find({})
        .then((nations) => {
          Players.find({ isCaptain: true })
            .populate("nation", ["name", "description"])
            .then((players) => {
              res.render("index", {
                title: "The list of Players",
                players: players,
                positionList: postitionData,
                clubList: clubData,
                nationsList: nations,
                isLogin: {name: req.name, role:req.role}
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
    }else{
    Nations.find({})
      .then((nations) => {
        Players.find({ isCaptain: true })
          .populate("nation", ["name", "description"])
          .then((players) => {
            res.render("index", {
              title: "The list of Players",
              players: players,
              positionList: postitionData,
              clubList: clubData,
              nationsList: nations,
              isLogin: {name: req.name, role:req.role}
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
  dashboard(req, res, next){
    Promise.all([
      Players.countDocuments({}),
      Nations.countDocuments({}),
      Users.countDocuments({})
     ])
    .then(([totalPlayers, totalNations, totalUsers]) => {
     res.render('dashboard', {
      title: "Dashboard",
      totalNations: totalNations,
      totalPlayers: totalPlayers,
      totalUsers: totalUsers,
      isLogin: {name: req.name, role:req.role}
     })
    })
    .catch(err => {
      console.error(err);
      next()
    });
  }
  index(req, res, next) {
    Nations.find({})
      .then((nations) => {
        Players.find({})
          .populate("nation", ["name", "description"])
          .then((players) => {
            res.render("playerSite", {
              title: "The list of Players",
              players: players,
              positionList: postitionData,
              clubList: clubData,
              nationsList: nations,
              isLogin: {name: req.name, role:req.role}
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
  create(req, res, next) {
    Nations.find({})
      .then((nations) => {
        if (nations.length === 0) {
          req.flash(
            "error_msg",
            "Please input data of nations in Database first!!!"
          );
          return res.redirect("/players");
        } else {          
          var data = {
            name: req.body.name,
            image:
              req.file === undefined
                ? ""
                : `/images/Players/${req.file.originalname}`,
            career: req.body.career,
            position: req.body.position,
            goals: req.body.goals,
            nation: req.body.nation,
            isCaptain: req.body.isCaptain === undefined ? false : true,
          };
          const player = new Players(data);
          Players.find({ name: player.name }).then((playerCheck) => {
            if (playerCheck.length > 0) {
              req.flash("error_msg", "Duplicate player name!");
              res.redirect("/players");
            } else {
              player
                .save()
                .then(() => res.redirect("/players"))
                .catch(next);
            }
          });
        }
      })
      .catch((err) => {
        req.flash("error_msg", "Server Error");
        return res.redirect("/players");
      });
  }
  playerDetail(req, res, next) {
    const playerId = req.params.playerId;
      if(req.cookies.jwt){
        jwt.verify(req.cookies.jwt, 'my_secret_key', (err, decoded) => {
          if (err) {
            req.name = undefined;
            req.role = undefined;
            Nations.find({})
            .then((nations) => {
              Players.findById(playerId)
                .populate("nation", "name")
                .then((player) => {
                  res.render("playerDetail", {
                    title: "The detail of Player",
                    player: player,
                    positionList: postitionData,
                    clubList: clubData,
                    nationsList: nations,
                    isLogin: {name: req.name, role:req.role}
                  });
                })
                .catch(next);
            })
            .catch(next);
          }else{
          req.userId = decoded.user.userId;
          req.name = decoded.user.name;
          req.role = decoded.user.role;
          Nations.find({})
          .then((nations) => {
            Players.findById(playerId)
              .populate("nation", "name")
              .then((player) => {
                res.render("playerDetail", {
                  title: "The detail of Player",
                  player: player,
                  positionList: postitionData,
                  clubList: clubData,
                  nationsList: nations,
                  isLogin: {name: req.name, role:req.role}
                });
              })
              .catch(next);
          })
          .catch(next);
          }      
        });
      }else{
        Nations.find({})
        .then((nations) => {
          Players.findById(playerId)
            .populate("nation", "name")
            .then((player) => {
              res.render("playerDetail", {
                title: "The detail of Player",
                player: player,
                positionList: postitionData,
                clubList: clubData,
                nationsList: nations,
                isLogin: {name: req.name, role:req.role}
              });
            })
            .catch(next);
        })
        .catch(next);
      }

  }
  formEdit(req, res, next) {
    const playerId = req.params.playerId;
    Nations.find({})
      .then((nations) => {
        Players.findById(playerId).populate("nation", "name")
          .then((player) => {
            res.render("editPlayer", {
              title: "The detail of Player",
              player: player,
              positionList: postitionData,
              clubList: clubData,
              nationsList: nations,
              isLogin: {name: req.name, role:req.role}
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
        career: req.body.career,
        position: req.body.position,
        goals: req.body.goals,
        nation: req.body.nation,
        isCaptain: req.body.isCaptain === undefined ? false : true,
      };
    } else {
      data = {
        name: req.body.name,
        image: `/images/Players/${req.file.originalname}`,
        career: req.body.career,
        position: req.body.position,
        goals: req.body.goals,
        nation: req.body.nation,
        isCaptain: req.body.isCaptain === undefined ? false : true,
      };
    }
    Players.find({ name: req.body.name }).then((playerCheck) => {
      if (playerCheck.length > 0) {
        req.flash("error_msg", "Duplicate player name!");
        return res.redirect("/players");
      } else {
        Players.updateOne({ _id: req.params.playerId }, data)
        .then(() => {
          res.redirect("/players");
        })
        .catch((err) => {
          console.log("error update: ", err);
          req.flash("error_msg", "Duplicate player name!");
          res.redirect(`/players/edit/${req.params.playerId}`);
        });
      }
    });

  }
  delete(req, res, next) {
    Players.findByIdAndDelete({ _id: req.params.playerId })
      .then(() => res.redirect("/players"))
      .catch(next);
  }
}
module.exports = new PlayerController();

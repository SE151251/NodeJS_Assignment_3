const Players = require("../model/player");
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
  index(req, res, next) {
    Players.find({})
      .then((players) => {
        res.render("playerSite", {
          title: "The list of Players",
          players: players,
          positionList: postitionData,
          clubList: clubData,
        });
      })
      .catch(next);
  }
  create(req, res, next) {
    const player = new Players(req.body);
    console.log(req.body)
    // Players.find({ name: player.name })
    //   .then((player) => {
    //     if (player) {
    //       Players.find({})
    //       .then((players) => {
    //         return res.render("playerSite", {
    //           title: "The list of Players",
    //           players: players,
    //           positionList: postitionData,
    //           clubList: clubData,            
    //         });
    //       })
    //       .catch(next);
    //     }
    //   })
    //   .catch(next);
    if (player.isCaptain == undefined) {
      player.isCaptain = false;
    }
    player
      .save()
      .then(() => res.redirect("/players"))
      .catch(next);
  }

  formEdit(req, res, next) {
    const playerId = req.params.playerId;
    Players.findById(playerId)
      .then((player) => {
        res.render("editPlayer", {
          title: "The detail of Player",
          player: player,
          positionList: postitionData,
          clubList: clubData,
          errorMess:""
        });
      })
      .catch(next);
  }
  edit(req, res, next) {
    if (req.body.isCaptain == undefined) {
      req.body.isCaptain = false;
    }
    Players.updateOne({ _id: req.params.playerId }, req.body)
      .then(() => {
        res.redirect("/players");
      })
      .catch(next);
  }
  delete(req, res, next) {
    Players.findByIdAndDelete({ _id: req.params.playerId })
      .then(() => res.redirect("/players"))
      .catch(next);
  }
}
module.exports = new PlayerController();
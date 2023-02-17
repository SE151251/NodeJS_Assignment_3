const Nations = require('../model/nation');
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
class NationController{
    index(req, res, next) {
        console.log("err")
        Nations.find({})
        .then((nations) => {
            res.render("nationSite", {
                title: "The list of Nations",
                nations: nations,
                positionList: postitionData,
                clubList: clubData,
                errorMess:""
            }

            );
        })
        .catch(next);
    }
    create(req, res, next) {
        const nation = new Nations(req.body);
        Nations.find({ name: nation.name })
        .then((nation) => {
        if (nation) {
            Nations.find({})
            .then((nations) => {
               return res.render("nationSite", {
                    title: "The list of Nations",
                    nations: nations,
                    positionList: postitionData,
                    clubList: clubData,
                    errorMess:"Duplicate name of nation !!!"
                }
                );
            })          
        }
        else{
            nation
            .save()
            .then(() => res.redirect("/nations"))
            .catch(next);
        }
      })
        
    }
    formEdit(req, res, next) {
        const nationId = req.params.nationId;
        Nations.findById(nationId)
        .then((nation) => {
            res.render("editNation", {
                title: "The detail of Nation",
                nation: nation,
                positionList: postitionData,
                clubList: clubData,
                errorMess:""
            })
        })
        .catch(next);
    }
    edit(req, res, next) {
        Nations.updateOne({_id: req.params.nationId}, req.body)
        .then(() => {
            res.redirect("/nations");
        })
        .catch((err) => {
            res.render("editNation", {
                title: "The detail of Nation",
                nation: req.body,
                positionList: postitionData,
                clubList: clubData,
                errorMess:"This nation name is already in use!!! Please input another name"
            })
        });
    }
    delete(req, res, next) {
        Nations.findByIdAndDelete({_id: req.params.nationId})
        .then(() => res.redirect("/nations"))
        .catch(next);
    }
}
module.exports = new NationController();
const Nations = require("../model/nation");
class NationController {
  index(req, res, next) {
    Nations.find({})
      .then((nations) => {   
        res.render("nationSite", {
          title: "The list of Nations",
          nations: nations,
        });
      })
      .catch(next);
  }
  create(req, res, next) {
    const nation = new Nations(req.body);
    console.log(nation.name);
    Nations.find({ name: nation.name }).then((nationCheck) => {
      if (nationCheck.length > 0) {
        req.flash("error_msg", "Duplicate nation name!");
        res.redirect("/nations");
      } else {
        nation
          .save()
          .then(() => res.redirect("/nations"))
          .catch(next);
      }
    });
  }
  formEdit(req, res, next) {
    const nationId = req.params.nationId;
    Nations.findById(nationId)
      .then((nation) => {
        res.render("editNation", {
          title: "The detail of Nation",
          nation: nation,
        });
      })
      .catch(next);
  }
  edit(req, res, next) {
    Nations.updateOne({ _id: req.params.nationId }, req.body)
      .then(() => {
        res.redirect("/nations");
      })
      .catch((err) => {
        res.render("editNation", {
          title: "The detail of Nation",
          nation: req.body,
          errorMess:
            "This nation name is already in use!!! Please input another name",
        });
      });
  }
  delete(req, res, next) {
    Nations.findByIdAndDelete({ _id: req.params.nationId })
      .then(() => res.redirect("/nations"))
      .catch(next);
  }
}
module.exports = new NationController();

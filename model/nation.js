const mongoose = require("mongoose");
mongoose.set('strictQuery',true);
const Schema = mongoose.Schema;
var commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var nationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
   // comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

var Nations = mongoose.model("nations", nationSchema);

module.exports = Nations;

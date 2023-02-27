var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:  {
        type: String,
        required: true
    },
    name:  {
        type: String,
        required: true
    },
    YOB:  {
        type: String,
        required: true
    },
    isAdmin:  {
        type: Boolean,
        required: true,
        default: false
    }
},
{timestamps: true});

module.exports = mongoose.model('users', userSchema);

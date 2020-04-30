const mongoose = require("mongoose");
var Schema = mongoose.Schema;


var userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /@/
    },
    age: Number,
    sports: [String],
},{timestamps: true});

var User = mongoose.model("User", userSchema);
module.exports = User;

//module.exports = mongoose.model("User", userSchema);
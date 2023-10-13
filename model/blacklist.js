const { default: mongoose } = require("mongoose");

const blacklistToken = new mongoose.Schema({
    token: { type: String, required: true },
})

const Btoken = mongoose.model("bToken",blacklistToken)

module.exports = Btoken
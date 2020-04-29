const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    UserID: {type: Number, required: true, index: {unique: true}},
    // is_bot: Boolean,
    first_name: {type: String, required: true},
    // last_name: String,
    // username: 	String,
    // language: String,
    // can_join_groups: Boolean,
    // can_read_all_group_messages: Boolean,
    // supports_inline_queries: Boolean,
    location: [Number, Number],
    lastTempMeasured: Date,
    tempMeasurement: []
}, {timestamps: true});

module.exports = {
    UserModel: mongoose.model('User', UserSchema)
}
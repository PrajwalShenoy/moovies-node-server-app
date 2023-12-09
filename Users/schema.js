import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName:{ type:  String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    memberSince: Date,
    followers: Array,
    following: Array,
    watchlist: Array,
}, {collection: "users"});

export default userSchema;
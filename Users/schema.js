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
    role: Array,
    currentRole: String,
}, {collection: "users"});

const requestSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    userId: { type: Number, required: true },
    firstName: { type: String, required: true },
    lastName:{ type:  String, required: true },
    username: { type: String, required: true },
    requestedRole: { type: String, required: true },
    completed: { type: Boolean, required: true }
}, {collection: "requests"});

const reviewSchema = new mongoose.Schema({
                                              id: { type: Number, required: true, unique: true },
                                              userId: { type: Number, required: true },
                                             movieId: { type: Number, required: true },
                                            review:{ type:  String, required: true },
                                          }, {collection: "reviews"});



export { userSchema, requestSchema, reviewSchema };
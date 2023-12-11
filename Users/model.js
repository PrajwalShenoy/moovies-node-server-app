import mongoose from 'mongoose';
import { userSchema, requestSchema, reviewSchema } from './schema.js';

const userModel = mongoose.model("users", userSchema);
const requestModel = mongoose.model("requests", requestSchema);
const reviewModel = mongoose.model("reviews", reviewSchema);

export { userModel, requestModel, reviewModel };
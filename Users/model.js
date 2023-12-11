import mongoose from 'mongoose';
import { userSchema, requestSchema, reviewSchema } from './schema.js';

const userModel = mongoose.model("users", userSchema);
const requestModel = mongoose.model("requests", requestSchema);
const reviewModel = mongoose.model("requests", reviewSchema);

export { userModel, requestModel, reviewModel };
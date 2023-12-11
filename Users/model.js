import mongoose from 'mongoose';
import { userSchema, requestSchema } from './schema.js';

const userModel = mongoose.model("users", userSchema);
const requestModel = mongoose.model("requests", requestSchema);

export { userModel, requestModel };
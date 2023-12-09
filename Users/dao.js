import model from './model.js';

export const getAllUsers = () => model.find();
export const findUserByCredentials = (username, password) => {
    return model.findOne({ username: username, password: password });
};
import model from './model.js';

export const getAllUsers = () => model.find();
export const findUserByCredentials = (username, password) => {
    return model.findOne({ username: username, password: password });
};
export const createUser = (user) => model.create(user);
export const addToWatchlist = (userId, movieId) => {
    return model.updateOne({ id: userId }, { $push: { watchlist: movieId } });
};
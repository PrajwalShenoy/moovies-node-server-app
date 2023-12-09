import model from './model.js';

export const getAllUsers = () => model.find();
export const findUserByCredentials = (username, password) => {
    return model.findOne({ username: username, password: password });
};
export const createUser = (user) => model.create(user);
export const addToWatchlist = (userId, movieId) => {
    console.log(userId, movieId);
    return model.updateOne({ id: userId }, { $push: { watchlist: movieId } })
    .then((response) => {
        console.log(response);
    });
};
export const getWatchlist = (userId) => {
    return model.findOne({ id: userId }, { watchlist: 1, _id: 0 });
}
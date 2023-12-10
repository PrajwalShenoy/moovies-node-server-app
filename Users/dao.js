import model from './model.js';

export const getAllUsers = () => model.find();
export const findUserByCredentials = (username, password) => {
    return model.findOne({ username: username, password: password });
};
export const createUser = (user) => model.create(user);
export const addToWatchlist = (userId, movieId) => {
    return model.updateOne({ id: userId }, { $push: { watchlist: movieId } })
    .then((response) => {
        console.log(response);
    });
};
export const removeFromWatchlist = (userId, movieId) => {
    console.log("User ID: " + userId + " Movie ID: " + movieId);
    return model.updateOne({ id: userId }, { $pull: { watchlist: movieId } })
    .then((response) => {
        console.log(response);
    });
};
export const getWatchlist = (userId) => {
    return model.findOne({ id: userId }, { watchlist: 1, _id: 0 });
};
export const followUser = (userId, followId) => {
    model.updateOne({ id: userId }, { $push: { following: parseInt(followId) } })
    .then((response) => {
        console.log(response);
    });
    model.updateOne({ id: followId }, { $push: { followers: parseInt(userId) } })
    .then((response) => {
        console.log(response);
    });
};

export const unfollowUser = (userId, followId) => {
    model.updateOne({ id: userId }, { $pull: { following: parseInt(followId) } })
    .then((response) => {
        console.log(response);
    });
    model.updateOne({ id: followId }, { $pull: { followers: parseInt(userId) } })
    .then((response) => {
        console.log(response);
    });
};
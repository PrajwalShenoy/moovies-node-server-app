import { userModel, requestModel } from './model.js';

export const getAllUsers = () => userModel.find();
export const findUserByCredentials = (username, password) => {
    return userModel.findOne({ username: username, password: password });
};
export const createUser = (user) => userModel.create(user);
export const addToWatchlist = (userId, movieId) => {
    return userModel.updateOne({ id: userId }, { $push: { watchlist: movieId } })
    .then((response) => {
        console.log(response);
    });
};
export const removeFromWatchlist = (userId, movieId) => {
    console.log("User ID: " + userId + " Movie ID: " + movieId);
    return userModel.updateOne({ id: userId }, { $pull: { watchlist: movieId } })
    .then((response) => {
        console.log(response);
    });
};
export const getWatchlist = (userId) => {
    return userModel.findOne({ id: userId }, { watchlist: 1, _id: 0 });
};
export const followUser = (userId, followId) => {
    userModel.updateOne({ id: userId }, { $push: { following: parseInt(followId) } })
    .then((response) => {
        console.log(response);
    });
    userModel.updateOne({ id: followId }, { $push: { followers: parseInt(userId) } })
    .then((response) => {
        console.log(response);
    });
};

export const unfollowUser = (userId, followId) => {
    userModel.updateOne({ id: userId }, { $pull: { following: parseInt(followId) } })
    .then((response) => {
        console.log(response);
    });
    userModel.updateOne({ id: followId }, { $pull: { followers: parseInt(userId) } })
    .then((response) => {
        console.log(response);
    });
};

export const getUserRoles = (userId) => {
    return userModel.findOne({ id: userId }, { role: 1, _id: 0 });
};

export const updateUserCurrentRole = (userId, roles) => {
    return userModel.updateOne({ id: userId }, { $set: { currentRole: roles } })
    .then((response) => {
        console.log(response);
    });
};

export const removeUserRole = (userId, role) => {
    userModel.updateOne({ id: userId }, { $pull: { role: role } })
    .then((response) => {
        console.log(response);
    });
};

export const getRequests = async () => {
    const response = await requestModel.find({"completed": false});
    return response;
}

export const createRequest = async (request) => {
    const pendingRequest = await requestModel.findOne({ "userId": request.userId, "requestedRole": request.requestedRole, "completed": false });
    if (pendingRequest) {
        return null;
    }
    return await requestModel.create(request);
}

export const updateRequest = async (requestId, approved) => {
    console.log("Request ID: " + requestId + " Approved: " + approved);
    const pendingRequest = await requestModel.findOne({ "id": requestId });
    if (approved) {
        await userModel.updateOne({ "id": pendingRequest.userId }, { $push: { "role": pendingRequest.requestedRole } })
        .then((response) => {
            console.log(response);
        });
    }
    requestModel.updateOne({ id: requestId }, { $set: { completed: true } })
    .then((response) => {
        console.log(response);
    });
}
import Database from "../Database/index.js";
import * as dao from "./dao.js";

function UsersRoutes(app) {

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const generateUnqueNumber = () => {
        const currentDate = new Date();
        const uniqueNumber = Number(currentDate.toISOString().replace(/[^0-9]/g, ''));

        return uniqueNumber;
    };

    app.post("/api/users", (req, res) => {
        const user = {
            ...req.body,
            memberSince: getCurrentDate(),
            id: generateUnqueNumber(),
            followers: [],
            following: [],
            watchlist: []
        };
        dao.createUser(user);
        res.send(user);
    });

    const getAllUsers = async (req, res) => {
        const users = await dao.getAllUsers();
        res.send(users);
    };

    const signinUser = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        req.session['currentUser'] = currentUser;
        res.json(currentUser);
    };

    const signoutUser = async (req, res) => {
        await dao.updateUserCurrentRole(req.session['currentUser'].id, req.session['currentUser'].currentRole);
        req.session.destroy();
        res.sendStatus(204);
    };

    const getCurrentUser = (req, res) => {
        if (req.session['currentUser']) {
            req.session['currentUser'].following = req.session['currentUser'].following.map((f) => parseInt(f));
            req.session['currentUser'].followers = req.session['currentUser'].followers.map((f) => parseInt(f));
        }
        res.json(req.session['currentUser']);
    };

    const followUser = async (req, res) => {
        const { userId, followId } = req.params;
        await dao.followUser(userId, followId);
        req.session['currentUser'].following.push(followId);
        res.status(200).send("User followed");
    };

    const unfollowUser = async (req, res) => {
        const { userId, followId } = req.params;
        await dao.unfollowUser(userId, followId);
        req.session['currentUser'].following = req.session['currentUser'].following.filter((f) => f !== followId);
        res.status(200).send("User unfollowed");
    };

    app.delete("/api/users/:id", (req, res) => {
        const { id } = req.params;
        Database.users = Database.users
            .filter((c) => c._id !== id);
        res.sendStatus(204);
    });
    app.put("/api/users/:id", (req, res) => {
        const { id } = req.params;
        const user = req.body;
        Database.users = Database.users.map((c) =>
            c._id === id ? { ...c, ...user } : c
        );
        res.sendStatus(204);
    });

    const getUserRoles = async (req, res) => {
        const { userId } = req.params;
        const user = await dao.getUserRoles(userId);
        res.send(user);
    };

    const setCurrentRole = (req, res) => {
        const { role } = req.body;
        if (req.session['currentUser'].role.includes(role)) {
            req.session['currentUser']["currentRole"] = role;
            res.sendStatus(204);
        } else {
            res.status(401).send("Unauthorized");
        }
    };

    const getAllPendingRequests = async (req, res) => {
        const response = await dao.getRequests();
        res.json(response);
    };

    const createRequest = async (req, res) => {
        if (req.session['currentUser']) {
            const { requestedRole } = req.body;
            const request = {
                id: generateUnqueNumber(),
                userId: req.session['currentUser'].id,
                firstName: req.session['currentUser'].firstName,
                lastName: req.session['currentUser'].lastName,
                username: req.session['currentUser'].username,
                requestedRole: requestedRole,
                completed: false
            };
            const response = await dao.createRequest(request);
            if (response) {
                res.status(201).json(request);
            } else {
                res.status(409).send("Request already exists");
            }
        } else {
            res.status(401).send("Unauthorized");
        }
    };

    const completeRequest = async (req, res) => {
        if (req.session['currentUser'].role.includes("Admin")) {
            const { requestId } = req.params;
            const { approved } = req.body;
            await dao.updateRequest(requestId, approved);
            res.status(201).send(`Request marked as completed, access granted - ${approved}`);
        } else {
            res.status(401).send("Unauthorized");
        }
    }

    const removeUserRole = async (req, res) => {
        const { role } = req.body;
        const response = await dao.removeUserRole(req.session['currentUser'].id, role);
        res.status(201).send(`Role removed - ${role}`);
    };


    app.get("/api/requests", getAllPendingRequests);
    app.post("/api/requests", createRequest);
    app.post("/api/deleterole", removeUserRole);
    app.post("/api/requests/:requestId", completeRequest);
    app.get("/api/users/roles/:userId", getUserRoles);
    app.post("/api/users/signin", signinUser);
    app.get("/api/users/account", getCurrentUser);
    app.get("/api/users", getAllUsers);
    app.post("/api/users/signout", signoutUser);
    app.post("/api/users/setrole", setCurrentRole);
    app.post("/api/users/:userId/follow/:followId", followUser);
    app.post("/api/users/:userId/unfollow/:followId", unfollowUser);

    app.get("/api/users/:id", (req, res) => {
        const { id } = req.params;
        const user = Database.users
        .find((c) => c.id === parseInt(id));
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        res.send(user);
    });

    app.get('/api/reviews/:movieId', async (req, res) => {
        const {movieId} = req.params;
        try {
            const reviews = await dao.getReviewsByMovieId(movieId);
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

// app.post('/api/reviews/', async (req, res) => {
//     const review = req.body;
//
//     try {
//         const newReview = await dao.createReview(review);
//
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

    app.post('/api/reviews', async (req, res) => {
        let review = req.body;

        try {
            review = {
                ...review,
                id: generateUnqueNumber(),
                userId: req.session["currentUser"].id
            }
            const newReview = await dao.createReview(review);
            res.status(200);

        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });



}
export default UsersRoutes;

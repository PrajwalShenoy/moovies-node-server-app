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

    const generateUserId = () => {
        const currentDate = new Date();
        const uniqueNumber = Number(currentDate.toISOString().replace(/[^0-9]/g, ''));

        return uniqueNumber;
    };

    app.post("/api/users", (req, res) => {
        const user = {
            ...req.body,
            memberSince: getCurrentDate(),
            id: generateUserId(),
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
        req.session.destroy();
        res.sendStatus(204);
    };

    const getCurrentUser = (req, res) => {
        res.json(req.session['currentUser']);
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



    app.post("/api/users/signin", signinUser);
    app.get("/api/users/account", getCurrentUser);
    app.get("/api/users", getAllUsers);
    app.post("/api/users/signout", signoutUser);

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


}
export default UsersRoutes;

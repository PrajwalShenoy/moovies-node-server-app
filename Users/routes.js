import Database from "../Database/index.js";
function UsersRoutes(app) {
    app.post("/api/users", (req, res) => {
        const user = {
            ...req.body,
            _id: new Date().getTime().toString()
        };
        Database.users.push(user);
        res.send(user);
    });

    app.get("/api/users", (req, res) => {
        const users = Database.users;
        res.send(users);
    });

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

    app.get("/api/users/:id", (req, res) => {
        const { id } = req.params;
        const user = Database.users
            .find((c) => c._id === id);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        res.send(user);
    });


}
export default UsersRoutes;

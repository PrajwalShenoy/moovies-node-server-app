import express from 'express'
import Hello from "./hello.js"
import UsersRoutes from "./Users/routes.js";

import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
Hello(app)
UsersRoutes(app)
app.listen(4000)


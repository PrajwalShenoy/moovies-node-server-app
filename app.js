import express from 'express'
import Hello from "./hello.js"
import UsersRoutes from "./Users/routes.js";
import MoviesRoutes from "./Movies/routes.js";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import session from "express-session";

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

mongoose
    .connect(CONNECTION_STRING)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    })



const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.CORS_URL
}));
const sessionOptions = {
    secret: "any string",
    resave: false,
    saveUninitialized: true,
};
app.use(
    session(sessionOptions)
);
app.use(express.json());
Hello(app);
UsersRoutes(app);
MoviesRoutes(app);
app.listen(4000)


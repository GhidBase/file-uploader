// Environment variables
import dotenv from "dotenv";
dotenv.config();

// Express
import express from "express";
import router from "./routes/router.js";
const app = express();

// Database automatic initialization
import dbController from "./controllers/authController.js";
dbController.initializeDatabase();

// Authentication
import session from "express-session";
import pgSession from "connect-pg-simple";
const PgStore = pgSession(session);
import passport from "passport";
import "./config/passport.js";
import pool from "./db/pool.js";
app.use(
    session({
        store: new PgStore({
            pool,
            tableName: "session", // optional
        }),
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000,
        },
    })
);
app.use(passport.session());

// For view engine - EJS
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// creates a path to the public assets
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// To allow form inputs
// Without this, form submissions would have
// an empty req.body
// "extended: true" allows nested objects in the data
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

const PORT = process.env.PORT;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log("App started");
});

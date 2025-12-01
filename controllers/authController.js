import db from "../db/authQueries.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

async function initializeDatabase(req, res) {
    // These functions automatically write a
    // console log to the server if they need
    // to make tables
    Promise.all([
        db.initializeMessages(),
        db.initializeUsers(),
        db.initializeSessionTable(),
    ]);
}

async function addUser(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const hashed_password = await bcrypt.hash(password, 10);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("index", {
            errors: errors.array(),
            username: username,
            password: password,
        });
    }

    const userExists = await db.checkUserExists(username);
    if (userExists) {
        return res.status(400).render("index", {
            errors: [{ msg: "Account already exists" }],
            username: username,
            password: password,
        });
    }

    db.addUser(username, hashed_password);
    res.redirect("/");
}

export default { initializeDatabase, addUser };

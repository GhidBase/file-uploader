import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import db from "../db/authQueries.js";
import bcrypt from "bcryptjs";

// This strategy only runs if both username and password are
// passed to it, else it doesn't run at all
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await db.getUser(username);
            const user = rows[0];

            if (!user) {
                console.log("Incorrect username");
                return done(null, false, { message: "Incorrect username" });
            }

            const match = await bcrypt.compare(password, user.password_hash);
            if (!match) {
                console.log("incorrect password");
                console.log(user.password_hash);
                console.log(password);
                return done(null, false, { message: "Incorrect password" });
            }
            console.log("success");
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    // here I'm storing only the id in the session cookie
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await db.getUserById(id);
        const user = rows[0];

        done(null, user);
    } catch (err) {
        done(err);
    }
});

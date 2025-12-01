import { Router } from "express";
const router = Router();

import authController from "../controllers/authController.js";
import { validateSignup } from "../validators/authValidators.js";
import passport from "passport";

router.post("/sign-up", [validateSignup, authController.addUser]);

router.post(
    "/log-in",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
    })
);

router.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

router.get("/", async (req, res) => {
    res.render("index", { user: req.user });
});

export default router;

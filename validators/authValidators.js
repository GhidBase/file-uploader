import { body } from "express-validator";

export const validateSignup = [
    body("username").notEmpty().withMessage("Username cannot be empty"),
    body("password")
        .isLength({ min: 1 })
        .withMessage("Password cannot be empty"),
];

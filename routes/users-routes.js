const express = require("express");
const router = express.Router();
const usersController = require("./../controllers/users-controller");
const { check } = require("express-validator");
const fileupload = require("./../middleware/file-upload");

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  fileupload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5 }),
  ],
  usersController.signUp
);

router.post("/login", usersController.logIn);

module.exports = router;

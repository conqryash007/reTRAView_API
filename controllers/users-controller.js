const httpError = require("./../models/http-error");
const User = require("./../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new httpError("Fetching user data failed !", 500));
  }
  res
    .status(200)
    .json({ users: users.map((u) => u.toObject({ getters: true })) });
};

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new httpError("Something wrong in the input field", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new httpError("SignUp failed! Try again.", 500));
  }
  if (existingUser) {
    return next(
      new httpError("User already exists. Please check input or login.", 500)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new httpError("Cannot create user.", 500));
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    places: [],
    image: req.file.path,
  });

  try {
    await newUser.save();
  } catch (err) {
    return next(new httpError("Something went wrong !", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.PRIVATE_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new httpError("Something went wrong !.Sign up failed!", 500));
  }

  res
    .status(201)
    .send({ userId: newUser.id, email: newUser.email, token: token });
};

exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;

  let currUser;
  try {
    currUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new httpError("Loggin in failed! Try again.", 500));
  }

  if (!currUser) {
    return next(new httpError("Invalid credentials. Could not log in.", 403));
  }

  let isValid;
  try {
    isValid = await bcrypt.compare(password, currUser.password);
  } catch (err) {
    return next(new httpError("Loggin in failed! Try again.", 500));
  }

  if (!isValid) {
    return next(new httpError("Invalid credentials. Could not log in.", 403));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: currUser.id, email: currUser.email },
      process.env.PRIVATE_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new httpError("Something went wrong. Log in failed!", 500));
  }

  res
    .status(201)
    .json({ userId: currUser.id, email: currUser.email, token: token });
};

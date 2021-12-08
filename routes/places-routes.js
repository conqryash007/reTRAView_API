const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const placeController = require("./../controllers/places-controller");
const fileupload = require("./../middleware/file-upload");

router.get("/:pid", placeController.getPlaceById);

router.get("/users/:uid", placeController.getPlacesByUser);

router.post(
  "/",
  fileupload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placeController.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placeController.updatePlaceById
);

router.delete("/:pid", placeController.deletePlaceById);
module.exports = router;

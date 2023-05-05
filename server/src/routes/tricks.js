import express from "express";
import { TricksModel } from "../models/Tricks.js";
import { UserModel } from "../models/Users.js";

const router = express.Router();

// route to get all tricks
router.get("/", async (req, res) => {
  try {
    const response = await TricksModel.find({});
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

// route to post a trick to the database
router.post("/", async (req, res) => {
  const trick = new TricksModel(req.body);

  try {
    const response = await trick.save();
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

// route for saving tricks to the user
router.put("/", async (req, res) => {
  try {
    // get trick and user id to insert
    const trick = await TricksModel.findById(req.body.trickID);
    const user = await UserModel.findById(req.body.userID);

    // push trick to user's completedTricks
    user.completedTricks.push(trick);
    // save the changes into collection
    await user.save();

    res.json({ completedTricks: user.completedTricks });
  } catch (err) {
    res.json(err);
  }
});

// route for deleting tricks from the user
router.delete("/", async (req, res) => {
  try {
    // get trick and user id to delete
    const trick = await TricksModel.findById(req.body.trickID);
    const user = await UserModel.findById(req.body.userID);

    const trickId = trick._id.toString();

    // deletes all instances of trickId in the user's completedTricks
    await UserModel.updateOne(
      { _id: user._id },
      { $pull: { completedTricks: trickId } }
    );
    // if not saving for some reason, try to ADD await user.save();

    res.json({ message: "Successful Deletion!" });
  } catch (err) {
    console.error(err);
  }
});

// route for getting the user's completedTricks
router.get("/completedTricks/:userID", async (req, res) => {
  try {
    // finds current user, passing in the userID through params
    const user = await UserModel.findById(req.params.userID);

    // query for saved recipes, get IDs that are $in user.savedRecipes
    const completedTricks = await TricksModel.find({
      _id: { $in: user.completedTricks },
    });

    // return saved recipes
    res.json({ completedTricks });
  } catch (err) {
    res.json(err);
  }
});

// getting list of saved trick IDs from current user
// routes gets the trick IDs that were saved by a user given that user's ID
router.get("/completedTricks/ids/:userID", async (req, res) => {
  try {
    // finds current user, passing in the userID through params, passing through body is not allowed
    const user = await UserModel.findById(req.params.userID);
    // return saved recipes, ? indicates the value may be null
    res.json({ completedTricks: user?.completedTricks });
  } catch (err) {
    res.json(err);
  }
});

// route for saving tricks to the user's wishlist
router.put("/wishlist", async (req, res) => {
  try {
    // get trick and user id to insert
    const trick = await TricksModel.findById(req.body.trickID);
    const user = await UserModel.findById(req.body.userID);

    // push trick to user's completedTricks
    user.wishlistTricks.push(trick);
    // save the changes into collection
    await user.save();

    res.json({ wishlistTricks: user.wishlistTricks });
  } catch (err) {
    res.json(err);
  }
});

// route for deleting tricks from the user's wishlist
router.delete("/wishlist", async (req, res) => {
  try {
    // get trick and user id to delete
    const trick = await TricksModel.findById(req.body.trickID);
    const user = await UserModel.findById(req.body.userID);

    const trickId = trick._id.toString();

    // deletes all instances of trickId in the user's wishlistTricks
    await UserModel.updateOne(
      { _id: user._id },
      { $pull: { wishlistTricks: trickId } }
    );
    // if not saving for some reason, try to ADD await user.save();

    res.json({ message: "Successful Deletion!" });
  } catch (err) {
    console.error(err);
  }
});

// route for getting the user's wishlistTricks
router.get("/wishlist/:userID", async (req, res) => {
  try {
    // finds current user, passing in the userID through params
    const user = await UserModel.findById(req.params.userID);

    // query for wishlist tricks, get IDs that are $in user.wishlistTricks
    const wishlistTricks = await TricksModel.find({
      _id: { $in: user.wishlistTricks },
    });

    // return wishlist tricks
    res.json({ wishlistTricks });
  } catch (err) {
    res.json(err);
  }
});

// getting list of saved wishlist IDs from current user
// routes gets the wishlist IDs that were saved by a user given that user's ID
router.get("/wishlist/ids/:userID", async (req, res) => {
  try {
    // finds current user, passing in the userID through params, passing through body is not allowed
    const user = await UserModel.findById(req.params.userID);
    // return wishlistTricks, ? indicates the value may be null
    res.json({ wishlistTricks: user?.wishlistTricks });
  } catch (err) {
    res.json(err);
  }
});

export { router as tricksRouter };

const express = require("express");
const router = express.Router();

const { getUserById, updateUser, deleteUser } = require("./user.query");
const auth = require("../auth/auth");

router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/me", auth, async (req, res, next) => {
  try {
    const { username, firstname, lastname, email, phone } = req.body;

    if (!username || !email) {
      return res
        .status(400)
        .json({ message: "username and mail required" });
    }

    const affected = await updateUser(
      req.user.id,
      username,
      firstname,
      lastname,
      email,
      phone
    );

    if (affected === 0) {
      return res.status(404).json({ message: "user not found" });
    }

    const updatedUser = await getUserById(req.user.id);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete("/me", auth, async (req, res, next) => {
  try {
    const affected = await deleteUser(req.user.id);
    if (affected === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json({ message: "user deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

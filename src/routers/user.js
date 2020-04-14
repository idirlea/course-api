const express = require("express");
const router = express.Router();
const User = require("../models/User");

const auth = require("../middleware/auth");


router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    res.json([...users]);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/users", async (req, res) => {
  try {
    const { _id, password, ...rest } = req.body;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error({ error: "Invalid user credentials" });
    }

    if (password) {
      rest.password = password
    }

    await user.updateOne(rest);
    await user.save();

    const updatedUser = await User.findById(_id);

    res.json({ user: updatedUser });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users", async (req, res) => {
  // Create a new user
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  //Login a registered user
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/users', async (req, res) => {
  try {
    if (req.query.id) {
      User.deleteOne({ _id: req.query.id }, function(err) {
        if (err) {
          throw { error: err };
        }

        res.json({ success: true });
      });
    }


  } catch (e) {
      res.status(400).send(error);
  }
});


module.exports = router;

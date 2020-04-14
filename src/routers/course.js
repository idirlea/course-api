const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// const auth = require("../middleware/auth");

router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find({});

    if (!courses) {
      return res
        .status(401)
        .send({ error: "Fetching courses failed!" });
    }
    res.json([...courses || []]);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/courses", async (req, res) => {
  try {
    const { _id, ...rest } = req.body;
    const course = await Course.findById(_id);

    if (!course) {
      throw new Error({ error: "Invalid course id" });
    }

    await course.updateOne(rest);
    await course.save();

    const updatedCourse = await Course.findById(_id);

    res.json({ course: updatedCourse });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/course", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();

    res.status(201).send({ course, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/courses", async (req, res) => {
  try {
    if (req.query.id) {
      Course.deleteOne({ _id: req.query.id }, function(err) {
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
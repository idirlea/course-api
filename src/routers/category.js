const express = require('express');
const router = express.Router();
const { Category } = require('../db/db');
const { check, query } = require('express-validator');

const auth = require('../middleware/auth');


router.get('/categories', [check('name').isString(), query('id').isUUID()], async (req, res) => {
  try {
    const query = req.query && req.query.id ? { _id: req.query.id } : {};
    const categories = await Category.find(query);

    if (!categories) {
      return res.status(401).send({ error: 'Fetching categories failed!' });
    }

    res.json([...categories]);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put(
  '/categories',
  [auth, check('name').isString()],
  async (req, res) => {
    try {
      const { _id, ...rest } = req.body;
      const category = await Category.findById(_id);

      if (!category) {
        throw new Error({ error: 'Invalid category id' });
      }

      await category.updateOne(rest);
      await category.save();

      const updatedCategory = await Category.findById(_id);

      res.json({ category: updatedCategory });
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.post(
  '/categories',
  [auth, check('name').isString()],
  async (req, res) => {
    try {
      const { _id, ...rest } = req.body;

      const category = new Category(rest);
      await category.save();

      res.status(201).send({ category });
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.delete('/categories', [auth, query('id').isUUID()], async (req, res) => {
  try {
    if (req.query.id) {
      Category.deleteOne({ _id: req.query.id }, function(err) {
        if (err) {
          throw { error: err };
        }

        res.json({ success: true });
      });
    }
  } catch (e) {
    res.status(400).json(error);
  }
});

module.exports = router;

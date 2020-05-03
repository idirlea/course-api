const express = require('express');
const router = express.Router();

const { Page } = require('../db/db')
const { check, query } = require('express-validator');
const auth = require('../middleware/auth');

router.get(
  '/pages',
  [
    check('title').isString(),
    check('content').isString(),
    check('seoLink').isString(),
    check('status').isBoolean(),
    query('id').isUUID(),
  ],
  async (req, res) => {
    try {
      const query = req.query && req.query.id ? { _id: req.query.id } : {};
      const pages = await Page.find(query);

      if (!pages) {
        return res.status(401).send({ error: 'Fetching pages failed!' });
      }

      res.json([...pages]);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.put(
  '/pages',
  [
    auth,
    check('title').isString(),
    check('content').isString(),
    check('seoLink').isString(),
    check('status').isBoolean(),
  ],
  async (req, res) => {
    try {
      const { _id, ...rest } = req.body;
      const page = await Page.findById(_id);

      if (!page) {
        throw new Error({ error: 'Invalid page id' });
      }

      await page.updateOne(rest);
      await page.save();

      const updatedPage = await Page.findById(_id);

      res.json({ page: updatedPage });
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.post(
  '/pages',
  [
    auth,
    check('title').isString(),
    check('content').isString(),
    check('seoLink').isString(),
    check('status').isBoolean(),
  ],
  async (req, res) => {
    try {
      const { _id, ...rest } = req.body;

      const page = new Page(rest);
      await page.save();

      res.status(201).send({ page });
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.delete('/pages', [auth, query('id').isUUID()], async (req, res) => {
  try {
    if (req.query.id) {
      Page.deleteOne({ _id: req.query.id }, function(err) {
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

const express = require('express')
const router = express.Router()
const { Subscriber } = require('../db/db')
const { check, query } = require('express-validator')

const auth = require('../middleware/auth')

const sendEmail = () => {

}

router.get(
  '/subscribe/confirm',
  [ query('uuids').isString() ],
  async (req, res) => {
    try {
      const { uuids } = req.query
      const subscriber = await Subscriber.findById(uuids)

      if (!subscriber) {
        throw new Error({ error: 'Invalid subscriber id' })
      }

      await subscriber.updateOne(rest)
      await subscriber.save()

      const updatedSubscriber = await Subscriber.findById(uuids)

      res.json({ subscriber: updatedSubscriber })
    } catch (error) {
      res.status(400).json(error)
    }
  }
)

router.get('/unsubscribe', [query('uuids').isString()], async (req, res) => {
  try {
    const { uuids } = req.query
    const subscriber = await Subscriber.findById(uuids)

    if (!subscriber) {
      throw new Error({ error: 'Invalid subscriber id' })
    }

    await Subscriber.findAndDeleteOne({ _id: uuids })

    res.json({ isDeleted: true })
  } catch (error) {
    res.status(400).json(error)
  }
})


router.get('/subscribers', [auth], async (req, res) => {
  try {
    const { id, ...rest } = req.query || {}

    const queryById = id ? { _id: id } : {}

    const query = Object.keys(req.query).length ? { ...queryById, ...(rest || {}) } : {}

    const subscribers = await Subscriber.find(query)

    if (!subscribers) {
      return res.status(401).json({ error: 'Fetching subscribers failed!' })
    }

    res.json([...subscribers])
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post(
  '/subscribe',
  [
    check('name').isString(),
    check('email')
      .normalizeEmail()
      .isEmail(),
  ],
  async (req, res) => {
    try {
      console.log('subscribe')
      const { _id, ...rest } = req.body

      const subscriber = new Subscriber(rest)
      await subscriber.save()

      res.status(201).send({ subscriber })
    } catch (error) {
      res.status(400).json(error)
    }
  }
)

module.exports = router

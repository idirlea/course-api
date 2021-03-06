const express = require('express')
const { check } = require('express-validator')

const router = express.Router()
const auth = require('../middleware/auth')

const User = require('../models/User')
const { Subscriber } = require('../db/db')

const sanitizeLoginInputs = [check('email').isEmail(), check('password').exists()]

const sanitizeSignUpInputs = [check('name').exists(), ...sanitizeLoginInputs]

router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({})

    if (!users) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
    }

    res.json([...users])
  } catch (error) {
    res.status(400).json(error)
  }
})

router.put('/users', [...sanitizeLoginInputs, auth], async (req, res) => {
  try {
    const { _id, password, ...rest } = req.body
    const user = await User.findById(_id)

    if (!user) {
      throw new Error({ error: 'Invalid user credentials' })
    }

    if (password) {
      rest.password = password
    }

    await user.updateOne(rest)
    await user.save()

    const updatedUser = await User.findById(_id)

    res.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        courses: updatedUser.courses,
        allowExtraEmails: updatedUser.allowExtraEmails,
      },
    })
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post('/users', sanitizeSignUpInputs, async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    await user.generateAuthToken()

    if (req.body.allowExtraEmails) {
      const subscriber = new Subscriber({
        email: req.body.email,
        name: req.body.name,
        userLink: user._id,
      })
      await subscriber.save()
    }

    res.status(201).send({ success: true })
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post('/users/login', sanitizeLoginInputs, async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findByCredentials(email, password)

    if (!user) {
      return res.status(401).send({
        error: 'Login failed! Check authentication credentials'
      })
    }

    const token = await user.generateAuthToken()

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        courses: user.courses,
        allowExtraEmails: user.allowExtraEmails,
      },
      token,
    })
  } catch (error) {
    res.status(400).json(error)
  }
})

router.delete('/users', auth, async (req, res) => {
  try {
    if (req.query.id) {
      User.deleteOne({ _id: req.query.id }, function(err) {
        if (err) {
          throw { error: err }
        }
        Subscriber.deleteOne({ userLink: req.query.id }, function(err) {
          res.json({ success: true })
        })
      })
    }
  } catch (e) {
    res.status(400).json(error)
  }
})

module.exports = router

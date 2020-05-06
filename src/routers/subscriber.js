const express = require('express')
const config = require('dotenv').config()
const router = express.Router()
const { Subscriber } = require('../db/db')

const { check, query } = require('express-validator')

const auth = require('../middleware/auth')
const nodemailer = require('nodemailer')


const sendEmail = async ({ _id, email, name}) => {
  var transporter = nodemailer.createTransport({
    host: config.parsed.EMAIL_HOST,
    port: 587,
    secure: false, // use SSL
    auth: {
      user: config.parsed.EMAIL_USER,
      pass: config.parsed.EMAIL_PASS,
    },
  })

  var mailData = {
    from: 'hello@code-school.eu',
    to: email,
    subject: 'New subscriber to the newslete',
    text: 'We got a new subscriber to the newsletter',
    html: `<table style="background-color: #ffffff;" cellpadding="0">
      <tr>
        <td>
          <div>
            <h2>Thank you for subscribing to code school's newsletter!</h2>
            <p>
              But before you can receive any news from us you need to confirm
              that you are a real person and you want to receive an email from
              us
            </p>
            <p>If you are please click on this button:</p>
            <br />
            <a
              href="#"
              target="_blank"
              style="background: #009688; color:#fff;
              text-decoration: none; box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
              padding: 6px 16px;
              font-size: 0.875rem;
              min-width: 64px;
              box-sizing: border-box;
              transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
              font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
              font-weight: 500;
              line-height: 1.75;
              border-radius: 4px;
              letter-spacing: 0.02857em;
              text-transform: uppercase;"
              >Yes I want to subscribe!</a
            >
            <br />
            <br />
            <br />
            <p>
              If you subscribed by accident, you can unsubscribe using the link
              at the bottom of this email!
            </p>
          </div>
        </td>
      </tr>
    </table>`,
  }

  transporter.sendMail(mailData, function(err) {
    if (err) {
      console.log(err)
    }

    console.log(`Message sent ${email} ${name} with success!`)
  })
}


router.post(
  '/subscribe',
  [
    check('name').isString(),
    check('email').isEmail()
  ],
  async (req, res) => {
    try {
      const { _id, ...rest } = req.body

      const subscriber = new Subscriber(rest)
      await subscriber.save()

      await sendEmail(subscriber)
      res.status(201).send({ subscribed: true })
    } catch (error) {
      res.status(400).json({ ...error, subscribed: false })
    }
  }
)

router.get('/subscribe/confirm', [query('uuids').isString()], async (req, res) => {
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
})

router.get('/unsubscribe', [query('uuids').isString()], async (req, res) => {
  try {
    const { uuids } = req.query
    const subscriber = await Subscriber.findById(uuids)

    if (!subscriber) {
      throw new Error({ error: 'Invalid subscriber id' })
    }

    await Subscriber.findByIdAndDelete(uuids)

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


router.delete('/subscribers', [query('id').isUUID()], async (req, res) => {
  try {
    const { id } = req.query

    const subscriber = await Subscriber.findById(id)

    if (!subscriber) {
      throw new Error({ error: 'Invalid subscriber id' })
    }

    await Subscriber.findByIdAndDelete(id)

    res.json({ isDeleted: true })
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

module.exports = router

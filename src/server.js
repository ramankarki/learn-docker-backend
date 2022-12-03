const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const PORT = 5000

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

const Post = mongoose.model(
  'posts',
  new mongoose.Schema(
    {
      title: String,
      body: String,
    },
    { timestamps: true }
  )
)

app
  .route('/')
  .get(async (req, res) => {
    const posts = await Post.find({}, {}, { sort: '-createdAt' })
    res.json(posts)
  })
  .post(async (req, res) => {
    const post = await Post.create(req.body)
    res.json(post)
  })

app.get('/healthcheck', (req, res) => {
  res.status(200).json({ message: 'server is active' })
})

app.all('/*', (req, res) =>
  res.status(400).json({ msg: 'route does not exist' })
)

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connections successfull')
    app.listen(PORT, () =>
      console.log('Server running on http://localhost:' + PORT)
    )

    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION! Shutting down...')
      console.log(err)
    })

    process.on('SIGTERM', (err) => {
      console.log(err)
      console.log('SIGTERM RECEIVED. Shutting down gracefully.')
    })
  })
  .catch((err) => console.log(err))

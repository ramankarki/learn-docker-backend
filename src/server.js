const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const axios = require('axios')
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

mongoose
  .connect(process.env.MONGODB_URI, {
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
      server.stop(() => console.log('Process terminated!'))
    })

    process.on('SIGTERM', () => {
      console.log('SIGTERM RECEIVED. Shutting down gracefully.')
      server.close(() => console.log('Process terminated!'))
    })
  })
  .catch((err) => console.log(err))

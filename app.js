const express = require('express')
const app = express()
const mongoose = require('mongoose')
const User = require('./models/user.js')
const Movie = require('./models/movie.js')
const Blacklist = require('./models/blacklist.js')
const bcrypt = require('bcrypt')
const wrapAsync = require('./utils/wrapAsync.js')
const fetchAvgRating = require('./utils/fetchAvgRating')
const findMovieId = require('./utils/findMovieId')
const AppError = require('./AppError.js')
const { status } = require('express/lib/response')
const session = require('express-session')
const {
  checkBlacklisted,
  isSignedIn,
  validateSignup,
  validateSignIn,
  validateSearch,
  updateSchema,
  validateUpdate,
} = require('./middleware')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'needagoodsecret',
    resave: true,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  })
)

//you do need mongoDB installed in your system
//or just connect it to your mongoDB cluster
mongoose.connect('mongodb://localhost:27017/zeroBalance_movie_app')

app.post(
  '/signup',
  validateSignup,
  wrapAsync(async (req, res) => {
    const { name, age, email, password, favoriteMovies } = req.body
    console.log(req.body)
    const hash = await bcrypt.hash(password, 12)
    const user = new User({ name, age, email, password: hash })
    favoriteMovies.map(async (movie) => {
      const newMovie = new Movie(movie)
      user.favoriteMovies.push(newMovie)
      await newMovie.save()
    })
    await user.save()
    req.session.user_id = user._id
    res.json({ status: 'success', message: 'User Created' })
  })
)

app.post(
  '/signin',
  validateSignIn,
  checkBlacklisted,
  wrapAsync(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password)
      if (validPassword) {
        req.session.user_id = user._id
        user.attempts = 0
        await user.save()
        res.json({ status: 'success', message: 'User Signed in successfully' })
        return
      }
      if (!validPassword) {
        if (user.attempts >= 3) {
          const blacklist = new Blacklist({ user })
          user.attempts = 0
          await blacklist.save()
        } else {
          user.attempts++
        }
        await user.save()
      }
    }
    res
      .status(400)
      .json({ status: 'failed', message: 'Invalid email or password' })
  })
)

app.post(
  '/search',
  validateSearch,
  isSignedIn,
  wrapAsync(async (req, res) => {
    const { movie } = req.body
    const foundMovies = await Movie.find({
      name: { $regex: `${movie}`, $options: 'i' },
    }).distinct('name')
    if (foundMovies.length) {
      let result = await fetchAvgRating(foundMovies)
      res.json({ status: 'success', result })
    } else {
      res.json({ status: 'failed', message: 'no match found' })
    }
  })
)

app.patch(
  '/update',
  validateUpdate,
  isSignedIn,
  wrapAsync(async (req, res) => {
    const id = req.session.user_id
    const { name, rating } = req.body
    const user = await User.findById(id).populate('favoriteMovies')
    if (user) {
      const movieId = await findMovieId(user, name)
      const movie = await Movie.findById(movieId)
      if (movie) {
        user.history.push(movie)
        movie.rating = rating
        await movie.save()
        await user.save()
        console.log(user)
        res.json({
          status: 'updated',
          updates: movie,
          previousRatings: user.history,
        })
        return
      }
    }
    res.status(404).json({ status: '404 Not Found' })
  })
)

app.post('/logout', async (req, res) => {
  req.session.destroy()
  res.json({ status: 'success', message: 'logged out' })
})

app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = err
  if (err && err.code == 11000) {
    res.send('email exist')
    return
  }
  res.status(status).send(message)
  console.error(err)
})

app.listen(3000, () => {
  console.log('started listening on port 3000')
})

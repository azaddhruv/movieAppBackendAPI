const Blacklist = require('./models/blacklist')
const User = require('./models/user')
const Joi = require('joi')
const { TIME_SCOPE, CONVERT_TO_MINUTE } = require('./utils/staticVariables')
const AppError = require('./AppError')

module.exports.checkBlacklisted = async (req, res, next) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (user) {
    const isBlacklisted = await Blacklist.findOne({ user })
    if (isBlacklisted) {
      console.log('runned')
      const time = isBlacklisted.blacklistedAt.getTime()
      let curDate = new Date()
      const timeLeft = Math.floor(
        (curDate.getTime() - time) / CONVERT_TO_MINUTE
      )
      if (timeLeft < TIME_SCOPE) {
        res.status(403).json({
          status: 'blocked',
          message: `Sorry you cannot log in for another ${
            TIME_SCOPE - timeLeft
          } minutes`,
        })
        return
      } else {
        Blacklist.deleteMany({ user })
      }
    }
  }
  next()
}

module.exports.isSignedIn = async (req, res, next) => {
  if (req.session.user_id) {
    next()
  } else {
    res
      .status(401)
      .json({ status: 'unauthorized', message: 'please login first' })
  }
}

module.exports.validateSignup = (req, res, next) => {
  const signupSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required(),
    favoriteMovies: Joi.array().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    password: Joi.string().required(),
  }).required()
  const { error } = signupSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(', ')
    throw new AppError(msg, 400)
  } else {
    next()
  }
}

module.exports.validateSignIn = (req, res, next) => {
  const signInSchema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    password: Joi.string().required(),
  }).required()
  const { error } = signInSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(', ')
    throw new AppError(msg, 400)
  } else {
    next()
  }
}

module.exports.validateSearch = (req, res, next) => {
  const searchSchema = Joi.object({
    movie: Joi.string().required(),
  }).required()
  const { error } = searchSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(', ')
    throw new AppError(msg, 400)
  } else {
    next()
  }
}

module.exports.validateUpdate = (req, res, next) => {
  const updateSchema = Joi.object({
    name: Joi.string().required(),
    rating: Joi.number().required(),
  }).required()
  const { error } = updateSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(', ')
    throw new AppError(msg, 400)
  } else {
    next()
  }
}

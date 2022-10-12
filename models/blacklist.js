const mongoose = require('mongoose')
const User = require('./user')

const blacklistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  blacklistedAt: {
    type: Date,
    default: Date.now(),
  },
})

const Blacklist = mongoose.model('Blacklist', blacklistSchema)

module.exports = Blacklist

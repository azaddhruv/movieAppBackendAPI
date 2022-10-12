const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 5,
  },
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie

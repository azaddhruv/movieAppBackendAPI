const Movie = require('../models/movie')

const fetchAvgRating = async (distinctMovies) => {
  let result = []
  for (let i = 0; i < distinctMovies.length; i++) {
    const getAllMovie = await Movie.find({ name: distinctMovies[i] })
    let sum = 0
    let avg
    for (let j = 0; j < getAllMovie.length; j++) {
      sum = sum + getAllMovie[j].rating
    }
    avg = (sum / getAllMovie.length).toFixed(2)
    result.push({ name: distinctMovies[i], avgRating: avg })
  }
  return result
}

module.exports = fetchAvgRating

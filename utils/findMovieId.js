const findMovieId = async (user, name) => {
  let movieId
  for (let i = 0; i < user.favoriteMovies.length; i++) {
    if (user.favoriteMovies[i].name === name) {
      movieId = user.favoriteMovies[i]._id
    }
  }
  return movieId
}

module.exports = findMovieId

/** @jsx React.DOM */
/* global $ */
var app = {};

(function main() {
  $.ajax('/movies/', {
    method: 'GET'
  }).then(function(data) {
    data.movies.forEach(function(movie) {
      app.MovieStore.add_movie(movie)
    })
    app.MovieStore.trigger('change')
  })
}())

/* global Flux, MicroEvent */
var app = app || {};

(function() {

  var Dispatcher = new Flux.Dispatcher()

  function Movie(api_data) {
    return {
      id: api_data.id,
      title: api_data.title,
      votes: api_data.votes,
      url: api_data.url,
    }
  }


  /**
   *
   * Movie store
   *
   */

  var MovieStore_EVENTS = {
    ADD_MOVIE: 'add-movie',
    UPVOTE_MOVIE: 'upvote-movie',
    DOWNVOTE_MOVIE: 'downvote-movie'
  }

  var MovieStore = {
    movies: {},

    add_movie: function(data) {
      MovieStore.movies[data.id] = Movie(data)
    },

    get_all: function() {
      return Object.keys(MovieStore.movies).map(function(k) {
        return MovieStore.movies[k]
      })
    },

    dispatch_id: Dispatcher.register(function(data) {
      var movies = MovieStore.movies
      switch (data.event) {
        case MovieStore_EVENTS.ADD_MOVIE:
          MovieStore.add_movie(data.movie)
          MovieStore.trigger('change')
          break;
        case MovieStore_EVENTS.UPVOTE_MOVIE:
          movies[data.id].votes += 1
          MovieStore.trigger('change')
          break;
        case MovieStore_EVENTS.DOWNVOTE_MOVIE:
          movies[data.id].votes -= 1
          MovieStore.trigger('change')
          break;
      }

      return true
    }),
  }
  MicroEvent.mixin(MovieStore)


  /**
   *
   * Search Results
   *
   */

  var SearchStore_EVENTS = {
    UPDATE_SEARCH: 'update-search-store'
  }

  var SearchStore = {
    results: {},

    get_all: function() {
      return Object.keys(SearchStore.results).map(function(k) {
        return SearchStore.results[k]
      })
    },


    normalize_movie: function(omdb_movie) {
      var movie = {}
      Object.keys(omdb_movie).forEach(function(key) {
        if (key === "imdbID") {
          movie["id"] = omdb_movie[key]
        }
        else {
          movie[key.toLowerCase()] = omdb_movie[key]
        }
      })
      return movie
    },


    dispatch_id: Dispatcher.register(function(data) {
      switch (data.event) {
        case SearchStore_EVENTS.UPDATE_SEARCH:
          var omdb_movies = data.list
          if (omdb_movies.length === 0) {
            SearchStore.results = {}
          }
          else {
            omdb_movies.forEach(function(omdb_movie) {
              var movie = SearchStore.normalize_movie(omdb_movie)
              SearchStore.results[movie.id] = movie
            })
          }
          SearchStore.trigger('change')

          break
      }

      return true
    })
  }
  MicroEvent.mixin(SearchStore)


  /**
   * 
   * Action Creators
   *
   */

  var Actions = {
    add_movie: function(movie) {
      Dispatcher.dispatch({
        event: MovieStore_EVENTS.ADD_MOVIE,
        movie: movie
      })
    },
    upvote_movie: function(id) {
      Dispatcher.dispatch({
        event: MovieStore_EVENTS.UPVOTE_MOVIE,
        id: id
      })
    },
    downvote_movie: function(id) {
      Dispatcher.dispatch({
        event: MovieStore_EVENTS.DOWNVOTE_MOVIE,
        id: id
      })
    },
    update_search: function(list) {
      console.log(list)
      Dispatcher.dispatch({
        event: SearchStore_EVENTS.UPDATE_SEARCH,
        list: list
      })
    }
  }

  app.MovieStore = MovieStore
  app.SearchStore = SearchStore
  app.Actions = Actions

}())

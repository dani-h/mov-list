/** @jsx React.DOM */
/* global $, React, Flux, MicroEvent */
$(document).ready(function() {


  var RootComponent = React.createClass({
    componentDidMount: function() {
      MovieStore.bind('change', this.forceUpdate.bind(this))
      SearchResultsStore.bind('change', this.forceUpdate.bind(this))
    },
    render: function() {
      return (
        /*jshint ignore:start*/
        <div>
          <MovieList/>
          <div id="search-content">
            <SearchBox/>
            <SearchResultsBox/>
          </div>
        </div>
        /*jshint ignore:end*/
      )
    }
  })

  var MovieWidget = React.createClass({
    handle_upvote: function() {
      var id = this.props.data.id
      var votes = this.props.data.votes
      $.ajax('/movies/' + this.props.data.id, {
        method: 'PUT',
        data: {
          votes: votes + 1
        }
      }).then(function() {
        Actions.upvote_movie(id)
      })
    },

    handle_downvote: function() {
      var id = this.props.data.id
      var votes = this.props.data.votes
      $.ajax('/movies/' + this.props.data.id, {
        method: 'PUT',
        data: {
          votes: votes - 1
        }
      }).then(function() {
        Actions.downvote_movie(id)
      })
    },

    render: function() {
      /*jshint ignore:start*/
      return (
          <div className="movie-widget">
          <div className="vote-icons">
          <span className="glyphicon glyphicon-menu-up" onClick={this.handle_upvote} ></span>
          <span className="glyphicon glyphicon-menu-down" onClick={this.handle_downvote} ></span>
          </div>
          <span className="votes"> {this.props.data.votes}</span>
          <span className="title"> {this.props.data.title}</span>
          </div>
        )
        /*jshint ignore:end*/
    }
  })

  var MovieList = React.createClass({

    render: function() {
      /*jshint ignore:start*/
      var movies = MovieStore.get_all()
        .sort(function(a, b) {
          return a.votes < b.votes
        })
        .map(function(movie) {
          return (<MovieWidget data={movie} />)
        })

      return (
          <div id="movie-list">
          {movies}
          </div>
        )
        /*jshint ignore:end*/
    }
  })


  var SearchBox = React.createClass({
    search: function(event) {
      // If enter
      if (event.keyCode === 13) {
        var search_string = event.target.value
        var url = 'http://www.omdbapi.com/'
        $.ajax(url, {
          data: {
            type: 'movie',
            r: 'json',
            s: search_string
          }
        }).then(function(data) {
          var results = []
          if (data.Search) {
            results = data.Search
          }
          Actions.update_search(results)
        })
      }
    },

    render: function() {
      return (
        /*jshint ignore:start*/
        <div id="search-box" className="input-group">
          <input type="text" className="form-control" placeholder="Search new movie" onKeyUp={this.search}/>
        </div>
        /*jshint ignore:end*/
      )
    }
  })


  var SearchResultsBox = React.createClass({
    render: function() {
      /*jshint ignore:start*/
      var results = SearchResultsStore.get_all()
        .map(function(entry) {
          return <li className="list-group-item">{entry.Title}</li>
        })
        .slice(0, 5)


      return (
          <ul className="list-group search-results">
        {results}
          </ul>
        )
        /*jshint ignore:end*/
    }
  })


  var MovieStore = {
    movies: {},
    get_all: function() {
      return Object.keys(MovieStore.movies).map(function(k) {
        return MovieStore.movies[k]
      })
    }
  }
  MicroEvent.mixin(MovieStore)

  var SearchResultsStore = {
    results: {},
    get_all: function() {
      return Object.keys(SearchResultsStore.results).map(function(k) {
        return SearchResultsStore.results[k]
      })
    }
  }
  MicroEvent.mixin(SearchResultsStore)




  var Actions = {
    upvote_movie: function(id) {
      Dispatcher.dispatch({
        event: 'upvote',
        id: id
      })
    },
    downvote_movie: function(id) {
      Dispatcher.dispatch({
        event: 'downvote',
        id: id
      })
    },
    update_search: function(results) {
      Dispatcher.dispatch({
        event: 'update-search',
        results: results
      })
    }
  }


  var Dispatcher = new Flux.Dispatcher()
  Dispatcher.register(function(data) {
    switch (data.event) {
      case 'upvote':
        MovieStore.movies[data.id].votes += 1
        MovieStore.trigger('change')
        break
      case 'downvote':
        MovieStore.movies[data.id].votes -= 1
        MovieStore.trigger('change')
        break
      case 'update-search':
        if (data.results.length) {
          data.results.forEach(function(entry) {
            SearchResultsStore.results[entry.imdbID] = entry
          })
        }
        else {
          SearchResultsStore.results = {}
        }

        SearchResultsStore.trigger('change')
        break
    }

    return true
  })





  function main() {
    React.render(React.createElement(RootComponent), $("#content")[0])

    $.ajax('/movies/', {
      method: 'GET'
    }).then(function(data) {
      data.movies.forEach(function(movie) {
        MovieStore.movies[movie.id] = movie
      })
      MovieStore.trigger('change')
    })
  }


  main()
})

/** @jsx React.DOM */
/* global $, React */
$(document).ready(function() {

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
      /* eslint-disable */
      return (
          <div className="movie-widget">
            <div className="vote-icons">
              <span className="glyphicon glyphicon-menu-up" onClick={this.handle_upvote} ></span>
              <span className="glyphicon glyphicon-menu-down" onClick={this.handle_downvote} ></span>
            </div>
            <span className="votes"> {this.props.data.votes}</span>
            <span className="title"> {this.props.data.title}</span>
          </div>)
        /* eslint-enable */
    }
  })

  var MovieList = React.createClass({
    componentDidMount: function() {
      MovieStore.bind('change', this.forceUpdate.bind(this))
    },

    render: function() {
      /* eslint-disable */
      var movies = MovieStore.get_all()
        .sort(function(a, b) {
          return a.votes < b.votes
        })
        .map(function(movie) {
          return (<MovieWidget data={movie} />)
        })

      return (
          <div className="movie-list">
          {movies}
          </div>
        )
        /* eslint-enable */
    }
  })


  var MovieStore = {
    movies: {},
    get_all: function() {
      return Object.keys(MovieStore.movies).map(function(id) {
        return MovieStore.movies[id]
      })
    }
  }
  MicroEvent.mixin(MovieStore)


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
    }

    return true
  })



  function main() {
    $.ajax('/movies/', {
      method: 'GET'
    }).then(function(data) {
      data.movies.forEach(function(movie) {
        MovieStore.movies[movie.id] = movie
      })
      React.render(<MovieList/>, $("#content")[0])
    })
  }


  main()
})

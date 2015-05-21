/** @jsx React.DOM */
/* global $, React */
$(document).ready(function() {

  var MovieWidget = React.createClass({
    handle_upvote: function() {
      var data = this.props.data
      data.votes += 1
      $.ajax('/movies/' + data.id, {
        method: 'PUT',
        data: {
          votes: data.votes
        }
      }).then(function() {
        this.setState({
          votes: data.votes
        })
      })
    },

    handle_downvote: function() {
      var data = this.props.data
      data.votes -= 1
      $.ajax('/movies/' + data.id, {
        method: 'PUT',
        data: {
          votes: data.votes
        }
      }).then(function() {
        this.setState({
          votes: data.votes
        })
      })
    },

    render: function() {
      /* jshint ignore:start */
      return (
          <div class="movie-widget">
            <div className="vote-icons">
              <span className="glyphicon glyphicon-menu-up" onClick={this.handle_upvote} ></span>
              <span className="glyphicon glyphicon-menu-down" onClick={this.handle_downvote} ></span>
            </div>
            <span className="votes"> {this.props.data.votes}</span>
            <span className="title"> {this.props.data.title}</span>
          </div>)
        /* jshint ignore:end */
    }
  })

  var MovieList = React.createClass({
    render: function() {
      /* jshint ignore:start */
      var movies = this.props.data.sort(function(a, b) {
        return a.votes < b.votes
      }).map(function(movie) {
        return (<MovieWidget data={movie} />)
      })

      return (
          <div className="movie-list">
          {movies}
          </div>
        )
        /* jshint ignore:end */
    }
  })



  function main() {
    $.ajax('/movies/', {
      method: 'GET'
    }).then(function(data) {
      React.render(<MovieList data={data.movies}/>, $("#content")[0])
    })
  }


  main()
})

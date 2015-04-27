/* global $, Mustache */
$(document).ready(function() {

  /**
   * Data
   */
  function Movie(json) {
    return {
      id: json.id,
      title: json.title,
      votes: json.votes,
      upvote: function() {
        this.votes++
      },
      downvote: function() {
        this.votes--
      }
    }
  }


  /**
   * Views
   */
  function MovieList(movies) {
    var template = `<ul class="list-group"></ul>`
    var self = {}
    self.$e = $(template)

    var movieWidgets = movies.map(function(mov) {
      var movie = Movie(mov)
      return MovieWidget(movie)
    })

    self.render = function() {
      var sorted = movieWidgets.sort(function(a, b) {
        return a.movie.votes < b.movie.votes
      })
      sorted.forEach(function(widget) {
        widget.render()
        self.$e.append(widget.$e)
      })
      $("#list-container").append(self.$e)
    }

    return self
  }


  function MovieWidget(movie) {
    var template = `<li class="list-group-item movie-widget">
        <span class="votes">{{votes}}</span>
        <span class="title">{{title}}</span>
        <div class="widget-button-container">
          <button type="button" class="upvote btn btn-default btn-sm">
            <span class="glyphicon glyphicon-menu-up"></span>Upvote
          </button>
          <button type="button" class="downvote btn btn-default btn-sm">
            <span class="glyphicon glyphicon-menu-down"></span>Downvote
          </button>
        </div>
      </li>`

    var self = {}
    self.movie = movie
    self.$e = $('<div>')
    self.$e.on('click', '.upvote', upvote)
    self.$e.on('click', '.downvote', downvote)

    self.render = function() {
      this.$e.html(Mustache.render(template, this.movie))
    }

    function upvote(ev) {
      var upvote_def = $.ajax('/movie/' + movie.id, {
        method: 'PUT',
        data: {
          votes: movie.votes + 1
        }
      })

      upvote_def.done(function(foo) {
        self.movie.votes += 1
        self.render()
      })
    }

    function downvote(ev) {
      var upvote_def = $.ajax('/movie/' + movie.id, {
        method: 'PUT',
        data: {
          votes: movie.votes - 1
        }
      })

      upvote_def.done(function(updated_mov) {
        self.movie.votes -= 1
        self.render()
      })
    }

    return self
  }


  /**
   * Main func
   */
  function main() {
    var movie_def = $.ajax('/movie/', {
      method: 'GET'
    })
    movie_def.then(function(data) {
      var list = MovieList(data.movies)
      list.render()
    })
  }


  main()
})

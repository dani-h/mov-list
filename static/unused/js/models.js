(function() {
  var app = window.app
  function Movie(api_data) {
    return {
      id: api_data.id,
      title: api_data.title,
      votes: api_data.votes,
      url: api_data.url,
      imdb_id: api_data.imdb_id,
      img_src: api_data.img_src
    }
  }

  function ApiMovie(omdb_entry) {
    var self = {
      imdb_id: null,
      title: null
    }
    self.toJQueryParams = toJQueryParams

    Object.keys(omdb_entry).forEach(function(key) {
      var lower = key.toLowerCase()
      if (lower === "imdbid") {
        self["imdb_id"] = omdb_entry[key]
      }
      else {
        self[lower] = omdb_entry[key]
      }
    })

    function toJQueryParams() {
      return {
        imdb_id: self.imdb_id,
        title: self.title
      }
    }

    return self
  }

  app.models = {}
  app.models.Movie = Movie
  app.models.ApiMovie = ApiMovie
}())

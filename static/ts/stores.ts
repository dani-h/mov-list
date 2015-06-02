import Models = require('./models')
import SimpleEvent = require('./SimpleEvent')
import Actions = require('./actions')

module Stores {

  class MovieStore extends SimpleEvent.EventCls {
    movies: { [id: number]: Models.Movie; } = {}
    dispatcher_id: string
    EVENTS = {
      CHANGE: 'moviestore-change'
    }

    constructor() {
      super()
      this.dispatcher_id = Actions.Dispatcher.register(this.register_dispatcher.bind(this))
    }

    all(): Models.Movie[] {
      return Object.keys(this.movies).map(key => this.movies[key])
    }

    initialize(movie_data: any) {
      let list: any[] = movie_data['movies']
      list.forEach(entry => this.movies[entry['id']] = new Models.Movie(entry))
    }

    register_dispatcher(payload: Actions.dispatcher_eventtype) {

      if (payload instanceof Actions.AddMovie) {
        this.movies[payload.movie.id] = payload.movie
        this.trigger(this.EVENTS.CHANGE)
      }
      else if (payload instanceof Actions.UpvoteMovie) {
        this.movies[payload.movie.id].votes += 1
        this.trigger(this.EVENTS.CHANGE)
      }
      else if (payload instanceof Actions.DownvoteMovie) {
        this.movies[payload.movie.id].votes -= 1
        this.trigger(this.EVENTS.CHANGE)
      }

      return true
    }

  }

  class SearchStore extends SimpleEvent.EventCls {
    search_results: { [id: string]: Models.ApiMovie; } = {}
    dispatcher_id: string
    EVENTS = {
      CHANGE: 'searchstore-change'
    }

    constructor() {
      super()
      this.dispatcher_id = Actions.Dispatcher.register(this.register_dispatcher.bind(this))
    }

    all() {
      return Object.keys(this.search_results).map(key => this.search_results[key])
    }

    register_dispatcher(payload: Actions.dispatcher_eventtype) {

      if (payload instanceof Actions.UpdateSearch) {
        if (payload.api_data['Search']) {
          let list: any[] = payload.api_data['Search']
          for (let entry of list) {
            let api_movie = new Models.ApiMovie(entry)
            this.search_results[api_movie.imdb_id] = api_movie
          }
        }
        this.trigger(this.EVENTS.CHANGE)
      }
    }
  }

  export let movieStore = new MovieStore()
  export let searchStore = new SearchStore()
}

export = Stores












///<reference path="../lib/react/flux.d.ts"/>
///<reference path="../lib/react/react.d.ts"/>


import Flux = require('flux')
import Models = require('./models')
import SimpleEvent = require('./SimpleEvent')

module Stores {
  let Dispatcher = new Flux.Dispatcher<any>()

  class MovieStore extends SimpleEvent.EventCls {
    movies: { [id: number]: Models.Movie; } = {}
    dispatcher_id: string
    EVENTS = {
      ADD_MOVIE: 'add-movie',
      UPVOTE_MOVIE: 'upvote-movie',
      DOWNVOTE_MOVIE: 'downvote-movie',

      CHANGE: 'moviestore-change'
    }

    constructor() {
      super()
      this.dispatcher_id = Dispatcher.register(this.register_dispatcher.bind(this))
    }

    all(): Models.Movie[] {
      return Object.keys(this.movies).map(key => this.movies[key])
    }

    initialize(movie_data: any) {
      let list: any[] = movie_data['movies']
      list.forEach(entry => this.movies[entry['id']] = new Models.Movie(entry))
    }

    register_dispatcher(payload) {
      let event = payload['event']
      let movie: Models.Movie = payload['movie']

      switch (event) {
        case this.EVENTS.ADD_MOVIE:
          this.movies[movie.id] = movie
          this.trigger(this.EVENTS.CHANGE)
          break
        case this.EVENTS.UPVOTE_MOVIE:
          this.movies[movie.id].votes += 1
          this.trigger(this.EVENTS.CHANGE)
          break
        case this.EVENTS.DOWNVOTE_MOVIE:
          this.movies[movie.id].votes -= 1
          this.trigger(this.EVENTS.CHANGE)
          break
      }

      return true
    }

  }

  class SearchStore extends SimpleEvent.EventCls {
    search_results: { [id: string]: Models.ApiMovie; } = {}
    dispatcher_id: string
    EVENTS = {
      UPDATE_SEARCH: 'update-search',
      CHANGE: 'searchstore-change'
    }

    constructor() {
      super()
      this.dispatcher_id = Dispatcher.register(this.register_dispatcher.bind(this))
    }

    all() {
      return Object.keys(this.search_results).map(key => this.search_results[key])
    }

    register_dispatcher(payload) {
      switch (payload['event']) {
        case this.EVENTS.UPDATE_SEARCH:
          let api_data = payload['api_data']
          if (api_data['Search']) {
            let list: any[] = api_data['Search']
            list.forEach(entry => {
              let apiMovie = new Models.ApiMovie(entry)
              this.search_results[apiMovie.imdb_id] = apiMovie
            })
          }
          else {
            this.search_results = {}
          }

          this.trigger(this.EVENTS.CHANGE)
          break
      }
    }
  }

  export let movieStore = new MovieStore()
  export let searchStore = new SearchStore()
  export let Actions = {
    add_movie: (movie: Models.Movie) => Dispatcher.dispatch({
      event: movieStore.EVENTS.ADD_MOVIE,
      movie: movie
    }),
    upvote_movie: (movie: Models.Movie) => Dispatcher.dispatch({
      event: movieStore.EVENTS.UPVOTE_MOVIE,
      movie: movie
    }),
    downvote_movie: (movie: Models.Movie) => Dispatcher.dispatch({
      event: movieStore.EVENTS.DOWNVOTE_MOVIE,
      movie: movie
    }),
    update_search: (api_data: any) => Dispatcher.dispatch({
      event: searchStore.EVENTS.UPDATE_SEARCH,
      api_data: api_data
    })
  }


}

export = Stores






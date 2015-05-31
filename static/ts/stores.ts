///<reference path="../lib/react/flux.d.ts"/>
///<reference path="../lib/react/react.d.ts"/>
///<reference path="../lib/eventemitter3/eventemitter3.d.ts"/>


import Flux = require('flux')
import EventEmitter3 = require('eventemitter3')
import Models = require('./models')

module Stores {
  export let movieStore = new MovieStore()
  let dispatcher = new Flux.Dispatcher<any>()

  class MovieStore extends EventEmitter3.EventEmitter {
    movies: {[id: number]: Models.Movie;} = {}
    dispatcher_id: string
    EVENTS = {
      ADD_MOVIE: 'add-movie',
      UPVOTE_MOVIE: 'upvote-movie',
      DOWNVOTE_MOVIE: 'downvote-movie'
    }

    constructor() {
      super()
      this.dispatcher_id = dispatcher.register(this.register_dispatcher)
    }

    all():Models.Movie[] {
      return Object.keys(this.movies).map(key => this.movies[key])
    }

    register_dispatcher(payload) {
      switch (payload['event']) {

        case this.EVENTS.ADD_MOVIE:
          let movie:Models.Movie = payload['movie']
          this.movies[movie.id] = movie
          break
        case this.EVENTS.UPVOTE_MOVIE:

          break
        case this.EVENTS.DOWNVOTE_MOVIE:
          break

      }
      this.emit('change')

      return true
    }

  }
}

export = Stores





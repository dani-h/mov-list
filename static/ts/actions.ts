///<reference path="../lib/react/flux.d.ts"/>
import Flux = require('flux')
import Models = require('./models')

module Actions {
  export type dispatcher_eventtype = AddMovie|UpvoteMovie|DownvoteMovie|UpdateSearch
  export let Dispatcher = new Flux.Dispatcher<dispatcher_eventtype>()

  export class AddMovie {
    movie: Models.Movie
    constructor(movie: Models.Movie) {
      this.movie = movie
    }
  }

  export class UpvoteMovie {
    movie: Models.Movie
    constructor(movie: Models.Movie) {
      this.movie = movie
    }
  }

  export class DownvoteMovie {
    movie: Models.Movie
    constructor(movie: Models.Movie) {
      this.movie = movie
    }
  }
  /**
   * Note: We are using shortcuts here as the API may change soon
   * Todo: Add types
   */
  export class UpdateSearch {
    api_data: any
    constructor(api_data) {
      this.api_data = api_data
    }
  }


  export let methods = {
    add_movie: (movie: Models.Movie) => Dispatcher.dispatch(new AddMovie(movie)),
    upvote_movie: (movie: Models.Movie) => Dispatcher.dispatch(new UpvoteMovie(movie)),
    downvote_movie: (movie: Models.Movie) => Dispatcher.dispatch(new DownvoteMovie(movie)),
    update_search: (api_data) => Dispatcher.dispatch(new UpdateSearch(api_data))
  }

}

export = Actions


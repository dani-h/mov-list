/*
 * Views for all of the components.
 * Note: When using plain classes, the getInitialState property is unused.
 * Instead, initialize the state at the constructor.
 */

///<reference path="../lib/react/react.d.ts"/>
///<reference path="../lib/jquery/jquery.d.ts"/>

import react = require('react')
import $ = require('jquery')
import Stores = require('./stores')
import Models = require('./models')
import Actions = require('./actions')

module Views {
  /**
   * Shorthand functions
   */
  let div = react.DOM.div
  let ul = react.DOM.ul
  let li = react.DOM.li
  let a = react.DOM.a
  let span = react.DOM.span
  let img = react.DOM.img
  let button = react.DOM.button
  let input = react.DOM.input


  /**
   * Critical component used for rendering at top level
   */
  export class RootComponent extends react.Component<{}, {}> {
    render() {
      return (
        div(null,
          react.createElement(MovieList),
          div(null,
            react.createElement(SearchInput),
            react.createElement(SearchList)
            )
          )
        )
    }
  }

  /**
   * Widgets that display the movies found in the local DB
   */

  class MovieList extends react.Component<{}, {}> {
    componentDidMount() {
      Stores.movieStore.register(Stores.movieStore.EVENTS.CHANGE, this.forceUpdate.bind(this))
    }
    render() {
      let movies = Stores.movieStore.all()
        .sort((a, b) => a.votes < b.votes ? 1 : 0)
        .map((movie, idx) => {
        return react.createElement(MovieWidget, { key: movie.id, data: movie, idx: idx + 1 })
      })

      return div(null, movies)
    }
  }


  interface MovieWidgetProps {
    data: Models.Movie
    idx: number
  }
  class MovieWidget extends react.Component<MovieWidgetProps, {}> {
    upvote() {
      $.ajax('/movies/' + this.props.data.id, {
        method: 'PUT', data: { votes: this.props.data.votes + 1 }
      }).then(() => {
        Actions.UpvoteMovie.dispatch(this.props.data)
      })
    }

    downvote() {
      $.ajax('/movies/' + this.props.data.id, {
        method: 'PUT', data: { votes: this.props.data.votes - 1 }
      }).then(() => {
        Actions.DownvoteMovie.dispatch(this.props.data)
      })
    }

    render() {
      return (
        li({ className: "list-group-item movie-widget" },
          div({ className: 'vote-icons' },
            span({ className: "glyphicon glyphicon-menu-up", onClick: this.upvote.bind(this) }),
            span({ className: "glyphicon glyphicon-menu-down", onClick: this.downvote.bind(this) })
            ),
          span({ className: 'index' }, this.props.idx),
          img({ className: 'movie-img', src: this.props.data.img_src }),
          span({ className: 'title' },
            a({ href: this.props.data.url }, this.props.data.title)),
          span({ className: 'votes' }, this.props.data.votes)
          )
        )
    }
  }

  /**
   * Search widgets
   */
  class SearchInput extends react.Component<{}, { disabled: boolean }> {
    constructor() {
      super()
      this.state = { disabled: false }
    }

    search(event: react.UIEvent) {
      //Note, logging the event will result it being garbage collected by the time it's `console.log`ed
      //so the props are null. Also, patch react.d.ts to include the `keyCode` props among others..
      let keyCode: number = event['keyCode']
      if (keyCode === 13) {
        this.setState({ disabled: true })

        let url = 'http://www.omdbapi.com/'
        let search_string = event.target['value']
        $.ajax(url, { data: { type: 'movie', r: 'json', s: search_string }})
        .then((data) => Actions.UpdateSearch.dispatch(data))
        .done(() => {
          console.log("Request done")
          this.setState({ disabled: false })
        })
      }
    }

    render() {
      return (
        div({ id: 'search-box', className: 'input-group', },
          input({
            type: 'text', className: 'form-control', placeholder: 'Search new movie..',
            onKeyUp: this.search.bind(this), disabled: this.state.disabled
          }))
        )
    }
  }

  class SearchList extends react.Component<{}, {}>  {
    componentDidMount() {
      Stores.searchStore.register(Stores.searchStore.EVENTS.CHANGE, this.forceUpdate.bind(this))
    }

    render() {
      let results = Stores.searchStore.all()
        .map(entry => react.createElement(SearchResultItem, {data: entry, key: entry.imdb_id}))
        .slice(0, 5)

        return (
            ul({className: 'list-group search-results'},
              results)
            )
    }
  }

  class SearchResultItem extends react.Component<{ data: Models.ApiMovie }, {}> {
    add_movie() {
      $.ajax('/movies/', { method: 'POST', data: this.props.data.toJSONParams() })
        .then(new_movie => Actions.AddMovie.dispatch(new_movie))
    }

    render() {
      return (
        li({ className: 'list-group-item search-item' },
          span({ className: 'search-item-title' }, this.props.data.title),
          button({ className: 'btn btn-primary btn-sm search-item-btn', onClick: this.add_movie.bind(this) },
            'Add movie')
          )
        )
    }
  }


}



export = Views


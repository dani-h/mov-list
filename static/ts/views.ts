///<reference path="../lib/react/react.d.ts"/>
///<reference path="./stores.ts"/>

import react = require('react')
import Stores = require('./stores')

module Views {
  let div = react.DOM.div
  let ul = react.DOM.ul
  let li = react.DOM.li
  let span = react.DOM.span

  let RootComponent = react.createClass({
    componentDidMount: () => {

    },

    render: () => {
      return react.DOM.div()
    }
  })

  let MovieList = react.createClass({

    render: () => {
      let movies = Stores.movieStore.all()
        .sort((a, b) =>  a.votes < b.votes ? 1 : 0)
        //.map(movie => movie.)

      return div(null)
    }
  })

  class MovieWidget extends react.ClassicComponentClass<react.Props> {

    upvote() {

    }

    downvote() {

    }

    render() {
      return (

        li({ className: "list-group-item movie-widget" },
          div({ className:'vote-icon' },
            span({className: "glyphicon glyphicon-menu-up"}),
            span({className: "glyphicon glyphicon-menu-down"})
          ),
          span({className: 'index'})
        )

        )
    }
  }

}



export = Views



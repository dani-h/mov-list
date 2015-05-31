///<reference path="../lib/jquery/jquery.d.ts" />
///<reference path="../lib/react/react.d.ts" />
///<reference path="./stores.ts" />
///<reference path="./views.ts" />

import $ = require('jquery')
import react = require('react')
import Stores = require('./stores')
import Views = require('./views')

module App {
  let run = () => {
    console.log("Starting app...")

    $.ajax('/movies/', {
      method: 'GET'
    }).then((data: any) => {
      Stores.movieStore.initialize(data)
      react.render(react.createElement(Views.RootComponent), $('#content')[0])
    })
  }
  run()
}

///<reference path="../lib/jquery/jquery.d.ts" />
///<reference path="../lib/react/flux.d.ts" />
///<reference path="./stores.ts" />

import $ = require('jquery')
import flux = require('flux')
import Stores = require('./stores')

module App {
  let run = () => {
    console.log("Starting app...")

    $.ajax('/movies/', {
      method: 'GET'
    }).then((data: any[]) => {
      for(let entry of data['movies']) {
        console.log(entry)
      }
    })
  }
  run()
}

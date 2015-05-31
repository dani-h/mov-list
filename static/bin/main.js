///<reference path="../lib/jquery/jquery.d.ts" />
///<reference path="../lib/react/react.d.ts" />
///<reference path="./stores.ts" />
///<reference path="./views.ts" />
define(["require", "exports", 'jquery', 'react', './stores', './views'], function (require, exports, $, react, Stores, Views) {
    var App;
    (function (App) {
        var run = function () {
            console.log("Starting app...");
            $.ajax('/movies/', {
                method: 'GET'
            }).then(function (data) {
                Stores.movieStore.initialize(data);
                react.render(react.createElement(Views.RootComponent), $('#content')[0]);
            });
        };
        run();
    })(App || (App = {}));
});

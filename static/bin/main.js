///<reference path="../lib/jquery/jquery.d.ts" />
///<reference path="../lib/react/flux.d.ts" />
///<reference path="./stores.ts" />
define(["require", "exports", 'jquery'], function (require, exports, $) {
    var App;
    (function (App) {
        var run = function () {
            console.log("Starting app...");
            $.ajax('/movies/', {
                method: 'GET'
            }).then(function (data) {
                for (var _i = 0, _a = data['movies']; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    console.log(entry);
                }
            });
        };
        run();
    })(App || (App = {}));
});

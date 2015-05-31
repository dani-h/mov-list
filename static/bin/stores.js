///<reference path="../lib/react/flux.d.ts"/>
///<reference path="../lib/react/react.d.ts"/>
///<reference path="../lib/eventemitter3/eventemitter3.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'flux', 'eventemitter3'], function (require, exports, Flux, EventEmitter3) {
    var Stores;
    (function (Stores) {
        Stores.movieStore = new MovieStore();
        var dispatcher = new Flux.Dispatcher();
        var MovieStore = (function (_super) {
            __extends(MovieStore, _super);
            function MovieStore() {
                _super.call(this);
                this.movies = {};
                this.EVENTS = {
                    ADD_MOVIE: 'add-movie',
                    UPVOTE_MOVIE: 'upvote-movie',
                    DOWNVOTE_MOVIE: 'downvote-movie'
                };
                this.dispatcher_id = dispatcher.register(this.register_dispatcher);
            }
            MovieStore.prototype.all = function () {
                var _this = this;
                return Object.keys(this.movies).map(function (key) { return _this.movies[key]; });
            };
            MovieStore.prototype.register_dispatcher = function (payload) {
                switch (payload['event']) {
                    case this.EVENTS.ADD_MOVIE:
                        var movie = payload['movie'];
                        this.movies[movie.id] = movie;
                        break;
                    case this.EVENTS.UPVOTE_MOVIE:
                        break;
                    case this.EVENTS.DOWNVOTE_MOVIE:
                        break;
                }
                this.emit('change');
                return true;
            };
            return MovieStore;
        })(EventEmitter3.EventEmitter);
    })(Stores || (Stores = {}));
    return Stores;
});

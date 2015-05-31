///<reference path="../lib/react/flux.d.ts"/>
///<reference path="../lib/react/react.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'flux', './models', './SimpleEvent'], function (require, exports, Flux, Models, SimpleEvent) {
    var Stores;
    (function (Stores) {
        var Dispatcher = new Flux.Dispatcher();
        var MovieStore = (function (_super) {
            __extends(MovieStore, _super);
            function MovieStore() {
                _super.call(this);
                this.movies = {};
                this.EVENTS = {
                    ADD_MOVIE: 'add-movie',
                    UPVOTE_MOVIE: 'upvote-movie',
                    DOWNVOTE_MOVIE: 'downvote-movie',
                    CHANGE: 'moviestore-change'
                };
                this.dispatcher_id = Dispatcher.register(this.register_dispatcher.bind(this));
            }
            MovieStore.prototype.all = function () {
                var _this = this;
                return Object.keys(this.movies).map(function (key) { return _this.movies[key]; });
            };
            MovieStore.prototype.initialize = function (movie_data) {
                var _this = this;
                var list = movie_data['movies'];
                list.forEach(function (entry) { return _this.movies[entry['id']] = new Models.Movie(entry); });
            };
            MovieStore.prototype.register_dispatcher = function (payload) {
                var event = payload['event'];
                var movie = payload['movie'];
                switch (event) {
                    case this.EVENTS.ADD_MOVIE:
                        this.movies[movie.id] = movie;
                        this.trigger(this.EVENTS.CHANGE);
                        break;
                    case this.EVENTS.UPVOTE_MOVIE:
                        this.movies[movie.id].votes += 1;
                        this.trigger(this.EVENTS.CHANGE);
                        break;
                    case this.EVENTS.DOWNVOTE_MOVIE:
                        this.movies[movie.id].votes -= 1;
                        this.trigger(this.EVENTS.CHANGE);
                        break;
                }
                return true;
            };
            return MovieStore;
        })(SimpleEvent.EventCls);
        var SearchStore = (function (_super) {
            __extends(SearchStore, _super);
            function SearchStore() {
                _super.call(this);
                this.search_results = {};
                this.EVENTS = {
                    UPDATE_SEARCH: 'update-search',
                    CHANGE: 'searchstore-change'
                };
                this.dispatcher_id = Dispatcher.register(this.register_dispatcher.bind(this));
            }
            SearchStore.prototype.all = function () {
                var _this = this;
                return Object.keys(this.search_results).map(function (key) { return _this.search_results[key]; });
            };
            SearchStore.prototype.register_dispatcher = function (payload) {
                var _this = this;
                switch (payload['event']) {
                    case this.EVENTS.UPDATE_SEARCH:
                        var api_data = payload['api_data'];
                        if (api_data['Search']) {
                            var list = api_data['Search'];
                            list.forEach(function (entry) {
                                var apiMovie = new Models.ApiMovie(entry);
                                _this.search_results[apiMovie.imdb_id] = apiMovie;
                            });
                        }
                        else {
                            this.search_results = {};
                        }
                        this.trigger(this.EVENTS.CHANGE);
                        break;
                }
            };
            return SearchStore;
        })(SimpleEvent.EventCls);
        Stores.movieStore = new MovieStore();
        Stores.searchStore = new SearchStore();
        Stores.Actions = {
            add_movie: function (movie) { return Dispatcher.dispatch({
                event: Stores.movieStore.EVENTS.ADD_MOVIE,
                movie: movie
            }); },
            upvote_movie: function (movie) { return Dispatcher.dispatch({
                event: Stores.movieStore.EVENTS.UPVOTE_MOVIE,
                movie: movie
            }); },
            downvote_movie: function (movie) { return Dispatcher.dispatch({
                event: Stores.movieStore.EVENTS.DOWNVOTE_MOVIE,
                movie: movie
            }); },
            update_search: function (api_data) { return Dispatcher.dispatch({
                event: Stores.searchStore.EVENTS.UPDATE_SEARCH,
                api_data: api_data
            }); }
        };
    })(Stores || (Stores = {}));
    return Stores;
});

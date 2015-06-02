var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './models', './SimpleEvent', './actions'], function (require, exports, Models, SimpleEvent, Actions) {
    var Stores;
    (function (Stores) {
        var MovieStore = (function (_super) {
            __extends(MovieStore, _super);
            function MovieStore() {
                _super.call(this);
                this.movies = {};
                this.EVENTS = {
                    CHANGE: 'moviestore-change'
                };
                console.log('zoom');
                this.dispatcher_id = Actions.Dispatcher.register(this.register_dispatcher.bind(this));
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
                if (payload instanceof Actions.AddMovie) {
                    this.movies[payload.movie.id] = payload.movie;
                    this.trigger(this.EVENTS.CHANGE);
                }
                else if (payload instanceof Actions.UpvoteMovie) {
                    this.movies[payload.movie.id].votes += 1;
                    this.trigger(this.EVENTS.CHANGE);
                }
                else if (payload instanceof Actions.DownvoteMovie) {
                    this.movies[payload.movie.id].votes -= 1;
                    this.trigger(this.EVENTS.CHANGE);
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
                    CHANGE: 'searchstore-change'
                };
                this.dispatcher_id = Actions.Dispatcher.register(this.register_dispatcher.bind(this));
            }
            SearchStore.prototype.all = function () {
                var _this = this;
                return Object.keys(this.search_results).map(function (key) { return _this.search_results[key]; });
            };
            SearchStore.prototype.register_dispatcher = function (payload) {
                if (payload instanceof Actions.UpdateSearch) {
                    if (payload.api_data['Search']) {
                        var list = payload.api_data['Search'];
                        for (var _i = 0; _i < list.length; _i++) {
                            var entry = list[_i];
                            var api_movie = new Models.ApiMovie(entry);
                            this.search_results[api_movie.imdb_id] = api_movie;
                        }
                    }
                    this.trigger(this.EVENTS.CHANGE);
                }
            };
            return SearchStore;
        })(SimpleEvent.EventCls);
        Stores.movieStore = new MovieStore();
        Stores.searchStore = new SearchStore();
    })(Stores || (Stores = {}));
    return Stores;
});

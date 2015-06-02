define(["require", "exports", 'flux'], function (require, exports, Flux) {
    var Actions;
    (function (Actions) {
        Actions.Dispatcher = new Flux.Dispatcher();
        var AddMovie = (function () {
            function AddMovie(movie) {
                this.movie = movie;
            }
            AddMovie.dispatch = function (movie) {
                Actions.Dispatcher.dispatch(new this(movie));
            };
            return AddMovie;
        })();
        Actions.AddMovie = AddMovie;
        var UpvoteMovie = (function () {
            function UpvoteMovie(movie) {
                this.movie = movie;
            }
            UpvoteMovie.dispatch = function (movie) {
                Actions.Dispatcher.dispatch(new this(movie));
            };
            return UpvoteMovie;
        })();
        Actions.UpvoteMovie = UpvoteMovie;
        var DownvoteMovie = (function () {
            function DownvoteMovie(movie) {
                this.movie = movie;
            }
            DownvoteMovie.dispatch = function (movie) {
                Actions.Dispatcher.dispatch(new this(movie));
            };
            return DownvoteMovie;
        })();
        Actions.DownvoteMovie = DownvoteMovie;
        var UpdateSearch = (function () {
            function UpdateSearch(api_data) {
                this.api_data = api_data;
            }
            UpdateSearch.dispatch = function (data) {
                Actions.Dispatcher.dispatch(new this(data));
            };
            return UpdateSearch;
        })();
        Actions.UpdateSearch = UpdateSearch;
        Actions.methods = {
            add_movie: function (movie) { return Actions.Dispatcher.dispatch(new AddMovie(movie)); },
            upvote_movie: function (movie) { return Actions.Dispatcher.dispatch(new UpvoteMovie(movie)); },
            downvote_movie: function (movie) { return Actions.Dispatcher.dispatch(new DownvoteMovie(movie)); },
            update_search: function (api_data) { return Actions.Dispatcher.dispatch(new UpdateSearch(api_data)); }
        };
    })(Actions || (Actions = {}));
    return Actions;
});

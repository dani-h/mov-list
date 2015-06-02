/*
 * Views for all of the components.
 * Note: When using plain classes, the getInitialState property is unused.
 * Instead, initialize the state at the constructor.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'react', 'jquery', './stores', './actions'], function (require, exports, react, $, Stores, Actions) {
    var Views;
    (function (Views) {
        var div = react.DOM.div;
        var ul = react.DOM.ul;
        var li = react.DOM.li;
        var a = react.DOM.a;
        var span = react.DOM.span;
        var img = react.DOM.img;
        var button = react.DOM.button;
        var input = react.DOM.input;
        var RootComponent = (function (_super) {
            __extends(RootComponent, _super);
            function RootComponent() {
                _super.apply(this, arguments);
            }
            RootComponent.prototype.render = function () {
                return (div(null, react.createElement(MovieList), div(null, react.createElement(SearchInput), react.createElement(SearchList))));
            };
            return RootComponent;
        })(react.Component);
        Views.RootComponent = RootComponent;
        var MovieList = (function (_super) {
            __extends(MovieList, _super);
            function MovieList() {
                _super.apply(this, arguments);
            }
            MovieList.prototype.componentDidMount = function () {
                Stores.movieStore.register(Stores.movieStore.EVENTS.CHANGE, this.forceUpdate.bind(this));
            };
            MovieList.prototype.render = function () {
                var movies = Stores.movieStore.all()
                    .sort(function (a, b) { return a.votes < b.votes ? 1 : 0; })
                    .map(function (movie, idx) {
                    return react.createElement(MovieWidget, { key: movie.id, data: movie, idx: idx });
                });
                return div(null, movies);
            };
            return MovieList;
        })(react.Component);
        var MovieWidget = (function (_super) {
            __extends(MovieWidget, _super);
            function MovieWidget() {
                _super.apply(this, arguments);
            }
            MovieWidget.prototype.upvote = function () {
                var _this = this;
                $.ajax('/movies/' + this.props.data.id, {
                    method: 'PUT', data: { votes: this.props.data.votes + 1 }
                }).then(function () {
                    Actions.methods.upvote_movie(_this.props.data);
                });
            };
            MovieWidget.prototype.downvote = function () {
                var _this = this;
                $.ajax('/movies/' + this.props.data.id, {
                    method: 'PUT', data: { votes: this.props.data.votes - 1 }
                }).then(function () {
                    Actions.methods.downvote_movie(_this.props.data);
                });
            };
            MovieWidget.prototype.render = function () {
                return (li({ className: "list-group-item movie-widget" }, div({ className: 'vote-icons' }, span({ className: "glyphicon glyphicon-menu-up", onClick: this.upvote.bind(this) }), span({ className: "glyphicon glyphicon-menu-down", onClick: this.downvote.bind(this) })), span({ className: 'index' }, this.props.idx), img({ className: 'movie-img', src: this.props.data.img_src }), span({ className: 'title' }, a({ href: this.props.data.url }, this.props.data.title)), span({ className: 'votes' }, this.props.data.votes)));
            };
            return MovieWidget;
        })(react.Component);
        var SearchInput = (function (_super) {
            __extends(SearchInput, _super);
            function SearchInput() {
                _super.call(this);
                this.state = { disabled: false };
            }
            SearchInput.prototype.search = function (event) {
                var _this = this;
                var keyCode = event['keyCode'];
                if (keyCode === 13) {
                    this.setState({ disabled: true });
                    var url = 'http://www.omdbapi.com/';
                    var search_string = event.target['value'];
                    $.ajax(url, { data: { type: 'movie', r: 'json', s: search_string } })
                        .then(function (data) { return Actions.methods.update_search(data); })
                        .done(function () {
                        console.log("Request done");
                        _this.setState({ disabled: false });
                    });
                }
            };
            SearchInput.prototype.render = function () {
                return (div({ id: 'search-box', className: 'input-group', }, input({
                    type: 'text', className: 'form-control', placeholder: 'Search new movie..',
                    onKeyUp: this.search.bind(this), disabled: this.state.disabled
                })));
            };
            return SearchInput;
        })(react.Component);
        var SearchList = (function (_super) {
            __extends(SearchList, _super);
            function SearchList() {
                _super.apply(this, arguments);
            }
            SearchList.prototype.componentDidMount = function () {
                Stores.searchStore.register(Stores.searchStore.EVENTS.CHANGE, this.forceUpdate.bind(this));
            };
            SearchList.prototype.render = function () {
                var results = Stores.searchStore.all()
                    .map(function (entry) { return react.createElement(SearchResultItem, { data: entry, key: entry.imdb_id }); })
                    .slice(0, 5);
                return (ul({ className: 'list-group search-results' }, results));
            };
            return SearchList;
        })(react.Component);
        var SearchResultItem = (function (_super) {
            __extends(SearchResultItem, _super);
            function SearchResultItem() {
                _super.apply(this, arguments);
            }
            SearchResultItem.prototype.add_movie = function () {
                $.ajax('/movies/', { method: 'POST', data: this.props.data.toJSONParams() })
                    .then(function (new_movie) { return Actions.methods.add_movie(new_movie); });
            };
            SearchResultItem.prototype.render = function () {
                return (li({ className: 'list-group-item search-item' }, span({ className: 'search-item-title' }, this.props.data.title), button({ className: 'btn btn-primary btn-sm search-item-btn', onClick: this.add_movie.bind(this) }, 'Add movie')));
            };
            return SearchResultItem;
        })(react.Component);
    })(Views || (Views = {}));
    return Views;
});

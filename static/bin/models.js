define(["require", "exports"], function (require, exports) {
    var Models;
    (function (Models) {
        var Movie = (function () {
            function Movie(api_params) {
                this.id = api_params['id'];
                this.title = api_params['title'];
                this.votes = api_params['votes'];
                this.url = api_params['url'];
                this.imdb_id = api_params['imdb_id'];
                this.img_src = api_params['img_src'];
            }
            return Movie;
        })();
        Models.Movie = Movie;
        var ApiMovie = (function () {
            function ApiMovie(api_params) {
                this.imdb_id = api_params['imdbID'];
                this.title = api_params['Title'];
                this.year = api_params['Year'];
                this.type = api_params['Type'];
            }
            ApiMovie.prototype.toJSONParams = function () {
                return {
                    imdb_id: this.imdb_id,
                    title: this.title
                };
            };
            return ApiMovie;
        })();
        Models.ApiMovie = ApiMovie;
    })(Models || (Models = {}));
    return Models;
});

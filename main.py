#!/usr/bin/env python

import os
import flask
from flask import Flask, request, render_template
from models import Session, Movie

app = Flask(__name__, static_url_path='')

@app.teardown_appcontext
def shutdown_session(exception=None):
    Session.remove()


# ----------------------------------------------------
# Templates
# ----------------------------------------------------

@app.route('/')
def index():
    return render_template('rankings.html')


@app.route('/rankings/')
def rankings():
    return render_template('rankings.html')

# ----------------------------------------------------
# Movie api
# ----------------------------------------------------

@app.route('/movies/', methods=['GET'])
@app.route('/movies/<id>', methods=['GET'])
def get_movie(id=None):
    if id is not None:
        movies = Movie.query.filter(Movie.id == id).scalar().as_dict()
    else:
        movies = [mov.as_dict() for mov in Movie.query.order_by(Movie.votes)]

    return flask.jsonify({'movies': movies})


@app.route('/movies/', methods=['POST'])
def add_movie():
    title = request.form.get('title')
    imdb_id = request.form.get('imdb_id')
    if title:
        movie = Movie(title=title, imdb_id=imdb_id, votes=0)
        Session().add(movie)
        Session().commit()

        return flask.jsonify(movie.as_dict()), 201
    else:
        return "Invalid request", 400


@app.route('/movies/<int:id>', methods=['DELETE'])
def delete_movie(id):
    mov = Movie.query.filter(Movie.id == id).scalar()
    if mov is not None:
        Session().delete(mov)
        Session().commit()
        return flask.jsonify(mov.as_dict()), 200
    else:
        return "Movie not found", 404


@app.route('/movies/<int:movie_id>', methods=['PUT'])
def update_movie(movie_id):
    mov = Movie.query.filter(Movie.id == movie_id).scalar()

    if mov is not None:
        for key, value in request.form.iteritems():
            if hasattr(mov, key):
                setattr(mov, key, value)
        Session().add(mov)
        Session().commit()
        return flask.jsonify(mov.as_dict()), 200

    else:
        return "Id not found: " + str(movie_id), 404


if __name__ == '__main__':
    app.run(debug=True)

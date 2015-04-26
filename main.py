#!/usr/bin/env python

import os
import flask
from flask import Flask, request, render_template
from models import Session, Movie

app = Flask(__name__, static_url_path='')

@app.teardown_appcontext
def shutdown_session(exception=None):
    Session.remove()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/rankings/')
def rankings():
    return render_template('rankings.html')


@app.route('/movie', methods=['GET'])
@app.route('/movie/<id>', methods=['GET'])
def get_movies(id=None):
    if id is not None:
        movies = Movie.query.filter(Movie.id == id).all()
    else:
        movies = [mov.as_dict() for mov in Movie.query.order_by(Movie.votes)]

    return flask.jsonify({'movies': movies})


@app.route('/movie/', methods=['POST'])
def add_movie():
    title = request.form.get('title')
    if title:
        movie = Movie(title=title)
        Session().add(movie)
        Session().commit()
        return flask.jsonify({'title': title}), 201
    else:
        return "Invalid request", 400


if __name__ == '__main__':
    app.run(debug=True)

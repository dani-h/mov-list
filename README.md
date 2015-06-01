# mov-list

####React, Typescript, Flux, Flask experimentation

An attempt to use React together with Typescript. 

This project does not make use of jsx and instead uses React DOM factories, e.g React.DOM.div. It also does not use the usual factory methods for creating
React elements, e.g `react.createClass()`; instead base classes found in the definition file from DefinitelyTyped are extended.

See: 
http://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html - react with es6 classes
https://github.com/borisyankov/DefinitelyTyped/tree/master/react 


The application is similar to a todo-list but with movies. It fetches data from Imdb and stores movies locally using a Flask RESTful api and sqlite3. 
You can upvote/downvote and add new movies. Images are hotlinked from imdb and can't be accesses from other clients than the one running on the host server.

Sample usage:
```
cd $PROJ_ROOT
touch mov.db
./main.py
```

Dependencies:
- Flask
- SQLAlchemy

Various JS libraries found in /static/libs

Access localhost:5000 where the app is running.

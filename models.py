from sqlalchemy import create_engine, MetaData, Column, Integer, String
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

engine = create_engine('sqlite:///mov.db', convert_unicode=True)
Session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

class BaseCls(object):
    @property
    def columns(self):
        # pylint: disable=no-member
        return [col.name for col in self.__table__.columns]

    def as_dict(self):
        return dict([ (col, getattr(self, col)) for col in self.columns])

Base = declarative_base(cls=BaseCls)
# Convenient access to query using MyClass.query, but pylint complains...
Base.query = Session.query_property()


# ---------------------------------------------
# Models
# ---------------------------------------------

class Movie(Base):
    __tablename__ = 'movie'
    id = Column(Integer, primary_key=True)
    imdb_id = Column(String(40))
    title = Column(String(80))
    votes = Column(Integer, default=0)
    url = Column(String(80), default="")

Base.metadata.create_all(bind=engine)

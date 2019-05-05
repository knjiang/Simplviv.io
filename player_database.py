from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker
import json


engine = create_engine('sqlite:///player.db', echo=True)
Base = declarative_base()


class Player(Base):
    __tablename__ = 'players'

    username = Column(String, primary_key=True)
    kills = Column(Integer)
    deaths = Column(Integer)

    def __rper__(self):
        return "<Player(username='%s', kills='%d', deaths='%d')>" % (self.username, self.kills, self.deaths)


Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)


def add_player(playername):
    session = Session()
    if session.query(Player).filter_by(username=playername).count() == 0:
        new_player = Player(username=playername, kills=0, deaths=0)
        session.add(new_player)
    else:
        return -1
    session.commit()


def delete_player(playername):
    session = Session()
    session.delete(playername)
    session.commit()


def delete_all():  # delete all records
    session = Session()
    session.query(Player).delete()
    session.commit()


def add_kills(playername):
    session = Session()
    player = session.query(Player).filter_by(username=playername).first()
    player.kills = player.kills + 1
    session.commit()


def add_deaths(playername):
    session = Session()
    player = session.query(Player).filter_by(username=playername).first()
    player.deaths = player.deaths + 1
    session.commit()


def leaderboard():   #output is a list in json string, the list holds dictionaries with keys{username, kills, deaths} in descending order of kills
    session = Session()
    player_dict = {}
    player_list = []
    for player in session.query(Player).order_by(Player.kills.desc(), Player.deaths).all():
        player_dict["username"] = player.username
        player_dict["kills"] = player.kills
        player_dict["deaths"] = player.deaths
        player_list.append(player_dict)
        player_dict = {}

    return json.dumps(player_list)


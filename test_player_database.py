import unittest
import json
import player_database


class unit_test(unittest.TestCase):
    def test(self):
        player_database.delete_all()
        to_json = player_database.leaderboard()
        self.assertEqual(to_json, json.dumps([]))

        player_database.add_player("player1")
        player_database.add_player("player2")
        player_database.add_player("player3")

        in_json = json.dumps([{'username': "player1", "kills": 0, "deaths": 0}, {'username': "player2", "kills": 0, "deaths": 0}, {'username': "player3", "kills": 0, "deaths": 0}])
        to_json = player_database.leaderboard()
        self.assertEqual(to_json, in_json)

        player_database.add_kills("player2")
        player_database.add_kills("player2")
        player_database.add_deaths("player1")

        in_json = json.dumps([{'username': "player2", "kills": 2, "deaths": 0}, {'username': "player3", "kills": 0, "deaths": 0}, {'username': "player1", "kills": 0, "deaths": 1}])
        to_json = player_database.leaderboard()
        self.assertEqual(to_json, in_json)

        player_database.delete_all()
        to_json = player_database.leaderboard()
        self.assertEqual(to_json, json.dumps([]))


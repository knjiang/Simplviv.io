import unittest
import json
from player_class import player_type


class unit_test(unittest.TestCase):
    def test(self):
        player = player_type("test_player")
        self.assertEqual(player.name, "test_player")
        self.assertEqual(player.hp, 100)

        in_json = json.dumps([25, 25])
        player.update_position(in_json)
        self.assertEqual(player.pos, [25, 25])

        player.kill_some()
        self.assertEqual(player.kills, 1)

        player.get_shot("another")
        self.assertEqual(player.hp, 75)

        player.hit_detection([[25, 25, "another"], [21, 21, "another"]])
        self.assertEqual(player.hp, 50)

        in_json = json.dumps(["test_player", 50, 1, 0, [25, 25]])
        self.assertEqual(player.to_json(), in_json)

        player.get_shot("another")
        player.get_shot("another")
        self.assertEqual(player.hp, 100)
        self.assertNotEqual(player.pos, [25, 25])
        self.assertEqual(player.killed_by, "another")


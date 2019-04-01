import json
import random


class player_class:
    def __init__(self, in_name):
        self.name = in_name
        self.hp = 100
        self.armor = 0
        self.kills = 0
        self.deaths = 0
        self.pos = [random.randint(1, 50), random.randint(1, 50)]
        self.killed_by = ""

    def kill_some(self):
        self.kills = self.kills + 1
        return self.name

    def get_shot(self, killer):
        if self.hp <= 25:
            self.hp = 0
            self.deaths = self.deaths + 1
            self.killed_by = killer
        else:
            self.hp = self.hp - 25
        return self.killed_by

    def update_position(self, in_json):
        pos = json.loads(in_json)
        self.pos[0] = pos.x
        self.pos[1] = pos.y

    def reset_position(self):
        self.pos = (random.randint(1, 50), random.randint(1, 50))

    def to_json(self):
        return json.dumps([self.name, self.hp, self.kills, self.deaths, self.pos])


def sort_key(player):
    return [player.kills, player.deaths]


def output_leaderboard(player_list):    #/input is a list of player_class
    temp_list = player_list.sort(reversed=True, key=sort_key)
    output_list = []
    for i in temp_list:
        output_list.append([i.name, i.kills, i.deaths])

    return json.dumps(output_list)


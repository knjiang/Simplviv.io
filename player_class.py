import json
import random
import math


class player_type:
    def __init__(self, in_name):
        self.name = in_name
        self.hp = 100
        self.kills = 0
        self.deaths = 0
        self.pos = [random.randint(1, 50), random.randint(1, 50)]
        self.killed_by = ""
        self.size = 5

    def kill_some(self):
        self.kills = self.kills + 1
        return self.name

    def get_shot(self, killer):  # parameter killer is a string of the shooter
        if self.hp <= 25:
            self.hp = 100
            self.deaths = self.deaths + 1
            self.killed_by = killer
            self.reset_position()
        else:
            self.hp = self.hp - 25
        return self.killed_by

    def update_position(self, in_json):
        pos = json.loads(in_json)
        self.pos[0] = pos[0]
        self.pos[1] = pos[1]

    def reset_position(self):
        self.pos = (random.randint(1, 50), random.randint(1, 50))

    def hit_detection(self, bullet_list):  # parameter bullet_list is a list containing a list of bullet
        for x in bullet_list:  # the structure of bullet_list is like [[pos_x, pos_y, shooter_name]]
            if math.sqrt((x[0] - self.pos[0]) ** 2 + (x[1] - self.pos[1]) ** 2) <= self.size:
                self.get_shot(x[2])

    def to_json(self):
        return json.dumps([self.name, self.hp, self.kills, self.deaths, self.pos])


def sort_key(player):
    return [player.kills, -player.deaths]


def output_leaderboard(player_list):    #/input is a list of player_class
    temp_list = player_list.sort(reversed=True, key=sort_key)
    output_list = []
    for i in temp_list:
        output_list.append([i.name, i.kills, i.deaths])

    return json.dumps(output_list)


import json
import random

player_list = {}
player_temp = {
    "name": "",
    "hp": 100,
    "armor": 0,
    "speed": 1,
    "weapon": "00",
    "kills": 0,
    "deaths": 0,
    "x_pos": 0,
    "y_pos": 0
}
leaderboard = []
map_x = 100
map_y = 100


def add_player(player_name):  # type\ string
    if player_name in player_list:
        return "name already existed. Please select another name"
    else:
        temp = player_temp
        temp["name"] = player_name
        player_list[player_name] = temp
        spawn_player(player_name)
        leaderboard.append(temp)


def remove_player(player_name):  # type\ string
    player_list.pop(player_name)
    for x in leaderboard:
        if x["name"] == player_name:
            leaderboard.remove(x)
            break


def spawn_player(player_name):  # type\ string
    player_list[player_name]["x_pos"] = random.randint(1, map_x)
    player_list[player_name]["y_pos"] = random.randint(1, map_y)
    player_list[player_name]["hp"] = 100


def hit_detection(player_name, damage, attacker_name):  # type\ string, number, string
    if damage > 0:
        if player_list[player_name]["armor"] >= damage:
            player_list[player_name]["armor"] - player_list[player_name]["armor"] - damage
        else:
            temp_dmg = damage - player_list[player_name]["armor"]
            player_list[player_name]["armor"] = 0
            player_list[player_name]["hp"] = max(player_list[player_name]["hp"] - temp_dmg, 0)
    else:
        if damage < 0:
            max(100, player_list[player_name]["hp"] - damage)

    if player_list[player_name]["hp"] <= 0:
        player_list[attacker_name]["kills"] = player_list[attacker_name]["kills"] + 1
        player_list[player_name]["deaths"] = player_list[player_name]["deaths"] + 1
        spawn_player(player_name)


def sort_key(player):
    return player["kills"]


def refresh_leaderboard():
    if len(leaderboard) != 0:
        leaderboard.sort(reverse=True, key=sort_key)


def player_to_json(player_name):  # type\ string
    return json.dumps(player_list[player_name])


def leaderboard_to_json():
    return json.dumps(leaderboard)

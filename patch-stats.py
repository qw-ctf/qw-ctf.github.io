import json
import sys

statsfile = sys.argv[1]

with open(statsfile) as fd:
    data = json.load(fd)
    
extrastatsfile = statsfile.replace(".json", ".extra.json")
    
with open(extrastatsfile) as fd:
    extra = json.load(fd)


for player_id, team, name in extra["players"]:
    for i, player in enumerate(data["players"]):
        if player["name"] == name:
            player["uid"] = player_id

fragstats = []
for timestamp, diff in extra["frags"]:
    fragstats.append({
        "timestamp": timestamp,
        "red": diff if diff >= 0 else 0,
        "blue": -diff if diff <= 0 else 0
    })
    
data["fragstats"] = fragstats

events = []
for timestamp, player_id, type, count, meta in extra["events"]:
    y = 0
    for frags in fragstats:
        y = max(frags["red"], frags["blue"])
        if frags["timestamp"] > timestamp:
            break
    events.append({
        "timestamp": timestamp,
        "uid": player_id,
        "y": y,
        "type": type,
        "count": count,
        "meta": meta
    })
    
data["events"] = events

with open(statsfile, "w") as fd:
    json.dump(data, fd)
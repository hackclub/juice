# Produced Demand

**Team Members:** 
- Hamza Nasher-Alneam (https://github.com/hnasheralneam)
- Cyril Li (https://github.com/CyrilSLi)
- Jack He (https://github.com/Darkest-Teddy)

**How would you pitch your game in one line?**

A transit system designer with real roads and real passenger distribution.

**What is the key mechanic(s) that make it fun?**

Passengers which spawn randomly according to the population density of the area, in contrast to many games which spawn passengers at stations. This means that players must design their transit system to serve the needs of the population, rather than just connecting stations.

**How does the game actually play? (Core Game Loop)**

The player starts with a small amount of money to draw some initial lines. Transit lines must follow the road grid of the city (provided by OSM), and stations can only be placed on OSM nodes. Passengers spawn randomly according to the population density of the area, walk to the nearest station, pathfind an 'optimal' (will define later) route to the closest station to their destination, and then walk to their destination. Points / money are awarded based on several factors like walking distance, wait time, travel time, number of transfers, etc.

Check out the [Slack canvas](https://hackclub.slack.com/canvas/C07TSCMB4LC) for the previous game idea which we adapted for this event. Most of the ideas in the canvas will persist in this game.

**How will you keep players engaged for 30 minutes? What's the general scope of your game (will change as you go)?**

Like many games in this genre, the map will gradually expand as the game progresses. The map will likely be the greater London area, with the player starting in central London and expanding outwards. There may be plans to add subways as a late-game feature which does not have to conform to the road grid.

# Cooking Craze

## Overview
Cooking Craze is a fun and engaging cooking simulation game where players can interact with various ingredients, cook dishes, and manage their kitchen efficiently. The game features a player character that can move around the kitchen, interact with appliances, and process ingredients.

## Project Structure
The project is organized as follows:

```
Cooking-Craze
├── Godot
│   ├── player.gd               # Player logic for movement and interaction
│   ├── scenes
│   │   ├── player.tscn         # Scene file for the player character
│   │   ├── ingredients.tscn     # Scene file for the ingredients
│   └── scripts
│       ├── player.gd           # Duplicate of player.gd for script organization
│       └── ingredients.gd       # Logic for handling ingredients
├── project.godot                # Main project configuration file
└── README.md                    # Documentation for the project
```

## Features
- **Player Movement**: The player can move in four directions (up, down, left, right) and interact with the environment.
- **Ingredient Processing**: Players can chop and cook ingredients using various appliances in the kitchen.
- **Interactive Tiles**: The game includes interactable tiles that allow players to engage with different kitchen elements.

## Setup Instructions
1. Clone the repository to your local machine.
2. Open the project in Godot Engine.
3. Run the `project.godot` file to start the game.
4. Use the arrow keys to move the player and the "E" key to interact with ingredients and appliances.

## Future Development
- Add more ingredients and recipes.
- Implement a scoring system based on cooking efficiency.
- Enhance graphics and animations for a more immersive experience.

## License
This project is licensed under the MIT License. Feel free to modify and distribute as needed.
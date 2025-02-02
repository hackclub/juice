# Melody Glyphs

## One-Line Pitch
It's like *Rhythm Doctor* meets magical calligraphy, but with dynamic, rhythm-based glyph puzzles that unlock mystical power!

## Overview
Melody Glyphs is a 2D rhythm game developed in Godot where players use precise, gesture-based inputs to "write" magical glyphs in time with original songs. Each successful glyph is a piece of an ancient magic puzzle—the better you perform, the more powerful your spells become and the deeper you unlock the secrets of the enchanted realm.

## Key Mechanics
- **Rhythm-Based Glyph Writing:**  
  - **What It Is:** At key points in each song, abstract glyph shapes appear on-screen. Players must trace these glyphs with accurate strokes that match the timing and direction of the music.
  - **Why It’s Fun:** This mechanic challenges both your sense of rhythm and your precision, creating a satisfying loop where visual artistry meets musical timing.
  - **Interaction with Other Mechanics:**  
    - **Combo System:** Successful glyph writings in quick succession build up a magic combo meter, which in turn boosts scoring and triggers spectacular visual effects.
    - **Dynamic Glyph Variation:** Glyph shapes evolve with the music’s intensity, requiring players to adapt their tracing patterns as the song progresses.
  
- **Multi-Layer Glyph Puzzle Assembly:**  
  - **What It Is:** Each level isn’t just about single glyphs—players must combine multiple glyphs, in the correct sequence, to form a complete magical rune.
  - **Why It’s Important:** This adds a puzzle layer on top of the rhythm challenges. As you trace and collect glyphs, you’re also piecing together a larger pattern that unlocks the level’s magical seal.
  - **Mechanic Interaction:** The quality of your glyph writing (timing, precision, and combo length) affects the overall integrity of the rune, influencing both score and the in-level effects (such as unlocking bonus paths or visual power-ups).

## Core Game Loop
1. **Song Selection & Level Start:**  
   - The level begins with one of our original songs. The background and environmental cues set the stage for a mystical journey.
2. **Glyph Cues Appear:**  
   - As the song plays, glyph outlines appear on screen in sync with musical beats. These cues are timed to challenge your reaction and precision.
3. **Player Input – Trace the Glyph:**  
   - Using mouse or touch input, players must trace the glyph accurately within a narrow timing window. Each successful trace contributes to your combo meter.
4. **Glyph Assembly:**  
   - Successfully traced glyphs gradually reveal parts of a larger magical rune. The order and accuracy of your inputs determine the rune’s final form.
5. **Feedback & Rewards:**  
   - Perfectly executed glyphs light up with magical effects, while building combos triggers bonus scores and unlocks hidden visual effects.
6. **Level Completion:**  
   - Once the entire rune is assembled and the song ends, a final “activation” sequence rewards your performance with a burst of magic—this can unlock bonus content or new levels.

## Sustaining Engagement for 30 Minutes
- **Diverse Song Integration:**  
  - The game will feature several original songs, each with its own unique glyph designs and pacing. This variety keeps gameplay fresh and challenges players to adapt to new rhythmic patterns.
- **Progressive Difficulty:**  
  - Early levels introduce basic glyph shapes and simpler rhythms. As players progress, the glyphs become more intricate, and the timing windows tighten, ensuring a gradual skill curve.
- **Combo and Reward Systems:**  
  - Continuous success builds up a combo meter that not only increases scores but also triggers engaging visual and audio effects. This immediate feedback loop is designed to keep players motivated.
- **Unlockable Content:**  
  - Completing levels with high precision and long combos may unlock secret glyphs, bonus levels, or alternative rune designs, providing long-term goals and replayability.

## Development Notes (Using Godot)
- The game will be developed using the Godot Engine, taking advantage of its 2D capabilities, input event system, and animation tools.
- Custom shaders and particle systems will be used to create the dynamic lighting and magical effects that respond to player performance.
- The input detection system will be finely tuned to capture both the timing and the precision of the player’s gesture, ensuring that the rhythm and calligraphy aspects merge seamlessly.
   

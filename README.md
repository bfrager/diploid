# diploid

### Javascript-based Team Game

A two-player cooperative game, where incoming obstacles must be dodged to earn a high score. Rather than competing against an opponent, players must work together and coordinate path routes to stay alive.

Each player steers their orb to avoid hitting incoming obstacles. The player's orbs are linked together by a beam that must also stay out of the path of incoming obstacles. Each collision takes players' health down, and if a player's health reaches 0, the other player wins.

### Controls

Player 1 moves their orb up, left, down, and right with the W,A,S,D keys respectively.

Player 2 moves their orb up, left, down, and right with the arrow keys respectively.

Spacebar to start, or restart.

![alt tag](https://github.com/philuchansky/diploid/blob/master/mockup/diploidMockup01.png)

## To Play
Visit [http://philuchansky.github.io/diploid/](http://philuchansky.github.io/diploid/) to play, or simply download a .zip of this repo and open index.html in your browser.

### Development process
Technologies used: HTML / CSS / Javascript + JQuery

By creating a 'block' and 'player' objects in Javascript, the game is able to randomly generate obstacles with their own collision detection, that spontaneously regenerate and 'destroy' themselves once they leave the screen to try and keep memory usage down.

JQuery and CSS transitions allow for all of the animations to remain fluid, although it's possible that CPU usage can still be high since the game isn't optimized for performace.

### Not-Yet-Implemented
- self-increasing difficulty. Currently set to low difficulty and the game does not gradually become harder yet.
- Sound FX
- Detailed orb artwork/design
 

# User Stories

As a player, I have the option of playing the game without a partner, so that I can enjoy it solo when there's no-one to play with.

As a player, I can control the game with one hand so that another player can be sitting at the same keyboard to play simultanously and comfortably.

As a player, when losing the game, I'm prompted to play again with a single keystroke so that I can start over without having to refresh the page, and so that I can take my time in starting over.

As a player, I experience collision detection with the bounds of the game window, so that my orb(s) doesn't get lost off-screen.

### Future implementations

As a player, I can enter my name before playing, so that the experience of scoring high is more personalized on-screen.

As a player, I can share my score on major social networks to get friends interested in playing the game.

/// <reference path="../node_modules/phaser/typescript/phaser.d.ts"/>
/// <reference path="../node_modules/phaser/typescript/pixi.d.ts"/>

import 'pixi'
import 'p2'
import * as Phaser from 'phaser'

import Boot from './scenes/boot'
import Preloader from './scenes/preloader'
import Gameplay from './scenes/gameplay'

export class Application {
  game: Phaser.Game;
  logo: Phaser.Sprite;
  cursors: Phaser.CursorKeys;

  constructor() {
    this.game = new Phaser.Game(600, 600, Phaser.AUTO, "content", this);
    this.game.state.add('Boot', Boot, false)
    this.game.state.add('Preloader', Preloader, false)
    this.game.state.add('Gameplay', Gameplay, false)
    this.game.state.start('Boot')
  }
}

window.onload = () => {
  const game = new Application();
};
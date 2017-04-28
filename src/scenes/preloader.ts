import * as Phaser from 'phaser';

import * as Assets from '../assets'
import * as Lasers from '../lasers'

var AssetData = require("json!../assets/assets.json")

export default class Preloader extends Phaser.State {

    preloadBar: Phaser.Sprite;

    preload() {
        this.preloadBar = this.add.sprite(100, 250, 'preloadBar');
        this.load.setPreloadSprite(this.preloadBar);
        Assets.LoadAssetType(AssetData, "assets/images", (k: string, v: string): Phaser.Loader => { return this.load.image(k, v) })
    }
    create() {
        var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.startSplash, this);
    }

    startSplash() {
        this.game.state.start('Gameplay', true, false);
    }
}

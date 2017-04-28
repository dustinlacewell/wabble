import * as Phaser from 'phaser';

import * as Utility from '../utility'
import * as Backgrounds from '../backgrounds'
import * as Player from '../player'
import * as Lasers from '../lasers'
import Glob from '../glob'

var AssetData = require("json!../assets/assets.json")

const PLAYER_SPEED = 0.25
const PLAYER_GLOBULE_WEIGHT = 0.08
const PLAYER_BASE_GLOBULES = 0
const PLAYER_MIN_SPEED = 0.07
const LASER_SPEED = .4
const TRANSITION_SPEED = 10000

export default class Gameplay extends Phaser.State {

    background: Backgrounds.BackgroundChanger
    player: Player.Player
    glob: Glob
    cursors: Phaser.CursorKeys
    lasers: Lasers.LaserManager

    setupBackground() {
        let images = AssetData["assets/images"]
        let backgrounds = images["backgrounds"]
        let keys = new Array<string>()
        for (let key of backgrounds) {
            keys.push(`backgrounds/${key}`)
        }

        let transition = Backgrounds.backgroundFadeTransition(TRANSITION_SPEED)
        this.background = new Backgrounds.BackgroundChanger(this.game, transition, keys, 5)
        this.background.doTransition()
    }

    setupPlayer() {
        let glob = new Glob(this.game.add.sprite(this.game.width / 2.0, this.game.height / 2.0, "blob/blob.png"), 8)
        this.player = new Player.Player(
            this.game, glob, PLAYER_BASE_GLOBULES, PLAYER_GLOBULE_WEIGHT, PLAYER_SPEED, PLAYER_MIN_SPEED, this.cursors)
    }

    setupGlob() {
        this.glob = new Glob(this.game.add.sprite(this.game.width / 2.0, this.game.height / 2.0, "blob/blob.png"), 8)
        this.glob.addGlobule()
        this.glob.addGlobule()
        this.glob.addGlobule()
        this.glob.addGlobule()
        this.glob.sprite.tint = 0xe396ff
        for (let globule of this.glob.globules) {
            globule.sprite.tint = 0xe396ff
        }
    }

    setupLasers() {
        this.lasers = new Lasers.LaserManager(this.game, "laser", LASER_SPEED)
    }

    create() {
        Lasers.generateLaserBitmap(this.game, 32, 4)
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.setupBackground()
        this.cursors = this.game.input.keyboard.createCursorKeys()
        this.setupPlayer()
        this.setupGlob()
        this.setupLasers()
    }

    update() {
        let dt = this.game.time.elapsedMS
        this.player.update(dt)
        this.glob.update(dt)
        this.lasers.update(dt)

        let gotGlob = this.glob.checkOverlap(this.player.glob.sprite)
        if (gotGlob) {
            this.player.glob.addGlobule()
            this.glob.setPosition(Math.random() * this.game.width, Math.random() * this.game.height)
            this.lasers.makeLaser()
        }
    }

}



import Glob from './glob'
import { normalizeDirection, Point } from './utility'

export class Player {
    game: Phaser.Game
    glob: Glob
    baseGlobs: number
    globWeight: number
    speed: number
    minSpeed: number
    cursors: Phaser.CursorKeys

    constructor(
        game: Phaser.Game,
        glob: Glob,
        baseGlobs: number,
        globWeight: number,
        speed: number,
        minSpeed: number,
        cursors: Phaser.CursorKeys
    ) {
        this.game = game
        this.glob = glob
        this.globWeight = globWeight
        this.baseGlobs = baseGlobs
        this.speed = speed
        this.minSpeed = minSpeed
        this.cursors = cursors
        console.log(baseGlobs)
        for (let i = 0; i < baseGlobs; i++) {
            this.glob.addGlobule()
        }
    }

    get realSpeed(): number {
        let overflow = this.glob.globules.length - this.baseGlobs
        let cost = overflow * this.globWeight
        let speed = this.speed - (this.speed * cost)
        return Math.max(this.minSpeed, speed)
    }

    calculateDirection(): Point {
        let direction = { x: 0, y: 0 }

        if (this.cursors.left.isDown) {
            direction.x = -1
        } else if (this.cursors.right.isDown) {
            direction.x = 1
        }

        if (this.cursors.up.isDown) {
            direction.y = -1
        } else if (this.cursors.down.isDown) {
            direction.y = 1
        }
        return direction
    }

    update(dt: number) {
        let direction = this.calculateDirection()
        normalizeDirection(direction)
        if (direction.x || direction.y) {
            let realSpeed = this.realSpeed
            console.log(realSpeed)
            this.glob.movePosition(
                direction.x * dt * this.realSpeed,
                direction.y * dt * this.realSpeed)
        }
        this.glob.update(dt)
    }

}
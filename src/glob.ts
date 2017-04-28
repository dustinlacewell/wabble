
import * as Utility from './utility'

class Globule {
    sprite: Phaser.Sprite
    dx: number
    dy: number
    limit: number
    maxSpeed: number
    minSpeed: number
    speed: number


    constructor(sprite: Phaser.Sprite, limit: number, minSpeed: number, maxSpeed: number) {
        this.sprite = sprite
        this.dx = Math.random() * 2.0 - 1.0
        this.dy = Math.random() * 2.0 - 1.0
        this.limit = limit
        this.speed = maxSpeed
        this.maxSpeed = maxSpeed
        this.minSpeed = minSpeed
    }

    update(dt: number, root_x: number, root_y: number) {
        // decay speed
        this.speed = Math.max(this.minSpeed, this.speed * 0.975)
        // invert motion at limit
        if (Math.abs(root_x - this.sprite.x) >= this.limit) {
            let leftBounce = this.sprite.x < root_x && this.dx < 0
            let rightBounce = this.sprite.x > root_x && this.dx > 0

            if (leftBounce || rightBounce) {
                this.dx = -1.0 * this.dx
            }
        }

        if (Math.abs(root_y - this.sprite.y) >= this.limit) {
            let topBounce = this.sprite.y < root_y && this.dy < 0
            let bottomBounce = this.sprite.y > root_y && this.dy > 0
            if (topBounce || bottomBounce) {
                this.dy *= -1.0
            }
        }

        // update position
        this.sprite.x += this.dx * this.speed * dt
        this.sprite.y += this.dy * this.speed * dt


        if (this.dx > 0) {
            let off = Utility.randomBetween(-(this.speed / 2.0), this.speed)
            this.dx = Math.min(this.dx + off, this.speed)
        } else {
            let off = Utility.randomBetween(-this.speed, this.speed - 2.0)
            this.dx = Math.max(this.dx + off, -this.speed)
        }

        if (this.dy > 0) {
            let off = Utility.randomBetween(-(this.speed / 2.0), this.speed)
            this.dy = Math.min(this.dy + off, this.speed)
        } else {
            let off = Utility.randomBetween(-this.speed, this.speed - 2.0)
            this.dy = Math.max(this.dy + off, -this.speed)
        }
    }
}

export default class Glob {
    sprite: Phaser.Sprite
    maxBlobules: number = 25
    globules: Array<Globule>
    radius: number

    constructor(sprite: Phaser.Sprite, radius: number) {
        this.radius = radius
        this.globules = new Array<Globule>()
        this.sprite = sprite
        this.sprite.game.physics.arcade.enable(sprite)
    }

    addGlobule(): Globule {
        let sprite = this.sprite.game.add.sprite(this.sprite.x, this.sprite.y, this.sprite.key)
        let globule = new Globule(sprite, this.radius, 0.08, 0.25)
        this.globules.push(globule)
        return globule
    }

    setPosition(x: number, y: number) {
        this.sprite.x = x
        this.sprite.y = y
        for (let globule of this.globules) {
            globule.sprite.x = x
            globule.sprite.y = y
        }
    }

    movePosition(dx: number, dy: number) {
        this.sprite.x += dx
        this.sprite.y += dy
        for (let globule of this.globules) {
            globule.sprite.x += dx
            globule.sprite.y += dy
            globule.speed = globule.maxSpeed
        }
    }

    checkOverlap(other: Phaser.Sprite): boolean {
        for (let globule of this.globules) {
            if (Utility.checkOverlap(globule.sprite, other)) {
                return true
            }
        }
        return false
    }

    update(dt: number) {
        for (let glob of this.globules) {
            glob.update(dt, this.sprite.x, this.sprite.y)
        }
    }

}
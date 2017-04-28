export function generateLaserBitmap(game: Phaser.Game, w: number, h: number) {
    let bmd = game.add.bitmapData(w, h)
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            let r = Math.random() * 75 + 125
            bmd.setPixel(x, y, r, 0, 0)
        }
    }
    game.cache.addBitmapData("laser", bmd)
}

export class Laser {
    game: Phaser.Game
    sprite: Phaser.Sprite
    dx: number
    dy: number
    maxX: number
    maxY: number

    constructor(game: Phaser.Game, sprite: Phaser.Sprite, dx: number, dy: number) {
        this.game = game
        this.sprite = sprite
        this.dx = dx
        this.dy = dy
        this.maxX = game.width - sprite.width
        this.maxY = game.height - sprite.height
    }

    update(dt: number) {
        this.sprite.x += this.dx * dt
        this.sprite.y += this.dy * dt

        if (this.sprite.x <= 0) {
            this.sprite.x = 0;
            this.dx *= -1.0
        } else if (this.sprite.x >= this.maxX) {
            this.sprite.x = this.maxX
            this.dx *= -1.0
        }

        if (this.sprite.y <= 0) {
            this.sprite.y = 0
            this.dy *= -1.0
        } else if (this.sprite.y >= this.maxY) {
            this.sprite.y = this.maxY
            this.dy *= -1.0
        }
    }
}

export class LaserManager {
    game: Phaser.Game
    lasers: Array<Laser>
    spriteKey: string
    speed: number

    constructor(game: Phaser.Game, key: string, speed: number) {
        this.game = game
        this.spriteKey = key
        this.lasers = new Array<Laser>()
        this.speed = speed
    }

    makeLaser(): Laser {
        let x = 0
        let y = 0
        let dx = 0
        let dy = 0
        let angle = 0
        if (Math.random() <= 0.5) {
            y = Math.random() * this.game.height
            dx = 1.0
        } else {
            x = Math.random() * this.game.width
            dy = 1.0
            angle = 90
        }

        let bmp = this.game.cache.getBitmapData(this.spriteKey)
        let sprite = this.game.add.sprite(x, y, bmp)
        let laser = new Laser(this.game, sprite, dx, dy)
        laser.sprite.angle = angle
        this.lasers.push(laser)
        return laser
    }

    update(dt) {
        for (let laser of this.lasers) {
            laser.update(dt * this.speed)
        }
    }
}

function tweenForSprite(target: Phaser.Sprite): Phaser.Tween {
    let tween = new Phaser.Tween(target, target.game, target.game.tweens)
    target.game.tweens.add(tween)
    return tween
}

function tweenForSpriteScale(target: Phaser.Sprite): Phaser.Tween {
    let tween = new Phaser.Tween(target.scale, target.game, target.game.tweens)
    target.game.tweens.add(tween)
    return tween
}

class TweenJoin {
    callback: () => void
    context: any
    tweens: Array<Phaser.Tween>
    waiting: number
    constructor(tweens: Phaser.Tween[]) {
        this.tweens = tweens
        this.waiting = tweens.length
        for (let tween of tweens) {
            tween.onComplete.addOnce(() => {
                this.waiting -= 1
                if (this.waiting == 0) {
                    this.callback.apply(this.context)
                }
            })
        }
    }

    then(callback: () => void, context: any) {
        this.callback = callback
        this.context = context
    }
}

interface BackgroundTransition {
    (primary: Phaser.Sprite, secondary: Phaser.Sprite): Array<Phaser.Tween>
}

export class BackgroundChanger {
    readonly game: Phaser.Game
    primary: Phaser.Sprite
    secondary: Phaser.Sprite
    readonly backgrounds: Array<string>
    transition: BackgroundTransition
    delay: number

    constructor(game: Phaser.Game, transition:BackgroundTransition, backgrounds: Array<string>, delay: number) {
        if (backgrounds.length < 2) {
            throw new Error("BackgroundChanger needs at least 2 image keys.")
        }

        this.transition = transition
        this.backgrounds = backgrounds
        this.game = game
        this.primary = this.makeSprite(this.primaryKey)
        this.secondary = this.makeSprite(this.secondaryKey)
        this.delay = delay
        this.order()
    }

    get primaryKey(): string {
        return this.backgrounds[0]
    }

    get secondaryKey(): string {
        return this.backgrounds[1]
    }

    makeSprite(key: string): Phaser.Sprite {
        let sprite = this.game.add.sprite(this.game.width / 2.0, this.game.height / 2.0, key)
        sprite.pivot.x = sprite.width / 2.0
        sprite.pivot.y = sprite.height / 2.0
        return sprite
    }

    order() {
        this.primary.sendToBack()
        this.secondary.sendToBack()
    }

    rotate() {
        let head = this.backgrounds.shift()
        this.backgrounds.push(head)
    }

    swap() {
        this.primary.destroy()
        this.primary = this.secondary
        this.secondary = this.makeSprite(this.secondaryKey)
        this.game.time.events.add(Phaser.Timer.SECOND * this.delay, this.doTransition, this);
        this.order()
    }

    doTransition() {
        this.rotate()
        let tweens = new TweenJoin(this.transition(this.primary, this.secondary))
        tweens.then(this.swap, this)
    }

}

function fadeTransition(target: Phaser.Sprite, duration: number, alpha: number): Phaser.Tween {
    return tweenForSprite(target).to({ alpha: alpha }, duration).start()
}

function spinTransition(target: Phaser.Sprite, duration: number, angle: number): Phaser.Tween {
    return tweenForSprite(target).to({ angle: angle }, duration).start()
}

function scaleTransition(target: Phaser.Sprite, duration: number, scale: number): Phaser.Tween {
    return tweenForSpriteScale(target).to({ x: scale, y: scale }, duration).start()
}

export function backgroundFadeTransition(duration: number): BackgroundTransition {
    return (primary: Phaser.Sprite, secondary: Phaser.Sprite): Array<Phaser.Tween> => {
        return [fadeTransition(primary, duration, 0)]
    }
}

export function backgroundSpinTransition(duration: number, angle: number): BackgroundTransition {
    return (primary: Phaser.Sprite, secondary: Phaser.Sprite): Array<Phaser.Tween> => {
        return [spinTransition(primary, duration, angle)]
    }
}

export function backgroundScaleTransition(duration: number, scale: number): BackgroundTransition {
    return (primary: Phaser.Sprite, secondary: Phaser.Sprite): Array<Phaser.Tween> => {
        return [scaleTransition(primary, duration, scale)]
    }
}

export function backgroundSpinFadeTransition(duration: number, angle: number): BackgroundTransition {
    return (primary: Phaser.Sprite, secondary: Phaser.Sprite): Array<Phaser.Tween> => {
        return [spinTransition(primary, duration, angle), fadeTransition(primary, duration, 0)]
    }
}

export function backgroundScaleFadeTransition(duration: number, scale: number): BackgroundTransition {
    return (primary: Phaser.Sprite, secondary: Phaser.Sprite): Array<Phaser.Tween> => {
        return [scaleTransition(primary, duration, scale), fadeTransition(primary, duration, 0)]
    }
}

export function backgroundComboTransition(duration: number, scale: number, angle: number): BackgroundTransition {
    return (primary: Phaser.Sprite, secondary: Phaser.Sprite): Array<Phaser.Tween> => {
        return [
            spinTransition(primary, duration, angle),
            scaleTransition(primary, duration, scale),
            fadeTransition(primary, duration, 0)
        ]
    }
}

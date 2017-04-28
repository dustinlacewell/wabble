export interface Point {
    x: number
    y: number
}

export function checkOverlap(a: Phaser.Sprite, b: Phaser.Sprite): boolean {

    let ba = a.getBounds();
    let bb = b.getBounds();

    return Phaser.Rectangle.intersects(
        new Phaser.Rectangle(ba.x, ba.y, ba.width, ba.height),
        new Phaser.Rectangle(bb.x, bb.y, bb.width, bb.height),
    )
}

export function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

export function normalizeDirection(direction: Point) {
    let length = (Math.pow(direction.x, 2) + Math.pow(direction.y, 2)) ** 0.5
    if (length > 0) {
        direction.x = direction.x / length
        direction.y = direction.y / length
    } else {
        direction.x = 0
        direction.y = 0
    }
}



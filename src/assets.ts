import * as Phaser from 'phaser';

export function LoadAssetType(assetPack: Object, rootPath: string, loader: (path: string, url?: string) => Phaser.Loader) {
    if (assetPack.hasOwnProperty(rootPath)) {
        let assets = assetPack[rootPath]
        for (let group in assets) {
            let files = assets[group]
            for (let file of files) {
                let key = `${group}/${file}`
                loader(key, `${rootPath}/${key}`)
            }
        }
    }
}
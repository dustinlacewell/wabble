import * as Phaser from 'phaser';


export default class Boot extends Phaser.State {
    preload() {
        this.load.image('preloadBar', 'assets/images/loader.png');
    }

    create() {
        // don't need multitouch
        this.input.maxPointers = 1;

        // don't pause on focus loss
        this.stage.disableVisibilityChange = false;

        if (this.game.device.desktop) {
            //  If you have any desktop specific settings, they can go in here
        }
        else {
            //  Same goes for mobile settings.
        }

        this.game.state.start('Preloader', true, false);
    }
}
